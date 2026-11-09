import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "remove-linked-list-elements",
  pattern: "Dummy head + skip pointer",
  topics: ["Linked List", "Recursion"],
  companies: ["Amazon", "Microsoft", "Google", "Apple", "Bloomberg"],
  gist: "Delete every node with a given value — the problem that shows why a dummy head exists.",
  statement: `Given the \`head\` of a linked list and an integer \`val\`, remove every node whose value equals \`val\`, and return the **new head**.`,
  constraints: ["0 ≤ number of nodes ≤ 10⁴", "1 ≤ Node.val ≤ 50", "0 ≤ val ≤ 50"],
  examples: [
    { input: "head = [1, 2, 6, 3, 4, 5, 6], val = 6", output: "[1, 2, 3, 4, 5]" },
    { input: "head = [], val = 1", output: "[]" },
    { input: "head = [7, 7, 7, 7], val = 7", output: "[]" },
  ],
  predict: [
    { input: "head = [6, 1, 6], val = 6", output: "[1]", why: "The head itself is removed — the case the dummy node handles." },
    { input: "head = [1, 6, 6, 2], val = 6", output: "[1, 2]", why: "Consecutive matches: don't advance prev after a removal." },
    { input: "head = [1, 2], val = 3", output: "[1, 2]", why: "Nothing matches." },
  ],
  edgeCases: ["Empty list", "Head matches (possibly several in a row)", "Every node matches", "Consecutive matches in the middle", "Tail matches"],
  hints: [
    "To delete a node you need the node **before** it. What's before the head?",
    "Add a dummy node in front of head. Now every real node has a predecessor.",
    "With prev = dummy: if prev.next.val === val, skip it (prev.next = prev.next.next) and **don't** move prev; otherwise move prev forward. Return dummy.next.",
  ],
  approaches: [
    {
      name: "Strip the head, then the rest",
      idea: "First advance `head` past every leading match. Then walk with `cur` and skip any `cur.next` that matches. Works, but needs the separate head loop.",
      complexity: { time: "O(n)", space: "O(1)", why: "One pass in total; pointer variables only." },
      code: `function removeElements(head: ListNode | null, val: number): ListNode | null {
  while (head && head.val === val) head = head.next;
  let cur = head;
  while (cur && cur.next) {
    if (cur.next.val === val) cur.next = cur.next.next;
    else cur = cur.next;
  }
  return head;
}`,
    },
    {
      name: "Dummy head",
      idea: "Put a dummy node in front of the list. Walk `prev` from the dummy: if `prev.next` matches, unlink it and stay put (the new `prev.next` might match too); otherwise step forward. The head is now handled like every other node.",
      complexity: { time: "O(n)", space: "O(1)", why: "Each node is checked once; one extra node." },
      code: `function removeElements(head: ListNode | null, val: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  while (prev.next) {
    if (prev.next.val === val) prev.next = prev.next.next;
    else prev = prev.next;
  }
  return dummy.next;
}`,
    },
  ],
  complexityTalk: `Both versions are O(n) and O(1); the dummy one wins on **fewer branches**, which means fewer bugs under pressure.

A recursive version is also neat: \`head.next = removeElements(head.next, val); return head.val === val ? head.next : head\`. It's O(n) stack space, so mention that if you write it.

Compare with the array version (Remove Element): there you copy kept values forward; here you just unlink nodes. No shifting is needed — that's the linked list's advantage.`,
  interview: {
    script: `"Deleting a node means pointing its predecessor past it, and the head has no predecessor, so I add a dummy node in front. Then I walk prev from the dummy. If prev.next has the value, I unlink it with prev.next = prev.next.next and don't move prev, because the new next might match too. Otherwise I move prev forward. At the end I return dummy.next, which is correct even if the original head was removed. O(n) time, O(1) space."`,
    keywords: [
      { term: "Dummy head", meaning: "Gives the head a predecessor; removes the special case." },
      { term: "Unlink", meaning: "prev.next = prev.next.next — the node is skipped." },
      { term: "Don't advance after delete", meaning: "Handles consecutive matches." },
    ],
    bonus: ["Explain why prev stays put after a delete.", "Mention the recursive version and its stack cost.", "Note that in JS the unlinked node is garbage-collected; in C you'd free it."],
    mistakes: ["Advancing prev after a removal (skips consecutive matches)", "Returning head instead of dummy.next", "Checking cur.val and trying to delete cur itself (no predecessor)"],
    followUps: [
      { q: "Delete a node when you're given only that node (not the head)?", a: "Copy the next node's value into it and unlink the next node. Doesn't work for the tail." },
      { q: "Remove all nodes whose value appears more than once in a sorted list?", a: "Remove Duplicates II: dummy head; when a run of equal values is found, skip the whole run." },
    ],
  },
  starter: `/**
 * class ListNode {
 *   val: number
 *   next: ListNode | null
 * }
 */
function removeElements(head: ListNode | null, val: number): ListNode | null {

}`,
  tests: [
    { args: [[1, 2, 6, 3, 4, 5, 6], 6], expected: [1, 2, 3, 4, 5] },
    { args: [[], 1], expected: [], label: "Empty list" },
    { args: [[7, 7, 7, 7], 7], expected: [], label: "Every node matches" },
    { args: [[6, 1, 6], 6], expected: [1], label: "Head matches" },
    { args: [[1, 6, 6, 2], 6], expected: [1, 2], label: "Consecutive matches" },
  ],
};

export default note;
