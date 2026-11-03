import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "find-largest-number",
  pattern: "Running maximum",
  topics: ["Array", "Input validation"],
  companies: [],
  gist: "The mirror of Find Smallest, with one classic trap: starting max at 0 breaks all-negative arrays.",
  statement: `Given \`arr\`, return its **largest** number.

- Empty array → \`null\`.
- Not an array, or contains a non-number / \`NaN\` / \`Infinity\` / \`-Infinity\` → \`false\`.`,
  constraints: ["0 ≤ arr.length ≤ 10⁶"],
  examples: [
    { input: "arr = [3, 1, 2]", output: "3" },
    { input: "arr = [-1, -2, -3]", output: "-1", explain: "If max started at 0, this would wrongly return 0." },
  ],
  predict: [
    { input: "arr = [-5, 2, -3, 4]", output: "4", why: "Largest value." },
    { input: "arr = []", output: "null", why: "Nothing to compare." },
    { input: "arr = [NaN]", output: "false", why: "NaN fails Number.isFinite. (And `NaN > x` is always false, so it would silently be ignored otherwise.)" },
  ],
  edgeCases: ["All negative (the 0-seed trap)", "Empty → null", "NaN element", "Duplicates of the max"],
  hints: [
    "What is the largest number in [-1, -2, -3]? What would your code return if max started at 0?",
    "Seed with `-Infinity` or `arr[0]` — something from the data's world, not a guess.",
    "Same skeleton as Find Smallest: guard the type, handle empty, validate each element, replace on `x > max`.",
  ],
  approaches: [
    {
      name: "Sort and take the last",
      idea: "Sort a copy ascending and return the last element. Correct, but does far more work than needed.",
      complexity: { time: "O(n log n)", space: "O(n)", why: "The sort dominates; the copy is n elements." },
      code: `function findLargest(arr: unknown): number | null | false {
  if (!Array.isArray(arr) || !arr.every(Number.isFinite)) return false;
  if (arr.length === 0) return null;
  return [...arr].sort((a, b) => a - b)[arr.length - 1];
}`,
    },
    {
      name: "Running maximum",
      idea: "Seed `max = -Infinity`, scan once, validate each element, replace on `x > max`.",
      complexity: { time: "O(n)", space: "O(1)", why: "One pass, one variable." },
      code: `function findLargest(arr: unknown): number | null | false {
  if (!Array.isArray(arr)) return false;
  if (arr.length === 0) return null;
  let max = -Infinity;
  for (const x of arr) {
    if (!Number.isFinite(x)) return false;
    if (x > max) max = x;
  }
  return max;
}`,
    },
  ],
  complexityTalk: `Sorting to find one value is the textbook "doing too much" mistake: **O(n log n) when O(n) suffices**. Saying "sorting gives me every order statistic, but I only need one, so a single pass is enough" is a good line.

The default \`.sort()\` without a comparator sorts **as strings**: \`[10, 9, 1].sort()\` gives \`[1, 10, 9]\`. Always pass \`(a, b) => a - b\` for numbers.`,
  interview: {
    script: `"I'll scan once with a running maximum seeded at negative infinity — not zero, because an all-negative array would wrongly return zero. I validate each element with Number.isFinite, return false on bad input and null for an empty array. O(n) time, O(1) space. Sorting would also work but costs O(n log n) to find a single value."`,
    keywords: [
      { term: "Sentinel value", meaning: "-Infinity as the starting max; anything real beats it." },
      { term: "Order statistic", meaning: "The k-th smallest/largest; max is the n-th." },
      { term: "Default sort is lexicographic", meaning: "`[10, 9, 1].sort()` → `[1, 10, 9]`." },
    ],
    bonus: ["Mention the string-sort trap.", "For k-th largest, mention Quickselect (O(n) average) or a min-heap of size k."],
    mistakes: ["max = 0", "`.sort()` without a comparator", "Mutating the input with sort"],
    followUps: [
      { q: "k-th largest element?", a: "Min-heap of size k: O(n log k). Or Quickselect: O(n) average, O(n²) worst." },
      { q: "Largest in a sliding window of size k?", a: "Monotonic deque: O(n) total." },
    ],
  },
  starter: `function findLargest(arr: unknown): number | null | false {

}`,
  tests: [
    { args: [[3, 1, 2]], expected: 3 },
    { args: [[-5, 2, -3, 4]], expected: 4 },
    { args: [[-1, -2, -3]], expected: -1, label: "All negative" },
    { args: [[]], expected: null, label: "Empty" },
    { args: [[NaN]], expected: false },
    { args: ["abc"], expected: false, label: "Not an array" },
  ],
};

export default note;
