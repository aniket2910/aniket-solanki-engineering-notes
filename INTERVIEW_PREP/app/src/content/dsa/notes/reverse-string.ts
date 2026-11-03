import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "reverse-string",
  pattern: "Two pointers from opposite ends",
  topics: ["Array", "Two Pointers", "String"],
  companies: ["Amazon", "Microsoft", "Apple", "Google", "Adobe"],
  gist: "Swap from both ends toward the middle — the simplest two-pointer problem, and the template for many harder ones.",
  statement: `Write a function that reverses a string. The input is an array of characters \`s\`.

Do it **in place** with O(1) extra memory. The function returns nothing; \`s\` itself must end up reversed.`,
  constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ASCII character"],
  examples: [
    { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
    { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
  ],
  predict: [
    { input: 's = ["a"]', output: '["a"]', why: "The pointers start equal; the loop never runs." },
    { input: 's = ["a","b"]', output: '["b","a"]', why: "One swap, then the pointers cross." },
    { input: 's = ["a","b","c"]', output: '["c","b","a"]', why: "Odd length: the middle element stays where it is." },
  ],
  edgeCases: ["Length 1", "Even vs odd length (middle element untouched)", "Must mutate, not return a new array"],
  hints: [
    "Which two characters end up swapping places with each other?",
    "Put `left` at 0 and `right` at the last index. What do you do with the pair, and how do the pointers move?",
    "Swap `s[left]` and `s[right]`, then `left++`, `right--`, while `left < right`. Destructuring swap: `[s[l], s[r]] = [s[r], s[l]]`.",
  ],
  approaches: [
    {
      name: "Built-in reverse",
      idea: "`s.reverse()` reverses in place and is O(n). Fine in production; in an interview it skips what's being tested, so mention it and then write the loop.",
      complexity: { time: "O(n)", space: "O(1)", why: "Array.prototype.reverse works in place." },
      code: `function reverseString(s: string[]): void {
  s.reverse();
}`,
    },
    {
      name: "Two pointers, swap toward the middle",
      idea: "Swap the outermost pair, then move both pointers inward. Stop when they meet or cross; every element has then been moved once.",
      complexity: { time: "O(n)", space: "O(1)", why: "n/2 swaps; two index variables." },
      code: `function reverseString(s: string[]): void {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    const tmp = s[left];
    s[left] = s[right];
    s[right] = tmp;
    left++;
    right--;
  }
}`,
    },
  ],
  complexityTalk: `n/2 swaps → O(n) time, O(1) space. A recursive version (swap the ends, recurse on the inside) is also O(n) time but uses **O(n) stack** — and with n = 10⁵, it would overflow JavaScript's call stack. Good example to mention when asked "recursive or iterative?"

The real value is the **pattern**: two pointers from opposite ends, each step shrinking the window by one from each side. Valid Palindrome, Two Sum II, 3Sum and Container With Most Water all start from this loop.`,
  interview: {
    script: `"The first and last characters swap, then the second and second-to-last, and so on. So I'll put one pointer at each end, swap the pair, and move both inward while left is less than right. When they meet or cross, every character has been swapped once; for odd lengths the middle stays put. That's n over 2 swaps, so O(n) time and O(1) extra space, all in place. A recursive version would be O(n) stack and would overflow for 10⁵ characters, so the loop is better."`,
    keywords: [
      { term: "Two pointers (opposite ends)", meaning: "The pattern." },
      { term: "In place", meaning: "Mutate the input; return nothing." },
      { term: "left < right", meaning: "The termination condition; handles odd and even lengths." },
    ],
    bonus: ["Mention the recursive version's O(n) stack and overflow risk.", "Note that JS strings are immutable, which is why the input is an array.", "Mention destructuring swap and that it allocates a temporary array (a plain temp variable is cheaper in hot loops)."],
    mistakes: ["`left <= right` (harmless self-swap, but shows imprecision)", "Returning a reversed copy instead of mutating", "Using `s.split` — s is already an array"],
    followUps: [
      { q: "Reverse the words in a sentence in place?", a: "Reverse the whole array, then reverse each word. Two passes, O(n), O(1)." },
      { q: "Reverse only the vowels?", a: "Same two pointers, but each pointer skips forward/backward until it's on a vowel before swapping." },
      { q: "Why can't you reverse a JS string in place?", a: "Strings are immutable. You'd build a new one: O(n) extra space." },
    ],
  },
  starter: `function reverseString(s: string[]): void {

}`,
  tests: [
    { args: [["h", "e", "l", "l", "o"]], expected: ["o", "l", "l", "e", "h"] },
    { args: [["H", "a", "n", "n", "a", "h"]], expected: ["h", "a", "n", "n", "a", "H"] },
    { args: [["a"]], expected: ["a"], label: "Single character" },
    { args: [["a", "b"]], expected: ["b", "a"] },
    { args: [["a", "b", "c"]], expected: ["c", "b", "a"], label: "Odd length" },
  ],
};

export default note;
