# 01 — JavaScript "What Prints?" (output-prediction MCQs)

This is the most-tested category on the DBS screen. **Predict the output before revealing.** The trap is almost always one line.

---

### Q1. `var` in a loop with `setTimeout`
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```
**Output:** `3 3 3`
**Why:** `var` is function-scoped, so all three callbacks close over the *same* `i`. The loop finishes (i = 3) before any timer fires. Fix with `let` or an IIFE.

---

### Q2. Same loop with `let`
```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```
**Output:** `0 1 2`
**Why:** `let` is block-scoped — each iteration gets a fresh binding of `i`, so each callback captures its own value.

---

### Q3. `typeof` grab-bag
```js
console.log(typeof null);
console.log(typeof undefined);
console.log(typeof NaN);
console.log(typeof []);
```
**Output:**
```
object
undefined
number
object
```
**Why:** `typeof null === "object"` is a famous language bug. `NaN` is a numeric value. Arrays are objects (use `Array.isArray()` to distinguish).

---

### Q4. String concatenation vs addition
```js
console.log(1 + "2" + 3);
console.log(1 + 2 + "3");
```
**Output:**
```
123
33
```
**Why:** `+` is left-to-right. `1 + "2"` → `"12"` (number meets string → concat), then `"12" + 3` → `"123"`. Second line: `1 + 2` = `3` (both numbers), then `3 + "3"` → `"33"`.

---

### Q5. Adding arrays and objects
```js
console.log([] + []);
console.log([] + {});
console.log({} + []);
```
**Output:**
```
(empty string)
[object Object]
[object Object]
```
**Why:** `+` coerces both sides to primitives. `[]` → `""`, `{}` → `"[object Object]"`. (Note: inside `console.log(...)` the `{}` is an expression, so all three behave as concatenation.)

---

### Q6. `var` hoisting
```js
console.log(a);
var a = 5;
console.log(a);
```
**Output:**
```
undefined
5
```
**Why:** `var a` is hoisted (declaration only) and initialized to `undefined`; the assignment stays in place.

---

### Q7. `let` and the Temporal Dead Zone
```js
console.log(b);
let b = 5;
```
**Output:** `ReferenceError: Cannot access 'b' before initialization`
**Why:** `let`/`const` are hoisted but sit in the TDZ until the declaration line — accessing them first throws (unlike `var`, which gives `undefined`).

---

### Q8. Function declaration vs function expression
```js
foo();
bar();
function foo() { console.log("foo"); }
var bar = function () { console.log("bar"); };
```
**Output:**
```
foo
TypeError: bar is not a function
```
**Why:** Function *declarations* are fully hoisted, so `foo()` works. `bar` is a `var` holding a function *expression* — only `var bar` (= `undefined`) is hoisted, so calling it throws.

---

### Q9. Floating point
```js
console.log(0.1 + 0.2 === 0.3);
```
**Output:** `false`
**Why:** IEEE-754 gives `0.1 + 0.2 === 0.30000000000000004`. Compare with a tolerance: `Math.abs(a - b) < Number.EPSILON`.

---

### Q10. Loose vs strict equality with null/NaN
```js
console.log(null == undefined);
console.log(null === undefined);
console.log(NaN == NaN);
```
**Output:**
```
true
false
false
```
**Why:** `null == undefined` is a special rule that's `true`. Strict `===` checks type too → `false`. `NaN` is never equal to anything, including itself (use `Number.isNaN`).

---

### Q11. Minus vs plus with strings
```js
console.log("5" - 3);
console.log("5" + 3);
console.log("5" * "2");
```
**Output:**
```
2
53
10
```
**Why:** `-` and `*` have no string meaning, so operands coerce to numbers. `+` prefers string concatenation when either side is a string.

---

### Q12. Truncating an array via `length`
```js
const arr = [1, 2, 3];
arr.length = 1;
console.log(arr);
```
**Output:** `[1]`
**Why:** `length` is writable — shrinking it deletes trailing elements.

---

### Q13. `splice` (mutates)
```js
const arr = [1, 2, 3, 4, 5];
const removed = arr.splice(1, 2);
console.log(arr);
console.log(removed);
```
**Output:**
```
[1, 4, 5]
[2, 3]
```
**Why:** `splice(start, deleteCount)` **mutates** the array and **returns the removed items**. Removed indices 1–2 (`2, 3`).

---

### Q14. `slice` (does not mutate)
```js
const arr = [1, 2, 3, 4, 5];
console.log(arr.slice(1, 3));
console.log(arr);
```
**Output:**
```
[2, 3]
[1, 2, 3, 4, 5]
```
**Why:** `slice(start, end)` returns a **shallow copy** of `[start, end)` and leaves the original untouched. `splice` vs `slice` is a classic DBS MCQ.

---

### Q15. `this` when a method is detached
```js
const obj = {
  val: 42,
  getVal: function () { return this.val; }
};
const f = obj.getVal;
console.log(obj.getVal());
console.log(f());
```
**Output:**
```
42
undefined
```
**Why:** `this` is decided by *how* the function is called. `obj.getVal()` → `this = obj`. `f()` is a bare call → `this` is the global object (or `undefined` in strict mode), so `this.val` is `undefined`.

---

### Q16. Arrow function `this`
```js
const obj = {
  val: 10,
  getVal: () => this.val
};
console.log(obj.getVal());
```
**Output:** `undefined`
**Why:** Arrow functions have **no own `this`** — they capture the enclosing lexical `this` (module/global scope here), not `obj`. Never use an arrow for an object method that needs `this`.

---

### Q17. Closure counter
```js
function counter() {
  let count = 0;
  return function () { return ++count; };
}
const c = counter();
console.log(c());
console.log(c());
console.log(c());
```
**Output:**
```
1
2
3
```
**Why:** The returned function closes over `count`, which persists across calls because the closure keeps its scope alive.

---

### Q18. Prototype method ownership
```js
function Animal(name) { this.name = name; }
Animal.prototype.speak = function () { return this.name + " speaks"; };
const a = new Animal("Dog");
console.log(a.speak());
console.log(a.hasOwnProperty("speak"));
```
**Output:**
```
Dog speaks
false
```
**Why:** `speak` lives on the prototype, not the instance, so `hasOwnProperty("speak")` is `false`. Only `name` is an own property.

---

### Q19. Truthiness of `"0"`, `[]`, `{}`
```js
if ("0") console.log("A");
if (0) console.log("B");
if ([]) console.log("C");
if ({}) console.log("D");
```
**Output:**
```
A
C
D
```
**Why:** Non-empty strings are truthy (`"0"` too — it's the char, not the number). `0` is falsy. **Every object, including `[]` and `{}`, is truthy.**

---

### Q20. Pre- vs post-increment
```js
let x = 5;
console.log(x++);
console.log(x);
console.log(++x);
```
**Output:**
```
5
6
7
```
**Why:** `x++` returns the old value then increments (prints 5, x becomes 6). `++x` increments then returns (prints 7).

---

### Q21. Arrays are reference types
```js
const a = [1, 2, 3];
const b = a;
b.push(4);
console.log(a);
```
**Output:** `[1, 2, 3, 4]`
**Why:** `b = a` copies the *reference*, not the array. Both point to the same object. Copy with `[...a]` or `a.slice()`.

---

### Q22. Destructuring with defaults
```js
const { x = 1, y = 2 } = { x: 10 };
console.log(x, y);
```
**Output:** `10 2`
**Why:** Defaults apply only when the property is `undefined`. `x` exists (10), `y` is missing so it defaults to `2`.

---

### Q23. `parseInt` vs `Number`
```js
console.log(parseInt("123abc"));
console.log(parseInt("abc"));
console.log(Number("123abc"));
```
**Output:**
```
123
NaN
NaN
```
**Why:** `parseInt` reads leading digits and stops at the first non-numeric char. `Number()` requires the *whole* string to be numeric or returns `NaN`.

---

### Q24. The classic `map(parseInt)` trap
```js
console.log(["1", "2", "3"].map(parseInt));
```
**Output:** `[1, NaN, NaN]`
**Why:** `map` passes `(value, index)`, so it calls `parseInt("1", 0)` → 1, `parseInt("2", 1)` → `NaN` (radix 1 is invalid), `parseInt("3", 2)` → `NaN` (`3` isn't a valid base-2 digit). Fix: `.map(Number)` or `.map(x => parseInt(x, 10))`.

---

### Q25. Loose equality with `false`
```js
console.log(false == "0");
console.log(false == "");
console.log(false == null);
```
**Output:**
```
true
true
false
```
**Why:** With `==`, `false` → `0`. `"0"` → `0` (equal), `""` → `0` (equal). But `null` only loosely equals `undefined`, nothing else — so `false == null` is `false`.
