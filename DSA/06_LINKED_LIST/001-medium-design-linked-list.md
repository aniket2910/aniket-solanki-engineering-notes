# 001. Design Linked List (Medium)

---

### 📝 1. Problem Statement
Design your implementation of the linked list. You can choose to use a singly or doubly linked list.
A node in a singly linked list should have two attributes: `val` and `next`. `val` is the value of the current node, and `next` is a pointer/reference to the next node.

Implement the `MyLinkedList` class:
* `MyLinkedList()` Initializes the `MyLinkedList` object.
* `int get(int index)` Get the value of the `index-th` node in the linked list. If the index is invalid, return `-1`.
* `void addAtHead(int val)` Add a node of value `val` before the first element of the linked list. After the insertion, the new node will be the first node of the linked list.
* `void addAtTail(int val)` Append a node of value `val` as the last element of the linked list.
* `void addAtIndex(int index, int val)` Add a node of value `val` before the `index-th` node in the linked list. If `index` equals the length of the linked list, the node will be appended to the end of the list. If `index` is greater than the length, the node will not be inserted. If `index` is negative or less than the length, the node will be inserted at the head of the list.
* `void deleteAtIndex(int index)` Delete the `index-th` node in the linked list, if the index is valid.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**:
  `["MyLinkedList", "addAtHead", "addAtTail", "addAtIndex", "get", "deleteAtIndex", "get"]`
  `[[], [1], [3], [1, 2], [1], [1], [1]]`
* **Output**:
  `[null, null, null, null, 2, null, 3]`
* **Why**:
  1. `MyLinkedList myLinkedList = new MyLinkedList();`
  2. `myLinkedList.addAtHead(1);` $\rightarrow$ List is `1`
  3. `myLinkedList.addAtTail(3);` $\rightarrow$ List is `1 -> 3`
  4. `myLinkedList.addAtIndex(1, 2);` $\rightarrow$ List is `1 -> 2 -> 3` (2 is at index 1)
  5. `myLinkedList.get(1);` $\rightarrow$ Returns `2`
  6. `myLinkedList.deleteAtIndex(1);` $\rightarrow$ List becomes `1 -> 3`
  7. `myLinkedList.get(1);` $\rightarrow$ Returns `3`

---

### 💬 3. What is This Problem Actually Asking?
We need to build a custom Linked List data structure from scratch. Instead of using a standard Array (which stores elements continuously in memory), we must build a chain of independent **Node** objects where each node simply holds its own value and a reference pointer pointing to the next node.

To make insertion and deletion easy, we should use a **Sentinel/Dummy Head Node** at the start of our list. This is a helper node that doesn't hold real data, but prevents us from having to write annoying conditional statements for empty-list boundaries.

---

### 🌍 4. Real-Life Example
Think of a **treasure hunt / scavenger hunt**:
* You are given the first clue. You walk to the location, find the clue box, read the note inside, and it tells you the location of the next clue.
* The clues are not stored in one place. They are scattered all over the city (independent nodes).
* If you want to insert a new clue card between Clue 1 and Clue 2:
  * You open the card box of Clue 1.
  * You change its written note to point to your new clue.
  * In your new clue box, you place a note pointing to the original Clue 2.
  * You didn't have to move a single clue box in the city!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Singly Linked List** (Node class with `val` and `next`).
  * *Why*: Singly linked list is lightweight, has fast $O(1)$ insertions/deletions at the head once we locate the position, and requires no contiguous memory blocks.
* **Helper Tool**: **Sentinel (Dummy) Node**.
  * *Why*: By initializing our list with a permanent dummy node at index `-1` (`head = new Node(-1)`), the actual first node of our list is always `head.next`. This guarantees that every real node—including the first one—always has a predecessor node, removing duplicate edge-case logic for head modifications.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class MyNode {
    val: number;
    next: MyNode | null;

    constructor(val: number) {
        this.val = val;
        this.next = null;
    }
}

class MyLinkedList {
    private dummyHead: MyNode;
    private size: number;

    constructor() {
        this.dummyHead = new MyNode(-1); // Sentinel Node
        this.size = 0;
    }

    // Helper: Traverse to the node right BEFORE the index
    private getPredecessor(index: number): MyNode | null {
        if (index < 0 || index > this.size) return null;
        let curr: MyNode = this.dummyHead;
        for (let i = 0; i < index; i++) {
            if (curr.next) {
                curr = curr.next;
            }
        }
        return curr;
    }

    get(index: number): number {
        if (index < 0 || index >= this.size) {
            return -1;
        }
        // The node itself is at index + 1 relative to dummyHead
        const pred = this.getPredecessor(index);
        return pred && pred.next ? pred.next.val : -1;
    }

    addAtHead(val: number): void {
        this.addAtIndex(0, val);
    }

    addAtTail(val: number): void {
        this.addAtIndex(this.size, val);
    }

    addAtIndex(index: number, val: number): void {
        if (index > this.size) return;
        if (index < 0) index = 0;

        const pred = this.getPredecessor(index);
        if (pred) {
            const newNode = new MyNode(val);
            newNode.next = pred.next;
            pred.next = newNode;
            this.size++;
        }
    }

    deleteAtIndex(index: number): void {
        if (index < 0 || index >= this.size) return;

        const pred = this.getPredecessor(index);
        if (pred && pred.next) {
            pred.next = pred.next.next;
            this.size--;
        }
    }
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**:
  * `get(index)`: **$O(N)$** — Must traverse index steps.
  * `addAtHead(val)`: **$O(1)$** — Instant insertion.
  * `addAtTail(val)`: **$O(N)$** — Must traverse to the end of the list.
  * `addAtIndex(index, val)`: **$O(N)$** — Must traverse index steps to find the predecessor.
  * `deleteAtIndex(index)`: **$O(N)$** — Must traverse index steps to find the predecessor.
* **Space Complexity**: **$O(N)$** — Space used by $N$ node objects to store the list data.

#### Edge Cases Handled:
* **Empty List Operations**: Initializing the list with a sentinel `dummyHead` ensures `getPredecessor(0)` returns `dummyHead` safely, permitting head insertions on empty lists without throwing null pointer exceptions (Correct).
* **Out of Bound Indexes**: The helper method `getPredecessor` instantly checks and blocks negative or overflowing indexes (Correct).
