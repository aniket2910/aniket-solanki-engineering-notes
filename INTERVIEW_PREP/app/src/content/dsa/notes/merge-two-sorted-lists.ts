import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "merge-two-sorted-lists",
  pattern: "Dummy head + tail pointer (merge step)",
  topics: ["Linked List", "Recursion"],
  companies: ["Amazon", "Microsoft", "Meta", "Google", "Apple", "Bloomberg", "Adobe", "Uber"],
  gist: "Splice two sorted lists into one sorted list — the merge step of merge sort, done by relinking nodes.",
  statement: `You're given the heads of two sorted linked lists, \`list1\` and \`list2\`. Merge them into one **sorted** list by **splicing together their nodes**, and return its head.`,
  constraints: ["0 ≤ nodes in each list ≤ 50", "-100 ≤ Node.val ≤ 100", "Both lists are sorted in non-decreasing order"],
  examples: [
    { input: "list1 = [1, 2, 4], list2 = [1, 3, 4]", output: "[1, 1, 2, 3, 4, 4]" },
    { input: "list1 = [], list2 = []", output: "[]" },
    { input: "list1 = [], list2 = [0]", output: "[0]" },
  ],
  predict: [
    { input: "list1 = [5], list2 = [1, 2, 3]", output: "[1, 2, 3, 5]", why: "list2 is used up first; attach the rest of list1." },
    { input: "list1 = [1, 1], list2 = [1]", output: "[1, 1, 1]", why: "Ties are fine — take either side." },
    { input: "list1 = [-3, 10], list2 = [0]", output: "[-3, 0, 10]", why: "Negatives sort like anything else." },
  ],
  edgeCases: ["One or both lists empty", "One list much longer", "Equal values across lists", "All of one list smaller than the other"],
  hints: [
    "Which node comes first in the answer? Only the two heads are candidates.",
    "Start a new chain from a dummy node with a tail pointer. Repeatedly attach the smaller head and move that list forward.",
    "When one list runs out, the other is already sorted — attach the whole remainder in one step: tail.next = list1 ?? list2.",
  ],
  approaches: [
    {
      name: "Recursive",
      idea: "The smaller head comes first, followed by the merge of everything else. Set `smaller.next = merge(smaller.next, other)` and return `smaller`. Short and elegant, but uses one stack frame per node.",
      complexity: { time: "O(m + n)", space: "O(m + n)", why: "One call per node on the call stack." },
      code: `function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  if (!list1) return list2;
  if (!list2) return list1;
  if (list1.val <= list2.val) {
    list1.next = mergeTwoLists(list1.next, list2);
    return list1;
  }
  list2.next = mergeTwoLists(list1, list2.next);
  return list2;
}`,
    },
    {
      name: "Iterative with dummy and tail",
      idea: "Start from a dummy node with a `tail` pointer. While both lists have nodes, attach the smaller head to `tail`, advance that list and `tail`. When one list empties, attach the other's remainder. Return `dummy.next`. No new nodes are created.",
      complexity: { time: "O(m + n)", space: "O(1)", why: "Each node is attached once; the dummy is the only extra node." },
      code: `function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  const dummy = new ListNode();
  let tail = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }
  tail.next = list1 ?? list2;
  return dummy.next;
}`,
    },
  ],
  complexityTalk: `Both are O(m + n) time. The iterative version is O(1) extra space because it **reuses the existing nodes** — no copies. The recursive one is O(m + n) stack.

Using \`<=\` (take from list1 on ties) makes the merge **stable**, which matters when this is the merge step of a stable merge sort.

This is the building block for **Merge k Sorted Lists** (heap of heads, or pairwise merging: O(N log k)) and **Sort List** (merge sort on a linked list, O(n log n) time, O(log n) stack).`,
  interview: {
    script: `"I'll splice the nodes together without creating new ones. I start from a dummy node with a tail pointer. While both lists have nodes, I compare the heads, attach the smaller one to tail, and move that list and tail forward. When one list runs out, the other is already sorted, so I attach its remainder in one step. Return dummy.next. O(m + n) time, O(1) extra space. A recursive version is shorter but uses O(m + n) stack."`,
    keywords: [
      { term: "Splice", meaning: "Relink existing nodes; don't allocate new ones." },
      { term: "Dummy + tail", meaning: "No special case for choosing the first node." },
      { term: "Stable merge", meaning: "`<=` keeps equal values in original order." },
    ],
    bonus: ["Attach the leftover list in one step instead of looping.", "Mention stability with `<=`.", "Connect it to Merge k Sorted Lists and merge sort on lists."],
    mistakes: ["Creating new nodes (wasteful; the problem says splice)", "Looping over the leftover one node at a time", "Returning dummy instead of dummy.next"],
    followUps: [
      { q: "Merge k sorted lists?", a: "Min-heap of the k heads: pop the smallest, attach it, push its next. O(N log k). Or merge pairs in rounds (divide and conquer), also O(N log k)." },
      { q: "Sort a linked list in O(n log n)?", a: "Merge sort: find the middle with slow/fast, cut, sort each half recursively, merge with this function." },
    ],
  },
  starter: `/**
 * class ListNode {
 *   val: number
 *   next: ListNode | null
 * }
 */
function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {

}`,
  tests: [
    { args: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
    { args: [[], []], expected: [], label: "Both empty" },
    { args: [[], [0]], expected: [0] },
    { args: [[5], [1, 2, 3]], expected: [1, 2, 3, 5] },
    { args: [[-3, 10], [0]], expected: [-3, 0, 10] },
  ],
};

export default note;
