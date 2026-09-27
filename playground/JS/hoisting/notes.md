# Hoisting

Run the code: `node playground/run.js JS hoisting` — see [`demo.js`](demo.js).

## ⚡ In one line

Hoisting is JavaScript registering all declarations at the top of their scope before running any code — so `var` and function declarations are usable "early," while `let`/`const`/`class` exist but throw if touched before their line (the Temporal Dead Zone).

## 🔍 What the interviewer is really testing

- **Do you know it's about *declarations*, not code moving?** Nothing physically moves; declarations are just registered first.
- **Can you predict output** of a snippet mixing `var`, `let`, and function declarations?
- **Do you understand the TDZ** — that `let`/`const` *are* hoisted but unusable until declared?
- **Do you know the difference** between a function declaration (fully hoisted) and a function expression / arrow (not)?

## Why it exists (the problem)

JS runs in two passes: a quick **compile/creation pass** that scans the scope and sets up its variables and functions, then an **execution pass** that runs the code line by line. The creation pass is why a function declaration can call itself before its line, and why `var` reads as `undefined` instead of erroring. The behavior you have to reason about isn't a feature you'd design — it's the observable result of that two-pass model, which is exactly why interviewers use it to check you understand how the engine sets up scope.

## What it is

Before any line runs, the engine walks the current scope and registers every declaration. **How** each is registered differs:

- **`var`** — registered and initialized to `undefined`. Reading it before its assignment gives `undefined` (no error).
- **Function declaration** (`function foo() {}`) — registered **with its full body**, so it's callable before its line.
- **`let` / `const` / `class`** — registered but left **uninitialized**. Any access before the declaration line throws `ReferenceError`. The span from scope-start to the declaration is the **Temporal Dead Zone (TDZ)**.
- **Function expression / arrow** (`var f = () => {}`) — only the *variable* is hoisted (as `var` → `undefined`, or `let`/`const` → TDZ). The function value is assigned at runtime, so calling it early fails.

**Mental model:** think of the engine reading the whole scope first and writing every name on a whiteboard. `var` names get a value of `undefined`; function-declaration names get their whole function; `let`/`const` names get written but marked "don't touch yet."

## 🎈 Real-life analogy (how to think about it)

A **theater with a cast list posted before the show**. During setup (the compile pass), every character's name goes on the board:

- **`var` roles** are listed with a placeholder understudy (`undefined`) — the slot exists even before the real actor shows up.
- **Function declarations** are fully cast and ready — you can "call" them from the first scene.
- **`let`/`const` roles** are on the list but roped off — if you try to bring them on stage before their entrance cue (the declaration line), security stops you (TDZ / ReferenceError).

## 🔧 How it works (under the hood)

Two passes over each scope:

```text
Creation pass (before running):
  var x            -> x = undefined
  function f(){..} -> f = <the function>
  let y, const z   -> reserved but UNINITIALIZED (TDZ starts)

Execution pass (line by line):
  reading x before its line  -> undefined
  calling f() before its line-> works (full body already there)
  reading y before its line  -> ReferenceError (still in TDZ)
  `let y = 5` runs           -> y initialized, TDZ ends
```

**Why function expressions differ:** `var sayHi = function(){}` is a `var` declaration plus an assignment. Only `var sayHi` is hoisted (as `undefined`); the assignment happens when execution reaches that line. Call it earlier and you're calling `undefined` → `TypeError: sayHi is not a function`. Note the error *type*: an early `var`-function-expression call is a **TypeError** (it's `undefined`), while an early `let` access is a **ReferenceError** (TDZ) — interviewers probe that distinction.

**Scope:** `var` is hoisted to the top of its **function** (or global) scope; `let`/`const` are hoisted to the top of their **block**. This ties directly to the [closures](../closures/notes.md) `var`-loop bug.

## 💻 In code

All in [`demo.js`](demo.js). `var` reads as `undefined`, not an error:

```js
console.log(myVar); // undefined
var myVar = 10;
```

Function declarations work before their line:

```js
greet("Aniket"); // "Hi Aniket"
function greet(name) { return "Hi " + name; }
```

`let` throws if touched early (TDZ); a function expression is `undefined` early:

```js
console.log(myLet); // ReferenceError (TDZ)
let myLet = 5;

sayHi();            // TypeError: sayHi is not a function
var sayHi = function () { return "hi"; };
```

## 🏗️ Code quality & principles applied

This is a mechanics topic, so "quality" is about writing code that **doesn't depend on hoisting quirks**:

- **Declare before use; prefer `const`/`let` over `var`.** `let`/`const`'s TDZ turns "used before defined" bugs into loud errors instead of silent `undefined`. Say: *"I use `const`/`let` so accidental early use throws instead of silently being `undefined`."*
- **Block scope over function scope** — `let`/`const` scope to the block, which is what you almost always want (and fixes the loop-closure bug).
- **Don't rely on calling functions above their definition** just because declarations allow it — top-to-bottom readability beats a party trick.

**Say in the room:** *"Hoisting is why this reads `undefined` rather than throwing — the `var` is registered in the creation pass but assigned later. With `const` it'd be a TDZ ReferenceError, which is safer because it surfaces the bug."*

**What you deliberately did NOT do:** you don't write code that *leans* on hoisting (calling before defining, relying on `var` placeholders) — knowing the mechanism is for *reading* legacy code and answering questions, not a style to adopt (KISS/readability).

## 🗣️ Keywords to say

- **Hoisting** — declarations registered at the top of their scope during the creation pass.
- **Creation pass vs execution pass** — the two-phase model that produces hoisting.
- **Temporal Dead Zone (TDZ)** — the span where a `let`/`const` exists but can't be accessed yet.
- **Function declaration vs function expression** — fully hoisted vs only the variable hoisted.
- **Function scope vs block scope** — `var` (function) vs `let`/`const` (block).
- **ReferenceError vs TypeError** — TDZ access vs calling an `undefined` variable.

## 🎯 How it's asked in interviews

**The question, disguised:**
- "What's hoisting?" / "What will this print?" — a snippet mixing `var`, `let`, functions.
- "Difference between `var`, `let`, and `const`?" — hoisting/TDZ is half the answer (scope + redeclare/reassign is the other half).
- "Can you call a function before you define it?" — yes for declarations, no for expressions/arrows.
- "What is the Temporal Dead Zone?"
- "Why does this log `undefined` instead of throwing?" — `var` hoisting.

**Follow-up ladder:** define hoisting → predict a `var` snippet → declaration vs expression → `let`/`const` TDZ → ReferenceError vs TypeError → tie to the `var`-loop closure bug → "how do you avoid these bugs?" (`const`/`let`, declare-before-use).

**Traps & gotchas:**
- Saying "code moves to the top" — nothing moves; **declarations are registered first**, assignments stay put.
- Thinking `let`/`const` aren't hoisted — they are, but into the TDZ (uninitialized).
- Mixing up the errors — early `let` = ReferenceError; early function-expression call = TypeError.
- Function declaration vs expression — only the declaration is callable early.
- In non-strict code, assigning to an undeclared variable creates a global — unrelated to hoisting but often conflated.

**Model answer sketch** ("what's hoisting + predict output"): *"JS runs a creation pass that registers declarations before executing. `var` is registered as `undefined`, so reading it early gives `undefined`, not an error. Function declarations are registered with their body, so they're callable before their line. `let` and `const` are also hoisted but stay uninitialized in the Temporal Dead Zone, so touching them early throws a ReferenceError. And a function expression only hoists its variable — calling it early is calling `undefined`, a TypeError."* Then add the takeaway: *"I prefer `const`/`let` so these become loud errors instead of silent `undefined`."*

## 🔗 Linked concepts

- **[Closures](../closures/notes.md)** — the `var`-vs-`let` loop bug is function-scope vs block-scope, closely tied to hoisting.
- **[`this` keyword](../this-keyword/notes.md)** — top-level `this` and function-scoping round out "how JS sets up a scope."

## 🧠 Rapid-fire Q&A

**Q: One-line definition of hoisting?**
Declarations are registered at the top of their scope before code runs; assignments stay where written.

**Q: Why does `console.log(x); var x = 5` print `undefined`?**
`var x` is hoisted and initialized to `undefined`; the assignment runs later.

**Q: Are `let` and `const` hoisted?**
Yes, but into the Temporal Dead Zone — accessing them before their declaration throws a ReferenceError.

**Q: Can you call a function before it's defined?**
A function *declaration*, yes (fully hoisted). A function *expression* or arrow, no — only its variable is hoisted.

**Q: ReferenceError vs TypeError here?**
Early `let`/`const` access → ReferenceError (TDZ). Early function-expression call → TypeError (calling `undefined`).

**Q: `var` vs `let` scope?**
`var` is function-scoped; `let`/`const` are block-scoped.

**Q (design): How do you avoid hoisting bugs?**
Use `const`/`let` and declare before use, so early access throws loudly instead of silently being `undefined`.

## ✅ Cheat lines

- **Hoisting registers declarations first; nothing physically moves.**
- **`var` → hoisted as `undefined`; function declaration → fully hoisted; `let`/`const`/`class` → hoisted but in the TDZ.**
- **Early `let` access = ReferenceError; early function-expression call = TypeError.**
- **Declaration is callable early; expression/arrow is not.**
- **Use `const`/`let` so "used before defined" is a loud error, not silent `undefined`.**
