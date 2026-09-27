// ASYNC / AWAIT
// Run: node playground/run.js JS async-await
//
// async/await is syntax sugar over promises. An `async` function always returns
// a promise. `await` pauses the function until the awaited promise settles, then
// resumes with its value — so async code reads like synchronous code.

function wait(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// --- Basic: await unwraps the resolved value -----------------------------
async function getValue() {
  const v = await wait(20, 42); // pauses here, resumes with 42
  console.log("got:", v);
  return v * 2; // an async function wraps this in a promise
}
getValue().then((result) => console.log("returned (as promise):", result)); // 84

// --- Error handling with try/catch ---------------------------------------
async function mightFail() {
  try {
    await Promise.reject(new Error("boom"));
  } catch (err) {
    console.log("caught:", err.message); // "boom"
  }
}
mightFail();

// --- Sequential vs parallel (a very common mistake) ----------------------
// Sequential: each await waits for the previous — total time ~ 60ms.
async function sequential() {
  console.time("sequential");
  await wait(20, "a");
  await wait(20, "b");
  await wait(20, "c");
  console.timeEnd("sequential"); // ~60ms
}

// Parallel: start all three, then await them together — total time ~ 20ms.
async function parallel() {
  console.time("parallel");
  const [a, b, c] = await Promise.all([wait(20, "a"), wait(20, "b"), wait(20, "c")]);
  console.timeEnd("parallel"); // ~20ms
  console.log("parallel results:", a, b, c);
}

// Run them one after the other so the timers don't interleave in the logs.
sequential().then(parallel);

// --- await's continuation is a MICROTASK ---------------------------------
async function ordering() {
  console.log("sync 1");
  await null; // even awaiting a non-promise defers the rest to a microtask
  console.log("after await (microtask)");
}
ordering();
console.log("sync 2 (runs before 'after await')");
// prints: sync 1, sync 2 ..., after await
