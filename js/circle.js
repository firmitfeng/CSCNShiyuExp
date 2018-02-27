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

function destoryLocalStorage(){
	localStorage.clear();
};

const mode = {intu: 0, ret: 1};

const DEBUG = 1;

const CHARAS = ['self', 'Your', 'Zhang', 'Wang', 'Li', 'Lala'];

var Circle = function(chName){
	this.chName = chName;
	this.center = {x:-1, y:-1};
	this.radius = -1;
};

Circle.prototype.shape = function(center, radius){
	this.center = center;
	this.radius = radius; 
};

var CircleHtml = function(HtmlText, center, radius){
	this.htmlObj = $('<div class="circle"></div>');
	this.htmlObj.html(HtmlText);
    // 设置圆的大小和位置 
    this.htmlObj.css("left", center.x - radius + "px");  
    this.htmlObj.css("top", center.y - radius + "px");  
    this.htmlObj.css("width", 2 * radius + "px");  
    this.htmlObj.css("height", 2 * radius + "px");  
    this.htmlObj.css("border-radius", radius + "px"); 
}

var module = {

	initCharas: function(){
		//this.characters = Array.from(Characters,(val)=>({cht: val, circle_c: null}));
		var characters = CHARAS;
		characters.shuffle();
		this.circleArr = [];
		for(var i=0; i<characters.length; i++){
			this.circleArr[i] = new Circle(characters[i]);
		}
		// console.log(this.circleArr);
	},

	init: function(m){
		this.mode = m;
		this.initCharas();
	},

	setCircleShape: function(idx, center, radius){
		this.circleArr[idx].shape(center, radius);
	},

	getCircle: function(idx){
		if (idx < this.circleArr.length){
			return this.circleArr[idx];
		}else{
			return false;
		}
	},

	getCircleCount: function(){
		return this.circleArr.length;
	},

	getAllData: function(){
		return this.circleArr;
	},
};

var octopus = {

	init: function(m){
		this.mode = m;
		if (DEBUG) {
			destoryLocalStorage();
		}

		if (m = mode.intu){
			this.blankTimer = 0;	//白屏时间
			this.respTimer = 3;		//反应时间
		}else{
			this.blankTimer = 7;
			this.respTimer = 3;
		}

		this.currCircleIdx = -1;

		module.init(this.mode);
		stumiView.init();
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

	setCircleShape: function(center, radius){
		if (this.currCircleIdx != -1 && this.currCircleIdx < module.getCircleCount()){
			module.setCircleShape(this.currCircleIdx, center, radius);
		}
	},

	getCircle: function(){
		this.currCircleIdx ++;
		if (this.currCircleIdx < module.getCircleCount()){
			return module.getCircle(this.currCircleIdx);
		}else{
			return false;
		}
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
		self.drawCon = $('#stimuli-con');
		self.tipsCon = $('#tips-con');
		self.buttonCon = $('#button-con');
		self.nButton = $('#next-button');

		self.isDrawing = false;

		self.nButton.click(function(){ 
			self.render();
		}).hide();
		self.initRender();
	},


	delay: function(timer){
		var self = this;
		return new Promise(function(resolve, reject){
			self.tid = setTimeout(function(){
				resolve();
			}, timer);
		});
	},

	clickButton: function(btIdx){
	},

	initRender: function(){
		if (octopus.getMode() == mode.intu){
			this.dispTips('下面请你在屏幕下方的区域内画圆来代表一些人物，每个目标（人物）会依次呈现，对于每个圆你需要在3秒内画完，请你按照你的直觉来完成这个任务。');
		}else{
			this.dispTips('下面请你在屏幕下方的区域内画圆来代表一些人物，每个目标（人物）会依次呈现，对于每个目标你有至少7秒的思考时间，请你在充分思考后在3秒之内画完目标所代表的圆。');
		}
		this.nButton.show();
	},

	render: function(){

		var self = this;

		self.nButton.hide();
		self.tipsCon.empty();

		var circle = octopus.getCircle();

		//console.log(picUrl);
		if (octopus.getMode() == mode.intu){
			self.delay(0).then(function(args){
				self.dispTips(`请在3秒内画出表示 ${circle.chName} 的圆`);
				self.drawCircle(circle);
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
				self.tipsCon.empty();
				alert('click to continue...');
				return self.delay(0);
			}).then(function(args){
				self.dispButtons();
				return self.delay(octopus.getRespTimer());
			}).then(function(args){
				self.clearScreen();
				self.nButton.show();
			});
		}

	},

	dispTips: function(tips){
		this.tipsCon.empty().html(tips);
	},

	clearScreen: function(){

	},

	drawCircle: function(circle){
		var self = this;
          
        // 圆的左上角位置  
        var circleX, circleY;

        var topX, topY;
        var width, height;
  
        // 是否正在画圆  
        var isDrawing = false;

        var $circle = $('<div class="circle"></div>');
        $circle.html(circle.chName);

		// 按下鼠标开始画圆  
        self.drawCon.mousedown(function(event) {  
            // centerX = event.pageX - $drawing.offset().left;  
            // centerY = event.pageY - $drawing.offset().top; 
            topX = event.pageX - self.drawCon.offset().left;
            topY = event.pageY - self.drawCon.offset().top; 
            $(this).append($circle);  
            isDrawing = true;  
            event.preventDefault();  
        });   
  
        // 鼠标拖动  
        $(document).mousemove(function(event) {  
            if(isDrawing) {

                var newX = event.pageX - self.drawCon.offset().left;
                var newY = event.pageY - self.drawCon.offset().top;
                var circleX = 0;
                var circleY = 0;

                if(newX < 0 ){
                    newX = 0;
                }else if (newX > self.drawCon.width()){
                    newX = self.drawCon.width();
                }
                if(newY < 0){
                    newY = 0;
                }else if (newY > self.drawCon.height()){
                    newY = self.drawCon.height();
                }

                width = Math.abs(newX - topX);
                height = Math.abs(newY - topY);

                if (width > height){
                    width = height;
                }else{
                    height = width;
                }

                if(newX < topX){
                    circleX = topX - width;
                }else{
                    circleX = topX;
                }

                if(newY < topY){
                    circleY = topY - height;
                }else{
                    circleY = topY;
                }

                var radius = Math.sqrt(width * width + height * height) /2; // 半径，勾股定理  
  
                // 设置圆的大小和位置  
                $circle.css("left", circleX + "px");  
                $circle.css("top", circleY + "px");  
                $circle.css("width", width + "px");  
                $circle.css("height", height + "px");  
                $circle.css("border-radius", radius + "px");
                $circle.css("line-height", height + "px");
            }  
        });  
  
        // 鼠标松开停止画圆  
        $(document).mouseup(function() {  
            isDrawing = false;  
        });  

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