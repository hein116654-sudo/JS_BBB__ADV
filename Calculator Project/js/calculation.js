const historyDisplay = document.getElementById("history");
const resultDisplay = document.getElementById("result");
const buttons = document.querySelectorAll("button");

let currentInput = "";
let previousInput = "";
let operator = null;

resultDisplay.innerText = "0";

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.innerText;

        if (button.classList.contains("btn") || button.classList.contains("btnzero")) {
            handleNumber(value);
        } else if (button.classList.contains("operator")) {
            handleOperator(value);
        } else if (button.classList.contains("equal")) {
            calculate();
        } else if (value === "AC") {
            clearAll();
        } else if (value === "DEL") {
            deleteLast();
        } else if (value === "%") {
            handlePercentage();
        }
    });
});

function handleNumber(num) {
    
    if (num === "." && currentInput.includes(".")) return;
    
    if (currentInput === "0" && num !== ".") {
        currentInput = num;
    } else {
        currentInput += num;
    }
    updateScreen();
}

function handleOperator(op) {
    if (currentInput === "" && previousInput === "") return;

    if (previousInput !== "" && currentInput !== "") {
        calculate();
    }

    operator = op;
    if (currentInput !== "") {
        previousInput = currentInput;
        currentInput = "";
    }
    updateScreen();
}

function calculate() {
    if (previousInput === "" || currentInput === "" || !operator) return;

    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let total = 0;

    switch (operator) {
        case "+":
            total = prev + current;
            break;
        case "−":
        case "-":
            total = prev - current;
            break;
        case "×":
            total = prev * current;
            break;
        case "÷":
            if (current === 0) {
                alert("Cannot divide by zero");
                clearAll();
                return;
            }
            total = prev / current;
            break;
    }

   total = parseFloat(total.toPrecision(12));

    historyDisplay.innerText = `${previousInput} ${operator} ${currentInput}`;
    currentInput = total.toString();
    previousInput = "";
    operator = null;
    resultDisplay.innerText = currentInput;
}

function handlePercentage() {
    if (currentInput === "") return;
    currentInput = (parseFloat(currentInput) / 100).toString();
    updateScreen();
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    updateScreen();
}

function clearAll() {
    currentInput = "";
    previousInput = "";
    operator = null;
    historyDisplay.innerText = "";
    resultDisplay.innerText = "0";
}

function updateScreen() {
    resultDisplay.innerText = currentInput || "0";
    if (operator) {
        historyDisplay.innerText = `${previousInput} ${operator}`;
    }
}