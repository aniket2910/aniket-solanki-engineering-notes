import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "binary-search",
  pattern: "Binary search (halve the search space)",
  topics: ["Array", "Binary Search"],
  companies: ["Amazon", "Microsoft", "Google", "Meta", "Apple", "Adobe"],
  gist: "Use sortedness to discard half the array every step — and get the loop boundaries exactly right.",
  statement: `Given a **sorted** (ascending) array of distinct integers \`nums\` and an integer \`target\`, return the index of \`target\`, or \`-1\` if it isn't there.

You must write an algorithm with **O(log n)** runtime.`,
  constraints: ["1 ≤ nums.length ≤ 10⁴", "-10⁴ < nums[i], target < 10⁴", "All values are unique", "nums is sorted ascending"],
  examples: [
    { input: "nums = [-1, 0, 3, 5, 9, 12], target = 9", output: "4" },
    { input: "nums = [-1, 0, 3, 5, 9, 12], target = 2", output: "-1", explain: "2 would sit between 0 and 3, but it isn't there." },
  ],
  predict: [
    { input: "nums = [5], target = 5", output: "0", why: "lo = hi = 0; the loop runs once with `<=`. With `<` it would never check it." },
    { input: "nums = [2, 5], target = 2", output: "0", why: "mid = 0 on the first step." },
    { input: "nums = [1, 3, 5, 7, 9, 11, 13, 15], target = 15", output: "7", why: "Worst-ish case: mids are 3, 5, 6, 7 — four checks for eight elements (log₂ 8 + 1)." },
  ],
  edgeCases: ["Single element", "Target at index 0 or n−1", "Target smaller than all / larger than all", "Even vs odd length"],
  hints: [
    "The array is sorted. If you look at the middle element and it's too small, what do you know about everything to its left?",
    "Keep two indexes, `lo` and `hi`, around the part that could still hold the target. Each step, check `mid` and move one boundary past it.",
    "Use `while (lo <= hi)` with `hi = n - 1` (inclusive range), and move to `mid + 1` / `mid - 1` so the range always shrinks. `mid = lo + Math.floor((hi - lo) / 2)`.",
  ],
  approaches: [
    {
      name: "Linear scan",
      idea: "Check every element. Correct, ignores the sortedness, fails the O(log n) requirement.",
      complexity: { time: "O(n)", space: "O(1)", why: "Up to n comparisons." },
      code: `function search(nums: number[], target: number): number {
  for (let i = 0; i < nums.length; i++) if (nums[i] === target) return i;
  return -1;
}`,
    },
    {
      name: "Iterative binary search",
      idea: "Keep an inclusive window [lo, hi]. Compare the middle: equal → found; too small → the target can only be right of mid; too big → only left of mid. The window halves each step, and an empty window means not found.",
      complexity: { time: "O(log n)", space: "O(1)", why: "The window halves every iteration, so at most ⌊log₂ n⌋ + 1 iterations. Three index variables." },
      code: `function search(nums: number[], target: number): number {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    },
  ],
  complexityTalk: `**Why O(log n):** each comparison discards half of what's left. After k steps, n / 2ᵏ elements remain; that hits 1 when k = log₂ n. So 10⁴ elements need at most 14 checks, a million need 20, a billion 30. Doubling the input adds **one** step — that's the line to say.

**Space:** iterative is O(1). The recursive version is **O(log n)** because of the call stack — a common trap question.

**Why it matters in real systems:** database B-tree indexes, \`git bisect\`, finding a version where a bug appeared, and "binary search on the answer" (minimum capacity, square root) all use the same halving idea.

**Lower bound:** in a comparison model you can't beat log n for search on sorted data — each comparison gives one bit of information, and you need log₂ n bits to identify one of n positions.`,
  interview: {
    script: `"Since the array is sorted, I can discard half of it with one comparison. I keep an inclusive window lo to hi. Each step I check the middle — I compute it as lo plus half the distance, which avoids overflow in fixed-width languages. If it's the target, return it. If it's smaller, the target can only be to the right, so lo becomes mid plus 1; otherwise hi becomes mid minus 1. The loop runs while lo is at most hi, so a single-element window is still checked. The window halves every step, so it's O(log n) time — about 14 steps for 10⁴ elements — and O(1) space since it's iterative. A recursive version would use O(log n) stack."`,
    keywords: [
      { term: "Search space / invariant", meaning: "\"If the target exists, it's inside [lo, hi]\" — true before and after every step." },
      { term: "Halving", meaning: "The reason for O(log n)." },
      { term: "lo + (hi − lo) / 2", meaning: "Overflow-safe midpoint (Java's famous 2006 bug)." },
      { term: "Inclusive vs half-open bounds", meaning: "`hi = n − 1` with `<=`, or `hi = n` with `<` — be consistent." },
      { term: "Monotonic predicate", meaning: "Binary search works on anything that flips false → true once, not just arrays." },
    ],
    bonus: [
      "State the loop invariant out loud.",
      "Explain the overflow-safe midpoint (the bug sat in Java's library for about nine years).",
      "Mention lower-bound / upper-bound variants for first/last occurrence.",
      "Mention \"binary search on the answer\" as the generalisation.",
    ],
    mistakes: [
      "`while (lo < hi)` with an inclusive hi — misses the last element",
      "`lo = mid` / `hi = mid` with `<=` — infinite loop when lo === hi",
      "`(lo + hi) / 2` without Math.floor in JS — fractional index",
      "Forgetting it requires sorted input",
    ],
    followUps: [
      { q: "Return the first occurrence when duplicates exist?", a: "When nums[mid] === target, record mid and keep searching left (hi = mid − 1). That's the lower-bound variant; still O(log n)." },
      { q: "Where would the target be inserted?", a: "Return lo after the loop ends: it's the first index whose value is ≥ target (Search Insert Position)." },
      { q: "What if the array is rotated?", a: "At each mid, one half is still sorted. Check if the target is inside the sorted half's range; if so go there, otherwise go to the other half. O(log n)." },
      { q: "Recursive vs iterative?", a: "Same time. Recursive uses O(log n) stack; iterative O(1). Prefer iterative." },
    ],
  },
  starter: `function search(nums: number[], target: number): number {

}`,
  tests: [
    { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
    { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
    { args: [[5], 5], expected: 0, label: "Single element" },
    { args: [[2, 5], 2], expected: 0 },
    { args: [[1, 3, 5, 7, 9, 11, 13, 15], 15], expected: 7, label: "Last index" },
    { args: [[1, 3, 5, 7], 0], expected: -1, label: "Smaller than all" },
  ],
};

export default note;
