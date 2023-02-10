function plane(box){  //定义变量和执行函数
	this.btns = box.getElementsByTagName("button");//获取按钮元素
	this.btns[0].onclick=this.play.bind(this);  //按钮按下触发函数
	this.meplane = document.getElementById("meplane");	//获取我方飞机
	this.box=box;   //把box传进来
	this.divs = box.children; //获得所有DIV元素
};

plane.prototype = { //函数
	play:function(){
		this.divs[1].style.display="none";//进入游戏
		this.move(); //我方飞机触发移动函数
		this.bullter();  //我方炮弹
		this.foe(); //生成地方飞机
	},
	sky:function(){
		var n = this.sky.offsetTop;
		n++;
		if( n==0 ){
			 n=-1498;
		}
		this.sky.style.top=n+"px";
	},
	move:function(e){
		var that=this;
		this.box.onmousemove=(e)=>{	//在box下移动时触发函数
			var x=(e.clientX-this.box.offsetLeft);
			var y=(e.clientY-this.box.offsetTop);
			x-=40; 
			y-=50;
			this.meplane.style.left= x +"px";
			this.meplane.style.top= y +"px";
			
		};
	},
	Foeboom:function(meplane){ //碰撞效果检测
				// console.log(meplane);
				var  foeS = document.getElementsByClassName("foe"); //根据class名获取元素
				var len = foeS.length; //求元素的长度
				for( var i =0 ;i<len;i++ ){  
					var foe = foeS[i]  
					if( this.peng( meplane,foe) &&foe.die!=1 ){
						var el = foe.querySelector('.HP'); //根据class获取血条
						var n = el.offsetWidth;
						n -= 10 ;
						if(n<=0)n=0;
						el.style.width=n+"px";  //通过减去它的宽度来达到可视减血效果 
						if ( n<=0 ){    //当血条清零时 
						foe.die=1
							foe.querySelector('img').src="images/destroy.gif"; 
							setTimeout(function(foe){ 
								clearInterval(foe.timer); 
								this.divs[0].removeChild(foe) 
							}.bind(this,foe),300) 
						} 
					
					
					}
				}
			
	},
	bullter:function(){  //发射子弹
		var than = this;
		than.box.oncontextmenu = function(){//取消鼠标右键
			return false;
		};
		than.box.onmousedown=function(e){
			if( e.button == 0 ){ //鼠标左键被按下时
				var img=document.createElement("img");
				img.src="images/ATK.png"
				img.className="ATK";
				than.divs[0].appendChild(img)
				img.style.top= than.meplane.offsetTop+"px" ;
				img.style.left= than.meplane.offsetLeft+33+"px" ;
				
				function move(){//子弹向前飞
					var n =img.offsetTop;
					// console.log(n)
					n-=10;
					img.style.top=n+'px';
					if( n<=-20 ){  //子弹到一定位置的时候销毁
						than.divs[0].removeChild(img)
						clearInterval(img.time);
					};
					BOOM(img);//碰撞效果 把每个子弹通过参数的形式传进去
				};
				img.time=setInterval(move,20); //把定时器付给一个变量上
				
			};
			
			function BOOM(bullter){
				var  foeS = document.getElementsByClassName("foe"); //根据class名获取元素
				var len = foeS.length; //求元素的长度
				for( var i =0 ;i<len;i++ ){  
					var foe = foeS[i]  
					if( than.peng( bullter,foe) &&foe.die!=1 ){ //当谋颗子弹和某架飞机碰撞时
						clearInterval(img.time)  //销毁飞机，这里的img.time。因为img是子弹，通过参数的形式传了进来，所以才能获取另外一个函数的变量
						than.divs[0].removeChild(bullter); //销毁子弹
						var el = foe.querySelector('.HP'); //根据class获取血条
						var n = el.offsetWidth;
						n -= 100 ;
						if(n<=0)n=0;
						el.style.width=n+"px";  //通过减去它的宽度来达到可视减血效果 
						if ( n<=0 ){    //当血条清零时 
						foe.die=1
							foe.querySelector('img').src="images/destroy.gif"; 
							setTimeout(function(foe){ 
								clearInterval(foe.timer); 
								than.divs[0].removeChild(foe) 
							}.bind(this,foe),300) 
						} 
					} 
				}; 
			}
			return false;
		};
	},
	peng: function peng(bullter,foe){  //碰撞效果 
				var bl=bullter.offsetLeft;
				var bt=bullter.offsetTop;
				var bw=bullter.offsetWidth;
				var bh=bullter.offsetHeight;
				var fl=foe.offsetLeft;
				var ft=foe.offsetTop;
				var fw=foe.offsetWidth;
				var fh=foe.offsetHeight;
				if( bl+bw>fl && bl<fl+fw && bt+bh>ft && bt<ft+fh ){
					return true;
				}else{
					return false;
				}
		},
	foe:function(){ //敌人的函数
		var foeAttr={ //敌人的信息:它的样子，宽,高,移速,血量
			"foe1":['fod.png',44,67,10,40],
			"foe2":['big boss.png',152,115,5,150],
			"foe3":['boss.png',171,111,1,170],
		}
		var that=this;
		function createfor(){//创建敌机
			var n=-80; //初始位置
			var div = document.createElement('div');
			div.className="foe";
			var arr=[3,2,1,1,1,1,1,1,1,1,1,1,1,1];
			// var h = arr[parseInt(Math.random()*arr.length)];// var foe=foeAttr["foe"+h]
			var foe=foeAttr["foe"+arr[parseInt(Math.random()*arr.length)]] //通过下标的方式，随机派出飞机
			that.divs[0].appendChild(div);
			div.style.left=parseInt(Math.random()*(480-(foe[1])))+"px"; //随机位置派出飞机，盒子宽带减去飞机的宽度
			div.style.top=n+"px";
			div.style.width=foe[1]+"px";
			div.style.height=foe[2]+"px";
			var img = document.createElement("img");  
			img.src="images/"+foe[0];		//给飞机添加样式
			div.appendChild(img);           //把飞机添进盒子里
			var HP = document.createElement("div");	 	//创建血条
			div.appendChild(HP);			//血条添进盒子里
			HP.style.width=foe[4]+"px";		
			HP.className="HP";				//给血条起名字
			var HPval = document.createElement('div');		
			HP.appendChild(HPval);
			function move(){
				n+=foe[3];
				div.style.top= n+"px";
				if(n>=850 && div.die !=1){
					clearInterval(div.timer);
					that.divs[0].removeChild(div)
				}
			that.Foeboom(that.meplane); //检测我方飞机和敌方飞机
			}
			div.timer=setInterval(move,90)
		}
		setInterval(createfor,500);
	},
	
};

new plane(box);