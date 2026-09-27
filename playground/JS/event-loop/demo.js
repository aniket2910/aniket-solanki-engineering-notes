// THE EVENT LOOP
// Run: node playground/run.js JS event-loop
//
// JavaScript runs on ONE thread with ONE call stack. The event loop is the
// rule that decides what runs next once the stack is empty:
//   1. run all synchronous code (the current call stack) to completion
//   2. then drain the ENTIRE microtask queue (promise callbacks, queueMicrotask)
//   3. then take ONE macrotask (setTimeout, setInterval, I/O) and run it
//   4. drain microtasks again, repeat
// Key rule: microtasks always run before the next macrotask.

console.log("1: sync start");

setTimeout(() => {
  console.log("4: setTimeout callback (macrotask)");
}, 0);

Promise.resolve().then(() => {
  console.log("3: promise .then (microtask)");
});

console.log("2: sync end");

// Output order: 1, 2, 3, 4
// - 1 and 2 are synchronous, so they run first, top to bottom.
// - The promise .then is a MICROTASK: it runs as soon as the sync code finishes,
//   BEFORE any setTimeout.
// - The setTimeout is a MACROTASK: even with 0ms, it waits until microtasks
//   are drained.

// --- Microtasks beat macrotasks even when scheduled later ----------------
setTimeout(() => {
  console.log("A: second setTimeout (macrotask)");
  // A microtask scheduled from inside a macrotask still runs before the NEXT
  // macrotask, because the queue is drained after every task.
  Promise.resolve().then(() => console.log("B: microtask queued inside macrotask"));
}, 0);

setTimeout(() => {
  console.log("C: third setTimeout (macrotask)");
}, 0);

// After the first block prints 1,2,3,4 the timers run in order:
//   A  -> then B (its microtask drains before C) -> C
