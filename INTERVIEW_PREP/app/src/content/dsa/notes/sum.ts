import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "sum",
  pattern: "Accumulator (reduce)",
  topics: ["JavaScript", "Rest parameters", "Array.reduce"],
  companies: [],
  gist: "Can you write a function whose number of arguments isn't fixed, and fold them into one value?",
  statement: `Write a function \`sum\` that accepts **any number of numeric arguments** and returns their total.

- \`sum()\` with no arguments returns \`0\`.
- Negative numbers and decimals must work.
- Don't use \`eval\` or the \`Function\` constructor.`,
  constraints: ["0 ≤ number of arguments ≤ 10⁵", "Every argument is a finite number"],
  examples: [
    { input: "sum(1, 2, 3)", output: "6" },
    { input: "sum()", output: "0", explain: "An empty total is the starting value, 0." },
  ],
  predict: [
    { input: "sum(10)", output: "10", why: "One argument: the total is just that number." },
    { input: "sum(5, -5, 10, 20)", output: "30", why: "Negatives cancel normally: 5 − 5 + 10 + 20." },
    { input: "sum(0.1, 0.2)", output: "0.30000000000000004", why: "Floating point: 0.1 and 0.2 have no exact binary form. Mention it; don't try to \"fix\" it unless asked." },
  ],
  edgeCases: ["No arguments → 0 (the reduce initial value handles it)", "A single argument", "Decimals (floating-point error is expected)"],
  hints: [
    "The function doesn't know how many arguments it gets. Which JavaScript syntax collects them all into one array?",
    "`function sum(...nums)` gives you a real array. Now it's \"add up an array\".",
    "`reduce` with an initial value of `0`. Without the initial value, `sum()` throws on an empty array.",
  ],
  approaches: [
    {
      name: "The `arguments` object",
      idea: "Every non-arrow function has an array-like `arguments`. Loop over it with an index. It works, but it isn't a real array (no `reduce`) and arrow functions don't have it.",
      complexity: { time: "O(n)", space: "O(1)", why: "One pass over the n arguments, one running total." },
      code: `function sum(): number {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) total += arguments[i];
  return total;
}`,
    },
    {
      name: "Rest parameters + reduce",
      idea: "`...nums` collects every argument into a real array. `reduce` folds it into one number, starting at 0, which is what makes `sum()` return 0.",
      complexity: { time: "O(n)", space: "O(n)", why: "Each argument is added once. The rest parameter builds an array of the n arguments; the fold itself uses O(1)." },
      code: `function sum(...nums: number[]): number {
  return nums.reduce((total, n) => total + n, 0);
}`,
    },
  ],
  complexityTalk: `There's nothing to optimise: every number has to be read, so **Ω(n)** is the lower bound and O(n) is optimal. The interesting part is space: the rest parameter allocates an array of n arguments, so strictly it's O(n). Saying that, instead of "O(1)", shows you count allocations you didn't write explicitly.

Very large argument lists (\`sum(...hugeArray)\`) can hit the engine's argument limit and throw \`RangeError\`. For that case, accept an array parameter instead.`,
  interview: {
    script: `"I don't know the argument count, so I'll use a rest parameter, which gives me a real array. Then I reduce it with an initial value of 0. The 0 matters: it's the answer for no arguments, and without it reduce throws on an empty array. It's O(n) time, one pass. Space is O(n) for the rest array itself, O(1) beyond that. If callers might pass hundreds of thousands of numbers via spread, I'd take an array instead, because spreading that many arguments can exceed the engine's limit."`,
    keywords: [
      { term: "Rest parameters", meaning: "`...nums` collects remaining arguments into a real Array." },
      { term: "Initial value / identity element", meaning: "0 is the identity for addition; it makes the empty case correct." },
      { term: "`arguments` is array-like", meaning: "Has length and indexes but no array methods; absent in arrow functions." },
    ],
    bonus: [
      "Explain why `reduce` without an initial value throws `TypeError` on an empty array.",
      "Mention floating-point (0.1 + 0.2) without being asked.",
      "Mention the max-arguments limit for spread calls.",
    ],
    mistakes: ["Forgetting the 0 initial value", "Using an arrow function with `arguments`", "Using `eval(nums.join('+'))`"],
    followUps: [
      { q: "Make it curried: sum(1)(2)(3)() → 6.", a: "Return a function that keeps a running total and returns the total when called with no argument: `const sum = (a) => (b) => b === undefined ? a : sum(a + b);`." },
      { q: "Ignore non-number arguments.", a: "Filter first: `nums.filter(Number.isFinite).reduce(...)`." },
    ],
  },
  starter: `function sum(...nums: number[]): number {

}`,
  tests: [
    { args: [1, 2, 3], expected: 6 },
    { args: [10], expected: 10 },
    { args: [], expected: 0, label: "No arguments" },
    { args: [5, -5, 10, 20], expected: 30 },
    { args: [100, 200, 300, 400], expected: 1000 },
  ],
};

export default note;
