// HIGHER-ORDER FUNCTIONS (HOF)
// Run: node playground/run.js JS higher-order-functions
//
// A higher-order function is a function that does at least one of:
//   - takes another function as an argument, or
//   - returns a function.
// That's it. It works because in JS functions are just values.

// --- Functions are values -------------------------------------------------
// You can store a function in a variable and pass it around like a number.
function shout(text) {
  return text.toUpperCase();
}
const action = shout; // not calling it — just referencing the value
console.log(action("hi")); // "HI"

// --- 1. A HOF that TAKES a function --------------------------------------
// `repeat` doesn't know what to do each time — you hand it the behavior.
function repeat(times, task) {
  for (let i = 0; i < times; i++) {
    task(i); // call the function we were given
  }
}
repeat(3, (i) => console.log("run #" + i)); // run #0, run #1, run #2

// --- 2. A HOF that RETURNS a function ------------------------------------
// `makeMultiplier` builds and returns a specialized function each time.
function makeMultiplier(factor) {
  return function (n) {
    return n * factor; // remembers `factor` via closure
  };
}
const triple = makeMultiplier(3);
console.log(triple(10)); // 30

// --- 3. The built-in HOFs you use daily ----------------------------------
// map / filter / reduce all TAKE a function. That's why they're HOFs.
const nums = [1, 2, 3, 4, 5];
console.log(nums.map((n) => n * 2)); // [2, 4, 6, 8, 10]
console.log(nums.filter((n) => n % 2 === 0)); // [2, 4]
console.log(nums.reduce((sum, n) => sum + n, 0)); // 15

// --- 4. A practical HOF: wrapping behavior (a decorator) -----------------
// `withLogging` takes a function and returns a new one that logs around it.
// The original stays untouched — you compose behavior on top.
function withLogging(fn) {
  return function (...args) {
    console.log("calling with:", args);
    const result = fn(...args);
    console.log("returned:", result);
    return result;
  };
}
const add = (a, b) => a + b;
const loggedAdd = withLogging(add);
loggedAdd(2, 3); // logs the call and the result, returns 5
