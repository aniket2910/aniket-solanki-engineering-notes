import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "intersection-of-two-linked-lists",
  pattern: "Two-pointer alignment (switch heads)",
  topics: ["Linked List", "Two Pointers", "Hash Table"],
  companies: ["Amazon", "Microsoft", "Meta", "Google", "Apple", "Bloomberg", "Adobe"],
  gist: "Find the node where two lists merge, without knowing their lengths — two pointers that swap lists line themselves up.",
  statement: `Given the heads \`headA\` and \`headB\` of two singly linked lists, return the **node** where they intersect. If they don't intersect, return \`null\`.

Intersection means the **same node object**, not equal values. After that node, the two lists share every node to the end. The lists must keep their original structure.

In the examples, \`intersectVal\`, \`skipA\` and \`skipB\` only describe how the test is built; your function receives just the two heads.`,
  constraints: ["1 ≤ m, n ≤ 3 × 10⁴", "1 ≤ Node.val ≤ 10⁵", "No cycles anywhere"],
  examples: [
    {
      input: "intersectVal = 8, listA = [4, 1, 8, 4, 5], listB = [5, 6, 1, 8, 4, 5], skipA = 2, skipB = 3",
      output: "8",
      explain: "Both lists share the nodes 8 → 4 → 5. The two 1s are different nodes with equal values.",
    },
    { input: "intersectVal = 0, listA = [2, 6, 4], listB = [1, 5], skipA = 3, skipB = 2", output: "null" },
  ],
  predict: [
    { input: "listA = [1, 9, 1, 2, 4], listB = [3, 2, 4], meeting at the 2", output: "2", why: "A walks 3 own + 1 of B's private part; B walks 1 own + 3 of A's; both arrive at 2 after 4 steps." },
    { input: "Lists of different lengths with no shared node", output: "null", why: "Both pointers reach null after m + n steps at the same time." },
    { input: "Both heads are the same node", output: "That node", why: "They're equal before the loop even runs." },
  ],
  edgeCases: ["No intersection", "Intersection at the very first node", "Very different lengths", "Equal values at different nodes"],
  hints: [
    "A Set of the nodes in list A answers it in O(m) space. Can you avoid the Set?",
    "If both lists had the same length before the shared part, walking both together would meet at the shared node. How can you cancel the length difference?",
    "Walk pointer a through A then B, and pointer b through B then A. Both travel m + n nodes, so they arrive at the shared node (or null) on the same step.",
  ],
  approaches: [
    {
      name: "Set of nodes from A",
      idea: "Put every node of A in a Set. Walk B; the first node found in the Set is the intersection.",
      complexity: { time: "O(m + n)", space: "O(m)", why: "One pass over each list; the Set holds A's nodes." },
      code: `function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  const inA = new Set<ListNode>();
  for (let a = headA; a; a = a.next) inA.add(a);
  for (let b = headB; b; b = b.next) if (inA.has(b)) return b;
  return null;
}`,
    },
    {
      name: "Measure lengths, align, walk together",
      idea: "Count both lengths. Advance the longer list's pointer by the difference, so both are the same distance from the end. Walk both together until they're the same node.",
      complexity: { time: "O(m + n)", space: "O(1)", why: "Two counting passes plus one walk." },
      code: `function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  const len = (h: ListNode | null) => {
    let n = 0;
    for (; h; h = h.next) n++;
    return n;
  };
  let a = headA;
  let b = headB;
  let diff = len(a) - len(b);
  for (; diff > 0; diff--) a = a!.next;
  for (; diff < 0; diff++) b = b!.next;
  while (a !== b) {
    a = a!.next;
    b = b!.next;
  }
  return a;
}`,
    },
    {
      name: "Switch heads",
      idea: "Walk `a` and `b` one step at a time. When `a` falls off A, restart it at headB; when `b` falls off B, restart it at headA. Each pointer travels (A's private part + shared + B's private part), so they reach the shared node together — or both reach null together if there is none.",
      complexity: { time: "O(m + n)", space: "O(1)", why: "Each pointer walks at most m + n nodes." },
      code: `function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  let a = headA;
  let b = headB;
  while (a !== b) {
    a = a ? a.next : headB;
    b = b ? b.next : headA;
  }
  return a;
}`,
    },
  ],
  complexityTalk: `All three are O(m + n) time. The Set costs O(m) space; the other two are O(1).

Why the switch trick terminates even without an intersection: both pointers travel exactly m + n nodes and then both are null, and \`null === null\` ends the loop. That's the detail interviewers poke at — say it before they ask.

The length-difference version is easier to explain from scratch; the switch version is shorter. Either is a full answer.`,
  interview: {
    script: `"Intersection means the same node, so I compare references. A Set of A's nodes works in O(m) space. For O(1): I walk two pointers, one per list. When a pointer reaches the end of its list, I send it to the head of the other list. Both pointers then cover A's unique part, B's unique part and the shared part — the same total — so they arrive at the intersection on the same step. If there's no intersection they both become null after m + n steps and the loop ends. O(m + n) time, O(1) space, and the lists aren't modified."`,
    keywords: [
      { term: "Reference equality", meaning: "Same node object, not equal values." },
      { term: "Length alignment", meaning: "Cancel the length difference so both pointers are equally far from the end." },
      { term: "Termination via null === null", meaning: "Why the loop ends when there's no intersection." },
    ],
    bonus: ["Explain why the no-intersection case terminates.", "Mention you don't modify either list.", "Offer the length-difference version as the easier-to-prove alternative."],
    mistakes: ["Comparing values", "Switching heads when the pointer is at the last node instead of at null (skips the null meeting and loops forever)", "Modifying a list to mark visited nodes"],
    followUps: [
      { q: "What if the lists might have cycles?", a: "Detect each cycle with Floyd's first. If one has a cycle and the other doesn't, they can't intersect; if both do, they intersect only if they share the cycle." },
      { q: "Another O(1) trick?", a: "Temporarily link A's tail to headB and run Linked List Cycle II from headA; the cycle start is the intersection. Then undo the link." },
    ],
  },
  starter: `/**
 * class ListNode {
 *   val: number
 *   next: ListNode | null
 * }
 */
function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {

}`,
};

export default note;
