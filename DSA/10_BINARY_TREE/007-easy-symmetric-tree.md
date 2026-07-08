# 007. Symmetric Tree (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 LinkedIn, Google, Amazon, Microsoft, Bloomberg
>
> **Interview Tag**: 🔥 **DFS TWIN-POINTER MIRROR** - Core template for structural dual-node matching.

---

### 📝 1. Problem Statement
Given the `root` of a binary tree, *check whether it is a mirror of itself* (i.e., symmetric around its center).

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [1,2,2,3,4,4,3]`
* **Output**: `true`
* **Why**: The tree is symmetric:
  ```text
        1
       / \
      2   2
     / \ / \
    3  4 4  3
  ```

#### Test Case 2
* **Input**: `root = [1,2,2,null,3,null,3]`
* **Output**: `false`
* **Why**: The left subtree has a right child `3`, but the right subtree has a right child `3` instead of a left child `3`.

---

### 💬 3. What is This Problem Actually Asking?
Determine if the left subtree of the root is the mirror image of the right subtree of the root.

---

### 🌍 4. Real-Life Example
Imagine looking at a folding paper card. If you fold it down the center line, all printed shapes and text lines must perfectly overlap. In this case, the left-hand text matches the right-hand text mirrored (e.g. left child's left child aligns with right child's right child).

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Iterative BFS with Queue
Use a queue to process nodes in pairs.
* Enqueue `[root.left, root.right]`.
* Dequeue two nodes `t1` and `t2` at a time.
* If both are `null`, continue.
* If one is `null` or their values differ, return `false`.
* Enqueue their children in mirrored order:
  * `t1.left` with `t2.right`
  * `t1.right` with `t2.left`
* **Pros**: Explicit, no call stack limits.
* **Cons**: Queue storage overhead.

#### Approach 2: Recursive DFS (Optimal)
Define a helper function `isMirror(t1, t2)`.
* If both nodes are null, return `true`.
* If one is null or values differ, return `false`.
* Return `t1.val === t2.val && isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left)`.
* **Pros**: Elegant and highly concise.
* **Cons**: Depth-first recursion uses stack space of **$O(H)$**.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with a tree where root `1` has left child `2` (L) and right child `2` (R).

#### **Step 0: Initial State**
* Call `isMirror(root.left, root.right) = isMirror(node 2L, node 2R)`.

#### **Step 1: Check nodes (2L, 2R)**
* Values match (`2 === 2`).
* Split checks:
  * Check Left of 2L (`null`) vs Right of 2R (`null`) $\rightarrow$ `isMirror(null, null) = true`.
  * Check Right of 2L (`null`) vs Left of 2R (`null`) $\rightarrow$ `isMirror(null, null) = true`.
* Both match, returns `true`.

```text
Tree:       1
           / \
          2L  2R
Compare:  2L === 2R (Val match)
          L.left (null) == R.right (null) -> TRUE
          L.right (null) == R.left (null) -> TRUE
```
* **Result**: Returns `true`.

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

function isSymmetric(root: TreeNode | null): boolean {
    // ==========================================
    // 1st Approach: Iterative BFS Queue (O(N) time, O(W) space)
    // ==========================================
    /*
    if (!root) return true;
    const queue: (TreeNode | null)[] = [root.left, root.right];
    while (queue.length > 0) {
        const t1 = queue.shift()!;
        const t2 = queue.shift()!;

        if (t1 === null && t2 === null) continue;
        if (t1 === null || t2 === null) return false;
        if (t1.val !== t2.val) return false;

        // Push children in mirror order
        queue.push(t1.left);
        queue.push(t2.right);
        queue.push(t1.right);
        queue.push(t2.left);
    }
    return true;
    */

    // ==========================================
    // 2nd Approach: Twin-Pointer Recursive DFS (Optimal)
    // ==========================================
    if (root === null) return true;
    return isMirror(root.left, root.right);
}

function isMirror(t1: TreeNode | null, t2: TreeNode | null): boolean {
    if (t1 === null && t2 === null) return true;
    if (t1 === null || t2 === null) return false;

    return (
        t1.val === t2.val &&
        isMirror(t1.left, t2.right) &&
        isMirror(t1.right, t2.left)
    );
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Iterative BFS | Approach 2: Recursive DFS |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Processed $N$ nodes in pairs. | **$O(N)$** — Evaluated mirror subtrees of all nodes. |
| **Space Complexity** | **$O(W)$** — Queue storage for the widest level. | **$O(H)$** — Height of tree for implicit stack storage. |

#### Edge Cases Handled:
* **Empty Tree** (`root = null`): returns `true` (symmetric).
* **Asymmetric Values** (`[1, 2, 3]`): Values mismatch on first level check, returns `false` correctly.
* **Structural Asymmetry** (left has child, right does not): Mismatched null checks return `false` correctly.
