const buttons = document.querySelectorAll('.button');

const firstLine = document.getElementById('firstLine');
const secondLine = document.getElementById('secondLine');

const dataForCalculator = {
    firstOperand: '',
    secondOperand: '',
    operand: null,
    result: null,
    state: 'wait1', // 'wait1', 'wait2'
    symbol: '',
    point: true
};

[...buttons].forEach((element => element.addEventListener('click', findButton)));

function operate(a, b, operator) {
    
}

function findButton(event) {
    let command = event.path[0].id;
    console.log(command);
    checkClear(command);
    checkDel(command)
    checkNumber(command); 
}

function checkClear(command) {
    if (command === 'clear') {
        dataForCalculator.firstOperand = '';
        dataForCalculator.secondOperand = '';
        dataForCalculator.operand = null;
        dataForCalculator.result = null;
        dataForCalculator.state = 'wait1';
        dataForCalculator.symbol = '',
        dataForCalculator.point = true;
        firstLine.textContent = ''
        secondLine.textContent = '0'
    }
}

function checkDel(command) {
    if (command === 'del') {
        if (dataForCalculator.firstOperand.length <= 1) {
            dataForCalculator.firstOperand = ''
            secondLine.textContent = 0;
        } else {
            dataForCalculator.firstOperand = dataForCalculator.firstOperand.slice(0, dataForCalculator.firstOperand.length - 1)
            secondLine.textContent = dataForCalculator.firstOperand;
        }
    }

}

function checkNumber(command) {
    let numbers = {zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9'};
    if (secondLine.textContent.length >= 15) return;
    if (command in numbers && dataForCalculator.state === 'wait1') {
        if (!(dataForCalculator.firstOperand === '' && command === 'zero')) {
            dataForCalculator.firstOperand += numbers[command];
            secondLine.textContent = dataForCalculator.firstOperand;
        }
    }
}

function checkOperand(command) {
    let operands = {
        plus: (a, b) => a + b,
        minus: (a, b) => a - b,
        multiply: (a, b) => a * b,
        divide: (a, b) => {
            if (b == 0) return 'ERROR';
            return a / b;
        }
    }
    let symbols = {plus: '+', minus: '-', multiply: '*', divide: '/'}
    if (command in operands) {
        dataForCalculator.operand = operands[command];
        dataForCalculator.state = 'wait2';

    }
}