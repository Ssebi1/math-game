var dataController = (function() {
	var Data = {
		number1: 0,
		number2: 0,
		operator: 0,
		arr: [ '&plus;', '&minus;', '&times;', '&divide;' ],
		score: 0,
		time: 60
	};

	return {
		setValue() {
			function getRandomInt(max) {
				return Math.floor(Math.random() * Math.floor(max));
			}

			var number1, number2, operator;
			number1 = getRandomInt(100);
			number2 = getRandomInt(100) + 1;
			operator = getRandomInt(4);

			//In case of negative numbers(+)
			if ((operator === 1 || operator === 3) && number1 < number2) {
				var aux = number1;
				number1 = number2;
				number2 = aux;
			}

			//In case when numbers are not divisible(:)
			if (operator === 3 && number1 % number2 != 0) {
				while (number1 % number2 != 0) {
					number2 = getRandomInt(100) + 1;
				}
			}

			Data.number1 = number1;
			Data.number2 = number2;
			Data.operator = operator;
		},

		getFinalValue(number1, number2, operator) {
			if (operator === 0) return number1 + number2;
			else if (operator === 1) return number1 - number2;
			else if (operator === 2) return number1 * number2;
			else if (operator === 3) return number1 / number2;
		},

		resetScore() {
			Data.score = 0;
		},

		getData: function() {
			return Data;
		}
	};
})();

var UIController = (function() {
	var DOMstrings = {
		number1Label: '.number1',
		number2Label: '.number2',
		operator: '.operation--sign',
		finalValueInput: '.number--result',
		submitButton: '.button--submit',
		resetButton: '.button--reset',
		scoreLabel: '.score--value',
		gameOver: '.gameOver--container',
		timeLable: '.time--value',
		timeInputValue: '.time--input'
	};

	return {
		getFinalValueInput: function() {
			var input = document.querySelector(DOMstrings.finalValueInput).value;
			return input;
		},

		getTimerInputValue: function() {
			var time = document.querySelector(DOMstrings.timeInputValue).value;
			console.log(time);
			return time;
		},

		updateNumbers: function(number1, number2) {
			document.querySelector(DOMstrings.number1Label).textContent = number1;
			document.querySelector(DOMstrings.number2Label).textContent = number2;
		},

		updateInputValue: function(string) {
			document.querySelector(DOMstrings.finalValueInput).value = string;
		},

		updateOperator: function(operator) {
			document.querySelector(DOMstrings.operator).innerHTML = operator;
		},

		updateScore: function(score) {
			document.querySelector(DOMstrings.scoreLabel).textContent = score;
		},

		displayGameOver: function() {
			document.querySelector(DOMstrings.gameOver).style.display = 'block';
		},

		updateTimer: function(value) {
			document.querySelector(DOMstrings.timeLable).textContent = value;
		},

		getDOMstrings: function() {
			return DOMstrings;
		}
	};
})();

var controller = (function(dataController, UIController) {
	var DOMstrings = UIController.getDOMstrings();
	var data = dataController.getData();
	let isPlaying = 0;
	data.time = UIController.getTimerInputValue();

	var eventListener = function() {
		//Submit button
		document.querySelector(DOMstrings.submitButton).addEventListener('click', checkValue);

		//Reset button
		document.querySelector('.button--reset').addEventListener('click', controller.init);

		//When enter is pressed
		document.addEventListener('keydown', (event) => {
			if (isPlaying == 1)
				if (event.isComposing || event.keyCode === 13) {
					checkValue();
				}
		});
	};

	var timer = (function() {
		document.querySelector(DOMstrings.timeLable).textContent = data.time;
		var timeInterval = setInterval(function() {
			data.time = data.time - 1;

			if (isPlaying != 0) UIController.updateTimer(data.time);

			if (data.time < 1 || isPlaying === 0) {
				if (data.time < 1) UIController.updateTimer(0);
				endGame();
			}
		}, 1000);
	})();

	var disableEventListeners = function() {
		//Submit button
		document.querySelector(DOMstrings.submitButton).removeEventListener('click', checkValue);
	};

	var nextValue = function() {
		document.querySelector(DOMstrings.finalValueInput).focus();
		data.time = UIController.getTimerInputValue();
		UIController.updateTimer(data.time);
		UIController.updateInputValue('');
		//Get random numbers
		dataController.setValue();

		//Update numbers and operators on UI
		UIController.updateNumbers(data.number1, data.number2);
		UIController.updateOperator(data.arr[data.operator]);
	};

	var increaseScore = function(obj) {
		//Increase Score
		obj.score = obj.score + 1;

		//Update score on UI
		UIController.updateScore(obj.score);
	};

	var checkValue = function() {
		//Input value and correct value
		var inputValue = UIController.getFinalValueInput();
		var finalValue = dataController.getFinalValue(data.number1, data.number2, data.operator);

		if (inputValue != '') {
			if (parseInt(inputValue) === finalValue) {
				nextValue();
				increaseScore(data);
				data.time = UIController.getTimerInputValue();
			}
			else {
				endGame();
			}
		}
	};

	var endGame = function() {
		isPlaying = 0;
		UIController.displayGameOver();
		disableEventListeners();
		//Disable input
		var finalValue = dataController.getFinalValue(data.number1, data.number2, data.operator);
		finalValue = '' + finalValue;
		UIController.updateInputValue(finalValue);
		document.querySelector(DOMstrings.finalValueInput).disabled = true;
		isPlaying = 0;
	};

	return {
		init() {
			isPlaying = 1;
			data.time = UIController.getTimerInputValue();
			UIController.updateTimer(data.time);
			nextValue();
			eventListener();
			dataController.resetScore();
			UIController.updateScore(0);
			document.querySelector(DOMstrings.finalValueInput).disabled = false;
			document.querySelector(DOMstrings.gameOver).style.display = 'none';
		}
	};
})(dataController, UIController);

controller.init();
