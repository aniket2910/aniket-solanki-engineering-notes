# 005. Remove Linked List Elements (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft


---

### 📝 1. Problem Statement
Given the `head` of a linked list and an integer `val`, remove all the nodes of the linked list that has `Node.val == val`, and return *the new head*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `head = [1, 2, 6, 3, 4, 5, 6]`, `val = 6`
* **Output**: `[1, 2, 3, 4, 5]`

#### Test Case 2
* **Input**: `head = []`, `val = 1`
* **Output**: `[]`

#### Test Case 3
* **Input**: `head = [7, 7, 7, 7]`, `val = 7`
* **Output**: `[]`

---

### 💬 3. What is This Problem Actually Asking?
We are given a linked list. We need to delete every single node in that list whose value matches a target number (`val`).

In a linked list, to delete a node:
* We must locate its **predecessor node** (the node right before it).
* We change `predecessor.next` to point directly to `nodeToDelete.next`, bypassing `nodeToDelete`.
* **The Catch**: If the node we want to delete is the **first node (head)** of the list, it has no predecessor! Standard deletion code would throw a null pointer exception. We must handle this boundary elegantly.

---

### 🌍 4. Real-Life Example
Think of a **train of passenger cars connected by coupling chains**:
* The conductor is told to decouple and remove all cars carrying "cargo of type X".
* To remove a middle car, the conductor simply unhooks the chain from the previous car and re-attaches it to the car *following* the X cargo car.
* If the *very first* engine car has to be removed, it's awkward because there is no car in front of it to hold the chain. 
* To make this simple, the conductor temporarily attaches a **dummy locomotive** (`dummyHead`) to the front of the train. Now, even the original first car is a middle car! 
* Once the sorting is finished, the conductor unhooks the dummy locomotive and the train starts from the first remaining car.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Singly Linked List** (`ListNode`).
* **Algorithm**: **Sentinel Node (Dummy Head) Pointer Skip**.
  * *Why*: We allocate a single dummy sentinel node `dummyHead` and point its `next` to the original `head`.
    * We place a `curr` pointer at `dummyHead`.
    * We traverse the list. While `curr.next` exists:
      * If `curr.next.val === val`: We skip the next node by doing `curr.next = curr.next.next`.
      * Otherwise, we advance our pointer: `curr = curr.next`.
    * In the end, the new list head is guaranteed to be at `dummyHead.next`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

For the linked list `head = [1, 2, 6, 3]`, `val = 6`:

#### **Step 0: Initial State**
```text
Pointers: curr = dummyHead
List:     [ -1 ] ──► [ 1 ] ──► [ 2 ] ──► [ 6 ] ──► [ 3 ] ──► null
            ▲
          curr
```

#### **Step 1: First Iteration**
```text
* Comparison: curr.next.val (1) !== val (6)
* Action:     Advance curr pointer
* Pointers:   curr = Node(1)
List:     [ -1 ] ──► [ 1 ] ──► [ 2 ] ──► [ 6 ] ──► [ 3 ] ──► null
                      ▲
                    curr
```

#### **Step 2: Second Iteration**
```text
* Comparison: curr.next.val (2) !== val (6)
* Action:     Advance curr pointer
* Pointers:   curr = Node(2)
List:     [ -1 ] ──► [ 1 ] ──► [ 2 ] ──► [ 6 ] ──► [ 3 ] ──► null
                                ▲
                              curr
```

#### **Step 3: Third Iteration**
```text
* Comparison: curr.next.val (6) === val (6)
* Action:     Bypass node: curr.next = curr.next.next (Node(3))
* Pointers:   curr = Node(2) (Does not advance)

Linkage State:
List:     [ -1 ] ──► [ 1 ] ──► [ 2 ] ───────────► [ 3 ] ──► null
                                ▲      └─► [ 6 ] ──x
                              curr
```

#### **Step 4: Fourth Iteration**
```text
* Comparison: curr.next.val (3) !== val (6)
* Action:     Advance curr pointer
* Pointers:   curr = Node(3)
List:     [ -1 ] ──► [ 1 ] ──► [ 2 ] ──► [ 3 ] ──► null
                                          ▲
                                        curr
```
* **Next**: `curr.next` is null, loop exits. Returns `dummyHead.next` (`[1, 2, 3]`).

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

function removeElements(head: ListNode | null, val: number): ListNode | null {
    // Create a sentinel dummy head node to handle deleting the actual head node elegantly
    const dummyHead = new ListNode(-1);
    dummyHead.next = head;

    let curr: ListNode = dummyHead;

    while (curr.next !== null) {
        if (curr.next.val === val) {
            // Bypass the node carrying target value
            curr.next = curr.next.next;
        } else {
            // Move pointer forward only if we didn't perform a deletion
            curr = curr.next;
        }
    }

    return dummyHead.next;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We traverse the list of length $N$ exactly once.
* **Space Complexity**: **$O(1)$** — We allocate only one sentinel node (`dummyHead`) and one pointer variable (`curr`).

#### Edge Cases Handled:
* **All Nodes Match Val** (`head = [7, 7]`, `val = 7`):
  * `dummyHead.next = Node(7)`.
  * `curr = dummyHead`.
  * Step 1: `curr.next.val === 7` $\rightarrow$ `dummyHead.next = dummyHead.next.next` (points to second `7`).
  * Step 2: `curr.next.val === 7` $\rightarrow$ `dummyHead.next = null`.
  * Loop exits. Returns `null` (Correct).
* **Empty List** (`head = null`): Loop condition `curr.next !== null` evaluates to false instantly. Returns `null` (Correct).
