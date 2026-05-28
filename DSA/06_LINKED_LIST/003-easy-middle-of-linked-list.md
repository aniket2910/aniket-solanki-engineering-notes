# 003. Middle of the Linked List (Easy)

---

### 📝 1. Problem Statement
Given the `head` of a singly linked list, return *the middle node of the linked list*.

If there are two middle nodes, return **the second middle** node.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `head = [1, 2, 3, 4, 5]`
* **Output**: `[3, 4, 5]` (The middle node is `3`, and returning it returns the remaining chain starting from it).

#### Test Case 2
* **Input**: `head = [1, 2, 3, 4, 5, 6]`
* **Output**: `[4, 5, 6]` (The middle nodes are `3` and `4`, so we return the second middle node, which is `4`).

---

### 💬 3. What is This Problem Actually Asking?
We need to locate the exact center node of a linked list. 
* Unlike arrays where we can instantly find the middle element using index math (`Math.floor(length / 2)`), in a linked list, we **do not know the length** of the list beforehand.
* We must locate this middle node in a single traversal pass using minimal memory.

---

### 🌍 4. Real-Life Example
Imagine a **race track where two runners start at the same line**:
* **Runner A (Slow)** walks at a speed of **1 index per step**.
* **Runner B (Fast)** runs at a speed of **2 indices per step**.
* If they start running at the exact same moment:
  * When the Fast Runner crosses the finish line at the end of the track, the Slow Runner will be **exactly in the middle of the track**.

This is the quintessential **Fast & Slow Pointer** algorithm!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Singly Linked List** (`ListNode`).
* **Algorithm**: **Fast & Slow Pointer Pattern (Tortoise & Hare)**.
  * *Why*: We declare two pointer variables: `slow` and `fast`, both starting at `head`.
    * In each step, `slow` advances by one node (`slow = slow.next`).
    * `fast` advances by two nodes (`fast = fast.next.next`).
  * When `fast` reaches the end of the list (`null` or has no `next` node), the `slow` pointer is guaranteed to be sitting exactly on the middle node.

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

function middleNode(head: ListNode | null): ListNode | null {
    let slow: ListNode | null = head;
    let fast: ListNode | null = head;

    // fast moves twice as fast as slow.
    // When fast reaches the end, slow is in the middle.
    while (fast !== null && fast.next !== null) {
        slow = slow!.next;
        fast = fast.next.next;
    }

    return slow;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We traverse the list exactly once. The loop runs $N/2$ times.
* **Space Complexity**: **$O(1)$** — We only allocate two pointer variables (`slow`, `fast`).

#### Edge Cases Handled:
* **Single Element List** (`head = [1]`): `fast` starts at `Node(1)`. The loop condition `fast.next !== null` is false because `Node(1).next === null`. Loop is skipped, returns `slow` (`Node(1)`) (Correct).
* **Odd Length List** (`head = [1, 2, 3]`):
  * Step 1: `slow = Node(2)`, `fast = Node(3)`.
  * Loop terminates as `fast.next === null`. Returns `slow` (`Node(2)`) (Correct).
* **Even Length List** (`head = [1, 2, 3, 4]`):
  * Step 1: `slow = Node(2)`, `fast = Node(3)`.
  * Step 2: `slow = Node(3)`, `fast = null`.
  * Loop terminates as `fast === null`. Returns `slow` (`Node(3)`, which is the second middle node) (Correct).
