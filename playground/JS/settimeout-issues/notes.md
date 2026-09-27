# setTimeout Issues & Trust Issues

Run the code: `node playground/run.js JS settimeout-issues` — see [`demo.js`](demo.js).

This builds directly on the [event loop](../event-loop/notes.md) — the delay behavior only makes sense with the macrotask model.

## ⚡ In one line

`setTimeout(fn, delay)` doesn't run `fn` after *exactly* `delay` ms — it queues `fn` as a macrotask to run **no sooner than** `delay`, once the call stack is clear and all microtasks have drained; the delay is a **minimum, not a guarantee**.

## 🔍 What the interviewer is really testing

- **Do you know the delay is a minimum**, and can you explain *why* (single thread + macrotask queue)?
- **Do you know `setTimeout(fn, 0)` still runs after sync code and microtasks**?
- **Do you understand "trust issues"** — handing your callback to a scheduler means giving up control of when/whether/how often it runs (inversion of control)?
- **Can you tie it to the `var`-in-a-loop bug** — the callbacks run *later*, after the loop finishes?

## Why it exists (the problem)

You need to run code "later" — after a delay, or "on the next tick" to let the UI update. `setTimeout` gives you that, but people misread it as a precise timer or an "immediately" escape hatch. Understanding its real contract (a *minimum* delay, scheduled behind sync code and microtasks) is what stops timing bugs and flaky tests. And the broader "trust issues" framing explains *why* the industry moved from callbacks to promises.

## What it is

`setTimeout(callback, delay)` tells the environment: "after at least `delay` ms, put `callback` on the **macrotask queue**." When it actually runs depends on the [event loop](../event-loop/notes.md): the current call stack must be empty, all **microtasks** must have drained, and it must be this task's turn. So the real delay is `delay` **plus** however long the thread stays busy.

Two specific facts interviewers probe:
- **`setTimeout(fn, 0)`** — not immediate. It's a macrotask, so it runs after all synchronous code and after the entire microtask queue (promise callbacks). Its practical use is "yield the thread — run this *after* the current work."
- **Minimum-delay clamping** — browsers clamp nested timers (5+ deep) to a **minimum of ~4ms**, and background/inactive tabs throttle timers heavily. So `0` often behaves like `4`, and background timers can be delayed to seconds.

**"Trust issues"** (from the callback-vs-promise story): when you pass a callback to `setTimeout` (or any third party), you **trust** it to call your function — once, at the right time, with the right arguments, and to not swallow errors. You've handed off control of your own continuation. That loss of control is **inversion of control**, and it's a core reason promises exist.

**Mental model:** `setTimeout` is a **kitchen timer that only rings when the chef is free**. Setting it for 5 minutes doesn't summon the chef mid-task; it rings *no earlier* than 5 minutes, and the chef attends to it only after finishing whatever's in hand.

## 🎈 Real-life analogy (how to think about it)

**A "call me back in 10 minutes" note left at a busy front desk.** The 10 minutes is the *earliest* they'll call — but if the clerk is mid-conversation with someone else (the thread is blocked), your callback waits until they're free. You're also *trusting* the clerk to actually call, once, and pass your message correctly. You gave them the note and lost control of the outcome — that's the trust issue.

## 🔧 How it works (under the hood)

```text
setTimeout(cb, 50)   -> environment starts a 50ms timer OFF the JS thread
...JS keeps running synchronous code...
after 50ms           -> cb is placed on the MACROtask queue (not run yet)
event loop           -> runs cb only when: stack empty AND microtasks drained AND its turn
```

So if your synchronous code runs for 100ms after scheduling, a `50ms` timer fires at ~100ms, not 50ms — demonstrated in [`demo.js`](demo.js) by blocking the thread with a busy loop.

**Ordering with microtasks:** `setTimeout(fn, 0)` loses to `Promise.resolve().then(...)` every time, because microtasks drain before any macrotask. If you need "after the current stack but as soon as possible," a microtask (`queueMicrotask`/promise) is sooner than `setTimeout(0)`.

**Tie to the closure loop bug:** `for (var i…) setTimeout(() => log(i))` prints the final `i` for every callback — because the timers fire *after* the synchronous loop completes, and all callbacks share the one `var i`. That's the event-loop "runs later" fact meeting the [closures](../closures/notes.md) scoping fact.

## 💻 In code

All in [`demo.js`](demo.js). `setTimeout(0)` runs last:

```js
console.log("1");
setTimeout(() => console.log("4"), 0);      // macrotask
Promise.resolve().then(() => console.log("3")); // microtask
console.log("2");
// 1, 2, 3, 4
```

The delay is a minimum — block the thread and the timer fires late:

```js
setTimeout(() => console.log("fired late"), 50);
const end = Date.now() + 100;
while (Date.now() < end) {} // busy-block ~100ms — timer can't run until this ends
// the 50ms timer actually fires at ~100ms
```

## 🏗️ Code quality & principles applied

The "quality" here is **not misusing `setTimeout`**:

- **Don't use `setTimeout` to sequence async work or "wait" for a promise** — that's guessing at timing and is flaky. Use `await`/`.then`, which the loop *guarantees* to run after the awaited promise settles. Say: *"I won't `setTimeout` to wait for that request — I'll await the promise so ordering is guaranteed, not timing-based."*
- **Don't block the thread** — a long synchronous task delays every timer and freezes the UI; chunk it or offload to a worker.
- **Prefer promises over raw callbacks** to avoid inversion of control — you keep control of continuation and error handling. Say: *"I'd wrap this in a promise so I'm not trusting a callback to be called correctly — that's the inversion-of-control problem."*
- **Clean up timers** — clear `setTimeout`/`setInterval` on unmount/teardown to avoid callbacks firing against dead state.

**What you deliberately did NOT do:** you didn't rely on `setTimeout(…, 300)` "to make sure X finished" — that's a race waiting to break; you sequence with promises instead (KISS + correctness).

## 🗣️ Keywords to say

- **Minimum delay, not exact** — `setTimeout` runs *no sooner* than `delay`.
- **Macrotask** — where the callback is queued; runs after sync + microtasks.
- **Clamping / throttling** — ~4ms minimum for nested timers; heavy throttling in background tabs.
- **Inversion of control** — giving a third party control over calling your callback.
- **Trust issues** — will it call my callback once, on time, correctly, without swallowing errors?
- **`queueMicrotask`** — a *sooner-than-`setTimeout(0)`* way to defer.
- **Thread blocking** — long sync work delays all timers.

## 🎯 How it's asked in interviews

**The question, disguised:**
- "Is `setTimeout(fn, 1000)` guaranteed to run in exactly 1 second? Why not?"
- "What does `setTimeout(fn, 0)` do — does it run immediately?"
- "What's the output?" — `setTimeout(0)` vs a promise vs sync logs.
- "Why does my loop with `setTimeout` print the same number?" → [closures](../closures/notes.md) + event loop.
- "What are the 'trust issues' with callbacks?" (the You-Don't-Know-JS framing) → inversion of control.
- "Why use promises instead of `setTimeout`-based flows?"

**Follow-up ladder:** minimum vs exact → why (single thread + macrotask) → `setTimeout(0)` vs microtask ordering → clamping/background throttling → the closure loop bug → inversion of control / trust issues → "how would you make a reliable delay-then-do-X?" (`await` a promise that resolves after the timer).

**Traps & gotchas:**
- Saying `setTimeout(fn, 0)` runs "immediately" or "before promises."
- Assuming exact timing — long tasks, clamping, and background throttling all push it later.
- Using `setTimeout` as a synchronization primitive (waiting a magic number of ms for something to finish).
- Forgetting `setInterval` drift and that intervals can pile up if the callback is slow.
- Not clearing timers, so stale callbacks fire.

**Model answer sketch** ("is setTimeout exact + trust issues"): *"No — the delay is a minimum. `setTimeout` queues the callback as a macrotask after at least that delay, and it only runs once the call stack is empty and microtasks have drained. So a busy thread or a `0` delay both push it later than you'd expect; `setTimeout(0)` still runs after synchronous code and all promise callbacks. The 'trust issues' are the deeper point: when I hand a callback to a scheduler I'm trusting it to call my function once, on time, with the right args, and not eat errors — that's inversion of control. Promises fix it: I hold the object and attach my own handlers, and timing is guaranteed by the loop rather than guessed with a delay."*

## 🔗 Linked concepts

- **[Event loop](../event-loop/notes.md)** — the macrotask model that makes the delay a minimum.
- **[Closures](../closures/notes.md)** — the `var`-loop `setTimeout` bug.
- **[Callback hell](../callback-hell/notes.md)** — inversion of control, spelled out there too.
- **[Promises](../promises/notes.md)** — the fix for trust issues and for guaranteed sequencing.

## 🧠 Rapid-fire Q&A

**Q: Does `setTimeout(fn, 1000)` run in exactly 1s?**
No — no sooner than 1s. It's queued as a macrotask and runs only when the stack is clear and microtasks have drained.

**Q: Is `setTimeout(fn, 0)` immediate?**
No — it runs after all synchronous code and all microtasks (promise callbacks).

**Q: Sooner than `setTimeout(0)`?**
A microtask — `queueMicrotask` or `Promise.resolve().then(...)`.

**Q: Why does a `var` loop with `setTimeout` print the last number?**
The callbacks fire after the loop finishes and all share the one function-scoped `var`; fix with `let`.

**Q: What are "trust issues" with callbacks?**
You surrender control: the callee may call your callback too early/late, too many times, not at all, or swallow errors — inversion of control.

**Q: Why can a 50ms timer fire at 100ms?**
A synchronous task blocked the single thread, so the callback couldn't run until the stack cleared.

**Q (design): How do you reliably "do X after Y finishes"?**
Await a promise for Y (or `.then`) — the loop guarantees the continuation; don't guess with a `setTimeout` delay.

## ✅ Cheat lines

- **`setTimeout` delay is a MINIMUM — runs after the stack clears and microtasks drain.**
- **`setTimeout(0)` is a macrotask — it runs after sync code AND all promises.**
- **Nested timers clamp to ~4ms; background tabs throttle hard.**
- **Trust issues = inversion of control: you trust the scheduler to call your callback correctly. Promises take that control back.**
- **Never use a `setTimeout` delay to synchronize async work — await a promise instead.**
