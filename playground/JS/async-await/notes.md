# Async / Await

Run the code: `node playground/run.js JS async-await` — see [`demo.js`](demo.js).

Built on [promises](../promises/notes.md) and scheduled by the [event loop](../event-loop/notes.md) — read those first if the microtask timing here is fuzzy.

## ⚡ In one line

`async/await` is syntax sugar over promises: an `async` function always returns a promise, and `await` pauses that function until the awaited promise settles and resumes with its value — so asynchronous code reads top-to-bottom like synchronous code.

## 🔍 What the interviewer is really testing

- **Do you know it's promises underneath** — `await` doesn't block the thread; it suspends the function and schedules the rest as a microtask?
- **Can you handle errors** with `try/catch` and know how that maps to `.catch`?
- **Do you avoid the sequential-vs-parallel trap** — awaiting independent operations one by one instead of `Promise.all`?
- **Can you predict ordering** when `await` mixes with sync code and `setTimeout`?

## Why it exists (the problem)

Promise chains fixed [callback hell](../callback-hell/notes.md), but long `.then` chains still read awkwardly — logic split across arrow callbacks, values threaded through `.then` boundaries, and branching/loops clumsy. `async/await` lets you write the *same* promise logic as ordinary sequential statements with normal `try/catch`, `if`, and loops, so async code looks like the synchronous code you already know — while still being non-blocking.

## What it is

Two keywords over promises:

- **`async`** before a function makes it **always return a promise**. A `return x` fulfills that promise with `x`; a `throw` rejects it.
- **`await`** before a promise **pauses the async function** until the promise settles, then evaluates to its fulfilled value (or throws its rejection reason). `await` is only valid inside an `async` function (or at top level in a module).

Crucially, `await` **does not block the thread** — it suspends *just this function* and lets everything else run; when the promise settles, the function's continuation is queued as a **microtask**.

**Mental model:** `await` is a **bookmark**. The function reads up to the `await`, bookmarks its place, and steps away so other code can run. When the awaited result is ready, it returns to the bookmark and continues — exactly like a generator's pause/resume ([iterators & generators](../iterators-and-generators/notes.md)), which is what async functions are built on.

## 🎈 Real-life analogy (how to think about it)

**Ordering coffee and stepping aside.** You place your order (`await makeCoffee()`), then instead of standing frozen at the counter blocking the line (blocking the thread), you step aside so others can order. When your name is called (the promise settles), you pick up where you left off. The barista working in parallel is the async operation; you stepping aside is the non-blocking suspend; your name being called is the microtask that resumes your function.

## 🔧 How it works (under the hood)

An `async` function is essentially a **generator driven over promises**. Each `await` is a suspension point: the engine subscribes to the awaited promise (like `.then`) and, when it settles, resumes the function by feeding the value back in — the same two-way `next(value)` mechanism from [generators](../iterators-and-generators/notes.md).

**Timing:** the code *after* an `await` runs as a **microtask**, so:

```text
async function f() {
  console.log("A");
  await null;              // even awaiting a non-promise defers the rest
  console.log("C");        // microtask — runs after current sync code
}
f();
console.log("B");
// order: A, B, C
```

Everything before the first `await` runs synchronously (it's a normal function call up to that point); everything after is scheduled like a `.then`.

**Error handling maps to rejection:** `try { await p } catch (e) {}` catches `p`'s rejection — because `await` re-throws the rejection reason as a normal exception inside the function. A `throw` inside an async function rejects its returned promise.

**Sequential vs parallel:** each `await` waits for the previous line, so three sequential `await`s of 20ms take ~60ms. If the operations are **independent**, start them all first and await together with `Promise.all` — ~20ms. Awaiting independent work in series is the most common async performance bug.

## 💻 In code

All in [`demo.js`](demo.js). `await` unwraps the value; the function returns a promise:

```js
async function getValue() {
  const v = await wait(20, 42); // resumes with 42
  return v * 2;                 // fulfills the returned promise with 84
}
getValue().then((r) => console.log(r)); // 84
```

Errors via `try/catch`:

```js
async function mightFail() {
  try {
    await Promise.reject(new Error("boom"));
  } catch (err) {
    console.log(err.message); // "boom"
  }
}
```

Sequential (slow) vs parallel (fast):

```js
// ~60ms — each await waits for the last
await wait(20); await wait(20); await wait(20);

// ~20ms — start together, await once
await Promise.all([wait(20), wait(20), wait(20)]);
```

## 🏗️ Code quality & principles applied

**Decomposition — sequential statements, one concern per line.** async/await lets each step be a plain line with a clear name, instead of nested callbacks or threaded `.then`s.

**Principles by name:**
- **Readability** — the main win; say: *"I'll use async/await so this reads sequentially with normal control flow and one `try/catch`."*
- **Parallelize independent work (efficiency)** — `Promise.all` for things that don't depend on each other. Say: *"These don't depend on each other, so I fire them together with `Promise.all` instead of awaiting in series."*
- **Fail fast / explicit error handling** — wrap awaits in `try/catch` (or attach `.catch` to the returned promise); never leave rejections unhandled.
- **Separation of concerns** — extract async steps into named async functions rather than one giant function.

**Say while coding:** *"`await` suspends this function and schedules the rest as a microtask — it doesn't block the thread. Since these two calls are independent, I'll `Promise.all` them so they overlap."*

**What you deliberately did NOT do:** you didn't `await` inside a `.forEach` (its callback ignores the returned promise, so it won't actually wait) — use a `for...of` loop for sequential awaits or `Promise.all(map(...))` for parallel. And you didn't scatter `try/catch` around every line when one wrapping block suffices (KISS).

## 🗣️ Keywords to say

- **Syntactic sugar over promises** — async/await compiles down to promise mechanics.
- **Non-blocking suspend** — `await` pauses the function, not the thread.
- **Microtask continuation** — code after `await` runs as a microtask.
- **`async` returns a promise** — `return` fulfills, `throw` rejects.
- **Sequential vs parallel** — series of awaits vs `Promise.all`.
- **`for...of` for sequential awaits** — because `forEach` won't await.
- **Top-level await** — allowed in ES modules.

## 🎯 How it's asked in interviews

**The question, disguised:**
- "What is async/await? How does it relate to promises?"
- "What's the output?" — async function + sync logs + `setTimeout` (an [event loop](../event-loop/notes.md) puzzle).
- "Make these requests run in parallel." → `Promise.all`.
- "Why doesn't `await` work inside `forEach`?"
- "Convert this promise chain to async/await" (or vice versa).
- "How do you handle errors with async/await?"

**Follow-up ladder:** define it → error handling with `try/catch` → sequential vs parallel (`Promise.all`) → ordering vs `setTimeout` (microtask) → `await` in loops (`for...of` vs `forEach`) → "what does an async function return?" → how it maps to generators.

**Traps & gotchas:**
- **Awaiting independent calls sequentially** — slow; use `Promise.all`.
- **`await` inside `array.forEach`** — the callback's promise is ignored, so it doesn't wait; use `for...of`.
- **Thinking `await` blocks the thread** — it suspends only the current function; the event loop keeps running.
- **Unhandled rejection** — an async function's rejection needs a `try/catch` or a `.catch` on the returned promise.
- **`return await` vs `return`** — usually equivalent; `return await` matters inside `try` so the rejection is caught locally.
- **Forgetting async functions always return a promise** — the *value* isn't the return; the promise is.

**Model answer sketch** ("what is async/await + a gotcha"): *"It's syntax sugar over promises. Marking a function `async` makes it return a promise; `await` pauses that function until the awaited promise settles and resumes with its value — without blocking the thread, because the continuation is scheduled as a microtask. Errors become normal exceptions, so I use `try/catch`. The main gotcha is performance: awaiting independent operations one after another serializes them; if they don't depend on each other I run them together with `Promise.all`. And `await` doesn't work in `forEach` — I use `for...of` for sequential or `Promise.all(map(...))` for parallel."*

## 🔗 Linked concepts

- **[Promises](../promises/notes.md)** — what async/await is built on; `await` unwraps a promise.
- **[Event loop](../event-loop/notes.md)** — the post-`await` continuation is a microtask.
- **[Iterators & Generators](../iterators-and-generators/notes.md)** — an async function is a generator driven over promises (pause/resume).
- **[Callback hell](../callback-hell/notes.md)** — the readability problem async/await finishes solving.

## 🧠 Rapid-fire Q&A

**Q: What does an `async` function return?**
Always a promise — `return` fulfills it, `throw` rejects it.

**Q: Does `await` block the thread?**
No. It suspends only that function; the event loop keeps running. The rest resumes as a microtask.

**Q: How do you handle errors?**
`try/catch` around the `await` (or `.catch` on the returned promise) — `await` re-throws a rejection as an exception.

**Q: Three independent 20ms calls — sequential vs parallel time?**
Sequential ~60ms (each await waits); parallel ~20ms with `Promise.all`.

**Q: Why doesn't `await` work in `forEach`?**
`forEach` ignores the promise its callback returns, so it doesn't wait. Use `for...of` (sequential) or `Promise.all(map(...))` (parallel).

**Q: Where does code after `await` run in the event loop?**
As a microtask — after the current synchronous code, before timers.

**Q (design): When do you reach for `Promise.all` vs sequential awaits?**
`Promise.all` when operations are independent (overlap them); sequential when each step needs the previous step's result.

## ✅ Cheat lines

- **async/await = sugar over promises; `async` returns a promise, `await` unwraps one.**
- **`await` suspends the function (not the thread); the rest resumes as a microtask.**
- **Errors → `try/catch`; independent work → `Promise.all`, not serial awaits.**
- **`await` doesn't work in `forEach` — use `for...of` or `Promise.all(map(...))`.**
- **An async function is a generator driven over promises (pause/resume).**
