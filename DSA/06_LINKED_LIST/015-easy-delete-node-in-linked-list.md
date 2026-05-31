# 015. Delete Node in a Linked List (Easy)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **SUCCESSOR OVERWRITING** - Extremely common paradigm test. Evaluates out-of-the-box thinking where you delete a node without access to its predecessor.

---

### 📝 1. Problem Statement
There is a singly-linked list `head` and we want to delete a node `node` in it.

You are given the node to be deleted `node`. You will **not be given access** to the first node of `head`.

All the values of the linked list are unique, and it is guaranteed that the given node `node` is **not the tail node** in the list.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `list = [4, 5, 1, 9]`, `node = 5`
* **Output**: `[4, 1, 9]`
* **Why**: The node with value `5` is removed. The list is linked directly from `4` to `1`.

#### Test Case 2
* **Input**: `list = [4, 5, 1, 9]`, `node = 1`
* **Output**: `[4, 5, 9]`
* **Why**: The node with value `1` is removed. The list is linked directly from `5` to `9`.

---

### 💬 3. What is This Problem Actually Asking?
Usually, to delete a node, we traverse to its predecessor and skip the node: `prev.next = node.next`. Here, we do not have `prev`. We need to delete `node` using **only the reference of `node` itself** in constant $O(1)$ time.

---

### 🌍 4. Real-Life Example
Imagine a row of train carriages coupled together. You want to remove Carriage 2 (`node`). Instead of uncoupling the heavy links between Carriage 1 and 2, you simply copy all the passengers and cargo of Carriage 3 into Carriage 2, and then decouple Carriage 3 completely. Carriage 2 effectively *becomes* Carriage 3, and the original Carriage 3 is removed.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing value copying vs. pointer shunts:

#### Approach 1: Value Compaction (Shifting all remaining values)
We iterate from `node` to the end of the list, copying each successor's value into the current node, then delete the last node.
* **Pros**: Simple conceptual model.
* **Cons**: Slow ($O(N)$), requires traversing the entire rest of the list.

#### Approach 2: Successor Node Overwrite (Optimal)
Since we are guaranteed that `node` is not the tail:
1.  Copy the value of the successor node (`node.next.val`) into `node.val`.
2.  Shunt the pointer past the successor node: `node.next = node.next.next`.
* **Pros**: Fast, optimal $O(1)$ constant time, $O(1)$ constant space.
* **Cons**: Relies on the node not being the tail.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with list `[4, 5, 1, 9]`, `node = 5`.

#### **Step 0: Initial State (Before deletion)**
* **Variables**: `node` points to cell with value `5`.

#### **Step 1: Copy Successor Value**
```text
List:    [ 4 ] -> [ 5 ] -> [ 1 ] -> [ 9 ]
                    ▲        ▲
                  node    node.next
Action:  Copy node.next.val (1) into node.val
List:    [ 4 ] -> [ 1 ] -> [ 1 ] -> [ 9 ]
```
* **Updates**: `node.val` becomes `1`.

#### **Step 2: Shunt Pointer**
```text
List:    [ 4 ] -> [ 1 ] ========> [ 9 ]
                    ▲               ▲
                  node       node.next.next
Action:  Set node.next = node.next.next (skipping successor cell)
Result:  [ 4 ] -> [ 1 ] -> [ 9 ]
```
* **Updates**: Node pointer shunted. Cell with duplicate value `1` is decoupled. Returns `[4, 1, 9]` (Correct).

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

function deleteNode(node: ListNode | null): void {
    if (node === null || node.next === null) return;

    // ==========================================
    // 1st Approach: Value Shifting Traversal (O(N) Time)
    // ==========================================
    /*
    let curr: ListNode | null = node;
    while (curr !== null && curr.next !== null) {
        curr.val = curr.next.val;
        if (curr.next.next === null) {
            curr.next = null; // Decouple tail
            break;
        }
        curr = curr.next;
    }
    */

    // ==========================================
    // 2nd Approach: Successor Overwrite (Optimal)
    // ==========================================
    // 1. Copy successor value to current node
    node.val = node.next.val;
    
    // 2. Bypass successor node
    node.next = node.next.next;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Value Shifting | Approach 2: Successor Overwrite |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Traverses rest of the list. | **$O(1)$** — Constant copy and shunt operations. |
| **Space Complexity** | **$O(1)$** — Constant variables. | **$O(1)$** — Constant variables, fully in-place. |

#### Edge Cases Handled:
* **Tail Node deletion**: Guaranteed by constraints that the given node is not the tail.
