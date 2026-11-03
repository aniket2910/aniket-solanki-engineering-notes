import type { ConceptNote } from "../../types.ts";

const note: ConceptNote = {
  slug: "complexity-in-interviews",
  title: "Explaining complexity in the interview",
  why: "Knowing the complexity is half the score. Saying it clearly, with the reason and the trade-off, is the other half.",
  minutes: 6,
  sections: [
    {
      heading: "The three-sentence answer",
      body: `When asked "what is the complexity?", give it in three sentences:

1. **The result.** "Time is O(n log n) and space is O(n)."
2. **The reason, pointed at the code.** "The array halves log n times, and each level of merging touches all n elements. The temporary arrays for merging take O(n)."
3. **The trade-off or the alternative.** "An in-place sort like heap sort gets O(1) space, but it isn't stable."

Sentence 2 is where most candidates stop short. "It's O(n)" without a reason sounds memorised. "It's O(n) because each element is pushed and popped from the stack at most once" sounds understood.`,
    },
    {
      heading: "When to talk about complexity",
      body: `Not only at the end:

- **Before coding (brute force):** "The simple way is to check every pair, which is O(n²). With n up to 10⁵, that's too slow."
- **When you choose the optimisation:** "If I store what I've seen in a hash map, each lookup is O(1), which brings it to O(n) time for O(n) space."
- **After the dry run:** the final, precise statement, including space.

Each mention shows the interviewer you are steering by cost, which is exactly the "complexity analysis" box on their rubric.`,
    },
    {
      heading: "Phrases that land well",
      body: `| Situation | Say |
| :--- | :--- |
| One pass | "Each element is visited once, so O(n)." |
| Halving | "The search space halves every iteration, so O(log n)." |
| Sort first | "The sort dominates: O(n log n), and the scan after it is O(n)." |
| Hash map | "O(1) average lookups, so O(n) overall, at the cost of O(n) space." |
| Recursion | "Depth is log n, so the call stack is O(log n) space." |
| Two inputs | "O(m + n), where m and n are the lengths of the two arrays." |
| Amortised | "Each element is pushed and popped at most once, so O(n) total even with the inner while loop." |
| Digits | "Proportional to the number of digits, which is O(log₁₀ n)." |`,
    },
    {
      heading: "Traps that cost points",
      body: `- **Forgetting space.** Always say both. If you used recursion, count the stack.
- **Calling everything O(n²) for nested loops.** An inner \`while\` that only moves forward (sliding window, monotonic stack) makes the total O(n), not O(n²). Explain why: "the pointer never moves back".
- **Ignoring hidden costs.** \`slice\`, \`includes\`, \`shift\`, string concatenation in a loop.
- **Saying "O(1) because the array is fixed size".** If the size depends on the input, it's not constant. A 26-letter count array, however, *is* O(1): its size doesn't grow with n.
- **Using n for everything.** Name your variables: "n is the length of the string, k is the window size."`,
    },
  ],
  keywords: [
    { term: "Dominates", meaning: "\"The sort dominates\" — the most expensive step decides the total." },
    { term: "Each element is processed at most once", meaning: "The argument for O(n) when there's an inner loop." },
    { term: "Bounded by the alphabet", meaning: "Why a 26-slot array or a char map is O(1) space." },
    { term: "In terms of m and n", meaning: "Shows you track separate input sizes." },
  ],
  bonus: [
    "State complexity three times: brute force, chosen optimisation, final.",
    "Explain an amortised O(n) with an inner loop instead of letting the interviewer think it's O(n²).",
    "Offer the alternative trade-off unprompted: faster but more memory, or in-place but slower.",
  ],
  questions: [
    { q: "A loop has an inner while loop. Is it automatically O(n²)?", a: "No. If the inner pointer only moves forward and never resets, each element is handled at most once by each pointer, so the total is O(n)." },
    { q: "A frequency count over lowercase letters uses an array of 26. What space is that?", a: "O(1). Its size is bounded by the alphabet, not by the input length." },
    { q: "How do you answer \"can you do better?\"", a: "Name the current bottleneck, say what the lower bound probably is (you must read every element → Ω(n)), and either improve or explain why it's already optimal." },
  ],
  recap: [
    "Answer = result + reason pointed at the code + trade-off.",
    "Talk complexity at brute force, at the optimisation, and at the end.",
    "Always give space too, including the recursion stack.",
    "Forward-only inner loops are amortised O(n), not O(n²).",
    "Fixed-size helpers (26 letters) are O(1); input-sized ones are not.",
  ],
};

export default note;
