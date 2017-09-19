// Функция вовращает случайное число в диапозоне от min до max
function randInt(min, max) {
	var rand = min - 0.5 + Math.random() * (max - min + 1)
	rand = Math.round(rand);
	return rand;
}

// Функция возвращает тег mo со значением val 
function createMo(val) {
	var el = document.createElement('mo');
	el.innerText = val;
	return el;
}

// Функция возвращает тег mi со значением val
function createMi(val) {
	var el = document.createElement('mi');
	el.innerText = val;
	return el;
}

// Функция возвращает случайный знак
function createRandSign() {
	var sign;
	if(randInt(1,10) % 2) {
		if( randInt(1,10) % 2 ) {
			sign = '+';
		} else {
			sign = '-';
		}
	} else {
		sign = '*';
	}
	return {
		sign: sign,
		signWithTag: createMo(sign)
	}
}

// Функция возвращает тег mo с случайным числом 
function createMoRandom() {
	return createMo( randInt(1,100) );
}

// Функция возвращает тег mrow
function createMrow() {
	var el = document.createElement('mrow');
	return el;
}

// Функция возвращает тег mfrac
function createMfrac() {
	var el = document.createElement('mfrac');
	return el;
}

// Функция возвращает тег frac, с двумя тегами mrow внутри, которые содержат значения numerator и denomerator соответственно
function createFrac(numerator, denomerator) {
	var frac = createMfrac();
	var numer = createMrow();
	var denomer = createMrow();

	frac.appendChild(numerator);
	frac.appendChild(denomerator);

	return frac;
}

// Функция возвращает тег fracm с двумя тегами mrow внутри, которые содержат случайные числа
function createFracRand() {
	var frac = createMfrac();
	var numer = createMrow();
	var denomer = createMrow();

	numer.appendChild(createMoRandom());
	denomer.appendChild(createMoRandom());

	frac.appendChild(numer);
	frac.appendChild(denomer);

	return frac;
}

// Функция возвращает все простые числа от 2 до limit
var simpleNumbers = [2, 3];
function getSimpleNumbers(limit) {
	var i = (simpleNumbers.length == 0) ? 0 : simpleNumbers[ simpleNumbers.length - 1 ];

	if( i > limit ) {
		for (var k = 0; ; k++) {
			if( simpleNumbers[k] > limit ) {
				return simpleNumbers.slice(0, k);
				break;
			}
		}
	}

	for (; i <= limit; i++) {
		var flag = true;

		for (var j = 0; j < simpleNumbers.length; j++) {
			if( i % simpleNumbers[j] == 0 ) {
				flag = false;
				break;
			}			
		}		
		if( flag ) {
			simpleNumbers.push(i);
		}
	}


	return simpleNumbers;
}

// Функция принимает два аргумента и максимально сокращает их. В
// Функция возвращает объект с двумя свойствами n и d (числитель и знаменатель)
function reduceFrac(numerator, denomerator) {
    var a = numerator, b = denomerator;
    while (a) {
        let c = b % a;
        b = a;
        a = c;
    }

    return {
    	n: numerator / b, 
    	d: denomerator / b
    }
}

// Функция возвращает тег mrow, который является сложной строкой, состоящей из дробей, чисел, дробей состоящих из дробей, которые могут состоять из других дробей и т.д.
// Многоуровневость дробей зависит от аргумента limit
function createDifMrow(limit) {
	var row = {
		row: createMrow(),
		rowVal: 0
	};
	var rowExpression = [];

	for(var i = 0; i <= randInt(1,3); i++) {
		if(i != 0) {
			var sign = createRandSign();
			row.row.appendChild( sign.signWithTag );
			rowExpression.push(sign.sign);
		}

		if(randInt(0,1)) {
			if(limit >= 1) {
				var numerator = createDifMrow( limit - 1);
				var denomerator = createDifMrow( limit - 1);
				console.log(denomerator.rowVal);
				var frac = createFrac(numerator.row, denomerator.row);
				
				rowExpression.push( calcFrac(numerator.rowVal, denomerator.rowVal, '/'));
				row.row.appendChild(frac);
			} else {
				var num = randInt(1, 100);
				row.row.appendChild( createMi( num ) );
				rowExpression.push(num);
			}	
		} else {
			var num =  randInt(1, 100);
			row.row.appendChild( createMi( num ) );
			rowExpression.push(num);
		}
	}

	row.rowVal = calculateExpression(rowExpression);
	return row;
}

// Функция возвращает дробь (в теге mfrac), состоящий из двух сложных строк, которые генерирует функция createDifMrow
function createDifMfrac() {
	var frac = createMfrac(),
		numerator, 
		denomerator, 
		fracVal;

	while(true) {
		numerator = createDifMrow(3);
		denomerator = createDifMrow(3);
		fracVal = calcFrac(numerator.rowVal, denomerator.rowVal, '/');

		if(fracVal.indexOf('e') < 0) {
			break;
		}
	}
	
	var fracVal = fracVal.split('/');

	console.log("Числитель равен: " + fracVal[0]);
	console.log("Знаменатель равен: " + fracVal[1]);
	console.log("Дробь равна: " + fracVal.join('/'));

	frac.appendChild(numerator.row);
	frac.appendChild(denomerator.row);

	return frac;
}


// Функция принимает массив следующего вида:
// ['13/12','+','16/15','-','13/2','*','4/3','-','17/42','*','19/33'];
// И вычисляет, возвращая дробь, если одной из чисел являлось дробью.
function calculateExpression(arr) {
	var result = arr;
	for(;;) {
		var mPos = result.indexOf('*'); 
		var mPos2 = result.indexOf('/'); 

		if(mPos >= 0) {
			var multNum = calcFrac(result[mPos-1], result[mPos+1], '*');
			result.splice(mPos-1, 3, multNum);
		} else if(mPos2 >= 0) {
			var devNum = calcFrac(result[mPos2-1], result[mPos2+1], '/');
			result.splice(mPos2-1, 3, devNum);
		} else {
			var multNum = calcFrac(result[0], result[2], result[1]);
			result.splice(0, 3, multNum);
		}

		if(result.length == 1) {
			return result[0];
		}
	}
}
// Функция для сложения, вычитания, деления и умножения дроби на дробь, дроби на число, число на дробь и числа на число.
// numb1 - первое число(дробь), numb2 - второе число(дробь), sign - знак операции (+,-,*,/)
function calcFrac(numb1, numb2, sign) {
	// n1 - Числитель первого числа, d1 - Знаменатель первого числа 
	// n2 - Числитель второго числа, d2 - Знаменатель второго числа
	// n3 - Числитель ответа, d2 - Знаменатель ответа
	var d1, n1, d2, n2, f1, f2, n3, d3;
	var isFirstNumFrac = false;
	var isSecondNumFrac = false;
	// Проверка на дробность первое число
	if(numb1.toString().indexOf('/') >= 0 ) {
		f1 = numb1.split('/');
		n1 = f1[0];
		d1 = f1[1];

		isFirstNumFrac = true;
	} else {
		n1 = numb1;
	}
	// Проверка на дробность второе число
	if(numb2.toString().indexOf('/') >= 0 ) {
		f2 = numb2.split('/');
		n2 = f2[0];
		d2 = f2[1];

		isSecondNumFrac = true;
	} else {
		n2 = numb2;
	}
	// Если первое число - дробь, и второе - дробь
	if(isFirstNumFrac && isSecondNumFrac) {
		switch(sign) {
			case '+':
				n3 = n1*d2 + d1*n2;
				d3 = d1*d2;
				break;
			case '-':
				n3 = n1*d2 - d1*n2;
				d3 = d1*d2;
				break;
			case '*':
				n3 = n1*n2;
				d3 = d1*d2;
				break;
			case '/':
				n3 = n1*d2;
				d3 = n2*d1;
		}
	}
	// Если первое число - дробь, а второе - целое число
	if(isFirstNumFrac && !isSecondNumFrac) {
		switch(sign) {
			case '+':
				n3 = +n1 + d1*n2;
				d3 = d1;
				break;
			case '-':
				n3 = +n1 - d1*n2;
				d3 = d1;
				break;
			case '*':
				n3 = n1*n2;
				d3 = d1;
				break;
			case '/':
				n3 = n1;
				d3 = d1 * n2;
		}
	}
	// Если первое число - целое, а второе - дробь
	if(!isFirstNumFrac && isSecondNumFrac) {
		switch(sign) {
			case '+':
				n3 = n1*d2 + +n2;
				d3 = d2;
				break;
			case '-':
				n3 = n1*d2 - +n2;
				d3 = d2;
				break;
			case '*':
				n3 = n1*n2;
				d3 = d2;
				break;
			case '/':
				n3 = n1 * d2;
				d3 = n2;
		}
	}
	// Если первое число - целое, и второе - целое
	if(!isFirstNumFrac && !isSecondNumFrac) {
		switch(sign) {
			case '+':
				n3 = +n1 + +n2;
				d3 = 1;
				break;
			case '-':
				n3 = +n1 - +n2;
				d3 = 1;
				break;
			case '*':
				n3 = n1*n2;
				d3 = 1;
				break;
			case '/':
				n3 = n1 / n2;
				d3 = 1;
		}
	}

	var result = reduceFrac(n3, d3);

	return result.n + '/' + result.d;
}

var equetion = createDifMfrac();

document.getElementById('myMath').appendChild(equetion);