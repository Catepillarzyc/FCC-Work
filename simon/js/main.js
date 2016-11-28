var Simon = function() {

	//
	var powerB = false;
	var started = false;
	var userTurn = false;
	var orders = [];
	var round = 0;
	var counter;
	var pCount = 0;
	var sFlag = false;
	var comPIn;
	var comPOut;

	//Audios
	var green = document.createElement('audio');
		green.src = "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3";
		green.autoPlay = false;
		green.preLoad = true;
	var red = document.createElement('audio');
		red.src = "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3";
		red.autoPlay = false;
		red.preLoad = true;
	var blue = document.createElement('audio');
		blue.src = "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3";
		blue.autoPlay = false;
		blue.preLoad = true;
	var yellow = document.createElement('audio');
		yellow.src = "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3";
		yellow.autoPlay = false;
		yellow.preLoad = true;


	this.powerButton = function() {
		var bool = {
			'false' : function(){
				powerB = true;
				$('#power').css('backgroundColor','#75F8FA');
				$('.ss-input').fadeIn(1000);
				$('.strict,.go,.display,.controls').css('visibility','visible');
			},
			'true' : function(){
				powerB = false;
				reset();
				$('#power').css('backgroundColor','black');
				$('.strict,.go,.display,.controls').css('visibility','hidden');
				$('.ss-input').fadeOut(1000);
			}
		};
		(bool[powerB])();
	}

	this.computerTurn = function() {
		userTurn = false;
		var round = orders.length + 1;
		if( round < 10 ) {
			round = '0' + round;
		}
		$('.display').text(round);
		if( orders.length < 20 ) {
			setOrders();
			playAnimate();
			counter = 0;
		} else {
			endGame();
		}
	}

	function setOrders() {
		var color = Math.floor( Math.random() * 4 );
		switch(color) {
			case 0:
				color = 'g';
				break;
			case 1:
				color = 'r';
				break;
			case 2:
				color = 'b';
				break;
			case 3:
				color = 'y';
				break;
			default:
				break;
		}
		orders.push(color);
	}

	function playAnimate() {
		if( orders.length > 12 ) {
			playDelay = 350;
		} else if ( orders.length > 8 ) {
			playDelay = 550;
		} else if ( orders.length > 4 ) {
			playDelay = 800;
		} else {
			playDelay = 1000;
		}

		runPA();

		function runPA() {
			comPIn = setTimeout(function() {
				$('.ss-' + orders[pCount]).addClass('on');
				switch(orders[pCount]) {
					case 'g':
						green.play();
						break;
					case 'r':
						red.play();
						break;
					case 'b':
						blue.play();
						break;
					case 'y':
						yellow.play();
					default:
						break;
				}

				comPOut = setTimeout(function(){
					$('.ss-' + orders[pCount]).removeClass('on');
					pCount++;
					if(pCount < orders.length) {
						runPA();
					} else {
						userTurn = true;
						pCount = 0;
					}
				},300);
			},playDelay);
		}
	}
 	
	function reset() {
		orders = [];
		userTurn = false;
		pCount = 0;
		round = 0;
		started = false;
		counter = 0;
		$('.ss-input').css('backgroundColor','black');
		$('.display').text('- -');
		$('#start').css('backgroundColor','black');
	}

	function endGame() {
		setTimeout(function() {
			$('.display').text('You Win');
			displayBlink();
			setTimeout(function() {
				$('.display').text('- -');
				game.powerButton();
			},500);
		},600);
		

	}

	$('.ss-input').on('click',function(e) {
		var targetId = e.target.id;
		e = window.event || event;
		
		if(e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble();
		}

		if(e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}

		if(userTurn === true) {
			if( targetId !== orders[counter] ){
				userTurn = false;
				$('.display').fadeOut(500);
				$('.display').fadeIn(500);

				var setInt = setInterval(displayBlink,1000);

				setTimeout(function() {
					clearInterval(setInt);
					if( sFlag === true ) {
						reset();
					} else {
						playAnimate();
						counter = 0;
					}
				},3500);
			} else {
				$('.ss-' + targetId).addClass('on');
				switch(targetId){
					case 'g':
						green.play();
						break;
					case 'r':
						red.play();
						break;
					case 'b':
						blue.play();
						break;
					case 'y':
						yellow.play();
						break;
				}

				setTimeout(function() {
					$('.ss-'+targetId).removeClass('on');
					counter++;
					if(counter === orders.length) {
						game.computerTurn();
					}
				},300);
			}
		}else {
			return;
		}
	});

	function displayBlink() {
		$('.display').fadeOut(500);
		$('.display').fadeIn(500);
	}

	this.strictToggle = function() {
		switch(sFlag) {
			case false:
				$('#mode').css('backgroundColor','#75F8FA');
				reset();
				sFlag = true;
				break;
			case true:
				$('#mode').css('backgroundColor','black');
				reset();
				sFlag = false;
				break;
		}
	}


	this.isStarted = function() {
		return started;
	}

	this.setStarted = function() {
		started = true;
	}

}

var game = new Simon();

$('#power').on('click',game.powerButton);
$('#start').on('click',function(){
	if( !game.isStarted() ) {
		game.setStarted();
		game.computerTurn();
		$('#start').css('backgroundColor','#75F8FA');
	}
})
$('#mode').on('click',game.strictToggle);

