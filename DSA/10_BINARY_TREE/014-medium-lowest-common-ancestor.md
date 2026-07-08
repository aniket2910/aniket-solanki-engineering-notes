# 014. Lowest Common Ancestor of a Binary Tree (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon, Microsoft, Facebook/Meta
>
> **Interview Tag**: 🔥 **DFS LCA PROPAGATION** - Classic bottom-up backtracking pattern.

---

### 📝 1. Problem Statement
Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.

According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants (where we allow **a node to be a descendant of itself**).”

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [3,5,1,6,2,0,8,null,null,7,4]`, `p = 5`, `q = 1`
* **Output**: `3`
* **Why**: The LCA of nodes `5` and `1` is `3`.

#### Test Case 2
* **Input**: `root = [3,5,1,6,2,0,8,null,null,7,4]`, `p = 5`, `q = 4`
* **Output**: `5`
* **Why**: The LCA of nodes `5` and `4` is `5`, since a node can be a descendant of itself according to the LCA definition.

---

### 💬 3. What is This Problem Actually Asking?
Find the deepest node in the tree that has both `p` and `q` in its left or right subtrees (or is one of the nodes itself).

---

### 🌍 4. Real-Life Example
Imagine a file folder directory hierarchy on your computer. If you have two files, one located at `/Documents/Finance/taxes.pdf` and another at `/Documents/Finance/Reports/Q2.pdf`, their Lowest Common Ancestor folder is `/Documents/Finance` because it is the deepest folder that contains both files.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Iterative with Parent Map
Traverse the tree and build a map linking each node to its parent.
* Use a queue/stack to visit nodes and populate `parentMap`.
* Trace the ancestors of node `p` up to the root, adding them to a Set.
* Traverse up from node `q` using `parentMap`. The first node we encounter that exists in `p`'s ancestor Set is the LCA.
* **Pros**: Intuitive, step-by-step path traceback.
* **Cons**: Extra space overhead for parent pointers and ancestor set (**$O(N)$** space).

#### Approach 2: Recursive DFS (Optimal)
Perform a postorder traversal.
* If current node is null, or matches `p` or `q`, return current node (base case).
* Recurse on left: `leftResult = lowestCommonAncestor(root.left, p, q)`.
* Recurse on right: `rightResult = lowestCommonAncestor(root.right, p, q)`.
* Combine:
  * If both `leftResult` and `rightResult` are non-null, it means one target node is in the left branch and the other is in the right. The current node is their split point, hence the LCA! Return `root`.
  * If only one is non-null, return that non-null result (propagate the found target upward).
  * If both are null, return `null`.
* **Pros**: Elegant postorder recursion, runs in **$O(N)$** time and **$O(H)$** space.
* **Cons**: Can be abstract to conceptualize without visual tracing.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with `p = 5` and `q = 4` in the tree.

#### **Step 0: Initial State**
* Call `lowestCommonAncestor(3, 5, 4)`.

#### **Step 1: Process root node 3**
* Recurse left: `lowestCommonAncestor(5, 5, 4)`.

#### **Step 2: Process node 5 (left child)**
* Match found (`node 5 === p`)! Return `5` immediately (short-circuits search on its children).
* Recursion on left branch returns `5`.

#### **Step 3: Process right child of 3 (node 1)**
* Recurse left/right on node `1` $\rightarrow$ both return `null` since neither contains `5` or `4`.
* Recursion on right branch returns `null`.

#### **Step 4: Combine at root**
```text
Tree:           3
               / \
    (LCA=5)   5   1 (returns null)
             / \
            6   2
               / \
              7   4
Combine at root: left = 5, right = null -> return 5
```
* `leftResult = 5`, `rightResult = null`. Return `5`.
* **Result**: returns node `5`.

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

function lowestCommonAncestor(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
    // ==========================================
    // 1st Approach: Iterative Parent Pointer Map (O(N) time, O(N) space)
    // ==========================================
    /*
    if (!root) return null;
    const parentMap = new Map<TreeNode, TreeNode>();
    const stack: TreeNode[] = [root];

    // Traverse tree to record parent pointers until both p and q are found
    while (!parentMap.has(p!) || !parentMap.has(q!)) {
        const curr = stack.pop()!;
        if (curr.left) {
            parentMap.set(curr.left, curr);
            stack.push(curr.left);
        }
        if (curr.right) {
            parentMap.set(curr.right, curr);
            stack.push(curr.right);
        }
    }

    // Set containing all ancestors of p
    const ancestors = new Set<TreeNode>();
    let pCurr: TreeNode | null = p;
    while (pCurr) {
        ancestors.add(pCurr);
        pCurr = parentMap.get(pCurr) || null;
    }

    // Climb up from q, first common ancestor is LCA
    let qCurr: TreeNode | null = q;
    while (qCurr) {
        if (ancestors.has(qCurr)) {
            return qCurr;
        }
        qCurr = parentMap.get(qCurr) || null;
    }
    return null;
    */

    // ==========================================
    // 2nd Approach: Bottom-up Recursive DFS (Optimal)
    // ==========================================
    if (root === null || root === p || root === q) {
        return root;
    }

    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);

    // If both left and right return nodes, current root is the LCA split point
    if (left !== null && right !== null) {
        return root;
    }

    // Otherwise, propagate the non-null result upward
    return left !== null ? left : right;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Parent Map | Approach 2: Recursive DFS |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Single pass traversal mapping parents. | **$O(N)$** — Postorder search visitation. |
| **Space Complexity** | **$O(N)$** — Storage for parent mapping and set. | **$O(H)$** — Height of tree for stack storage. |

#### Edge Cases Handled:
* **One Node is Parent of Other** (e.g. `p` is ancestor of `q`): Base case `root === p` triggers, returning `p` immediately. The search in `p`'s children is short-circuited because if `q` is under `p`, the other side of the tree will return `null`, correctly propagating `p` as the LCA.
* **Nodes at Extremes**: Backtracks correctly through parent roots, converging at the common root node.
