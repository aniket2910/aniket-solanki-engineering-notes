# Currying

Run the code: `node playground/run.js JS currying` — see [`demo.js`](demo.js).

## ⚡ In one line

Currying transforms a function that takes all its arguments at once — `f(a, b, c)` — into a chain of functions that each take one argument — `f(a)(b)(c)` — so you can supply arguments a few at a time and reuse the partially-filled function.

## 🔍 What the interviewer is really testing

- **Do you understand it's just closures** — each returned function remembers the arguments gathered so far?
- **Can you implement a general `curry()`** that works for any arity and any call grouping? This is the real test, not `add(1)(2)(3)`.
- **Do you know why it's useful** (partial application, reusable specialized functions) vs when it's overkill?
- **Can you tell currying apart from partial application** — related but not identical?

## Why it exists (the problem)

Sometimes you know *some* of a function's arguments early and the rest later, or you want to build a specialized version of a general function (a `log` that always uses level `"error"`, a URL builder with the base fixed). Calling the full function every time forces you to repeat the fixed arguments. Currying lets you **feed arguments in stages** and hand around the partially-applied function, which keeps call sites short and DRY.

## What it is

Currying breaks an N-argument function into N one-argument functions, each returning the next until all arguments are collected, then it computes the result. In practice you rarely hand-nest them — you write a `curry()` helper that wraps any function and returns a version that keeps accepting arguments (in any grouping) until it has enough.

**Mental model:** a **vending machine that needs three coins**. Each coin you insert doesn't give you the drink yet — it returns the machine, now remembering the coins so far. Only when the third coin goes in does it dispense. The machine "remembering coins" is the closure.

**Currying vs partial application:** currying strictly gives you one-argument-at-a-time functions until the count is met. Partial application just fixes *some* arguments and returns a function taking *the rest* in one go (that's what `bind` does — see [call/apply/bind](../call-apply-bind/notes.md)). Currying is one way to achieve partial application, but they're not the same word.

## 🎈 Real-life analogy (how to think about it)

A **coffee order taken in steps**. The barista asks size, then milk, then syrup — one question at a time. After each answer they don't make the drink; they hold a slip remembering your answers so far and ask the next question. Only when the last choice is in do they make it. If two customers want the same size and milk, the barista can reuse a half-filled slip ("medium, oat") and just ask each their syrup — that's the reusable partially-applied function.

## 🔧 How it works (under the hood)

It's closures stacked. Each function in the chain captures the arguments from the levels above it, so by the innermost function, all arguments are in scope.

A general `curry(fn)` works by counting: `fn.length` is how many parameters the function declares. The wrapper gathers arguments; if it has **enough**, it calls the real function; if **not**, it returns a new collector that appends the next batch and checks again.

```text
curriedMultiply(2)     -> have 1, need 3 -> return collector remembering [2]
            (3)        -> have 2, need 3 -> return collector remembering [2,3]
            (4)        -> have 3, need 3 -> call multiply(2,3,4) -> 24
```

Because it checks the *count*, not the grouping, `curriedMultiply(2, 3)(4)` and `curriedMultiply(2)(3)(4)` and `curriedMultiply(2,3,4)` all work — it just keeps collecting until the count is met.

**Note on `fn.length`:** it counts declared parameters *before* the first default/rest parameter. A function using `...args` or defaults reports a misleading length, so a count-based `curry` needs the function to have a fixed, declared arity — worth mentioning as a limitation.

## 💻 In code

All in [`demo.js`](demo.js). By hand, the closure chain is explicit:

```js
function add(a) {
  return (b) => (c) => a + b + c; // each level remembers the ones above
}
add(1)(2)(3);        // 6
const add5and10 = add(5)(10);
add5and10(1);        // 16  (reused the fixed 5 and 10)
```

The general helper — collect until you have `fn.length` arguments:

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args); // enough → run it
    return (...more) => curried(...args, ...more);    // else keep collecting
  };
}
```

## 🏗️ Code quality & principles applied

**Decomposition — separate "collect arguments" from "do the work."** `curry` owns the argument-gathering machinery; the wrapped function owns the actual computation. One helper works for every function.

**Principles by name:**
- **Reuse / DRY** — one `curry` utility instead of hand-nesting each function; specialized functions (`add5`) avoid repeating fixed arguments. Say: *"I curry once and derive the specialized versions, so the fixed args aren't repeated at every call site."*
- **Composition / partial application** — currying is a building block for composing pipelines of small, pre-configured functions.
- **Single Responsibility** — the collector's only job is to accumulate and delegate.

**Say while coding:** *"This is closures — each returned function remembers the args so far. I'll make it general by checking against `fn.length` so it supports any grouping."*

**What you deliberately did NOT do:** you didn't reach for currying everywhere — for a function always called with all arguments, currying is needless indirection (KISS/YAGNI). It earns its place when partial application genuinely removes repetition or configures reusable functions. Say: *"I'd only curry where I actually reuse partially-applied versions."*

## 🗣️ Keywords to say

- **Currying** — converting `f(a, b, c)` into `f(a)(b)(c)`.
- **Partial application** — fixing some arguments now, supplying the rest later (currying is one way to do it).
- **Arity** — the number of arguments a function takes (`fn.length`).
- **Closure** — the mechanism; each stage remembers prior arguments.
- **Point-free / composition** — building behavior by combining small pre-configured functions.

## 🎯 How it's asked in interviews

**The question, disguised:**
- "What is currying? Implement `add(1)(2)(3)`."
- "Write a generic `curry()` that works for any function." — the real ask.
- "Make `curry` support both `sum(1)(2)(3)` and `sum(1, 2)(3)` and `sum(1, 2, 3)`." — the count-based version.
- "Difference between currying and partial application?"
- "Implement `curry` that runs when called with no args" (`sum(1)(2)(3)()` variant) — a known twist using `fn.length` differently.

**Follow-up ladder:** hand-nested `add` → generic `curry` → support any grouping → handle infinite currying / a terminating call → "what breaks with rest params or defaults?" (`fn.length`) → real use case.

**Traps & gotchas:**
- Only doing the nested `add(1)(2)(3)` and not the generic version.
- Forgetting that `curry` needs a known arity — rest/default params make `fn.length` unreliable.
- Confusing currying with partial application in the definition.
- Losing `this` if currying a method — the closures pass args, not the receiver.

**Model answer sketch** ("implement curry"): *"Currying turns a multi-arg function into a chain of single-arg functions, and it's just closures. For a generic version I wrap the function and collect arguments; `fn.length` tells me how many it needs. If I've collected enough, I call it; otherwise I return a function that keeps collecting. Checking the count instead of the shape means it supports any grouping."* Then note the use: *"the payoff is partial application — I can fix the first arguments and reuse the specialized function, which keeps call sites DRY."*

## 🔗 Linked concepts

- **[Closures](../closures/notes.md)** — currying *is* closures; each stage captures prior arguments.
- **[Higher-Order Functions](../higher-order-functions/notes.md)** — `curry` takes a function and returns a function; textbook HOF.
- **[call, apply, bind](../call-apply-bind/notes.md)** — `bind` does partial application directly, the non-curried way.

## 🧠 Rapid-fire Q&A

**Q: What is currying?**
Turning `f(a, b, c)` into `f(a)(b)(c)` — a chain of one-argument functions that collect args via closures.

**Q: What makes it work?**
Closures — each returned function remembers the arguments supplied before it.

**Q: Currying vs partial application?**
Currying gives one-argument-at-a-time functions until the arity is met; partial application just fixes some args and returns a function taking the rest. Currying is a way to do partial application.

**Q: How does a generic `curry` know when to run?**
It compares collected args against `fn.length` (declared arity); when it has enough, it calls the real function.

**Q: What breaks `curry` for some functions?**
Rest params or defaults make `fn.length` misleading, so count-based currying needs a fixed declared arity.

**Q: A real use case?**
Reusable specialized functions — e.g. `curry(request)("GET")` gives a GET-only requester; keeps fixed args out of every call site.

**Q (design): When would you NOT curry?**
When the function is always called with all its arguments — currying just adds indirection then (KISS/YAGNI).

## ✅ Cheat lines

- **Currying: `f(a, b, c)` → `f(a)(b)(c)` — a chain of one-arg functions, built on closures.**
- **Generic `curry`: collect args, compare to `fn.length`; enough → call, else return a collector.**
- **The payoff is partial application — fix early args, reuse the specialized function (DRY).**
- **Currying needs a known arity — rest/default params break `fn.length`.**
