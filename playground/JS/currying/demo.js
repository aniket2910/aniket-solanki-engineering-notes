// CURRYING
// Run: node playground/run.js JS currying
//
// Currying turns a function that takes many arguments at once, f(a, b, c),
// into a chain of functions that each take one argument, f(a)(b)(c).
// It's built entirely on closures — each returned function remembers the
// arguments collected so far.

// --- 1. Currying by hand --------------------------------------------------
// Each call takes one argument and returns a function waiting for the next.
function add(a) {
  return function (b) {
    return function (c) {
      return a + b + c; // remembers a and b via closure
    };
  };
}
console.log(add(1)(2)(3)); // 6

// Why it's useful: you can lock in early arguments and reuse the rest.
const add5 = add(5); // a is fixed to 5
const add5and10 = add5(10); // b is fixed to 10
console.log(add5and10(1)); // 16
console.log(add5and10(2)); // 17

// --- 2. A general curry() helper -----------------------------------------
// Collect arguments until we have as many as the original function needs
// (fn.length = how many parameters it declares), then call it.
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args); // enough args — run the real function
    }
    // not enough yet — return a function that keeps collecting
    return function (...moreArgs) {
      return curried(...args, ...moreArgs);
    };
  };
}

function multiply(a, b, c) {
  return a * b * c;
}
const curriedMultiply = curry(multiply);

// All of these are valid — call in any grouping:
console.log(curriedMultiply(2)(3)(4)); // 24
console.log(curriedMultiply(2, 3)(4)); // 24
console.log(curriedMultiply(2)(3, 4)); // 24
console.log(curriedMultiply(2, 3, 4)); // 24
