import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "single-number",
  pattern: "XOR cancellation",
  topics: ["Array", "Bit Manipulation", "Hash Table"],
  companies: ["Amazon", "Google", "Microsoft", "Apple", "Meta", "Adobe"],
  gist: "Every number appears twice except one. XOR makes pairs vanish, so XOR-ing everything leaves the single one.",
  statement: `Given a non-empty integer array \`nums\` where every element appears **twice** except one, find that single element.

You must use **linear time** and **constant extra space**.`,
  constraints: ["1 ≤ nums.length ≤ 3 × 10⁴", "-3 × 10⁴ ≤ nums[i] ≤ 3 × 10⁴", "Every element appears twice except one, which appears once"],
  examples: [
    { input: "nums = [2, 2, 1]", output: "1" },
    { input: "nums = [4, 1, 2, 1, 2]", output: "4", explain: "Pairs don't need to be next to each other." },
  ],
  predict: [
    { input: "nums = [1]", output: "1", why: "Only element; 0 ^ 1 = 1." },
    { input: "nums = [-1, 5, -1]", output: "5", why: "XOR works on negative numbers too (on their 32-bit two's-complement form)." },
    { input: "nums = [0, 7, 7]", output: "0", why: "The single number can be 0; the XOR of the pairs is 0." },
  ],
  edgeCases: ["Single element", "Negative numbers", "The single number is 0", "Pairs scattered, not adjacent"],
  hints: [
    "A hash map of counts works in O(n) time. Why doesn't it meet the space requirement?",
    "Which operation turns a number combined with itself into 0, and doesn't care about order?",
    "XOR: `a ^ a = 0`, `a ^ 0 = a`, and it's commutative and associative. XOR all elements together.",
  ],
  approaches: [
    {
      name: "Count with a Map",
      idea: "Count occurrences, return the key with count 1. Linear time but O(n) extra space, which the problem forbids.",
      complexity: { time: "O(n)", space: "O(n)", why: "The map holds about n/2 keys." },
      code: `function singleNumber(nums: number[]): number {
  const count = new Map<number, number>();
  for (const x of nums) count.set(x, (count.get(x) ?? 0) + 1);
  for (const [x, c] of count) if (c === 1) return x;
  return -1;
}`,
    },
    {
      name: "XOR everything",
      idea: "XOR is order-independent and cancels equal values. XOR of the whole array = (pairs cancel to 0) ^ single = single.",
      complexity: { time: "O(n)", space: "O(1)", why: "One pass, one accumulator." },
      code: `function singleNumber(nums: number[]): number {
  let result = 0;
  for (const x of nums) result ^= x;
  return result;
}`,
    },
  ],
  complexityTalk: `The constraint "linear time **and** constant space" rules out both obvious answers: a hash map (O(n) space) and sorting (O(n log n) time). That's a strong hint that the solution uses a **property of the data** rather than a data structure — here, that everything comes in pairs, and XOR cancels pairs.

Why it works, bit by bit: for each bit position, XOR is 1 when that bit is set in an **odd** number of values. Every paired value contributes its bits an even number of times, so only the single value's bits survive.`,
  interview: {
    script: `"A hash map of counts would be O(n) time but O(n) space, and sorting is O(n log n), so neither meets the constraints. XOR does: x XOR x is 0, x XOR 0 is x, and XOR is commutative and associative, so the order doesn't matter. If I XOR every element together, each pair cancels to 0 and only the single number remains. One pass, O(n) time, O(1) space. Bit by bit, it works because each bit of the result is the parity of that bit across all the numbers, and pairs always contribute even parity."`,
    keywords: [
      { term: "XOR identities", meaning: "a ^ a = 0, a ^ 0 = a." },
      { term: "Commutative & associative", meaning: "Why pairs cancel even when not adjacent." },
      { term: "Bit parity", meaning: "Each result bit = odd/even count of that bit." },
    ],
    bonus: ["Explain the per-bit parity argument.", "Mention that JS bitwise ops use 32-bit ints (fine for this range).", "Mention the \"every element appears three times\" variant."],
    mistakes: ["Sorting and comparing neighbours (violates O(n))", "Using a Set and summing (2·sum(set) − sum(nums) works but uses O(n) space)", "Starting the accumulator at something other than 0"],
    followUps: [
      { q: "Every element appears three times except one (Single Number II)?", a: "Count each of the 32 bit positions modulo 3; the bits with remainder 1 form the answer. O(32n), O(1)." },
      { q: "Two numbers appear once, the rest twice (Single Number III)?", a: "XOR all to get a ^ b. Pick any set bit (x & −x) to split the numbers into two groups, XOR each group." },
      { q: "Does XOR work for negatives in JS?", a: "Yes: values are converted to 32-bit two's complement, and pairs still cancel." },
    ],
  },
  starter: `function singleNumber(nums: number[]): number {

}`,
  tests: [
    { args: [[2, 2, 1]], expected: 1 },
    { args: [[4, 1, 2, 1, 2]], expected: 4 },
    { args: [[1]], expected: 1, label: "Single element" },
    { args: [[-1, 5, -1]], expected: 5, label: "Negatives" },
    { args: [[0, 7, 7]], expected: 0 },
  ],
};

export default note;
