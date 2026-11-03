import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "count-negative",
  pattern: "Validate, then single pass",
  topics: ["Array", "Input validation"],
  companies: [],
  gist: "The count is trivial. The points are in rejecting bad input the way a production function would.",
  statement: `Given \`arr\`, return how many elements are **strictly less than 0**.

- If \`arr\` is not an array, return \`false\`.
- If any element is not a number, or is \`NaN\`, \`Infinity\` or \`-Infinity\`, return \`false\`.
- An empty array is valid and returns \`0\`.`,
  constraints: ["0 ≤ arr.length ≤ 10⁵"],
  examples: [
    { input: "arr = [-1, 0, 1]", output: "1", explain: "0 is not negative." },
    { input: "arr = null", output: "false", explain: "Not an array." },
  ],
  predict: [
    { input: "arr = [-2, -5, -7]", output: "3", why: "All three are below zero." },
    { input: "arr = []", output: "0", why: "Valid but empty." },
    { input: "arr = [1, Infinity]", output: "false", why: "`typeof Infinity` is \"number\", but it isn't finite. `Number.isFinite` catches it." },
    { input: "arr = [1, \"a\"]", output: "false", why: "A string inside the array." },
  ],
  edgeCases: ["Non-array input (null, number, object)", "NaN / ±Infinity elements", "Empty array → 0, not false", "0 is not negative"],
  hints: [
    "Which check tells an array apart from an array-like object or null? (`typeof` won't.)",
    "`Number.isFinite(x)` is false for non-numbers, NaN and both infinities — one check covers all four rules.",
    "Validate everything first, then count with `x < 0`. Or do both in one loop and return `false` as soon as something is invalid.",
  ],
  approaches: [
    {
      name: "filter + every",
      idea: "`Array.isArray`, then `every(Number.isFinite)`, then `filter(x => x < 0).length`. Readable, but two passes and a temporary array.",
      complexity: { time: "O(n)", space: "O(n)", why: "Two passes; filter allocates up to n elements." },
      code: `function countNegatives(arr: unknown): number | false {
  if (!Array.isArray(arr) || !arr.every(Number.isFinite)) return false;
  return arr.filter((x) => x < 0).length;
}`,
    },
    {
      name: "One loop: validate and count",
      idea: "Guard the type once, then walk the array: return `false` on the first invalid element, otherwise add one for every negative.",
      complexity: { time: "O(n)", space: "O(1)", why: "Each element is checked once; one counter." },
      code: `function countNegatives(arr: unknown): number | false {
  if (!Array.isArray(arr)) return false;
  let count = 0;
  for (const x of arr) {
    if (!Number.isFinite(x)) return false;
    if (x < 0) count++;
  }
  return count;
}`,
    },
  ],
  complexityTalk: `O(n) time is optimal — every element must be checked. The improvement from the filter version is **space**: O(n) → O(1) by not building a temporary array, and **early exit** on the first invalid value.

On a **sorted** array (LeetCode 1351 variant, sorted matrix), binary search finds the first negative in O(log n) and the count is \`n − index\`. That's the natural follow-up.`,
  interview: {
    script: `"First I validate: Array.isArray rejects null, numbers and array-like objects, which typeof can't do. Inside the loop, Number.isFinite rejects strings, NaN and both infinities in one check, and I return false immediately. Otherwise I count values strictly below zero, so 0 isn't counted. One pass, O(n) time, O(1) space, with an early exit. If the array were sorted, I'd binary search for the first negative instead and get O(log n)."`,
    keywords: [
      { term: "Array.isArray", meaning: "The reliable array check; `typeof [] === \"object\"`." },
      { term: "Number.isFinite vs isFinite", meaning: "The global `isFinite(\"5\")` coerces to true; `Number.isFinite` doesn't." },
      { term: "Early exit / fail fast", meaning: "Return on the first invalid element." },
    ],
    bonus: ["Contrast `Number.isFinite` with the coercing global `isFinite`.", "Offer the O(log n) binary-search version for sorted input."],
    mistakes: ["Using `typeof arr === \"object\"` (null and objects pass)", "Counting 0 as negative", "Returning false for an empty array"],
    followUps: [
      { q: "Count negatives in a matrix sorted by rows and columns?", a: "Start at the bottom-left; walk up when negative (add the rest of the row), right when not. O(m + n)." },
      { q: "Why not `typeof x === \"number\"`?", a: "NaN and Infinity are both of type \"number\"." },
    ],
  },
  starter: `function countNegatives(arr: unknown): number | false {

}`,
  tests: [
    { args: [[-1, 0, 1]], expected: 1 },
    { args: [[-2, -5, -7]], expected: 3 },
    { args: [[0, 2, 3]], expected: 0 },
    { args: [[]], expected: 0, label: "Empty" },
    { args: [null], expected: false, label: "Not an array" },
    { args: [[1, "a"]], expected: false },
    { args: [[1, Infinity]], expected: false },
    { args: [[NaN]], expected: false },
  ],
};

export default note;
