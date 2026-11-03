import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "max-consecutive-ones",
  pattern: "One pass with running count",
  topics: ["Array"],
  companies: ["Google", "Amazon", "Microsoft", "Meta"],
  gist: "Count the current run of 1s, reset on a 0, and remember the longest run.",
  statement: `Given a binary array \`nums\` (only 0s and 1s), return the maximum number of **consecutive** 1s.`,
  constraints: ["1 ≤ nums.length ≤ 10⁵", "nums[i] is 0 or 1"],
  examples: [
    { input: "nums = [1, 1, 0, 1, 1, 1]", output: "3", explain: "The last three 1s." },
    { input: "nums = [1, 0, 1, 1, 0, 1]", output: "2" },
  ],
  predict: [
    { input: "nums = [0, 0]", output: "0", why: "No 1s at all." },
    { input: "nums = [1, 1, 1]", output: "3", why: "The longest run ends at the last element — make sure the answer is updated inside the loop, not only on a 0." },
    { input: "nums = [1, 0, 1]", output: "1", why: "Two runs of length 1." },
  ],
  edgeCases: ["All zeros → 0", "All ones → n", "Longest run at the end of the array"],
  hints: [
    "What do you need to remember about the elements you've already passed?",
    "Two numbers: the length of the run you're currently in, and the longest run so far.",
    "On a 1: `cur++` and `best = max(best, cur)`. On a 0: `cur = 0`. Updating best on every 1 handles a run that ends at the array's end.",
  ],
  approaches: [
    {
      name: "Split into runs",
      idea: "`nums.join(\"\").split(\"0\")` gives the runs of 1s as strings; the longest one's length is the answer. Short, but builds a string and an array.",
      complexity: { time: "O(n)", space: "O(n)", why: "The joined string and the split array are both O(n)." },
      code: `function findMaxConsecutiveOnes(nums: number[]): number {
  return Math.max(...nums.join("").split("0").map((run) => run.length));
}`,
    },
    {
      name: "Running count",
      idea: "Scan once. A 1 extends the current run; a 0 resets it. Keep the longest run seen.",
      complexity: { time: "O(n)", space: "O(1)", why: "One pass, two counters." },
      code: `function findMaxConsecutiveOnes(nums: number[]): number {
  let cur = 0;
  let best = 0;
  for (const x of nums) {
    if (x === 1) {
      cur++;
      if (cur > best) best = cur;
    } else {
      cur = 0;
    }
  }
  return best;
}`,
    },
  ],
  complexityTalk: `O(n) time is required (every element matters) and O(1) space is achievable, so the running count is optimal. The string trick is also O(n) time but O(n) space, and \`Math.max(...)\` can throw on very large spreads.

Why it's in the sheet: it's the gentlest **sliding window**. The follow-ups — "you may flip one 0" (LeetCode 487) and "flip at most k zeros" (LeetCode 1004) — need a real window with two pointers, and interviewers often go straight from this problem to those.`,
  interview: {
    script: `"I'll scan once with two counters: cur, the length of the run of 1s I'm in, and best, the longest run so far. A 1 increments cur and updates best; a 0 resets cur to zero. I update best on every 1 rather than on every 0, so a run that ends at the last element still counts. One pass, O(n) time, O(1) space. If you then allow flipping up to k zeros, it becomes a sliding window: expand right, and shrink from the left whenever the window holds more than k zeros."`,
    keywords: [
      { term: "Running count / current streak", meaning: "The state carried through the scan." },
      { term: "Reset on break", meaning: "A 0 ends the run." },
      { term: "Sliding window", meaning: "What the flip-k-zeros follow-up becomes." },
    ],
    bonus: ["Jump ahead to the flip-k-zeros sliding window.", "Point out the end-of-array run bug and how updating inside the loop avoids it."],
    mistakes: ["Only updating best when a 0 is seen (misses a final run)", "Counting total 1s instead of consecutive", "Using Math.max(...spread) on a huge array"],
    followUps: [
      { q: "You may flip at most one 0 (LeetCode 487)?", a: "Sliding window with at most one zero inside: expand right; when a second zero enters, move left past the first zero. O(n)." },
      { q: "Flip at most k zeros (LeetCode 1004)?", a: "Same window, counting zeros; while zeros > k, shrink from the left. Answer = max window length. O(n), O(1)." },
    ],
  },
  starter: `function findMaxConsecutiveOnes(nums: number[]): number {

}`,
  tests: [
    { args: [[1, 1, 0, 1, 1, 1]], expected: 3 },
    { args: [[1, 0, 1, 1, 0, 1]], expected: 2 },
    { args: [[0, 0]], expected: 0, label: "No ones" },
    { args: [[1, 1, 1]], expected: 3, label: "Run at the end" },
    { args: [[1, 0, 1]], expected: 1 },
  ],
};

export default note;
