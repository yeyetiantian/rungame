//人物
function person(canvas,cobj,runImages,jumpImages,walkImages,speedState){
    this.canvas=canvas;
    this.cobj=cobj;
    this.runImages=runImages;
    this.jumpImages=jumpImages;
    this.walkImages=walkImages;
    this.state="runImages";
    this.status=0;
    this.width=150;
    this.height=200;
    this.x=0;
    this.y=canvas.height-this.height-90;
    this.inty=this.y;
    this.speed=5;
    this.speedState=speedState;

}
person.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.beginPath();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this[this.state][this.status],0,0,110,120,0,0,this.width,this.width);
        this.cobj.closePath();
        this.cobj.restore();
    }
};
//障碍物
function hinder(canvas,cobj,hinderImages){
    this.canvas=canvas;
    this.cobj=cobj;
    this.hinderImages=hinderImages;
    this.width=100;
    this.height=100;
    this.x=canvas.width+100;
    this.y=canvas.height-this.height-140;
    this.speed=5;
    this.status=0;
}
hinder.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.beginPath();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hinderImages[this.status],0,0,200,200,0,0,this.width,this.width);
        this.cobj.closePath();
        this.cobj.restore();
    }
};
//游戏主体
function game(canvas,cobj,runImages,jumpImages,walkImages,hinderImages,speedState,score,life){
    this.canvas=canvas;
    this.cobj=cobj;
    this.clientW=canvas.width;
    this.clientH=canvas.height;
    this.person=new person(canvas,cobj,runImages,jumpImages,walkImages,speedState);
    this.hinderImages=hinderImages;
    this.hinderArr=[];
    this.time=30;
    this.step=0;
    this.score=0;
    this.life=10;
    this.scoreobj=score;
    this.lifeobj=life;
    this.backspeed=4;
    this.play();
}
game.prototype={
    play:function(){
        this.key();
        var num=0;
        var that=this;
        var num1=0;
        var step=6000;
        var backspeed=0;
        setInterval(function(){
            that.step+=that.time;
            that.cobj.clearRect(0,0,that.clientW,that.clientH);
            /*if(that.score>2&&that.score<=4){
                that.person.speedState="normal";

            }else if(that.score>4){
                that.person.speedState="fast";

            }*/
            //人物
            if(that.person.speedState=="slow"){
                if(that.step%120==0){
                    num++;
                    that.person.x+=that.person.speed;
                }
                for(var i=0;i<that.hinderArr.length;i++){
                    that.hinderArr[i].speed=4;
                }

            }else if(that.person.speedState=="normal"){
                if(that.step%90==0){
                    num++;
                    that.person.x+=that.person.speed;
                }
                for(var i=0;i<that.hinderArr.length;i++){
                    that.hinderArr[i].speed=5
                }
                that.backspeed=5;
            }else if(that.person.speedState=="fast"){
                if(that.step%60==0){
                    num++;
                    that.person.x+=that.person.speed;
                }
                for(var i=0;i<that.hinderArr.length;i++){
                    that.hinderArr[i].speed=7
                }
                that.backspeed=7;
            }

            if(that.person.x>that.clientW/4){
                that.person.x=that.clientW/4
            }
            if(that.person.state=="jumpImages"){
                that.person.status=0;
            }else{
                that.person.status=num%4;
            }
            that.person.draw();

            //障碍物
            if(num1%step==0){
                num1=0;
                step=parseInt(5+25*Math.random())*300;
                var hinderobj=new hinder(that.canvas,that.cobj,that.hinderImages);
                hinderobj.status=Math.floor(that.hinderImages.length*Math.random());
                    if(that.hinderArr.length==0){
                        hinderobj.flag=true;
                    }
                    that.hinderArr.push(hinderobj)
                if(that.hinderArr.length>10){
                    that.hinderArr.shift();
                }
            }

            for(var i=0;i<that.hinderArr.length;i++){
                that.hinderArr[i].x-=that.hinderArr[i].speed;
                that.hinderArr[i].draw();
                if(that.hinderArr[i].flag){
                    if(that.hinderArr[i].x+that.hinderArr[i].width<that.person.x){
                        if(!that.hinderArr[i].score){
                            that.score++;
                            that.hinderArr[i].score=true;
                            that.scoreobj.innerHTML=that.score;
                        }
                        if(that.hinderArr[i+1]){
                         that.hinderArr[i].flag=false;
                         that.hinderArr[i+1].flag=true;
                         }
                    }
                    if(hitPix(that.canvas,that.cobj,that.person,that.hinderArr[i])){
                        if(!that.hinderArr[i].life){
                            that.life--;
                            that.hinderArr[i].life=true;
                            that.lifeobj.innerHTML=that.life;
                        }
                        if(that.life<=0){
                            alert("重新开始");
                            location.reload();
                        }

                    }
                }
            }
            num1+=that.time;
            backspeed+=that.backspeed;
            that.person.canvas.style.backgroundPositionX=-backspeed+"px";
        },that.time)
    },
    key:function(){
        var that=this;
        var flag=true;
        document.onkeydown=function(e){
            var code= e.keyCode;
            if(code==32){

                if(!flag){
                    return;
                }
                that.person.state="jumpImages";
                flag=false;
                var inita=0;
                var speeda=2;
                var zhangh=250;
                var zhongli1=0.1;
                var zhongli2=0.2;
                var t=setInterval(function(){
                    inita+=speeda;
                    if(inita>180){
                        flag=true;
                        if(that.score>5){
                            that.person.state="runImages";
                        }else{
                            that.person.state="runImages";
                        }
                        clearInterval(t);
                    }
                    if(inita<90){
                        speeda-=zhongli1;
                        if(speeda<2){
                            speeda=2;
                        }
                    }else{
                        if(speeda<5){
                            speeda=5;
                        }
                        speeda+=zhongli2;
                    }
                    var y=Math.sin(inita*Math.PI/180)*zhangh;
                    that.person.y=that.person.inty-y;
                    if(that.person.y>that.person.inty){
                        that.person.y=that.person.inty
                    }
                },that.time)
            }
        }
    }
};
