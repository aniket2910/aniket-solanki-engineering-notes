import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "merge-sorted-array",
  pattern: "Two pointers, fill from the back",
  topics: ["Array", "Two Pointers", "Sorting"],
  companies: ["Meta", "Amazon", "Microsoft", "Google", "Bloomberg", "Apple", "LinkedIn"],
  gist: "Merging from the front overwrites data you still need. The free space is at the back — so merge from the back.",
  statement: `You're given two sorted arrays \`nums1\` and \`nums2\`, and integers \`m\` and \`n\`: the number of real elements in each.

Merge \`nums2\` into \`nums1\` so that \`nums1\` becomes one sorted array. \`nums1\` has length \`m + n\`; its last \`n\` slots are \`0\` placeholders to make room. Don't return anything — modify \`nums1\` in place.`,
  constraints: ["nums1.length == m + n", "nums2.length == n", "0 ≤ m, n ≤ 200", "1 ≤ m + n ≤ 200", "-10⁹ ≤ nums1[i], nums2[j] ≤ 10⁹"],
  examples: [
    { input: "nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [2, 5, 6], n = 3", output: "[1, 2, 2, 3, 5, 6]" },
    { input: "nums1 = [0], m = 0, nums2 = [1], n = 1", output: "[1]", explain: "nums1 has no real elements; the 0 is only a placeholder." },
  ],
  predict: [
    { input: "nums1 = [1], m = 1, nums2 = [], n = 0", output: "[1]", why: "Nothing to merge." },
    { input: "nums1 = [4, 5, 6, 0, 0, 0], m = 3, nums2 = [1, 2, 3], n = 3", output: "[1, 2, 3, 4, 5, 6]", why: "All of nums1 moves to the back first; then nums2's leftovers fill the front." },
    { input: "nums1 = [2, 0], m = 1, nums2 = [1], n = 1", output: "[1, 2]", why: "2 > 1, so 2 goes to the last slot, then 1 fills index 0." },
  ],
  edgeCases: ["m = 0 (nums1 is all placeholders)", "n = 0", "All of nums2 smaller than nums1 (leftovers in nums2)", "Negative values and duplicates"],
  hints: [
    "If you merge from the front, writing nums2[0] into nums1[0] overwrites a value you haven't placed yet. Where is the empty space?",
    "The empty space is at the end. Which element belongs in the very last slot, `nums1[m + n - 1]`?",
    "Pointers i = m−1, j = n−1, k = m+n−1. Put the larger of nums1[i] and nums2[j] at k and move that pointer. Loop while j ≥ 0 — leftovers in nums1 are already in place.",
  ],
  approaches: [
    {
      name: "Copy in and sort",
      idea: "Write nums2 into the placeholder slots, then sort. Two lines, but throws away the fact that both inputs are already sorted.",
      complexity: { time: "O((m+n) log(m+n))", space: "O(1)–O(log(m+n))", why: "The sort dominates; its extra space depends on the engine." },
      code: `function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  for (let j = 0; j < n; j++) nums1[m + j] = nums2[j];
  nums1.sort((a, b) => a - b);
}`,
    },
    {
      name: "Three pointers from the back",
      idea: "Fill nums1 from its last slot. Each step, the larger of the two current tails goes to slot k. Writing at the back never overwrites an unread value of nums1, because k is always ≥ i. When nums2 is exhausted, whatever remains of nums1 is already in place.",
      complexity: { time: "O(m + n)", space: "O(1)", why: "Each element is placed exactly once; three index variables." },
      code: `function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
    else nums1[k--] = nums2[j--];
  }
}`,
    },
  ],
  complexityTalk: `Sorting costs O((m+n) log(m+n)); merging two sorted inputs costs O(m+n). Using the existing order is the point — it's the same **merge step as merge sort**, and the reason merge sort's levels are linear.

The interesting part is **space**. A front-to-back merge needs an O(m) copy of nums1 to avoid overwriting it. Merging back-to-front needs O(1), because the write pointer k = i + j + 1 is always ahead of i. Explain that invariant and you've shown you understand *why* it's safe, not just that it works.`,
  interview: {
    script: `"Both arrays are sorted, so I want a linear merge instead of a sort. Merging from the front would overwrite nums1 values I haven't placed, but the free space is at the end, so I'll merge from the back. Three pointers: i at the last real element of nums1, j at the end of nums2, k at the last slot. Each step I write the larger of nums1[i] and nums2[j] into k. k is always i plus j plus 1, so it never overtakes i, and nothing unread gets overwritten. I loop while nums2 has elements; anything left in nums1 is already in place. O(m + n) time, O(1) space."`,
    keywords: [
      { term: "Merge step", meaning: "Same operation as in merge sort." },
      { term: "Fill from the back", meaning: "Use the free space so nothing is overwritten." },
      { term: "k = i + j + 1", meaning: "Why the write pointer never overtakes the read pointer." },
      { term: "Linear vs sort", meaning: "O(m+n) beats O((m+n) log(m+n)) by using existing order." },
    ],
    bonus: ["Explain the k ≥ i invariant.", "Explain why the loop only needs `j >= 0`.", "Connect it to merge sort and to external sorting."],
    mistakes: ["Looping while `i >= 0 && j >= 0` and forgetting nums2's leftovers", "Treating the trailing zeros as real values when m = 0", "Returning a new array instead of mutating nums1"],
    followUps: [
      { q: "Why don't nums1's leftovers need copying?", a: "They're the smallest values and already sit at the front of nums1, exactly where they belong." },
      { q: "Merge k sorted arrays?", a: "A min-heap holding the current head of each array: O(N log k) for N total elements." },
      { q: "Intersection of two sorted arrays?", a: "Two pointers from the front: advance the smaller one, record when equal. O(m + n)." },
    ],
  },
  starter: `function merge(nums1: number[], m: number, nums2: number[], n: number): void {

}`,
  tests: [
    { args: [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3], expected: [1, 2, 2, 3, 5, 6] },
    { args: [[1], 1, [], 0], expected: [1], label: "n = 0" },
    { args: [[0], 0, [1], 1], expected: [1], label: "m = 0" },
    { args: [[4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3], expected: [1, 2, 3, 4, 5, 6] },
    { args: [[2, 0], 1, [1], 1], expected: [1, 2] },
    { args: [[-1, 0, 0, 3, 3, 3, 0, 0, 0], 6, [1, 2, 2], 3], expected: [-1, 0, 0, 1, 2, 2, 3, 3, 3] },
  ],
};

export default note;
