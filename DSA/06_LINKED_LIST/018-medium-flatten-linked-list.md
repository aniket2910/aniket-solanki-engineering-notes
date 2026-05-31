# 018. Flattening of a Linked List (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **RECURSIVE SORT MERGE** - Advanced linked list puzzle. Tests understanding of 2D node structures, bottom-pointer traversals, and recursive merging.

---

### 📝 1. Problem Statement
Given a Linked List where every node represents a linked list and contains two pointers of its type:
1.  `next` pointer to the next node.
2.  `bottom` pointer to a linked list where this node is head.

Each of the sub-linked lists is sorted in sorted order. Flatten the link list into a single linked list. The flattened linked list should also be in sorted order.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**:
  ```text
  5 -> 10 -> 19
  |    |     |
  7    20    22
  |          |
  8          50
  ```
* **Output**: `5 -> 7 -> 8 -> 10 -> 19 -> 20 -> 22 -> 50`
* **Why**: All values across bottom chains are sorted and merged into a single vertical bottom chain.

---

### 💬 3. What is This Problem Actually Asking?
We need to combine multiple vertical sorted lists (connected horizontally by `next` pointers) into a single vertical sorted list using `bottom` pointers.

---

### 🌍 4. Real-Life Example
Imagine multiple sorted streams of water flowing down local valleys, which are connected horizontally by channels. We want to merge all of these channels recursively into a single main descending river where all water volumes mix in sorted depth.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing merging strategies:

#### Approach 1: Flat Array Sorting
We traverse every single node across all dimensions, collect their values in an array, sort the array, and then create a new list.
* **Pros**: Simple logic.
* **Cons**: Slow and memory-intensive ($O(N \cdot M \log(N \cdot M))$ time, $O(N \cdot M)$ space).

#### Approach 2: Recursive Bottom-Merge (Optimal)
We can solve this by working **right to left**:
1.  Recursively go to the last next-node: `root.next = flatten(root.next)`.
2.  Now merge the current vertical list with the flattened list returned from the right: `root = merge(root, root.next)`.
3.  Connect elements in `merge` utilizing the `bottom` pointer.
* **Pros**: Optimal $O(N \cdot M)$ runtime, uses existing list pointers.
* **Cons**: Requires recursive call stack memory of size $O(N)$ (number of columns).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run merging two vertical sorted lists: `[5, 7]` and `[10]`.

#### **Step 0: Initial State**
* **Variables**: `l1 = 5 -> 7`, `l2 = 10`, `dummy = [0]`

#### **Step 1: Compare nodes**
* **Compare `5` and `10`**: `5 < 10`.
  * `dummy.bottom = 5`. Move `l1` pointer to `7`.
* **Compare `7` and `10`**: `7 < 10`.
  * `5.bottom = 7`. Move `l1` pointer to `null`.
* **Add remaining**: `7.bottom = 10`.
* **Result**: `5 -> 7 -> 10` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
class FlatListNode {
    val: number;
    next: FlatListNode | null;
    bottom: FlatListNode | null;
    constructor(val?: number, next?: FlatListNode | null, bottom?: FlatListNode | null) {
        this.val = (val===undefined ? 0 : val);
        this.next = (next===undefined ? null : next);
        this.bottom = (bottom===undefined ? null : bottom);
    }
}

function flatten(root: FlatListNode | null): FlatListNode | null {
    // ==========================================
    // 1st Approach: Flat Array Collection & Sort (O(K log K))
    // ==========================================
    /*
    const values: number[] = [];
    let tempCol = root;
    while (tempCol !== null) {
        let tempRow: FlatListNode | null = tempCol;
        while (tempRow !== null) {
            values.push(tempRow.val);
            tempRow = tempRow.bottom;
        }
        tempCol = tempCol.next;
    }
    values.sort((a, b) => a - b);
    const dummy = new FlatListNode(0);
    let curr = dummy;
    for (let val of values) {
        curr.bottom = new FlatListNode(val);
        curr = curr.bottom;
    }
    return dummy.bottom;
    */

    // ==========================================
    // 2nd Approach: Recursive Bottom-Merge (Optimal)
    // ==========================================
    if (root === null || root.next === null) {
        return root;
    }

    // 1. Flatten the list to the right recursively
    root.next = flatten(root.next);

    // 2. Merge current column with the flattened column
    root = mergeTwoLists(root, root.next);

    return root;
}

function mergeTwoLists(a: FlatListNode | null, b: FlatListNode | null): FlatListNode | null {
    const dummy = new FlatListNode(0);
    let temp = dummy;

    while (a !== null && b !== null) {
        if (a.val < b.val) {
            temp.bottom = a;
            a = a.bottom;
        } else {
            temp.bottom = b;
            b = b.bottom;
        }
        temp = temp.bottom;
        temp.next = null; // Clear next pointers
    }

    if (a !== null) temp.bottom = a;
    else temp.bottom = b;

    return dummy.bottom;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Flat Array Sort | Approach 2: Bottom-Merge |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(K \log K)$** — $K$ is total nodes. | **$O(N \cdot M)$** — Total nodes count. |
| **Space Complexity** | **$O(K)$** — Auxiliary array buffer. | **$O(N)$** — Columns recursion call stack. |

#### Edge Cases Handled:
* **Single Column List**: Returns root directly.
