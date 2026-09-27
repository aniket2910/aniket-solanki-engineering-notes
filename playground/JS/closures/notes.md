# Closures

Run the code: `node playground/run.js JS closures` — see [`demo.js`](demo.js).

## ⚡ In one line

A closure is a function that **remembers the variables from the scope where it was created**, and keeps them alive even after that outer function has finished running.

## 🔍 What the interviewer is really testing

- **Do you understand lexical scope** — that where a function is *written* decides what it can see, not where it's called?
- **Do you know closures keep variables alive** past their outer function's return, and can you spot when that's a memory leak?
- **Can you explain the `var`-in-a-loop bug** from first principles? It's the single most-asked closure question.
- **Do you see closures as a tool**, not a curiosity — privacy, currying, debounce, event handlers, `once` all rely on them.

## Why it exists (the problem)

JavaScript has no built-in "private variable." Without closures there'd be no clean way to hide state — everything would be a public property anyone can overwrite, or a global. Closures give you **private, persistent state tied to a function**: a counter that can't be reset from outside, a bank balance nobody can poke directly, a config captured once and reused. Almost every practical pattern that needs "remember something between calls without a global" is a closure underneath.

## What it is

Three facts define it:

1. A function can be **defined inside another function**.
2. The inner function can **use the outer function's variables**.
3. If the inner function outlives the outer (you return it, or pass it as a callback), those variables **don't get cleaned up** — the inner function holds onto them.

That bundle — the function plus the variables it captured — is the closure. Every function in JS is technically a closure over its surrounding scope; the term matters when the inner function escapes and keeps that scope alive.

**Mental model:** the function carries a **backpack**. When it's created, it packs the variables it references from around it. Wherever it travels — returned, stored, called later — it still has that backpack with those exact variables inside.

## 🎈 Real-life analogy (how to think about it)

Think of a **food truck that keeps its own cash register**.

- `makeCounter()` is the factory that builds a truck. Each truck rolls out with its **own** register (`count`), locked inside.
- The `counter()` function you get back is the serving window — the only way to interact with that register.
- Every truck the factory builds has a **separate** register: ringing up a sale on one truck never changes another's total. That's why two counters from the same factory don't share state.
- Nobody walking past can reach in and change the register directly — they can only go through the window. That's data privacy.

## 🔧 How it works (under the hood)

**Lexical scope** is the key phrase. "Lexical" means "as written in the source." When JS creates a function, it attaches a hidden reference to the environment (the set of variables) where that function was *defined*. Looking up a variable walks **outward through those defining scopes**, not through whoever called the function.

Step trace for the counter:

```text
makeCounter() runs   -> creates a scope with count = 0
returns inner fn     -> inner fn keeps a reference to that scope
makeCounter() ends   -> normally its scope would be garbage-collected...
                        ...but inner fn still references count, so it stays alive
counter()            -> reads/updates the SAME count in that preserved scope
```

**Why the `var` loop prints `3, 3, 3`:** `var` is function-scoped, so the whole loop shares **one** `i`. All three `setTimeout` callbacks close over that same single `i`. The callbacks run later (after the synchronous loop finishes), and by then `i` is `3`. `let` is block-scoped — each iteration creates a **fresh** binding, so each callback captures its own value (`0, 1, 2`). This one example ties closures to scope *and* the event loop, which is why it's a favorite.

**Memory angle:** because captured variables stay alive, a closure that captures something large (a big array, a DOM node) keeps it in memory as long as the closure is reachable. That's a legitimate, senior thing to mention — closures can cause leaks if a long-lived callback holds onto something big.

## 💻 In code

All in [`demo.js`](demo.js). The counter shows persistence — `count` outlives `makeCounter()`:

```js
function makeCounter() {
  let count = 0;
  return function () {
    count = count + 1;
    return count;
  };
}
const counter = makeCounter();
counter(); // 1
counter(); // 2
```

Privacy — `balance` is reachable only through the returned methods, never as a property:

```js
function createAccount(startingBalance) {
  let balance = startingBalance; // private
  return {
    deposit(amount) { balance += amount; return balance; },
    getBalance() { return balance; },
  };
}
const account = createAccount(100);
account.deposit(50);   // 150
account.balance;       // undefined — genuinely hidden
```

## 🏗️ Code quality & principles applied

**Decomposition — a factory function per independent piece of state.** `makeCounter` / `createAccount` each hand back a small surface (a function, or a few methods) and hide the rest. The boundary is "public API vs private state."

**Principles by name:**
- **Encapsulation / data hiding** — the closure is JS's classic way to make state private. Say: *"I keep `balance` in the closure, not on the object, so it can only change through `deposit` — that's encapsulation."*
- **Single source of truth** — one `count` variable owns the value; there's no second copy to drift.
- **Separation of concerns** — the factory owns *how* state changes; callers only see *what* they're allowed to do.

**Say while coding:** *"I'll return functions that close over this variable so it's private — no one can reach in and mutate it,"* and, on the loop bug, *"I'll use `let` so each iteration gets its own binding; with `var` all the callbacks would share one variable."*

**What you deliberately did NOT do:** you didn't expose `balance` as a public property "for convenience" (it invites bugs), and you didn't reach for a `class` with `#private` fields when a closure is simpler here — though it's worth naming that `#private` fields are the modern alternative (KISS: pick whichever is clearer for the case).

## 🗣️ Keywords to say

- **Lexical scope** — scope determined by where code is written, resolved by walking outward through defining scopes.
- **Closure** — a function plus the captured variables it keeps alive.
- **Encapsulation / data privacy** — hiding state so it's only reachable through a controlled interface.
- **Block scope vs function scope** — `let`/`const` are block-scoped; `var` is function-scoped (root of the loop bug).
- **Captured / free variable** — a variable used by a function but declared in an outer scope.
- **Garbage collection** — captured variables aren't collected while the closure is reachable (possible leak).

## 🎯 How it's asked in interviews

**The question, disguised:**
- "What is a closure? Give a real use." (Say: private state / counter / once / debounce.)
- "What does this print?" — the `var` loop with `setTimeout`. Fix it two ways (`let`, or an IIFE capturing `i`).
- "Implement a function that can only be called once" (`once`) — closure over a `called` flag.
- "Make a private counter / a memoize function / a rate limiter" — all closures.
- Currying and debounce/throttle questions are closure questions in disguise.

**Follow-up ladder:** define it → give a use → the loop bug → fix it with `let` and explain why → fix it with an IIFE → "any downside?" (memory) → build `once`/`memoize` live.

**Traps & gotchas:**
- Answering the loop bug with "hoisting" — it's about `var` being **one shared function-scoped variable**, plus the callbacks running after the loop, not hoisting.
- Thinking each call to the outer function shares state — each call makes a **new** closure with its own variables (the two counters are independent).
- Forgetting the memory point when asked for a downside.
- Saying closures "copy" the variables — they capture the **variable itself** (a live reference), not a snapshot. That's exactly why the `var` loop sees the final `3`.

**Model answer sketch** ("what's a closure + show one"): *"A closure is a function that remembers the variables from where it was defined, even after that outer function returns — because JS uses lexical scope, the function keeps a live reference to that environment."* Then show the counter for persistence and the account for privacy, and name it: *"this is how you get private state in JS without a class."* If they hit you with the loop puzzle, explain the shared `var` and fix with `let`, noting each iteration gets a fresh binding.

## 🔗 Linked concepts

- **[Higher-Order Functions](../higher-order-functions/notes.md)** — returning a function (a HOF) is what produces most closures.
- **[call, apply, bind](../call-apply-bind/notes.md)** — `bind` returns a new function closed over the bound `this`/args; a closure underneath.
- **Currying / Debounce-Throttle** *(planned)* — both are closures over captured arguments / a timer.
- **Event loop** *(planned)* — the loop-bug's "callbacks run later" is an event-loop fact.

## 🧠 Rapid-fire Q&A

**Q: One-sentence definition of a closure?**
A function bundled with the variables from its defining scope, which it keeps alive after that scope returns.

**Q: Real use case?**
Private state — a counter, a bank balance, a `once` guard, a debounced handler, memoization.

**Q: Why does the `var` loop with `setTimeout` print `3, 3, 3`?**
`var` is one function-scoped variable shared by all iterations; the callbacks run after the loop finishes, when `i` is already 3. `let` gives each iteration its own binding → `0, 1, 2`.

**Q: Do closures copy variables or reference them?**
Reference the live variable, not a snapshot — that's why the loop sees the final value.

**Q: Do two calls to the same factory share state?**
No. Each call creates a new scope, so each returned closure has its own private variables.

**Q: Any downside to closures?**
They keep captured variables in memory as long as the closure is reachable — capturing something large in a long-lived callback can leak memory.

**Q (design): Why put `balance` in the closure instead of on the returned object?**
Encapsulation — a property is public and mutable by anyone; a closed-over variable can only change through the methods you expose, so invariants hold.

## ✅ Cheat lines

- **A closure is a function that remembers the variables it was born with.**
- **Lexical scope = "what a function can see is decided by where it's written, not where it's called."**
- **`var` loop bug = one shared function-scoped variable + callbacks that run later; fix with `let` (fresh binding per iteration).**
- **Closures are how JS does private state — the value can only change through the functions you return.**
- **Captured variables are live references, and they stay in memory while the closure lives (possible leak).**
