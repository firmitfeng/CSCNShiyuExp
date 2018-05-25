#-*- coding:utf-8 -*-
from flask_wtf import Form
from wtforms import StringField, TextAreaField, HiddenField, SubmitField, PasswordField, RadioField
from wtforms.widgets import TextArea
from wtforms.validators import Required

class LabelRadioField(RadioField):
    pass


class WorkerInfoForm(Form):
	name = StringField(u'name', validators=[Required()])
	workerid = StringField(u'worker id', validators=[Required()])
	gender =  LabelRadioField(u'gender', coerce=int, choices=[(1,u'male'),(0,u'female')])
	race = 	StringField(u'race')
	religion = 	StringField(u'religion')
	screen_size = StringField(u'screen size')
	screen_resolution_h = HiddenField(u'screen_resolution_h')
	screen_resolution_w = HiddenField(u'screen_resolution_w')
	submit = SubmitField(u'Submit')

class TestForm(Form):
	result =  TextAreaField(u'内容', widget=TextArea(), \
                render_kw={'class': 'hidden', 'rows': 20})


class LoginForm(Form):
	name = StringField(u'用户名', validators=[Required()])
	passwd = PasswordField(u'密码', validators=[Required()])
	submit = SubmitField(u'确定')
