import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "find-smallest-number",
  pattern: "Running minimum",
  topics: ["Array", "Input validation"],
  companies: [],
  gist: "Keep \"the smallest seen so far\" in one variable — and know why Math.min(...arr) is risky.",
  statement: `Given \`arr\`, return its **smallest** number.

- Empty array → \`null\`.
- Not an array, or contains a non-number / \`NaN\` / \`Infinity\` / \`-Infinity\` → \`false\`.`,
  constraints: ["0 ≤ arr.length ≤ 10⁶"],
  examples: [
    { input: "arr = [3, 1, 2]", output: "1" },
    { input: "arr = []", output: "null", explain: "There's no smallest element of nothing." },
  ],
  predict: [
    { input: "arr = [-5, 2, -3, 4]", output: "-5", why: "Negatives are smaller than everything positive." },
    { input: "arr = [-1.5, -0.1, 0, 2.2]", output: "-1.5", why: "Decimals compare normally." },
    { input: "arr = 42", output: "false", why: "Not an array." },
  ],
  edgeCases: ["Empty → null (different from invalid → false)", "All negative", "Single element", "Invalid element anywhere"],
  hints: [
    "What should `min` start as? A guess like 0 breaks on all-positive arrays.",
    "Seed `min` from the data: `arr[0]`. Then compare every other element.",
    "Validate each element with `Number.isFinite` inside the same loop, and handle the empty array before reading `arr[0]`.",
  ],
  approaches: [
    {
      name: "Math.min(...arr)",
      idea: "One line, but spreading passes each element as a separate argument. Engines cap that (somewhere above ~100k), so huge arrays throw `RangeError`. It also returns `Infinity` for `[]`.",
      complexity: { time: "O(n)", space: "O(n)", why: "The spread materialises n arguments on the call stack." },
      code: `function findSmallest(arr: unknown): number | null | false {
  if (!Array.isArray(arr) || !arr.every(Number.isFinite)) return false;
  return arr.length ? Math.min(...arr) : null;
}`,
    },
    {
      name: "Running minimum",
      idea: "Validate the type, handle empty, seed `min = arr[0]`, then replace it whenever a smaller valid value appears.",
      complexity: { time: "O(n)", space: "O(1)", why: "One pass, one variable." },
      code: `function findSmallest(arr: unknown): number | null | false {
  if (!Array.isArray(arr)) return false;
  if (arr.length === 0) return null;
  let min = Infinity;
  for (const x of arr) {
    if (!Number.isFinite(x)) return false;
    if (x < min) min = x;
  }
  return min;
}`,
    },
  ],
  complexityTalk: `O(n) is optimal: an unsorted array gives no shortcut, so every element must be seen (any element you skip could be the minimum — that's the **Ω(n) lower bound** argument). The difference between the approaches is **space and robustness**: the spread uses O(n) stack space and can crash; the loop is O(1).

If the array were sorted, the min is \`arr[0]\` in O(1). If you need min repeatedly while inserting, that's a **min-heap** (O(log n) insert, O(1) peek).`,
  interview: {
    script: `"I'll keep a running minimum. After checking it's an array and returning null for empty, I scan each element: if it's not a finite number I return false, and if it's smaller than the current min I replace it. One pass, O(n) time, O(1) space, and O(n) is the lower bound since any skipped element could be the answer. I'm avoiding Math.min with spread because it puts every element on the call stack as an argument and throws a RangeError for very large arrays."`,
    keywords: [
      { term: "Running min / accumulator", meaning: "One variable updated during the scan." },
      { term: "Seed from the data", meaning: "Start from arr[0] or Infinity, never a guess like 0." },
      { term: "Argument limit", meaning: "Why `Math.min(...bigArray)` throws RangeError." },
      { term: "Lower bound Ω(n)", meaning: "Every element must be inspected in an unsorted array." },
    ],
    bonus: ["Explain the spread argument limit.", "Mention a min-heap for a stream of values.", "Explain why empty returns null but invalid returns false."],
    mistakes: ["Starting min at 0", "Reading arr[0] before checking length", "Using `Math.min.apply` on huge arrays (same limit)"],
    followUps: [
      { q: "Find both min and max with fewer comparisons?", a: "Process elements in pairs: compare the pair first, then the smaller with min and the larger with max — about 1.5n comparisons instead of 2n." },
      { q: "Minimum in a rotated sorted array?", a: "Binary search on which half is sorted: O(log n)." },
    ],
  },
  starter: `function findSmallest(arr: unknown): number | null | false {

}`,
  tests: [
    { args: [[3, 1, 2]], expected: 1 },
    { args: [[-5, 2, -3, 4]], expected: -5 },
    { args: [[-1.5, -0.1, 0, 2.2]], expected: -1.5 },
    { args: [[]], expected: null, label: "Empty" },
    { args: [[1, "a"]], expected: false },
    { args: [42], expected: false, label: "Not an array" },
    { args: [[7]], expected: 7 },
  ],
};

export default note;
