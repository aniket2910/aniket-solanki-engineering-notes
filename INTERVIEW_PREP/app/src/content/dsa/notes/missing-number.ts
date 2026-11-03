import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "missing-number",
  pattern: "Math (expected sum) / XOR",
  topics: ["Array", "Math", "Bit Manipulation", "Hash Table"],
  companies: ["Amazon", "Microsoft", "Meta", "Apple", "Google", "Bloomberg"],
  gist: "You know exactly which numbers should be there. Compare what should be with what is — in O(1) space.",
  statement: `Given an array \`nums\` of \`n\` **distinct** numbers taken from the range \`[0, n]\`, return the one number in that range that is missing.

**Follow-up:** O(n) time and O(1) extra space.`,
  constraints: ["n == nums.length", "1 ≤ n ≤ 10⁴", "0 ≤ nums[i] ≤ n", "All numbers are unique"],
  examples: [
    { input: "nums = [3, 0, 1]", output: "2", explain: "n = 3, so the range is 0..3; 2 is missing." },
    { input: "nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]", output: "8" },
  ],
  predict: [
    { input: "nums = [0, 1]", output: "2", why: "n = 2, range 0..2. The missing number can be n itself." },
    { input: "nums = [1]", output: "0", why: "n = 1, range 0..1. The missing number can be 0." },
    { input: "nums = [0]", output: "1", why: "n = 1, range 0..1; 1 is missing." },
  ],
  edgeCases: ["Missing number is 0", "Missing number is n (the top of the range)", "Single element"],
  hints: [
    "The range is 0..n, with n = nums.length. What would the numbers add up to if none were missing?",
    "Gauss: 0 + 1 + … + n = n(n+1)/2. Subtract the actual sum.",
    "Overflow-proof alternative: XOR every index 0..n with every value. Every present number appears twice and cancels (a ^ a = 0); the missing one is left.",
  ],
  approaches: [
    {
      name: "Set lookup",
      idea: "Put all values in a Set, then check 0..n for the first one that isn't there.",
      complexity: { time: "O(n)", space: "O(n)", why: "Build the Set in O(n), n+1 O(1) lookups; the Set holds n values." },
      code: `function missingNumber(nums: number[]): number {
  const seen = new Set(nums);
  for (let i = 0; i <= nums.length; i++) if (!seen.has(i)) return i;
  return -1;
}`,
    },
    {
      name: "Sort and scan",
      idea: "After sorting, index i should hold i. The first index where it doesn't is the answer; if all match, it's n.",
      complexity: { time: "O(n log n)", space: "O(1)–O(n)", why: "The sort dominates." },
      code: `function missingNumber(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) if (sorted[i] !== i) return i;
  return sorted.length;
}`,
    },
    {
      name: "Expected sum minus actual sum",
      idea: "The full range 0..n sums to n(n+1)/2. Subtract the sum of the array; the difference is exactly the missing number.",
      complexity: { time: "O(n)", space: "O(1)", why: "One pass to sum; one formula." },
      code: `function missingNumber(nums: number[]): number {
  const n = nums.length;
  let sum = 0;
  for (const x of nums) sum += x;
  return (n * (n + 1)) / 2 - sum;
}`,
    },
  ],
  complexityTalk: `Three answers show three trade-offs: **Set** (O(n) time, O(n) space), **sort** (O(n log n), little space), **math** (O(n), O(1)). Walking through them in that order is a strong interview answer by itself.

The sum formula is the cleanest in JavaScript (numbers are 64-bit floats, exact up to 2⁵³). In Java/C++ with 32-bit ints, n(n+1)/2 can **overflow** for large n — that's when you mention the **XOR** version: \`res = n; for i: res ^= i ^ nums[i]\`. XOR never overflows, and every present value cancels with its index.`,
  interview: {
    script: `"The range is 0 to n and exactly one is missing, so I know what the total should be: n times n plus 1 over 2. I sum the array in one pass and return the difference. That's O(n) time and O(1) space, versus O(n) space for a Set or O(n log n) for sorting. In a language with 32-bit integers the formula can overflow, and then I'd use XOR instead: XOR all indices 0 to n with all values; each present number appears twice and cancels, leaving the missing one."`,
    keywords: [
      { term: "Gauss sum n(n+1)/2", meaning: "The expected total of 0..n." },
      { term: "XOR cancels pairs", meaning: "a ^ a = 0, a ^ 0 = a; order doesn't matter." },
      { term: "Overflow", meaning: "Why XOR is the safer constant-space answer in fixed-width languages." },
      { term: "Trade-off ladder", meaning: "Set → sort → math: space vs time." },
    ],
    bonus: ["Give all three approaches with their trade-offs.", "Mention overflow and the XOR fix.", "Mention cyclic sort (place each value at its index) as another O(1)-space technique that generalises to \"find all missing\"."],
    mistakes: ["Using n − 1 instead of n (the range is 0..n inclusive)", "Forgetting the missing number can be n", "Sorting the input in place when it shouldn't be modified"],
    followUps: [
      { q: "Show the XOR version.", a: "`let res = nums.length; for (let i = 0; i < nums.length; i++) res ^= i ^ nums[i]; return res;`" },
      { q: "Find all missing numbers in 1..n with duplicates (LeetCode 448)?", a: "Mark presence by negating nums[|x| − 1]; indices still positive are missing. O(n), O(1) extra." },
      { q: "Two numbers missing?", a: "Sum and sum of squares give two equations; or XOR gives a ^ b, then split by any set bit." },
    ],
  },
  starter: `function missingNumber(nums: number[]): number {

}`,
  tests: [
    { args: [[3, 0, 1]], expected: 2 },
    { args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8 },
    { args: [[0, 1]], expected: 2, label: "Missing n" },
    { args: [[1]], expected: 0, label: "Missing 0" },
    { args: [[0]], expected: 1 },
  ],
};

export default note;
