var dataController = (function() {
	var Data = {
		number1: 0,
		number2: 0,
		operator: 0,
		arr: [ '&plus;', '&minus;', '&times;', '&divide;' ],
		score: 0
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
		gameOver: '.gameOver--container'
	};

	return {
		getFinalValueInput: function() {
			var input = document.querySelector(DOMstrings.finalValueInput).value;
			return input;
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

		getDOMstrings: function() {
			return DOMstrings;
		}
	};
})();

var controller = (function(dataController, UIController) {
	var DOMstrings = UIController.getDOMstrings();
	var data = dataController.getData();

	var eventListener = function() {
		//Submit button
		document.querySelector(DOMstrings.submitButton).addEventListener('click', checkValue);

		//Reset button
		document.querySelector('.button--reset').addEventListener('click', controller.init);

		//When enter is pressed
		document.addEventListener('keydown', function enterSubmit(event) {
			if (event.isComposing || event.keyCode === 13) {
				checkValue();
			}
		});
	};

	var disableEventListeners = function() {
		//Submit button
		document.querySelector(DOMstrings.submitButton).removeEventListener('click', checkValue);
	};

	var nextValue = function() {
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

		if (parseInt(inputValue) === finalValue) {
			nextValue();
			increaseScore(data);
		}
		else {
			UIController.displayGameOver();
			disableEventListeners();
			//Disable input
			finalValue = '' + finalValue;
			UIController.updateInputValue(finalValue);
			document.querySelector(DOMstrings.finalValueInput).disabled = true;
		}
	};

	return {
		init() {
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
