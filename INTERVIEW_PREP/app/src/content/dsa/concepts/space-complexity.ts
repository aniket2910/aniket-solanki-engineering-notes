import type { ConceptNote } from "../../types.ts";

const note: ConceptNote = {
  slug: "space-complexity",
  title: "Space complexity",
  why: "Candidates get the time right and then say \"O(1) space\" for a recursive solution. This page is about the memory you forget to count.",
  minutes: 7,
  sections: [
    {
      heading: "What space complexity measures",
      body: `Space complexity describes **how much extra memory the algorithm needs as the input grows**, in the same Big-O terms as time.

In interviews, "space" almost always means **auxiliary space**: memory you allocate *beyond* the input. The input array itself is not counted, because you were given it.

\`\`\`ts
function maxOf(arr: number[]) {
  let best = arr[0];          // one variable → O(1)
  for (const x of arr) if (x > best) best = x;
  return best;
}
// Time O(n), auxiliary space O(1)

function doubled(arr: number[]) {
  return arr.map((x) => x * 2); // new array of n → O(n)
}
// Time O(n), auxiliary space O(n)
\`\`\`

If the output itself must be size n (like \`doubled\`), say so: "O(n) space for the output, O(1) extra besides that."`,
    },
    {
      heading: "What counts as extra memory",
      body: `| Allocation | Space |
| :--- | :--- |
| A fixed number of variables (counters, pointers) | O(1) |
| A copy of the input (\`slice\`, spread, \`map\`, \`filter\`) | O(n) |
| A hash map / Set of seen values | O(n) worst case |
| A 2D grid / DP table of n × m | O(n · m) |
| A string built from the input | O(n) |
| **Recursion depth d** | **O(d)** call-stack frames |

The last row is the one people forget.`,
    },
    {
      heading: "The call stack is memory",
      body: `Every recursive call that hasn't returned yet keeps a **stack frame** (its arguments, local variables and return address). The maximum number of frames alive at once is the **recursion depth**, and that is the space cost.

\`\`\`ts
function sumTo(n: number): number {
  if (n === 0) return 0;
  return n + sumTo(n - 1);   // n frames alive at the deepest point
}
// Time O(n), space O(n) — not O(1)
\`\`\`

- Recursive binary search: depth log n → **O(log n)** space. The iterative version is **O(1)**.
- Merge sort: depth log n, plus the temporary arrays for merging → **O(n)** total.
- DFS on a skewed tree: depth can be n → **O(n)**. On a balanced tree: **O(log n)**. Say "O(h), where h is the height".

JavaScript has no guaranteed tail-call optimisation, and the stack holds roughly 10,000 frames. Recursion 100,000 deep throws \`RangeError: Maximum call stack size exceeded\`. That is a real reason to convert deep recursion to a loop.`,
    },
    {
      heading: "In-place, and the time–space trade-off",
      body: `**In-place** means O(1) extra space: you rearrange the input instead of building a new one (two-pointer swaps, reversing an array, Dutch national flag). It is often asked as a follow-up: "can you do it without the extra array?"

Most optimisations **buy time with memory**:

| Problem | Less memory | Less time |
| :--- | :--- | :--- |
| Two Sum | nested loops: O(n²) time, O(1) space | hash map: O(n) time, O(n) space |
| Fibonacci | naive recursion: O(2ⁿ) time | memo table: O(n) time, O(n) space |
| Duplicates | sort first: O(n log n), O(1)\\* | Set: O(n) time, O(n) space |

\\*if the sort is in place and you're allowed to modify the input.

Neither column is "right". Say the trade-off and ask which constraint matters: "If memory is tight I'd sort in place; otherwise the Set is faster."`,
    },
  ],
  keywords: [
    { term: "Auxiliary space", meaning: "Extra memory beyond the input. What \"space complexity\" means by default in interviews." },
    { term: "Call stack / stack frame", meaning: "Memory used by unfinished recursive calls. Space = max recursion depth." },
    { term: "In-place", meaning: "O(1) extra space; the input is modified directly." },
    { term: "O(h) space", meaning: "Tree/DFS recursion depth, where h is the height: log n balanced, n skewed." },
    { term: "Time–space trade-off", meaning: "Spending memory (a hash map, a memo) to save time." },
  ],
  bonus: [
    "Separate the output from extra space: \"O(n) for the result, O(1) auxiliary.\"",
    "Always count the recursion stack, and offer the iterative version when it brings space down.",
    "Mention JavaScript's stack limit (~10k frames) as a practical reason to avoid deep recursion.",
    "When you add a hash map, say the trade-off out loud before the interviewer asks.",
  ],
  questions: [
    { q: "Is recursive binary search O(1) space?", a: "No. Each halving adds a stack frame, so it uses O(log n) space. The iterative loop is O(1)." },
    { q: "Does the input array count toward space complexity?", a: "Usually not. Interviews mean auxiliary space: memory beyond the input. Say which one you mean if it's ambiguous." },
    { q: "What is the space complexity of merge sort?", a: "O(n): the temporary arrays used while merging, plus O(log n) recursion depth, which is dominated by n." },
    { q: "What does in-place mean?", a: "The algorithm uses O(1) extra memory by modifying the input directly instead of building a new structure." },
    { q: "Why might you choose a slower algorithm?", a: "When memory is the constraint (embedded devices, huge inputs that barely fit) or when the input must not be copied. O(n log n) in place can beat O(n) with an O(n) hash map." },
  ],
  recap: [
    "Space = extra memory growth (auxiliary), input not counted unless asked.",
    "Variables O(1); copies, maps, sets O(n); grids O(n·m).",
    "Recursion depth is space: binary search recursive O(log n), sumTo(n) O(n), DFS O(h).",
    "In-place = O(1) extra. A common follow-up.",
    "Most speed-ups trade memory for time; say the trade-off out loud.",
  ],
};

export default note;
