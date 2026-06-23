# 010. Remove Nth Node From End of List (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft, Google


---

### 📝 1. Problem Statement
Given the `head` of a linked list, remove the `nth` node from the end of the list and return its head.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `head = [1, 2, 3, 4, 5]`, `n = 2`
* **Output**: `[1, 2, 3, 5]`
* **Why**: We remove the second node from the end (which is `4`), leaving the list as `1 -> 2 -> 3 -> 5`.

#### Test Case 2
* **Input**: `head = [1]`, `n = 1`
* **Output**: `[]`

#### Test Case 3
* **Input**: `head = [1, 2]`, `n = 1`
* **Output**: `[1]`

---

### 💬 3. What is This Problem Actually Asking?
We need to delete a node that is positioned relative to the **end** of the list (right-to-left) rather than the beginning (left-to-right).

The strict constraints are:
* **Single Pass Traversal**: We must find and delete the node in **exactly one pass** of the list. (We cannot walk the list once to find its total length $L$, then walk it a second time to delete the node at index $L - n$).
* **Constant Space**: We must do everything in-place with $O(1)$ extra space.

To make deleting the first node of the list easy (in case we need to delete the head node), we should anchor our list using a **Sentinel Dummy Node**.

---

### 🌍 4. Real-Life Example
Imagine a **line of people standing at a counter**:
* You are told to remove the **2nd person from the back** of the line, but you are not allowed to count the total number of people first.
* To solve this:
  * You send a scout **Runner A (Fast)** to walk ahead. They step exactly **2 people forward** in the line.
  * Now, you place **Runner B (Slow)** at the beginning of the line.
  * Both Runner A and Runner B now start walking forward at the **exact same speed** (1 person per step), maintaining their exact 2-person gap.
  * When Runner A reaches the very end of the line, **Runner B will be standing exactly right before the target person!** You can instantly tap that person on the shoulder and ask them to leave.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Singly Linked List** (`ListNode`).
* **Algorithm**: **Sentinel Dummy Node + Fast & Slow Pointer Offset Gap**.
  * *Why*: We allocate a `dummyHead` sentinel node and point its `next` to `head`.
    * We place both `slow` and `fast` pointers at `dummyHead`.
    * We advance `fast` forward by exactly `n + 1` steps. This establishes an offset gap of `n` nodes between them.
    * We then advance both `slow` and `fast` together by one step at a time until `fast` hits `null` (the end of the list).
    * Because of the `n` node gap, `slow` is guaranteed to land exactly on the **predecessor node** of the target node we want to delete.
    * We skip the node: `slow.next = slow.next.next`.
    * Returns `dummyHead.next`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

For the linked list `head = [1, 2, 3, 4]`, `n = 2` (deleting the 2nd node from the end, which is `3`):

#### **Step 0: Initial State**
```text
Pointers: slow = dummyHead, fast = dummyHead
List:     [ -1 ] ──► [ 1 ] ──► [ 2 ] ──► [ 3 ] ──► [ 4 ] ──► null
            ▲
        slow/fast
```

#### **Step 1: Establish Gap of n + 1 (n = 2, so 3 steps forward for fast)**
1. `fast = dummyHead.next` (`Node(1)`)
2. `fast = Node(1).next` (`Node(2)`)
3. `fast = Node(2).next` (`Node(3)`)
```text
List:     [ -1 ] ──► [ 1 ] ──► [ 2 ] ──► [ 3 ] ──► [ 4 ] ──► null
            ▲                             ▲
          slow                          fast
```

#### **Step 2: Advance both slow and fast together until fast is null**
* **Iteration 1**: `slow = slow.next` (`Node(1)`), `fast = fast.next` (`Node(4)`)
```text
List:     [ -1 ] ──► [ 1 ] ──► [ 2 ] ──► [ 3 ] ──► [ 4 ] ──► null
                      ▲                             ▲
                    slow                          fast
```

* **Iteration 2**: `slow = slow.next` (`Node(2)`), `fast = fast.next` (`null`)
```text
List:     [ -1 ] ──► [ 1 ] ──► [ 2 ] ──► [ 3 ] ──► [ 4 ] ──► null
                                ▲                             ▲
                              slow                          fast (null)
```

#### **Step 3: Bypass Target Node (slow.next = slow.next.next)**
* **Target node is**: `Node(3)`
* **Action**: Link `Node(2).next` directly to `Node(4)` (bypassing `Node(3)`).
```text
List:     [ -1 ] ──► [ 1 ] ──► [ 2 ] ───────────► [ 4 ] ──► null
                                ▲      └─► [ 3 ] ──x
                              slow
```
* **Returns**: `dummyHead.next` (`[1, 2, 4]`).

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

function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
    // Sentinel Dummy Node to handle deleting the head node elegantly
    const dummyHead = new ListNode(-1);
    dummyHead.next = head;

    let slow: ListNode = dummyHead;
    let fast: ListNode = dummyHead;

    // Advance fast pointer so that there is an offset gap of n nodes between slow and fast
    for (let i = 0; i <= n; i++) {
        if (fast.next !== null || i === n) {
            fast = fast.next!;
        }
    }

    // Move both pointers together. When fast hits null, slow is right before the target node.
    while (fast !== null) {
        slow = slow.next!;
        fast = fast.next!;
    }

    // Delete the target node by bypassing it
    if (slow.next !== null) {
        slow.next = slow.next.next;
    }

    return dummyHead.next;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We traverse the list of length $N$ exactly once using the `fast` pointer.
* **Space Complexity**: **$O(1)$** — We only allocate one sentinel node (`dummyHead`) and two pointer variables (`slow`, `fast`).

#### Edge Cases Handled:
* **Deleting the Head Node** (`head = [1, 2]`, `n = 2`):
  * `dummyHead.next = Node(1)`.
  * `fast` advances by $3$ steps (starts at `dummyHead`, goes to `1`, then `2`, then `null`).
  * `slow` remains at `dummyHead`.
  * `fast === null` loop doesn't run.
  * `slow.next = slow.next.next` (re-wires `dummyHead.next` to point directly to `Node(2)`, bypassing `Node(1)`).
  * Returns `dummyHead.next` (`[2]`) (Correct).
* **Single Element List** (`head = [1]`, `n = 1`):
  * `dummyHead.next` re-wired to `null`. Returns `null` (Correct).
