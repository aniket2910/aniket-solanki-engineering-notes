import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "rotate-list",
  pattern: "Close into a ring, cut at length − k",
  topics: ["Linked List", "Two Pointers"],
  companies: ["Amazon", "Microsoft", "Meta", "Google", "Bloomberg", "Adobe", "LinkedIn"],
  gist: "Rotate a list right by k — reduce k modulo the length, then move one cut instead of shifting k times.",
  statement: `Given the \`head\` of a linked list, rotate the list to the **right** by \`k\` places and return the new head.

Rotating right by 1 moves the last node to the front.`,
  constraints: ["0 ≤ number of nodes ≤ 500", "-100 ≤ Node.val ≤ 100", "0 ≤ k ≤ 2 × 10⁹"],
  examples: [
    { input: "head = [1, 2, 3, 4, 5], k = 2", output: "[4, 5, 1, 2, 3]" },
    { input: "head = [0, 1, 2], k = 4", output: "[2, 0, 1]", explain: "4 mod 3 = 1, so it's the same as rotating once." },
  ],
  predict: [
    { input: "head = [1, 2, 3], k = 3", output: "[1, 2, 3]", why: "k equals the length: a full turn changes nothing." },
    { input: "head = [], k = 5", output: "[]", why: "Empty list — return right away (and avoid k mod 0)." },
    { input: "head = [1], k = 99", output: "[1]", why: "A single node never changes." },
  ],
  edgeCases: ["Empty list", "Single node", "k = 0", "k a multiple of the length", "k far larger than the length"],
  hints: [
    "Rotating by the list's length gives back the same list. What does that tell you about a huge k?",
    "After rotating by k (with k < length), which node becomes the new head? Which becomes the new tail?",
    "Find the length and the tail. Link tail → head to make a ring. Walk length − k − 1 steps from the head to the new tail, set the new head to its next, and break the ring.",
  ],
  approaches: [
    {
      name: "Move the last node to the front k times",
      idea: "Repeat k times: walk to the second-to-last node, detach the tail and put it in front. Correct, but O(n·k) — with k up to 2 × 10⁹ it never finishes unless k is reduced first.",
      complexity: { time: "O(n · k)", space: "O(1)", why: "Each rotation walks the list; k rotations." },
      code: `function rotateRight(head: ListNode | null, k: number): ListNode | null {
  if (!head || !head.next) return head;
  let n = 0;
  for (let cur: ListNode | null = head; cur; cur = cur.next) n++;
  for (let r = 0; r < k % n; r++) {
    let prev = head;
    while (prev.next!.next) prev = prev.next!;
    const last = prev.next!;
    prev.next = null;
    last.next = head;
    head = last;
  }
  return head;
}`,
    },
    {
      name: "Ring and cut",
      idea: "Walk once to get the length n and the tail. Reduce k to k % n; if it's 0, return. Connect the tail to the head, making a ring. The new tail is n − k − 1 steps from the head; the new head is the node after it. Break the ring there.",
      complexity: { time: "O(n)", space: "O(1)", why: "One pass to measure, at most one more to find the cut." },
      code: `function rotateRight(head: ListNode | null, k: number): ListNode | null {
  if (!head || !head.next) return head;
  let n = 1;
  let tail = head;
  while (tail.next) {
    tail = tail.next;
    n++;
  }
  k %= n;
  if (k === 0) return head;
  tail.next = head;
  let newTail = head;
  for (let i = 0; i < n - k - 1; i++) newTail = newTail.next!;
  const newHead = newTail.next!;
  newTail.next = null;
  return newHead;
}`,
    },
  ],
  complexityTalk: `The brute force is O(n·k), and with k up to 2 × 10⁹ that's fatal. The first fix is **k mod n** — the key insight interviewers wait for. After that, one rotation by k is one cut: O(n) total, O(1) space.

Why n − k − 1: rotating right by k means the last k nodes move to the front. The new head is at index n − k, so the new tail is at index n − k − 1.

Two-pointer alternative: move fast k steps ahead, then move both until fast is the tail; slow is the new tail. Same O(n).`,
  interview: {
    script: `"Rotating by the length gives the same list, so first I reduce k to k mod n. To get n I walk to the tail, counting. If k is now 0, I return the head. Otherwise the last k nodes move to the front: the new head is at index n − k and the new tail at n − k − 1. I link the old tail to the old head to form a ring, walk n − k − 1 steps to the new tail, take its next as the new head, and set the new tail's next to null. O(n) time, O(1) space."`,
    keywords: [
      { term: "k mod n", meaning: "Full rotations are no-ops; k can be huge." },
      { term: "Ring and cut", meaning: "Close the list into a circle, break it at the new tail." },
      { term: "n − k − 1", meaning: "Index of the new tail." },
    ],
    bonus: ["Reduce k before anything else and say why.", "Guard empty/single-node lists before taking k % n (avoid mod by 0).", "Derive n − k − 1 instead of guessing."],
    mistakes: ["Not reducing k (timeout)", "k % n on an empty list (NaN, n = 0)", "Forgetting to break the ring (infinite list)", "Off-by-one in the walk to the new tail"],
    followUps: [
      { q: "Rotate left by k?", a: "Rotating left by k is rotating right by n − (k mod n). Or: the new tail is at index (k mod n) − 1." },
      { q: "Rotate an array in place?", a: "Reverse the whole array, then reverse the first k and the last n − k elements. O(n), O(1)." },
    ],
  },
  starter: `/**
 * class ListNode {
 *   val: number
 *   next: ListNode | null
 * }
 */
function rotateRight(head: ListNode | null, k: number): ListNode | null {

}`,
  tests: [
    { args: [[1, 2, 3, 4, 5], 2], expected: [4, 5, 1, 2, 3] },
    { args: [[0, 1, 2], 4], expected: [2, 0, 1] },
    { args: [[1, 2, 3], 3], expected: [1, 2, 3], label: "k equals length" },
    { args: [[], 5], expected: [], label: "Empty list" },
    { args: [[1, 2], 2000000000], expected: [1, 2], label: "Huge k" },
  ],
};

export default note;
