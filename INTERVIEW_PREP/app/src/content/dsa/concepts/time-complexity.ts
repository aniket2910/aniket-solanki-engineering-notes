import type { ConceptNote } from "../../types.ts";

const note: ConceptNote = {
  slug: "time-complexity",
  title: "Time complexity & Big-O",
  why: "Every DSA answer ends with \"what is the time complexity?\". This page is how to get it right and explain it, including what log n actually means.",
  minutes: 10,
  sections: [
    {
      heading: "What time complexity measures",
      body: `Time complexity describes **how the number of steps grows as the input grows**. It is not seconds: seconds depend on the machine, the language and the cache. Steps don't.

You count the basic operations (a comparison, an addition, an array read) as a function of the input size **n**, then keep only the part that dominates when n is large. That is **Big-O**: an upper bound on the growth rate.

\`\`\`ts
function sum(arr: number[]) {
  let total = 0;            // 1 step
  for (const x of arr) {    // runs n times
    total += x;             // 1 step each → n steps
  }
  return total;             // 1 step
}
// n + 2 steps → O(n)
\`\`\``,
    },
    {
      heading: "The three rules for simplifying",
      body: `1. **Drop constants.** 3n + 5 → O(n). A loop that does 3 things per element is still linear.
2. **Keep the dominant term.** n² + n + 100 → O(n²). For n = 1,000,000, n² is a trillion and n is a rounding error.
3. **Different inputs get different letters.** Looping over \`a\` then over \`b\` is O(a + b). A loop over \`b\` *inside* a loop over \`a\` is O(a · b). Don't call it O(n²) unless both are the same n.

Sequential blocks **add**, nested blocks **multiply**.`,
    },
    {
      heading: "The common classes, from best to worst",
      body: `| Big-O | Name | Typical code | n = 10⁶ steps |
| :--- | :--- | :--- | :--- |
| O(1) | Constant | array index, hash map get | 1 |
| O(log n) | Logarithmic | binary search, balanced BST | ~20 |
| O(n) | Linear | one loop over the array | 10⁶ |
| O(n log n) | Linearithmic | merge sort, heap sort, \`.sort()\` | ~2 × 10⁷ |
| O(n²) | Quadratic | nested loops over the same array | 10¹² (too slow) |
| O(2ⁿ) | Exponential | naive recursive Fibonacci, all subsets | impossible |
| O(n!) | Factorial | all permutations | impossible |

**Rule of thumb:** a judge or a server does roughly 10⁸ simple operations per second. So for n = 10⁵, O(n²) = 10¹⁰ steps ≈ 100 seconds. That is why "it works" is not enough.`,
    },
    {
      heading: "What log n actually means",
      body: `**log₂ n is the number of times you can halve n until you reach 1.**

- 8 → 4 → 2 → 1: three halvings, so log₂ 8 = 3.
- 1,000,000 → … → 1: about 20 halvings, so log₂ 10⁶ ≈ 20.
- 1,000,000,000: about 30.

So O(log n) shows up whenever **each step throws away a constant fraction of what is left**. Binary search looks at the middle of a sorted array and discards half of it every step. A million elements need at most ~20 comparisons. A billion need ~30. Doubling the input adds only **one** step.

The base doesn't matter in Big-O: log₂ n and log₁₀ n differ by a constant factor (≈ 3.3), and constants are dropped. Say "log n".

**Where it hides:** halving a number (\`n = Math.floor(n / 2)\`), dividing by 10 to strip digits (O(log₁₀ n) = number of digits), the height of a balanced tree, and the depth of divide-and-conquer recursion.`,
    },
    {
      heading: "Why merge sort is O(n log n)",
      body: `Merge sort splits the array in half, sorts each half, then merges.

- **How many levels?** The array halves until pieces have 1 element: **log n levels**.
- **How much work per level?** At every level, the merges together touch all n elements once: **n work per level**.
- **Total:** n work × log n levels = **O(n log n)**.

\`\`\`
level 0:  [8 elements]                  merge cost 8
level 1:  [4]        [4]                merge cost 4 + 4 = 8
level 2:  [2]  [2]   [2]  [2]           merge cost 8
level 3:  [1][1][1][1][1][1][1][1]      (base case)
          → 3 levels (log₂ 8) × 8 = 24
\`\`\`

This "levels × work per level" picture works for any divide-and-conquer algorithm. It is also why **O(n log n) is the best possible for comparison-based sorting**: there are n! possible orders, and each comparison can at most halve them, so you need log₂(n!) ≈ n log n comparisons.`,
    },
    {
      heading: "Best, average, worst, and amortised",
      body: `- **Worst case** is what Big-O usually means in interviews. Linear search: target is last or missing → O(n).
- **Best case** is rarely interesting (target is first → O(1)). Don't quote it as the answer.
- **Average case** matters when it differs a lot: quicksort is O(n log n) on average but O(n²) worst case with bad pivots. Hash map lookup is O(1) average, O(n) worst case when everything collides.
- **Amortised** means "averaged over a sequence of operations". \`array.push\` is occasionally O(n) when the array reallocates, but the copies are spread over so many cheap pushes that each one costs O(1) amortised.

Strictly, Big-O is an upper bound, Big-Ω (Omega) a lower bound and Big-Θ (Theta) a tight bound. Interviewers say "Big-O" and mean the tight bound. Mentioning the difference once is a bonus point; correcting the interviewer is not.`,
    },
    {
      heading: "Hidden costs in JavaScript",
      body: `These look like one step but are not:

| Code | Real cost |
| :--- | :--- |
| \`arr.includes(x)\`, \`arr.indexOf(x)\` | O(n) scan |
| \`arr.slice()\`, \`[...arr]\`, \`arr.concat()\` | O(n) copy |
| \`arr.shift()\`, \`arr.unshift(x)\` | O(n): every element moves |
| \`str + char\` in a loop | can be O(n²) overall; push to an array and \`join\` |
| \`arr.sort()\` | O(n log n) |
| \`Math.min(...arr)\` | O(n), and throws for very large arrays |
| \`set.has(x)\`, \`map.get(k)\` | O(1) average |

A \`for\` loop with \`includes\` inside is **O(n²)**, even though it reads like one loop.`,
    },
  ],
  keywords: [
    { term: "Asymptotic", meaning: "Behaviour as n grows very large; why constants and small terms are dropped." },
    { term: "Upper bound", meaning: "Big-O promises the cost grows no faster than this." },
    { term: "Dominant term", meaning: "The fastest-growing term, the only one kept." },
    { term: "Halving the search space", meaning: "The phrase that explains every O(log n)." },
    { term: "Levels × work per level", meaning: "How to derive O(n log n) for divide and conquer." },
    { term: "Amortised O(1)", meaning: "Occasionally expensive, cheap on average over many calls (array push, dynamic array)." },
    { term: "Average vs worst case", meaning: "Say both when they differ: hash map, quicksort." },
  ],
  bonus: [
    "Derive the complexity from the code (\"this loop runs n times, the inner one log n\") instead of just stating it.",
    "Mention the input-size check: \"n is 10⁵, so O(n²) is 10¹⁰ — too slow; I need O(n log n).\"",
    "Point out a hidden cost: \"includes inside the loop makes this O(n²), so I'll use a Set.\"",
    "Explain why comparison sorting can't beat n log n (log₂(n!) comparisons).",
    "For hash maps, say \"O(1) average, O(n) worst case with collisions\".",
  ],
  questions: [
    { q: "What does O(log n) mean, in one sentence?", a: "Each step removes a constant fraction of the remaining input, so the steps equal the number of times n can be halved: about 20 for a million, 30 for a billion." },
    { q: "Why is merge sort O(n log n)?", a: "The array halves until single elements, giving log n levels. Each level's merges touch all n elements once. n work × log n levels." },
    { q: "Is O(2n) different from O(n)?", a: "No. Constants are dropped: both grow linearly. Two separate passes are still O(n)." },
    { q: "A loop runs n times and calls arr.includes inside. Complexity?", a: "O(n²): includes is itself an O(n) scan, nested inside an O(n) loop." },
    { q: "Two nested loops, outer over a (size m), inner over b (size k). Complexity?", a: "O(m · k). Only call it O(n²) if both are the same input." },
    { q: "What is amortised complexity?", a: "The average cost per operation over a long sequence. A dynamic array's push sometimes copies everything (O(n)), but rarely enough that each push is O(1) amortised." },
  ],
  recap: [
    "Big-O = how steps grow with n. Drop constants, keep the dominant term; sequential adds, nested multiplies.",
    "O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!). 10⁸ ops ≈ 1 second.",
    "log n = number of halvings: ~20 for a million, ~30 for a billion.",
    "Merge sort: log n levels × n work per level = O(n log n), the lower bound for comparison sorts.",
    "Watch hidden costs: includes / slice / shift / spread are O(n).",
  ],
};

export default note;
