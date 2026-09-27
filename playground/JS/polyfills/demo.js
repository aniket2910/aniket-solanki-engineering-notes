// POLYFILLS (re-implementing the built-ins interviewers ask for)
// Run: node playground/run.js JS polyfills
//
// A polyfill is your own version of a built-in feature. Interviewers use them
// to check you understand what the built-in actually does. The staples are the
// array HOFs (map/filter/reduce), the function methods (call/apply/bind), and
// Promise.all. bind and debounce have their own notes; here are the rest.

// --- Array.prototype.map --------------------------------------------------
// Build a NEW array by transforming each element. `this` is the array.
Array.prototype.myMap = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    // pass element, index, and the whole array — same as the real map
    result.push(callback(this[i], i, this));
  }
  return result;
};
console.log([1, 2, 3].myMap((n) => n * 2)); // [2, 4, 6]

// --- Array.prototype.filter ----------------------------------------------
// Keep only elements for which the callback returns truthy.
Array.prototype.myFilter = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};
console.log([1, 2, 3, 4].myFilter((n) => n % 2 === 0)); // [2, 4]

// --- Array.prototype.reduce ----------------------------------------------
// Fold the array into a single value. If no initial value is given, the first
// element becomes the accumulator and iteration starts at index 1.
Array.prototype.myReduce = function (callback, initialValue) {
  let accumulator = initialValue;
  let startIndex = 0;

  if (arguments.length < 2) {
    accumulator = this[0]; // no initial value — use the first element
    startIndex = 1;
  }
  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }
  return accumulator;
};
console.log([1, 2, 3, 4].myReduce((sum, n) => sum + n, 0)); // 10
console.log([1, 2, 3, 4].myReduce((sum, n) => sum + n)); // 10 (no initial)

// --- Promise.all ----------------------------------------------------------
// Resolve when ALL promises resolve (results in input order); reject as soon
// as ANY one rejects. Track how many have finished with a counter.
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;

    if (promises.length === 0) {
      resolve(results);
      return;
    }
    promises.forEach((promise, index) => {
      // wrap in Promise.resolve so non-promise values also work
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value; // keep input order, not finish order
          completed++;
          if (completed === promises.length) resolve(results);
        })
        .catch(reject); // first rejection rejects the whole thing
    });
  });
}

myPromiseAll([Promise.resolve(1), Promise.resolve(2), 3]).then((values) =>
  console.log("myPromiseAll:", values) // [1, 2, 3]
);
