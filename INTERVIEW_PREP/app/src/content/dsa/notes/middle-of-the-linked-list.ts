import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "middle-of-the-linked-list",
  pattern: "Slow and fast pointers",
  topics: ["Linked List", "Two Pointers"],
  companies: ["Amazon", "Microsoft", "Apple", "Adobe", "Google", "Bloomberg"],
  gist: "Find the middle node in one pass without knowing the length — the intro to slow/fast pointers.",
  statement: `Given the \`head\` of a singly linked list, return the **middle node**.

If there are two middle nodes, return the **second** one.`,
  constraints: ["1 ≤ number of nodes ≤ 100", "1 ≤ Node.val ≤ 100"],
  examples: [
    { input: "head = [1, 2, 3, 4, 5]", output: "[3, 4, 5]", explain: "The middle node is 3." },
    { input: "head = [1, 2, 3, 4, 5, 6]", output: "[4, 5, 6]", explain: "Two middles (3 and 4); return the second." },
  ],
  predict: [
    { input: "head = [1]", output: "[1]", why: "One node is its own middle." },
    { input: "head = [1, 2]", output: "[2]", why: "Two middles; the second is 2." },
    { input: "head = [1, 2, 3]", output: "[2, 3]", why: "fast moves 1 → 3 and stops (no next); slow is at 2." },
  ],
  edgeCases: ["Single node", "Two nodes (second middle)", "Even vs odd length"],
  hints: [
    "The easy way needs the length first. Can you do it in one pass?",
    "If one runner moves twice as fast as another, where is the slow one when the fast one finishes?",
    "slow = fast = head; while (fast && fast.next) { slow = slow.next; fast = fast.next.next }. Check which middle you get for even length.",
  ],
  approaches: [
    {
      name: "Count, then walk half",
      idea: "First pass counts the nodes n. Second pass walks floor(n / 2) steps from the head — that lands on the second middle for even n.",
      complexity: { time: "O(n)", space: "O(1)", why: "Two passes: n + n/2 steps." },
      code: `function middleNode(head: ListNode | null): ListNode | null {
  let n = 0;
  for (let cur = head; cur; cur = cur.next) n++;
  let mid = head;
  for (let i = 0; i < Math.floor(n / 2); i++) mid = mid!.next;
  return mid;
}`,
    },
    {
      name: "Slow and fast pointers",
      idea: "`slow` moves one node per step, `fast` moves two. When `fast` runs out (null, or no next), `slow` has covered half the distance and sits on the middle. With the guard `fast && fast.next`, even-length lists end with `slow` on the second middle.",
      complexity: { time: "O(n)", space: "O(1)", why: "fast walks the list once (n/2 iterations); two pointers." },
      code: `function middleNode(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}`,
    },
  ],
  complexityTalk: `Both are O(n) time and O(1) space, so the interviewer isn't after a Big-O win. They want to see the **slow/fast technique**, because it's the building block for Linked List Cycle, Palindrome Linked List, Reorder List and merge sort on a list.

Know how to get the **first** middle too: use \`while (fast.next && fast.next.next)\`. Palindrome and merge sort usually want the first middle, so the left half is never longer than the right by more than one.`,
  interview: {
    script: `"I'll use slow and fast pointers, both starting at the head. Each step, slow moves one node and fast moves two. When fast can't move two more — it's null or its next is null — slow is in the middle, because it's travelled half as far. With that loop guard, an even-length list ends with slow on the second middle, which is what's asked. One pass, O(n) time, O(1) space. The counting approach works too but needs two passes."`,
    keywords: [
      { term: "Tortoise and hare", meaning: "Two pointers at speeds 1 and 2." },
      { term: "Loop guard", meaning: "`fast && fast.next` — both needed before fast.next.next." },
      { term: "First vs second middle", meaning: "Decided by the loop condition." },
    ],
    bonus: ["Show how to change the guard to get the first middle.", "Name the problems that reuse it: cycle, palindrome, reorder, list merge sort."],
    mistakes: ["Guard `while (fast.next)` only — crashes when fast becomes null", "Returning the first middle for even length", "Copying into an array (works, but O(n) space)"],
    followUps: [
      { q: "Return the first middle instead?", a: "Loop while `fast.next && fast.next.next`. For [1,2,3,4], slow stops at 2." },
      { q: "Delete the middle node?", a: "Track the node before slow (or start fast one step ahead) and set prev.next = slow.next. Handle a single-node list (return null)." },
    ],
  },
  starter: `/**
 * class ListNode {
 *   val: number
 *   next: ListNode | null
 * }
 */
function middleNode(head: ListNode | null): ListNode | null {

}`,
  tests: [
    { args: [[1, 2, 3, 4, 5]], expected: [3, 4, 5] },
    { args: [[1, 2, 3, 4, 5, 6]], expected: [4, 5, 6] },
    { args: [[1]], expected: [1], label: "Single node" },
    { args: [[1, 2]], expected: [2], label: "Two nodes" },
    { args: [[1, 2, 3]], expected: [2, 3] },
  ],
};

export default note;
