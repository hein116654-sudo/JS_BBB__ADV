// ==========================================
// DAY 3: Hoisting
// ==========================================

// 1. Variable Hoisting with 'var'
// 'var' is hoisted AND automatically initialized with 'undefined'
console.log("Before declaration (var):", x); // undefined (NOT ReferenceError)
var x = 100;
console.log("After declaration (var):", x);  // 100

// 2. Function Declaration Hoisting
// Entire function body is hoisted -> works BEFORE the line it is written!
console.log("Calling declared function early:", add(5, 3)); // 8

function add(a, b) {
  return a + b;
}

// 3. Function Expression & Arrow Function Hoisting
// Only the variable is hoisted (not the function value!)
try {
  sayHi(); // 'sayHi' is currently 'undefined', so calling undefined() throws TypeError!
} catch (err) {
  console.log("var Function Expression:", err.name, "-", err.message);
}
var sayHi = function () {
  console.log("Hi!");
};

try {
  sayHello(); // 'const' is in Temporal Dead Zone -> throws ReferenceError!
} catch (err) {
  console.log("const Arrow Function:", err.name, "-", err.message);
}
const sayHello = () => console.log("Hello!");