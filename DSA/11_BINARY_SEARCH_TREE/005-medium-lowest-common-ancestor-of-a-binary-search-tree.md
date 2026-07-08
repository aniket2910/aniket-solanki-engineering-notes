# 005. Lowest Common Ancestor of a Binary Search Tree (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Google, Microsoft, Facebook/Meta
>
> **Interview Tag**: 🔥 **BST LCA RANGE SPLIT** - Classic value-based path pruning pattern.

---

### 📝 1. Problem Statement
Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.

According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants (where we allow **a node to be a descendant of itself**).”

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [6,2,8,0,4,7,9,null,null,3,5]`, `p = 2`, `q = 8`
* **Output**: `6`
* **Why**: The LCA of nodes `2` and `8` is `6`.

#### Test Case 2
* **Input**: `root = [6,2,8,0,4,7,9,null,null,3,5]`, `p = 2`, `q = 4`
* **Output**: `2`
* **Why**: The LCA of nodes `2` and `4` is `2`, since a node can be a descendant of itself.

---

### 💬 3. What is This Problem Actually Asking?
Find the split point node where one target value is in its left branch (value < node.val) and the other is in its right branch (value > node.val), or the current node matches one of the values.

---

### 🌍 4. Real-Life Example
Imagine a sorting facility for incoming cargo packages. Packages are split by weight limits at each conveyor junction (e.g. split at 50kg, left is < 50kg, right is > 50kg). If you are looking for the lowest common junction shared by a 20kg package and an 80kg package, it must be the 50kg junction because that is where their routing paths divide!

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Recursive DFS using BST Properties
* If both `p.val` and `q.val` are strictly **less than** `root.val`, the LCA must be in the left subtree: `lowestCommonAncestor(root.left, p, q)`.
* If both `p.val` and `q.val` are strictly **greater than** `root.val`, the LCA must be in the right subtree: `lowestCommonAncestor(root.right, p, q)`.
* Otherwise, we have found the split point (e.g., `p` is left and `q` is right, or `root` matches `p` or `q`). Return `root`.
* **Pros**: Incredibly short, takes advantage of BST sorted properties.
* **Cons**: Stack memory overhead is **$O(H)$**.

#### Approach 2: Iterative Pointer Redirection (Optimal)
We can solve this iteratively by shifting a single pointer `curr` down the tree:
* While `curr !== null`:
  * If `p.val < curr.val && q.val < curr.val`, `curr = curr.left`.
  * Else if `p.val > curr.val && q.val > curr.val`, `curr = curr.right`.
  * Else, return `curr` (found the split node!).
* **Pros**: Optimal **$O(1)$** auxiliary space (no recursion stack).
* **Cons**: None.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with `p = 2` and `q = 4`.

#### **Step 0: Initial State**
* `curr = root (node 6)`.

#### **Step 1: Check node 6**
* `p.val (2) < 6` AND `q.val (4) < 6`. Both targets are in the left subtree.
* Move left: `curr = curr.left (node 2)`.

#### **Step 2: Check node 2 - Split Point!**
```text
Tree:           6
               / \
       curr-> 2   8
             / \
            0   4
Compare at curr: p (2) === curr (2) -> SPLIT -> return curr (node 2)
```
* `p.val (2) === curr.val (2)` (does not satisfy both being less/greater).
* This is the split point! Return `curr` (node 2).
* **Result**: returns node `2`.

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
    // 1st Approach: Recursive DFS (O(H) space)
    // ==========================================
    /*
    if (root === null || p === null || q === null) return null;

    if (p.val < root.val && q.val < root.val) {
        return lowestCommonAncestor(root.left, p, q);
    }
    if (p.val > root.val && q.val > root.val) {
        return lowestCommonAncestor(root.right, p, q);
    }
    return root;
    */

    // ==========================================
    // 2nd Approach: Iterative BST LCA (Optimal - O(1) space)
    // ==========================================
    if (root === null || p === null || q === null) return null;

    let curr: TreeNode | null = root;

    while (curr !== null) {
        if (p.val < curr.val && q.val < curr.val) {
            curr = curr.left;
        } else if (p.val > curr.val && q.val > curr.val) {
            curr = curr.right;
        } else {
            // Found the split point
            return curr;
        }
    }

    return null;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Recursive DFS | Approach 2: Iterative BST |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(H)$** — Path from root to split node. | **$O(H)$** — Path from root to split node. |
| **Space Complexity** | **$O(H)$** — Height of tree for call stack. | **$O(1)$** — Constant memory space. |

#### Edge Cases Handled:
* **One Node is Parent of Other** (e.g. `p = 2`, `q = 4`): Handled correctly because the loop condition checks if both are less/greater. When it evaluates `curr = 2`, `p` matches `curr`, so the condition fails, and it correctly returns `2`.
* **Skewed Tree**: Height is $N$, iterative approach operates correctly using constant $O(1)$ auxiliary space.
