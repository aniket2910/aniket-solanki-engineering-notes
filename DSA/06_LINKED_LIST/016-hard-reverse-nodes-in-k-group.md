# 016. Reverse Nodes in k-Group (Hard)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft, Google
>
> **Interview Tag**: 🔥 **GROUPED LIST REVERSAL** - Hard list standard. Tests complex multi-pointer synchronization, recursion boundaries, and in-place link tracking.

---

### 📝 1. Problem Statement
Given the `head` of a linked list, reverse the nodes of the list `k` at a time, and return *the modified list*.

`k` is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of `k` then left-out nodes, in the end, should remain as they are.

You may not alter the values in the list's nodes, only nodes themselves may be changed.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `head = [1,2,3,4,5]`, `k = 2`
* **Output**: `[2,1,4,3,5]`
* **Why**: Reversing in groups of size 2 yields `[2,1]` and `[4,3]`. The last node `5` does not form a full group of size 2, so it remains unchanged.

#### Test Case 2
* **Input**: `head = [1,2,3,4,5]`, `k = 3`
* **Output**: `[3,2,1,4,5]`
* **Why**: Reversing in groups of size 3 yields `[3,2,1]`. The remaining `[4,5]` are left as they are.

---

### 💬 3. What is This Problem Actually Asking?
We need to reverse nodes in groups of size $K$. If a group has fewer than $K$ nodes left, we do not reverse it. All pointer links between groups must remain perfectly intact.

---

### 🌍 4. Real-Life Example
Imagine a marching band marching in single file. The drill sergeant orders: *"Form blocks of size 3 and reverse your marching order within each block."* If there are 5 soldiers, the first 3 reverse their order, and the remaining 2 continue marching in their original formation.

---

### 🛠️ 5. Data Structure & Algorithms Used

We contrast recursive vs. iterative grouping:

#### Approach 1: Recursive k-Group Reversal
We check if there are at least $k$ nodes. If so, we reverse those $k$ nodes. We then call the function recursively on the head of the remaining list and connect the returned pointer.
* **Pros**: Incredibly clean and elegant code structure.
* **Cons**: Requires $O(N/k)$ recursive call stack space.

#### Approach 2: Iterative Block Pointer Tracking (Optimal)
We maintain a dummy head node and four boundary pointers: `prevGroupEnd`, `groupStart`, `groupEnd`, and `nextGroupStart`.
1.  Check if a group of size $k$ exists.
2.  Decouple the group, reverse it using standard 3-pointer list reversal, and link `prevGroupEnd` to `groupEnd` (new start).
3.  Link the reversed group tail to `nextGroupStart`.
* **Pros**: Fast, optimal $O(N)$ runtime, true $O(1)$ constant space.
* **Cons**: Highly complex pointer tracking.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `head = [1, 2, 3, 4]`, `k = 2`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `dummy = [0] -> [1]`, `prevGroupEnd = dummy`

#### **Step 1: Check and Reverse first group of size 2 (nodes [1, 2])**
```text
List:   [dummy] -> [ 1 ] -> [ 2 ] -> [ 3 ] -> [ 4 ]
          ▲          ▲        ▲        ▲
     prevGroupEnd  start     end     nextGroupStart
Action: Reverse sublist [1, 2] to [2, 1]. Link prevGroupEnd to 2, and start to 3.
List:   [dummy] -> [ 2 ] -> [ 1 ] ========> [ 3 ] -> [ 4 ]
                              ▲               ▲
                        prevGroupEnd (new)  start
```
* **Updates**: `prevGroupEnd` moves to `1`.

#### **Step 2: Check and Reverse second group of size 2 (nodes [3, 4])**
```text
List:   [dummy] -> [ 2 ] -> [ 1 ] -> [ 3 ] -> [ 4 ] -> null
                              ▲        ▲        ▲
                         prevGroupEnd start    end
Action: Reverse sublist [3, 4] to [4, 3]. Link 1 to 4, and 3 to null.
List:   [dummy] -> [ 2 ] -> [ 1 ] -> [ 4 ] -> [ 3 ] -> null
```
* **Result**: Returns `[2, 1, 4, 3]` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val===undefined ? 0 : val);
        this.next = (next===undefined ? null : next);
    }
}

function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
    // ==========================================
    // 1st Approach: Recursive k-Group Reversal (O(N/k) Space)
    // ==========================================
    /*
    let curr = head;
    let count = 0;
    while (curr !== null && count < k) {
        curr = curr.next;
        count++;
    }
    if (count === k) {
        let prev: ListNode | null = null;
        let next: ListNode | null = null;
        curr = head;
        for (let i = 0; i < k; i++) {
            next = curr!.next;
            curr!.next = prev;
            prev = curr;
            curr = next;
        }
        if (head !== null) {
            head.next = reverseKGroup(curr, k);
        }
        return prev;
    }
    return head;
    */

    // ==========================================
    // 2nd Approach: Iterative Block Tracking (Optimal)
    // ==========================================
    if (head === null || k === 1) return head;

    const dummy = new ListNode(0);
    dummy.next = head;

    let prevGroupEnd = dummy;

    while (true) {
        let groupEnd: ListNode | null = prevGroupEnd;
        // Check if there are at least k nodes left
        for (let i = 0; i < k; i++) {
            groupEnd = groupEnd.next!;
            if (groupEnd === null) {
                return dummy.next; // Not enough nodes left; terminate
            }
        }

        const nextGroupStart = groupEnd.next;
        const groupStart = prevGroupEnd.next!;
        groupEnd.next = null; // Cut off current group

        // Reverse the current group
        prevGroupEnd.next = reverseList(groupStart);
        groupStart.next = nextGroupStart; // Connect group tail to remaining list

        prevGroupEnd = groupStart; // Move prevGroupEnd past reversed group
    }
}

function reverseList(head: ListNode | null): ListNode | null {
    let prev: ListNode | null = null;
    let curr = head;
    while (curr !== null) {
        const nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Recursive k-Group | Approach 2: Iterative Tracking |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Each node is visited twice. | **$O(N)$** — Single pass over nodes. |
| **Space Complexity** | **$O(N/k)$** — Stack call allocations. | **$O(1)$** — Constant variables, fully in-place. |

#### Edge Cases Handled:
* **List length is smaller than k**: Returns head immediately.
* **k = 1**: Returns head immediately without performing swaps.
