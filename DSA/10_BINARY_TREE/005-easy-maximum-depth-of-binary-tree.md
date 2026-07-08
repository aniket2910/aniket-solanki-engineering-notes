# 005. Maximum Depth of Binary Tree (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon, Microsoft, Facebook/Meta
>
> **Interview Tag**: 🔥 **DIVIDE AND CONQUER DFS** - Primary pattern for height-based tree calculations.

---

### 📝 1. Problem Statement
Given the `root` of a binary tree, return *its maximum depth*.

A binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [3,9,20,null,null,15,7]`
* **Output**: `3`
* **Why**: The path `3 -> 20 -> 15` has 3 nodes.

#### Test Case 2
* **Input**: `root = [1, null, 2]`
* **Output**: `2`
* **Why**: The path `1 -> 2` has 2 nodes.

---

### 💬 3. What is This Problem Actually Asking?
Determine the number of levels in a binary tree.

---

### 🌍 4. Real-Life Example
Imagine estimating the number of floors in a skyscraper when you only know how many floors each of your branch offices has. You call the managers of your Left and Right branches, find out who has the taller office stack, and add 1 (for your own floor) to get the total height.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Recursive DFS (Divide & Conquer)
Calculate the maximum depth by splitting the tree into left and right subtrees.
* If `root === null`, return 0.
* Return `Math.max(maxDepth(root.left), maxDepth(root.right)) + 1`.
* **Pros**: Incredibly short and mathematically elegant.
* **Cons**: Uses implicit stack space of **$O(H)$**.

#### Approach 2: Iterative BFS (Level Order)
Perform a standard BFS traversal, maintaining a level counter.
* For each level processed, increment the counter.
* **Pros**: Uses explicit memory and processes level-by-level (intuitive for depth).
* **Cons**: Stores the entire widest level in memory.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 1 with a tree where root `3` has left child `9` and right child `20`.

#### **Step 0: Initial State**
* Call `maxDepth(3)`.

#### **Step 1: Check Left Subtree (node 9)**
* Call `maxDepth(9)` $\rightarrow$ calls `maxDepth(null)` on left/right children $\rightarrow$ returns `1`.

#### **Step 2: Check Right Subtree (node 20)**
* Call `maxDepth(20)` $\rightarrow$ calls `maxDepth(null)` on left/right children $\rightarrow$ returns `1`.

#### **Step 3: Combine Results at Root**
```text
Tree:       3
           / \
          9   20
Heights:  1    1
Formula: max(1, 1) + 1 = 2
```
* Return `max(1, 1) + 1 = 2`.
* **Result**: Max depth is 2.

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

function maxDepth(root: TreeNode | null): number {
    // ==========================================
    // 1st Approach: Iterative BFS Level Count (O(N) time, O(W) space)
    // ==========================================
    /*
    if (!root) return 0;
    let depth = 0;
    const queue: TreeNode[] = [root];
    while (queue.length > 0) {
        const size = queue.length;
        for (let i = 0; i < size; i++) {
            const curr = queue.shift()!;
            if (curr.left) queue.push(curr.left);
            if (curr.right) queue.push(curr.right);
        }
        depth++;
    }
    return depth;
    */

    // ==========================================
    // 2nd Approach: Bottom-up Recursive DFS (Optimal)
    // ==========================================
    if (root === null) return 0;

    const leftDepth = maxDepth(root.left);
    const rightDepth = maxDepth(root.right);

    return Math.max(leftDepth, rightDepth) + 1;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Iterative BFS | Approach 2: Recursive DFS |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Visited every node exactly once. | **$O(N)$** — Evaluated subtrees of each node exactly once. |
| **Space Complexity** | **$O(W)$** — Max width (queue storage). | **$O(H)$** — Height of tree (implicit recursive call stack). |

#### Edge Cases Handled:
* **Empty Tree** (`root = null`): returns `0` immediately.
* **Single Node**: returns `1` since left/right calls return `0`, adding `1` yields `1`.
