// ==========================================
// DAY 2: var vs let vs const
// ==========================================

// 1. Redeclaration
var a = 10;
var a = 20; // Allowed with var (Overwrites silently)
console.log("var redeclared:", a);

let b = 10;
// let b = 20; // SyntaxError: Identifier 'b' has already been declared

// 2. Reassignment
let score = 50;
score = 90; // Allowed

const pi = 3.14;
try {
  pi = 3.14159; // TypeError: Assignment to constant variable
} catch (err) {
  console.log("const reassign:", err.name, "-", err.message);
}

// Note: const prevents REASSIGNING the variable, NOT mutating object/array contents
const user = { name: "Aung" };
user.name = "Su Su"; // Allowed!
console.log("const object mutated:", user);

// 3. Classic Interview Trap: 'var' vs 'let' inside Asynchronous Loops
// 'var' shares ONE variable 'i' across all iterations.
// 'let' creates a NEW block-scoped 'i' for EACH iteration!

for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log("[Async var loop] i =", i); // Prints 3, 3, 3
  }, 100);
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => {
    console.log("[Async let loop] j =", j); // Prints 0, 1, 2
  }, 150);
}