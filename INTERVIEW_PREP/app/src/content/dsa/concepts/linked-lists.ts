import type { ConceptNote } from "../../types.ts";

const note: ConceptNote = {
  slug: "linked-lists",
  title: "Linked lists & pointer rewiring",
  why: "All fourteen Linked List problems use the same five moves. Know the moves, draw the boxes, and none of them needs to be memorised.",
  minutes: 8,
  sections: [
    {
      heading: "What a linked list costs",
      body: `A linked list stores each value in its own **node**, and each node holds a pointer to the next one. The nodes can be anywhere in memory; only the \`next\` pointers hold the order together.

\`\`\`ts
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}
\`\`\`

That layout flips the array's costs around.

| Operation | Array | Linked list | Why |
| :--- | :--- | :--- | :--- |
| Read index i | O(1) | O(n) | must walk i nodes |
| Insert / delete at the front | O(n) | O(1) | rewire one pointer |
| Insert / delete after a known node | O(n) | O(1) | rewire two pointers |
| Search | O(n) | O(n) | scan either way |
| Find the length | O(1) | O(n) | unless you store a size |

**The point to say in an interview:** a linked list trades random access for cheap insert/delete **once you hold the node before the change**. Finding that node is still O(n).

**Singly vs doubly linked:** a doubly linked list also keeps \`prev\`, so deleting a node you hold is O(1) without searching for its predecessor. That's why an LRU cache is a hash map plus a doubly linked list.`,
    },
    {
      heading: "Move 1 — The dummy (sentinel) head",
      body: `Many list operations have a special case: "what if the head itself changes?" (deleting the first node, merging into an empty list, inserting at index 0).

Put a fake node in front of the head and the special case disappears. Every real node now has a predecessor.

\`\`\`ts
const dummy = new ListNode(0, head);
let prev = dummy;
// ... rewire using prev.next ...
return dummy.next; // the real head, even if it changed
\`\`\`

Used by **Design Linked List**, **Remove Linked List Elements**, **Remove Nth Node From End**, **Merge Two Sorted Lists**, **Add Two Numbers** and **Swap Nodes in Pairs**.`,
    },
    {
      heading: "Move 2 — Reverse in place (prev, cur, next)",
      body: `Walk the list and flip each \`next\` pointer to point backward. Three variables are enough:

\`\`\`ts
let prev: ListNode | null = null;
let cur = head;
while (cur) {
  const next = cur.next; // 1. save the rest of the list
  cur.next = prev;       // 2. flip the pointer
  prev = cur;            // 3. step prev forward
  cur = next;            // 4. step cur forward
}
return prev; // the new head
\`\`\`

The order matters: **save before you flip**, or the rest of the list is lost. O(n) time, O(1) space.

Used by **Reverse Linked List** and as a step inside **Palindrome Linked List**.`,
    },
    {
      heading: "Move 3 — Slow and fast pointers",
      body: `Move one pointer one step at a time and another two steps at a time.

- **Middle:** when \`fast\` reaches the end, \`slow\` is in the middle (**Middle of the Linked List**, **Palindrome Linked List**).
- **Cycle:** if there is a loop, \`fast\` laps \`slow\` and they meet; if not, \`fast\` reaches null (**Linked List Cycle**, Floyd's algorithm).
- **Gap of n:** start \`fast\` n steps ahead, then move both one step. When \`fast\` hits the end, \`slow\` is n from the end (**Remove Nth Node From End**).

The trick turns "I need the length first" (two passes) into one pass with O(1) space.`,
    },
    {
      heading: "Move 4 — Build a new chain with a tail pointer",
      body: `When the answer is a list you assemble node by node, keep a \`tail\` pointer and append: \`tail.next = node; tail = tail.next\`. Start from a dummy so the first append isn't special.

- **Merge Two Sorted Lists:** append the smaller head each step, then attach the leftover.
- **Add Two Numbers:** append one digit per step, carrying into the next.
- **Odd Even Linked List:** grow two chains (odd and even) at once, then join them.`,
    },
    {
      heading: "Move 5 — Two-pointer alignment",
      body: `When two lists of different lengths must be lined up, walk both, and when a pointer runs off the end, **switch it to the other list's head**. Both pointers then travel lenA + lenB steps and arrive at the shared node (or null) together.

Used by **Intersection of Two Linked Lists**. **Rotate List** uses a cousin of this idea: connect the tail to the head to make a ring, then cut it at the right place.`,
    },
    {
      heading: "How to not get lost",
      body: `Pointer bugs are the classic linked-list failure. Three habits prevent most of them:

1. **Draw boxes and arrows** for a 3-node list before coding. Interviewers expect it.
2. **Check every \`.next.next\`**: before reading \`a.next.next\`, make sure \`a.next\` isn't null. The loop condition \`while (fast && fast.next)\` is the standard guard.
3. **Test the tiny cases** out loud: empty list, one node, two nodes. Most off-by-one bugs show up there.`,
    },
  ],
  keywords: [
    { term: "Node / next pointer", meaning: "Each value lives in its own node; order is held by pointers, not memory layout." },
    { term: "Dummy (sentinel) node", meaning: "A fake head that removes the 'head changed' special case." },
    { term: "In-place reversal", meaning: "prev / cur / next; save before you flip." },
    { term: "Floyd's tortoise and hare", meaning: "Slow and fast pointers: find the middle, detect a cycle." },
    { term: "Pointer rewiring", meaning: "Changing next pointers instead of copying values." },
  ],
  bonus: [
    "Reach for a dummy node by default and say why: no special case when the head changes.",
    "Say \"save next before I overwrite it\" while reversing — it shows you know where the bug lives.",
    "Offer the O(1)-space version (slow/fast, in-place reverse) after a Set or array version.",
    "Mention you'd restore the list if you mutated it (Palindrome) when the caller still owns it.",
  ],
  questions: [
    { q: "When is a linked list better than an array?", a: "When you insert or delete in the middle or at the front often and already hold the node there. Each change is O(1) pointer rewiring instead of an O(n) shift. Arrays win for index access and cache locality." },
    { q: "What does a dummy node buy you?", a: "Every real node gets a predecessor, so deleting or inserting at the head is handled by the same code as anywhere else. Return dummy.next at the end." },
    { q: "Why does fast meet slow if there's a cycle?", a: "Inside the cycle, fast gains one node on slow every step. The gap shrinks by one each time, so it must hit zero — they meet within one lap." },
    { q: "Why is the loop guard `while (fast && fast.next)`?", a: "fast jumps two steps: fast.next.next. Both fast and fast.next must exist or the second hop reads a property of null." },
    { q: "Why are linked lists slower in practice than Big-O suggests?", a: "Nodes are scattered in memory, so walking a list misses the CPU cache far more than scanning an array. Same O(n), more real time." },
  ],
  recap: [
    "Index O(n), insert/delete after a held node O(1); finding the node is still O(n).",
    "Dummy head: no special case when the head changes — return dummy.next.",
    "Reverse: save next, flip, step prev, step cur.",
    "Slow/fast: middle, cycle, and n-from-the-end in one pass, O(1) space.",
    "Build with a tail pointer; align two lists by switching heads at the end.",
  ],
};

export default note;
