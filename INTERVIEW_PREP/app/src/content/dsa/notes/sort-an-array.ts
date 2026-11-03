import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "sort-an-array",
  pattern: "Divide and conquer (merge sort)",
  topics: ["Array", "Sorting", "Divide and Conquer", "Recursion", "Merge Sort"],
  companies: ["Amazon", "Microsoft", "Google", "Meta", "Apple", "Bloomberg"],
  gist: "Implement an O(n log n) sort yourself, and be able to derive the n log n from the recursion tree.",
  statement: `Given an array of integers \`nums\`, sort it in ascending order and return it.

You must solve it **without built-in sort functions**, in **O(n log n)** time, with the smallest space complexity possible.`,
  constraints: ["1 ≤ nums.length ≤ 5 × 10⁴", "-5 × 10⁴ ≤ nums[i] ≤ 5 × 10⁴"],
  examples: [
    { input: "nums = [5, 2, 3, 1]", output: "[1, 2, 3, 5]" },
    { input: "nums = [5, 1, 1, 2, 0, 0]", output: "[0, 0, 1, 1, 2, 5]", explain: "Duplicates are kept." },
  ],
  predict: [
    { input: "nums = [1]", output: "[1]", why: "Base case: an array of one is already sorted." },
    { input: "nums = [3, -1, -1, 2]", output: "[-1, -1, 2, 3]", why: "Negatives and duplicates." },
    { input: "nums = [1, 2, 3, 4, 5] (already sorted)", output: "[1, 2, 3, 4, 5]", why: "Merge sort still does all log n levels: O(n log n) even on sorted input, unlike insertion sort's O(n)." },
  ],
  edgeCases: ["Length 1 (base case)", "Duplicates", "Negative numbers", "Already sorted / reverse sorted (quicksort with a bad pivot goes O(n²) here; merge sort doesn't)"],
  hints: [
    "Two sorted arrays can be combined into one sorted array in linear time. How?",
    "Split the array in half, sort each half (recursively), then merge. When is an array trivially sorted?",
    "Merge with two pointers i, j: push the smaller of left[i] and right[j], advance that pointer, then append the leftovers. Use `<=` so equal elements keep their order (stable).",
  ],
  approaches: [
    {
      name: "Bubble / selection / insertion sort",
      idea: "Repeatedly swap or insert neighbours into place. Simple, in-place, but quadratic — times out for 5 × 10⁴ elements (2.5 × 10⁹ steps).",
      complexity: { time: "O(n²)", space: "O(1)", why: "Two nested loops over n." },
      code: `function sortArray(nums: number[]): number[] {
  for (let i = 1; i < nums.length; i++) {
    const cur = nums[i];
    let j = i - 1;
    while (j >= 0 && nums[j] > cur) {
      nums[j + 1] = nums[j];
      j--;
    }
    nums[j + 1] = cur;
  }
  return nums;
}`,
    },
    {
      name: "Merge sort",
      idea: "Divide: split at the middle until pieces have one element. Conquer: merge two sorted halves with two pointers, always taking the smaller head. Each level of merging is linear, and there are log n levels.",
      complexity: {
        time: "O(n log n)",
        space: "O(n)",
        why: "log n levels of splitting × O(n) merge work per level. The merge needs a temporary array of up to n; the recursion adds O(log n) stack, dominated by n. Same in best, average and worst case.",
      },
      code: `function sortArray(nums: number[]): number[] {
  if (nums.length <= 1) return nums;
  const mid = Math.floor(nums.length / 2);
  const left = sortArray(nums.slice(0, mid));
  const right = sortArray(nums.slice(mid));
  return merge(left, right);
}

function merge(a: number[], b: number[]): number[] {
  const out: number[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    // <= keeps equal elements in their original order: stable.
    if (a[i] <= b[j]) out.push(a[i++]);
    else out.push(b[j++]);
  }
  while (i < a.length) out.push(a[i++]);
  while (j < b.length) out.push(b[j++]);
  return out;
}`,
    },
  ],
  complexityTalk: `**Deriving n log n (draw this):** the recursion tree halves the array at each level, so there are **log₂ n levels**. At every level, the merges together touch each of the n elements exactly once, so each level costs **O(n)**. Total = n × log n. For n = 5 × 10⁴: about 16 levels × 50,000 ≈ 800,000 steps, versus 2.5 × 10⁹ for insertion sort.

As a recurrence: **T(n) = 2T(n/2) + O(n)** → O(n log n) by the Master Theorem (case 2).

**Space:** O(n) for the merge buffers. With \`slice\` at every level, total allocations add up to O(n log n) over the run, but at most O(n) is alive at once. A single preallocated buffer keeps it at exactly O(n).

**Why interviewers like it:** it's the lower bound for comparison sorting (log₂(n!) ≈ n log n), it's **stable**, it's **guaranteed** n log n (unlike quicksort's O(n²) worst case), and it's how **external sorting** works when data doesn't fit in memory (sort chunks, then k-way merge). The merge step reappears in Merge Two Sorted Lists, Merge k Sorted Lists and Count Inversions.`,
  interview: {
    script: `"I'll use merge sort since it's guaranteed O(n log n). It's divide and conquer: split the array in half, recursively sort each half, and merge the two sorted halves. An array of one element is the base case. The merge uses two pointers and always takes the smaller head, and I use less-than-or-equal so equal elements keep their order, which makes it stable. For complexity: the array halves until single elements, so there are log n levels, and each level's merges touch all n elements once — n times log n. As a recurrence it's T(n) = 2T(n/2) + n. Space is O(n) for the merge buffer plus O(log n) stack. If O(1) extra space mattered more than stability, I'd use heap sort; quicksort is faster in practice but O(n²) worst case without a random pivot."`,
    keywords: [
      { term: "Divide and conquer", meaning: "Split → solve subproblems → combine." },
      { term: "log n levels × n per level", meaning: "The derivation of n log n." },
      { term: "T(n) = 2T(n/2) + O(n)", meaning: "The recurrence; Master Theorem case 2." },
      { term: "Stable", meaning: "Equal elements keep their relative order (the `<=` in merge)." },
      { term: "Guaranteed / worst-case n log n", meaning: "Merge sort's edge over quicksort." },
      { term: "Not in-place", meaning: "Needs O(n) auxiliary space." },
      { term: "External sort", meaning: "Merge sort's real-world use for data larger than memory." },
    ],
    bonus: [
      "Compare with quicksort (in-place, faster constants, O(n²) worst case) and heap sort (in-place, not stable).",
      "Mention that V8's `Array.prototype.sort` uses TimSort — a merge sort / insertion sort hybrid, stable since 2019.",
      "Mention the comparison-sort lower bound log₂(n!) ≈ n log n.",
      "Mention counting sort for this problem's bounded range: O(n + k) with k = 10⁵.",
    ],
    mistakes: [
      "Using `<` in merge (breaks stability)",
      "Forgetting to append the leftovers of one half",
      "Base case `length === 0` only — length 1 recurses forever",
      "Saying O(1) space",
    ],
    followUps: [
      { q: "Why not quicksort?", a: "Quicksort is in-place and usually faster, but a bad pivot (sorted input, first-element pivot) makes it O(n²), and LeetCode's tests include that. A random pivot makes the worst case unlikely; merge sort makes it impossible." },
      { q: "Can you make it O(1) extra space?", a: "Heap sort: build a max-heap in place (O(n)), then pop the max to the end n times (O(log n) each). O(n log n) time, O(1) space, not stable." },
      { q: "Count the inversions in the array?", a: "During merge, when you take from the right half, every remaining element in the left half is greater — add (left.length − i). Still O(n log n)." },
      { q: "Sort a linked list in O(n log n)?", a: "Merge sort: find the middle with slow/fast pointers, split, sort both, merge. No random access needed, and merging lists needs no extra array." },
    ],
  },
  starter: `function sortArray(nums: number[]): number[] {

}`,
  tests: [
    { args: [[5, 2, 3, 1]], expected: [1, 2, 3, 5] },
    { args: [[5, 1, 1, 2, 0, 0]], expected: [0, 0, 1, 1, 2, 5] },
    { args: [[1]], expected: [1], label: "Single element" },
    { args: [[3, -1, -1, 2]], expected: [-1, -1, 2, 3] },
    { args: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5], label: "Reverse sorted" },
  ],
};

export default note;
