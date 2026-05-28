# 002. Reverse Linked List (Easy)

---

### 📝 1. Problem Statement
Given the `head` of a singly linked list, reverse the list, and return *the reversed list*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `head = [1, 2, 3, 4, 5]`
* **Output**: `[5, 4, 3, 2, 1]`

#### Test Case 2
* **Input**: `head = [1, 2]`
* **Output**: `[2, 1]`

#### Test Case 3
* **Input**: `head = []`
* **Output**: `[]`

---

### 💬 3. What is This Problem Actually Asking?
We are given a chain of nodes. Each node currently points to its right neighbor. We need to **reverse all the pointer arrows** so that each node points to its left neighbor instead, making the original tail node the new head of our list.

The strict constraints are:
* **In-Place Modification**: We must reverse the list by changing the pointers of the existing nodes. We cannot allocate new node memory ($O(1)$ auxiliary space limit).

---

### 🌍 4. Real-Life Example
Imagine a **conga line of people, where each person holds the shoulders of the person in front of them**:
* The first person (`head`) is leading.
* To reverse the line, the leader stops. 
* The second person lets go of the leader's shoulders, turns around, and places their hands on the leader's shoulders.
* The third person lets go of the second person, turns around, and places their hands on the second person's shoulders.
* They repeat this one-by-one down the line until the last person in the original line is now leading the entire group.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Singly Linked List** (using `ListNode` with `val` and `next`).
* **Algorithm**: **Three-Pointer Iterative Reversal**.
  * *Why*: We traverse the list node-by-node. For each node, we need to flip its `next` pointer backward. Because flipping it backward breaks our connection to the rest of the list, we must temporarily remember the next node *before* doing the flip. 
  * We use three pointers to coordinate this perfectly:
    1. `prev` (tracks the previous node, initially `null`).
    2. `curr` (tracks the current node we are processing, initially `head`).
    3. `nextTemp` (temporarily holds the forward connection).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

For the linked list `head = [1, 2]`:

#### **Step 0: Initial State**
```text
Pointers: prev = null, curr = Node(1)
List:     [ 1 ] ──► [ 2 ] ──► null
           ▲
          curr
```

#### **Step 1: First Iteration (curr = Node(1))**
```text
1. Save next: nextTemp = curr.next (Node(2))
2. Reverse:   curr.next = prev (null)
3. Advance:   prev = curr (Node(1)), curr = nextTemp (Node(2))

Linkage State:
          null ◄── [ 1 ]        [ 2 ] ──► null
                    ▲            ▲
                  prev          curr
```

#### **Step 2: Second Iteration (curr = Node(2))**
```text
1. Save next: nextTemp = curr.next (null)
2. Reverse:   curr.next = prev (Node(1))
3. Advance:   prev = curr (Node(2)), curr = nextTemp (null)

Linkage State:
          null ◄── [ 1 ] ◄── [ 2 ]
                              ▲     ▲
                            prev   curr (null)
```
* **Next**: `curr` is null, loop exits. Returns `prev` (`Node(2)` -> `[2, 1]`).

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

function reverseList(head: ListNode | null): ListNode | null {
    let prev: ListNode | null = null;
    let curr: ListNode | null = head;

    while (curr !== null) {
        // Step 1: Save the next node before breaking the connection
        const nextTemp: ListNode | null = curr.next;

        // Step 2: Flip the arrow backward
        curr.next = prev;

        // Step 3: Move pointers forward
        prev = curr;
        curr = nextTemp;
    }

    // prev will end up pointing to the new head of the reversed list
    return prev;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We traverse the list of length $N$ exactly once.
* **Space Complexity**: **$O(1)$** — We only allocate pointer variables (`prev`, `curr`, `nextTemp`), modifying all node arrows completely in-place.

#### Edge Cases Handled:
* **Empty List** (`head = null`): The loop doesn't run. Returns `prev` (`null`) (Correct).
* **Single Node List** (`head = [1]`):
  * `curr = Node(1)`, `nextTemp = null`.
  * `curr.next = prev` (makes `Node(1).next = null`).
  * `prev` becomes `Node(1)`, `curr` becomes `null`.
  * Returns `prev` (`Node(1)`) (Correct).
