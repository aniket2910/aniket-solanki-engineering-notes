import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "move-zeroes",
  pattern: "Read/write pointers (stable partition)",
  topics: ["Array", "Two Pointers"],
  companies: ["Meta", "Amazon", "Microsoft", "Apple", "Google", "Bloomberg", "Uber"],
  gist: "Move every zero to the end while keeping the other numbers in order — in place, in one pass.",
  statement: `Given an integer array \`nums\`, move all \`0\`s to the end while keeping the **relative order** of the non-zero elements.

Do it **in place**, without making a copy of the array.`,
  constraints: ["1 ≤ nums.length ≤ 10⁴", "-2³¹ ≤ nums[i] ≤ 2³¹ − 1"],
  examples: [
    { input: "nums = [0, 1, 0, 3, 12]", output: "[1, 3, 12, 0, 0]" },
    { input: "nums = [0]", output: "[0]" },
  ],
  predict: [
    { input: "nums = [1, 2, 3]", output: "[1, 2, 3]", why: "No zeros: every swap is with itself." },
    { input: "nums = [0, 0, 1]", output: "[1, 0, 0]", why: "The 1 is swapped forward to index 0." },
    { input: "nums = [4, 0, 5, 0, -1]", output: "[4, 5, -1, 0, 0]", why: "Order of the non-zeros (4, 5, −1) is preserved; negatives aren't zeros." },
  ],
  edgeCases: ["No zeros", "All zeros", "Zeros already at the end", "Negative numbers"],
  hints: [
    "Think of it as Remove Element with val = 0 — plus the zeros must reappear at the end.",
    "Read/write pointers: copy each non-zero to `nums[write++]`. What's in `nums[write..]` afterwards?",
    "Either fill `nums[write..]` with zeros in a second loop, or swap `nums[read]` with `nums[write]` instead of copying — the zeros then drift to the back on their own in one pass.",
  ],
  approaches: [
    {
      name: "Copy non-zeros forward, then fill zeros",
      idea: "Read/write pointers move every non-zero to the front in order, then a second loop writes zeros into the rest. Two passes, O(1) space.",
      complexity: { time: "O(n)", space: "O(1)", why: "Two linear passes; one write index." },
      code: `function moveZeroes(nums: number[]): void {
  let write = 0;
  for (const x of nums) if (x !== 0) nums[write++] = x;
  while (write < nums.length) nums[write++] = 0;
}`,
    },
    {
      name: "One pass with swaps",
      idea: "`write` points at the first zero of the zero block. Each time `read` finds a non-zero, swap it with `nums[write]` and advance `write`. Non-zeros move forward in their original order; zeros are pushed back by the swaps.",
      complexity: { time: "O(n)", space: "O(1)", why: "One pass; each element is swapped at most once." },
      code: `function moveZeroes(nums: number[]): void {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      [nums[write], nums[read]] = [nums[read], nums[write]];
      write++;
    }
  }
}`,
    },
  ],
  complexityTalk: `Both versions are O(n) time and O(1) space. The difference interviewers probe is **number of writes**: the fill version writes n times; the swap version writes 2 × (non-zeros) times, and you can skip the swap when \`read === write\`. When writes are expensive, choose the one that fits the data (mostly zeros → copy+fill; few zeros → swap with the skip).

The swap version is a **stable partition**: it splits the array into "non-zero" and "zero" groups while keeping the order of the first group. The same structure, with three pointers, solves Sort Colors (Dutch National Flag).`,
  interview: {
    script: `"This is the in-place filter pattern. I'll keep a write pointer at the next slot for a non-zero and scan with read. Whenever nums[read] isn't zero, I swap it with nums[write] and advance write. The invariant is: everything before write is a non-zero in original order, and everything between write and read is zero. So non-zeros keep their order and zeros end up at the back, in one pass, O(n) time and O(1) space. An alternative is copying non-zeros forward and then filling zeros, which is also O(n) but two passes."`,
    keywords: [
      { term: "Stable partition", meaning: "Split into two groups, keeping one group's order." },
      { term: "Invariant", meaning: "[0, write) non-zeros in order; [write, read) zeros." },
      { term: "Minimise writes", meaning: "The follow-up that decides between the two versions." },
    ],
    bonus: ["State the two-part invariant.", "Mention Dutch National Flag (Sort Colors) as the three-way version.", "Skip the swap when read === write."],
    mistakes: ["Using splice + push in a loop (O(n²) and index-skipping bugs)", "Sorting (doesn't keep order, and O(n log n))", "Creating a new array (not in place)"],
    followUps: [
      { q: "Sort an array of 0s, 1s and 2s in one pass?", a: "Dutch National Flag: low, mid, high pointers. 0 → swap with low (low++, mid++); 1 → mid++; 2 → swap with high (high--). O(n), O(1)." },
      { q: "Move zeros to the front instead?", a: "Mirror it: scan from the end with the write pointer at the last index." },
    ],
  },
  starter: `function moveZeroes(nums: number[]): void {

}`,
  tests: [
    { args: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
    { args: [[0]], expected: [0] },
    { args: [[1, 2, 3]], expected: [1, 2, 3], label: "No zeros" },
    { args: [[0, 0, 1]], expected: [1, 0, 0] },
    { args: [[4, 0, 5, 0, -1]], expected: [4, 5, -1, 0, 0] },
  ],
};

export default note;
