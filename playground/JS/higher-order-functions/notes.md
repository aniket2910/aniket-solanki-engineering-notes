# Higher-Order Functions

Run the code: `node playground/run.js JS higher-order-functions` — see [`demo.js`](demo.js).

## ⚡ In one line

A higher-order function is a function that **takes another function as an argument, returns a function, or both** — possible because in JavaScript functions are just values you can pass around.

## 🔍 What the interviewer is really testing

- **Do you get "functions are first-class values"** — that a function can be stored, passed, and returned like any other value?
- **Can you name everyday HOFs** (`map`, `filter`, `reduce`, `setTimeout`, event listeners, Express middleware) rather than treating HOF as abstract?
- **Can you write one that returns a function** (which is where closures show up)?
- **Do you see why it matters** — abstraction and DRY: separating *what* varies (the passed-in function) from *what* stays the same (the loop/wrapper around it)?

## Why it exists (the problem)

Lots of code has the same skeleton with one differing step — loop over an array and *do something*, run a task *N times*, wrap a function with logging/timing/auth. Without HOFs you'd copy the skeleton and change the middle each time, or write a giant function full of flags. HOFs let you **pass the varying step in as a function**, so the skeleton is written once and reused with any behavior. That's the core of `map`/`filter`/`reduce`, of middleware, and of decorators.

## What it is

A function is **higher-order** if it does at least one of:

1. **Takes a function** as an argument (a callback) — like `arr.map(fn)` or `repeat(3, task)`.
2. **Returns a function** — like `makeMultiplier(3)` handing back a `triple` function.

This is only possible because functions in JS are **first-class**: they're values, so they can live in variables, arrays, and object properties, be passed as arguments, and be returned. A HOF isn't a special syntax — it's just a function that leans on that fact.

**Mental model:** a HOF is a **machine with a slot for a smaller machine**. `map` is a conveyor belt; you drop in the "what to do to each item" machine, and the belt runs it over every item. The belt (iteration) is fixed; the operation is pluggable.

## 🎈 Real-life analogy (how to think about it)

Think of a **kitchen stand mixer with swappable attachments**.

- The **mixer motor** is the higher-order function — it provides the power and the spinning (the fixed part: the loop, the wrapping, the repetition).
- The **attachment** (whisk, dough hook, grinder) is the function you pass in — the part that decides *what actually happens*.
- One motor, many jobs: snap in a whisk to whip, a hook to knead. That's `map` vs `filter` vs `forEach` — same iteration engine, different attachment.
- A HOF that *returns* a function is like a **machine that stamps out custom attachments**: `makeMultiplier(3)` produces a "times-three" attachment you can use later.

## 🔧 How it works (under the hood)

There's no magic — it's first-class functions plus, when returning a function, a closure.

**Taking a function:** the HOF just holds the passed function in a parameter and calls it. `map` roughly is:

```text
map(array, fn):
  make an empty result
  for each item in array:
    push fn(item) into result   <- your function decides the transform
  return result
```

The value is separation: `map` owns the *iteration*; your callback owns the *transform*. Neither knows the other's details.

**Returning a function:** the returned function usually **closes over** the HOF's arguments. `makeMultiplier(3)` returns a function that remembers `factor = 3`. So "HOF that returns a function" almost always means "closure" — the two topics are joined at the hip (see [Closures](../closures/notes.md)).

**Wrapping (decorator pattern):** `withLogging(fn)` takes a function and returns a **new** function with the same signature that adds behavior (logging) around a call to the original. The original is untouched; you've composed new behavior on top. This is how timing wrappers, retry wrappers, memoization, and auth guards are built.

## 💻 In code

All in [`demo.js`](demo.js). Passing a function in — the HOF supplies the loop, you supply the action:

```js
function repeat(times, task) {
  for (let i = 0; i < times; i++) task(i);
}
repeat(3, (i) => console.log("run #" + i)); // run #0, run #1, run #2
```

Returning a function — a factory for specialized functions (closure over `factor`):

```js
function makeMultiplier(factor) {
  return (n) => n * factor;
}
const triple = makeMultiplier(3);
triple(10); // 30
```

Wrapping behavior — a decorator that logs around any function without changing it:

```js
function withLogging(fn) {
  return function (...args) {
    console.log("calling with:", args);
    const result = fn(...args);
    console.log("returned:", result);
    return result;
  };
}
const loggedAdd = withLogging((a, b) => a + b);
loggedAdd(2, 3); // logs both lines, returns 5
```

## 🏗️ Code quality & principles applied

**Decomposition — split the fixed skeleton from the varying step.** `repeat` owns "how many times"; the task owns "what to do." `withLogging` owns "log around a call"; `fn` owns the actual work. Each piece has one job.

**Principles by name:**
- **DRY** — write the loop/wrapper once, reuse it with any callback. Say: *"I extract the iteration into a HOF so I'm not rewriting the loop for every transform — DRY."*
- **Single Responsibility** — the HOF handles control flow; the callback handles the domain logic.
- **Open/Closed** — you extend behavior by passing a new function, not by editing the HOF. Say: *"New behavior plugs in as a callback — the HOF stays closed for modification."*
- **Composition over inheritance** — `withLogging(withTiming(fn))` layers behavior by composing functions, no class hierarchy.

**Say while coding:** *"I'll make this a higher-order function so the caller injects the behavior — the loop stays in one place,"* and, for the wrapper, *"I return a new function so the original is untouched; that's a decorator, and it composes."*

**What you deliberately did NOT do:** you didn't add a pile of boolean flags to one mega-function to cover every variation — passing a function is cleaner than `doThing(true, false, true)` (that flag-soup is a KISS/readability smell). And you don't wrap trivially small logic in a HOF just to look clever (YAGNI).

## 🗣️ Keywords to say

- **First-class functions** — functions are values: storable, passable, returnable.
- **Higher-order function** — takes and/or returns a function.
- **Callback** — the function you pass into a HOF.
- **Decorator / wrapper** — a HOF that returns an enhanced version of the function it received.
- **Function factory** — a HOF that returns a customized function (usually via closure).
- **Pure function** — no side effects, same input → same output; the ideal callback for `map`/`filter`/`reduce`.
- **Abstraction / DRY / Open-Closed** — the design payoff of pulling the varying step into a callback.

## 🎯 How it's asked in interviews

**The question, disguised:**
- "What's a higher-order function? Give examples." — name `map`/`filter`/`reduce`, `setTimeout`, `addEventListener`, middleware.
- "Implement `map`/`filter`/`reduce` yourself." — see the [polyfills topic](../README.md) *(planned)*.
- "Write a function that logs/times/memoizes any function you give it." — the decorator ask.
- "What does it mean that functions are first-class in JS?"
- Currying and debounce/throttle are HOF questions (they return functions).

**Follow-up ladder:** define HOF → name built-ins → implement `map` → write a decorator (`withLogging`) → chain two decorators (composition) → "what's the closure doing in `makeMultiplier`?" → build `memoize`.

**Traps & gotchas:**
- **Passing `fn()` instead of `fn`** — `setTimeout(doThing(), 100)` *calls* `doThing` immediately and passes its return value. You want `setTimeout(doThing, 100)` (pass the reference) or `setTimeout(() => doThing(), 100)`.
- **Losing `this`** when passing a method as a callback — see [`this`](../this-keyword/notes.md); fix with `bind` or an arrow.
- **Mutating in `map`** — `map` is for transforming into a new array; if you're only causing side effects, use `forEach`, and never mutate the source inside these callbacks.
- Confusing "higher-order function" with "callback" — the callback is the *argument*; the HOF is the *function receiving/returning* one.

**Model answer sketch** ("what is a HOF + show one"): *"A higher-order function takes a function as an argument or returns one — it works because functions are first-class values in JS. `map`, `filter`, `reduce`, `setTimeout`, and Express middleware are all HOFs."* Show `map` conceptually (it owns iteration, my callback owns the transform), then a returning-a-function example and name the closure. Close on the why: *"the point is abstraction — I write the loop/wrapper once and inject the varying behavior, which keeps it DRY and open for extension."*

## 🔗 Linked concepts

- **[Closures](../closures/notes.md)** — a HOF that returns a function almost always returns a closure.
- **[call, apply, bind](../call-apply-bind/notes.md)** — `bind` is a HOF (returns a function); passing methods as callbacks raises `this` issues.
- **Currying / Debounce-Throttle / Polyfills** *(planned)* — all are HOFs; they return functions built on closures.

## 🧠 Rapid-fire Q&A

**Q: Define a higher-order function.**
A function that takes another function as an argument and/or returns a function.

**Q: Why is this possible in JS?**
Functions are first-class values — they can be stored, passed, and returned like any value.

**Q: Name three built-in HOFs.**
`map`, `filter`, `reduce` (also `forEach`, `setTimeout`, `addEventListener`).

**Q: What's the difference between a HOF and a callback?**
The callback is the function passed *in*; the HOF is the function that *takes or returns* one.

**Q: What does a HOF that returns a function usually rely on?**
A closure — the returned function remembers the HOF's arguments.

**Q: Why is `setTimeout(doThing(), 100)` usually wrong?**
It calls `doThing` immediately and passes its return value; you want to pass the function itself: `setTimeout(doThing, 100)`.

**Q: `map` vs `forEach`?**
`map` returns a new transformed array; `forEach` returns nothing and is for side effects.

**Q (design): Why wrap a function with a decorator instead of editing it?**
To add behavior (logging, timing, retry) without touching the original — it stays single-responsibility and the wrappers compose (open/closed).

## ✅ Cheat lines

- **A HOF takes a function, returns a function, or both — because functions are first-class values.**
- **`map`/`filter`/`reduce`/`setTimeout`/middleware are the HOFs you already use.**
- **"Returns a function" ≈ "closure" — the two go together.**
- **HOFs separate the fixed skeleton (loop/wrapper) from the varying step (your callback) — that's DRY + open/closed.**
- **Pass `fn`, not `fn()` — the second one calls it now.**
