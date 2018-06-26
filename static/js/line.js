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
//这里的stumi是原始刺激数据，其中hw是边框的长度，height是线的长度，都是使用比例
//respo是反映的结果，格式同上
var data = [
				{stumi: {hw:3.0, height:2.5185}, respo: {hw:6.0, height:-1}},
				{stumi: {hw:4.0, height:0.8148}, respo: {hw:6.0, height:-1}},
				{stumi: {hw:3.7407, height:1.0370}, respo: {hw:3.7407, height:-1}},
				{stumi: {hw:5.2222, height:3.7778}, respo: {hw:5.2222, height:-1}},
				{stumi: {hw:4.0, height:2.7037}, respo: {hw:3.0, height:-1}},
				{stumi: {hw:6.0, height:1.1111}, respo: {hw:3.0, height:-1}}
			];
			
var module = {

	init: function(line_mode) {

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
							 	mode: line_mode
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

	init: function(m, line_mode) {
		this.mode = m;
		if (DEBUG) {
			destoryLocalStorage();
		}

		this.currStumiIdx = -1;

		module.init(line_mode);
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
			return false;
		}
	},

	saveLine: function(exper){
		//this.setStumiResult();
		//console.log(module.getStumi(this.currStumiIdx));
	},

	saveData: function() {
		var result = module.getAllData();
		$('#result').val(JSON.stringify(result));
		$('#exp_form').submit();
		//completeView.init();
		console.log('Done!!');
	}
};

var stumiView = {

	init: function() {
		var self = this;
		self.is_practice = false;
		self.clsFrame = $(".frame-container");

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

	saveData: function () {
		octopus.saveData();
	},

	initRender: function() {
		this.dispTips('Click next button to start.');
		this.clearFrameCon();
		this.nButton.show();
	},

	render: function() {

		var self = this;

		self.nButton.hide();
		self.tipsCon.empty();

		if(self.is_practice){
			self.clsFrame.show();
		}

		var exper = octopus.getStumi();
		if(!exper){
			self.saveData();
			return ;
		}

		if (octopus.getMode() == mode.intu) {
			self.delay(0).then(function(args) {
				self.dispTips("Please watch the graphic below for 10 seconds.");
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
				self.dispTips("Please click the number "+randIdx);
				return self.clickDelay($(self.selButtons[randIdx-1]));
			}).then(function(){
				if(exper.mode == 'abs'){
					self.dispTips('Please draw a vertical line. <strong>The length of the vertical line</strong> you draw should be equal to the length of the line in the first graphic.');
				}else{
					self.dispTips('Please draw a vertical line. <strong>The ratio of the vertical line</strong> you draw should be equal to the length of the line in the first graphic.');
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
				self.dispTips("Please watch the graphic below for 10 seconds.");
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
				self.dispTips("Please click the number "+randIdx);
				return self.clickDelay($(self.selButtons[randIdx-1]));
			}).then(function(){
				self.dispTips('Please think at least '+BLANKTIME+' seconds.');
				self.selButtons.hide();
				return self.delay(BLANKTIME*1000);
			}).then(function(args){
				self.dispTips('If you are ready, please click the screen.');
				return self.clickDelay($(document));
			}).then(function(args){
				if(exper.mode == 'abs'){
					self.dispTips('Please draw a vertical line. <strong>The length of the vertical line</strong> you draw should be equal to the length of the line in the first graphic.');
				}else{
					self.dispTips('Please draw a vertical line. <strong>The ratio of the vertical line</strong> you draw should be equal to the length of the line in the first graphic.');
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
			//self.clearDrawing();
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

