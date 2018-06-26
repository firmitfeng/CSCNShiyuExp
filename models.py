# -*- coding: utf-8 -*- 
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class ExpResult(db.Model):
	__tablename__ = "exp_results"
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(64))
	worker_id = db.Column(db.String(64))
	gender = db.Column(db.Integer)
	race = db.Column(db.String(64))
	religion = db.Column(db.String(64))
	screen_size = db.Column(db.Integer)
	screen_resolution_h = db.Column(db.Integer)
	screen_resolution_w = db.Column(db.Integer)


	test_data = db.Column(db.Text)	
	start_time = db.Column(db.DateTime, default=datetime.utcnow)

	
	submit_time = db.Column(db.DateTime)
	test_name = db.Column(db.String(64))
	test_mode = db.Column(db.String(64))

	__table_args__ = (db.UniqueConstraint('worker_id', 'test_name', name='_worker_test_uc'),
                     )

	def __repr__(self):
		return '<Worker: %s %s %s>' % (self.id, self.name, self.worker_id)

	def to_dict(self):
		return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Result(db.Model):
	__tablename__ = 'results'
	id = db.Column(db.Integer, primary_key=True)
	worker_id = db.Column(db.String(64), db.ForeignKey('exp_results.worker_id'))

	mode = db.Column(db.String(32))
	data = db.Column(db.Text)
	submit_time = db.Column(db.DateTime, default=datetime.utcnow)

	worker = db.relationship('ExpResult',
                           backref = db.backref('results', lazy='dynamic')
                           )

