// ==========================================
// DAY 4: Temporal Dead Zone (TDZ)
// ==========================================

// 1. What is TDZ?
{
  // --- TDZ for 'myAge' STARTS here (beginning of block) ---

  try {
    console.log(myAge); // ReferenceError!
  } catch (err) {
    console.log("TDZ Error:", err.name, "-", err.message);
  }

  let myAge = 25; // --- TDZ for 'myAge' ENDS here ---
  console.log("After initialization:", myAge); // 25
}

// 2. PROOF that 'let' and 'const' ARE Hoisted!
let city = "Yangon";

function checkCity() {
  // If inner 'let city' was NOT hoisted, this would print "Yangon".
  // Because inner 'let city' IS hoisted to the function top, it creates a TDZ!
  try {
    console.log(city);
  } catch (err) {
    console.log("Proof of let hoisting (TDZ):", err.name, "-", err.message);
  }

  let city = "Mandalay";
  console.log("Inner city:", city);
}
checkCity();

// 3. typeof in TDZ vs Undeclared variable
console.log("typeof undeclared variable:", typeof neverDeclared); // "undefined" (Safe)

try {
  console.log(typeof tdzVar); // ReferenceError! (Not safe inside TDZ)
} catch (err) {
  console.log("typeof inside TDZ:", err.name);
}
const tdzVar = "Hello";