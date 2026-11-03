import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "palindrome-number",
  pattern: "Digit manipulation (% 10, / 10)",
  topics: ["Math"],
  companies: ["Amazon", "Microsoft", "Apple", "Adobe", "Bloomberg", "Google"],
  gist: "Can you take a number apart digit by digit with % and /, without converting it to a string?",
  statement: `Given an integer \`x\`, return \`true\` if it reads the same forwards and backwards, otherwise \`false\`.

**Follow-up:** solve it without converting the integer to a string.`,
  constraints: ["-2³¹ ≤ x ≤ 2³¹ − 1"],
  examples: [
    { input: "x = 121", output: "true" },
    { input: "x = -121", output: "false", explain: "Read backwards it's \"121-\". A minus sign only at the front means negatives are never palindromes." },
  ],
  predict: [
    { input: "x = 10", output: "false", why: "Backwards it's \"01\". Any number ending in 0 (except 0 itself) can't be a palindrome." },
    { input: "x = 0", output: "true", why: "A single digit always reads the same." },
    { input: "x = 1221", output: "true", why: "Even number of digits: the halves 12 and 21-reversed match." },
  ],
  edgeCases: ["Negative numbers → false", "Ends in 0 but isn't 0 → false", "Single digit → true", "Even vs odd digit count"],
  hints: [
    "`x % 10` gives the last digit. `Math.floor(x / 10)` removes it. How do you build the reversed number from those?",
    "Reversing the whole number can overflow in languages with 32-bit ints. Do you need the whole thing reversed?",
    "Reverse only the back half: keep moving digits from `x` to `rev` while `x > rev`. Then compare `x === rev` (even length) or `x === Math.floor(rev / 10)` (odd length — drop the middle digit).",
  ],
  approaches: [
    {
      name: "String reverse",
      idea: "Convert to a string, reverse it, compare. Correct and readable, but the interviewer explicitly asks to avoid it.",
      complexity: { time: "O(d)", space: "O(d)", why: "d = number of digits ≈ log₁₀ x. The string and its reverse each hold d characters." },
      code: `function isPalindrome(x: number): boolean {
  const s = String(x);
  return s === s.split("").reverse().join("");
}`,
    },
    {
      name: "Reverse half the number",
      idea: "Reject negatives and numbers ending in 0. Then peel digits off the end of x onto rev until rev catches up with x. At that point you've reversed exactly half; compare the halves.",
      complexity: { time: "O(log₁₀ x)", space: "O(1)", why: "Each step removes one digit, and x has log₁₀ x digits; only half are processed. Two number variables." },
      code: `function isPalindrome(x: number): boolean {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  let rev = 0;
  while (x > rev) {
    rev = rev * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  // Odd length: the middle digit ended up in rev, so drop it.
  return x === rev || x === Math.floor(rev / 10);
}`,
    },
  ],
  complexityTalk: `This is the classic place to say **"O(log n), where log is base 10, because the loop runs once per digit"**. A 10-digit number takes 10 iterations (actually 5, since only half is reversed). Many candidates say O(n) here — that's wrong unless you define n as the digit count, so define it.

Reversing only half also avoids **overflow**: in Java/C++, reversing 2,147,483,647 overflows a 32-bit int. JavaScript numbers are 64-bit floats so it won't overflow here, but mentioning why the half-reverse exists shows you know the original constraint.`,
  interview: {
    script: `"First the quick rejects: negatives are never palindromes because of the minus sign, and anything ending in 0 except 0 itself can't be, since it would have to start with 0. Then I reverse only the second half: take the last digit with mod 10, append it to rev, drop it from x with integer division, and stop when rev is no longer smaller than x. For even length, x equals rev; for odd length, rev has the middle digit, so I compare with rev divided by 10. It runs once per digit — O(log₁₀ n) — with O(1) space, and reversing half avoids the overflow you'd get reversing the full number in a 32-bit language."`,
    keywords: [
      { term: "% 10 and / 10", meaning: "Extract and remove the last digit." },
      { term: "O(log₁₀ n) = number of digits", meaning: "The right way to state the complexity." },
      { term: "Overflow", meaning: "Why only half is reversed." },
      { term: "Early return / guard clause", meaning: "Negatives and trailing zeros rejected before the loop." },
    ],
    bonus: ["Explain the trailing-zero guard (it's required for the half-reverse to terminate correctly).", "Mention 32-bit overflow even though JS doesn't have it."],
    mistakes: ["Forgetting `Math.floor` (JS `/` is float division)", "Missing the odd-length `rev / 10` case", "Missing the trailing-zero guard: x = 10 would wrongly return true"],
    followUps: [
      { q: "Why does x = 10 break without the trailing-zero check?", a: "The loop moves the 0 then the 1 into rev, ending with x = 0 and rev = 1. Then x === Math.floor(rev / 10) is 0 === 0, so it wrongly returns true. A trailing zero can never be a leading digit, so the guard rejects it up front." },
      { q: "Valid palindrome for a string with punctuation?", a: "Two pointers from both ends, skipping non-alphanumeric characters, comparing lowercase. O(n) time, O(1) space." },
    ],
  },
  starter: `function isPalindrome(x: number): boolean {

}`,
  tests: [
    { args: [121], expected: true },
    { args: [-121], expected: false },
    { args: [10], expected: false },
    { args: [0], expected: true },
    { args: [1221], expected: true },
    { args: [12321], expected: true },
    { args: [123], expected: false },
  ],
};

export default note;
