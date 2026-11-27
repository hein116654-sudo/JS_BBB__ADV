// ==========================================
// DAY 7: Week 9 Review & Exercises
// ==========================================

// ------------------------------------------
// EXERCISE 1: Scope Chain in Code
// JS searches from Inner -> Outer -> Global until it finds the variable.
// ------------------------------------------
console.log("=== EXERCISE 1: Scope Chain ===");

const appTitle = "Global App"; // Level 0 (Global)

function levelOne() {
  const user = "Aung Aung"; // Level 1

  function levelTwo() {
    const role = "Admin"; // Level 2

    function levelThree() {
      const action = "Delete"; // Level 3
      // Searches up the chain: levelThree -> levelTwo -> levelOne -> Global
      console.log(`${appTitle} | User: ${user} | Role: ${role} | Action: ${action}`);
    }

    levelThree();
    // console.log(action); // Error: Scope chain only looks UP, never DOWN!
  }

  levelTwo();
}
levelOne();


// ------------------------------------------
// EXERCISE 2: Predict Hoisting Outputs!
// Try predicting the outputs BEFORE checking the comments/running!
// ------------------------------------------
console.log("\n=== EXERCISE 2: Hoisting Output Predictions ===");

// Puzzle A:
console.log("Puzzle A:", a); // Prediction: undefined
var a = 10;

// Puzzle B (Classic Interview Question):
var score = 50;
function checkScore() {
  // Local 'var score' is hoisted to the top of checkScore() as undefined!
  console.log("Puzzle B (first log):", score); // Prediction: undefined (NOT 50!)
  var score = 100;
  console.log("Puzzle B (second log):", score); // Prediction: 100
}
checkScore();

// Puzzle C:
console.log("Puzzle C:", greetDecl()); // Prediction: "From Declaration"
function greetDecl() {
  return "From Declaration";
}

try {
  console.log(greetExpr()); // Prediction: TypeError (greetExpr is undefined)
} catch (err) {
  console.log("Puzzle D:", err.name, "-", err.message);
}
var greetExpr = function () {
  return "From Expression";
};


// ------------------------------------------
// EXERCISE 3: Call Stack Diagram & Execution
// ------------------------------------------
console.log("\n=== EXERCISE 3: Call Stack Trace ===");

function roundPrice(amount) {
  return Math.round(amount); // Step 4: Pushed -> Returns -> Popped
}

function addTax(price) {
  const taxed = price * 1.05;
  return roundPrice(taxed); // Step 3: Calls roundPrice()
}

function calculateOrder(basePrice) {
  console.log("Calculating order...");
  return addTax(basePrice); // Step 2: Calls addTax()
}

const finalBill = calculateOrder(99); // Step 1: Calls calculateOrder()
console.log("Final Bill:", finalBill);

/*
  CALL STACK DIAGRAM (Bottom = Oldest, Top = Currently Running):

  [1] Global Start        [2] Call calculateOrder   [3] Call addTax
  |                |      |                   |     | addTax()         |
  |                |  ->  | calculateOrder()  | ->  | calculateOrder() |
  | Global (GEC)   |      | Global (GEC)      |     | Global (GEC)     |
  +----------------+      +-------------------+     +------------------+

  [4] Call roundPrice     [5] roundPrice returns    [6] addTax returns
  | roundPrice()   |      |                   |     |                  |
  | addTax()       |  ->  | addTax()          | ->  | calculateOrder() |
  | calculateOrder |      | calculateOrder()  |     | Global (GEC)     |
  | Global (GEC)   |      | Global (GEC)      |     +------------------+
  +----------------+      +-------------------+

  [7] calculateOrder returns   [8] Program Finishes
  |                  |         |                  |
  |                  |   ->    | (Stack Empty)    |
  | Global (GEC)     |         |                  |
  +------------------+         +------------------+
*/


// ------------------------------------------
// EXERCISE 4: Nested Functions (Practical Problem)
// Build a Student Grade Evaluator using nested helper functions
// ------------------------------------------
console.log("\n=== EXERCISE 4: Nested Functions ===");

function evaluateStudent(studentName, scores) {
  const passingMark = 50; // Accessible by all nested functions via Lexical Scope

  function calculateAverage() {
    let sum = 0;
    for (const s of scores) {
      sum += s;
    }
    return sum / scores.length;
  }

  function getStatus(avg) {
    return avg >= passingMark ? "PASSED" : "FAILED";
  }

  function printReport() {
    const average = calculateAverage();
    const status = getStatus(average);
    console.log(`Student: ${studentName} | Average: ${average.toFixed(1)} | Status: ${status}`);
  }

  printReport();
}

evaluateStudent("Su Su", [80, 92, 75]);
evaluateStudent("Mg Mg", [30, 45, 40]);