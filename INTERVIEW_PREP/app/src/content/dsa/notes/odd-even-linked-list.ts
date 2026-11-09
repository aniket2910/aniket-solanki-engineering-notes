import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "odd-even-linked-list",
  pattern: "Two chains, then join",
  topics: ["Linked List"],
  companies: ["Amazon", "Microsoft", "Meta", "Google", "Bloomberg", "Adobe"],
  gist: "Group nodes at odd positions before nodes at even positions, in place — two growing chains woven out of one list.",
  statement: `Given the \`head\` of a singly linked list, group all nodes at **odd positions** first, then the nodes at **even positions**, and return the reordered list.

Positions start at 1 (the head is odd). Keep the original relative order inside each group. Use O(1) extra space and O(n) time.`,
  constraints: ["0 ≤ number of nodes ≤ 10⁴", "-10⁶ ≤ Node.val ≤ 10⁶"],
  examples: [
    { input: "head = [1, 2, 3, 4, 5]", output: "[1, 3, 5, 2, 4]" },
    { input: "head = [2, 1, 3, 5, 6, 4, 7]", output: "[2, 3, 6, 7, 1, 5, 4]", explain: "Positions, not values, decide the group." },
  ],
  predict: [
    { input: "head = [1, 2]", output: "[1, 2]", why: "Odd group [1], even group [2] — unchanged." },
    { input: "head = [1, 2, 3, 4]", output: "[1, 3, 2, 4]", why: "Even length: the even chain ends at 4." },
    { input: "head = []", output: "[]", why: "Return null right away." },
  ],
  edgeCases: ["Empty list", "One or two nodes", "Even vs odd length", "Values that are odd/even numbers (irrelevant — positions matter)"],
  hints: [
    "Imagine pulling the list apart into two lists: positions 1, 3, 5… and positions 2, 4, 6…",
    "Keep two tails, `odd` and `even`, and remember where the even list starts. Each step, each tail skips one node.",
    "Loop while (even && even.next): odd.next = even.next; odd = odd.next; even.next = odd.next; even = even.next. Finally odd.next = evenHead.",
  ],
  approaches: [
    {
      name: "Copy into two arrays, rebuild values",
      idea: "Collect values at odd and even positions into two arrays, then overwrite the node values in order. Easy, but O(n) space and it moves values rather than nodes.",
      complexity: { time: "O(n)", space: "O(n)", why: "Two passes and arrays holding n values." },
      code: `function oddEvenList(head: ListNode | null): ListNode | null {
  const odd: number[] = [];
  const even: number[] = [];
  let i = 1;
  for (let cur = head; cur; cur = cur.next, i++) (i % 2 ? odd : even).push(cur.val);
  const all = [...odd, ...even];
  i = 0;
  for (let cur = head; cur; cur = cur.next) cur.val = all[i++];
  return head;
}`,
    },
    {
      name: "Weave two chains in place",
      idea: "`odd` starts at the head and `even` at the second node; save `evenHead`. Each step, link `odd` to the node after `even` and move `odd` there, then link `even` to the node after the new `odd` and move `even`. When the even chain runs out, attach `evenHead` after the last odd node.",
      complexity: { time: "O(n)", space: "O(1)", why: "Every node is relinked once; four pointers." },
      code: `function oddEvenList(head: ListNode | null): ListNode | null {
  if (!head) return head;
  let odd = head;
  let even = head.next;
  const evenHead = even;
  while (even && even.next) {
    odd.next = even.next;
    odd = odd.next;
    even.next = odd.next;
    even = even.next;
  }
  odd.next = evenHead;
  return head;
}`,
    },
  ],
  complexityTalk: `The problem itself demands O(1) space, which rules out the array version — it's there to show what "in place" means for a list: move **nodes**, not values.

The loop guard \`even && even.next\` is the subtle part. When the length is **even**, \`even\` ends on the last node and \`even.next\` is null; when it's **odd**, \`even\` itself becomes null. Both stop the loop with \`odd\` on the last odd node, ready to be joined to \`evenHead\`.`,
  interview: {
    script: `"I'll split the list into two chains in place: one for odd positions and one for even positions, then join them. odd starts at head, even at head.next, and I save evenHead. In each step, odd takes the node after even, and even takes the node after the new odd — each chain skips one node. The loop runs while even and even.next exist. At the end, odd is the last odd node, so I set odd.next = evenHead. Relative order is kept in both chains. O(n) time, O(1) space."`,
    keywords: [
      { term: "Two-chain split", meaning: "Grow odd and even lists at once from the same nodes." },
      { term: "Save evenHead", meaning: "You need it to join the chains at the end." },
      { term: "Positions, not values", meaning: "Odd/even refers to index, not the number stored." },
    ],
    bonus: ["Walk the even-length and odd-length endings.", "Clarify positions vs values before coding.", "Mention Partition List (split by value < x) uses the same two-chain idea."],
    mistakes: ["Forgetting to save evenHead", "Grouping by value parity", "Updating even before odd (even.next = odd.next must read the *new* odd)"],
    followUps: [
      { q: "Partition the list so nodes < x come before nodes ≥ x?", a: "Partition List: build two chains with dummy heads (less, rest), append each node to one, then join less's tail to rest's head and set rest's tail.next = null." },
      { q: "Split into k chains by position mod k?", a: "Keep k dummy heads and k tails, append node i to chain i % k, then join them in order." },
    ],
  },
  starter: `/**
 * class ListNode {
 *   val: number
 *   next: ListNode | null
 * }
 */
function oddEvenList(head: ListNode | null): ListNode | null {

}`,
  tests: [
    { args: [[1, 2, 3, 4, 5]], expected: [1, 3, 5, 2, 4] },
    { args: [[2, 1, 3, 5, 6, 4, 7]], expected: [2, 3, 6, 7, 1, 5, 4] },
    { args: [[1, 2]], expected: [1, 2] },
    { args: [[1, 2, 3, 4]], expected: [1, 3, 2, 4], label: "Even length" },
    { args: [[]], expected: [], label: "Empty list" },
  ],
};

export default note;
