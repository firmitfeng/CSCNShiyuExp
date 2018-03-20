// Fisher–Yates shuffle 
Array.prototype.shuffle = function() {
 var input = this; 
 for (var i = input.length-1; i >=0; i--) { 
 	var randomIndex = Math.floor(Math.random()*(i+1)); 
 	var itemAtIndex = input[randomIndex]; 
 	input[randomIndex] = input[i]; 
 	input[i] = itemAtIndex; 
 } return input; 
}

const mode = {intu: 0, ret: 1};

const DEBUG = 1;

function destoryLocalStorage(){
	localStorage.clear();
};


var module = {

	initPic: function(){
		this.picCount = 10;

		if (!localStorage.wordspic){
			localStorage.wordspic = JSON.stringify({currIdx:0, picIdx:this.picIdxArr});
			this.picIdxArr = Array.from(new Array(this.picCount),(val,index)=>({idx: index, img: '', click: ''}));
			this.picIdxArr.shuffle();
			this.currIdx = 0;
		}else{
			var wordspic = JSON.parse(localStorage.wordspic);
			this.picIdxArr = wordspic.picIdx;
			this.currIdx = wordspic.currIdx;
		}


	},

	getCurrPic: function(){
		if (this.picIdxArr.length > this.currIdx){
			var idx = this.picIdxArr[this.currIdx].idx;
			var url = '0' + (Math.floor(idx/2)+1) + (idx%2? 'L' : 'R') + '.jpg';

			if ((idx/2) < 10){
				url = '0'+url;
			}
			this.picIdxArr[this.currIdx].img = url;
			//console.log(url);
			return url;
		}else{
			return -1;
		}
	},

	getNextPic: function(){
		this.currIdx ++;
		return this.getCurrPic();
	},

	clickPic: function(click){
		this.picIdxArr[this.currIdx].click = click;
		//console.log(this.picIdxArr[this.currIdx].click);
	},

	getAllData: function(){
		return this.picIdxArr;
	},

	init: function(m){
		if (m = mode.intu){
			this.blankTimer = 0;	//白屏时间
			this.respTimer = 3;		//反应时间
		}else{
			this.blankTimer = 7;
			this.respTimer = 3;
		}
		this.mode = m;
		// 初始化图片
		this.initPic();
	}
};

var octopus = {

	init: function(m){
		this.mode = m;
		if (DEBUG) {
			destoryLocalStorage();
		}
		module.init(this.mode);
		stumiView.init();
	},

	getCurrPic: function(){
		return module.getCurrPic();
	},

	getNextPic: function(){
		var picurl = module.getNextPic();
		if(picurl != -1){
			return picurl;
		}else{
			this.saveData();
			return -1;
		}
	},

	getRespTimer: function(){
		return module.respTimer * 1000;
	},

	getBlankTimer: function () {
		return module.blankTimer * 1000;
	},

	getMode: function(){
		return this.mode;
	},

	setPicClick: function(btIdx){
		module.clickPic(btIdx);
	},

	saveData: function(){
		var picArr = module.getAllData();
		completeView.init();
		console.log('Done!!');
	}
};

var stumiView = {

	init: function(){
		var self = this;
		self.picCon = $('#stimuli-con');
		self.tipsCon = $('#tips-con');
		self.buttonCon = $('#button-con');
		self.pic = $('#stimuli-pic');
		self.lButton = $('#left-button');
		self.rButton = $('#right-button');
		self.nButton = $('#next-button');
		self.lButton.click({idx: 'l'}, function(e){ self.clickButton(e.data.idx); });
		self.rButton.click({idx: 'r'}, function(e){ self.clickButton(e.data.idx); });
		self.nButton.click(function(){ 
			self.picurl = octopus.getNextPic();
			self.render();
		}).hide();
		self.picurl = octopus.getCurrPic();
		self.render();
	},

	clickButton: function(btIdx){
		var self=this;
		clearTimeout(self.tid);
		octopus.setPicClick(btIdx);
		self.picurl = octopus.getNextPic();
		this.render();
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


	render: function(){

		var self = this;

		self.nButton.hide();
		self.tipsCon.empty();
		self.clearScreen();

		if (self.picurl == -1){
			return;
		}

		//console.log(picUrl);
		if (octopus.getMode() == mode.intu){
			self.delay(0).then(function(args){
				self.dispStumi('imgs/word/'+self.picurl);
				self.dispButtons();
				return self.delay(octopus.getRespTimer());
			}).then(function(args){
				self.clearScreen();
				self.nButton.show();
			});
			
		}else{
			self.delay(0).then(function(args){
				self.dispStumi('imgs/word/'+self.picurl);
				return self.delay(octopus.getRespTimer());
			}).then(function(args){
				self.clearScreen();
				self.dispTips('thinking...');
				return self.delay(octopus.getBlankTimer());
			}).then(function(args){
				self.dispTips('开始请单击屏幕');
				return self.clickDelay($(document));
			}).then(function(args){
				self.dispButtons();
				return self.delay(octopus.getRespTimer());
			}).then(function(args){
				self.clearScreen();
				self.nButton.show();
			});
		}

	},

	dispStumi: function(picurl){
		this.pic.attr('src', picurl);
		this.pic.show();
	},

	dispButtons: function(){
		this.rButton.show();
		this.lButton.show();
	},

	dispTips: function(tips){
		this.tipsCon.empty().html(tips);
	},

	clearScreen: function(){
		this.pic.hide();
		this.rButton.hide();
		this.lButton.hide();
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
	octopus.init(mode.ret);
});