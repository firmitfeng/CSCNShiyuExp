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

	picCount: 50,

	initPic: function(){
		if (!localStorage.wordspic){
			localStorage.wordspic = JSON.stringify({currIdx:0, picIdx:this.picIdxArr});
			var tempIdxArr = Array.from(new Array(this.picCount), (val,index)=>index).shuffle();
			this.picIdxArr = Array.from(tempIdxArr,(val,index)=>({idx: index, img: this.getPicUrl(val), click: ''}));
			this.currIdx = 0;
		}else{
			var wordspic = JSON.parse(localStorage.wordspic);
			this.picIdxArr = wordspic.picIdx;
			this.currIdx = wordspic.currIdx;
		}


	},

	getPicUrl: function(val){
		return (val+1 < 10 ? '00' : '0') + (val+1) + (Math.floor(Math.random() * 2)? 'L' : 'R') + '.jpg'; 
	},

	getPicCount: function(){
		return this.picCount;
	},

	getPic: function(idx){
		if (idx < this.picCount){
			return this.picIdxArr[idx].img;
		}else{
			return -1;
		}
	},

	clickPic: function(idx, click){
		this.picIdxArr[idx].click = click;
		//console.log(this.picIdxArr[this.currIdx].click);
	},

	getAllData: function(){
		return this.picIdxArr;
	},

	init: function(){
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

		if (m = mode.intu) {
			this.blankTimer = 0; //白屏时间
			this.respTimer = 3; //反应时间
		} else {
			this.blankTimer = 7;
			this.respTimer = 3;
		}

		this.currPicIdx = -1;

		module.init();
		stumiView.init();
	},

	getPic: function(){
		this.currPicIdx++;
		if (this.currPicIdx < module.getPicCount()) {
			return module.getPic(this.currPicIdx);
		} else {
			return false;
		}
	},

	getRespTimer: function(){
		return this.respTimer * 1000;
	},

	getBlankTimer: function () {
		return this.blankTimer * 1000;
	},

	getMode: function(){
		return this.mode;
	},

	setPicClick: function(btIdx){
		module.clickPic(this.currPicIdx, btIdx);
	},

	saveData: function(){
		var picArr = module.getAllData();
		$('#result').val(JSON.stringify(picArr));
		$('#exp_form').submit();
		//completeView.init();
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
			self.render();
		}).hide();

		self.initRender();

	},

	initRender: function() {
		if (octopus.getMode() == mode.intu) {
			this.dispTips('Click next button to continue.');
		} else {
			this.dispTips('Click next button to continue.');
		}
		this.clearScreen();
		this.nButton.show();

	},

	clickButton: function(btIdx){
		var self=this;
		clearTimeout(self.tid);
		octopus.setPicClick(btIdx);
		this.render();
	},

	keyPress: function(event){
		//console.log(event.keyCode);
		var f_codes = [70, 102];
		var j_codes = [74, 106];
		var self=event.data.parent;
		if(f_codes.includes(event.keyCode)){
			self.clickButton('l');
		}else if(j_codes.includes(event.keyCode)){
			self.clickButton('r');
		}
		$(document).off("keypress");
	},

	mouseDown: function(event){
		var self=event.data.parent;

		if(event.which == 1){
			self.clickButton('l');
		}else if(event.which == 3){
			self.clickButton('r');
		}
		$(document).off("mousedown");
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

	mouseKeyDelay: function(clickedObj){
		var self = this;
		return new Promise(function(resolve, reject) {
			clickedObj.on('click', function(e) {
				clickedObj.off("mousedown");
				resolve();
			});
		});
	},

	saveData: function () {
		octopus.saveData();
	},

	render: function(){

		var self = this;

		self.nButton.hide();
		self.tipsCon.empty();
		self.clearScreen();

		self.picurl = octopus.getPic();

		if (!self.picurl){
			self.saveData();
			return ;
		}

		//console.log(picUrl);
		if (octopus.getMode() == mode.intu){
			self.delay(0).then(function(args){
				self.dispStumi('/static/imgs/word/'+self.picurl);
				self.dispButtons();
				return self.delay(octopus.getRespTimer());
			}).then(function(args){
				self.clearScreen();
				self.dispTips('missing, click next button to continue...');
				self.nButton.show();
			});
			
		}else{
			self.delay(0).then(function(args){
				self.dispStumi('/static/imgs/word/'+self.picurl);
				return self.delay(octopus.getRespTimer());
			}).then(function(args){
				self.clearScreen();
				self.dispTips('Thinking...');
				return self.delay(octopus.getBlankTimer());
			}).then(function(args){
				self.dispTips('if you finish thinking, please click the screen');
				return self.mouseKeyDelay($(document));
			}).then(function(args){
				self.dispTips('Choose the left one or the right one');
				self.dispButtons();
				return self.delay(octopus.getRespTimer());
			}).then(function(args){
				self.clearScreen();
				self.dispTips('missing, click next button to continue...');
				self.nButton.show();
			});
		}

	},

	dispStumi: function(picurl){
		this.pic.attr('src', picurl);
		this.pic.show();
	},

	dispButtons: function(){
		//this.rButton.show();
		//this.lButton.show();
		$(document).on("mousedown", {'parent':this}, this.mouseDown);
	},

	dispTips: function(tips){
		this.tipsCon.empty().html(tips);
	},

	clearTips: function() {
		this.tipsCon.empty();
	},

	clearScreen: function(){
		this.pic.hide();
		this.rButton.hide();
		this.lButton.hide();
		$(document).off("mousedown");
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
