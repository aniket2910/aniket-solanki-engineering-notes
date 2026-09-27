// CALLBACK HELL
// Run: node playground/run.js JS callback-hell
//
// When each async step depends on the previous one, callbacks nest inside
// callbacks and the code drifts to the right into a "pyramid of doom".
// It's hard to read, and error handling has to be repeated at every level.

// A fake async step: does something after a delay, then calls back with (err, result).
function step(name, input, callback) {
  setTimeout(() => {
    console.log("did:", name);
    callback(null, input + 1); // Node-style: (error, result)
  }, 20);
}

// --- The problem: nested callbacks (pyramid of doom) ---------------------
console.log("--- callback hell ---");
step("one", 0, (err, r1) => {
  if (err) return console.error(err);
  step("two", r1, (err, r2) => {
    if (err) return console.error(err);
    step("three", r2, (err, r3) => {
      if (err) return console.error(err);
      console.log("final result (nested):", r3); // 3
      runFlat(); // continue the demo below
    });
  });
});

// --- Fix 1: promisify, then chain (flat, one error handler) --------------
function stepAsync(name, input) {
  return new Promise((resolve) => step(name, input, (_err, result) => resolve(result)));
}

function runFlat() {
  console.log("--- flattened with promises ---");
  stepAsync("one", 0)
    .then((r1) => stepAsync("two", r1))
    .then((r2) => stepAsync("three", r2))
    .then((r3) => {
      console.log("final result (chained):", r3); // 3
      runAsyncAwait();
    })
    .catch((err) => console.error(err)); // ONE place handles any failure
}

// --- Fix 2: async/await (reads like synchronous steps) -------------------
async function runAsyncAwait() {
  console.log("--- async/await ---");
  try {
    const r1 = await stepAsync("one", 0);
    const r2 = await stepAsync("two", r1);
    const r3 = await stepAsync("three", r2);
    console.log("final result (await):", r3); // 3
  } catch (err) {
    console.error(err);
  }
}
