import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "swap-nodes-in-pairs",
  pattern: "Dummy head + rewire three pointers per pair",
  topics: ["Linked List", "Recursion"],
  companies: ["Amazon", "Microsoft", "Meta", "Google", "Bloomberg", "Adobe", "Uber"],
  gist: "Swap every two adjacent nodes by relinking, not by swapping values — three pointer changes per pair, in the right order.",
  statement: `Given a linked list, swap every two adjacent nodes and return its head.

You must **not** change the values in the nodes; only the nodes themselves may be moved.`,
  constraints: ["0 ≤ number of nodes ≤ 100", "0 ≤ Node.val ≤ 100"],
  examples: [
    { input: "head = [1, 2, 3, 4]", output: "[2, 1, 4, 3]" },
    { input: "head = []", output: "[]" },
    { input: "head = [1]", output: "[1]" },
  ],
  predict: [
    { input: "head = [1, 2, 3]", output: "[2, 1, 3]", why: "The odd node at the end has no partner and stays." },
    { input: "head = [1, 2]", output: "[2, 1]", why: "The head changes — the dummy node handles it." },
    { input: "head = [5, 5, 6, 6]", output: "[5, 5, 6, 6]", why: "Nodes are swapped, but equal values make it look the same." },
  ],
  edgeCases: ["Empty list", "Single node", "Odd length (last node stays)", "Head changes"],
  hints: [
    "Swapping values would be trivial, but it's not allowed. Which pointers change when nodes a and b swap places?",
    "Three pointers change: the node before the pair, a.next, and b.next. A dummy node gives the first pair a 'node before'.",
    "With prev before a → b: prev.next = b; a.next = b.next; b.next = a; then prev = a (now the second of the pair).",
  ],
  approaches: [
    {
      name: "Recursive",
      idea: "Swap the first two nodes and let recursion swap the rest: `first.next = swapPairs(second.next)`, `second.next = first`, return `second`. Clean, but O(n) stack.",
      complexity: { time: "O(n)", space: "O(n)", why: "One call per pair on the call stack." },
      code: `function swapPairs(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;
  const second = head.next;
  head.next = swapPairs(second.next);
  second.next = head;
  return second;
}`,
    },
    {
      name: "Iterative with a dummy",
      idea: "`prev` sits before the current pair (starting at a dummy). For each pair `a → b`, rewire: `prev.next = b`, `a.next = b.next`, `b.next = a`. Now `a` is second in the pair, so it becomes the next `prev`. Stop when fewer than two nodes remain.",
      complexity: { time: "O(n)", space: "O(1)", why: "Each pair is rewired once; a few pointers." },
      code: `function swapPairs(head: ListNode | null): ListNode | null {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  while (prev.next && prev.next.next) {
    const a = prev.next;
    const b = a.next!;
    prev.next = b;
    a.next = b.next;
    b.next = a;
    prev = a;
  }
  return dummy.next;
}`,
    },
  ],
  complexityTalk: `Both are O(n) time; iterative is O(1) space, recursive O(n) stack.

The difficulty isn't complexity but **order of the rewiring**. If you set \`b.next = a\` before saving \`b.next\` (into \`a.next\`), the rest of the list is lost. Draw prev → a → b → rest and change the arrows one at a time.

This is Reverse Nodes in k-Group with k = 2. That harder version reverses each group of k with the prev/cur/next loop and reconnects the groups.`,
  interview: {
    script: `"I'll swap nodes by relinking, with a dummy before the head so the first pair is handled like the rest. prev sits before the current pair a → b. Three pointers change: prev.next becomes b, a.next becomes b.next — the rest of the list — and b.next becomes a. After that, a is the second node of the swapped pair, so it becomes prev for the next pair. I stop when fewer than two nodes are left, so an odd last node stays where it is. O(n) time, O(1) space."`,
    keywords: [
      { term: "Rewire, don't swap values", meaning: "The constraint the problem is really about." },
      { term: "Rewiring order", meaning: "Save b.next into a.next before pointing b at a." },
      { term: "Dummy head", meaning: "The head changes after the first swap." },
    ],
    bonus: ["Draw prev → a → b → rest and update arrows one by one.", "Mention the recursive version's stack cost.", "Generalise to Reverse Nodes in k-Group."],
    mistakes: ["Swapping values (explicitly forbidden)", "Losing the rest of the list by overwriting b.next first", "Advancing prev to b instead of a", "Guard missing prev.next.next (crashes on odd length)"],
    followUps: [
      { q: "Reverse nodes in groups of k?", a: "For each group, check k nodes exist; reverse them with prev/cur/next; connect the previous group's tail to the new head and the new tail to the next group. O(n), O(1)." },
      { q: "Swap the kth node from the start with the kth from the end?", a: "Find both with a fixed-gap two-pointer walk, then swap values (allowed in that problem) or relink carefully if they're adjacent." },
    ],
  },
  starter: `/**
 * class ListNode {
 *   val: number
 *   next: ListNode | null
 * }
 */
function swapPairs(head: ListNode | null): ListNode | null {

}`,
  tests: [
    { args: [[1, 2, 3, 4]], expected: [2, 1, 4, 3] },
    { args: [[]], expected: [], label: "Empty list" },
    { args: [[1]], expected: [1], label: "Single node" },
    { args: [[1, 2, 3]], expected: [2, 1, 3], label: "Odd length" },
    { args: [[1, 2]], expected: [2, 1] },
  ],
};

export default note;
