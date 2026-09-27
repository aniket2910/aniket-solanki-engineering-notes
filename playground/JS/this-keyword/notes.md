# The `this` keyword

Run the code: `node playground/run.js JS this-keyword` — see [`demo.js`](demo.js).

## ⚡ In one line

`this` is a reference decided by **how a function is called**, not where it's defined — and there are four call patterns that set it, plus arrow functions which ignore all of them.

## 🔍 What the interviewer is really testing

- **Do you know `this` is dynamic** — resolved at call time by the call site, not fixed when the function is written?
- **Can you recite the four binding rules** and, given a snippet, say what `this` is?
- **Do you understand why arrow functions are different** (lexical `this`) and when that saves you?
- **Have you hit the "lost `this`" bug** (passing a method as a callback) and know the two fixes (`bind` / arrow)?

## Why it exists (the problem)

Methods need a way to refer to "the object I'm operating on" without hard-coding its name — otherwise every method would have to know the variable it's stored in, and you couldn't share one function across many objects. `this` is that dynamic "current object" reference, which is what lets the same `greet` function work for any user object it's attached to. The cost is that `this` depends on the call, so it's easy to lose — which is exactly the interview material.

## What it is

`this` is a hidden parameter every regular function gets, filled in fresh on each call according to **how** the call is made. The four rules, in priority order:

1. **`new` binding** — `new Fn()` makes a new object and `this` is that object.
2. **Explicit binding** — `fn.call(obj)`, `fn.apply(obj)`, or `fn.bind(obj)` set `this` to `obj` by hand.
3. **Implicit binding** — `obj.fn()` sets `this` to `obj` (the thing left of the dot).
4. **Default binding** — a plain `fn()` call: `this` is `undefined` in strict mode / ES modules, or the global object (`globalThis`) in sloppy mode.

**Arrow functions** have **no `this` of their own**. They capture `this` from the scope where they were *written* (lexical), and it can never be changed — `call`/`bind` won't move it.

**Mental model:** for a regular function, look at the **call site** and ask "what's to the left of the dot?" That's usually your answer. For an arrow, look at **where it was written** and use that scope's `this`.

## 🎈 Real-life analogy (how to think about it)

Think of `this` as the word **"here"** spoken over a walkie-talkie.

- What "here" means depends entirely on **who is speaking and from where** — the same word points to a different place each time. That's a regular function: `this` depends on the *call site*.
- Now imagine a **pre-recorded message** that says "here" — it always means the room it was recorded in, no matter where you play it. That's an arrow function: `this` is fixed at *write time* and travels unchanged.

The "left of the dot" rule maps cleanly: whoever is holding the walkie-talkie (`user.greet()` → `user` is holding it) is what "here" refers to.

## 🔧 How it works (under the hood)

The engine sets `this` when the call happens, by matching the call shape:

```text
new Person("Sam")   -> this = the brand-new object
greet.call(user)    -> this = user            (explicit wins over implicit)
user.greet()        -> this = user            (left of the dot)
greet()             -> this = undefined (strict) / globalThis (sloppy)
```

**Why methods "lose" `this`:** the binding is set at the moment of the call, from the call expression. `user.greet()` has the dot, so `this` is `user`. But `const g = user.greet; g()` calls the *same function* with **no dot** — that's default binding, so `this` is `undefined`/global. Passing `user.greet` to `setTimeout` is the same thing: `setTimeout` later calls it as a plain function. The function didn't change; the **call shape** did.

**Arrow functions skip all of this.** They don't get their own `this` slot; a reference to `this` inside an arrow resolves like any other variable — by lexical scope, walking outward to the nearest regular function or module scope. That's why an arrow used as a `.map`/`.forEach` callback inside a method still sees the object: it inherits the method's `this`.

**Priority when rules collide:** `new` and explicit binding beat implicit; `bind` is sticky (a bound function ignores later `call`/re-`bind` for `this`). Arrow's lexical `this` beats everything — you can't reassign it.

## 💻 In code

All in [`demo.js`](demo.js). Implicit binding — `this` is the object left of the dot:

```js
const user = {
  name: "Aniket",
  greet() { return "Hi, I am " + this.name; },
};
user.greet(); // "Hi, I am Aniket"  (this === user)
```

Lost `this` — same function, no dot, so the binding is gone (this is what happens when `setTimeout` or an event listener calls the method plainly later):

```js
const greetPlainly = user.greet;
greetPlainly();              // "Hi, I am undefined"  (this is no longer user)
user.greet.bind(user)();     // "Hi, I am Aniket"     (fixed with bind)
```

Arrow's lexical `this` — the callback inherits the method's `this`, so it keeps working:

```js
const team = {
  name: "Platform",
  members: ["a", "b"],
  listMembers() {
    return this.members.map((m) => this.name + ":" + m); // arrow sees team
  },
};
team.listMembers(); // ["Platform:a", "Platform:b"]
```

## 🏗️ Code quality & principles applied

This is a language-mechanics topic, so the "quality" layer is about **choosing the right tool and not fighting the language**:

- **Use arrow functions for callbacks that need the surrounding `this`** (React handlers, array-method callbacks) — say: *"I'll make this an arrow so it keeps the component's `this` instead of losing it."*
- **Use `bind` when you must hand a method to something that will call it plainly** and can't change how it's called — say: *"`setTimeout` will call this as a plain function, so I bind it to keep the receiver."*
- **Prefer clarity over cleverness** — don't write a regular function and then patch `this` with `const self = this` if an arrow expresses the intent directly (that old `self`/`that` pattern predates arrows; naming it shows you know the history).
- **Least surprise** — keep methods callable as `obj.method()`; don't design APIs that only work if the caller remembers to bind.

**What you deliberately did NOT do:** you didn't sprinkle `.bind(this)` everywhere out of fear — you bind only at the boundary where the call shape changes. Over-binding is noise.

## 🗣️ Keywords to say

- **Call site / call-time binding** — `this` is resolved by how the function is invoked.
- **Implicit binding** — `obj.fn()` → `this` is `obj` (left of the dot).
- **Explicit binding** — `call`/`apply`/`bind` set `this` manually.
- **`new` binding** — constructor call; `this` is the new instance.
- **Default binding** — plain `fn()`; `this` is `undefined` (strict) or global (sloppy).
- **Lexical `this`** — arrow functions inherit `this` from the surrounding scope; can't be rebound.
- **Lost `this`** — passing a method as a bare callback drops its receiver.
- **Sticky bind** — a `bind`-ed function ignores later attempts to change `this`.

## 🎯 How it's asked in interviews

**The question, disguised:**
- "What does `this` refer to here?" — a snippet with a method called two different ways.
- "Why is `this.name` undefined inside my `setTimeout` / event handler?" — the lost-`this` bug.
- "Difference between a regular function and an arrow function?" — the honest answer centers on `this` (arrows also have no `arguments` and can't be constructors).
- "Fix this so the callback keeps the right `this`." — `bind` or arrow.
- "Implement `bind`." — leads into [call/apply/bind](../call-apply-bind/notes.md).

**Follow-up ladder:** name the four rules → apply them to a snippet → explain why a callback loses `this` → fix it two ways → arrow vs regular `this` → priority when rules conflict (`new`/explicit vs implicit) → "can you rebind an arrow?" (no).

**Traps & gotchas:**
- **Arrow as an object method** — `const o = { name: "x", get: () => this.name }` does **not** see `o`; the arrow's `this` is the outer/module scope, so `this.name` is undefined. Arrows are wrong for methods that need the object.
- **`this` in a plain function inside a method** — a normal nested function is called plainly, so `this` is undefined/global, not the outer object. This is the bug arrows fix.
- **Class methods passed as callbacks** lose `this` too — bind in the constructor or use a class field arrow.
- **`this` at the top level** — in a Node CommonJS module it's `module.exports` (`{}`), in a browser script it's `window`, in an ES module it's `undefined`. Know your environment.
- Saying "arrow functions are just shorter functions" — the `this` difference is the point, and it bites.

**Model answer sketch** ("what is `this`?"): *"`this` is set by how a function is called, not where it's defined. Four rules: `new` gives the new object; `call`/`apply`/`bind` set it explicitly; `obj.fn()` makes it the object before the dot; a plain call makes it undefined in strict mode. Arrow functions are the exception — they don't have their own `this`, they capture the surrounding scope's, which is why they're perfect for callbacks inside a method."* Then show the lost-`this` `setTimeout` and fix it, and mention priority: explicit and `new` beat implicit, and you can't rebind an arrow.

## 🔗 Linked concepts

- **[call, apply, bind](../call-apply-bind/notes.md)** — the explicit-binding rule; how you set `this` by hand and implement `bind`.
- **[Closures](../closures/notes.md)** — the old `const self = this` fix is a closure; arrows made it unnecessary.
- **Higher-Order Functions / Event delegation** *(HOF written; delegation planned)* — callbacks are where `this` is most often lost.

## 🧠 Rapid-fire Q&A

**Q: What decides `this`?**
The call site — how the function is invoked — not where it's written (except arrows, which are lexical).

**Q: The four rules?**
`new` binding, explicit (`call`/`apply`/`bind`), implicit (`obj.fn()`), default (plain call → undefined/global).

**Q: Why is `this` undefined when I pass a method to `setTimeout`?**
`setTimeout` calls it as a plain function — no dot, so default binding, not the object. Fix with `bind` or an arrow wrapper.

**Q: What's `this` inside an arrow function?**
Whatever `this` was in the enclosing scope where the arrow was written. It has none of its own and can't be rebound.

**Q: Can you use an arrow as an object method that reads `this.someProp`?**
Not if it needs the object — the arrow's `this` is the outer scope, not the object. Use a regular method.

**Q: Which wins, implicit or explicit binding?**
Explicit (`call`/`bind`) and `new` win over implicit. A bound function is sticky and ignores later rebinding.

**Q (design): When do you reach for `bind` vs an arrow?**
Arrow for callbacks that should keep the surrounding `this`; `bind` when you must hand a method to code that will call it plainly and you can't control how it's called.

## ✅ Cheat lines

- **`this` is set by HOW you call, not where you wrote it.**
- **Four rules: `new` > explicit (`call`/`apply`/`bind`) > implicit (left of the dot) > default (undefined/global).**
- **Arrow functions have no `this` — they borrow the surrounding scope's, and you can't change it.**
- **Passing a method as a bare callback loses `this`; fix with `bind` or an arrow.**
- **"Left of the dot" answers most `this` questions on the spot.**
