import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "reverse-integer",
  pattern: "Digit manipulation + overflow guard",
  topics: ["Math"],
  companies: ["Amazon", "Apple", "Bloomberg", "Microsoft", "Adobe", "Google"],
  gist: "Reversing digits is easy. The real test is detecting 32-bit overflow before it happens.",
  statement: `Given a signed 32-bit integer \`x\`, return \`x\` with its digits reversed. If reversing makes the value go outside the 32-bit signed range **[-2³¹, 2³¹ − 1]**, return \`0\`.

Assume the environment can't store 64-bit integers.`,
  constraints: ["-2³¹ ≤ x ≤ 2³¹ − 1"],
  examples: [
    { input: "x = 123", output: "321" },
    { input: "x = -123", output: "-321", explain: "The sign stays in front." },
    { input: "x = 120", output: "21", explain: "Leading zeros disappear." },
  ],
  predict: [
    { input: "x = 1534236469", output: "0", why: "Reversed is 9,646,324,351, bigger than 2,147,483,647, so it overflows." },
    { input: "x = 0", output: "0", why: "Nothing to reverse." },
    { input: "x = -2147483648", output: "0", why: "Reversed magnitude 8,463,847,412 overflows." },
  ],
  edgeCases: ["Negative input keeps its sign", "Trailing zeros vanish", "Overflow → 0", "0"],
  hints: [
    "Same digit loop as Palindrome Number: `x % 10` for the last digit, `/ 10` to drop it.",
    "In JavaScript, `-123 % 10` is `-3`, and `Math.trunc` (not floor) moves toward zero. That handles the sign for free.",
    "Before `rev = rev * 10 + digit`, check: is `rev` already bigger than `MAX / 10`? Then multiplying by 10 overflows. Check the low side with `MIN / 10` too.",
  ],
  approaches: [
    {
      name: "String reverse + range check",
      idea: "Reverse the absolute value as a string, reapply the sign, and return 0 if it's outside the range. Works in JS (64-bit floats), but breaks the \"no 64-bit\" rule because the overflowed value is computed first.",
      complexity: { time: "O(log₁₀ |x|)", space: "O(log₁₀ |x|)", why: "One character per digit." },
      code: `function reverse(x: number): number {
  const r = Number(String(Math.abs(x)).split("").reverse().join("")) * Math.sign(x);
  return r < -(2 ** 31) || r > 2 ** 31 - 1 ? 0 : r;
}`,
    },
    {
      name: "Pop and push digits with an overflow check",
      idea: "Pop the last digit with `% 10` and push it onto `rev`. Before each push, check whether `rev * 10` would leave the 32-bit range; if so, return 0. `Math.trunc` keeps negatives working without special-casing the sign.",
      complexity: { time: "O(log₁₀ |x|)", space: "O(1)", why: "One iteration per digit (at most 10 for a 32-bit int); a few number variables." },
      code: `function reverse(x: number): number {
  const MAX = 2 ** 31 - 1;
  const MIN = -(2 ** 31);
  let rev = 0;
  while (x !== 0) {
    const digit = x % 10;            // keeps the sign: -123 % 10 = -3
    x = Math.trunc(x / 10);          // toward zero for negatives too
    if (rev > Math.trunc(MAX / 10) || (rev === Math.trunc(MAX / 10) && digit > 7)) return 0;
    if (rev < Math.trunc(MIN / 10) || (rev === Math.trunc(MIN / 10) && digit < -8)) return 0;
    rev = rev * 10 + digit;
  }
  return rev;
}`,
    },
  ],
  complexityTalk: `It's O(number of digits) = O(log₁₀ |x|). For a 32-bit input that's at most 10 iterations, so you can also call it O(1) — say both: "O(log n) in general, effectively constant because the input is capped at 10 digits."

The interviewer is really probing **overflow awareness**. The check \`rev > MAX / 10\` asks "will the next multiply overflow?" *before* doing it. 2³¹ − 1 = 2,147,483,647 ends in 7 and −2³¹ ends in 8; that's where the \`digit > 7\` and \`digit < -8\` come from.`,
  interview: {
    script: `"I'll pop digits from the end with mod 10 and push them onto rev with rev times 10 plus digit. In JavaScript, mod keeps the sign and Math.trunc rounds toward zero, so negatives work without extra code. The catch is overflow: I can't compute rev times 10 and check afterwards, because the problem says I can't hold 64-bit values. So before each push I check whether rev is already above MAX over 10, or equal to it with a last digit over 7 — and the mirrored check for MIN. If so, return 0. That's one iteration per digit, O(log n), at most 10 for a 32-bit int, with O(1) space."`,
    keywords: [
      { term: "Check before you multiply", meaning: "Detect overflow without ever storing the overflowed value." },
      { term: "INT_MAX / 10", meaning: "214,748,364 — the largest rev that can safely be multiplied by 10." },
      { term: "Truncation toward zero", meaning: "`Math.trunc`, not `Math.floor`, for negative numbers." },
    ],
    bonus: ["Explain where 7 and 8 come from (last digits of 2³¹−1 and −2³¹).", "Note that JS numbers are 64-bit floats, so a naive check \"works\" in JS but isn't the intended answer."],
    mistakes: ["Using Math.floor for negatives (−12 / 10 → −2)", "Checking the range after computing the overflowed value", "Converting to string and forgetting the sign"],
    followUps: [
      { q: "Why can't you just check the result at the end?", a: "In a 32-bit language the overflow already wrapped around (undefined behaviour in C), so the final value is garbage. You have to detect it before the multiply." },
      { q: "String to Integer (atoi)?", a: "Same overflow check, applied while building the number from characters, plus whitespace and sign handling." },
    ],
  },
  starter: `function reverse(x: number): number {

}`,
  tests: [
    { args: [123], expected: 321 },
    { args: [-123], expected: -321 },
    { args: [120], expected: 21 },
    { args: [0], expected: 0 },
    { args: [1534236469], expected: 0, label: "Overflow" },
    { args: [-2147483648], expected: 0, label: "INT_MIN" },
    { args: [1463847412], expected: 2147483641 },
  ],
};

export default note;
