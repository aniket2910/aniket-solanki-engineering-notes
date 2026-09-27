# Debounced Input

**Runnable code:** [`playground/src/problems/debounce-input/`](playground/src/problems/debounce-input/) — run with `cd playground && npm install && npm run dev`, then pick **Debounced Input** in the sidebar. Type in bursts with a pause between — the keystroke count climbs, but a search fires only once per pause.

## ⚡ In one line

Update the input on **every** keystroke so the UI feels instant, but run the expensive work — a search, a fetch — only **once the user pauses** for `wait` ms; and in React the entire trick is making that debounced function survive re-renders instead of getting rebuilt (with a fresh, empty timer) on every keystroke.

## 🔍 What the interviewer is really testing

- **Do you understand the closure?** Debounce works because one `timerId` persists between calls and every call resets it. If you can't name that, you don't understand debounce.
- **Do you know why it "doesn't work" in React?** A component re-runs its whole body per render, so `debounce(fn, wait)` written inline is recreated every keystroke — a new empty timer each time, so it never debounces. Reaching for `useMemo`/`useRef` unprompted is the senior signal.
- **`this` and `apply`.** A production-grade utility forwards `...args` and preserves `this` via `fn.apply(this, args)` so it's correct for DOM handlers and object methods, not just closures. Interviewers love "why `apply` here?"
- **The stale-closure trap.** Memoize the debounced fn once *and* keep the latest handler in a ref — otherwise the frozen debounced fn keeps calling the first render's stale closure.
- **Cleanup.** Cancel the pending timer on unmount, or it fires and setStates on a dead component.

## Why it exists (the problem)

Events like `keyup`, `scroll`, `resize`, and `mousemove` fire dozens of times a second. Search-as-you-type is the canonical case: if every keystroke triggers a network request, typing "react hooks" fires ~11 requests, most of them instantly stale, hammering the server and racing each other so an earlier response can overwrite a later one. Debounce **rate-limits** the work so it happens a sensible number of times — here, once the user stops typing — instead of on every raw event.

## What it is

- **Debounce** — postpone running until the events **stop** for `wait` ms. Every new call resets the timer, so it runs **once**, after the burst ends. "Wait until they're done." (Contrast **throttle**: run at most once per `wait` ms *during* a burst — steady cadence, for scroll/drag.)
- It's a **higher-order function**: `debounce(fn, wait)` returns a wrapped version of `fn`, using a **closure** to remember the `timerId` between calls.
- In React it's the same utility, but wrapped so its single instance (and single timer) **persists across renders** — that's the only React-specific part.

## 🎈 Real-life analogy (how to think about it)

**An elevator door.** Every new person stepping in resets the "closing" timer; the door only actually closes once nobody has entered for a few seconds. The action (close = run the search) happens after the activity *stops*, and only the final state matters — not each individual person.

The **React trap** in the same analogy: imagine the elevator forgot the timer every time someone stepped in and started a brand-new door with a brand-new timer. The door would never get to close. That's exactly what recreating the debounced function on every render does — a fresh timer each keystroke, so the pause is never detected.

## 🔧 How it works (under the hood)

**The pure debounce** keeps a `timerId` in its closure. On each call it **clears** the previous pending timer and **sets a new one**. If calls arrive faster than `wait`, the timer never fires; only a gap of `wait` ms lets the last scheduled call run.

```text
key ─reset─ key ─reset─ key ......(quiet for wait)......▶ FIRE once, with the LAST args
```

**Why `function` not an arrow, and why `apply`:** the wrapper is a normal `function` so it receives its own dynamic `this` — whatever the caller invoked it with. We snapshot that `this` and the `...args`, then inside `setTimeout` call `fn.apply(context, args)` so the original runs with the right receiver and arguments even though it fires *later*. (Deep dive on `apply` below.)

**The React wrapper** solves persistence with two hooks:

- `useMemo(() => debounce(...), [wait])` builds the debounced function **once** (per `wait`) and returns the *same* instance across renders — so its one `timerId` lives for the component's life.
- `useRef` holds the **latest** handler; the memoized wrapper calls `fnRef.current(...args)` so it always runs the freshest closure. Changing a ref doesn't re-render and it survives renders — perfect for "keep this current without rebuilding the timer."

**Why the ref matters (stale closure):** if you memoized `debounce(fn, wait)` directly with `[]`, the debounced fn would forever call the *first* render's `fn`, which closed over the *first* render's state. Memoizing a thin wrapper that reads `fnRef.current`, and refreshing that ref after each render, keeps the stable timer *and* a fresh target.

**Cleanup:** `useEffect(() => debounced.cancel, [debounced])` returns `cancel` as the teardown, so React clears a pending timer on unmount.

## 💻 In code

The pure utility — the closure over `timerId` is the whole mechanism:

```ts
// debounce.ts
export function debounce<T extends (...args: any[]) => any>(fn: T, wait: number) {
  let timerId: ReturnType<typeof setTimeout> | undefined; // persists via closure

  function debounced(this: unknown, ...args: Parameters<T>): void {
    clearTimeout(timerId);        // cancel the previous pending run
    const context = this;         // snapshot `this` now; the arrow fires later
    timerId = setTimeout(() => {
      fn.apply(context, args);    // run with the right `this` + spread the args
    }, wait);
  }
  debounced.cancel = () => { clearTimeout(timerId); timerId = undefined; };
  return debounced;
}
```

The React hook — build once, keep the handler fresh, clean up:

```ts
// useDebouncedCallback.ts
export function useDebouncedCallback<T extends (...args: any[]) => any>(fn: T, wait: number) {
  const fnRef = useRef(fn);
  useEffect(() => { fnRef.current = fn; });                 // latest fn, no stale closure
  const debounced = useMemo(
    () => debounce((...args: Parameters<T>) => fnRef.current(...args), wait),
    [wait]                                                   // same instance across renders
  );
  useEffect(() => debounced.cancel, [debounced]);           // cancel pending run on unmount
  return debounced;
}
```

Using it — update the box every keystroke, debounce the work:

```tsx
const debouncedSearch = useDebouncedCallback(onSearch, 400);
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  setQuery(e.target.value);        // instant UI
  debouncedSearch(e.target.value); // fires 400ms after the last keystroke
};
```

Full source: [debounce.ts](playground/src/problems/debounce-input/debounce.ts), [useDebouncedCallback.ts](playground/src/problems/debounce-input/useDebouncedCallback.ts), [DebouncedSearch.tsx](playground/src/problems/debounce-input/DebouncedSearch.tsx).

### `apply`, in depth (asked directly a lot)

**What it is.** Every function is also an object with three built-in methods for controlling *how* it's invoked: `call`, `apply`, `bind`. `apply` **invokes the function immediately**, letting you set two things: the `this` inside that call (first argument), and the arguments — passed **as an array** (second argument). Signature: `fn.apply(thisArg, argsArray)`.

**Example — the `this` part:**

```ts
const person = { name: "Aniket" };
function greet(g: string, p: string) { return `${g}, ${this.name}${p}`; }
greet.apply(person, ["Hi", "!"]); // "Hi, Aniket!" — `this` forced to person, args from array
```

`greet` reads `this.name` but isn't a method of `person`; `apply` *borrows* it and runs it as if `this` were `person`.

**Example — the array-spreading part (classic):**

```ts
const nums = [3, 9, 4, 1];
Math.max(nums);            // NaN — wants separate numbers, not one array
Math.max.apply(null, nums); // 9 — apply spreads the array into arguments
```

**The whole family:**

- `fn.call(thisArg, a, b)` — args listed **separately**. Mnemonic: **C**all = **C**ommas.
- `fn.apply(thisArg, [a, b])` — args as an **array**. Mnemonic: **A**pply = **A**rray.
- `fn.bind(thisArg, a)` — does **not** call now; returns a **new function** with `this` (and any given args) locked in, to call later.

**Why `apply` in debounce specifically.** In the wrapper the arguments are already a rest array `args`, and we captured the caller's receiver as `context`, and we must invoke `fn` *later* inside `setTimeout` with both intact. `apply` takes exactly that shape — a `this` plus an args array — so it's the natural fit. Equivalent alternatives: `fn.call(context, ...args)` (call + spread) or plain `fn(...args)` (but that **discards `this`**). In React our handler is a closure that doesn't use `this`, so `fn(...args)` would work there — but writing the utility with `apply` keeps it correct for *every* caller, including `el.oninput = debounced` (where `this` is the element) and `obj.method()` (where `this` is the object). That generality is the senior move.

**Why snapshot `context = this` first?** The `setTimeout` callback is an arrow, which has no `this` of its own — it inherits lexically. But by the time it fires we've left the `debounced` call, so we capture `this` into `context` while it's still correct, and the arrow closes over that snapshot.

## 🏗️ Code quality & principles applied

**Decomposition — why these boundaries:**
- `debounce()` owns *timing* — when to run. It has no idea what the work is. **Single Responsibility**, and it's why the same utility debounces search, resize, or autosave.
- `useDebouncedCallback()` owns the *React lifecycle* concerns — persistence, freshness, cleanup — and nothing else. It composes `debounce`.
- `<DebouncedSearch>` owns the *input* and *when to fire*; the parent injects *what firing means* via `onSearch`. So the component is reusable — it doesn't know whether "search" is a fetch or a filter. **Dependency injection / lifting state up.**

**Principles by name (say these):**
- "The timer persists in a **closure** between calls — that's the whole mechanism." (**closure**)
- "In React I **memoize** the debounced fn so its timer isn't rebuilt each render, and keep the handler in a **ref** to avoid a **stale closure**." (**referential stability / stale closure**)
- "I forward `...args` and use **`apply`** to preserve `this`, so it's correct for DOM handlers too." (**this-binding**)
- "The component is **controlled and presentational** for its input; the work is injected — **separation of concerns**."
- "I expose **`cancel()`** and call it in effect cleanup — no timer firing after unmount." (**lifecycle hygiene**)

**The exact sentences that read senior:** *"I'll return a function closing over a timer; each call clears and resets it so it fires once after the pause. In React I memoize that function so the timer survives re-renders, keep the latest handler in a ref to dodge a stale closure, and cancel on unmount. I forward args and `apply` `this` so it also works for DOM handlers."*

**What I deliberately did NOT do (judgment, not dogma):** no lodash for a five-line utility (**KISS/YAGNI**); I kept it **trailing-edge only** and *named* the missing pieces (leading edge, a `flush()`, throttle) rather than silently shipping a half-built "full" version; no inline styles — styling is in the `.css` file per the playground convention.

## 🗣️ Keywords to say

- **Debounce** — run once after events go quiet for `wait` ms (resets the timer each call).
- **Closure over a timer** — the persisted `timerId`; the core mechanism.
- **`clearTimeout` / reset** — each call cancels the previous pending run.
- **Higher-order function** — `debounce` wraps and returns a function.
- **`useMemo` / `useRef`** — keep the debounced instance (and its timer) stable across renders.
- **Stale closure** — the bug from freezing the first render's handler; fixed with a ref.
- **`apply` / `call` / `bind`** — control `this`; apply = array of args, call = commas, bind = returns a bound fn.
- **Cancel / cleanup** — clearing the pending call on unmount via effect teardown.
- **Leading vs trailing edge** — fire at the start of the burst vs the end (this is trailing).
- **Throttle** — the sibling: at most once per interval *during* a burst.

## 🎯 How it's asked in interviews

**The same question in disguise:**
- "Implement debounce." / "Debounce this search input." (very common)
- "Optimize this search-as-you-type / resize / autosave handler." → debounce.
- "Why did your debounce stop working in React?" → recreated each render; memoize it.
- "Difference between debounce and throttle, and when each?" → debounce for final state (search, resize-then-recompute); throttle for steady cadence (scroll, drag).
- "Explain `call` vs `apply` vs `bind`." → the `this`-control family.

**The follow-up ladder (how they go deeper when you answer well):**
1. "Implement debounce." → closure + `clearTimeout` + `setTimeout`.
2. "Forward the arguments and `this`." → `...args` + `fn.apply(this, args)`. *Pivotal — shows you think beyond the happy path.*
3. "Now use it in a React input." → the recreate-each-render trap; fix with `useMemo`/`useRef`.
4. "Your debounced fn calls stale state — why?" → stale closure; keep the handler in a ref.
5. "Clean it up." → `cancel()` in effect teardown.
6. "Add leading edge / a `flush()`." → fire immediately on the first call, then wait; `flush` runs the pending call now.
7. "When throttle instead?" → steady updates during a continuous gesture.

**Traps & gotchas:**
- **Recreating the debounced fn every render** — the #1 React miss; a new timer each keystroke means it never debounces.
- **Stale closure** — memoizing with `[]` freezes the first render's handler/state; use a ref for the latest fn.
- **Forgetting `...args`** — the handler needs the event/value; forward them.
- **Losing `this`** — plain `fn(...args)` drops the receiver; `fn.apply(this, args)` for DOM/methods.
- **No cleanup** — a pending timer fires after unmount and setStates on a dead component.
- **Debouncing the controlled value** — don't debounce `setQuery`; the box must update every keystroke or typing feels laggy. Debounce only the *expensive* work.
- **Mixing up debounce and throttle** — debounce = after the pause (one shot); throttle = during, at a fixed rate.

**Model answer sketch (flagship: "debounce a search input in React"):**
"Debounce delays the work until the user stops typing. I'll write `debounce(fn, wait)` that returns a function closing over a `timerId`; each call clears and resets it, so it fires once `wait` ms after the last call, and I forward `...args` and `apply` `this` so it's reusable. In React the catch is that the component re-renders on every keystroke, so if I create the debounced function inline it's rebuilt each time with a fresh timer and never debounces — I memoize it with `useMemo(..., [wait])` so the same instance and timer persist, and I keep the latest handler in a `useRef` so it doesn't call stale state. The input value updates on every keystroke via `setQuery` for a responsive box; only the search is debounced. Finally I return a `cancel()` and call it in a `useEffect` cleanup so a pending call can't fire after unmount." — then code it, narrating each choice.

## 🔗 Linked concepts

- [useRef & Refs](003-useref-and-refs.md) — the debounced instance and the latest-handler box both lean on `useRef`'s "mutable, persists, doesn't re-render" property.
- [Controlled vs Uncontrolled Components](002-controlled-vs-uncontrolled-components.md) — the input is controlled; the subtlety is debouncing the *work*, not the value.
- [Progress Bar](004-progress-bar.md) — sibling machine-coding problem that also rewards decomposition, timer/effect cleanup, and narrating the craft.
- Plain-JS debounce/throttle pair lives in the JS playground (`playground/JS/debounce-throttle/`) — this note is the React-framed version.

## 🧠 Rapid-fire Q&A

**Q: Debounce in one line?**
A: Run the function once, `wait` ms after the last call — every new call resets the timer.

**Q: What's the core mechanism?**
A: A closure holding a `timerId` that persists between calls; each call clears the old timer and sets a new one.

**Q: Why does debounce "not work" in React?**
A: The component re-renders on every keystroke, so a debounced function created inline is rebuilt each render with a fresh, empty timer — it never accumulates. Memoize it so the same instance and timer persist.

**Q: `useMemo` or `useRef` to keep it stable?**
A: Either. `useMemo(() => debounce(...), [wait])` reads most clearly ("build once"); a `useRef` you initialize once works too. The point is one stable instance.

**Q: What's the stale-closure bug and the fix?**
A: If the debounced fn is memoized once, it keeps calling the first render's handler (and its stale state). Fix: store the latest handler in a ref and have the memoized wrapper call `ref.current(...args)`, refreshing the ref after each render.

**Q: Why `fn.apply(this, args)` instead of `fn(...args)`?**
A: `apply` preserves the caller's `this`, so the utility is correct for DOM handlers (`this` = element) and object methods (`this` = object), not just closures that ignore `this`.

**Q: `call` vs `apply` vs `bind`?**
A: `call` takes args as commas and invokes now; `apply` takes args as an array and invokes now; `bind` returns a new function with `this`/args locked in, to call later.

**Q: How do you clean up?**
A: Return a `cancel()` that clears the timer, and call it from a `useEffect` cleanup so a pending call can't fire after unmount.

**Q: Should you debounce the input value itself?**
A: No — update the controlled value on every keystroke so the box stays responsive; debounce only the expensive work (the search/fetch).

**Q: When would you reach for throttle instead?**
A: When you want steady updates *during* a continuous action — scroll position, drag, or capping an API to N/second — rather than a single fire after it stops.

**Q: Leading vs trailing edge?**
A: Trailing (the default here) fires after the pause; leading fires immediately on the first call, then ignores the rest of the burst. Some cases want both plus a max-wait.

## ✅ Cheat lines

- **Debounce = wait until quiet, then run once; every call resets the timer (a closure variable).**
- **In React, `useMemo`/`useRef` the debounced fn or it's rebuilt each render and never debounces.**
- **Keep the latest handler in a ref to dodge the stale-closure bug — stable timer, fresh target.**
- **`fn.apply(this, args)` forwards `this` + the event; `call` = commas, `apply` = array, `bind` = returns a bound fn.**
- **Debounce the work, not the controlled value; expose `cancel()` and call it in effect cleanup.**
- **Debounce for search/resize (final state); throttle for scroll/drag (steady rate).**
