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

//正方形外框的边长
const FRAMESIZE = 300;

var module = {

	init: function() {
		//这里的stumi是原始刺激数据，其中hw是边框的长度，height是线的长度，都是使用比例
		//respo是反映的结果，格式同上
		var data = [
						{stumi: {hw:1.0, height:0.5}, respo: {hw:1.0, height:-1}, mode: 'abs'},
						{stumi: {hw:1.0, height:0.2}, respo: {hw:1.0, height:-1}, mode: 'abs'},
						{stumi: {hw:1.0, height:0.7}, respo: {hw:1.0, height:-1}, mode: 'rel'},
						{stumi: {hw:1.2, height:0.3}, respo: {hw:1.0, height:-1}, mode: 'abs'},
						{stumi: {hw:0.8, height:0.2}, respo: {hw:1.0, height:-1}, mode: 'rel'},
						{stumi: {hw:1.4, height:0.5}, respo: {hw:1.0, height:-1}, mode: 'abs'},
						{stumi: {hw:0.6, height:0.4}, respo: {hw:1.0, height:-1}, mode: 'rel'}
					];
		this.data = [];
		for(var i=0; i<data.length; i++){
			this.data[i] = {
								stumi: {
									hw: data[i].stumi.hw*FRAMESIZE, 
									height: data[i].stumi.height*FRAMESIZE
							  	}, 
							  	respo: {
							  		hw: data[i].respo.hw*FRAMESIZE, 
							  		height: -1
							 	},
							 	mode: data[i].mode
							 };
		}
		//是否需要随机，需要的话取消以下注释
		//this.data.shuffle();
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

	saveLine: function(exper){
		//this.setStumiResult();
		console.log(module.getStumi(this.currStumiIdx));
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
	},

	saveLine: function(exper){
		octopus.saveLine(exper);
	},

	drawLine: function(respo) {
		var self = this;

		// 线的宽高
		var width, height;

		// 是否正在画圆  
		var isDrawing = false;

		var $line = $('<hr>');

		// 按下鼠标划线
		self.frameCon.on("mousedown", function(event) {
			$(this).append($line);
			isDrawing = true;
			event.preventDefault();
		});

		// 鼠标拖动  
		self.expCon.on('mousemove', function(event) {
			if (isDrawing) {

				var newY = event.pageY - self.frameCon.offset().top;

				if (newY < 0) {
					newY = 0;
				} else if (newY > self.frameCon.height()) {
					newY = self.frameCon.height();
				}

				height = newY;

				// 设置线段
				$line.css("height", height + "px");
				respo.height = height;
				//console.log(height);
			}
		});

		// 鼠标松开停止画圆  
		self.expCon.on('mouseup', function() {
			isDrawing = false;
			respo.height = height;
			self.clearDrawing();
		});

		//return $line;
	},

	clearDrawing: function(){
		this.frameCon.off('mousedown');
		this.expCon.off('mousemove');
		this.expCon.off('mouseup');
	},
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
	octopus.init(mode.rel);
});