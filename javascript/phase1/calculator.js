// ==========================================
// DAY 7: Mini Project - Calculator Application
// ==========================================

// 1. Math Operation Functions (Applying Week 4 Function Styles)

// Function Declaration
function add(a, b) {
  return a + b;
}

// Function Expression
const subtract = function (a, b) {
  return a - b;
};

// Arrow Function
const multiply = (a, b) => a * b;

// Function with Error Handling (Division by zero)
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero!");
  }
  return a / b;
}

// 2. Input Validation Function
function validateInputs(rawVal1, rawVal2) {
  // Check for empty inputs or whitespace-only inputs
  if (rawVal1.trim() === "" || rawVal2.trim() === "") {
    throw new Error("Please enter both numbers.");
  }

  const num1 = Number(rawVal1);
  const num2 = Number(rawVal2);

  // Check if inputs are valid numbers (not NaN) and finite
  if (Number.isNaN(num1) || Number.isNaN(num2)) {
    throw new Error("Invalid input! Only numeric values are allowed.");
  }

  if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
    throw new Error("Number is too large to calculate.");
  }

  // Return validated numbers as an object
  return { num1, num2 };
}

// 3. Main Calculation Controller (try...catch Error Handling)
function handleCalculate(operator) {
  const input1 = document.getElementById("num1").value;
  const input2 = document.getElementById("num2").value;
  const resultEl = document.getElementById("result");
  const errorEl = document.getElementById("error");

  // Reset error message before new calculation
  errorEl.textContent = "";

  try {
    // Step 1: Validate and convert inputs
    const { num1, num2 } = validateInputs(input1, input2);

    // Step 2: Perform calculation based on operator
    let answer;
    switch (operator) {
      case "+":
        answer = add(num1, num2);
        break;
      case "-":
        answer = subtract(num1, num2);
        break;
      case "*":
        answer = multiply(num1, num2);
        break;
      case "/":
        answer = divide(num1, num2);
        break;
      default:
        throw new Error("Unknown operation.");
    }

    // Round long decimals nicely (e.g., 10 / 3 = 3.3333)
    const formattedAnswer = Number.isInteger(answer) ? answer : Number(answer.toFixed(4));
    resultEl.textContent = `Result: ${formattedAnswer}`;

  } catch (err) {
    // Step 3: Catch and display any validation or math errors safely
    resultEl.textContent = "Result: -";
    errorEl.textContent = `Error: ${err.message}`;
  }
}

// 4. Clear Button Function
function clearCalculator() {
  document.getElementById("num1").value = "";
  document.getElementById("num2").value = "";
  document.getElementById("result").textContent = "Result: -";
  document.getElementById("error").textContent = "";
  document.getElementById("num1").focus(); // Put cursor back in first input
}