import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "remove-duplicates-from-sorted-array",
  pattern: "Read/write pointers (in place)",
  topics: ["Array", "Two Pointers"],
  companies: ["Amazon", "Microsoft", "Google", "Meta", "Bloomberg", "Adobe"],
  gist: "Sortedness puts duplicates side by side. Can you compact the array in place with two pointers instead of splice?",
  statement: `Given an integer array \`nums\` sorted in **non-decreasing** order, remove the duplicates **in place** so each unique element appears once, keeping their relative order. Return \`k\`, the number of unique elements.

The first \`k\` elements of \`nums\` must hold the unique values in order. What's left beyond \`k\` doesn't matter. Use O(1) extra memory.`,
  constraints: ["1 ≤ nums.length ≤ 3 × 10⁴", "-100 ≤ nums[i] ≤ 100", "nums is sorted in non-decreasing order"],
  examples: [
    { input: "nums = [1, 1, 2]", output: "2, nums = [1, 2, _]" },
    { input: "nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]", output: "5, nums = [0, 1, 2, 3, 4, _, _, _, _, _]" },
  ],
  predict: [
    { input: "nums = [7]", output: "1, nums = [7]", why: "One element is already unique." },
    { input: "nums = [2, 2, 2, 2]", output: "1, nums = [2, _, _, _]", why: "Everything after the first 2 is skipped." },
    { input: "nums = [1, 2, 3]", output: "3, nums = [1, 2, 3]", why: "No duplicates: every element is written onto itself." },
  ],
  edgeCases: ["Length 1", "All equal", "No duplicates", "Negative numbers (sortedness still groups them)"],
  hints: [
    "Because the array is sorted, where can a duplicate of `nums[i]` be?",
    "Keep a `write` index for the next slot of the answer. Walk a `read` index over everything. When should you copy `nums[read]` to `nums[write]`?",
    "Copy when `nums[read] !== nums[write - 1]` (it differs from the last value you kept). Start `write = 1`, since the first element is always kept. Return `write`.",
  ],
  approaches: [
    {
      name: "Set, then copy back",
      idea: "Collect unique values in a Set (insertion order is preserved), then write them back to the front of `nums`. Correct, but uses O(n) extra memory and ignores the sortedness.",
      complexity: { time: "O(n)", space: "O(n)", why: "One pass to fill the Set, one to copy back; the Set holds up to n values." },
      code: `function removeDuplicates(nums: number[]): number {
  const unique = [...new Set(nums)];
  unique.forEach((v, i) => (nums[i] = v));
  return unique.length;
}`,
    },
    {
      name: "Read/write pointers",
      idea: "`write` marks the end of the deduplicated prefix. `read` scans every element; when it finds a value different from the last kept one (`nums[write - 1]`), copy it to `nums[write]` and advance `write`.",
      complexity: { time: "O(n)", space: "O(1)", why: "read visits each element once; write only moves forward. Two index variables." },
      code: `function removeDuplicates(nums: number[]): number {
  let write = 1;
  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[write - 1]) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write;
}`,
    },
  ],
  complexityTalk: `O(n) time is optimal because every element must be looked at. The point of the problem is **space**: the Set version is O(n), the two-pointer version O(1). That matters when the array is huge or memory-limited, and it's what "in place" asks for.

The tempting wrong answer is \`splice\` on each duplicate. Each \`splice\` shifts the rest of the array, which is O(n), so an array with many duplicates costs **O(n²)**. Say this out loud to show you know what the problem is steering you away from.`,
  interview: {
    script: `"Since the array is sorted, duplicates are adjacent, so I only need to compare with the last value I kept. I'll use two pointers: write is where the next unique value goes, starting at 1 because the first element is always kept; read scans the rest. When nums[read] differs from nums[write minus one], I copy it to nums[write] and move write forward. The invariant is that nums[0..write) is always the deduplicated prefix. That's one pass, O(n) time and O(1) extra space. I'm avoiding splice, because each splice shifts the tail and would make it O(n²)."`,
    keywords: [
      { term: "In place / O(1) extra space", meaning: "What the problem demands; rules out a Set." },
      { term: "Read/write (slow/fast) pointers", meaning: "The pattern name." },
      { term: "Invariant", meaning: "nums[0..write) holds the unique values in order." },
      { term: "Sorted ⇒ duplicates are adjacent", meaning: "Why comparing with the previous kept value is enough." },
    ],
    bonus: ["Name the splice-in-a-loop O(n²) trap.", "Generalise to \"allow at most k copies\": compare with `nums[write - k]`.", "State the invariant explicitly."],
    mistakes: ["Comparing with `nums[read - 1]` instead of the last kept value — fine for this problem, but it breaks the \"at most k copies\" follow-up", "Returning the array instead of k", "Starting write at 0 and forgetting the first element"],
    followUps: [
      { q: "Allow each value at most twice (LeetCode 80)?", a: "Start write at 2 and copy when `nums[read] !== nums[write - 2]`. The same code works for any k." },
      { q: "What if the array weren't sorted?", a: "Duplicates aren't adjacent anymore, so you need a Set of seen values: O(n) time, O(n) space. Or sort first, O(n log n), and the order changes." },
    ],
  },
  starter: `function removeDuplicates(nums: number[]): number {

}`,
  tests: [
    { args: [[1, 1, 2]], expected: [2, [1, 2]] },
    { args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: [5, [0, 1, 2, 3, 4]] },
    { args: [[7]], expected: [1, [7]], label: "Single element" },
    { args: [[2, 2, 2, 2]], expected: [1, [2]], label: "All equal" },
    { args: [[-3, -1, -1, 0, 5]], expected: [4, [-3, -1, 0, 5]] },
  ],
};

export default note;
