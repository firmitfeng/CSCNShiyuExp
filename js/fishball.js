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

const STUMITIME = 10;
const MASKTIME = 0.2;
const RESPTIME = 3;
const BLANKTIME = 7;

/*  将动画分解成两部分，撞击前的一部分，撞击后的一部分
    从视频上看，每个动画长度大约4秒，撞击发生在大约2秒左右
    编程方便，总时间算4.4s
    前半程2s，大约走了2.25个球的宽度，170px
    后半程2.2s，大约走了2.5个球的宽度，225px
    黑球（白球）前半程走了
*/
const PATH1 = 180;
const PATH2 = 300;

var Ball = function(pos, direction, color){
	this.pos = pos;
	this.direction = direction;
	this.color = color;
}


var module = {

	init: function() {
		this.data = [
						{
							direction: "left",
							green:{pos:40, path1:PATH1, path2:PATH2},
							yellow:{pos:5, path1:PATH1, path2:PATH2},
							black:{pos:60, path1:},
							blue:{pos:220, path1:300, path2:PATH2},
							red:{pos:25}
						},

					];

	},

	getStumi: function(idx) {
		if (idx < this.data.length) {
			return this.data[idx];
		} else {
			return false;
		}
	},

	setStumiResult: function(idx, result){
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
		self.frameCon = $('#frame-con');
		self.tipsCon = $('#tips-con');
		self.buttonCon = $('#button-con');

		self.selButtons = $('button.sbt');
		self.maskCon = $("#mask");
		self.nButton = $('#next-button');

		self.isDrawing = false;

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
			clickedObj.on('click', function(e){
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

	render: function() {

		var self = this;

		self.nButton.hide();
		self.tipsCon.empty();

		var exper = octopus.getStumi();
		if(!exper){
			return ;
		}

		if (octopus.getMode() == mode.intu) {
			self.delay(0).then(function(args) {
				self.dispTips("请认真观看下面的图形，您有共计10s的时间");
				self.dispStumi(exper.stumi);
				return self.delay(STUMITIME*1000);
			}).then(function(args){
				self.clearFrameCon();
				self.maskCon.show();
				return self.delay(MASKTIME*1000);
			}).then(function(args){
				var randIdx = Math.floor(Math.random()*4+1);
				self.maskCon.hide();
				self.selButtons.show();
				self.dispTips("请点击"+randIdx+"号按钮");
				return self.clickDelay($(self.selButtons[randIdx-1]));
			}).then(function(){
				if(exper.mode == 'abs'){
					self.dispTips('请在'+RESPTIME+'s内，在下面的方框中画出一条绝对长度与您刚才见到的线段相等的线段');
				}else{
					self.dispTips('请在'+RESPTIME+'s内，在下面的方框中画出一条相对长度与您刚才见到的线段相等的线段');
				}
				self.selButtons.hide();
				self.dispFrameCon(exper.respo);
				self.drawLine(exper.respo);
				return self.delay(RESPTIME*1000);
			}).then(function(args){
				self.clearDrawing();
				self.saveLine(exper);
				self.nButton.show();
			});

		} else {
			self.delay(0).then(function(args) {
				self.dispTips("请认真观看下面的图形，您有共计10s的时间");
				self.dispStumi(exper.stumi);
				return self.delay(STUMITIME*1000);
			}).then(function(args){
				self.clearFrameCon();
				self.maskCon.show();
				return self.delay(MASKTIME*1000);
			}).then(function(args){
				var randIdx = Math.floor(Math.random()*4+1);
				self.maskCon.hide();
				self.selButtons.show();
				self.dispTips("请点击"+randIdx+"号按钮");
				return self.clickDelay($(self.selButtons[randIdx-1]));
			}).then(function(){
				self.dispTips('请思考'+BLANKTIME+'s');
				self.selButtons.hide();
				return self.delay(BLANKTIME*1000);
			}).then(function(args){
				self.dispTips('开始请单击屏幕');
				return self.clickDelay($(document));
			}).then(function(args){
				if(exper.mode == 'abs'){
					self.dispTips('请在'+RESPTIME+'s内，在下面的方框中画出一条绝对长度与您刚才见到的线段相等的线段');
				}else{
					self.dispTips('请在'+RESPTIME+'s内，在下面的方框中画出一条相对长度与您刚才见到的线段相等的线段');
				}
				self.selButtons.hide();
				self.dispFrameCon(exper.respo);
				self.drawLine(exper.respo);
				return self.delay(RESPTIME*1000);
			}).then(function(args){
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
		var $hr = $('<hr>').css("height", stumi.height+"px");
		this.frameCon.empty();
		this.frameCon.append($hr);
		this.frameCon.css({'width': stumi.hw+'px', 'height':stumi.hw+'px', 'border':'2px solid #000'});
	},

	clearFrameCon: function() {
		this.frameCon.empty();
		this.frameCon.css('border','0');
	},

	dispFrameCon: function(respo) {
		this.frameCon.empty();
		this.frameCon.css({'width': respo.hw+'px', 'height':respo.hw+'px', 'border':'2px solid #000'});
	}
}

var completeView = {
	init: function(){
		this.headDiv = $('.head');
		this.render();
	},

	render: function(){
		this.headDiv.empty().html('<h2>Complete! Thank you!</h2>');
	}
}

$(document).ready(function(){
	octopus.init(mode.intu);
});