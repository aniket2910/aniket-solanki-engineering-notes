// CALL, APPLY, BIND
// Run: node playground/run.js JS call-apply-bind
//
// All three set `this` by hand. The difference is small:
//   call  -> run now, pass args one by one
//   apply -> run now, pass args as an array
//   bind  -> don't run; return a NEW function with `this` (and args) locked in

function introduce(greeting, punctuation) {
  return greeting + ", I am " + this.name + punctuation;
}

const person = { name: "Aniket" };

// --- call: args listed out ------------------------------------------------
console.log(introduce.call(person, "Hello", "!")); // "Hello, I am Aniket!"

// --- apply: args as an array (handy when args are already in an array) ----
console.log(introduce.apply(person, ["Hi", "."])); // "Hi, I am Aniket."

// --- bind: returns a new function, call it later --------------------------
const introduceAniket = introduce.bind(person);
console.log(introduceAniket("Hey", "!!")); // "Hey, I am Aniket!!"

// --- Method borrowing -----------------------------------------------------
// `arguments` is array-like (has length + indexes) but has no array methods.
// Borrow Array's slice by setting its `this` to arguments.
function sumAll() {
  const args = Array.prototype.slice.call(arguments); // now a real array
  return args.reduce((total, n) => total + n, 0);
}
console.log(sumAll(1, 2, 3, 4)); // 10

// --- Partial application with bind ---------------------------------------
// bind can also lock in leading arguments, not just `this`.
function multiply(a, b) {
  return a * b;
}
const double = multiply.bind(null, 2); // a is fixed to 2; b stays open
console.log(double(5)); // 10
console.log(double(9)); // 18

// --- A minimal bind polyfill (common interview ask) ----------------------
// Show you understand what bind does by rebuilding it with call + a closure.
Function.prototype.myBind = function (thisArg, ...boundArgs) {
  const originalFn = this; // the function myBind was called on
  return function (...laterArgs) {
    return originalFn.call(thisArg, ...boundArgs, ...laterArgs);
  };
};
const introducePolyfill = introduce.myBind(person, "Yo");
console.log(introducePolyfill("?")); // "Yo, I am Aniket?"
