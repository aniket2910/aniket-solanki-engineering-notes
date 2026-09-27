// setTimeout ISSUES & "TRUST ISSUES"
// Run: node playground/run.js JS settimeout-issues
//
// setTimeout does NOT guarantee "run after exactly N ms". It guarantees
// "queue this callback, and run it no SOONER than N ms — once the call stack is
// clear and it's this task's turn". The delay is a MINIMUM, not a promise.

// --- Issue 1: setTimeout(fn, 0) is not immediate --------------------------
// It's a macrotask, so it runs after ALL synchronous code and ALL microtasks.
console.log("1: sync start");
setTimeout(() => console.log("4: setTimeout 0 (runs last)"), 0);
Promise.resolve().then(() => console.log("3: microtask (before the timer)"));
console.log("2: sync end");
// order: 1, 2, 3, 4

// --- Issue 2: the delay is a MINIMUM, blocked by synchronous work --------
// We ask for 50ms, then block the thread for ~100ms. The callback can't fire
// until the stack is free, so it runs LATER than 50ms.
setTimeout(() => {
  const lateBy = Date.now() - scheduledAt - 50;
  console.log(`5: asked for 50ms, actually fired ~${lateBy}ms late (blocked stack)`);
}, 50);

const scheduledAt = Date.now();
// Block the single thread with a busy loop — nothing async can run meanwhile.
const blockUntil = Date.now() + 100;
while (Date.now() < blockUntil) {
  // intentionally doing nothing, just holding the thread
}
console.log("6: finished blocking the thread for ~100ms");

// --- "Trust issues": you hand your callback to setTimeout and lose control -
// You are trusting it to call your function once, at roughly the right time.
// It may call LATER than asked (as above), and if you are not careful, timers
// can also be set up to fire more than once (setInterval) or not at all
// (if cleared). This loss of control over your own continuation is the trust
// problem promises were designed to fix.
