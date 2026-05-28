# 011. Swap Nodes in Pairs (Medium)

---

### 📝 1. Problem Statement
Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed.)

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `head = [1, 2, 3, 4]`
* **Output**: `[2, 1, 4, 3]`

#### Test Case 2
* **Input**: `head = []`
* **Output**: `[]`

#### Test Case 3
* **Input**: `head = [1]`
* **Output**: `[1]`

---

### 💬 3. What is This Problem Actually Asking?
We need to group all adjacent elements in pairs and **swap the two nodes in each pair**. 
* E.g., `1 -> 2 -> 3 -> 4` becomes `2 -> 1 -> 4 -> 3`.
* We are **not allowed to just swap the values inside the nodes** (e.g. `node1.val = 2`, `node2.val = 1`). We must physically swap the node objects by re-wiring their pointer arrows.
* To manage head swaps easily, we should anchor our list using a **Sentinel Dummy Node**.

---

### 🌍 4. Real-Life Example
Think of a **line of couples dancing at a ball**:
* The host shouts "Swap partners!".
* In each couple `[Person A, Person B]`, they swap their relative positions so that it becomes `[Person B, Person A]`.
* To do this physically, the person standing *behind* the couple must link hands with the new front partner, and the couple must swap their own linkages. 
* Once the swap is complete, the host walks to the next couple in line and repeats the process.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Singly Linked List** (`ListNode`).
* **Algorithm**: **Sentinel Dummy Node + Pair Pointer Swapping Loop**.
  * *Why*: We declare a `dummyHead` sentinel node pointing to `head`.
    * We place a `prev` pointer at `dummyHead`.
    * While there is a pair of nodes to swap (`curr = prev.next` and `nextPair = curr.next` exist):
      * Let `firstNode = curr`.
      * Let `secondNode = nextPair`.
      * We perform the swap using three re-wiring updates:
        1. Connect previous node to second node: `prev.next = secondNode`.
        2. Swap the pair link: `firstNode.next = secondNode.next`.
        3. Reverse the pair arrow: `secondNode.next = firstNode`.
      * We advance `prev` past the swapped pair: `prev = firstNode`.
    * Returns `dummyHead.next`.

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

function swapPairs(head: ListNode | null): ListNode | null {
    // Sentinel Dummy Node to handle swapping the head node elegantly
    const dummyHead = new ListNode(-1);
    dummyHead.next = head;

    let prev: ListNode = dummyHead;

    // We only loop if there is an adjacent pair of nodes to swap
    while (prev.next !== null && prev.next.next !== null) {
        const firstNode: ListNode = prev.next;
        const secondNode: ListNode = prev.next.next;

        // Perform the three re-wiring steps:
        // 1. Link the predecessor to the second node of the pair
        prev.next = secondNode;
        // 2. Link the first node to the remainder of the list following the second node
        firstNode.next = secondNode.next;
        // 3. Point the second node back to the first node to complete the swap
        secondNode.next = firstNode;

        // Move prev forward past the swapped pair. 
        // firstNode is now at the back of the pair, so it becomes the predecessor for the next pair!
        prev = firstNode;
    }

    return dummyHead.next;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We traverse the list of length $N$ exactly once.
* **Space Complexity**: **$O(1)$** — All swapping occurs in-place by re-wiring pointer arrows.

#### Edge Cases Handled:
* **Single Element List** (`head = [1]`): Loop condition `prev.next.next !== null` evaluates to false instantly since `dummyHead.next.next === null`. Returns `head` unchanged (Correct).
* **Odd Length List** (`[1, 2, 3]`):
  * First pair `[1, 2]` is swapped successfully $\rightarrow$ list becomes `2 -> 1 -> 3`.
  * `prev` becomes `Node(1)`.
  * In the next loop iteration, `prev.next = Node(3)`, but `prev.next.next = null`. Loop terminates. Returns `2 -> 1 -> 3` (Correct).
* **Empty List** (`head = null`): Loop condition `prev.next !== null` is false. Returns `null` (Correct).
