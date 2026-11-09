import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "remove-duplicates-from-sorted-list",
  pattern: "Skip equal neighbours",
  topics: ["Linked List"],
  companies: ["Amazon", "Microsoft", "Google", "Apple", "Bloomberg", "Adobe"],
  gist: "Keep one copy of each value in a sorted list — sorted means duplicates sit next to each other, so one pointer is enough.",
  statement: `Given the \`head\` of a **sorted** linked list, delete duplicates so each value appears only **once**. Return the list, still sorted.`,
  constraints: ["0 ≤ number of nodes ≤ 300", "-100 ≤ Node.val ≤ 100", "The list is sorted in ascending order"],
  examples: [
    { input: "head = [1, 1, 2]", output: "[1, 2]" },
    { input: "head = [1, 1, 2, 3, 3]", output: "[1, 2, 3]" },
  ],
  predict: [
    { input: "head = []", output: "[]", why: "Nothing to do." },
    { input: "head = [5, 5, 5]", output: "[5]", why: "A long run collapses to one node — stay on 5 while its next is 5." },
    { input: "head = [-1, 0, 0, 0, 3]", output: "[-1, 0, 3]", why: "Only the run of zeros shrinks." },
  ],
  edgeCases: ["Empty list", "No duplicates", "All the same value", "Run of duplicates at the tail"],
  hints: [
    "The list is sorted. Where are all the copies of a value?",
    "Stand on a node. If the next node has the same value, what can you do to it?",
    "cur = head; while (cur && cur.next): if equal, cur.next = cur.next.next (stay on cur); else cur = cur.next.",
  ],
  approaches: [
    {
      name: "Set of seen values",
      idea: "Walk with a predecessor pointer and a Set. If a node's value is already in the Set, unlink it. This also works on unsorted lists, but it ignores the sorted order and costs O(n) space.",
      complexity: { time: "O(n)", space: "O(n)", why: "One pass; the Set holds up to n values." },
      code: `function deleteDuplicates(head: ListNode | null): ListNode | null {
  if (!head) return head;
  const seen = new Set([head.val]);
  let prev = head;
  while (prev.next) {
    if (seen.has(prev.next.val)) prev.next = prev.next.next;
    else {
      seen.add(prev.next.val);
      prev = prev.next;
    }
  }
  return head;
}`,
    },
    {
      name: "Skip equal neighbours",
      idea: "Because the list is sorted, every duplicate is right after the first copy. Stand on `cur`: while `cur.next` has the same value, unlink it. When it differs, move on. The head never changes, so no dummy is needed.",
      complexity: { time: "O(n)", space: "O(1)", why: "Each node is looked at once; one pointer." },
      code: `function deleteDuplicates(head: ListNode | null): ListNode | null {
  let cur = head;
  while (cur && cur.next) {
    if (cur.next.val === cur.val) cur.next = cur.next.next;
    else cur = cur.next;
  }
  return head;
}`,
    },
  ],
  complexityTalk: `The sorted order is the whole point: it turns an O(n)-space Set into O(1) space, because duplicates can only be neighbours. Say that link out loud — interviewers want to hear you use the given constraints.

It's the linked-list twin of **Remove Duplicates from Sorted Array**. There you copy forward with a write pointer; here you unlink, which is cheaper because nothing shifts.`,
  interview: {
    script: `"Because the list is sorted, all copies of a value are next to each other. So I walk with one pointer, cur. If cur.next has the same value as cur, I unlink it with cur.next = cur.next.next and stay on cur, since the next one might be a duplicate too. If it's different, I move cur forward. The head is always kept, so I return it as is. O(n) time, O(1) space. For an unsorted list I'd need a Set of seen values instead."`,
    keywords: [
      { term: "Use the sorted property", meaning: "Duplicates are adjacent, so no Set is needed." },
      { term: "Unlink in place", meaning: "cur.next = cur.next.next." },
      { term: "Stay after unlinking", meaning: "Handles runs of 3+ equal values." },
    ],
    bonus: ["Point out the head never changes, so no dummy.", "Contrast with the unsorted version (Set).", "Mention Remove Duplicates II (drop all copies) as the harder sibling."],
    mistakes: ["Advancing cur after an unlink (misses the third copy)", "Guarding only `while (cur.next)` — crashes on an empty list", "Using a Set when sorted order makes it unnecessary"],
    followUps: [
      { q: "Remove every value that has duplicates, leaving only distinct ones?", a: "Remove Duplicates II: use a dummy (the head may go). When prev.next and prev.next.next are equal, skip the whole run of that value; otherwise advance prev." },
      { q: "Unsorted list?", a: "Set of seen values (O(n) space), or sort first with merge sort (O(n log n), O(1) extra on a list)." },
    ],
  },
  starter: `/**
 * class ListNode {
 *   val: number
 *   next: ListNode | null
 * }
 */
function deleteDuplicates(head: ListNode | null): ListNode | null {

}`,
  tests: [
    { args: [[1, 1, 2]], expected: [1, 2] },
    { args: [[1, 1, 2, 3, 3]], expected: [1, 2, 3] },
    { args: [[]], expected: [], label: "Empty list" },
    { args: [[5, 5, 5]], expected: [5], label: "All the same" },
    { args: [[-1, 0, 0, 0, 3]], expected: [-1, 0, 3] },
  ],
};

export default note;
