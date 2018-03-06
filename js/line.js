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

const FRAMEhw = 300;

var module = {

	init: function() {
		//这里的origin是原始刺激数据，其中hw是边框的长度，height是线的长度，都是使用比例
		//target是反映的结果，格式同上
		var stumis = [
						{origin: {hw:1.0, height:0.5}, target: {hw:1.0, height:-1}},
						{origin: {hw:1.0, height:0.2}, target: {hw:1.0, height:-1}},
						{origin: {hw:1.0, height:0.7}, target: {hw:1.0, height:-1}},
						{origin: {hw:1.2, height:0.3}, target: {hw:1.0, height:-1}},
						{origin: {hw:0.8, height:0.2}, target: {hw:1.0, height:-1}},
						{origin: {hw:1.4, height:0.5}, target: {hw:1.0, height:-1}},
						{origin: {hw:0.6, height:0.4}, target: {hw:1.0, height:-1}}
					  ];
		this.stumis = [];
		for(var i=0; i<stumis.length; i++){
			this.stumis[i] = {
								origin: {
									hw: stumis[i].origin.hw*FRAMEhw, 
									height: stumis[i].origin.height*FRAMEhw
							  	}, 
							  	target: {
							  		hw: stumis[i].target.hw*FRAMEhw, 
							  		height: -1
							 	}
							 };
		}
	},

	getStumi: function(idx) {
		if (idx < this.stumis.length) {
			return this.stumis[idx];
		} else {
			return false;
		}
	},

	setStumiResult: function(idx, result){
		this.stumis[idx].target.length = result;
	},

	getStumiCount: function() {
		return this.stumis.length;
	},

	getAllData: function() {
		return this.stumis;
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

	saveLine: function(line){
		//this.setStumiResult();
		console.log(module.getStumi(this.currStumiIdx));
	},

	saveData: function() {
		var stumis = module.getAllData();
		completeView.init();
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

		var stumi = octopus.getStumi();
		if(!stumi){
			return ;
		}

		if (octopus.getMode() == mode.intu) {
			self.delay(0).then(function(args) {
				self.dispTips("请认真观看下面的图形，您有共计10s的时间");
				self.dispStumi(stumi.origin);
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
				self.dispTips('请在下面的方框中画出一条相对长度与您刚才见到的线段相等的线段');
				self.selButtons.hide();
				self.dispFrameCon(stumi.target);
				self.drawLine(stumi.target);
				return self.delay(RESPTIME*1000);
			}).then(function(args){
				self.clearDrawing();
				self.saveLine();
				self.nButton.show();
			});

		} else {
			self.delay(0).then(function(args) {
				self.dispTips('请思考'+circle.chName);
				return self.delay(octopus.getBlankTimer());
			}).then(function(args){
				self.dispTips('开始请单击画布');
				return self.clickDelay(self.frameCon);
			}).then(function(args){
				self.dispTips('请在'+octopus.getRespTimer()/1000+'秒内画出表示'+circle.chName+'的圆');
				self.drawLine(circle);
				return self.delay(octopus.getRespTimer());
			}).then(function(args){
				self.dispTips('点击Next继续');
				self.clearDrawing();
				self.saveLine(circle);
				self.nButton.show();
			});

		}

	},

	dispTips: function(tips) {
		this.tipsCon.empty().html(tips);
	},

	dispStumi: function(origin) {
		var $hr = $('<hr>').css("height", origin.height+"px");
		this.frameCon.empty();
		this.frameCon.append($hr);
		this.frameCon.css({'width': origin.hw+'px', 'height':origin.hw+'px', 'border':'2px solid #000'});
	},

	clearFrameCon: function() {
		this.frameCon.empty();
		this.frameCon.css('border','0');
	},

	dispFrameCon: function(target) {
		this.frameCon.empty();
		this.frameCon.css({'width': target.hw+'px', 'height':target.hw+'px', 'border':'2px solid #000'});
	},

	saveLine: function(line){
		octopus.saveLine(line);
	},

	drawLine: function(line) {
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
				console.log(height);
			}
		});

		// 鼠标松开停止画圆  
		self.expCon.on('mouseup', function() {
			isDrawing = false;
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
	octopus.init(mode.intu);
});