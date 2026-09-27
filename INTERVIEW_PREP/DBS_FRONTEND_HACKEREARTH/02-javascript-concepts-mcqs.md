# 02 — JavaScript Concepts (multiple-choice)

Conceptual MCQs on closures, `this`, prototypes, coercion, and array methods. Options given; answer + reasoning below each.

## Coercion cheat table (memorize this — it answers a lot)

| Value        | Number()   | String()          | Boolean() |
|--------------|-----------|-------------------|-----------|
| `""`         | `0`       | `""`              | `false`   |
| `"0"`        | `0`       | `"0"`             | **`true`**|
| `"abc"`      | `NaN`     | `"abc"`           | `true`    |
| `0`          | `0`       | `"0"`             | `false`   |
| `null`       | `0`       | `"null"`          | `false`   |
| `undefined`  | `NaN`     | `"undefined"`     | `false`   |
| `[]`         | `0`       | `""`              | **`true`**|
| `[5]`        | `5`       | `"5"`             | `true`    |
| `[1,2]`      | `NaN`     | `"1,2"`           | `true`    |
| `{}`         | `NaN`     | `"[object Object]"`| `true`   |
| `NaN`        | `NaN`     | `"NaN"`           | `false`   |

Falsy values (only 8): `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. **Everything else is truthy.**

---

### Q1. What is a closure?
A) A function that returns another function
B) A function bundled with references to its surrounding lexical scope
C) A way to close a browser tab
D) A private variable keyword

**Answer: B.** A closure is a function that retains access to variables from the scope in which it was *defined*, even after that outer function has returned.

---

### Q2. What decides the value of `this` in a regular function?
A) Where the function is defined
B) How the function is called (the call-site)
C) The file it lives in
D) Always the global object

**Answer: B.** For regular functions, `this` is set at call time (method call → the object, bare call → global/undefined, `new` → new instance, `call/apply/bind` → explicit). Arrow functions are the exception — lexical `this`.

---

### Q3. `arr.slice()` vs `arr.splice()` — which mutates the original?
A) Both mutate
B) Neither mutates
C) `slice` mutates, `splice` doesn't
D) `splice` mutates, `slice` doesn't

**Answer: D.** `splice` mutates in place (and can insert/delete); `slice` returns a shallow copy and leaves the original alone.

---

### Q4. Which array methods mutate the array they're called on?
A) `map`, `filter`, `reduce`
B) `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`
C) `slice`, `concat`, `join`
D) `find`, `some`, `every`

**Answer: B.** The "mutators" change the array. `map/filter/reduce/slice/concat` all return new values. `sort` and `reverse` mutate (a common trap).

---

### Q5. `["b","a","c"].sort()` returns?
A) `["a","b","c"]`
B) `["c","b","a"]`
C) unchanged
D) error

**Answer: A.** Default `sort()` compares by **string** Unicode order, which is fine for these. Note: `[10, 2, 1].sort()` gives `[1, 10, 2]` because it sorts lexicographically — pass a comparator `(a,b) => a-b` for numbers.

---

### Q6. What does `Function.prototype.bind` do?
A) Calls the function immediately
B) Returns a new function with `this` (and optional args) permanently set
C) Binds an event listener
D) Copies the function

**Answer: B.** `bind` returns a *new* function with a locked `this`; `call`/`apply` invoke immediately (`apply` takes args as an array).

---

### Q7. The prototype chain lookup order for `obj.foo` is:
A) global → obj
B) obj's own props → obj's prototype → … → `Object.prototype` → `null`
C) prototype first, then own
D) random

**Answer: B.** JS checks own properties first, then walks up the prototype chain until found or `null`.

---

### Q8. `const` means the variable's value cannot change. True/False?
A) True
B) False

**Answer: B (False).** `const` prevents *reassignment of the binding*, not mutation. `const a = [1]; a.push(2);` is legal; `a = [3]` is not.

---

### Q9. What is `NaN === NaN`?
A) `true`
B) `false`
C) `undefined`
D) error

**Answer: B.** `NaN` is not equal to anything, including itself. Detect with `Number.isNaN(x)`.

---

### Q10. Difference between `==` and `===`?
A) No difference
B) `==` compares after type coercion; `===` compares value *and* type with no coercion
C) `===` is slower
D) `==` only works on numbers

**Answer: B.** Prefer `===` to avoid coercion surprises.

---

### Q11. What does `"use strict"` change?
A) Nothing at runtime
B) Makes silent errors throw, forbids undeclared vars, `this` is `undefined` in bare function calls
C) Enables TypeScript
D) Doubles performance

**Answer: B.**

---

### Q12. Which creates a *new* array of transformed items?
A) `forEach`
B) `map`
C) `push`
D) `splice`

**Answer: B.** `map` returns a new array; `forEach` returns `undefined` (side-effects only).

---

### Q13. `[1,2,3].reduce((acc, x) => acc + x, 0)` returns?
A) `6`
B) `[1,2,3]`
C) `123`
D) `0`

**Answer: A.** Sum with initial accumulator `0`. Without the initial value, the first element becomes the seed.

---

### Q14. What is hoisting?
A) Moving code to the top of the file
B) The engine registering declarations before execution — `var`/functions are usable early (`var` = `undefined`), `let`/`const` sit in the TDZ
C) A CSS positioning term
D) Lifting the DOM into memory

**Answer: B.**

---

### Q15. `typeof function(){}` is?
A) `"object"`
B) `"function"`
C) `"undefined"`
D) `"callable"`

**Answer: B.** Functions are callable objects but `typeof` reports `"function"`.

---

### Q16. How do you shallow-copy an object?
A) `const b = a;`
B) `const b = {...a}` or `Object.assign({}, a)`
C) `const b = a.clone()`
D) `const b = new Object(a)`

**Answer: B.** `b = a` copies the reference (not a copy). Spread/`Object.assign` copy one level deep. For deep copies use `structuredClone(a)`.

---

### Q17. What does the `new` keyword do?
A) Allocates memory only
B) Creates an object, links its prototype to the constructor's `.prototype`, binds `this`, and returns it (unless the constructor returns an object)
C) Calls a function normally
D) Creates a class

**Answer: B.**

---

### Q18. IIFE stands for and is used for?
A) Immediately Invoked Function Expression — runs at once, creates a private scope
B) Internal Import For Export
C) Iterative Internal Function Engine
D) It's a React hook

**Answer: A.** `(function(){ ... })();` — historically used to avoid polluting the global scope before modules.

---

### Q19. `Object.freeze(obj)` does what?
A) Deletes the object
B) Makes it read-only (shallow) — no adding/removing/changing top-level properties
C) Deep-freezes all nested objects
D) Converts to JSON

**Answer: B.** It's **shallow** — nested objects can still be mutated.

---

### Q20. What's the output type of `JSON.parse(JSON.stringify(obj))` used for?
A) A deep clone (with limitations — loses functions, `undefined`, `Date` becomes string)
B) A shallow copy
C) A string always
D) Mutating in place

**Answer: A.** A quick deep clone, but it drops functions/`undefined`, mangles `Date`/`Map`/`Set`, and throws on circular refs. `structuredClone` is the modern alternative.
