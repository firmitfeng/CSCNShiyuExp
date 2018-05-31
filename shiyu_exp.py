#!/usr/bin/env python
# -*- coding: utf-8 -*- 
import sys
reload(sys)
sys.setdefaultencoding("utf-8")
import os
import random
from datetime import datetime
import json
from functools import wraps

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


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'expid' in session:
            return f(*args, **kwargs)
        else:
            return redirect(url_for('info_page', test_name=kwargs['test_name'], mode=kwargs['mode']))
    return decorated_function 


@app.route('/exp/end')
def end_page():
    session.clear()
    return make_response('<h1>Complete! Thank you!</h1>')


#mode 取值 i, r
@app.route('/exp/<string:test_name>/<string:mode>/', methods=["GET", "POST"])
@login_required
def exp_index_page(test_name, mode):

    template_name = test_name+'.html'
    
    expid = session['expid']

    exp_result = ExpResult.query.filter_by(id=expid).first()

    if exp_result is None:
        return redirect(url_for('info_page', test_name=test_name, mode=mode))

    if test_name == u'fishball':
        return fishball(mode)

    if test_name == u'line':
        return line(mode)

    if exp_result.test_data is not None:
        return make_response('<h1>You have finished this test! Thank you!</h1>')

    form = TestForm()
    if form.validate_on_submit():
        exp_result.test_name = test_name
        exp_result.test_mode = mode
        exp_result.test_data = form.result.data
        exp_result.submit_time = datetime.utcnow()

        db.session.add(exp_result)
        db.session.commit()

        return redirect(url_for('end_page'))
    else:
        if mode == 'i':
            mode = u'mode.intu'
        elif mode == 'r':
            mode = u'mode.ret'

        return render_template(template_name, form=form, mode=mode)


@app.route('/exp/<string:test_name>/<string:mode>/info.html', methods=["GET", "POST"])
def info_page(test_name, mode):
    # #nextpage的格式是 实验名称_mode
    # nextpage = request.args.get('next', None)

    # if nextpage is None:
    #     return redirect(url_for('end_page'))
    if test_name not in ['words', 'line', 'fishball', 'circle'] or \
       mode not in ['i', 'r']:
        session.clear()
        return make_response('<h1>The test is not found. Thank you.</h1>')

    form = WorkerInfoForm()
    if form.validate_on_submit():
        
        exp_result = ExpResult.query.filter_by(worker_id=form.workerid.data)\
                        .filter_by(test_name = test_name)\
                        .filter_by(test_mode = mode)\
                        .first()
        if exp_result is not None:
            return redirect(url_for('end_page'))


        exp_result = ExpResult(name = form.name.data,
                               worker_id = form.workerid.data,
                               gender = form.gender.data,
                               race = form.race.data,
                               religion = form.religion.data,
                               screen_size = form.screen_size.data,
                               screen_resolution_h = form.screen_resolution_h.data,
                               screen_resolution_w = form.screen_resolution_w.data
                            )
        db.session.add(exp_result)
        db.session.commit()

        session['workerid'] = form.workerid.data
        session['expid'] = exp_result.id
        session['gender'] = form.gender.data
        
        #session['sqr_size'] = round(float(form.screen_resolution_w.data) * 3.5377 / float(form.screen_size.data))
        session['sqr_size'] = round(float(form.screen_resolution_w.data) * 1.17925 / float(form.screen_size.data))

        if test_name == u'line':
            if random.randint(0,1):
                session['line_mode'] = 'abs'
            else:
                session['line_mode'] = 'rel'


        return redirect(url_for('practice', test_name=test_name, mode=mode))
    else:
        form.screen_size.data = 23
        return render_template('info.html', form=form, pagetitle='Info')


@app.route('/exp/<string:test_name>/<string:mode>/practice.html', methods=["GET", "POST"])
def practice(test_name, mode):
    practice_page = test_name+'_practice.html'

    if test_name == 'line':
        return redirect(url_for('line_practice', mode=mode))

    return render_template(practice_page, test_name=test_name, mode=mode)


@app.route('/exp/line/<string:mode>/practice.html', methods=["GET", "POST"])
def line_practice(mode):
    practice_page = "{}_{}_practice.html".format('line', session['line_mode'])

    return render_template(practice_page, test_name='line', mode=mode, sqr_size=session['sqr_size'])


def line(mode):
    test_name = 'line'

    expid = session['expid']

    if 'line_count' not in session:
        session['line_count'] = 0

    form = TestForm()
    if form.validate_on_submit():

        if session['line_count'] != 0:
            temp_result = ExpResult.query.filter_by(id=expid).first()

            exp_result = ExpResult(name = temp_result.name,
                                   worker_id = temp_result.worker_id,
                                   gender = temp_result.gender,
                                   race = temp_result.race,
                                   religion = temp_result.religion,
                                   screen_size = temp_result.screen_size,
                                   screen_resolution_h = temp_result.screen_resolution_h,
                                   screen_resolution_w = temp_result.screen_resolution_w
                                )
        else:
            exp_result = ExpResult.query.filter_by(id=expid).first()

        exp_result.test_name = '{}_{}'.format(test_name, session['line_mode'])
        exp_result.test_mode = mode
        exp_result.test_data = form.result.data
        exp_result.submit_time = datetime.utcnow()

        db.session.add(exp_result)
        db.session.commit()

        session['line_count'] += 1
        if session['line_mode'] == 'abs':
            session['line_mode'] = 'rel'
        else:
            session['line_mode'] = 'abs'

        if session['line_count'] < 2:
            return render_template('pause.html', next=url_for('line_practice', mode=mode), pagetitle=u'Rest a while.')
        else:
            return redirect(url_for('end_page'))

    else:
        if mode == 'i':
            mode = u'mode.intu'
        elif mode == 'r':
            mode = u'mode.ret'

        page = 'line_{}.html'.format(session['line_mode'])

        return render_template(page, form=form, mode=mode, sqr_size=session['sqr_size'])


def fishball(mode):
    test_name = 'fishball'

    expid = session['expid']

    if 'fishball_count' not in session:
        session['fishball_count'] = 0

    form = TestForm()
    if form.validate_on_submit():

        if session['fishball_count'] != 0:
            temp_result = ExpResult.query.filter_by(id=expid).first()

            exp_result = ExpResult(name = temp_result.name,
                                   worker_id = temp_result.worker_id,
                                   gender = temp_result.gender,
                                   race = temp_result.race,
                                   religion = temp_result.religion,
                                   screen_size = temp_result.screen_size,
                                   screen_resolution_h = temp_result.screen_resolution_h,
                                   screen_resolution_w = temp_result.screen_resolution_w
                                )
        else:
            exp_result = ExpResult.query.filter_by(id=expid).first()

        exp_result.test_name = '{}_{}'.format(test_name, session['fishball_count'])
        exp_result.test_mode = mode
        exp_result.test_data = form.result.data
        exp_result.submit_time = datetime.utcnow()

        db.session.add(exp_result)
        db.session.commit()

        session['fishball_count'] += 1

        if session['fishball_count'] < 3:
            return render_template('pause.html', next=url_for('exp_index_page', test_name=test_name, mode=mode), pagetitle=u'Rest a while.')
        else:
            return redirect(url_for('end_page'))

    else:
        if mode == 'i':
            mode = u'mode.intu'
        elif mode == 'r':
            mode = u'mode.ret'

        return render_template('fishball.html', form=form, mode=mode)



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
        if(form.name.data == 'admin' and form.passwd.data == 'cscn@psy2018'):
            session['login_count'] = 0
            result_content = u'"ID","NAME","WORKERID","screen_size", "screen_resolution_w", "screen_resolution_h", \
                                "test_name", "test_mode", "submit_time", "test_data"\n';
            results = ExpResult.query.all()

            fields = ['id', 'name', 'worker_id', \
                      'screen_size', 'screen_resolution_w', 'screen_resolution_h',\
                      'test_name', 'test_mode', 'submit_time', \
                      'test_data']

            for result in results:
                temp_list = []
                for field in fields:
                    temp_list.append(str(getattr(result, field)))
                result_content += u','.join(temp_list)
                result_content += u'\n'

            response = make_response(result_content)
            response.headers["Content-Disposition"] = "attachment; filename=result.csv"
            return response
        else:
            flash(u'用户名或者密码错误')

    return render_template('login.html', form=form)


if __name__ == "__main__":
    manager.run()
