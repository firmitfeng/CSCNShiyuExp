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

const CHARAS = ['self', 'Your', 'Zhang', 'Wang', 'Li', 'Lala'];

const MAX_INTEGER = Math.pow(2, 50);

var Circle = function(chName) {
	this.chName = chName;
	this.center = {
		x: -1,
		y: -1
	};
	this.radius = -1;
};

Circle.prototype.shape = function(center, radius) {
	this.center = center;
	this.radius = radius;
};

var module = {

	initCharas: function() {
		//this.characters = Array.from(Characters,(val)=>({cht: val, circle_c: null}));
		var characters = CHARAS;
		characters.shuffle();
		this.circleArr = [];
		for (var i = 0; i < characters.length; i++) {
			this.circleArr[i] = new Circle(characters[i]);
		}
		// console.log(this.circleArr);
	},

	init: function(m) {
		this.mode = m;
		this.initCharas();
	},

	setCircleShape: function(idx, center, radius) {
		this.circleArr[idx].shape(center, radius);
	},

	getCircle: function(idx) {
		if (idx < this.circleArr.length) {
			return this.circleArr[idx];
		} else {
			return false;
		}
	},

	getCircleCount: function() {
		return this.circleArr.length;
	},

	getAllData: function() {
		return this.circleArr;
	},
};

var octopus = {

	init: function(m) {
		this.mode = m;
		if (DEBUG) {
			destoryLocalStorage();
		}

		if (m = mode.intu) {
			this.blankTimer = 0; //白屏时间
			this.respTimer = 3; //反应时间
		} else {
			this.blankTimer = 7;
			this.respTimer = 3;
		}

		this.currCircleIdx = -1;

		module.init(this.mode);
		stumiView.init();
	},

	getRespTimer: function() {
		return this.respTimer * 1000;
	},

	getBlankTimer: function() {
		return this.blankTimer * 1000;
	},

	getMode: function() {
		return this.mode;
	},

	setCircleShape: function(center, radius) {
		if (this.currCircleIdx != -1 && this.currCircleIdx < module.getCircleCount()) {
			module.setCircleShape(this.currCircleIdx, center, radius);
		}
	},

	getCircle: function() {
		this.currCircleIdx++;
		if (this.currCircleIdx < module.getCircleCount()) {
			return module.getCircle(this.currCircleIdx);
		} else {
			this.saveData();
			completeView.init();
			return false;
		}
	},

	saveLine: function(circle){
		console.log(module.getCircle(this.currCircleIdx));
	},

	saveData: function() {
		var circleArr = module.getAllData();
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
		self.selButtons = $('button.sbt');		//有问题，明天修改
		self.nButton = $('#next-button');

		self.isDrawing = false;

		self.nButton.click(function() {
			self.render();
			self.clearFrameCon();
		}).hide();

		self.initSelButtons();

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
			this.dispTips('下面请你在屏幕下方的区域内画圆来代表一些人物，每个目标（人物）会依次呈现，对于每个圆你需要在3秒内画完，请你按照你的直觉来完成这个任务。');
		} else {
			this.dispTips('下面请你在屏幕下方的区域内画圆来代表一些人物，每个目标（人物）会依次呈现，对于每个目标你有至少7秒的思考时间，请你在充分思考后在3秒之内画完目标所代表的圆。');
		}
		this.nButton.show();
	},

	initSelButtons: function(){
		var arr = new Array(1,2,3,4);
		arr.shuffle();
		for(var i=0; i<4; i++){
			this.selButtons[i].html(arr[i]);
			this.selButtons[i].click(function(e){
				console.log(i);
			});
		}
	},

	render: function() {

		var self = this;

		self.nButton.hide();
		self.tipsCon.empty();

		var circle = octopus.getCircle();
		if(!circle){
			return ;
		}

		if (octopus.getMode() == mode.intu) {
			self.delay(0).then(function(args) {
				self.dispTips('请在'+octopus.getRespTimer()/1000+'秒内画出表示'+circle.chName+'的圆');
				self.drawLine(circle);
				return self.delay(octopus.getRespTimer());
			}).then(function(args){
				self.dispTips('点击Next继续');
				self.clearDrawing();
				self.dispFrameMask();
				self.saveLine(circle);
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

	clearFrameCon: function() {
		this.frameCon.empty();
		this.frameCon.css('background','');
	},

	dispFrameMask: function() {
		this.frameCon.empty();
		this.frameCon.css('background', 'url("imgs/line/mask.jpg") repeat');
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