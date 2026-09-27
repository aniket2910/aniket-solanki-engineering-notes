# Promises

Run the code: `node playground/run.js JS promises` — see [`demo.js`](demo.js).

For *how* promise callbacks get scheduled, see the [event loop](../event-loop/notes.md) (they're microtasks). For the problem promises solve, see [callback hell](../callback-hell/notes.md).

## ⚡ In one line

A promise is an object representing a value that isn't ready yet — it starts **pending** and settles exactly once into **fulfilled** (with a value) or **rejected** (with a reason) — letting you attach `.then`/`.catch` handlers and chain async steps flatly.

## 🔍 What the interviewer is really testing

- **Do you know the three states and that a promise settles once and is immutable after?**
- **Do you understand chaining** — that `.then` returns a *new* promise, and errors propagate to the nearest `.catch`?
- **Can you use the combinators correctly** — `all` vs `allSettled` vs `race` vs `any`?
- **Do you know promise callbacks are microtasks** and how that orders against `setTimeout`?

## Why it exists (the problem)

Callbacks handled "run this when done," but chaining dependent steps produced [callback hell](../callback-hell/notes.md) — nesting, repeated error handling, and inversion of control. Promises give async results a **first-class value** you can pass around, chain, and compose. You hold the promise and attach *your* handlers, instead of surrendering a callback to someone else's function — and errors flow down one clean path.

## What it is

A promise has three states:

- **pending** — not settled yet.
- **fulfilled** — succeeded, carries a **value** (`resolve(value)`).
- **rejected** — failed, carries a **reason** (`reject(error)`).

Once it settles (fulfilled or rejected) it's **immutable** — it can't change state or value again. You react with:

- **`.then(onFulfilled, onRejected?)`** — runs when fulfilled (and optionally on reject).
- **`.catch(onRejected)`** — runs on rejection (sugar for `.then(null, onRejected)`).
- **`.finally(fn)`** — runs on either outcome, for cleanup; passes the value/reason through.

**The chaining rule:** every `.then`/`.catch` returns a **new** promise. Returning a plain value from a handler fulfills the next promise with it; returning a **promise** makes the chain wait for that promise; throwing (or rejecting) skips to the next `.catch`.

**Mental model:** a promise is a **restaurant buzzer**. You order and get a buzzer (pending). Later it either lights green — food ready (fulfilled, value = your meal) — or red — order failed (rejected, reason). It goes off **once**; after that it's spent.

## 🎈 Real-life analogy (how to think about it)

An **online order with tracking**. The moment you order, you get a tracking page (the promise) even though the package doesn't exist yet — that's pending. Eventually it flips to **delivered** (fulfilled, the item is the value) or **failed/returned** (rejected, with a reason). You attach instructions ahead of time: "when delivered, do X" (`.then`), "if it fails, do Y" (`.catch`), "either way, close the ticket" (`.finally`). The status settles once and sticks.

## 🔧 How it works (under the hood)

**The executor runs immediately.** `new Promise((resolve, reject) => {...})` runs that function synchronously; you call `resolve`/`reject` when the async work finishes. Whichever you call first wins; later calls are ignored (settle-once).

**Handlers run as microtasks.** When a promise settles, its `.then`/`.catch` callbacks are queued on the **microtask queue**, so they run after the current synchronous code but before any `setTimeout` — see [event loop](../event-loop/notes.md). Even `Promise.resolve().then(...)` defers the callback to a microtask.

**Chaining and error propagation:**

```text
fetchUser(2)
  .then(u => u.id * 10)   // returns 20 -> next promise fulfilled with 20
  .then(score => ...)     // receives 20
  .catch(err => ...)      // catches a throw/reject from ANY step above
```

A single `.catch` at the end handles a failure anywhere earlier, because a rejection skips all following `.then`s until it hits a rejection handler. That's why chains need only one error handler.

**Combinators:**
- **`Promise.all([...])`** — fulfills with an array of all values (input order); **rejects as soon as any one rejects** (short-circuits). Use when you need *all* to succeed.
- **`Promise.allSettled([...])`** — waits for every promise; **never rejects**; returns `{status:"fulfilled", value}` / `{status:"rejected", reason}` for each. Use when you want *every* outcome regardless of failures.
- **`Promise.race([...])`** — settles with the **first to settle**, fulfill *or* reject. Use for timeouts ("whichever finishes first").
- **`Promise.any([...])`** — fulfills with the **first to fulfill**; rejects only if **all** reject (with an `AggregateError`). Use when any one success is enough.

## 💻 In code

All in [`demo.js`](demo.js). Create, then consume with then/catch/finally:

```js
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => (id > 0 ? resolve({ id }) : reject(new Error("invalid id"))), 20);
  });
}

fetchUser(1)
  .then((user) => console.log(user.id))
  .catch((err) => console.error(err.message))
  .finally(() => console.log("done"));
```

Chaining passes values along; one `.catch` catches any earlier failure:

```js
fetchUser(2)
  .then((user) => user.id * 10) // return a value
  .then((score) => console.log(score)) // 20
  .catch((err) => console.error(err)); // handles a reject from any step
```

Combinators, in one glance:

```js
Promise.all([p1, p2]);        // all values, or reject on first failure
Promise.allSettled([p1, bad]); // every outcome, never rejects
Promise.race([p1, p2]);        // first to settle (win or fail)
Promise.any([bad, p2]);        // first to fulfill; rejects only if all fail
```

## 🏗️ Code quality & principles applied

**Decomposition — one promise-returning function per async step; compose them.** Each step is independently testable; the chain wires them.

**Principles by name:**
- **Single error path / DRY** — errors propagate to one `.catch`; don't repeat handling per step. Say: *"Rejections propagate, so I handle them once at the end of the chain."*
- **Return, don't nest** — always `return` the inner promise from `.then` so the chain waits. Say: *"I return the promise so the next step runs after it, not concurrently."*
- **Right combinator for the intent** — `all` for "need everything," `allSettled` for "report everything," `race` for timeouts, `any` for "first success." Choosing correctly is the senior signal.
- **Always handle rejections** — an unhandled rejection is a real bug (and crashes Node by default).

**Say while coding:** *"These are independent, so I'll `Promise.all` them to run in parallel instead of awaiting one by one,"* and *"I'll add a `.finally` for cleanup since it runs on both outcomes."*

**What you deliberately did NOT do:** you didn't nest `.then`s inside each other (that recreates callback hell) — you keep the chain flat. And you didn't swallow errors with an empty `.catch` — you handle or rethrow.

## 🗣️ Keywords to say

- **Pending / fulfilled / rejected / settled** — the states; settles once, then immutable.
- **Executor** — the `(resolve, reject) => {}` function; runs synchronously.
- **Microtask** — where `.then` callbacks run; before `setTimeout`.
- **Chaining** — `.then` returns a new promise; return values/promises to sequence.
- **Error propagation** — a rejection skips to the nearest `.catch`.
- **`all` / `allSettled` / `race` / `any`** — the four combinators and their rules.
- **Unhandled rejection** — a rejected promise with no `.catch`; a bug to avoid.
- **Thenable** — any object with a `.then` method; promises interoperate with these.

## 🎯 How it's asked in interviews

**The question, disguised:**
- "What is a promise? What states does it have?"
- "Difference between `Promise.all`, `allSettled`, `race`, and `any`?"
- "Implement `Promise.all`." → [polyfills](../polyfills/notes.md).
- "What's the output?" — mixing `.then`, `setTimeout`, and sometimes `await` (an [event loop](../event-loop/notes.md) question).
- "How do you run these in parallel vs sequence?"
- "Add a timeout to a fetch." → `Promise.race([fetch(), timeout()])`.

**Follow-up ladder:** states → then/catch/finally → chaining + error propagation → combinators and when to use each → "which runs first, `.then` or `setTimeout`?" (microtask) → implement `Promise.all` → add a timeout with `race`.

**Traps & gotchas:**
- **Not returning the inner promise in `.then`** — the chain doesn't wait; steps overlap.
- **`Promise.all` rejects on the first failure** — if you need all results regardless, use `allSettled`.
- **Forgetting a `.catch`** — unhandled rejection; crashes Node, warns in browsers.
- **The executor runs synchronously** — code inside `new Promise(...)` isn't deferred; only the `.then` callbacks are.
- **`.catch` after `.then` also catches errors thrown *inside* that `.then`** — order matters.
- **`race` vs `any`** — `race` settles on the first to settle (even a rejection); `any` waits for the first *fulfilment*.

**Model answer sketch** ("what's a promise + combinators"): *"A promise is an object for a future value with three states — pending, then fulfilled with a value or rejected with a reason — and it settles once and stays. You consume it with `.then`/`.catch`/`.finally`, and because each `.then` returns a new promise you chain dependent steps flatly, with errors propagating to a single `.catch`. Its callbacks are microtasks, so they run before `setTimeout`. For multiple promises: `all` needs every one to succeed and short-circuits on failure; `allSettled` reports every outcome and never rejects; `race` settles with the first to settle; `any` resolves with the first success. I pick based on intent — e.g. `race` with a timer to time out a request."*

## 🔗 Linked concepts

- **[Event loop](../event-loop/notes.md)** — `.then` callbacks are microtasks; explains ordering vs timers.
- **[async/await](../async-await/notes.md)** — sugar over promises; `await` unwraps a promise's value.
- **[Callback hell](../callback-hell/notes.md)** — the problem promises were built to solve.
- **[Polyfills](../polyfills/notes.md)** — implementing `Promise.all` and friends.
- **[Fetch](../fetch/notes.md)** — a promise-based API; a common source of promise questions.

## 🧠 Rapid-fire Q&A

**Q: The three states?**
Pending → fulfilled (value) or rejected (reason). Settles once, then immutable.

**Q: What does `.then` return?**
A new promise — that's what makes chaining work.

**Q: Where do `.then` callbacks run relative to `setTimeout`?**
Earlier — they're microtasks; the microtask queue drains before any timer macrotask.

**Q: `all` vs `allSettled`?**
`all` rejects on the first failure and gives all values only if everyone succeeds; `allSettled` waits for all and reports each outcome, never rejecting.

**Q: `race` vs `any`?**
`race` settles with the first to settle (win or fail); `any` resolves with the first to *fulfil*, rejecting only if all fail.

**Q: How do you add a timeout to an async op?**
`Promise.race([operation(), timeoutThatRejectsAfterN()])`.

**Q: Does the executor run asynchronously?**
No — `new Promise(executor)` runs the executor synchronously; only the `.then` handlers are deferred.

**Q (design): Why chain flatly instead of nesting `.then`s?**
Nesting recreates callback hell; a flat chain with one `.catch` is readable and has a single error path.

## ✅ Cheat lines

- **Promise = future value; pending → fulfilled/rejected; settles once, immutable after.**
- **`.then` returns a new promise → chain dependent steps; rejections propagate to one `.catch`.**
- **`.then` callbacks are microtasks — they beat `setTimeout`.**
- **`all` = all-or-first-failure; `allSettled` = every outcome, never rejects; `race` = first to settle; `any` = first to fulfil.**
- **Executor runs synchronously; always attach a `.catch`.**
