# Polyfills

Run the code: `node playground/run.js JS polyfills` — see [`demo.js`](demo.js).

## ⚡ In one line

A polyfill is your own implementation of a built-in feature — interviewers ask for them (`map`, `reduce`, `bind`, `Promise.all`) to check you actually understand how the built-in works, not just that you can call it.

## 🔍 What the interviewer is really testing

- **Do you know the exact contract** of the built-in — its arguments, return value, and edge cases (e.g. `reduce` with no initial value, `map` passing index + array)?
- **Can you translate that contract into a small correct function** with clean loops and names?
- **Do you handle the tricky bits** — input order in `Promise.all`, `this` in the array methods, empty inputs?
- **For function polyfills, do you understand `this` and closures** (see [call/apply/bind](../call-apply-bind/notes.md))?

## Why it exists (the problem)

Historically, a *polyfill* filled a real gap: older browsers lacked a method, so you shipped your own so code could rely on it everywhere. In interviews the purpose is different — it's an X-ray. Anyone can call `arr.map`; writing it proves you know it returns a **new** array, doesn't mutate, and passes `(element, index, array)` to the callback. The built-ins are just the most familiar functions to test that depth on.

## What it is

Re-implementing a standard method with the same behavior. The staples cluster into three groups:

- **Array HOFs** — `map`, `filter`, `reduce`, `forEach`, `find`, `some`, `every`. All loop over `this` and call a callback with `(element, index, array)`.
- **Function methods** — `call`, `apply`, `bind`. All about setting `this` — covered in [call/apply/bind](../call-apply-bind/notes.md).
- **Promise combinators** — `Promise.all`, `race`, `allSettled`, `any`. All wrap several promises and resolve/reject on a rule.

**Mental model:** the built-in is a black box with a documented contract. A polyfill is you rebuilding the box so it behaves identically — same inputs in, same outputs out, same side-effect rules (mutates or not).

## 🎈 Real-life analogy (how to think about it)

It's like a chef being asked to **make ketchup from scratch**. Everyone can squeeze the bottle; the test is whether you know what's *in* it — tomatoes, vinegar, sugar, the ratios (the arguments, the return value, the edge cases). Getting the taste identical to the bottle proves you understand the product, not just how to use it.

## 🔧 How it works (under the hood)

**Array methods** attach to `Array.prototype` so `this` is the array they're called on. The pattern is the same for all: make a result, loop `i` from 0 to `this.length`, call the callback with `(this[i], i, this)`, and either collect (`map`/`filter`) or fold (`reduce`).

**`reduce`'s one subtlety:** with no initial value, the **first element** becomes the accumulator and the loop starts at index 1. Detect this with `arguments.length < 2` (you can't just check `initialValue === undefined`, because `undefined` might be a legitimate initial value).

**`Promise.all`'s two subtleties:**
1. **Order** — results must be in *input* order, not the order they resolve. Store each result at its original `index`, don't `push` as they finish.
2. **Completion** — you don't know when "all done" from `then` alone, so keep a **counter**; resolve when it equals the input length. The first rejection rejects the whole thing (pass `reject` straight to `.catch`). Wrap each item in `Promise.resolve(...)` so non-promise values work too.

```text
myPromiseAll([p0, p1, p2])
  p1 resolves -> results[1] = v, completed=1
  p2 resolves -> results[2] = v, completed=2
  p0 resolves -> results[0] = v, completed=3 === length -> resolve(results)
```

## 💻 In code

All in [`demo.js`](demo.js). `map` — new array, never mutate, pass index + array:

```js
Array.prototype.myMap = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }
  return result;
};
```

`reduce` — handle the missing initial value:

```js
Array.prototype.myReduce = function (callback, initialValue) {
  let accumulator = initialValue;
  let startIndex = 0;
  if (arguments.length < 2) {        // no initial value provided
    accumulator = this[0];
    startIndex = 1;
  }
  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }
  return accumulator;
};
```

`Promise.all` — counter + index for order, reject on first failure:

```js
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve(results);
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value;                 // input order
          if (++completed === promises.length) resolve(results);
        })
        .catch(reject);                            // first rejection wins
    });
  });
}
```

## 🏗️ Code quality & principles applied

**Decomposition — match the real contract, one behavior at a time.** Name every argument the real method passes; handle the documented edge cases explicitly rather than hoping the happy path is enough.

**Principles by name:**
- **Correctness / contract adherence** — a polyfill that ignores `index`, or mutates when it shouldn't, is wrong even if the demo passes. Say: *"`map` returns a new array and doesn't mutate — I'll keep that contract, and pass `index` and the array too."*
- **Edge-case handling** — empty array, missing initial value, non-promise inputs. Say: *"`reduce` with no initial value seeds from the first element and starts at index 1 — I check `arguments.length` for that."*
- **Single Responsibility** — each polyfill does exactly one method's job.

**Say while coding:** *"I'll store `Promise.all` results by index, not push them, so the output stays in input order regardless of which resolves first,"* and *"I need a counter because `then` alone can't tell me when the last one finished."*

**What you deliberately did NOT do:** you didn't over-guard with type checks the spec doesn't need for the interview scope (KISS), but you *did* name the real edge cases. And you'd note that extending `Array.prototype`/`Function.prototype` in **production** is discouraged (it can clash with other code / future spec methods) — fine for an interview demo, but say you know the caveat.

## 🗣️ Keywords to say

- **Polyfill** — a from-scratch implementation of a built-in for parity.
- **Contract** — the method's arguments, return value, and mutation rules.
- **`(element, index, array)`** — the standard callback signature of the array HOFs.
- **Accumulator / seed** — `reduce`'s running value and its optional initial value.
- **Input order vs resolution order** — the `Promise.all` ordering trap.
- **`Promise.resolve` wrapping** — makes combinators accept non-promise values.
- **Prototype pollution caveat** — extending built-in prototypes is risky in production.

## 🎯 How it's asked in interviews

**The question, disguised:**
- "Implement `Array.prototype.map` / `filter` / `reduce`."
- "Implement `Promise.all` / `Promise.race` / `Promise.allSettled` / `Promise.any`."
- "Implement `call` / `apply` / `bind`." → [call/apply/bind](../call-apply-bind/notes.md).
- "Implement `debounce` / `throttle`." → [debounce/throttle](../debounce-throttle/notes.md).
- "Write your own `flat` / `Array.from` / `Object.assign`."

**Follow-up ladder (Promise.all):** basic version → keep input order → reject on first failure → handle non-promise values → empty array → then "now do `allSettled`" (never rejects; collects `{status, value/reason}`) or "`race`" (settles with the first to settle).

**Traps & gotchas:**
- **`Promise.all` order** — pushing results gives resolution order, which is wrong.
- **`reduce` no-initial-value** — checking `initialValue === undefined` is buggy; use `arguments.length`.
- **Forgetting `index`/`array`** in the array callbacks — the real methods pass them.
- **Mutating in `map`/`filter`** — they must return a new array and leave the source alone.
- **`this`** in the array polyfills is the array; in `bind`/`call` it's the function — don't mix them up.
- **`allSettled` vs `all`** — `all` short-circuits on first rejection; `allSettled` waits for every one.

**Model answer sketch** ("implement Promise.all"): *"I return a new Promise. Inside, I keep a results array and a completion counter. I iterate the input, wrap each in `Promise.resolve` so plain values work, and on resolve I store the value at its original index — order matters, so I index rather than push — and increment the counter; when it hits the length, I resolve with the results. Any rejection rejects the outer promise immediately. Empty input resolves right away."* Then contrast: *"`allSettled` never rejects and collects status objects; `race` settles with whichever finishes first."*

## 🔗 Linked concepts

- **[call, apply, bind](../call-apply-bind/notes.md)** — the function polyfills; `this` + closures.
- **[debounce/throttle](../debounce-throttle/notes.md)** — the timer-based polyfills.
- **[Higher-Order Functions](../higher-order-functions/notes.md)** — the array polyfills are HOFs.
- **Promises** *(planned)* — needed to reason about `Promise.all`/`race`/`allSettled`.

## 🧠 Rapid-fire Q&A

**Q: What's a polyfill and why ask for one?**
A hand-written version of a built-in. It proves you understand the method's real contract, not just its usage.

**Q: What does `map` return, and does it mutate?**
A new array of the same length; it never mutates the source.

**Q: How does `reduce` behave with no initial value?**
The first element becomes the accumulator and iteration starts at index 1; detect via `arguments.length < 2`.

**Q: In `Promise.all`, how do you keep output order?**
Store each result at its input index, not push on resolve — resolution order differs from input order.

**Q: When does `Promise.all` reject?**
As soon as any input promise rejects; it short-circuits.

**Q: `all` vs `allSettled`?**
`all` rejects on the first failure; `allSettled` waits for all and returns `{status, value}`/`{status, reason}` for each, never rejecting.

**Q (design): Why is extending `Array.prototype` fine here but risky in prod?**
In an interview it demonstrates the method; in production it can collide with other libraries or future native methods — prefer a standalone function.

## ✅ Cheat lines

- **A polyfill re-implements a built-in to prove you know its contract.**
- **Array HOFs: loop `this`, call back with `(element, index, array)`, `map`/`filter` return a NEW array.**
- **`reduce` with no seed: accumulator = first element, start at index 1 (check `arguments.length`).**
- **`Promise.all`: results by index (input order) + a counter; reject on first failure; wrap items in `Promise.resolve`.**
- **`allSettled` never rejects; `race` settles on the first to settle.**
