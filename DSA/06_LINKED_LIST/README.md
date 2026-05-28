# 🔗 Topic 06: Linked Lists

Welcome to the **Linked Lists Revision Hub**. This page is your high-speed reference for pointer manipulation, sentinel nodes, fast/slow traversal mechanics, and solved problem catalogs.

---

## 📌 1. Core Linked List Theory (Quick Recall)
Before starting any pointer problem, keep these fundamental behaviors in mind:

* **Non-Contiguous Memory**: Unlike arrays, linked list nodes are scattered randomly in memory. Each node holds its value and a pointer reference pointing to the next node.
* **Sentinel (Dummy) Nodes**:
  * The **ultimate secret** to solving linked list deletions or swaps is to initialize a dummy node pointing to the head:
    `const dummyHead = new ListNode(-1); dummyHead.next = head;`
  * This guarantees that **every real node (including the head) always has a predecessor**, eliminating pesky edge cases and duplicate conditional logic for head modifications.
* **Basic Complexity Comparison**:

| Operation | Array | Singly Linked List |
| :--- | :---: | :---: |
| **Random Access (`get(index)`)** | $O(1)$ | $O(N)$ (must traverse step-by-step) |
| **Insert/Delete at Head** | $O(N)$ (requires shifting) | $O(1)$ (instant pointer change) |
| **Insert/Delete in Middle (once found)** | $O(N)$ (requires shifting) | $O(1)$ (instant pointer change) |
| **Memory Layout** | Contiguous | Scattered (Node objects linked via references) |

---

## 💡 2. The Three Core Linked List Patterns

Almost every linked list challenge is resolved using one of these three fundamental patterns:

### A. Fast & Slow Pointer (Tortoise & Hare)
* **What**: Maintaining two pointers starting at the head. The `fast` pointer moves twice as fast as the `slow` pointer in a loop.
* **Why**: 
  * **Finding the Middle**: When `fast` reaches the end, `slow` is exactly at the middle node.
  * **Cycle Detection**: If the list has a cycle, the `fast` pointer is guaranteed to lap and catch up to the `slow` pointer (`slow === fast`).

### B. Iterative List Reversal (Three-Pointer Pattern)
* **What**: Reversing the arrows of a linked list in-place using three tracking pointers:
  * `prev` (tracks previous node, starts at `null`)
  * `curr` (tracks current node, starts at `head`)
  * `nextTemp` (temporarily holds forward reference)
* **Reversal Step**:
  ```typescript
  const nextTemp = curr.next; // Save forward link
  curr.next = prev;           // Flip pointer backward
  prev = curr;                // Advance prev
  curr = nextTemp;            // Advance curr
  ```

### C. Dummy Head Merging / Splicing
* **What**: Building a new sorted/re-arranged list by stitching existing nodes together.
* **Why**: By anchoring the new list with a `dummyHead`, we can cleanly append nodes at the `curr` pointer using `curr.next = node` without worrying about head initialization logic.

---

## 📂 3. Problem Catalog

Use this list to track your progress and quickly open specific problem write-ups.

| Index | Problem Name | Difficulty | Core Pattern / Concept |
| :---: | :--- | :---: | :--- |
| `001` | [Design Linked List](./001-medium-design-linked-list.md) | 🟡 Medium | Custom Node construction & Sentinel Head |
| `002` | [Reverse Linked List](./002-easy-reverse-linked-list.md) 🔥 | 🟢 Easy | Three-Pointer Iterative Reversal |
| `003` | [Middle of the Linked List](./003-easy-middle-of-linked-list.md) 🔥 | 🟢 Easy | Fast & Slow Pointer |
| `004` | [Linked List Cycle](./004-easy-linked-list-cycle.md) 🔥 | 🟢 Easy | Floyd's Cycle Detection (Tortoise & Hare) |
| `005` | [Remove Linked List Elements](./005-easy-remove-linked-list-elements.md) | 🟢 Easy | Sentinel Dummy Node & Pointer Bypass |
| `006` | [Remove Duplicates from Sorted List](./006-easy-remove-duplicates-from-sorted-list.md) | 🟢 Easy | Adjacent Value Pointer Skip |
| `007` | [Merge Two Sorted Lists](./007-easy-merge-two-sorted-lists.md) 🔥 | 🟢 Easy | Sentinel Dummy Node & Pointer Merge |
| `008` | [Intersection of Two Linked Lists](./008-easy-intersection-of-two-linked-lists.md) 🔥 | 🟢 Easy | Cyclic Path-Equality Swap |
| `009` | [Palindrome Linked List](./009-easy-palindrome-linked-list.md) 🔥 | 🟢 Easy | Middle Finding + Reversal + Comparison |
| `010` | [Remove Nth Node From End of List](./010-medium-remove-nth-node-from-end-of-list.md) 🔥 | 🟡 Medium | Fast & Slow Pointer Offset Gap |
| `011` | [Swap Nodes in Pairs](./011-medium-swap-nodes-in-pairs.md) | 🟡 Medium | Pair Pointer Swap wiring |
| `012` | [Odd Even Linked List](./012-medium-odd-even-linked-list.md) | 🟡 Medium | Two-Pointer List Division & Merge |
| `013` | [Add Two Numbers](./013-medium-add-two-numbers.md) 🔥 | 🟡 Medium | Sentinel Dummy Head & Carry Addition |
| `014` | [Rotate List](./014-medium-rotate-list.md) | 🟡 Medium | Circular Loop Creation & Splitting |

---

> [!TIP]
> **Revision Checklist**: Whenever a problem involves **modifying the head node**, **swapping node pairs**, or **merging multiple lists**, always use a **Sentinel Dummy Node**! It reduces your code length by half and protects against null pointer exceptions.
