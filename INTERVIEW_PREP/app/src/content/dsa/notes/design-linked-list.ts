import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "design-linked-list",
  pattern: "Dummy head + size counter",
  topics: ["Linked List", "Design"],
  companies: ["Amazon", "Microsoft", "Google", "Adobe", "Bloomberg"],
  gist: "Build a singly linked list from scratch — the test is whether every index edge case goes through one code path.",
  statement: `Design a singly linked list with these methods (indexes are **0-based**):

- \`get(index)\` — the value at \`index\`, or \`-1\` if the index is invalid.
- \`addAtHead(val)\` — insert before the first element.
- \`addAtTail(val)\` — append as the last element.
- \`addAtIndex(index, val)\` — insert before the node at \`index\`. If \`index\` equals the length, append. If it is greater than the length, do nothing.
- \`deleteAtIndex(index)\` — delete the node at \`index\` if the index is valid.`,
  constraints: ["0 ≤ index, val ≤ 1000", "At most 2000 calls in total"],
  examples: [
    {
      input: `["MyLinkedList","addAtHead","addAtTail","addAtIndex","get","deleteAtIndex","get"]
[[],[1],[3],[1,2],[1],[1],[1]]`,
      output: "[null,null,null,null,2,null,3]",
      explain: "List goes 1 → 1,3 → 1,2,3; get(1) is 2; delete index 1 → 1,3; get(1) is 3.",
    },
  ],
  predict: [
    { input: "addAtIndex(0, 7) on an empty list, then get(0)", output: "7", why: "Index 0 equals the length 0, so it's a valid insert at the head." },
    { input: "addAtIndex(5, 7) on a list of length 2, then get(2)", output: "-1", why: "5 > length, so nothing is inserted." },
    { input: "addAtHead(0), get(0)", output: "0", why: "A stored value of 0 is a real value — don't treat it as 'missing'." },
  ],
  edgeCases: ["Insert at index 0 and at index == size", "Index greater than size (ignore)", "Delete the only node", "Stored value 0", "Negative index"],
  hints: [
    "Insert at head, insert at tail and insert at index are the same operation. Which index does each one mean?",
    "Keep a dummy node in front of the real head so inserting/deleting at index 0 needs no special case.",
    "Store the size. Every method then starts with one range check, and you walk to the node *before* the index (index steps from the dummy).",
  ],
  approaches: [
    {
      name: "Special-case the head",
      idea: "Store a real `head` that can be null. Every method checks for an empty list and for index 0 separately. It works, but there are many branches and each one is a place for a bug.",
      complexity: { time: "O(index) per call", space: "O(n)", why: "Each call walks up to index nodes; the list holds n nodes." },
      code: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

class MyLinkedList {
  head: ListNode | null = null;
  size = 0;

  get(index: number): number {
    if (index < 0 || index >= this.size) return -1;
    let cur = this.head!;
    for (let i = 0; i < index; i++) cur = cur.next!;
    return cur.val;
  }

  addAtHead(val: number): void {
    this.head = new ListNode(val, this.head);
    this.size++;
  }

  addAtTail(val: number): void {
    this.addAtIndex(this.size, val);
  }

  addAtIndex(index: number, val: number): void {
    if (index < 0 || index > this.size) return;
    if (index === 0) return this.addAtHead(val);
    let prev = this.head!;
    for (let i = 0; i < index - 1; i++) prev = prev.next!;
    prev.next = new ListNode(val, prev.next);
    this.size++;
  }

  deleteAtIndex(index: number): void {
    if (index < 0 || index >= this.size) return;
    if (index === 0) this.head = this.head!.next;
    else {
      let prev = this.head!;
      for (let i = 0; i < index - 1; i++) prev = prev.next!;
      prev.next = prev.next!.next;
    }
    this.size--;
  }
}`,
    },
    {
      name: "Dummy head, one code path",
      idea: "A dummy node always sits in front of the real head, so every real node has a predecessor. `addAtHead` is `addAtIndex(0)`, `addAtTail` is `addAtIndex(size)`, and both insert and delete just walk `index` steps from the dummy to the predecessor and rewire one pointer.",
      complexity: { time: "O(index) per call", space: "O(n)", why: "Walking to the predecessor takes index steps; head inserts are O(1)." },
      code: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

class MyLinkedList {
  private dummy = new ListNode();
  private size = 0;

  /** The node before position index (the dummy for index 0). */
  private before(index: number): ListNode {
    let prev = this.dummy;
    for (let i = 0; i < index; i++) prev = prev.next!;
    return prev;
  }

  get(index: number): number {
    if (index < 0 || index >= this.size) return -1;
    return this.before(index).next!.val;
  }

  addAtHead(val: number): void {
    this.addAtIndex(0, val);
  }

  addAtTail(val: number): void {
    this.addAtIndex(this.size, val);
  }

  addAtIndex(index: number, val: number): void {
    if (index < 0 || index > this.size) return;
    const prev = this.before(index);
    prev.next = new ListNode(val, prev.next);
    this.size++;
  }

  deleteAtIndex(index: number): void {
    if (index < 0 || index >= this.size) return;
    const prev = this.before(index);
    prev.next = prev.next!.next;
    this.size--;
  }
}`,
    },
  ],
  complexityTalk: `Every operation is O(index): you must walk to the predecessor. \`addAtHead\` is O(1); \`addAtTail\` is O(n) because a singly linked list has no shortcut to the end.

The usual follow-up is "make \`addAtTail\` O(1)". Keep a \`tail\` pointer and update it on every insert/delete that touches the end. The bigger upgrade is a **doubly linked list** with dummies at both ends: you can walk from whichever end is closer (at most n/2 steps) and delete a held node in O(1).

The range checks are where interviews are won or lost: **get and delete** accept \`0 ≤ index < size\`; **addAtIndex** accepts \`0 ≤ index ≤ size\` (equal to size means append).`,
  interview: {
    script: `"I'll use a dummy head node so every real node has a predecessor, and I'll keep a size counter. Then addAtHead is addAtIndex(0) and addAtTail is addAtIndex(size), so there's really only one insert. For insert and delete, I walk index steps from the dummy to reach the node before the position, and rewire one pointer. Range checks: get and delete need 0 ≤ index < size; insert allows index == size, which means append. Each operation is O(index), O(1) for the head. If tail inserts need to be O(1), I'd add a tail pointer, or switch to a doubly linked list with two sentinels."`,
    keywords: [
      { term: "Sentinel / dummy head", meaning: "Removes the index-0 special case for insert and delete." },
      { term: "Predecessor walk", meaning: "Walk to the node before the index, then rewire." },
      { term: "Size invariant", meaning: "size always equals the number of real nodes; one range check per method." },
    ],
    bonus: ["Express addAtHead/addAtTail through addAtIndex.", "Point out the two different range checks (< size vs ≤ size).", "Offer a tail pointer or doubly linked list for O(1) tail inserts."],
    mistakes: [
      "Testing `node.val` for truthiness — a stored 0 looks missing",
      "Allowing index == size in get/delete (walks off the end)",
      "Forgetting to update size on insert/delete",
      "Making the head nullable and then forgetting the empty-list branch",
    ],
    followUps: [
      { q: "Make addAtTail O(1)?", a: "Keep a tail pointer. Update it when inserting at index == size and when deleting the last node (tail becomes the predecessor)." },
      { q: "How would a doubly linked list change things?", a: "Each node has prev and next; dummies at both ends. Walk from the closer end (≤ n/2 steps), and delete a held node in O(1) since you have its prev." },
      { q: "Where is this used for real?", a: "LRU cache (hash map → doubly linked list node), browser history, undo stacks, OS free-lists." },
    ],
  },
  starter: `class MyLinkedList {
  constructor() {

  }

  get(index: number): number {

  }

  addAtHead(val: number): void {

  }

  addAtTail(val: number): void {

  }

  addAtIndex(index: number, val: number): void {

  }

  deleteAtIndex(index: number): void {

  }
}`,
  tests: [
    {
      args: [
        ["MyLinkedList", "addAtHead", "addAtTail", "addAtIndex", "get", "deleteAtIndex", "get"],
        [[], [1], [3], [1, 2], [1], [1], [1]],
      ],
      expected: [null, null, null, null, 2, null, 3],
    },
    {
      args: [
        ["MyLinkedList", "addAtIndex", "get", "addAtIndex", "get", "deleteAtIndex", "get"],
        [[], [0, 7], [0], [5, 9], [1], [0], [0]],
      ],
      expected: [null, null, 7, null, -1, null, -1],
      label: "Insert into empty, ignore index > size",
    },
    {
      args: [
        ["MyLinkedList", "addAtHead", "get", "addAtTail", "get", "deleteAtIndex", "get"],
        [[], [0], [0], [4], [1], [2], [1]],
      ],
      expected: [null, null, 0, null, 4, null, 4],
      label: "Stored 0, invalid delete",
    },
  ],
};

export default note;
