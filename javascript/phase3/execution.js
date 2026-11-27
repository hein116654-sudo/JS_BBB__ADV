// ==========================================
// DAY 5: Execution Context (2 Phases)
// ==========================================

/*
  Every Execution Context (Global or Function) runs in 2 Phases:

  PHASE 1: Memory Creation Phase (Creation Phase)
    - Allocates memory for variables and functions.
    - 'var' -> set to undefined
    - 'let'/'const' -> uninitialized (TDZ)
    - 'function' declaration -> entire function stored in memory
    - Creates 'this' keyword

  PHASE 2: Code Execution Phase
    - Executes code line-by-line.
    - Assigns actual values to variables.
    - Creates a NEW Function Execution Context (FEC) whenever a function is called.
*/

// Step-by-step Trace Example:
var n = 2; // Creation Phase: n = undefined | Execution Phase: n = 2

// Creation Phase: square = function definition { ... }
function square(num) {
  // When square(n) is called, a NEW Function Execution Context is created:
  // Creation Phase (FEC): num = undefined, ans = undefined
  // Execution Phase (FEC): num = 2, ans = 4, returns 4 -> FEC is destroyed!
  var ans = num * num;
  return ans;
}

var square2 = square(n); // Creation: square2 = undefined | Execution: 4
var square4 = square(4); // Creation: square4 = undefined | Execution: 16

console.log("square2:", square2); // 4
console.log("square4:", square4); // 16