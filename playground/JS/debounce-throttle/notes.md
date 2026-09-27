# Debouncing & Throttling

Run the code: `node playground/run.js JS debounce-throttle` — see [`demo.js`](demo.js).

## ⚡ In one line

Both cap how often a function runs during a burst of events — **debounce** waits until the events go quiet and then runs once; **throttle** runs at most once per fixed interval while the events keep coming.

## 🔍 What the interviewer is really testing

- **Can you implement both** with a closure over a timer? This is a top "write it live" question.
- **Do you know which to use when** — debounce for "wait until they stop" (search, resize-then-recompute), throttle for "steady cadence" (scroll, drag, rate-limited API)?
- **Do you handle the details** — passing arguments through, preserving `this`, leading vs trailing edge, cancel?
- **Do you see the closure** — the timer/flag that persists between calls is the whole trick.

## Why it exists (the problem)

Events like `keyup`, `scroll`, `resize`, and `mousemove` fire dozens of times a second. If each one triggers an expensive handler — a network request, a re-render, a layout calculation — you flood the system with wasted work and janky UI. Debounce and throttle **rate-limit** the handler so the expensive work happens a sensible number of times instead of on every raw event.

## What it is

- **Debounce** — postpone running until the events **stop** for `wait` ms. Every new call resets the timer. Result: it runs **once**, after the burst ends. "Wait until they're done."
- **Throttle** — run at most **once per `wait` ms**, no matter how many events arrive in between. Result: a steady drip during the burst. "One every X ms."

Both are **higher-order functions** that return a wrapped version of your function, using a **closure** to remember a timer (debounce) or a cooldown flag (throttle) between calls.

**Mental model:**
- Debounce = an **elevator door**. Every new person stepping in resets the "closing" timer; the door only closes once nobody has entered for a few seconds.
- Throttle = a **turnstile with a cooldown**. It lets one person through, then locks for X seconds regardless of how many push against it, then lets the next through.

## 🎈 Real-life analogy (how to think about it)

**Debounce = a motion-sensor light with a timer.** As long as it keeps detecting movement it keeps resetting; it only switches off after the room has been still for, say, 30 seconds. The action (turning off) happens after activity *stops*.

**Throttle = a factory stamp on a conveyor belt.** It stamps once, then physically can't stamp again until it resets — so even if ten items rush past, it stamps at a fixed maximum rate. The action happens at a *steady interval* during activity.

## 🔧 How it works (under the hood)

**Debounce** keeps a `timerId` in the closure. On each call it **clears** the previous pending timer and **sets a new one**. If calls keep coming faster than `wait`, the timer never gets to fire — only when a gap of `wait` ms appears does the last scheduled call run.

```text
call ---reset timer--- call ---reset timer--- call ......(quiet for wait)......> FIRE (last args)
```

**Throttle** keeps an `isWaiting` flag. The first call runs immediately and starts a cooldown; calls during the cooldown are **dropped**; when the cooldown ends, the next call is allowed.

```text
call FIRE [cooldown....] call(dropped) call(dropped) [cooldown ends] call FIRE [cooldown....]
```

**Details that separate senior answers:**
- **Pass arguments and `this` through** — the wrapper should forward `...args` and, for real DOM use, call with the right `this` (use `fn.apply(this, args)` if the handler relies on `this`).
- **Leading vs trailing edge** — debounce can fire on the *leading* edge (immediately, then wait) or *trailing* edge (after the pause, the common default). Throttle similarly can fire leading and/or trailing.
- **Trailing call for throttle** — a fuller throttle also fires once more at the end so the final event isn't lost. The simple flag version above skips the trailing call — call that out.
- **A `cancel()` method** — real libraries (lodash) expose `.cancel()` to clear a pending debounce (e.g. on unmount).

## 💻 In code

All in [`demo.js`](demo.js). Debounce — reset the timer on every call:

```js
function debounce(fn, wait) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), wait);
  };
}
```

Throttle — run now, then ignore calls during the cooldown:

```js
function throttle(fn, wait) {
  let isWaiting = false;
  return function (...args) {
    if (isWaiting) return;
    fn(...args);
    isWaiting = true;
    setTimeout(() => { isWaiting = false; }, wait);
  };
}
```

For a burst of 5 rapid calls: **throttle** fires on the first (and again after each cooldown), **debounce** fires only once, after the calls stop.

## 🏗️ Code quality & principles applied

**Decomposition — the rate-limiting policy is separated from the work.** `debounce`/`throttle` own *when* to run; your handler owns *what* to do. One utility wraps any handler.

**Principles by name:**
- **Higher-order function + closure** — returns a wrapped function; the timer/flag lives in the closure. Say: *"The timer persists in the closure between calls — that's what makes this work."*
- **Single Responsibility** — the wrapper only manages timing; it doesn't know or care what the handler does.
- **Separation of concerns / reuse (DRY)** — the same `debounce` throttles search, resize, autosave — written once.

**Say while coding:** *"I'll return a function closing over a timer; debounce clears and resets it each call so it fires only after the pause. I'll forward `...args` and use `apply` to keep `this` for DOM handlers."*

**What you deliberately did NOT do:** you didn't reach for a library for a one-off (KISS), and you kept the first version trailing-only, then *named* the missing pieces (leading edge, trailing call, cancel) rather than silently shipping an incomplete one — showing you know the full shape.

## 🗣️ Keywords to say

- **Debounce** — run once after events go quiet for `wait` ms (resets the timer each call).
- **Throttle** — run at most once per `wait` ms during a burst.
- **Leading / trailing edge** — fire at the start of the burst vs the end.
- **Rate limiting** — capping how often work happens.
- **Closure over a timer** — the persisting `timerId`/flag; the core mechanism.
- **`clearTimeout` / cooldown** — debounce cancels the pending run; throttle blocks during cooldown.
- **Cancel** — clearing a pending debounced call (e.g. on unmount).

## 🎯 How it's asked in interviews

**The question, disguised:**
- "Implement debounce." / "Implement throttle." (Very common — often both.)
- "Optimize this search-as-you-type / scroll handler / window-resize handler." → debounce or throttle.
- "Difference between debounce and throttle, and when would you use each?"
- "Add leading-edge / `cancel` support to your debounce." — the follow-up.
- React: "How would you debounce an input?" → wrap in a memoized debounced callback so it isn't recreated each render.

**Follow-up ladder:** define both → implement debounce → implement throttle → forward args + `this` → add leading edge / trailing call → add `cancel()` → "which for scroll vs search, and why?"

**Traps & gotchas:**
- **Recreating the debounced function on every render** (React) — a new timer each time means it never actually debounces; memoize it (`useMemo`/`useRef`).
- **Forgetting to pass arguments** — the handler needs the event/args; forward `...args`.
- **Losing `this`** — use `fn.apply(this, args)` for methods/DOM handlers.
- **Mixing them up** — debounce = after the pause (one shot); throttle = during, at a fixed rate.
- **Throttle dropping the last event** — the naive flag version doesn't fire the trailing call; mention it.

**Model answer sketch** ("implement debounce + when vs throttle"): *"Debounce delays running until the events stop — I return a function that clears and resets a timer stored in a closure, so it fires once `wait` ms after the last call. Throttle instead runs immediately then blocks with a cooldown flag until `wait` passes. Use debounce when you only care about the final state — search-as-you-type, resize-then-recompute. Use throttle when you want steady updates during the action — scroll position, drag, or capping API calls."* Then mention forwarding args/`this` and that a production version adds leading edge, a trailing call, and `cancel`.

## 🔗 Linked concepts

- **[Closures](../closures/notes.md)** — the persisted timer/flag is the closure; this is a closure question.
- **[Higher-Order Functions](../higher-order-functions/notes.md)** — both are HOFs (wrap and return a function).
- **setTimeout issues + Event loop** *(planned)* — the timing relies on `setTimeout`, whose delay is a *minimum*, not exact.

## 🧠 Rapid-fire Q&A

**Q: Debounce vs throttle in one line?**
Debounce runs once after events stop; throttle runs at most once per interval while they continue.

**Q: What's the core mechanism?**
A closure holding a timer (debounce) or a cooldown flag (throttle) that persists between calls.

**Q: Search-as-you-type — which one?**
Debounce — you only want to query once the user pauses typing.

**Q: Scroll-position indicator — which one?**
Throttle — you want steady updates during the scroll, not just one at the end.

**Q: Why might my debounce "not work" in React?**
It's likely recreated every render, resetting the timer each time. Memoize it with `useMemo`/`useRef` so the same instance persists.

**Q: How do you keep `this` and the event object?**
Forward `...args` and call with `fn.apply(this, args)`.

**Q (design): What does the simple throttle miss?**
The trailing call — the final event during a cooldown is dropped; a fuller throttle schedules one last run at the end.

## ✅ Cheat lines

- **Debounce = wait until quiet, then run once. Throttle = run at most once per interval.**
- **Both are HOFs returning a wrapper with a closure over a timer/flag.**
- **Debounce for search/resize (final state); throttle for scroll/drag/API caps (steady rate).**
- **Forward `...args` and `apply` `this`; in React, memoize so the timer persists.**
- **Debounce clears+resets the timer each call; throttle blocks during a cooldown.**
