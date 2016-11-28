$(function(){
var userSymbol;
var computerSymbol;
var winResult = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
var gamePanel = [[0,0,0],[0,0,0],[0,0,0]];
var pWins = 0,cWins = 0;
var positions=[];
var cTurn =false;
var computerWin = winResult.slice();
var playerWin = winResult.slice();
var userVal = -1,computerVal = 1;
var Tictatoe = function(){};
var gameOver = false;
var computerGoFirst = false;
var playerGoFirst = false;
var winLine = [];
function setPlayer(bt){
	userSymbol = bt.html();
	computerSymbol = userSymbol ==='X'?'O':'X';
	$('#left p:first').text("Player "+userSymbol+" Wins:");
	$('#right p:first').text("Computer "+computerSymbol+" Wins:");
	$('#symbol-container').css('display','none');
	$('#left,#right,.cell-container,.container').css('display','block');
}

function clearPanel(){
	$(".cell").html('');
	playerGoFirst = true;
	gameOver = false;

	gamePanel = [[0,0,0],[0,0,0],[0,0,0]];
	positions = [];

	for(var i = 0; i < winLine.length; i++) {
		$('.cell-'+winLine[i]).css('background','black');
	}
	winLine = [];

	computerWin = winResult.slice();
	playerWin = winResult.slice();
	if(userSymbol === "O"){
		computerGoFirst = true;
	}
	 
}

function getY(position){
	return position % 3;
}

function getX(position){
	return Math.floor(position / 3);
}

function updatePanel(position,val){
	gamePanel[getX(position)][getY(position)] = val;
	positions.push(position);
	player = (val === computerVal)?computerSymbol:userSymbol;
	$(".cell-"+position).html(player);
	updatePossibleWin(position,val);
	if(haveWiner(val)){
		gameOver = true;
		var winner = (val === computerVal) ? 'computer':'player';
		if(winner === 'computer'){
			cWins ++ ;
			highLight(winner);
			$('#right span').html(cWins);

			window.setTimeout(function(){
				clearPanel();
				ttt.play();
			},1000);

			
		}
		else{
			pWins ++;
			highLight(winner);
			$('#left span').html(pWins);

			window.setTimeout(function(){
				clearPanel();
				ttt.play();
			},1000);
		}
	}else if(draw()){
		gameOver = true;
		clearPanel();
	}
} 

function updatePossibleWin(position,val) { 
	if(val == -1) { //玩家
		$.each(computerWin,function(index,arr){
			if($.inArray(parseInt(position),arr) !== -1){
				computerWin[index] = undefined;
			}
		});
		computerWin = computerWin.filter(function(item){
			return item !== undefined;
		});
	}else {
		$.each(playerWin,function(index,arr){
			if($.inArray(parseInt(position),arr) !== -1){
				playerWin[index] = undefined;
			}
		});
		playerWin = playerWin.filter(function(item){
			return item !== undefined;
		});
	}
	
}

function highLight(winner){
	if(winner === 'computer'){
		for(var i = 0;i < winLine.length; i++){
			$('.cell-'+winLine[i]).css('background','red');
	  	}
	} else{
		for(var i = 0;i < winLine.length; i++){
			$('.cell-'+winLine[i]).css('background','green');
	  	}
	}
	
}

function checkWin(){
	for(var i = 0; i < computerWin.length; i++){
		if(computerLineOne(computerWin[i])){
			return true;
		}
	}
	return false;
}
function computerLineOne(cWinArr){
	var count = 0;
	for(var i = 0; i < cWinArr.length; i++){
		if(gamePanel[getX(cWinArr[i])][getY(cWinArr[i])] === 0){
			count++;
		}
	}
	return (count === 1);
}

function playerLineOne(pWinArr){
	var count = 0;
	for(var i =0;i < pWinArr.length;i++){
		if(gamePanel[getX(pWinArr[i])][getY(pWinArr[i])] === 0){
			++count;
		}
	}
	return (count === 1);
}
function findWinPos(){
	for(var i = 0; i < computerWin.length; i++){
		if(computerLineOne(computerWin[i])){
			for(var j = 0 ; j < computerWin[i].length;j++){
				var pos = computerWin.slice()[i][j];
				if(parseInt(gamePanel[getX(pos)][getY(pos)]) === 0){
					return pos;
				}
			}
		}
	}

}
function findDefendPos(){
	for(var i = 0; i < playerWin.length; i++){
		if(playerLineOne(playerWin[i])){
			for(var j = 0;j < playerWin[i].length; j++){
				var pos = playerWin.slice()[i][j];
				if(parseInt(gamePanel[getX(pos)][getY(pos)]) === 0){
					return pos;
				}
			}
		}
	}
}
function defend(){
	for(var i = 0 ;i<playerWin.length;i++) {
		if(playerLineOne(playerWin[i])){
			return true;
		}
	}
	return false;
}
function findEmpytPos() {
	// for(var i = 0; i < 3 ; i++) {
	// 	for(var j = 0; j < 3; j++) {
	// 		if(gamePanel[i][j]===0){
	// 			return i * 3 + j;
	// 		}
	// 	}
	// }
	var newArr = [];
	var gamePanelcopy = gamePanel.slice();
	gamePanel.join(',').split(',').forEach(function(ele,index,arr){
	 	if(ele == 0){
	  		newArr.push(index);
	  	}
	  });
	 var random = Math.floor(Math.random()*(newArr.length-1));
	 return newArr[random];
}
function haveWiner(val){
	for(var i = 0 ;i < winResult.length; i++) {
		var count = 0;
		for(var j = 0; j < winResult[i].length; j++) {
			var pos = winResult.slice()[i][j];
			if(parseInt(gamePanel[getX(pos)][getY(pos)]) === val) {
				count++;
			}
		}
		if(count === 3) {
			winLine = winLine.concat(winResult[i]);
			console.log(winLine);
			return true;
		}
	}
	return false;
}

function draw(){
	if((playerWin.length===0 && computerWin.length===0)||(playerWin.length ===1 &&computerWin.length ===0)){
		return true;
	}
	return false;
}
function  findmayWinStep(winArr,position){
	var cWinCopy = winArr.slice();
	var newArr = cWinCopy.join(',').split(',').map(function(ele){
		return parseInt(ele);
	}).filter(function(item,index,arr){
		return arr.indexOf(item) !== index && position.indexOf(item) === -1;
	});
	if(newArr.length !== 0 ){
		var random = Math.floor(Math.random()*newArr.length);
		return newArr[random];
	}else{
		return -1;
	}
}
Tictatoe.prototype = {
	init:function(){
		var self = this;
		$("#x").click(function(){
			setPlayer($(this));
			playerGoFirst = true;
		});
		$("#o").click(function(){
			setPlayer($(this));
			computerGoFirst = true;
			self.play();
		});
		$(".cell").click(function(){
			if($(this).html()==''){
				playerGoFirst = false;
				updatePanel(parseInt($(this).attr('data-value')),userVal);
				cTurn = true;
				if(gameOver === false){
					self.play();
				}
			}
		});
		$(".newGame").click(function(){
			clearPanel();
			ttt.play();
		});
		$(".reset").click(function(){
			oWins = 0;
			xWins = 0;
			$("#left span,#right span").html('0');
			clearPanel();
			ttt.play();
			
		});
	},
	play:function() {
		if(checkWin()) {
			var winPosition = findWinPos();
			updatePanel(winPosition,computerVal);
		}
		else if(defend()) {
			if(playerWin.length === 1 && cTurn &&computerWin.length ===0) {
				return;
			}else {
				console.log('need defend');
				var defendPos = findDefendPos();
				updatePanel(defendPos,computerVal);
			}

		}else if(computerGoFirst) {
			console.log('first');
			var randomArr = [0,2,4,6,8];
			var random = randomArr[Math.floor(Math.random()*5)];
			updatePanel(parseInt(random),computerVal);
			computerGoFirst = false;
			return;
		}else {
			if(!playerGoFirst){
				console.log('other');
				if(gamePanel[1][1]===0) {
					updatePanel(parseInt($('.center-middle').attr('data-value')),computerVal);
				}
				else if (gamePanel[1][1]!==0 && findmayWinStep(computerWin,positions)!== -1 && cTurn){
					var pos = findmayWinStep(computerWin,positions);
					console.log(1);
					cTurn = false;
					updatePanel(pos,computerVal);
				}
				else {
					updatePanel(findEmpytPos(),computerVal);
				}
			}
		}
	}
}
var ttt = new Tictatoe();
ttt.init();
});
