import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "power-of-two",
  pattern: "Bit manipulation (n & (n − 1))",
  topics: ["Math", "Bit Manipulation", "Recursion"],
  companies: ["Amazon", "Apple", "Google", "Microsoft"],
  gist: "A power of two has exactly one 1-bit. Know the O(1) bit trick and why it works.",
  statement: `Given an integer \`n\`, return \`true\` if it is a power of two, otherwise \`false\`.

\`n\` is a power of two if there's an integer \`x\` with \`n == 2ˣ\`.

**Follow-up:** can you solve it without loops or recursion?`,
  constraints: ["-2³¹ ≤ n ≤ 2³¹ − 1"],
  examples: [
    { input: "n = 1", output: "true", explain: "2⁰ = 1." },
    { input: "n = 16", output: "true", explain: "2⁴ = 16." },
    { input: "n = 3", output: "false" },
  ],
  predict: [
    { input: "n = 0", output: "false", why: "No power of two is 0. And 0 & −1 is 0, so the bit trick alone would wrongly say true — hence `n > 0`." },
    { input: "n = -16", output: "false", why: "Powers of two are positive." },
    { input: "n = 1073741824", output: "true", why: "2³⁰, the largest power of two that fits in a positive 32-bit int." },
  ],
  edgeCases: ["n = 0", "Negative n", "n = 1 (2⁰)", "The largest 32-bit power, 2³⁰"],
  hints: [
    "Write 1, 2, 4, 8, 16 in binary. What do they all have in common?",
    "A power of two has exactly one bit set. What does subtracting 1 do to that bit and everything below it?",
    "`n & (n - 1)` clears the lowest set bit. If that leaves 0, there was only one bit. Don't forget `n > 0`.",
  ],
  approaches: [
    {
      name: "Keep dividing by 2",
      idea: "While n is even, halve it. A power of two ends at exactly 1.",
      complexity: { time: "O(log n)", space: "O(1)", why: "n halves each iteration: at most 31 steps for a 32-bit int." },
      code: `function isPowerOfTwo(n: number): boolean {
  if (n <= 0) return false;
  while (n % 2 === 0) n /= 2;
  return n === 1;
}`,
    },
    {
      name: "Bit trick: n & (n − 1)",
      idea: "In binary, a power of two is a single 1 followed by zeros (8 = 1000). Subtracting 1 flips that 1 to 0 and all lower zeros to 1 (7 = 0111). ANDing them gives 0 only when there was a single 1-bit.",
      complexity: { time: "O(1)", space: "O(1)", why: "One subtraction and one AND, independent of n." },
      code: `function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}`,
    },
  ],
  complexityTalk: `The loop is O(log n) — the number of halvings — at most 31 for a 32-bit input. The bit trick is **O(1)**: a fixed number of CPU instructions regardless of n.

**Why it matters:** memory allocators, hash table sizes, ring buffers and GPU textures are often powers of two so that \`x % size\` can become the much cheaper \`x & (size − 1)\`. The same check is used to validate those sizes.

**JavaScript note:** bitwise operators convert numbers to **32-bit signed integers**. That's fine within this problem's constraints, but \`2 ** 40 & ...\` would give the wrong answer. Say so if asked about bigger inputs (use BigInt or the loop).`,
  interview: {
    script: `"A power of two in binary has exactly one 1-bit — 8 is 1000. Subtracting 1 turns that bit off and all the bits below it on, so 7 is 0111. ANDing n with n minus 1 is zero exactly when there was a single set bit. I also need n greater than zero, because 0 AND -1 is also zero, and negatives aren't powers of two. That's O(1) time and space. The loop that keeps dividing by two also works, at O(log n). One caveat: JavaScript bitwise ops work on 32-bit integers, which is fine for these constraints."`,
    keywords: [
      { term: "Exactly one set bit", meaning: "The binary definition of a power of two." },
      { term: "n & (n − 1) clears the lowest set bit", meaning: "Also used to count set bits (Kernighan's algorithm)." },
      { term: "32-bit conversion in JS", meaning: "Bitwise ops truncate to signed 32-bit." },
    ],
    bonus: [
      "Mention Brian Kernighan's bit count, which uses the same trick in a loop.",
      "Mention the no-loop math alternative: 2³⁰ % n === 0 for n > 0 (2³⁰ is the largest power in range, and its only divisors are powers of two).",
      "Explain why systems use power-of-two sizes (`x & (size − 1)` replaces modulo).",
    ],
    mistakes: ["Missing `n > 0` (0 returns true)", "Operator precedence: `n & n - 1 === 0` parses wrong — wrap in parentheses", "Using `Math.log2(n) % 1 === 0` (floating-point error for big n)"],
    followUps: [
      { q: "Power of four?", a: "Power of two AND the single bit is in an even position: `n > 0 && (n & (n - 1)) === 0 && (n & 0x55555555) !== 0`. Or `(n - 1) % 3 === 0`." },
      { q: "Count the set bits of n?", a: "Kernighan: while n, do n &= n − 1 and count. O(number of set bits)." },
      { q: "Power of three?", a: "No bit trick. Loop dividing by 3 (O(log n)), or `1162261467 % n === 0` (3¹⁹ is the largest power of 3 in 32 bits)." },
    ],
  },
  starter: `function isPowerOfTwo(n: number): boolean {

}`,
  tests: [
    { args: [1], expected: true },
    { args: [16], expected: true },
    { args: [3], expected: false },
    { args: [0], expected: false, label: "Zero" },
    { args: [-16], expected: false, label: "Negative" },
    { args: [1073741824], expected: true, label: "2³⁰" },
    { args: [6], expected: false },
  ],
};

export default note;
