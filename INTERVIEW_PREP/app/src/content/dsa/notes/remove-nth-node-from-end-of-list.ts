import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "remove-nth-node-from-end-of-list",
  pattern: "Fast pointer n ahead + dummy head",
  topics: ["Linked List", "Two Pointers"],
  companies: ["Meta", "Amazon", "Microsoft", "Google", "Apple", "Bloomberg", "Adobe"],
  gist: "Delete the nth node from the end in one pass — a fixed gap between two pointers replaces counting the length.",
  statement: `Given the \`head\` of a linked list, remove the **n-th node from the end** and return the head.

**Follow-up:** can you do it in one pass?`,
  constraints: ["1 ≤ size of the list ≤ 30", "0 ≤ Node.val ≤ 100", "1 ≤ n ≤ size"],
  examples: [
    { input: "head = [1, 2, 3, 4, 5], n = 2", output: "[1, 2, 3, 5]" },
    { input: "head = [1], n = 1", output: "[]" },
    { input: "head = [1, 2], n = 1", output: "[1]" },
  ],
  predict: [
    { input: "head = [1, 2], n = 2", output: "[2]", why: "n equals the length, so the head is removed — the dummy node handles it." },
    { input: "head = [1, 2, 3], n = 3", output: "[2, 3]", why: "Again the head." },
    { input: "head = [1, 2, 3], n = 1", output: "[1, 2]", why: "The tail; slow stops on the node before it." },
  ],
  edgeCases: ["Remove the head (n == length)", "Remove the tail (n == 1)", "Single node"],
  hints: [
    "Two passes is easy: count the length L, then remove node number L − n from the front. How do you avoid the first pass?",
    "If two pointers are n nodes apart and the front one reaches the end, where is the back one?",
    "Start both at a dummy. Move fast n + 1 steps. Then move both until fast is null; slow is now just before the node to delete.",
  ],
  approaches: [
    {
      name: "Two passes: count, then remove",
      idea: "Count the length L. The target is at index L − n from the front, so walk L − n steps from a dummy to land on its predecessor and unlink.",
      complexity: { time: "O(L)", space: "O(1)", why: "One full pass to count, up to one more to reach the predecessor." },
      code: `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  let len = 0;
  for (let cur = head; cur; cur = cur.next) len++;
  const dummy = new ListNode(0, head);
  let prev = dummy;
  for (let i = 0; i < len - n; i++) prev = prev.next!;
  prev.next = prev.next!.next;
  return dummy.next;
}`,
    },
    {
      name: "One pass with a gap of n",
      idea: "Start `slow` and `fast` at a dummy. Move `fast` n + 1 steps, so there are n nodes between them. Move both one step at a time until `fast` is null. `slow` is now the predecessor of the nth-from-end node; unlink it. The dummy covers the case where the head is removed.",
      complexity: { time: "O(L)", space: "O(1)", why: "fast walks the list once; slow trails it." },
      code: `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let slow: ListNode = dummy;
  let fast: ListNode | null = dummy;
  for (let i = 0; i <= n; i++) fast = fast!.next;
  while (fast) {
    slow = slow.next!;
    fast = fast.next;
  }
  slow.next = slow.next!.next;
  return dummy.next;
}`,
    },
  ],
  complexityTalk: `Both versions are O(L) time and O(1) space. "One pass" is about touching the list once, which matters when the list is a stream or very long and expensive to walk twice. Be honest that the Big-O is the same.

The off-by-one is the whole difficulty: moving fast **n + 1** steps (from the dummy) leaves slow on the **predecessor**, which is what you need to unlink. Walk the [1, 2] with n = 2 case out loud to prove it.`,
  interview: {
    script: `"The two-pass way counts the length and then removes node L − n from the front. To do it in one pass I keep two pointers with a fixed gap. Both start at a dummy node before the head. I move fast n + 1 steps ahead, then move both together until fast is null. Now slow is right before the node to remove, so I set slow.next = slow.next.next. The dummy makes removing the head work like any other node. O(L) time, O(1) space."`,
    keywords: [
      { term: "Fixed gap", meaning: "fast leads slow by n + 1 nodes." },
      { term: "Predecessor", meaning: "You need the node before the target to unlink it." },
      { term: "Dummy head", meaning: "Removing the head needs no special case." },
    ],
    bonus: ["Walk the 'remove the head' case out loud.", "Say why it's n + 1 and not n.", "Admit one pass and two passes are both O(L)."],
    mistakes: ["Moving fast only n steps (slow lands on the target, not its predecessor)", "No dummy, then crashing when n == length", "Returning head instead of dummy.next"],
    followUps: [
      { q: "Return the nth node from the end instead of deleting it?", a: "Same gap, but move fast n steps from head; when fast is null, slow is the answer." },
      { q: "What if n could be larger than the length?", a: "While moving fast ahead, if it becomes null too early, return head unchanged (or report an error)." },
    ],
  },
  starter: `/**
 * class ListNode {
 *   val: number
 *   next: ListNode | null
 * }
 */
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {

}`,
  tests: [
    { args: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
    { args: [[1], 1], expected: [], label: "Single node" },
    { args: [[1, 2], 1], expected: [1], label: "Remove the tail" },
    { args: [[1, 2], 2], expected: [2], label: "Remove the head" },
    { args: [[1, 2, 3], 3], expected: [2, 3] },
  ],
};

export default note;
