import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "remove-element",
  pattern: "Read/write pointers (in place)",
  topics: ["Array", "Two Pointers"],
  companies: ["Amazon", "Microsoft", "Google", "Bloomberg", "Apple"],
  gist: "Filter an array in place: keep everything that isn't val, in one pass, with no extra array.",
  statement: `Given an integer array \`nums\` and an integer \`val\`, remove every occurrence of \`val\` **in place**. The order of the remaining elements may change. Return \`k\`, the number of elements not equal to \`val\`.

The first \`k\` elements of \`nums\` must be the elements that aren't \`val\`. What's beyond \`k\` doesn't matter.`,
  constraints: ["0 ≤ nums.length ≤ 100", "0 ≤ nums[i] ≤ 50", "0 ≤ val ≤ 100"],
  examples: [
    { input: "nums = [3, 2, 2, 3], val = 3", output: "2, nums = [2, 2, _, _]" },
    { input: "nums = [0, 1, 2, 2, 3, 0, 4, 2], val = 2", output: "5, nums = [0, 1, 3, 0, 4, _, _, _]", explain: "Any order of 0, 1, 3, 0, 4 in the first five slots is accepted." },
  ],
  predict: [
    { input: "nums = [], val = 1", output: "0", why: "Nothing to keep." },
    { input: "nums = [4, 4, 4], val = 4", output: "0", why: "Every element is removed." },
    { input: "nums = [1, 2, 3], val = 9", output: "3, nums = [1, 2, 3]", why: "val doesn't appear; every element is kept." },
  ],
  edgeCases: ["Empty array", "Every element equals val", "val not present", "Order of the kept elements is allowed to change"],
  hints: [
    "Same shape as Remove Duplicates — only the \"keep\" rule is different.",
    "Walk `read` over the array. Keep a `write` index. What do you do with an element that isn't `val`?",
    "Copy it to `nums[write]` and advance `write`. Return `write`. (Since order can change, an alternative swaps `val` elements with the last element and shrinks the array — fewer writes when val is rare.)",
  ],
  approaches: [
    {
      name: "filter, then copy back",
      idea: "`nums.filter(x => x !== val)` builds the kept list; copy it to the front. Readable, but allocates a second array.",
      complexity: { time: "O(n)", space: "O(n)", why: "filter allocates up to n elements." },
      code: `function removeElement(nums: number[], val: number): number {
  const kept = nums.filter((x) => x !== val);
  kept.forEach((x, i) => (nums[i] = x));
  return kept.length;
}`,
    },
    {
      name: "Read/write pointers",
      idea: "`read` scans every element; any element that isn't `val` is copied to `nums[write]`, and `write` advances. Elements equal to `val` are skipped, so they get overwritten later.",
      complexity: { time: "O(n)", space: "O(1)", why: "One pass; two index variables." },
      code: `function removeElement(nums: number[], val: number): number {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== val) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write;
}`,
    },
  ],
  complexityTalk: `Every element must be checked, so O(n) is optimal; the improvement is O(n) → O(1) space.

There's a second-order detail interviewers like: the read/write version does a **write for every kept element**, even when \`val\` is rare. Because order doesn't matter here, you can instead swap each \`val\` with the **last** element and shrink the length: writes happen only for removed elements. Same Big-O, fewer writes — useful when writes are expensive (flash memory, huge objects).`,
  interview: {
    script: `"This is an in-place filter. I'll keep a write index for the next kept slot and scan with a read index. Whenever nums[read] isn't val, I copy it to nums[write] and move write forward; elements equal to val are just skipped. At the end, write is the count, and nums[0..write) holds the kept elements in their original order. O(n) time, O(1) space. Since the problem allows any order, there's also a variant that swaps val with the last element and shrinks the range, which does fewer writes when val is rare."`,
    keywords: [
      { term: "In-place filter", meaning: "Keep or drop each element without a second array." },
      { term: "Read/write pointers", meaning: "The pattern; same as Remove Duplicates." },
      { term: "Order not required", meaning: "Unlocks the swap-with-last variant." },
    ],
    bonus: ["Mention the swap-with-end variant and when it's better.", "Point out that it's the same template as Remove Duplicates and Move Zeroes."],
    mistakes: ["Using splice in a loop (O(n²), and index skipping bugs)", "Iterating with forEach while mutating length", "Returning the array instead of k"],
    followUps: [
      { q: "Do fewer writes when val is rare?", a: "Two pointers i = 0 and n = length. If nums[i] === val, set nums[i] = nums[n - 1] and n--, without advancing i (the swapped-in value still needs checking). Otherwise i++. Return n." },
      { q: "Remove val from a linked list?", a: "Use a dummy head and skip matching nodes by relinking `prev.next = cur.next`. O(n), O(1)." },
    ],
  },
  starter: `function removeElement(nums: number[], val: number): number {

}`,
  tests: [
    { args: [[3, 2, 2, 3], 3], expected: { k: 2, prefix: [2, 2] } },
    { args: [[0, 1, 2, 2, 3, 0, 4, 2], 2], expected: { k: 5, prefix: [0, 1, 3, 0, 4] } },
    { args: [[], 1], expected: { k: 0, prefix: [] }, label: "Empty" },
    { args: [[4, 4, 4], 4], expected: { k: 0, prefix: [] }, label: "All removed" },
    { args: [[1, 2, 3], 9], expected: { k: 3, prefix: [1, 2, 3] }, label: "Nothing removed" },
  ],
};

export default note;
