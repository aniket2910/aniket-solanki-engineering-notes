# 009. Same Tree (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft, Google
>
> **Interview Tag**: **DFS SAME TREE CHECK** - Dual-tree structural alignment checks.

---

### 📝 1. Problem Statement
Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `p = [1,2,3]`, `q = [1,2,3]`
* **Output**: `true`
* **Why**: Both trees have root 1, left child 2, and right child 3.

#### Test Case 2
* **Input**: `p = [1,2]`, `q = [1,null,2]`
* **Output**: `false`
* **Why**: Left child of p is 2, while left child of q is null (structure differs).

---

### 💬 3. What is This Problem Actually Asking?
Verify that two trees have the exact same shape and node values at every position.

---

### 🌍 4. Real-Life Example
Imagine checking if two blueprints of a house are identical. You start at the main entrance (root) of both house layouts. At each junction (node), you check if the number of doors and directions (left/right halls) match, and if the room labels (values) are identical.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Iterative BFS with Queue
Store nodes of both trees in pairs in a queue.
* Dequeue `pNode` and `qNode`.
* Verify values and null structures.
* Push children in pairs: `(p.left, q.left)` and `(p.right, q.right)`.
* **Pros**: Explicit queue, no call stack issues.
* **Cons**: Marginally more code overhead.

#### Approach 2: Recursive DFS (Optimal)
Recursively compare corresponding nodes.
* If both are `null`, return `true`.
* If one is `null` or their values differ, return `false`.
* Return `p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right)`.
* **Pros**: Elegant and highly concise.
* **Cons**: Stack size is **$O(H)$**.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with `p = [1, 2]` and `q = [1, null, 2]`.

#### **Step 0: Initial State**
* Call `isSameTree(pRoot, qRoot) = isSameTree(node 1p, node 1q)`.

#### **Step 1: Check root nodes**
* Values match (`1 === 1`).
* Recurse on left children: `isSameTree(node 2p, null)`.

#### **Step 2: Check left children**
```text
Tree p:     1p           Tree q:     1q
           /                            \
          2p                             2q
Compare:  2p (Node) vs null (q.left) -> mismatch -> FALSE
```
* Left child of `p` is a node, but left child of `q` is `null`.
* Mismatch detected! Returns `false`.
* **Result**: Return `false`.

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

function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
    // ==========================================
    // 1st Approach: Iterative BFS Queue (O(N) time, O(W) space)
    // ==========================================
    /*
    const queue: (TreeNode | null)[] = [p, q];
    while (queue.length > 0) {
        const n1 = queue.shift()!;
        const n2 = queue.shift()!;

        if (n1 === null && n2 === null) continue;
        if (n1 === null || n2 === null) return false;
        if (n1.val !== n2.val) return false;

        queue.push(n1.left, n2.left);
        queue.push(n1.right, n2.right);
    }
    return true;
    */

    // ==========================================
    // 2nd Approach: Recursive DFS (Optimal)
    // ==========================================
    if (p === null && q === null) return true;
    if (p === null || q === null) return false;

    return (
        p.val === q.val &&
        isSameTree(p.left, q.left) &&
        isSameTree(p.right, q.right)
    );
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Iterative BFS | Approach 2: Recursive DFS |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Processed all nodes. | **$O(N)$** — Visited all nodes in parallel recursion. |
| **Space Complexity** | **$O(W)$** — Queue storage. | **$O(H)$** — Height of tree (implicit stack storage). |

#### Edge Cases Handled:
* **Both Null**: returns `true`.
* **Different Structures** (e.g. leaf vs null child): Mismatched null checks capture this and return `false`.
