# 010. Balanced Binary Tree (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft, Google, Bloomberg
>
> **Interview Tag**: 🔥 **BOTTOM-UP HEIGHT CHECK** - Master class pattern for pruning recursion paths early.

---

### 📝 1. Problem Statement
Given a binary tree, determine if it is **height-balanced**.

A height-balanced binary tree is defined as:
> a binary tree in which the left and right subtrees of every node differ in height by no more than 1.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [3,9,20,null,null,15,7]`
* **Output**: `true`
* **Why**: The height difference between the left and right subtrees of root `3` is `1 - 2 = -1` (valid). Every other node is also balanced.

#### Test Case 2
* **Input**: `root = [1,2,2,3,3,null,null,4,4]`
* **Output**: `false`
* **Why**: The left subtree has height 3, while the right subtree has height 1. The difference is `3 - 1 = 2` (greater than 1, so unbalanced).

---

### 💬 3. What is This Problem Actually Asking?
Check if the height difference between the left and right subtrees of *every single node* in the tree is at most 1.

---

### 🌍 4. Real-Life Example
Imagine a physical mobile hanging from the ceiling. For the mobile to hang straight, every tier (node) must support left and right weights that are reasonably balanced. If any single branch is too heavy (height difference > 1), the mobile tilts and becomes unbalanced.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Top-Down Recursion
For each node, compute the height of its left and right subtrees, check if the difference is $\le 1$, and then recursively call balanced check on both children.
* **Pros**: Simple, matches the definition directly.
* **Cons**: Sub-optimal. Since height calculations are recalculated repeatedly on lower nodes, the time complexity is **$O(N^2)$** in the worst case (skewed tree) and **$O(N \log N)$** for balanced trees.

#### Approach 2: Bottom-Up DFS Height Check (Optimal)
Perform a bottom-up postorder traversal.
* The helper function returns the height of the subtree if it is balanced.
* If a subtree is unbalanced, it immediately propagates `-1` upwards.
* For each node:
  * Check left height. If `-1`, return `-1`.
  * Check right height. If `-1`, return `-1`.
  * If the absolute difference is $> 1$, return `-1` (unbalanced).
  * Otherwise, return the actual height: `Math.max(leftHeight, rightHeight) + 1`.
* **Pros**: Optimal **$O(N)$** time complexity.
* **Cons**: Requires mapping height values and invalid flags to the same return signal (`-1`).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with an unbalanced tree: `[1, 2, 2, 3, 3, null, null, 4, 4]`.

#### **Step 0: Initial State**
* Call helper `checkHeight(root)`.

#### **Step 1: Check Left child of root (node 2)**
* Recursively check left height of node `2` (which goes to node `3`, then node `4`) $\rightarrow$ yields height `3` (balanced at lower levels).

#### **Step 2: Check Right child of root (node 2)**
* Node `2` (right child of root) has height `1`.

#### **Step 3: Combine heights at root**
```text
Tree:           1
               / \
        (H=3) 2   2 (H=1)
Compare heights at root: |3 - 1| = 2 > 1 -> UNBALANCED!
```
* Difference: `|3 - 1| = 2 > 1`.
* Helper returns `-1`.
* **Result**: Root returns `false` (unbalanced).

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

function isBalanced(root: TreeNode | null): boolean {
    // ==========================================
    // 1st Approach: Top-Down Recursion (O(N log N) average, O(N^2) worst)
    // ==========================================
    /*
    function getHeight(node: TreeNode | null): number {
        if (!node) return 0;
        return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
    }
    
    if (!root) return true;
    const diff = Math.abs(getHeight(root.left) - getHeight(root.right));
    if (diff > 1) return false;
    return isBalanced(root.left) && isBalanced(root.right);
    */

    // ==========================================
    // 2nd Approach: Bottom-Up DFS Height Check (Optimal)
    // ==========================================
    return checkHeight(root) !== -1;
}

// Returns the height of the tree if balanced, or -1 if unbalanced
function checkHeight(node: TreeNode | null): number {
    if (node === null) return 0;

    const leftHeight = checkHeight(node.left);
    if (leftHeight === -1) return -1; // Propagate imbalance from left child

    const rightHeight = checkHeight(node.right);
    if (rightHeight === -1) return -1; // Propagate imbalance from right child

    // Check balance of current node
    if (Math.abs(leftHeight - rightHeight) > 1) {
        return -1; // Imbalanced at current node
    }

    // Return height of current node
    return Math.max(leftHeight, rightHeight) + 1;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Top-Down Recursion | Approach 2: Bottom-Up DFS |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N \log N)$** — Recalculates height at each level. | **$O(N)$** — Single postorder traversal pass. |
| **Space Complexity** | **$O(H)$** — Height of tree for call stack. | **$O(H)$** — Height of tree for recursive call stack. |

#### Edge Cases Handled:
* **Empty Tree** (`root = null`): returns `true`.
* **Deeply Imbalanced Subtree**: Imbalance detected early, returning `-1` and short-circuiting remaining calculations.
