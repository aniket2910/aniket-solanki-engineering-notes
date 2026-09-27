# 06 — Coding Problems (with solution + expected output)

Short JS problems in the style of the HackerEarth coding section. For each: problem → approach → solution → **expected output** → complexity. Type them out from memory to build speed.

---

## P1. Two Sum

**Problem:** Given an array `nums` and a `target`, return the **indices** of the two numbers that add up to `target`. Exactly one solution exists.

**Approach:** One pass + hash map. For each number, check if `target - num` was already seen.

```js
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));      // [1, 2]
```
**Expected output:**
```
[0, 1]
[1, 2]
```
**Complexity:** O(n) time, O(n) space. (Brute force is O(n²) — don't submit that.)

---

## P2. First Non-Repeating Character

**Problem:** Return the index of the first character that appears exactly once. Return `-1` if none.

**Approach:** Count frequencies, then scan for the first with count 1.

```js
function firstUniqChar(s) {
  const count = {};
  for (const ch of s) count[ch] = (count[ch] || 0) + 1;
  for (let i = 0; i < s.length; i++) {
    if (count[s[i]] === 1) return i;
  }
  return -1;
}

console.log(firstUniqChar("leetcode"));     // 0
console.log(firstUniqChar("loveleetcode")); // 2
console.log(firstUniqChar("aabb"));         // -1
```
**Expected output:**
```
0
2
-1
```
**Complexity:** O(n) time, O(1) space (fixed alphabet).

---

## P3. Valid Parentheses

**Problem:** Given a string of `()[]{}`, decide if brackets are balanced and correctly nested.

**Approach:** Stack. Push openers; on a closer, the top must be the matching opener.

```js
function isValid(s) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else if (stack.pop() !== pairs[ch]) {
      return false;
    }
  }
  return stack.length === 0;
}

console.log(isValid("()[]{}")); // true
console.log(isValid("(]"));     // false
console.log(isValid("([)]"));   // false
console.log(isValid("{[]}"));   // true
```
**Expected output:**
```
true
false
false
true
```
**Complexity:** O(n) time, O(n) space.

---

## P4. Flatten a Nested Array

**Problem:** Flatten an arbitrarily nested array of numbers into a single-level array. (Classic frontend question — don't just use `.flat(Infinity)`; show you can do it.)

**Approach:** Recursion with `reduce`; recurse on arrays, otherwise collect.

```js
function flatten(arr) {
  return arr.reduce(
    (acc, item) =>
      Array.isArray(item) ? acc.concat(flatten(item)) : acc.concat(item),
    []
  );
}

console.log(flatten([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]

// Built-in equivalent:
console.log([1, [2, [3, [4]], 5]].flat(Infinity)); // [1, 2, 3, 4, 5]
```
**Expected output:**
```
[1, 2, 3, 4, 5]
[1, 2, 3, 4, 5]
```
**Complexity:** O(n) in total elements.

---

## P5. Group Anagrams

**Problem:** Group words that are anagrams of each other.

**Approach:** Canonical key = sorted characters. Map key → list.

```js
function groupAnagrams(strs) {
  const map = new Map();
  for (const str of strs) {
    const key = str.split("").sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }
  return [...map.values()];
}

console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
```
**Expected output:**
```
[ [ 'eat', 'tea', 'ate' ], [ 'tan', 'nat' ], [ 'bat' ] ]
```
**Complexity:** O(n · k log k), k = max word length.

---

## P6. Debounce (frontend classic)

**Problem:** Implement `debounce(fn, delay)` — returns a wrapped function that only invokes `fn` after `delay` ms have passed **since the last call**. Rapid calls reset the timer. Used for search-as-you-type, resize, scroll.

**Approach:** Keep a timer id in closure; clear and reset it on every call.

```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Demo
const log = debounce((msg) => console.log("fired:", msg), 200);
log("a");
log("b");
log("c"); // only this one survives the 200ms window
```
**Expected output** (after ~200ms, only the last call runs):
```
fired: c
```
**Note:** `throttle` is the sibling — it runs *at most once per interval* (good for scroll position). Know the difference; it's a common MCQ too.

---

## P7. Reverse Words in a Sentence

**Problem:** Reverse the order of words, collapsing extra whitespace.

**Approach:** Trim, split on one-or-more spaces, reverse, join.

```js
function reverseWords(s) {
  return s.trim().split(/\s+/).reverse().join(" ");
}

console.log(reverseWords("the sky is blue"));    // "blue is sky the"
console.log(reverseWords("  hello   world  "));  // "world hello"
```
**Expected output:**
```
blue is sky the
world hello
```
**Complexity:** O(n).

---

## P8. Memoize a Function (frontend classic)

**Problem:** Implement `memoize(fn)` — caches results by arguments so repeated calls with the same args skip recomputation.

**Approach:** Serialize args as a cache key; store in a `Map`.

```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

let calls = 0;
const slowSquare = (n) => { calls++; return n * n; };
const fast = memoize(slowSquare);

console.log(fast(4)); // 16  (computed)
console.log(fast(4)); // 16  (cached)
console.log(fast(5)); // 25  (computed)
console.log("compute calls:", calls); // 2
```
**Expected output:**
```
16
16
25
compute calls: 2
```
**Complexity:** O(1) average lookup; caveat: `JSON.stringify` keys don't work for functions/circular args.

---

## Coding-round tips

- **Read constraints for edge cases:** empty array, single element, all-same, negatives, empty string.
- **Print exactly what's asked** — HackerEarth usually checks stdout against expected output; trailing spaces/newlines can fail a test.
- **State complexity out loud** (in interviews) — DBS interviewers ask "can you do better?" expecting the O(n) hash-map upgrade over O(n²).
- If given a stdin format, read with the boilerplate:
  ```js
  const lines = require("fs").readFileSync(0, "utf8").trim().split("\n");
  // parse lines, compute, console.log(result)
  ```
