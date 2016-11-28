var Calculator = function(input) {
	var total;
	var reg = /\d+/g;

	this.run = function(input) {
		var expression = input.split(' ');
		console.log(input);

		// if(expression[0] === '' && total !== ''){
		// 	expression[0] = total.toString();
		// }

		for(var i = 0; i < expression.length; i++) {
			if( expression[i].match(reg) ) {
				expression[i] = parseFloat(expression[i]);
			}
		}

		for( var i = 0; i < expression.length; i++) {
			switch(expression[i]) {
				case '*' :
					expression[i-1] = expression[i-1] * expression[i+1];
					expression.splice(i,2);
					i--;
					break;
				case '/':
					expression[i-1] = expression[i-1] / expression[i+1];
					expression.splice(i,2);
					i--;
					break;
			}
		}

		for( var i = 0; i < expression.length; i++) {
			switch(expression[i]) {
				case '+' :
					expression[i-1] = expression[i-1] + expression[i+1];
					expression.splice(i,2);
					i--;
					break;
				case '-':
					expression[i-1] = expression[i-1] - expression[i+1];
					expression.splice(i,2);
					i--;
					break;
			}
			
		}


		total = expression[0];
		calc.resize(total);

		return total;

	};


	this.resize = function(total) {
		if(total.toString().length > 10) {
			$('#screen').css('fontSize','2.5em');
		}
	}

	this.percent = function(input) {
		var expression = input.split(' ');
		var lastEntry = expression.length - 1;
		if( expression[lastEntry].match(reg) !== null&& lastEntry === 0) {
			return expression[lastEntry] / 100;
		} else if(expression[lastEntry].match(reg) !== null && input!== '') {
			expression = expression.join(' ');
			return calc.run(expression) /100;
		} else {
			return input;
		}
	}

	this.negative = function(input) {
		if(input === '') {
			return input;
		} else {
			var expression = input.split(' ');
			var lastEntry = expression.length - 1;
			if(expression[lastEntry].match(reg)) {
				expression[lastEntry] = expression[lastEntry] * (-1);
				expression = expression.join(' ');
				return calc.run(expression);
			} else {
				return input;
			}
		}

	}

	this.clearAll = function(){
		total = 0;
		return total;
	}
}
var result = $('#screen').text();
var calc = new Calculator(result);
var lastClicked = '';
var numCount = 0;
var pointCount = 0;
$('button').on('click',function(e) {
	var screen = $('#screen').text();
	var id = $(this).prop('id');
	var theClass = $(this).prop('class');
	var value =$(this).text();
	calc.resize(screen);
	if( theClass === 'operator') {
		value = $(this).prop('value');
		if(lastClicked === 'operator') {
			screen = screen.slice(0,(screen,length-2));
			screen = screen.concat(value + ' ');
			$('#screen').text(screen);
		} else {
			console.log(1);
			$('#screen').append(' ' + value + ' ');
		}
		lastClicked = 'operator';

	} else if( theClass === 'num' && numCount < 13) {
		$('#screen').append(value);
		numCount++;
		lastClicked = 'num';
	}
});

$('#point').on('click',function() {
	if(pointCount === 0) {
		$('#screen').append('.');
		pointCount++;
		lastClicked = 'point';
	} else if(lastClicked !== 'point' && pointCount > 0) {
		$('#screen').append('.');
		pointCount--;
		lastClicked = 'point';
	}
});

$('#precent').on('click',function() {
	result = $('#screen').text();
	$('#screen').text(calc.percent(result));
	lastClicked = 'precent';
	numCount = 0;
})

$('#pAn').on('click',function() {
	result = $('#screen').text();
	$('#screen').text(calc.negative(result));
})

$('#equal').on('click',function() {
	result = $('#screen').text();
	$('#screen').text(calc.run(result));
	lastClicked = 'equal';
	numCount = 0;
	pointCount = 0;
})

$('#allClear').on('click',function() {
	$('#screen').text('');
	calc.clearAll();
	lastClicked = 'ac';
	numCount = 0;
	pointCount = 0;
})














