const buttons = document.querySelectorAll('.button');

const firstLine = document.getElementById('firstLine');
const secondLine = document.getElementById('secondLine');

const dataForCalculator = {
    previousOperand: '',
    currentOperand: '',
    operator: null,
    symbol: {plus: '+', minus: '-', multiply: '*', divide: '/'},
    operations: {
        plus: (a, b) => a + b,
        minus: (a, b) => a - b,
        multiply: (a, b) => a * b,
        divide: (a, b) => {
            if (b == 0) return 'ERROR';
            return a / b;
        }
    },
    history: {
        status: false,
        previousOperand: '',
        currentOperand: '',
        operator: null
    }
};

[...buttons].forEach((element => element.addEventListener('click', findButton)));
[...buttons].forEach((element => element.addEventListener('touchstart', findButton)));

function findButton(event) {
    let command = event.path[0].id;
    let element = document.getElementById(`${command}`);

    checkError();
    checkClear(command);
    checkDel(command);
    checkNumber(command);
    checkOperator(command);
    checkResult(command);
    checkSquareRoot(command);
    changeSign(command);
    addPoint(command);
    if (command !== 'result') clearHisrory();
};

function checkError() {
    if (secondLine.textContent === 'ERROR') {
        checkClear('clear');
    }
};

function checkClear(command) {
    if (command === 'clear') {
        dataForCalculator.previousOperand = '';
        dataForCalculator.currentOperand = '';
        dataForCalculator.point = true;
        dataForCalculator.operator = null;
        firstLine.textContent = '';
        updateSecondLine('0');
    }
};

function checkDel(command) {
    if (command === 'del') {
        if (dataForCalculator.currentOperand.length <= 1) {
            dataForCalculator.currentOperand = '';
            updateSecondLine('0');
        } else {
            dataForCalculator.currentOperand = dataForCalculator.currentOperand.slice(0, dataForCalculator.currentOperand.length - 1);
            updateSecondLine(dataForCalculator.currentOperand);
        }
    }

};

function checkNumber(command) {
    let numbers = {zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9'};
    if (secondLine.textContent.length >= 14) return;
    if (command in numbers) {
        if (!(dataForCalculator.currentOperand === '' && command === 'zero')) {
            dataForCalculator.currentOperand += numbers[command];
            updateSecondLine(dataForCalculator.currentOperand);
        }
    }
};

function ignoreOperator() {
    if (dataForCalculator.previousOperand === '' && 
    dataForCalculator.currentOperand === '' &&
    secondLine.textContent === '0') {
        return true;
    }
};

function normalCount(command) {
    if (dataForCalculator.previousOperand === '' &&
    dataForCalculator.currentOperand !== '' &&
    dataForCalculator.operator === null) {
        dataForCalculator.previousOperand = dataForCalculator.currentOperand;
        dataForCalculator.currentOperand = '';
        dataForCalculator.operator = command;
        firstLine.textContent = `${dataForCalculator.previousOperand} ${dataForCalculator.symbol[dataForCalculator.operator]}`;
        updateSecondLine('');
        return true;
    }
};

function changeOperator(command) {
    if (dataForCalculator.previousOperand !== '' &&
    dataForCalculator.currentOperand === '' &&
    dataForCalculator.operator !== null) {
        dataForCalculator.operator = command;
        firstLine.textContent = `${dataForCalculator.previousOperand} ${dataForCalculator.operator}`;
        return true;
    }
};

function continueTheCalculation(command) {
    if (dataForCalculator.previousOperand !== '' &&
    dataForCalculator.currentOperand !== '' && 
    dataForCalculator.operator !== null) {
        let result = operate(dataForCalculator.previousOperand, dataForCalculator.currentOperand, dataForCalculator.operator)
        dataForCalculator.previousOperand = result;
        dataForCalculator.currentOperand = '';
        dataForCalculator.operator = command;
        firstLine.textContent = `${dataForCalculator.previousOperand} ${dataForCalculator.symbol[dataForCalculator.operator]}`;
        updateSecondLine('');
        return true;
    }
};

function checkOperator(command) {
    if (command in dataForCalculator.symbol) {
        if (ignoreOperator()) return;
        if (normalCount(command)) return;
        if (changeOperator(command)) return;
        if (continueTheCalculation(command)) return;
    }
};

function operate(a, b, operator) {
    return dataForCalculator.operations[operator](+a, +b);
};

function writeHistory(result) {
    dataForCalculator.history.status = true;
    dataForCalculator.history.previousOperand = result;
    dataForCalculator.history.currentOperand = dataForCalculator.currentOperand;
    dataForCalculator.history.operator = dataForCalculator.operator;
};

function clearHisrory() {
    dataForCalculator.history.status = false;
    dataForCalculator.history.previousOperand = '';
    dataForCalculator.history.currentOperand = '';
    dataForCalculator.history.operator = null;
};

function checkResult(command) {
    if (command === 'result' && dataForCalculator.history.status) {
        let result = operate(dataForCalculator.history.previousOperand, dataForCalculator.history.currentOperand, dataForCalculator.history.operator);
        firstLine.textContent = `${dataForCalculator.history.previousOperand} ${dataForCalculator.symbol[dataForCalculator.history.operator]} ${dataForCalculator.history.currentOperand} =`;
        updateSecondLine(result);
        dataForCalculator.history.previousOperand = result;
        dataForCalculator.currentOperand = secondLine.textContent;
    } else if (command === 'result' &&
    dataForCalculator.previousOperand !== '' &&
    dataForCalculator.currentOperand !== '' &&
    dataForCalculator.operator !== null) {
        let result = operate(dataForCalculator.previousOperand, dataForCalculator.currentOperand, dataForCalculator.operator)
        firstLine.textContent = `${dataForCalculator.previousOperand} ${dataForCalculator.symbol[dataForCalculator.operator]} ${dataForCalculator.currentOperand} =`;
        updateSecondLine(result);

        writeHistory(result);

        dataForCalculator.previousOperand = '';
        dataForCalculator.currentOperand = result;
        dataForCalculator.operator = null;
    } else return;
};

function checkSquareRoot(command) {
    if (command === 'squareRoot') {
        dataForCalculator.currentOperand = dataForCalculator.currentOperand ** 0.5;
        if (isNaN(dataForCalculator.currentOperand)) {
            updateSecondLine('ERROR');
        } else {
            updateSecondLine(dataForCalculator.currentOperand);
        }
    }
};

function changeSign(command) {
    if (command === 'changeSign') {
        dataForCalculator.currentOperand = dataForCalculator.currentOperand * -1;
        updateSecondLine(dataForCalculator.currentOperand);
    }
};

function addPoint(command) {
    if (command === 'point') {
        if (!secondLine.textContent.includes('.') && secondLine.textContent.length <= 12) {
            dataForCalculator.currentOperand += '.';
            updateSecondLine(dataForCalculator.currentOperand);
        }
    }
};

function updateSecondLine(result) {
    if (result.toString().length <= 15) {
        secondLine.textContent = result;
    } else {
        secondLine.textContent = result.toExponential(9);
    }
};