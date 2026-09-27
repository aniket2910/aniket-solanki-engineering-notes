# call, apply, bind

Run the code: `node playground/run.js JS call-apply-bind` — see [`demo.js`](demo.js).

## ⚡ In one line

`call`, `apply`, and `bind` all let you set a function's `this` (and pass arguments) by hand — `call` and `apply` **run it now** (args listed vs args as an array), while `bind` **returns a new function** with `this` permanently locked in.

## 🔍 What the interviewer is really testing

- **Do you know the difference cleanly** — the only real distinctions are "run now vs return a function" and "args comma-separated vs array"?
- **Do you understand these as the explicit-binding rule** for [`this`](../this-keyword/notes.md)?
- **Can you use them for real patterns** — method borrowing and partial application?
- **Can you implement `bind` yourself?** It's a top polyfill question and proves you understand `this` + closures.

## Why it exists (the problem)

`this` is normally decided by the call site, which means it's easy to have the *wrong* `this` — a method handed to `setTimeout`, a callback, a function you want to reuse across objects. You need a way to say "call this function, but with **this** specific `this`." That's exactly what these three do. They also let you **borrow** a method from one type to use on another (array methods on an array-like object) and **pre-fill** arguments (partial application).

## What it is

Three methods every function has:

- **`fn.call(thisArg, arg1, arg2, ...)`** — call `fn` right now with `this = thisArg` and those arguments.
- **`fn.apply(thisArg, [arg1, arg2])`** — same, but arguments come as a single array. (Mnemonic: **A**pply = **A**rray.)
- **`fn.bind(thisArg, arg1, ...)`** — do **not** call; return a **new function** that, whenever called, runs `fn` with `this = thisArg` and those arguments prepended.

**Mental model:** `call` and `apply` are "run this now, and here's the `this` to use." `bind` is "make me a **new copy** of this function that always uses this `this` — I'll call it whenever." The bound function is sticky: its `this` can't be changed again.

## 🎈 Real-life analogy (how to think about it)

Think of a function as a **contractor** and `this` as the **house they work on**.

- **`call`** — "Go work on *this* house right now, here are your materials one by one." Job happens immediately.
- **`apply`** — Same instruction, but you hand over the materials as **one box** (an array) instead of one at a time.
- **`bind`** — You don't send them yet; you **write a work order** that already names the house (and maybe some materials). You keep the order and dispatch it later. The house on the order can't be swapped afterward — that's `bind` being sticky.

## 🔧 How it works (under the hood)

All three take a `thisArg` and set the function's `this` to it for that invocation. The differences are purely mechanical:

```text
call:   invoke immediately,  args spread as a list      -> returns the result
apply:  invoke immediately,  args taken from an array    -> returns the result
bind:   invoke NEVER (yet),  returns a new function that -> when called, runs the
        original with the stored thisArg + stored args + any new args appended
```

**`bind` is a closure.** The returned function closes over the original function, the `thisArg`, and any pre-bound args. When you finally call it, it uses `call`/`apply` internally to invoke the original with everything combined. That's why implementing `bind` is really a closures question wearing a `this` costume.

**Partial application** falls out of `bind` for free: any args you pass to `bind` after `thisArg` are **prepended** to the eventual call, so `multiply.bind(null, 2)` fixes the first argument and leaves the rest open. Passing `null`/`undefined` as `thisArg` means "I don't care about `this` here, I only want to pre-fill args."

## 💻 In code

All in [`demo.js`](demo.js). The three, side by side:

```js
function introduce(greeting, punctuation) {
  return greeting + ", I am " + this.name + punctuation;
}
const person = { name: "Aniket" };

introduce.call(person, "Hello", "!");     // runs now, args listed
introduce.apply(person, ["Hi", "."]);     // runs now, args as array
const fn = introduce.bind(person);         // returns a function
fn("Hey", "!!");                           // "Hey, I am Aniket!!"
```

Method borrowing — give `arguments` (array-like, no array methods) a real array method:

```js
function sumAll() {
  const args = Array.prototype.slice.call(arguments); // borrow slice
  return args.reduce((total, n) => total + n, 0);
}
```

Implement `bind` — the classic polyfill, which is just `call` + a closure:

```js
Function.prototype.myBind = function (thisArg, ...boundArgs) {
  const originalFn = this;                       // the fn myBind was called on
  return function (...laterArgs) {
    return originalFn.call(thisArg, ...boundArgs, ...laterArgs);
  };
};
```

## 🏗️ Code quality & principles applied

**Decomposition — separate "what to run" from "on what / with what."** These methods let a single function body serve many receivers, instead of duplicating it per object. That's reuse.

**Principles by name:**
- **DRY / reuse** — method borrowing means you don't reimplement `slice`/`reduce`; you reuse the existing one. Say: *"I borrow `Array.prototype.slice` rather than write my own — DRY."*
- **Composition / partial application** — `bind` builds a specialized function (`double`) from a general one (`multiply`) without a new function body. Say: *"I partially apply `multiply` to get `double` — composition over rewriting."*
- **Separation of concerns** — `bind` cleanly splits *deciding the receiver* (now) from *invoking* (later).

**Say while coding:** *"I'll `bind` this at the boundary so the receiver is fixed before I hand it off,"* and, on the polyfill, *"`bind` is really a closure over the original function, the `this`, and the pre-bound args — I'll rebuild it with `call`."*

**What you deliberately did NOT do:** in modern code you'd often prefer the spread operator (`Math.max(...arr)`) or arrow functions over `apply`/`bind` — worth saying you know `apply`-for-spreading is largely legacy now (KISS). Reach for `call`/`apply`/`bind` when you specifically need to control `this` or borrow a method.

## 🗣️ Keywords to say

- **Explicit binding** — setting `this` by hand; the rule `call`/`apply`/`bind` implement.
- **`thisArg`** — the object you're forcing `this` to be.
- **Method borrowing** — using a method from one prototype on a different (often array-like) object.
- **Array-like** — has `length` and indexes but no array methods (`arguments`, `NodeList`).
- **Partial application** — fixing some arguments up front to get a more specific function.
- **Sticky binding** — a bound function's `this` can't be changed again.
- **Apply = Array** — the mnemonic for which one takes an array.

## 🎯 How it's asked in interviews

**The question, disguised:**
- "Difference between `call`, `apply`, and `bind`?" — the pure-recall opener.
- "Implement `Function.prototype.bind`" (or `myCall`/`myApply`) — the polyfill ask.
- "How would you find the max of an array without spread?" → `Math.max.apply(null, arr)`.
- "Turn `arguments` into a real array." → `Array.prototype.slice.call(arguments)` (or `Array.from`).
- "Fix this callback that has the wrong `this`." → `bind`.

**Follow-up ladder:** state the differences → write `myBind` → handle pre-bound args (partial application) → "what if the bound function is used with `new`?" (real spec `bind` still lets `new` override `this`; a simple polyfill doesn't) → compare to arrow functions.

**Traps & gotchas:**
- **`bind` returns a new function — it doesn't call it.** Forgetting and expecting a value is the top mistake.
- **`apply` wants an array, `call` wants a list.** Swapping them is a classic slip.
- **Binding twice doesn't work** — `fn.bind(a).bind(b)` stays bound to `a`. Bind is sticky.
- **Arrow functions ignore all three for `this`** — `arrowFn.call(obj)` sets args but *not* `this`.
- **Performance / correctness of `apply` with huge arrays** — spreading a massive array via `apply` can hit argument limits; prefer spread or a loop. Minor but senior to mention.

**Model answer sketch** ("difference + implement bind"): *"All three set `this`. `call` and `apply` invoke immediately — `call` takes args as a list, `apply` as an array. `bind` doesn't invoke; it returns a new function with `this` locked in, and any extra args are partially applied."* Then implement `myBind`: *"I capture the original function as `this`, return a closure, and inside it `call` the original with the stored `this` plus stored args plus the new ones."* Name it: *"this is closures + explicit binding — the whole thing is those two ideas."*

## 🔗 Linked concepts

- **[`this` keyword](../this-keyword/notes.md)** — these three *are* the explicit-binding rule; understand `this` first.
- **[Closures](../closures/notes.md)** — `bind`'s returned function is a closure over the original fn, `this`, and args.
- **Currying / Polyfills** *(planned)* — partial application leads into currying; `myBind`/`myCall` are staple polyfill questions.

## 🧠 Rapid-fire Q&A

**Q: Difference between the three?**
`call` and `apply` run immediately (`call` = comma args, `apply` = array args); `bind` returns a new function with `this` fixed.

**Q: Which takes an array?**
`apply` (Apply = Array).

**Q: What does `bind` return?**
A brand-new function permanently tied to the given `this` (and any pre-bound args) — it doesn't run the original.

**Q: What's method borrowing?**
Calling a method from one object/prototype on another, e.g. `Array.prototype.slice.call(arguments)` to array-ify an array-like.

**Q: How is `bind` implemented?**
Capture the original function, return a closure that `call`s it with the stored `this` and stored + new args.

**Q: What happens if you bind an already-bound function?**
Nothing changes the `this` — bind is sticky; the first bind wins.

**Q: Does `call` change `this` inside an arrow function?**
No. Arrows have lexical `this`; `call`/`apply`/`bind` can pass args to them but can't set their `this`.

**Q (design): When would you use partial application via `bind`?**
To specialize a general function once and reuse it — e.g. `multiply.bind(null, 2)` → a `double` you can pass around, instead of writing a new function.

## ✅ Cheat lines

- **call = run now, comma args. apply = run now, array args. bind = return a new function, run later.**
- **All three set `this` — they're the explicit-binding rule.**
- **`bind` is sticky and supports partial application (extra args are pre-filled).**
- **`Array.prototype.slice.call(arguments)` = borrow a method to array-ify an array-like.**
- **Implement `bind` = capture the fn, return a closure that `call`s it with stored `this` + args.**
