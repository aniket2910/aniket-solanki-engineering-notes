# The `new` keyword & constructor functions

Run the code: `node playground/run.js JS new-keyword` — see [`demo.js`](demo.js).

## ⚡ In one line

`new Fn()` doesn't just call `Fn` — it runs a **four-step ritual** (create a fresh object, link it to `Fn.prototype`, bind `this` to it, return it) so the function acts as a **constructor** that builds instances.

## 🔍 What the interviewer is really testing

- **Do you know `new` is more than a call** — that it *creates and returns an object*, and `this` inside points to that new object?
- **Can you recite the four steps** `new` performs, in order?
- **Do you understand the prototype link** — that `new` is what wires an instance to `Fn.prototype`, so methods are shared, not copied?
- **Do you know the return-value gotcha** — an explicit object return hijacks `new`, a primitive return is ignored?
- **Can you explain why `class` throws without `new`** and how you'd replicate that guard (`new.target`)?

## Why it exists (the problem)

You often need many objects that share the same shape and behavior — a hundred `user`s, each with a `name` and a `greet()`. Writing each object literal by hand repeats the structure (a DRY violation) and copies every method onto every object (wasteful). A constructor function plus `new` gives you a **factory**: one blueprint that stamps out instances, with shared methods living once on the prototype. `new` is the operator that performs that stamping and does the bookkeeping (`this`, the prototype link, the return) for you.

## What it is

`new` is an operator you put in front of a function call. When you write `new Fn(args)`, the engine does **four things**:

1. **Creates** a brand-new empty object `{}`.
2. **Links** that object's internal prototype (`[[Prototype]]`) to `Fn.prototype`.
3. **Binds** `this` to the new object while `Fn`'s body runs.
4. **Returns** the new object automatically — *unless* `Fn` explicitly returns its own object, in which case that object is returned instead.

A **constructor function** is just a normal function *intended* to be called with `new`. Convention: name it `PascalCase` (`Person`, not `person`) so readers know to use `new`. Inside it, `this` is the instance being built, and you attach per-instance data (`this.name = name`).

**Mental model:** a plain call `Fn()` *runs* the function. `new Fn()` *builds an object using* the function. The function body is the same; `new` is the scaffolding around it.

## 🎈 Real-life analogy (how to think about it)

Think of the constructor function as a **cookie cutter** and `new` as the act of **pressing it into dough**.

- The cutter (the function) is just a shape — on its own it doesn't produce a cookie.
- Pressing it (`new`) is what actually **creates a new cookie** (step 1), stamps the **shared pattern** onto it — the same edges every cookie inherits, which is `Fn.prototype` (step 2), lets you **fill in this specific cookie's details** while it's being cut, which is `this` (step 3), and **hands you the finished cookie** (step 4).
- Calling the function *without* `new` is like waving the cutter in the air with no dough: no cookie comes out (`undefined`), and you might smear icing on your hand instead (writing to the global object). That's the lost-`this` bug.

## 🔧 How it works (under the hood)

`new Person("Sam")` is roughly this, made explicit:

```text
1. const obj = {}                                  // fresh object
2. Object.setPrototypeOf(obj, Person.prototype)    // link the prototype
3. const result = Person.call(obj, "Sam")          // run body with this = obj
4. return (typeof result === "object" && result !== null)
        ? result                                    // explicit object wins
        : obj                                        // otherwise the new object
```

**Why step 2 matters (the prototype link).** Methods you put on `Person.prototype` are *not copied* onto each instance — every instance holds a reference to the one shared `Person.prototype` object. `p.greet()` isn't found on `p` directly; the engine walks up the **prototype chain** (`p` → `Person.prototype`) and finds it there. This is why `p instanceof Person` is true: `instanceof` checks whether `Person.prototype` sits anywhere on `p`'s chain.

**Why step 4 has the gotcha.** The auto-return only kicks in for the *implicit* case. If the constructor explicitly `return`s an **object**, `new` respects it and gives you that object — your freshly-built `this` is discarded. A **primitive** return (`return 42`, `return "x"`) is silently ignored and you still get the new object. This asymmetry trips people up.

**What goes wrong without `new`.** No object is created, so `this` is whatever a plain call would give: `undefined` in strict mode / ES modules (so `this.name = ...` throws a `TypeError`), or the global object in sloppy mode (so you silently create globals — a nasty, quiet bug). Either way the call returns `undefined`, not an instance.

**`new.target`.** Inside any function, `new.target` is the function itself when invoked with `new`, and `undefined` otherwise. It's the clean way to *detect* how you were called — and it's exactly the mechanism the language uses to make `class` throw when you forget `new`.

## 💻 In code

All runnable in [`demo.js`](demo.js). Same function, two call shapes — completely different results:

```js
function Person(name) {
  this.name = name; // with `new`, this === the fresh object
}

new Person("Aniket"); // Person { name: "Aniket" }   -> an instance
Person("Aniket");      // undefined                    -> no object, this misused
```

Step 2 in action — one shared method on the prototype, not copied per instance:

```js
Person.prototype.greet = function () {
  return "Hi, I am " + this.name;
};
const p = new Person("Sam");
p.greet();                                   // "Hi, I am Sam" (found up the chain)
Object.getPrototypeOf(p) === Person.prototype; // true
```

The return-value gotcha — object wins, primitive is ignored:

```js
function A() { this.a = 1; return { b: 2 }; }
function B() { this.a = 1; return 42; }
new A(); // { b: 2 }        -> our object discarded
new B(); // B { a: 1 }      -> primitive ignored
```

Guarding against a missing `new` — the same trick `class` uses:

```js
function MustUseNew() {
  if (!new.target) throw new Error("call me with new");
  this.ok = true;
}
```

## 🏗️ Code quality & principles applied

This is a language-mechanics topic, so the craft layer is about **using the right construct and signaling intent**:

- **Naming as a contract (least surprise).** Constructors are `PascalCase` (`Person`) precisely so a reader knows to call them with `new` — say: *"I capitalize constructors by convention so the call site reads correctly and nobody forgets `new`."*
- **Prefer `class` over raw constructor functions today (KISS).** `class` is the same machinery with a built-in `new` guard and cleaner inheritance — say: *"In modern code I'd write this as a `class`; it throws if called without `new`, so it removes the whole footgun. I only reach for the function form to explain what `class` desugars to."*
- **Shared behavior on the prototype, per-instance data on `this` (DRY + single source of truth).** Methods go on the prototype so there's one copy — say: *"Instance state on `this`, shared methods on the prototype, so a thousand instances share one function object."*
- **Fail fast.** If a function genuinely must be constructed, guard with `new.target` instead of silently misbehaving — say: *"A guard clause up top with `new.target` fails loudly rather than corrupting globals."*

**What you deliberately did NOT do:** you didn't hand-roll `Object.create` + `.call` plumbing when `new` (or `class`) already does it correctly — reinventing the operator is a KISS violation. You reach for the manual version *only* to explain the mechanism.

## 🗣️ Keywords to say

- **Constructor function** — a function meant to be called with `new` to build instances.
- **The four steps of `new`** — create object → link prototype → bind `this` → return.
- **`[[Prototype]]` / prototype chain** — the link `new` establishes to `Fn.prototype`; where shared methods are found.
- **`instanceof`** — checks whether a constructor's `prototype` is on an object's chain.
- **Implicit return / explicit object return** — `new` returns the new object unless you return your own object.
- **`new.target`** — is defined only when the function was invoked with `new`; used to detect/enforce construction.
- **`PascalCase` convention** — signals "call me with `new`".
- **Class desugaring** — `class` is syntactic sugar over constructor functions + prototypes, with a `new` guard.

## 🎯 How it's asked in interviews

**The question, disguised:**
- "What's the difference between `Person()` and `new Person()`?" — the flagship.
- "What does the `new` keyword do under the hood?" / "Implement your own `new`" — recite/build the four steps.
- "Where do methods live — on the instance or the prototype? Why?" — tests step 2 and memory cost.
- "What happens if a constructor returns something?" — the return-value gotcha.
- "Why does calling a `class` without `new` throw, but a function doesn't?" — leads to `new.target`.
- "What is `this` inside a constructor?" — connects to [the `this` keyword](../this-keyword/notes.md) (`new` is rule #1).

**Follow-up ladder:** define `new` → list the four steps in order → what's `this` in there → where do shared methods live and why (prototype) → what does `instanceof` actually check → what if you `return` an object / a primitive → how would you *enforce* `new` (`new.target`) → how does `class` relate → implement `myNew(Fn, ...args)`.

**Traps & gotchas:**
- **Forgetting `new`** — in strict mode it throws (`this` is undefined); in sloppy mode it silently writes globals and returns `undefined`. Know both.
- **"Methods are copied to each instance"** — wrong for prototype methods; they're shared via the chain. (Methods defined with `this.method = ...` *inside* the constructor *are* copied per instance — a real distinction they may probe.)
- **The explicit-return rule** — many forget that an object return overrides `new` while a primitive doesn't.
- **Arrow functions can't be constructors** — they have no `[[Construct]]` and no own `this`; `new (() => {})()` throws `TypeError`. Same reason arrows have no `prototype` property.
- **`new Fn` vs `new Fn()`** — both work (parens optional when no args), but write the parens for clarity.
- **Confusing `__proto__` with `prototype`** — `Fn.prototype` is the object instances link *to*; `instance.__proto__` is that same object *from the instance's side*.

**Model answer sketch** ("`Person()` vs `new Person()`"): *"A plain `Person()` just runs the function. Since there's no explicit return, it gives back `undefined`, and `this` inside isn't a new object — it's undefined in strict mode, so it'd throw, or the global object in sloppy mode, which silently leaks globals. `new Person()` does four things: creates a fresh object, links it to `Person.prototype`, binds `this` to it while the body runs, and returns that object automatically. So you get a real instance, `instanceof Person` is true, and it finds prototype methods up the chain. The one gotcha: if the constructor explicitly returns its own object, `new` gives you that instead; a primitive return is ignored. This is exactly why `class` throws when you forget `new` — it guards with `new.target` so you can't hit that undefined-`this` bug."* Then point at the four-step desugaring.

## 🔗 Linked concepts

- **[The `this` keyword](../this-keyword/notes.md)** — `new` binding is rule #1 of the four `this` rules; this note is the deep dive on that one rule.
- **[Closures](../closures/notes.md)** — the *other* way to get private per-instance state (factory functions closing over variables), an alternative to constructor + `this`.
- **[Call, apply, bind](../call-apply-bind/notes.md)** — implementing your own `new` uses `Fn.apply(obj, args)` to run the body with the new object as `this`.

## 🧠 Rapid-fire Q&A

**Q: What are the four things `new` does?**
Creates a new object, links it to the constructor's `.prototype`, binds `this` to it, and returns it (unless the constructor returns its own object).

**Q: What does `new Person()` return if `Person` has no `return`?**
The freshly created object — that's the implicit return `new` performs.

**Q: And if `Person` does `return { x: 1 }`?**
You get `{ x: 1 }` — an explicit object return overrides the new object. A primitive return, though, is ignored.

**Q: Where do methods added to `Person.prototype` live?**
Once, on the single `Person.prototype` object. Every instance references it via the prototype chain, so they're shared, not copied.

**Q: What is `this` inside a constructor called without `new`?**
`undefined` in strict mode (so property writes throw), or the global object in sloppy mode. No instance is created.

**Q: How does `instanceof` work?**
It checks whether the constructor's `.prototype` appears anywhere on the object's prototype chain.

**Q: Why does calling a `class` without `new` throw?**
Class constructors check `new.target`; it's `undefined` on a plain call, and the spec makes that a `TypeError` — removing the silent-bug footgun functions have.

**Q: Can an arrow function be used with `new`?**
No — arrows have no `[[Construct]]` internal method and no own `this` or `prototype`, so `new (()=>{})()` throws.

**Q (design): When would you use a factory + closure instead of `new` + a constructor?**
When you want truly private state (variables in the closure, not on `this`) or want to avoid `this`/`new` entirely — a factory function returning an object literal is simpler and immune to the missing-`new` bug.

## ✅ Cheat lines

- **`new` = create object → link to `.prototype` → bind `this` → return it.**
- **No `new` = no object; `this` is undefined (strict) or global (sloppy), and you get `undefined` back.**
- **Explicit object return overrides `new`; a primitive return is ignored.**
- **Shared methods live on the prototype (one copy); per-instance data lives on `this`.**
- **`class` is the same machinery with a `new.target` guard — that's why it throws without `new`.**
- **Arrow functions can't be constructors — no `prototype`, no own `this`.**
