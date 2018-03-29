#!/usr/bin/env python
# -*- coding: utf-8 -*- 
import sys
reload(sys)
sys.setdefaultencoding("utf-8")
import os
import random
from datetime import datetime
import json

from flask_script import Manager, Shell
from flask_migrate import Migrate, MigrateCommand
from flask_bootstrap import Bootstrap
#from flask.ext.sqlalchemy import SQLAlchemy
from flask_moment import Moment

from flask import Flask, render_template, session, redirect, url_for, current_app, \
    abort, flash, request, make_response, g
from flask_wtf import Form
from wtforms import StringField, SubmitField, HiddenField

from forms import WorkerInfoForm, TestForm, LoginForm
from models import db, ExpResult
from config import config

#app = create_app(os.getenv('FLASK_CONFIG') or 'default')

CONFIG_NAME = 'production'
CONFIG_NAME = 'development'

app = Flask(__name__)

app.config.from_object(config[CONFIG_NAME])
config[CONFIG_NAME].init_app(app)

db.init_app(app)

bootstrap = Bootstrap(app)
manager = Manager(app)
migrate = Migrate(app, db)

def make_shell_context():
    return dict(app=app, db=db, ExpResult=ExpResult)

manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)


@app.route('/exp/end')
def end_page():
    session.clear()
    return make_response('<h1>Complete! Thank you!</h1>')


@app.route('/exp/start', methods=["GET", "POST"])
def start_page():
    #nextpage的格式是 实验名称_mode
    nextpage = request.args.get('next', None)

    if nextpage is None:
        return redirect(url_for('end_page'))
    
    form = WorkerInfoForm()
    if form.validate_on_submit():
        test_name, mode = nextpage.split('_')
        if mode <> 't':
            exp_result = ExpResult.query.filter_by(worker_id=form.workerid.data)\
                            .filter_by(test_name = test_name)\
                            .filter_by(test_mode = mode)\
                            .first()
            if exp_result is not None:
                return redirect(url_for('end_page'))


            exp_result = ExpResult(name = form.name.data,
                                   worker_id = form.workerid.data,
                                   screen_size = form.screen_size.data,
                                   screen_resolution_h = form.screen_resolution_h.data,
                                   screen_resolution_w = form.screen_resolution_w.data
                                )
            db.session.add(exp_result)
            db.session.commit()

            session['workerid'] = form.workerid.data
            session['expid'] = exp_result.id
        else:
            session['expid'] = -1

        return redirect(url_for(test_name, m=mode))
    else:
        return render_template('info.html', form=form, pagetitle='Info')


@app.route('/exp/w', methods=["GET", "POST"])
def words():
    #  mode 对应两种模式
    #  i 直觉  r 理智
    mode = request.args.get('m','i')
    test_name = 'words'
    return exp(test_name, pagetitle=u'word cate')


@app.route('/exp/c', methods=["GET", "POST"])
def circle():
    mode = request.args.get('m','i')
    test_name = 'circle'
    return exp(test_name, pagetitle=u'circle')


@app.route('/exp/l', methods=["GET", "POST"])
def line():
    mode = request.args.get('m','i')
    test_name = 'line'
    return exp(test_name, pagetitle=u'line')


def exp(test_name, pagetitle, template_name=None):
    #  mode 对应两种模式
    #  i 直觉  r 理性  t 测试
    mode = request.args.get('m','i')
    if template_name is None:
        template_name = test_name+'.html'
    if 'expid' not in session:
        return redirect(url_for('start_page', next=test_name+'_'+mode))
    else:
        expid = session['expid']

        sqr_size = 300

        if mode == 't':
            return pro_exp(pagetitle, template_name, 300)

        exp_result = ExpResult.query.filter_by(id=expid).first()

        if exp_result is None:
            return redirect(url_for('start_page', next=test_name+'_'+mode))
        
        if exp_result.test_data is not None:
            return make_response('<h1>You have finished this test! Thank you!</h1>')

        form = TestForm()
        if form.validate_on_submit():
            exp_result.test_name = test_name
            exp_result.test_mode = mode
            exp_result.test_data = form.result.data

            db.session.add(exp_result)
            db.session.commit()

            return redirect(url_for('end_page'))
        else:
            if mode == 'i':
                mode = u'mode.intu'
            elif mode == 'r':
                mode = u'mode.ret'

            if test_name == 'line':
                #window.screen.width * 3.5377 / screen_m
                sqr_size = round(exp_result.screen_resolution_w * 3.5377 / exp_result.screen_size)

            return render_template(template_name, form=form, mode=mode, pagetitle=pagetitle, sqr_size=sqr_size)

def pro_exp(pagetitle, template_name, sqr_size):
    form = TestForm()
    if form.validate_on_submit():
        return redirect(url_for('end_page'))
    else:
        return render_template(template_name, form=form, mode=u'mode.intu', pagetitle=pagetitle, sqr_size=sqr_size)


@app.route('/manage', methods=["GET", "POST"])
def manage_download_result():
    if session.get('login_count'):
        session['login_count'] += 1
    else:
        session['login_count'] = 0

    if session['login_count'] > 5:
        return '<h1>建设中....</h1>'

    form = LoginForm()
    if form.validate_on_submit():
        if(form.name.data == 'admin' and form.passwd.data == 'cscn@psy2015'):
            session['login_count'] = 0
            result_content = u'"ID","TYPE","NAME","WORKERID","self_dist","family_dist","friend_dist","zuma_dist","stone_dist","like_dist","dislike_dist","circle_center","self_point","family_point","friend_point","zuma_point","stone_point","like_point","dislike_point","start_time","submit_time"\n';

            response = make_response(result_content)
            response.headers["Content-Disposition"] = "attachment; filename=result.csv"
            return response
        else:
            flash(u'用户名或者密码错误')

    return render_template('login.html', form=form)


if __name__ == "__main__":
    manager.run()
