// HOISTING
// Run: node playground/run.js JS hoisting
//
// Hoisting = during compilation, JS registers declarations at the top of their
// scope BEFORE running any code. But what "registered" means differs:
//   var                 -> hoisted, set to undefined (readable, value not yet there)
//   function declaration-> hoisted fully (usable before its line)
//   let / const / class -> hoisted, but UNusable until the declaration runs (TDZ)

// --- var is hoisted and initialized to undefined -------------------------
console.log(myVar); // undefined  (not a ReferenceError — it exists, no value yet)
var myVar = 10;
console.log(myVar); // 10

// --- Function declarations are fully hoisted -----------------------------
// You can call it above where it's written.
console.log(greet("Aniket")); // "Hi Aniket"  (works before the definition)
function greet(name) {
  return "Hi " + name;
}

// --- let / const live in the Temporal Dead Zone until their line ---------
// They ARE hoisted (the name is reserved in scope), but touching them before
// the declaration throws — that gap is the TDZ.
try {
  console.log(myLet); // throws ReferenceError
  let myLet = 5;
} catch (err) {
  console.log("TDZ error:", err.message);
}

// --- Function EXPRESSIONS are not hoisted as functions -------------------
// Only the `var sayHi` is hoisted (as undefined). The function is assigned at
// runtime, so calling it early fails.
try {
  sayHi(); // TypeError: sayHi is not a function (it's undefined right now)
} catch (err) {
  console.log("expression error:", err.message);
}
var sayHi = function () {
  return "hi";
};
console.log(sayHi()); // "hi"  (after the assignment line has run)
