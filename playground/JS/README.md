# JavaScript — Interview Prep

Each topic is one folder with a `notes.md` (read it) and a `demo.js` (run it). Notes are written for
the interview room: what it is, how it works under the hood, an analogy to hold under pressure, the
keywords that read as senior, and how the question actually gets asked — with the traps.

Run any topic:

```bash
node playground/run.js JS closures
```

## Topics

Some of these overlap heavily (all the async ones lean on the event loop; currying/debounce lean on
closures). To avoid saying the same thing twice, each concept has **one anchor note** that owns the
explanation; related notes link back to it instead of repeating it.

Rough learning order: functions & scope (01–04) → applications (05–08) → async & the event loop (09–14) → browser (15–17).

| # | Topic | One-line hook |
|---|-------|---------------|
| 00 | [Iterators & Generators](iterators-and-generators/notes.md) | `next()/[Symbol.iterator]` protocols and `function*` pause/resume — the machinery behind `for...of` and laziness. |
| 01 | [`this` keyword](this-keyword/notes.md) | Four rules that decide what `this` points to — and why arrow functions ignore them. |
| 02 | [call, apply, bind](call-apply-bind/notes.md) | Setting `this` by hand: borrow methods, partially apply, and why `bind` returns a new function. |
| 02b | [`new` keyword & constructors](new-keyword/notes.md) | The four-step ritual `new` runs to build an instance — object, prototype link, `this`, auto-return — plus the return gotcha and why `class` guards it. |
| 03 | [Closures](closures/notes.md) | A function remembering the variables it was born in — the base of privacy, currying, and debounce. |
| 04 | [Higher-Order Functions](higher-order-functions/notes.md) | Functions as values — taking/returning functions is what `map`, `filter`, and middleware are built on. |
| 05 | [Currying](currying/notes.md) | Turning `f(a, b, c)` into `f(a)(b)(c)` — closures + HOF in action. |
| 06 | [Debouncing / Throttling](debounce-throttle/notes.md) | Rate-limiting an event handler with a closure over a timer. |
| 07 | [Polyfills](polyfills/notes.md) | Re-implementing map/filter/reduce/`Promise.all` the way interviewers ask. |
| 08 | [Hoisting](hoisting/notes.md) | Why `var`/functions "move up" and `let`/`const` sit in the temporal dead zone. |
| 09 | [Event Loop](event-loop/notes.md) | The anchor for everything async — call stack, macrotask queue, microtask queue. |
| 10 | [Callback hell](callback-hell/notes.md) | Why nested callbacks became unmanageable — the problem promises solve. |
| 11 | [Promises](promises/notes.md) | A placeholder for a future value; states, chaining, `all`/`race`/`allSettled`/`any`. |
| 12 | [Async / Await](async-await/notes.md) | Syntactic sugar over promises + the event loop; how `await` suspends. |
| 13 | [setTimeout issues + trust issues](settimeout-issues/notes.md) | Why `setTimeout(fn, 0)` isn't 0, and why the delay is a minimum, not a guarantee. |
| 14 | [Fetch](fetch/notes.md) | The promise-based HTTP API; why a 404 doesn't reject. |
| 15 | [Event bubbling & delegation](event-bubbling-delegation/notes.md) | How events propagate and how to handle many children with one listener. |
| 16 | [CORS & preflight](cors-preflight/notes.md) | Why the browser blocks cross-origin calls and what a preflight `OPTIONS` checks. |
| 17 | [async & defer](async-defer/notes.md) | How `<script>` loading strategies change when JS runs vs the HTML parse. |
