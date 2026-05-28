# 012. Odd Even Linked List (Medium)

---

### 📝 1. Problem Statement
Given the `head` of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices, and return *the reordered list*.

The **first** node is considered **odd**, and the **second** node is **even**, and so on.

Note that the relative order inside both the even and odd groups should remain as it was in the input.

You must solve the problem in **$O(1)$** extra space complexity and **$O(N)$** time complexity.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `head = [1, 2, 3, 4, 5]`
* **Output**: `[1, 3, 5, 2, 4]`

#### Test Case 2
* **Input**: `head = [2, 1, 3, 5, 6, 4, 7]`
* **Output**: `[2, 3, 6, 7, 1, 5, 4]`

---

### 💬 3. What is This Problem Actually Asking?
We need to sort the linked list by the **positions** of the nodes (1st, 2nd, 3rd, 4th, 5th, ...), **not** by the numerical values stored inside them.
* E.g., all odd-position nodes (1st, 3rd, 5th, ...) must go first.
* All even-position nodes (2nd, 4th, 6th, ...) must follow.
* The relative order of both groups must be preserved.

The strict constraints are:
* **Linear Time ($O(N)$)**: Exactly one pass.
* **Constant Space ($O(1)$ Space)**: We cannot build new arrays or lists. We must divide and re-link the existing nodes completely in-place.

---

### 🌍 4. Real-Life Example
Think of a **deck of cards dealing game**:
* You have a pile of cards. You deal them out in two separate piles:
  * Pile A (Odd): gets Card 1, Card 3, Card 5...
  * Pile B (Even): gets Card 2, Card 4, Card 6...
* Once the dealing is finished, you simply **stack Pile A directly on top of Pile B**.
* This naturally splits and re-combines them perfectly!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Singly Linked List** (`ListNode`).
* **Algorithm**: **Two-Pointer List Division & Re-Linking**.
  * *Why*: We don't need complex variables. We can maintain two independent sub-list pointer paths:
    * `odd` pointer starting at `head`.
    * `even` pointer starting at `head.next`.
    * We also save a permanent reference to `evenHead = head.next` so we know where to connect the odd list's end at the very end.
    * We loop through the list. In each step:
      1. We connect odd's next pointer to the next odd node: `odd.next = even.next`.
      2. Advance odd: `odd = odd.next`.
      3. We connect even's next pointer to the next even node: `even.next = odd.next`.
      4. Advance even: `even = even.next`.
    * Once the loop finishes, we link the tail of the odd list directly to `evenHead`: `odd.next = evenHead`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

function oddEvenList(head: ListNode | null): ListNode | null {
    if (head === null || head.next === null) {
        return head;
    }

    let odd: ListNode = head;
    let even: ListNode = head.next;
    const evenHead: ListNode = even; // Save even head for final merging

    // We traverse until there are no more even nodes or even next nodes to swap
    while (even !== null && even.next !== null) {
        // Link odd node to the next odd node (which is following even)
        odd.next = even.next;
        odd = odd.next;

        // Link even node to the next even node (which is following odd)
        even.next = odd.next;
        even = even.next!;
    }

    // Connect the tail of the odd list directly to the head of the even list
    odd.next = evenHead;

    return head;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We traverse the list of length $N$ exactly once.
* **Space Complexity**: **$O(1)$** — All splitting and merging occurs completely in-place by re-wiring pointer arrows.

#### Edge Cases Handled:
* **Single Element or Two Element List** (`[1]` or `[1, 2]`): Initial `if (head === null || head.next === null)` check handles this and returns head immediately (Correct).
* **Odd Length List** (`[1, 2, 3, 4, 5]`):
  * `odd` pointer ends on `5` (`even` is at `4` and `even.next` becomes `null`, breaking the loop).
  * `odd.next` linked to `evenHead` (`2`). Returns `1 -> 3 -> 5 -> 2 -> 4` (Correct).
* **Even Length List** (`[1, 2, 3, 4]`):
  * `even` pointer ends on `4` (`even` is not null, but `even.next` is null, breaking the loop).
  * `odd` is at `3`. `odd.next` linked to `evenHead` (`2`). Returns `1 -> 3 -> 2 -> 4` (Correct).
