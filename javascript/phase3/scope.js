// ==========================================
// DAY 1: Global, Function & Block Scope
// ==========================================

// 1. GLOBAL SCOPE (Accessible everywhere)
const globalVar = "I am Global";

function showGlobal() {
  console.log("Inside function:", globalVar); // Works
}
showGlobal();

// 2. FUNCTION SCOPE (Variables declared inside a function stay inside)
function calculate() {
  var funcVar = "var inside function";
  let funcLet = "let inside function";
  const funcConst = "const inside function";
  console.log(funcVar, "|", funcLet, "|", funcConst);
}
calculate();

// console.log(funcVar); // ReferenceError: funcVar is not defined

// 3. BLOCK SCOPE (Inside { }, if, for, while)
// 'let' and 'const' are Block-Scoped. 'var' IGNORES block scope!
if (true) {
  let blockLet = "Stays inside if-block";
  const blockConst = "Also stays inside if-block";
  var leakyVar = "var ignores block scope and leaks out!";
  console.log("Inside block:", blockLet, "|", blockConst);
}

console.log("Outside block:", leakyVar); // Works! (Dangerous behavior of var)

try {
  console.log(blockLet);
} catch (err) {
  console.log("Outside block (let):", err.name, "-", err.message); // ReferenceError
}