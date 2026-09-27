# The Event Loop

Run the code: `node playground/run.js JS event-loop` — see [`demo.js`](demo.js).

This is the **anchor** for everything async — [promises](../promises/notes.md), [async/await](../async-await/notes.md), [setTimeout issues](../settimeout-issues/notes.md), and [callback hell](../callback-hell/notes.md) all reference this note instead of re-explaining it.

## ⚡ In one line

JavaScript is single-threaded with one call stack; the event loop is the mechanism that, whenever the stack is empty, runs all queued microtasks (promise callbacks) and then one macrotask (a timer/I-O callback) — which is how a single thread does non-blocking async work.

## 🔍 What the interviewer is really testing

- **Do you understand single-threaded + non-blocking** — how one thread handles timers, I/O, and promises without freezing?
- **Can you predict output order** of sync code, `setTimeout`, and `Promise.then`? This is the #1 async interview question.
- **Do you know the microtask vs macrotask priority** — microtasks drain completely before the next macrotask?
- **Can you explain where the async work actually happens** (Web APIs / libuv), not "JS runs it in the background"?

## Why it exists (the problem)

JS has a single thread — if it ever *blocked* to wait for a network response or a timer, the whole page (or server) would freeze. So slow work isn't done on the JS thread at all: it's handed off to the environment (browser Web APIs, or Node's libuv), and when it finishes, a callback is **queued** to run later. The event loop is the traffic cop that decides *when* those queued callbacks get their turn on the one thread, so nothing blocks and order stays predictable.

## What it is

Four moving parts:

- **Call stack** — where function calls run, one at a time (single thread).
- **Web APIs / Node APIs** — the environment features (timers, `fetch`, file I/O) that do the actual waiting *off* the JS thread.
- **Macrotask queue** (a.k.a. task/callback queue) — callbacks from `setTimeout`, `setInterval`, I/O, UI events wait here.
- **Microtask queue** — callbacks from resolved **promises** (`.then`/`.catch`/`.finally`), `await` continuations, `queueMicrotask`, and (browser) `MutationObserver`. Higher priority.

**The loop's rule:** run the current synchronous code to completion → **drain the entire microtask queue** → take **one** macrotask and run it → drain microtasks again → (browser: render) → repeat.

**Mental model:** the call stack is a single checkout counter. Microtasks are VIP customers who must *all* be served before any regular customer. Macrotasks are the regular line — you serve exactly *one*, then re-check the VIP line before serving the next regular.

## 🎈 Real-life analogy (how to think about it)

A **chef (one thread) with a ticket rail**.

- The chef cooks one dish at a time — that's the call stack.
- Slow tasks (a stock simmering, dough proving) are set aside on timers/helpers — the **Web APIs** doing work off to the side.
- When a slow task is ready, its ticket goes on a rail. **Microtask** tickets are marked "urgent — finish these before starting any new normal order." **Macrotask** tickets are normal orders.
- The chef's rule: finish the dish in hand, clear **all** urgent tickets, then start **one** normal order, then check the urgent rail again. That "all urgent, then one normal" is exactly microtasks vs macrotasks.

## 🔧 How it works (under the hood)

Trace the classic snippet:

```text
console.log("1")                       -> stack runs it now                -> prints 1
setTimeout(cb, 0)                      -> handed to timer API; cb queued as MACROtask
Promise.resolve().then(cb2)            -> cb2 queued as MICROtask
console.log("2")                       -> stack runs it now                -> prints 2
--- synchronous code done, stack empty ---
drain microtasks: run cb2              -> prints 3
take one macrotask: run cb (timer)     -> prints 4
```

So the order is **1, 2, 3, 4** — sync first, then the promise (microtask), then the timer (macrotask), even though the timer was scheduled first and had `0ms`.

**Why microtasks win:** after each task (and after the initial sync run), the loop empties the *whole* microtask queue before touching macrotasks. A microtask can even schedule more microtasks, and they *all* run before the next macrotask — which is also how you can starve the loop with an infinite microtask chain.

**Node specifics (mention if asked):** Node's loop has **phases** (timers → pending → poll → check (`setImmediate`) → close). Between callbacks it drains microtasks, but Node adds `process.nextTick`, which runs **before** the promise microtask queue — even higher priority. `setImmediate` vs `setTimeout(…, 0)` ordering depends on context. Browsers don't have `nextTick`/`setImmediate`; they add a **render** step after microtasks.

**Where the work happens:** `setTimeout`/`fetch`/I/O don't run on the JS thread — the browser or libuv (often via a thread pool for file I/O) handles them and only *queues the callback* when done. "JS is single-threaded" is about the **call stack**, not the whole runtime.

## 💻 In code

All in [`demo.js`](demo.js). The ordering that proves the model:

```js
console.log("1: sync start");
setTimeout(() => console.log("4: setTimeout (macrotask)"), 0);
Promise.resolve().then(() => console.log("3: promise (microtask)"));
console.log("2: sync end");
// prints 1, 2, 3, 4
```

And the deeper point — a microtask queued *inside* a macrotask runs before the *next* macrotask:

```js
setTimeout(() => {
  console.log("A");
  Promise.resolve().then(() => console.log("B")); // drains before C
}, 0);
setTimeout(() => console.log("C"), 0);
// A, B, C
```

## 🏗️ Code quality & principles applied

This is a runtime-model topic, so "quality" is about **writing code that respects the loop**:

- **Never block the thread** — no long synchronous loops or sync file reads on a request path; they freeze everything until the stack clears. Say: *"I keep the main thread free — heavy work goes to a worker or is chunked, because a blocked stack blocks the whole event loop."*
- **Don't rely on `setTimeout(…, 0)` for ordering** — it's a macrotask that runs *after* microtasks and *after* the current call stack; the delay is a minimum, not a guarantee (see [setTimeout issues](../settimeout-issues/notes.md)).
- **Prefer microtask-based async (promises/await)** for sequencing continuation logic; understand it can starve rendering if abused.

**Say in the room:** *"Sync runs first, then all microtasks, then one macrotask — so the promise logs before the timer. That priority is the whole reason `Promise.then` beats `setTimeout(0)`."*

**What you deliberately did NOT do:** you don't use `setTimeout` to "wait" for a promise or to force ordering — that's fragile; you sequence with `await`/`.then`, which the loop guarantees.

## 🗣️ Keywords to say

- **Single-threaded / non-blocking** — one call stack; slow work is offloaded, callbacks queued.
- **Call stack** — where synchronous execution happens.
- **Macrotask (task) queue** — `setTimeout`, I/O, UI events; one runs per loop turn.
- **Microtask queue** — promise callbacks, `await` continuations, `queueMicrotask`; drained fully each turn.
- **Web APIs / libuv** — the environment doing the actual waiting off-thread.
- **`process.nextTick`** (Node) — runs before the promise microtask queue; highest priority.
- **Starvation** — endless microtasks blocking macrotasks/rendering.
- **Render step** (browser) — happens after microtasks, before the next macrotask.

## 🎯 How it's asked in interviews

**The question, disguised:**
- "What will this print?" — sync + `setTimeout` + `Promise.then` (sometimes + `async/await`).
- "Explain the event loop / how is async JS single-threaded?"
- "Difference between microtask and macrotask?"
- "Why does `Promise.resolve().then` run before `setTimeout(fn, 0)`?"
- "What's `process.nextTick` / `setImmediate` and how do they order?" (Node)

**Follow-up ladder:** predict the 1-2-3-4 order → explain *why* (microtasks drain first) → add an `async/await` line and re-predict → nested microtask inside a macrotask → Node `nextTick`/`setImmediate` → "how could you starve the loop?" → "what happens to rendering?"

**Traps & gotchas:**
- Saying `setTimeout(fn, 0)` runs "immediately" or "next" — it runs after sync **and** all microtasks.
- Thinking JS is multi-threaded because timers/`fetch` "run in the background" — the *call stack* is single-threaded; the environment offloads the waiting.
- Forgetting `await`'s continuation is a **microtask** — code after `await` is scheduled like a `.then`.
- Assuming timers are exact — the delay is a **minimum**; the callback waits for its turn ([setTimeout issues](../settimeout-issues/notes.md)).
- Confusing browser and Node models (no `nextTick`/`setImmediate` in browsers; no render step in Node).

**Model answer sketch** ("explain the event loop / predict output"): *"JS has one call stack, so it runs sync code first. Anything async — timers, I/O, promises — is offloaded and its callback queued. There are two queues: microtasks (promise/`await` callbacks) and macrotasks (timers, I/O). The loop's rule is: finish the current stack, drain **all** microtasks, then run **one** macrotask, then drain microtasks again. So in this snippet the two `console.log`s run first, then the promise `.then` because it's a microtask, then the `setTimeout` because it's a macrotask — 1, 2, 3, 4. In Node, `process.nextTick` jumps ahead of even the promise queue."*

## 🔗 Linked concepts

- **[Promises](../promises/notes.md)** — `.then` callbacks are the microtasks the loop drains first.
- **[async/await](../async-await/notes.md)** — `await` schedules its continuation as a microtask.
- **[setTimeout issues](../settimeout-issues/notes.md)** — why `setTimeout` delay is a minimum, tied to the macrotask queue.
- **[Callback hell](../callback-hell/notes.md)** — the async callbacks all flow through these queues.
- **[Closures](../closures/notes.md)** — the `var`-loop bug is really "callbacks run later," an event-loop fact.

## 🧠 Rapid-fire Q&A

**Q: Is JavaScript multi-threaded?**
The call stack is single-threaded. The runtime (browser/libuv) offloads waiting and thread-pool I/O, but your JS runs one thing at a time.

**Q: Microtask vs macrotask?**
Microtasks (promise/`await` callbacks, `queueMicrotask`) drain *fully* after each task; macrotasks (timers, I/O, UI events) run *one per* loop turn. Microtasks have priority.

**Q: Output of `log(1); setTimeout(log(4),0); Promise.resolve().then(log(3)); log(2)`?**
1, 2, 3, 4 — sync, then microtask, then macrotask.

**Q: Why does a promise `.then` beat `setTimeout(fn, 0)`?**
It's a microtask; the whole microtask queue drains before any macrotask like a timer.

**Q: Where does `await`'s code-after-await run?**
As a microtask — the continuation is scheduled like a `.then` callback.

**Q: What's `process.nextTick`?**
A Node queue that runs before the promise microtask queue — the highest priority; overuse can starve I/O.

**Q: How can you starve the event loop?**
An endless chain of microtasks (or a long synchronous loop) — macrotasks and rendering never get a turn.

**Q (design): Why avoid blocking synchronous work on the main thread?**
A busy call stack blocks the entire loop — no timers, I/O callbacks, or rendering run until it clears. Offload or chunk heavy work.

## ✅ Cheat lines

- **One thread, one stack — the event loop runs queued callbacks when the stack is empty.**
- **Order: sync → drain ALL microtasks → ONE macrotask → repeat.**
- **Microtasks = promise/`await` callbacks; macrotasks = timers/I-O/UI events.**
- **`Promise.then` beats `setTimeout(0)` because microtasks drain before any macrotask.**
- **Node adds `process.nextTick` (before promises) and phases; browsers add a render step after microtasks.**
