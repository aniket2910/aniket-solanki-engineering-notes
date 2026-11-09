import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "reverse-linked-list",
  pattern: "In-place reversal (prev, cur, next)",
  topics: ["Linked List", "Recursion"],
  companies: ["Amazon", "Microsoft", "Meta", "Apple", "Google", "Adobe", "Bloomberg", "Uber"],
  gist: "Flip every next pointer in one pass — the most-asked linked list question, testing whether you can rewire pointers without losing the list.",
  statement: `Given the \`head\` of a singly linked list, reverse the list and return the **new head**.`,
  constraints: ["0 ≤ number of nodes ≤ 5000", "-5000 ≤ Node.val ≤ 5000"],
  examples: [
    { input: "head = [1, 2, 3, 4, 5]", output: "[5, 4, 3, 2, 1]" },
    { input: "head = [1, 2]", output: "[2, 1]" },
    { input: "head = []", output: "[]" },
  ],
  predict: [
    { input: "head = [7]", output: "[7]", why: "One node: its next becomes null (it already was), prev ends on it." },
    { input: "head = [1, 1, 2]", output: "[2, 1, 1]", why: "Duplicates don't matter; only pointers move." },
    { input: "head = []", output: "[]", why: "The loop never runs; prev is still null." },
  ],
  edgeCases: ["Empty list", "Single node", "Two nodes"],
  hints: [
    "You don't need to move values. What if each node's next pointed to the node before it?",
    "When you flip `cur.next`, you lose the rest of the list. Save it first.",
    "Three variables: prev = null, cur = head. Loop: next = cur.next; cur.next = prev; prev = cur; cur = next. Return prev.",
  ],
  approaches: [
    {
      name: "Copy values to an array, rebuild",
      idea: "Walk the list collecting values, then walk again writing them back in reverse order. Correct, but uses O(n) extra space and doesn't show pointer skills.",
      complexity: { time: "O(n)", space: "O(n)", why: "Two passes and an array of n values." },
      code: `function reverseList(head: ListNode | null): ListNode | null {
  const vals: number[] = [];
  for (let cur = head; cur; cur = cur.next) vals.push(cur.val);
  for (let cur = head; cur; cur = cur.next) cur.val = vals.pop()!;
  return head;
}`,
    },
    {
      name: "Recursive",
      idea: "Reverse everything after the head, which returns the new head (the old tail). The head's next node is now the last node of the reversed part, so point it back at head and cut head's next.",
      complexity: { time: "O(n)", space: "O(n)", why: "One call per node on the call stack." },
      code: `function reverseList(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;
  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}`,
    },
    {
      name: "Iterative prev / cur / next",
      idea: "Walk the list once. At each node, save `cur.next`, point `cur.next` back at `prev`, then step both forward. When `cur` falls off the end, `prev` is the old tail, which is the new head.",
      complexity: { time: "O(n)", space: "O(1)", why: "Each node is visited once; three pointer variables." },
      code: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}`,
    },
  ],
  complexityTalk: `All three are O(n) time. The difference is space: array O(n), recursion O(n) **stack** (5000 nodes is fine here, but a million would overflow), iterative O(1).

Interviewers often ask for **both** iterative and recursive. Explain the recursive one by its invariant: "after the call returns, \`head.next\` is the tail of the reversed rest". And mention the stack-depth risk without being asked.

This exact loop reappears inside Palindrome Linked List, Reorder List, Reverse Nodes in k-Group and Reverse Linked List II.`,
  interview: {
    script: `"I'll reverse it in place by flipping each next pointer. I keep prev, starting at null, and cur, starting at head. At each node I first save cur.next so I don't lose the rest of the list, then point cur.next at prev, then move prev to cur and cur to the saved next. When cur becomes null, prev is the old tail, which is the new head. That's one pass, O(n) time, O(1) space. There's also a recursive version — reverse the rest, then set head.next.next = head and head.next = null — but it uses O(n) stack."`,
    keywords: [
      { term: "Pointer rewiring", meaning: "Change next pointers, not values." },
      { term: "Save before you flip", meaning: "next = cur.next first, or the rest of the list is lost." },
      { term: "Recursion stack depth", meaning: "Why the recursive version is O(n) space." },
    ],
    bonus: ["Write both versions.", "Draw three boxes and walk one iteration.", "Mention stack overflow risk for long lists."],
    mistakes: [
      "Flipping cur.next before saving it",
      "Returning head instead of prev",
      "In recursion, forgetting `head.next = null` (creates a 2-node cycle)",
    ],
    followUps: [
      { q: "Reverse only positions left to right?", a: "Walk to the node before left (use a dummy), reverse right − left + 1 nodes with the same loop, then reconnect both ends. One pass." },
      { q: "Reverse in groups of k?", a: "Check k nodes exist, reverse them, connect the previous group's tail to the new group head, and repeat. Leave a final short group as is." },
      { q: "Reverse a doubly linked list?", a: "Swap prev and next on every node; the old tail becomes the head." },
    ],
  },
  starter: `/**
 * class ListNode {
 *   val: number
 *   next: ListNode | null
 * }
 */
function reverseList(head: ListNode | null): ListNode | null {

}`,
  tests: [
    { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
    { args: [[1, 2]], expected: [2, 1] },
    { args: [[]], expected: [], label: "Empty list" },
    { args: [[7]], expected: [7], label: "Single node" },
    { args: [[1, 1, 2]], expected: [2, 1, 1] },
  ],
};

export default note;
