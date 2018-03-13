// Fisher–Yates shuffle 
Array.prototype.shuffle = function() {
	var input = this;
	for (var i = input.length - 1; i >= 0; i--) {
		var randomIndex = Math.floor(Math.random() * (i + 1));
		var itemAtIndex = input[randomIndex];
		input[randomIndex] = input[i];
		input[i] = itemAtIndex;
	}
	return input;
}

function destoryLocalStorage() {
	//localStorage.clear();
};

const mode = {
	intu: 0,
	ret: 1
};

const DEBUG = 1;

const STUMITIME = 5;
const MASKTIME = 0.2;
const RESPTIME = 3;
const BLANKTIME = 7;

const FISHBALLTYPES = ['red', 'green', 'blue', 'yellow', 'white'];

var module = {

	init: function() {

		this.data = [];
		for (var i = 0; i < FishBallMeta.length; i++) {
			var direct = FishBallMeta[i].direction;
			this.data[i] = {};
			//需要修改
			for (var key in FishBallMeta[i]) {
				if (key == 'direction' || key == 'fb' || key == 'patch') {
					this.data[i][key] = FishBallMeta[i][key];
					continue;
				}
				this.data[i][key] = {
					pos: 0,
					anima1: {},
					anima2: {},
					respo: ''
				};
				this.data[i][key]['pos'] = FishBallMeta[i][key]['pos'];
				this.data[i][key]['anima1'][direct] = '+=' + FishBallMeta[i][key]['path1'];
				this.data[i][key]['anima2'][direct] = '+=' + FishBallMeta[i][key]['path2'];
				if ('flipx' in FishBallMeta[i][key]) {
					this.data[i][key]['flipx'] = true;
				} else {
					this.data[i][key]['flipx'] = false;
				}
			}
		}
		// console.log(this.data);
	},

	getStumi: function(idx) {
		if (idx < this.data.length) {
			return this.data[idx];
		} else {
			return false;
		}
	},

	setStumiResult: function(idx, result) {
		this.data[idx].respo.length = result;
	},

	getStumiCount: function() {
		return this.data.length;
	},

	getAllData: function() {
		return this.data;
	},
};


var octopus = {

	init: function(m) {
		this.mode = m;
		if (DEBUG) {
			destoryLocalStorage();
		}

		this.currStumiIdx = -1;

		module.init();
		stumiView.init();
	},

	getMode: function() {
		return this.mode;
	},

	setStumiResult: function(length) {
		if (this.currStumiIdx != -1 && this.currStumiIdx < module.getStumiCount()) {
			module.setStumiResult(this.currStumiIdx, length);
		}
	},

	getStumi: function() {
		this.currStumiIdx++;
		if (this.currStumiIdx < module.getStumiCount()) {
			return module.getStumi(this.currStumiIdx);
		} else {
			this.saveData();
			completeView.init();
			return false;
		}
	},

	saveData: function() {
		var result = module.getAllData();
		completeView.init();
		console.log(result);
		console.log('Done!!');
	}
};

var stumiView = {

	init: function() {
		var self = this;
		self.expCon = $('#exp-con');
		self.fishballCon = $('#fishball');
		self.trackCon = $('.track');
		self.tipsCon = $('#tips-con');
		self.buttonCon = $('#button-con');

		self.red = $('#red');
		self.white = $('#white');
		self.yellow = $('#yellow');
		self.blue = $('#blue');
		self.green = $('#green');

		self.selButtons = $('button.sbt');
		self.maskCon = $("#mask");
		self.nButton = $('#next-button');

		self.nButton.click(function() {
			self.render();
			self.clearFrameCon();
		}).hide();

		self.selButtons.hide();

		self.initRender();
	},


	delay: function(timer) {
		var self = this;
		return new Promise(function(resolve, reject) {
			self.tid = setTimeout(function() {
				resolve();
			}, timer);
		});
	},

	clickDelay: function(clickedObj) {
		var self = this;
		return new Promise(function(resolve, reject) {
			clickedObj.on('click', function(e) {
				resolve();
			});
		});
	},

	clickButton: function(btIdx) {},

	initRender: function() {
		if (octopus.getMode() == mode.intu) {
			this.dispTips('请你按照你的直觉来完成这个任务。');
		} else {
			this.dispTips('请按要求完成');
		}
		this.clearFrameCon();
		this.nButton.show();
	},

	resetFishBall: function(stumi) {
		this.trackCon.removeClass().addClass('track').addClass(stumi.fb);
		var temp = {
			left: '',
			right: ''
		};
		console.log(stumi);
		for (var i = FISHBALLTYPES.length; i--;) {
			temp[stumi['direction']] = stumi[FISHBALLTYPES[i]].pos;
			this[FISHBALLTYPES[i]].css(temp);
			console.log(stumi.direction + '    ' + stumi[FISHBALLTYPES[i]].flipx );
			if(stumi.fb == 'fish'){
				if((stumi.direction == 'left' && stumi[FISHBALLTYPES[i]].flipx) 
					|| (stumi.direction == 'right' && !stumi[FISHBALLTYPES[i]].flipx)){
					this[FISHBALLTYPES[i]].addClass('flipx');
				}
			}
		}
	},

	dispFish: function(stumi) {
		this.red.css(stumi.direction, stumi.red.pos).animate(stumi.red.anima1, F_TIMER1, 'linear').animate(stumi.red.anima2, F_TIMER2, 'linear');
		this.blue.css(stumi.direction, stumi.blue.pos).animate(stumi.blue.anima1, F_TIMER1, 'linear').animate(stumi.blue.anima2, F_TIMER2, 'linear');
		this.green.css(stumi.direction, stumi.green.pos).animate(stumi.green.anima1, F_TIMER1, 'linear').animate(stumi.green.anima2, F_TIMER2, 'linear');
		this.yellow.css(stumi.direction, stumi.yellow.pos).animate(stumi.yellow.anima1, F_TIMER1, 'linear').animate(stumi.yellow.anima2, F_TIMER2, 'linear');
		this.white.css(stumi.direction, stumi.white.pos).animate(stumi.white.anima1, F_TIMER1, 'linear').animate(stumi.white.anima2, F_TIMER2, 'linear');
	},

	dispBall: function(stumi) {
		for (var i = FISHBALLTYPES.length; i--;) {
			this.playAnimate(this[FISHBALLTYPES[i]], stumi[FISHBALLTYPES[i]].anima1, B_TIMER1);
			this.playAnimate(this[FISHBALLTYPES[i]], stumi[FISHBALLTYPES[i]].anima2, B_TIMER2);
		}
	},

	playAnimate: function(obj, describe, timer) {
		obj.animate(describe, timer, 'linear');
	},

	render: function() {

		var self = this;

		self.nButton.hide();
		self.tipsCon.empty();

		var exper = octopus.getStumi();
		if (!exper) {
			return;
		}


		if (octopus.getMode() == mode.intu) {
			self.delay(0).then(function(args) {
				self.dispTips("请认真观看下面的图形，您有共计10s的时间");
				self.dispStumi(exper);
				return self.delay(STUMITIME * 1000);
			}).then(function(args) {
				self.clearFrameCon();
				self.nButton.show();
			});

		} else {
			self.delay(0).then(function(args) {
				self.dispTips("请认真观看下面的图形，您有共计10s的时间");
				self.dispStumi(exper.stumi);
				return self.delay(STUMITIME * 1000);
			}).then(function(args) {
				self.clearFrameCon();
				self.maskCon.show();
				return self.delay(MASKTIME * 1000);
			}).then(function(args) {
				var randIdx = Math.floor(Math.random() * 4 + 1);
				self.maskCon.hide();
				self.selButtons.show();
				self.dispTips("请点击" + randIdx + "号按钮");
				return self.clickDelay($(self.selButtons[randIdx - 1]));
			}).then(function() {
				self.dispTips('请思考' + BLANKTIME + 's');
				self.selButtons.hide();
				return self.delay(BLANKTIME * 1000);
			}).then(function(args) {
				self.dispTips('开始请单击屏幕');
				return self.clickDelay($(document));
			}).then(function(args) {
				if (exper.mode == 'abs') {
					self.dispTips('请在' + RESPTIME + 's内，在下面的方框中画出一条绝对长度与您刚才见到的线段相等的线段');
				} else {
					self.dispTips('请在' + RESPTIME + 's内，在下面的方框中画出一条相对长度与您刚才见到的线段相等的线段');
				}
				self.selButtons.hide();
				self.dispFrameCon(exper.respo);
				self.drawLine(exper.respo);
				return self.delay(RESPTIME * 1000);
			}).then(function(args) {
				self.clearDrawing();
				self.saveLine(exper);
				self.nButton.show();
			});

		}

	},

	dispTips: function(tips) {
		this.tipsCon.empty().html(tips);
	},

	dispStumi: function(stumi) {
		this.resetFishBall(stumi);
		if (stumi.fb == 'ball') {
			this.dispBall(stumi);
		} else {
			this.dispFish(stumi);
		}
		this.fishballCon.show();
	},

	clearFrameCon: function() {
		this.fishballCon.hide();
	},

	dispFrameCon: function(respo) {

	}
}

var completeView = {
	init: function() {
		this.headDiv = $('.head');
		this.render();
	},

	render: function() {
		this.headDiv.empty().html('<h2>Complete! Thank you!</h2>');
	}
}

$(document).ready(function() {
	octopus.init(mode.intu);
});