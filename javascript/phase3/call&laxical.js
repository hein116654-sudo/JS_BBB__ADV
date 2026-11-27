// ==========================================
// DAY 6: Call Stack & Lexical Environment
// ==========================================

// --- A. CALL STACK (LIFO: Last In, First Out) ---
function third() {
  console.log("3. Inside third() -> Top of Call Stack");
  // console.trace("Call Stack Trace:"); // Uncomment to see live stack trace!
}

function second() {
  console.log("2. Inside second() -> Calling third()");
  third();
  console.log("4. Back in second()");
}

function first() {
  console.log("1. Inside first() -> Calling second()");
  second();
  console.log("5. Back in first()");
}

first();
console.log("6. Back in Global Execution Context");


// --- B. LEXICAL ENVIRONMENT (Static Scoping) ---
// Lexical Environment = Local Memory + Reference to Parent's Lexical Environment.
// "Lexical" means WHERE the function is WRITTEN in the code, NOT where it is called!

const secret = "Global Secret";

function revealSecret() {
  // revealSecret was WRITTEN in Global Scope, so its outer reference is Global!
  console.log("revealSecret sees:", secret);
}

function wrapper() {
  const secret = "Wrapper Local Secret";
  // Even though revealSecret() is CALLED inside wrapper(),
  // it still looks up 'secret' in Global Scope, NOT inside wrapper()!
  revealSecret();
}

wrapper(); // Prints: "Global Secret"