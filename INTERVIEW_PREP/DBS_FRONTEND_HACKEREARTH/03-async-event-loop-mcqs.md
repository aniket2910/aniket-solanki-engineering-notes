# 03 — Async, Event Loop, Promises

The single most valuable rule for these questions:

> **Run all synchronous code first → drain the entire microtask queue (Promises, `await` continuations, `queueMicrotask`) → then take ONE macrotask (`setTimeout`, `setInterval`, I/O) → drain microtasks again → repeat.**

Microtasks always beat macrotasks. Trace snippets in that order every time.

---

### Q1. The canonical ordering question
```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```
**Output:**
```
1
4
3
2
```
**Why:** `1` and `4` are synchronous. `3` is a microtask (runs before timers). `2` is a macrotask (`setTimeout`), last.

---

### Q2. Chained `.then` microtasks
```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C")).then(() => console.log("D"));
console.log("E");
```
**Output:**
```
A
E
C
D
B
```
**Why:** Sync: `A`, `E`. Microtask queue drains fully: `C`, then its chained `D`. Then the macrotask `B`.

---

### Q3. `async/await` suspension
```js
async function f() {
  console.log("1");
  await null;
  console.log("2");
}
console.log("start");
f();
console.log("end");
```
**Output:**
```
start
1
end
2
```
**Why:** Everything before `await` runs synchronously (`1`). `await` suspends and schedules the rest as a microtask, so `end` (sync) prints before `2`.

---

### Q4. Two async functions
```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() { console.log("async2"); }

console.log("script start");
async1();
console.log("script end");
```
**Output:**
```
script start
async1 start
async2
script end
async1 end
```
**Why:** `async2()` runs synchronously up to its return (prints `async2`). The code *after* the `await` (`async1 end`) becomes a microtask, so `script end` prints first.

---

### Q5. `setTimeout` delays order
```js
setTimeout(() => console.log("1"), 100);
setTimeout(() => console.log("2"), 50);
setTimeout(() => console.log("3"), 0);
console.log("4");
```
**Output:**
```
4
3
2
1
```
**Why:** Sync first (`4`), then timers fire by delay: `3` (0ms), `2` (50ms), `1` (100ms). (Note: `0` isn't truly 0 — browsers clamp nested timeouts to ~4ms, but relative order holds.)

---

### Q6. Interleaved timers and promises
```js
setTimeout(() => console.log("timeout1"), 0);
Promise.resolve().then(() => console.log("promise1"));
setTimeout(() => console.log("timeout2"), 0);
Promise.resolve().then(() => console.log("promise2"));
console.log("sync");
```
**Output:**
```
sync
promise1
promise2
timeout1
timeout2
```
**Why:** Sync → all microtasks (both promises) → then macrotasks in registration order.

---

### Q7. Promise chain with recovery
```js
Promise.resolve(1)
  .then(x => x + 1)
  .then(() => { throw new Error("fail"); })
  .catch(() => 10)
  .then(x => console.log(x));
```
**Output:** `10`
**Why:** `1 → 2 → throw`. The `.catch` handles it and *returns* `10`, which flows into the next `.then`. A `.catch` that returns a value puts the chain back on the success track.

---

### Q8. Error skips `.then` until `.catch`
```js
Promise.resolve()
  .then(() => { throw new Error("oops"); })
  .then(() => console.log("A"))
  .catch(e => console.log("caught:", e.message));
```
**Output:** `caught: oops`
**Why:** A thrown error rejects the promise; all subsequent `.then` success handlers are skipped until a `.catch` (or `.then`'s second arg).

---

### Q9. `async` return is always a promise
```js
async function g() { return 5; }
g().then(v => console.log(v));
console.log("after");
```
**Output:**
```
after
5
```
**Why:** An `async` function wraps its return in a resolved promise; `.then` is a microtask, so sync `after` prints first.

---

### Q10. `await` inside a loop
```js
async function h() {
  for (let i = 0; i < 3; i++) {
    await Promise.resolve();
    console.log(i);
  }
}
h();
console.log("done");
```
**Output:**
```
done
0
1
2
```
**Why:** The first `await` suspends `h` and yields to sync code (`done`), then the loop iterations resume as microtasks.

---

### Q11. What is the event loop? (concept)
A) A `for` loop that never ends
B) The mechanism that pulls queued callbacks onto the (single) call stack when it's empty, coordinating sync code, microtasks, and macrotasks
C) A React hook
D) A CSS animation

**Answer: B.** JS is single-threaded; the event loop is how it does async without blocking.

---

### Q12. Which runs first when both are queued — a Promise callback or a `setTimeout(…, 0)`?
A) `setTimeout`
B) The Promise callback (microtask)
C) Whichever was registered first
D) They run in parallel

**Answer: B.** The entire microtask queue drains before the next macrotask.

---

### Q13. `Promise.all` with one rejection
```js
Promise.all([Promise.resolve(1), Promise.resolve(2), Promise.reject("err")])
  .then(v => console.log("then", v))
  .catch(e => console.log("catch", e));
```
**Output:** `catch err`
**Why:** `Promise.all` rejects as soon as *any* input rejects (fail-fast). It resolves to an array only if all succeed.

---

### Q14. `Promise.race`
```js
Promise.race([
  new Promise(r => setTimeout(() => r("slow"), 100)),
  new Promise(r => setTimeout(() => r("fast"), 10)),
]).then(v => console.log(v));
```
**Output:** `fast`
**Why:** `race` settles with the *first* promise to settle (resolve or reject).

---

### Q15. `Promise.allSettled` vs `Promise.all` (concept)
A) They're identical
B) `allSettled` never rejects — it waits for all and returns `{status, value|reason}` for each; `all` fails fast on the first rejection
C) `allSettled` is faster
D) `allSettled` only takes two promises

**Answer: B.** Use `allSettled` when you want every result regardless of individual failures. (`Promise.any` is the other one: resolves on the first *fulfillment*, rejects only if all reject.)
