import type { ConceptNote } from "../../types.ts";

const note: ConceptNote = {
  slug: "why-dsa",
  title: "Why DSA matters",
  why: "Interviewers rarely say why they ask DSA. Knowing what they are actually scoring changes how you answer every problem after this one.",
  minutes: 5,
  sections: [
    {
      heading: "What a DSA round is really scoring",
      body: `A DSA round is not a test of whether you have memorised a solution. It is a 45-minute sample of how you work on a problem you have not fully seen before. Most rubrics (Google, Amazon, Meta and most product companies publish or leak similar ones) score four things:

| Signal | What the interviewer writes down |
| :--- | :--- |
| **Problem solving** | Did you clarify the input, find a working approach, then improve it? |
| **Coding** | Is the code correct, readable, and free of off-by-one bugs? |
| **Complexity analysis** | Can you say the time and space cost, and *why*? |
| **Communication** | Could they follow your thinking without asking? |

Getting the optimal code with no explanation can still be a "lean no". A clear brute force, a clear improvement, and a correct complexity analysis is often a "yes".`,
    },
    {
      heading: "Why companies care in real work",
      body: `The data structure decides the cost of every operation that touches it. A few real examples:

- **Search box autocomplete.** A list scan per keystroke is O(n) per letter. A trie makes it O(length of the word). With 10 million product names, that is the difference between a 2-second lag and an instant result.
- **Feed ranking.** Picking the top 50 posts from 100,000 candidates with a heap is O(n log k). Sorting all of them is O(n log n). Small difference on paper, real money at Instagram scale.
- **Rate limiter.** A queue of timestamps per user is a sliding window. Knowing it is a queue makes it obvious how to drop old entries in O(1).
- **Database index.** A Postgres B-tree index turns a full table scan (O(n)) into O(log n). Every "why is this query slow" conversation is a DSA conversation.

So DSA is how an engineer predicts, before writing the code, whether it will survive 100x more users.`,
    },
    {
      heading: "The order to approach any problem",
      body: `Use the same steps on every problem, out loud. Interviewers score the process, so make it visible.

1. **Restate** the problem in your own words and confirm the input and output types.
2. **Clarify** the edge cases: empty input, one element, duplicates, negatives, very large values.
3. **Give a brute force** and its complexity. This proves you can solve it at all.
4. **Find the bottleneck.** "The nested loop is O(n²) because for each element I scan the rest."
5. **Improve** with the right data structure or pattern: hash map, two pointers, binary search, sorting.
6. **Code it**, explaining each block as you write.
7. **Dry run** one normal case and one edge case by hand.
8. **State the final complexity** and one trade-off.`,
    },
    {
      heading: "Why revision beats more problems",
      body: `Solving 300 problems once is weaker than solving 150 and revising them three times. Memory fades fast without review (the "forgetting curve"): most of a solution is gone within a week if you never look at it again. Every revision resets the curve and makes it flatter.

That is why every page in this app ends with a **"How well did you know it?"** rating. It schedules the next revision for you: a shaky page comes back tomorrow, a solid one in a few days, an easy one in a few weeks.`,
    },
  ],
  keywords: [
    { term: "Brute force first", meaning: "Always say a simple correct solution before optimising. It shows you can solve it." },
    { term: "Bottleneck", meaning: "The part of the solution that dominates the cost. Name it, then remove it." },
    { term: "Trade-off", meaning: "What you gave up to get faster code (usually extra memory)." },
    { term: "Scales with input", meaning: "How the cost grows as n grows, not how fast it runs on one example." },
  ],
  bonus: [
    "Mention a real system where the data structure matters (DB index = B-tree, autocomplete = trie, scheduler = heap).",
    "Ask about the input size up front: \"Is n around 10³ or 10⁶?\" The answer tells you which complexity is acceptable.",
    "Before coding, say which approach you chose and why the alternatives were rejected.",
  ],
  questions: [
    {
      q: "Why do companies still ask DSA when real work is mostly APIs and UI?",
      a: "Because it is a short, comparable sample of problem solving, and because cost-aware thinking (which structure, what complexity) shows up in real work: database indexes, caching, search, feeds, rate limiting.",
    },
    {
      q: "How do you know which complexity is \"good enough\"?",
      a: "From the input size. About 10⁸ simple operations run in roughly a second. So n ≤ 10⁴ allows O(n²), n ≤ 10⁵–10⁶ needs O(n log n) or O(n), and n up to 10⁹ needs O(log n) or O(1).",
    },
    {
      q: "You found the optimal solution immediately. Should you still mention brute force?",
      a: "Yes, briefly. One sentence with its complexity, then explain why the optimal one is better. It shows you understand the improvement, not just the answer.",
    },
  ],
  recap: [
    "The round scores problem solving, coding, complexity analysis and communication — not memorisation.",
    "Process out loud: restate → clarify → brute force → bottleneck → optimise → code → dry run → complexity.",
    "Input size tells you the target complexity: 10⁸ simple operations ≈ 1 second.",
    "Real-world hooks: B-tree index, trie autocomplete, heap top-k, queue sliding window.",
    "Revise on a schedule; one revision is worth more than one new problem.",
  ],
};

export default note;
