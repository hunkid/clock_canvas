//  ****************************************************************************************************
//  THIS PROGRAM IS FREE SOFTWARE, NOT USED FOR COMMERCIAL PURPOSE , BUT FOR STUDY AND COMMUNICATION.
//	IF YOU USE THIS PROGRAM, YOU NEED KEEP THIS STATEMENT.
//  Author: hunkid
//	Email: 	uboyboyu@163.com
// 	Date : 	2016-11-23
//  Copyright © 2016. hunkid. All rights reserved.
//	****************************************************************************************************

var drawing = document.getElementById("drawing");
var ctx = drawing.getContext("2d");
var clock = {
	innerRad :  200,
	outerRad : 220,
	center : [230,230],
	setClock : function(){
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.arc(clock.center[0],clock.center[0],clock.innerRad,0,2*Math.PI,false);
		ctx.stroke();
		ctx.closePath();
		ctx.lineWidth = 18;
		ctx.beginPath();
		ctx.arc(clock.center[0],clock.center[0],clock.outerRad,0,2*Math.PI,false);
		ctx.stroke();
		ctx.closePath();
		ctx.save();
	},
	setNumber : function(){
		ctx.font = "bold 28px Sans-Serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		var pos = [];
		pos[0] = clock.center[0];
		pos[1] = clock.center[1]-clock.innerRad +16; 
		for(var i= 1;i < 13;i++){
			pos = countNexPos(pos,30);
			ctx.fillText(i,pos[0],pos[1]);
		}
	}
}

function Hand(length,lineWidth){
	this.length = length;
	this.lineWidth = lineWidth;
}
Hand.prototype.setOrigin = function(){
	this.curPos = [];
	this.curPos[0] = clock.center[0];
	this.curPos[1] = clock.center[1] - this.length;
};
Hand.prototype.setPos = function(curPos){
	ctx.beginPath();
	ctx.moveTo(clock.center[0],clock.center[1]);
	ctx.lineWidth = this.lineWidth;
	ctx.lineTo(this.curPos[0],this.curPos[1]);
	ctx.stroke();
	ctx.closePath();
};

function countNexPos(curPos , theta){  //curPos:[x1,y1],theta:角度值
	var nexPos = [];
	nexPos[0] = (curPos[0]-clock.center[0])*Math.cos(theta / 180 * Math.PI) - (curPos[1] - clock.center[1]) * Math.sin(theta / 180 * Math.PI) +clock.center[0];
	nexPos[1] = (curPos[0]-clock.center[0])*Math.sin(theta / 180 * Math.PI) + (curPos[1] - clock.center[1]) * Math.cos(theta / 180 * Math.PI) +clock.center[1];
	return nexPos;
}

function getNowTime(){
	var date = new Date();
	var time = {
		hour : date.getHours(),
		minu : date.getMinutes(),
		sec : date.getSeconds()
	}
	return time;
}

function setTime(time,handSec,handMinu,handHour){
	var thetaSec = time.sec / 60 * 360;
	var thetaMinu = time.minu / 60 * 360 + thetaSec / 60;
	var thetaHour = time.hour / 12 * 360 + thetaMinu / 12;
	handSec.curPos = countNexPos(handSec.curPos,thetaSec);
	handMinu.curPos = countNexPos(handMinu.curPos,thetaMinu);
	handHour.curPos = countNexPos(handHour.curPos,thetaHour);
}

window.onload = function(){
	clock.setClock();
	clock.setNumber();
	var handHour = new Hand(80,7);
	var handMinu = new Hand(150,4);
	var handSec = new Hand(170,1);
	handHour.setOrigin();//将初始坐标指向12时刻
	handMinu.setOrigin();
	handSec.setOrigin();
	var time = getNowTime();
	setTime(time,handSec,handMinu,handHour);
	handSec.setPos();
	handMinu.setPos();
	handHour.setPos();
	setInterval(function(){
		ctx.clearRect(0,0,drawing.width,drawing.height);
		clock.setClock();
		clock.setNumber();
		handSec.curPos = countNexPos(handSec.curPos,360/60);
		handSec.setPos();
		handMinu.curPos = countNexPos(handMinu.curPos,360/3600);
		handMinu.setPos();
		handHour.curPos = countNexPos(handHour.curPos,360/3600/12);
		handHour.setPos();
	},1000);
}