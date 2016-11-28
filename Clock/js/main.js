function pomodoro() {
	var breakTime = $('#break .time').text();
	var workTime = $('#work .time').text();
	var h = 0;
	var m = 0;
	var s = 0;
	var flag;
	var setInt;
	var roundTime = 1;
	var hasStarted;
	var percentCurrent = 0;
	var percentBase = 0;
	var percentComplete = 0;

	var circlePath = new ProgressBar.Circle('#progress',{
		color: 'rgb(201,44,19)',
		strokeWidht: 1,
		easing: 'linear',
		duration: 1000,
		step: function(state,circle) {
			if(flag == 'work') {
				circle.path.setAttribute('stroke', 'rgb(201,44,19)');
			} else  {
				circle.path.setAttribute('stroke', 'rgb(0,200,63)');
			}
		}
	});
	
	function countDown() {
		h = parseInt(h);
		m = parseInt(m);
		s = parseInt(s);
		if(s >= 0) {
			if(s-1 === -1 && m > 0) {
				if( m-1 === -1 && h > 0) {
					h--;
					m = 59;
					updateTimer();
				} else {
					m--;
					s = 59;
					updateTimer();
				}
			} else if ( s-1 === -1 && m === 0 && h === 0) {
				advanceCycle();
			} else {
				s--;
				updateTimer();
			}
		}
	}

	function advanceCycle() {
		if( roundTime ===4 && flag ==='work' ) {
			endPomo();
		} else {


			if(flag === 'work' && roundTime < 5) {
				flag = 'break';
				$('#current-status').text('Break!');
				circlePath.set(0);
			} else if (flag === 'break' && roundTime < 5) {
				flag = 'work';
				$('#current-status').text('Work');
				circlePath.set(0);
				advanceCycleUI();
			}

			if(flag === 'work' && roundTime < 5) {
				if(workTime > 60) {
					h = Math.floor(workTime /60);
					m = workTime % 60;
					$('#current-time').text(h + ' : ' + m +' : ' + s);
					updateTimer();
				} else {
					m = workTime - 1;
					if( m < 10 ) {
						m = '0' + m;
					}
					s = 59;
					$('#current-time').text(h + ' : ' + m + ' : ' + s);
					updateTimer();
				}
			} else if (flag === 'break' && roundTime < 5) {
				if(breakTime > 60) {
					h = Math.floor(breakTime /60);
					m = breakTime % 60;
					$('#current-time').text(h + ' : ' + m +' : ' + s);
					updateTimer();
				} else {
					m = breakTime - 1;
					if ( m < 10 ) {
						m = '0' + m;
					}
					s = 59;
					$('#count-down').text(m + ' : ' + s);
          			updateTimer();
				}
			}
		}
	}

	function advanceCycleUI() {
		if(roundTime < 4) {
			roundTime++;
			$('#round-time').text('Round ' + roundTime + ' /4');
		} else if(roundTime ===4 ){
			$('#round-time').text('Round 4 / 4');
			roundTime++;
		}

	}

	function endPomo() {
		clearInterval(setInt);
		$('#current-status').text('Done');
	}

	function timeCheck(value) {
		if(value < 10 && value.toString().length < 2){
			value = '0' + value;
		}
		return value;
	}


	function updateTimer() {
		percentCurrent = (s + (m*60) + (h*60*60));
		if( flag === 'work' ) {
			percentBase = (workTime * 60);
		} else {
			percentBase = (breakTime * 60);
		}
		percentComplete = 1 - ( percentCurrent / percentBase );
		circlePath.animate(percentComplete);

		h = timeCheck(h);
		m = timeCheck(m);
		s = timeCheck(s);

		if(workTime > 60) {
			$('#current-time').text(h + ' : ' + m + ' : ' + s);
		} else {
			$('#current-time').text(m + ' : ' + s);
		}
	}

	$('.increment').on('click', function(e) {
		var nodes = {
			'break' : function(){
				breakTime++;
				$('#break .time').text(breakTime);
				$('#current-time').text(workTime + ': 00');
				if(hasStarted) {
					$('#start').toggle();
					$('.running').toggle();
					hasStarted = false;
				}
				$('#current-status').text('');
				clearInterval(setInt);
				setInt = false;
				circlePath.set(0);
			},

			'work':function() {
				workTime++;
				$('#work .time').text(workTime);
				$('#current-time').text(workTime + ': 00');
				if(hasStarted) {
					$('#start').toggle();
					$('.running').toggle();
					hasStarted = false;
				}
				$('#current-status').text('');
				clearInterval(setInt);
				setInt = false;
				circlePath.set(0);
			}
		};
		var nodeId = $(this).parent()[0].attributes[0].nodeValue;
		if(typeof nodes[nodeId] !== 'function') {
			return false;
		} 
		(nodes[nodeId])();
		
	});

	$('.decrement').on('click', function(e) {
		var nodes = {
			'break' : function(){
				if(breakTime > 1) {
					breakTime--;
					$('#break .time').text(breakTime);
					$('#current-time').text(workTime + ' :00');
					if(hasStarted) {
						$('#start').toggle();
						$('.running').toggle();
						hasStarted = false;
					}
					$('#current-status').text('');
					clearInterval(setInt);
					setInt = false;
					circlePath.set(0);
				}
			},

			'work':function() {
				if( workTime > 1 ) {
					workTime--;
					$('#work .time').text(workTime);
					$('#current-time').text(workTime + ': 00');
					if(hasStarted) {
						$('#start').toggle();
						$('.running').toggle();
						hasStarted = false;
					}
					$('#current-status').text('');
					clearInterval(setInt);
					setInt = false;
					circlePath.set(0);
				}
			}
		};
		var nodeId = $(this).parent()[0].attributes[0].nodeValue;
		if(typeof nodes[nodeId] !== 'function') {
			return false;
		} 
		(nodes[nodeId])();
		
	});

	$('.running').toggle();
	$('#start').on('click',function(e) {
		hasStarted = true;
		if( workTime > 60 ) {
			h = Math.floor(workTime / 60);
			m = workTime % 60;
			$('#current-time').text(m + ': ' + s);
		} else {
			m = workTime - 1;
			if( m < 10) {
				m = '0' + m;
			}
			s = 59;
			$('#current-time').text(m + " : " + s);
		}
		$('#start').toggle();
		$('.running').toggle();
		flag = 'work';
		$('#current-status').text('Work');
		updateTimer();
		setInt = setInterval(countDown,1000);
		$('#round-time').text('Round ' + roundTime + ' / 4');
	});

	$('#pause').on('click',function(e){
		if($('#pause').text() === 'Pause') {
			$('#pause').text('Resume');
			clearInterval(setInt);
			setInt = false;
		} else {
			$('#pause').text('Pause');
			setInt = setInterval(countDown,1000);
		}
	});

	$('#reset').on('click',function(e){
		clearInterval(setInt);
		setInt = false;
		hasStarted = false;
		roundTime = 1;
		percentComplete = 0;
		circlePath.set(0);
		$('#current-time').text(workTime + ' : 00');
		$('#current-status').text('');
		$('#round-time').text('Round 1 / 4');
		$('#start').toggle();
		$('.running').toggle();
		$('#pause').text('Pause');
	})



}
pomodoro();