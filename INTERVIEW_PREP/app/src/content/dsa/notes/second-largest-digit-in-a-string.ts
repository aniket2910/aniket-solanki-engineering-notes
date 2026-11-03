import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "second-largest-digit-in-a-string",
  pattern: "Track top-2 in one pass",
  topics: ["String", "Hash Set", "Running max"],
  companies: [],
  gist: "Can you keep the best and second-best values in one pass, and handle duplicates correctly?",
  statement: `Given an alphanumeric string \`s\`, return the **second largest distinct digit** that appears in it, or \`-1\` if there isn't one.

An alphanumeric string has lowercase English letters and digits.`,
  constraints: ["1 ≤ s.length ≤ 500", "s contains only lowercase letters and digits"],
  examples: [
    { input: 's = "dfa12321afd"', output: "2", explain: "Digits are 1, 2, 3. The largest is 3, the second largest is 2." },
    { input: 's = "abc1111"', output: "-1", explain: "Only one distinct digit (1), so there's no second largest." },
  ],
  predict: [
    { input: 's = "ck077"', output: "0", why: "Distinct digits are 0 and 7. Second largest is 0 — and 0 is a valid answer, not \"missing\"." },
    { input: 's = "abc"', output: "-1", why: "No digits at all." },
    { input: 's = "9a9a8"', output: "8", why: "Duplicates of 9 don't count twice; the next distinct digit is 8." },
  ],
  edgeCases: ["No digits → -1", "One distinct digit repeated → -1", "0 as the answer (don't use 0 as \"not found\")"],
  hints: [
    "Only 10 possible digits exist. Does that make any extra structure O(1)?",
    "Keep two variables: `first` and `second`, both starting at -1. What do you do when a digit beats `first`?",
    "When `d > first`: second = first, first = d. When `first > d > second`: second = d. Equal to `first`? Skip it — that's the duplicate trap.",
  ],
  approaches: [
    {
      name: "Collect distinct digits, sort",
      idea: "Put every digit in a Set, turn it into an array, sort descending, return index 1 or -1.",
      complexity: { time: "O(n)", space: "O(1)", why: "Scan is O(n). The set holds at most 10 digits, so sorting it is O(10 log 10) = O(1)." },
      code: `function secondHighest(s: string): number {
  const digits = new Set<number>();
  for (const c of s) if (c >= "0" && c <= "9") digits.add(Number(c));
  const sorted = [...digits].sort((a, b) => b - a);
  return sorted.length > 1 ? sorted[1] : -1;
}`,
    },
    {
      name: "One pass, two variables",
      idea: "Track the largest and second-largest distinct digit seen so far. A new maximum pushes the old one down to second; a value strictly between them becomes the new second.",
      complexity: { time: "O(n)", space: "O(1)", why: "Each character is checked once; two integer variables." },
      code: `function secondHighest(s: string): number {
  let first = -1;
  let second = -1;
  for (const c of s) {
    if (c < "0" || c > "9") continue;
    const d = c.charCodeAt(0) - 48;
    if (d > first) {
      second = first;
      first = d;
    } else if (d < first && d > second) {
      second = d;
    }
  }
  return second;
}`,
    },
  ],
  complexityTalk: `Both approaches are O(n), and the Set is O(1) space because the **alphabet bounds it**: at most 10 digits, however long the string. Saying "O(1) because there are only 10 digits" is exactly the kind of reasoning interviewers look for.

The two-variable version matters for the general follow-up — "second largest in an array of n numbers" — where sorting would be O(n log n) and the one-pass top-2 is still O(n).`,
  interview: {
    script: `"I only care about digits, and there are only ten, so I'll scan once and keep the largest and second-largest distinct digit, both starting at -1. If a digit is bigger than the largest, the old largest becomes second. If it's strictly between them, it becomes the new second. Equal to the largest, I skip it, because the answer has to be distinct. That's O(n) time and O(1) space. Starting at -1 also gives the right answer when there's no second digit."`,
    keywords: [
      { term: "Distinct", meaning: "Duplicates of the max don't count as second; the core trap." },
      { term: "Bounded alphabet", meaning: "Why a Set of digits is O(1) space." },
      { term: "Top-k in one pass", meaning: "Generalises to a heap of size k for top-k." },
    ],
    bonus: ["Generalise: for top-k use a min-heap of size k, O(n log k).", "Point out that 0 is a valid answer, so the sentinel must be -1."],
    mistakes: ["Updating `second` when d equals `first`", "Sorting the whole string", "Using 0 as the \"not found\" value"],
    followUps: [
      { q: "Second largest number in an integer array (with negatives)?", a: "Same two-variable scan, but start both at -Infinity and return -1 (or null) if second is still -Infinity." },
      { q: "k-th largest distinct value?", a: "Keep a Set for distinctness and a min-heap of size k: O(n log k)." },
    ],
  },
  starter: `function secondHighest(s: string): number {

}`,
  tests: [
    { args: ["dfa12321afd"], expected: 2 },
    { args: ["abc1111"], expected: -1 },
    { args: ["ck077"], expected: 0 },
    { args: ["abc"], expected: -1 },
    { args: ["9a9a8"], expected: 8 },
  ],
};

export default note;
