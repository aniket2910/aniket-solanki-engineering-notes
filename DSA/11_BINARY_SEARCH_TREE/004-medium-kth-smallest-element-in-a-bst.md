# 004. Kth Smallest Element in a BST (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Google, Microsoft, Facebook/Meta
>
> **Interview Tag**: 🔥 **DFS INORDER COUNTING** - Essential BST sorting property pattern.

---

### 📝 1. Problem Statement
Given the `root` of a binary search tree, and an integer `k`, return *the* $k^{\text{th}}$ *smallest value (**1-indexed**) of all the values of the nodes in the tree*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [3,1,4,null,2]`, `k = 1`
* **Output**: `1`
* **Why**: The inorder sorted representation is `[1, 2, 3, 4]`. The 1st smallest element is 1.

#### Test Case 2
* **Input**: `root = [5,3,6,2,4,null,null,1]`, `k = 3`
* **Output**: `3`
* **Why**: The inorder sorted representation is `[1, 2, 3, 4, 5, 6]`. The 3rd smallest element is 3.

---

### 💬 3. What is This Problem Actually Asking?
Locate the $k^{\text{th}}$ node visited during an inorder traversal of the BST.

---

### 🌍 4. Real-Life Example
Imagine a nested folder filing system where folders are ordered alphabetically. If you want to retrieve the 3rd folder in alphabetical order, you go to the absolute leftmost folder (first alphabetically) and count: 1st folder, 2nd folder, 3rd folder (which you grab).

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Recursive Inorder DFS
Traverse inorder recursively, decrementing `k` at each visit.
* Perform DFS on `node.left`.
* Visit: decrement `k`. If `k === 0`, record the value and return.
* Perform DFS on `node.right`.
* **Pros**: Simple recursive template.
* **Cons**: Can traverse more nodes than necessary after finding the result unless we explicitly add early return condition checks; call stack is **$O(H)$**.

#### Approach 2: Iterative Stack Inorder DFS (Optimal)
Simulate inorder traversal using a stack.
* While `curr !== null` or `stack.length > 0`:
  * Go all the way left: push `curr` to stack, `curr = curr.left`.
  * Pop: `curr = stack.pop()!`.
  * Visit: decrement `k`. If `k === 0`, return `curr.val` immediately (short-circuits!).
  * Move right: `curr = curr.right`.
* **Pros**: Highly optimal; stops traversal immediately upon visiting the $k^{\text{th}}$ element (no extra nodes visited).
* **Cons**: Explicit stack memory overhead of **$O(H)$**.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with `root = [3, 1, 4, null, 2]` and `k = 2`.

#### **Step 0: Initial State**
* `curr = root (node 3)`, `stack = []`.

#### **Step 1: Go all the way Left**
* Push `3`, then `1` to stack. `curr` becomes `null`.
* `stack = [3, 1]`.

#### **Step 2: Pop & Visit Node 1**
* Pop `1`. `k` becomes `1` (`2 - 1 = 1`).
* Set `curr = node.right (node 2)`.
* `stack = [3]`, `curr = node 2`.

#### **Step 3: Push Node 2 & Pop**
```text
Stack:    [ 3 ]
Tree:       3
           / \
          1   4
           \
            2
Pointers:   ▲
          curr (popped 2) -> decrement k -> k = 0 -> MATCH -> return 2
```
* Push `2`. Pop `2` immediately since it has no left child.
* `k` becomes `0` (`1 - 1 = 0`).
* Match found! Return node value `2`.
* **Result**: returns `2` (the traversal of node `3` and `4` is completely skipped).

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val===undefined ? 0 : val);
        this.left = (left===undefined ? null : left);
        this.right = (right===undefined ? null : right);
    }
}

function kthSmallest(root: TreeNode | null, k: number): number {
    // ==========================================
    // 1st Approach: Recursive Inorder DFS (O(N) time, O(H) space)
    // ==========================================
    /*
    let count = k;
    let result = -1;

    function inorder(node: TreeNode | null) {
        if (node === null || result !== -1) return;

        inorder(node.left);
        
        count--;
        if (count === 0) {
            result = node.val;
            return;
        }

        inorder(node.right);
    }

    inorder(root);
    return result;
    */

    // ==========================================
    // 2nd Approach: Iterative Inorder Stack (Optimal - Early Stop)
    // ==========================================
    const stack: TreeNode[] = [];
    let curr = root;
    let count = k;

    while (curr !== null || stack.length > 0) {
        // Go all the way left
        while (curr !== null) {
            stack.push(curr);
            curr = curr.left;
        }

        // Pop and process
        curr = stack.pop()!;
        count--;
        if (count === 0) {
            return curr.val; // Early return, short-circuits remainder of tree
        }

        // Go right
        curr = curr.right;
    }

    return -1;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Recursive Inorder | Approach 2: Iterative Inorder |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Worst case scans entire tree. | **$O(H + K)$** — Scans only until the $K^{\text{th}}$ element (optimal). |
| **Space Complexity** | **$O(H)$** — Height of tree for call stack. | **$O(H)$** — Height of tree for stack storage. |

#### Edge Cases Handled:
* **$k = 1$**: Pops leftmost leaf node, decrements to 0, returns immediately.
* **$k$ is total number of nodes**: Traverses all nodes, returning the largest value at the far right.
* **Skewed Tree**: Height is $N$, stack correctly tracks path limits.
