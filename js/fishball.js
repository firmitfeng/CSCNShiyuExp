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

const COLORS = ['red', 'green', 'blue', 'yellow', 'white'];

var module = {

	init: function() {

		var fishs=[], balls=[];
		var temp = Array.from(new Array(24),(val,index)=>(index));

		temp.shuffle();

		for(var i=0; i<21; i++){
			fishs[i] = {idx: temp[i], fb:'fish', mode: '', resp: ''}
			if(i < 7){
				fishs[i].mode = 'in';
			}else if(i < 14){
				fishs[i].mode = 'ex';
			}else{
				fishs[i].mode = 'fe';
			}
		}

		temp = Array.from(new Array(24),(val,index)=>(index+24));
		temp.shuffle();

		for(var i=0; i<21; i++){
			balls[i] = {idx: temp[i], fb:'ball', mode: '', resp: ''}
			if(i < 7){
				balls[i].mode = 'in';
			}else if(i < 14){
				balls[i].mode = 'ex';
			}else{
				balls[i].mode = 'fe';
			}
		}

		this.data = Array();

		for(var i=0; i<6; i++){
			var start = parseInt(i/2)*7;
			if(i%2 == 0){
				this.data = this.data.concat(fishs.slice(start, start+7));
			}else{
				this.data = this.data.concat(balls.slice(start, start+7));
			}
		}
		console.log(this.data);
	},


	getFishBall: function(idx){
		var fishball = {};
		var direct = FishBallMeta[idx].direction;
		for (var c_idx = COLORS.length; c_idx--;) {
			var color = COLORS[c_idx];
			fishball[color] = {
				pos: 0,
				anima1: {},
				anima2: {},
				respo: ''
			};
			fishball[color]['pos'] = FishBallMeta[idx][color]['pos'];
			fishball[color]['anima1'][direct] = '+=' + FishBallMeta[idx][color]['path1'];
			fishball[color]['anima2'][direct] = '+=' + FishBallMeta[idx][color]['path2'];
			if ('flipx' in FishBallMeta[idx][color]) {
				fishball[color]['flipx'] = true;
			} else {
				fishball[color]['flipx'] = false;
			}
		}
		fishball['topic'] = FishBallMeta[idx]['topic'];
		fishball['direction'] = FishBallMeta[idx]['direction'];
		fishball['fb'] = FishBallMeta[idx]['fb'];
		fishball['respo'] = '';

		return fishball;
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
		this.currFishBall = {};

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
			this.currFishBall = module.getStumi(this.currStumiIdx);
			return module.getFishBall(this.currFishBall.idx);
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

		self.currStumiIdx = 0;

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

		this.clearFrameCon();
		this.nButton.show();
	},

	resetFishBall: function(stumi) {
		this.trackCon.removeClass().addClass('track').addClass(stumi.fb);
		var temp = {
			left: '',
			right: ''
		};
		for (var i = COLORS.length; i--;) {
			temp[stumi['direction']] = stumi[COLORS[i]].pos;
			this[COLORS[i]].css(temp).removeClass();
			if(stumi.fb != 'ball'){
				if(stumi.direction == 'left' && stumi[COLORS[i]].flipx){
					this[COLORS[i]].addClass('flipx');
				}
				if(stumi.direction == 'right' && !stumi[COLORS[i]].flipx){
					this[COLORS[i]].addClass('flipx');
				}
			}
		}
	},

	dispFish: function(stumi) {
		if(stumi.fb == 'fishs'){
			var timer1 = F_TIMER3, timer2 = F_TIMER4;
			var timer3 = F_TIMER1, timer4 = F_TIMER2;
		}else if(stumi.fb == 'fishg'){
			var timer1 = F_TIMER1, timer2 = F_TIMER2;
			var timer3 = F_TIMER3, timer4 = F_TIMER4;
		}else{
			var timer1 = B_TIMER1, timer2 = B_TIMER2;
			var timer3 = B_TIMER1, timer4 = B_TIMER2;
		}

		this.red.animate(stumi.red.anima1, timer1, 'linear').animate(stumi.red.anima2, timer2, 'linear');
		this.green.animate(stumi.green.anima1, timer1, 'linear').animate(stumi.green.anima2, timer2, 'linear');
		this.yellow.animate(stumi.yellow.anima1, timer1, 'linear').animate(stumi.yellow.anima2, timer2, 'linear');
		this.white.animate(stumi.white.anima1, timer1, 'linear').animate(stumi.white.anima2, timer2, 'linear');
		this.blue.animate(stumi.blue.anima1, timer3, 'linear').animate(stumi.blue.anima2, timer4, 'linear');
	},

	dispBall: function(stumi) {
		for (var i = COLORS.length; i--;) {
			this.playAnimate(this[COLORS[i]], stumi[COLORS[i]].anima1, B_TIMER1);
			this.playAnimate(this[COLORS[i]], stumi[COLORS[i]].anima2, B_TIMER2);
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
		self.currStumiIdx ++;
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