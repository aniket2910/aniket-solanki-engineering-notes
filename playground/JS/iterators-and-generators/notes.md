# Iterators & Generators

Run the code: `node playground/run.js JS iterators-and-generators` — see [`demo.js`](demo.js).

## ⚡ In one line

An **iterator** is any object with a `.next()` that returns `{ value, done }`; an **iterable** is any object with a `[Symbol.iterator]()` that hands one back; a **generator** (`function*` + `yield`) is the language writing that iterator for you, with the bonus that it can **pause and resume** — which is what makes lazy and infinite sequences possible.

## 🔍 What the interviewer is really testing

- **Do you know the two protocols and how they differ?** Iterator vs iterable trips up most people.
- **Do you understand pause/resume as a real mechanism**, not magic? Saying "`yield` freezes the function and the next `.next()` resumes it with locals intact" reads as someone who actually gets it.
- **Do you reach for laziness where it matters?** Infinite streams, pagination, custom `map`/`take` pipelines — knowing generators avoid building a giant array is the senior signal.
- **Can you connect it to async/await?** `async/await` is generators over promises; interviewers pull this thread.

## Why it exists (the problem)

Before this, "loop over my thing" had no standard. Arrays used index loops, a linked list or tree had no shared way to be walked — every collection invented its own traversal, and `for...of`/spread couldn't work on custom types at all. Iterators gave the language **one protocol every collection can implement**, so the consumer stops caring what the source is. Generators then removed the boilerplate of writing that protocol by hand and — because they can pause — unlocked **lazy** sequences: produce values one at a time, on demand, without building the whole list in memory.

## What it is

Three layers, precisely:

- **Iterator** — an object with a `next()` returning `{ value, done }`. `done` is `false` while values remain, `true` once exhausted. It holds its position (a cursor) internally.
- **Iterable** — an object with a `[Symbol.iterator]()` that **returns an iterator**. This is the hook `for...of`, spread `[...x]`, destructuring, and `Array.from` all look for. Arrays, strings, `Map`, `Set` are built-in iterables; **plain objects are not**.
- **Generator** — a function declared `function*` that returns a **generator object**, which is *both* an iterator (has `next()`) *and* an iterable. Inside, `yield` emits a value and **suspends** execution; the next `next()` resumes right after that `yield`.

**Mental model:** an iterator is a **bookmark that walks itself forward** — each `next()` reads the current spot and moves on. A generator is a function that can hit **pause**, hand you a value, and freeze in place until you press **play**.

## 🎈 Real-life analogy (how to think about it)

A **Pez dispenser** (or the ticket machine at a deli counter).

- The **dispenser** is the *iterable* — you can ask it for a stream of candies.
- Popping **one** candy is `next()`, giving you `{ value: candy, done: false }`.
- Empty dispenser → `{ value: undefined, done: true }`.
- Candies come out **one at a time, only when you press** — nothing is dumped on the table up front. That "only when you press" is **laziness**, and it's why a generator can represent an *infinite* dispenser without exploding: it only makes the next candy when you ask.

For generators, add **pause/resume**: it's like a bookmark in a book. `yield` closes the book on the bookmark — your place and everything around it stays exactly as it was. `next()` reopens to the bookmark and continues the sentence.

## 🔧 How it works (under the hood)

**The protocols, wired together.** When you write `for (const x of thing)`, the engine roughly does:

```text
const iterator = thing[Symbol.iterator]();   // get a fresh iterator
while (true) {
  const result = iterator.next();            // pull one
  if (result.done) break;
  // loop body runs with x = result.value
}
```

Spread, `Array.from`, and destructuring do the same pull loop. So "make my object work with `for...of`" literally means "give it a `[Symbol.iterator]()`."

**Why a generator is both.** Calling a `function*` runs **no body code** — it returns a generator object in a paused state. That object has `next()` (iterator) and its `[Symbol.iterator]()` returns *itself* (iterable). That's why `[...gen()]` and `for (const x of gen())` just work.

**Pause/resume, step by step**, for `function* g() { const a = yield 1; yield a + 1; }`:

```text
g()          -> returns generator, body NOT started
.next()      -> runs to `yield 1`, pauses, returns { value: 1, done: false }
.next(10)    -> `yield 1` evaluates to 10, so a = 10; runs to `yield a+1`,
                pauses, returns { value: 11, done: false }
.next()      -> resumes, function ends, returns { value: undefined, done: true }
```

Two things worth saying out loud: (1) the argument to the **first** `next()` is discarded — there's no paused `yield` yet to receive it; (2) the value passed to `next(v)` becomes the **result of the `yield`** where it paused. That two-way flow is the trick behind `async/await`.

## 💻 In code

Everything below is in [`demo.js`](demo.js). The point of the first block is just to prove there's nothing magic — an iterator is an object with `next()`:

```js
function makeCounter(limit) {
  let current = 0;
  return {
    next() {
      if (current < limit) {
        current = current + 1;
        return { value: current, done: false };
      }
      return { value: undefined, done: true };
    },
  };
}
```

You **rarely write that by hand** — a generator does the same thing in a fraction of the code, which is the whole reason generators exist:

```js
function* countTo(limit) {
  for (let i = 1; i <= limit; i++) {
    yield i; // pause, give back i, resume here next time
  }
}
console.log([...countTo(3)]); // [1, 2, 3]
```

The real payoff is laziness — an infinite generator plus a `take()` that pulls only what's needed:

```js
function* naturalNumbers() {
  let n = 1;
  while (true) { yield n; n++; }   // infinite, but safe because it's lazy
}
console.log([...take(naturalNumbers(), 5)]); // [1, 2, 3, 4, 5]
```

`naturalNumbers()` never finishes, but `take` only pulls five — nothing beyond that is ever computed. An array can't represent this at all.

## 🏗️ Code quality & principles applied

**Decomposition — separate producing from consuming.** The clean move is small, single-purpose generators: `naturalNumbers()` *produces*, `take()` *limits*. Each does one thing and composes with the other, and `take` works over *any* iterable, not just numbers.

**Principles by name:**
- **Single Responsibility** — each generator owns one step (`take` doesn't know how values are produced). Say: *"I keep each operator to one responsibility so they compose."*
- **Separation of concerns** — the data *source* is decoupled from every *consumer* via the protocol; adding a new consumer needs zero changes to the source. Say: *"The iterable protocol is the contract; producer and consumer evolve independently."*
- **KISS / YAGNI** — reach for a plain array by default; a generator earns its place only when the sequence is large, infinite, expensive per item, or arrives over time. Say: *"For a bounded in-memory list I'd just use an array — I pull in a generator only when laziness actually buys me something."*

**Say while coding:** *"I'll implement `[Symbol.iterator]` so this drops into `for...of` and spread,"* and *"I'll return a fresh iterator each call so it can be looped more than once."*

**What you deliberately did NOT do:** you didn't eagerly build the full list (kills the infinite case, wastes memory), and you didn't wrap three tiny generators in a generic "lazy library" — that restraint is the judgment interviewers want.

## 🗣️ Keywords to say

- **Iterator protocol** — object with `next()` returning `{ value, done }`.
- **Iterable protocol** — object with `[Symbol.iterator]()` returning an iterator; the hook `for...of`/spread use.
- **`Symbol.iterator` / `Symbol.asyncIterator`** — the well-known symbols the language looks for (sync / async).
- **Lazy evaluation** — values computed on demand, one at a time; enables infinite sequences.
- **Suspend / resume (coroutine)** — `yield` pauses preserving local state; `next()` resumes. A generator is a coroutine.
- **`yield*` delegation** — iterate another iterable through the current generator.
- **Two-way communication** — `next(v)` sends a value *into* the generator as the result of the paused `yield`.
- **Eager vs lazy** — an array materializes everything up front; a generator streams.

## 🎯 How it's asked in interviews

**The question, disguised.** All the same topic:
- "Difference between an iterator and an iterable?"
- "Make this object work with `for...of`." / "Why does `for...of` throw on a plain object?"
- "Implement a lazy `range` / infinite id generator / Fibonacci stream / a lazy `take(n)`."
- "How would you stream a large dataset without loading it all?" → async generators.
- "How does `async/await` actually work?" → generators over promises.

**Follow-up ladder:** define iterator vs iterable → implement it by hand → rewrite as a generator → make it infinite + add `take` → show two-way `next(v)` / `return()` / `throw()` → do it async with `for await...of` → "how does this relate to `async/await`?"

**Traps & gotchas:**
- **Plain objects aren't iterable** — `for (const x of {a:1})` throws. Only things with `[Symbol.iterator]` work. (`for...in` is different — it walks enumerable keys, not the iterator protocol.)
- **The first `next()` argument is ignored** — no suspended `yield` yet to receive it.
- **Iterators are one-shot** — once `done`, they stay done. Return a *fresh* iterator from `[Symbol.iterator]`, or a second loop gets nothing.
- **Infinite generator without a bound = hang** — `[...naturalNumbers()]` never returns; cap it with `take`.
- **`return` inside `for...of` closes the iterator** — runs its `finally` (good for cleanup).

**Model answer sketch** (flagship: "make this iterable, then make it lazy"): name the contract — *"`for...of` looks for `[Symbol.iterator]`, which returns an object with `next()` giving `{ value, done }`."* Show the hand-written version once to prove you know the protocol, then say *"the boilerplate here is exactly what generators remove"* and rewrite with `function*`. Land on laziness: *"the real win is I can make this infinite or streamed — I'll add `take(n)` so nothing beyond what's needed is computed."* If pushed, connect it: *"this pause/resume with two-way `next(v)` is the same machinery `async/await` uses — `await` is conceptually yielding a promise and resuming with its resolved value."*

## 🔗 Linked concepts

- **[Closures](../closures/notes.md)** — an iterator's cursor lives in a closure; the by-hand `makeCounter` is a pure closure.
- **Event loop & async/await** *(planned)* — `async/await` is suspend/resume driving promises; the deepest follow-up pulls straight into the event loop.

## 🧠 Rapid-fire Q&A

**Q: Iterator vs iterable?**
Iterable has `[Symbol.iterator]()` returning an iterator; iterator has `next()` returning `{ value, done }`. A generator object is both.

**Q: Why does `for...of` throw on a plain object?**
Plain objects have no `[Symbol.iterator]`. Use `Object.entries()` (which is iterable) or add your own.

**Q: What does calling a generator function do?**
Runs none of the body — returns a paused generator object. Body runs only on `.next()`.

**Q: What happens to the first `.next()`'s argument?**
Discarded — no paused `yield` exists yet to receive it.

**Q: Why return a *fresh* iterator instead of `this`?**
So the object can be looped multiple times independently; a shared iterator, once exhausted, gives later loops nothing.

**Q: What happens if you spread an infinite generator?**
It hangs forever — spread pulls until `done`, which never comes. Bound it with `take`.

**Q: How do generators enable `async/await`?**
`await` is like yielding a promise: the function suspends, a runner waits for the promise, then resumes by calling `next(resolvedValue)`, feeding the result back via the two-way channel.

**Q: When would you NOT use a generator?**
When the data is small, bounded, and in memory — a plain array is simpler and faster (KISS/YAGNI).

## ✅ Cheat lines

- **Iterable has `[Symbol.iterator]`, iterator has `next() → { value, done }`; a generator is both.**
- **`function*` returns a paused machine; `yield` freezes it with locals intact, `next()` presses play.**
- **The whole point is laziness — produce on demand, so infinite and streamed sequences become possible.**
- **`next(v)` is a two-way door — that's what `async/await` rides on.**
- **Plain objects aren't iterable; first `next()` arg is ignored; return a fresh iterator so it re-loops.**
