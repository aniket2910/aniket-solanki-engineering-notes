# 018. Binary Tree Maximum Path Sum (Hard)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon, Microsoft, Facebook/Meta
>
> **Interview Tag**: 🔥 **DFS POSTORDER SUM OPTIMIZATION** - Legendary hard tree optimization pattern.

---

### 📝 1. Problem Statement
A **path** in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence **at most once**. Note that the path does not need to pass through the root.

The **path sum** of a path is the sum of the node's values in the path.

Given the `root` of a binary tree, return *the maximum path sum of any non-empty path*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [1,2,3]`
* **Output**: `6`
* **Why**: The optimal path is `2 -> 1 -> 3` which yields a sum of `2 + 1 + 3 = 6`.

#### Test Case 2
* **Input**: `root = [-10,9,20,null,null,15,7]`
* **Output**: `42`
* **Why**: The optimal path is `15 -> 20 -> 7` which yields a sum of `15 + 20 + 7 = 42`.

---

### 💬 3. What is This Problem Actually Asking?
Find the maximum sum path in the tree, where a path can split at any node (extend left and right) but cannot backtrack (a path cannot bifurcate at multiple junctions).

---

### 🌍 4. Real-Life Example
Imagine a highway network linking cities (nodes) with varying economic toll values (positive values indicate high profit, negative values indicate high operating tolls). You want to plan a freight route that maximizes total economic return. The route can start anywhere and end anywhere, but it cannot double back on itself.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Recursive Postorder Traversal (Optimal)
We perform a postorder DFS traversal. For each node, we compute the maximum sum it can contribute to a path *above* it.
* A helper function `gain(node)` returns the max branch sum (either left or right) that can continue upwards:
  * `leftGain = Math.max(gain(node.left), 0)` (ignore negative paths).
  * `rightGain = Math.max(gain(node.right), 0)`.
* At the current node, we check the sum of the path that **splits** at this node:
  * `currentPathSum = node.val + leftGain + rightGain`.
* Update our global variable `maxSum = Math.max(maxSum, currentPathSum)`.
* Return the single branch gain that can continue up to the parent: `node.val + Math.max(leftGain, rightGain)`.
* **Pros**: Highly efficient **$O(N)$** time complexity, standard optimal solution.
* **Cons**: Relies on a shared mutable state, recursion intuition is challenging.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 1 with `root = [-10, 9, 20, null, null, 15, 7]`.

#### **Step 0: Initial State**
* `maxSum = -Infinity`. Call `gain(-10)`.

#### **Step 1: Check node 9 (leaf)**
* `leftGain = 0`, `rightGain = 0`.
* `pathSum = 9 + 0 + 0 = 9`. Update `maxSum = max(-Inf, 9) = 9`.
* Return gain: `9 + max(0, 0) = 9`.

#### **Step 2: Check node 15 and 7 (leaves)**
* `gain(15)` returns `15`. Update `maxSum = max(9, 15) = 15`.
* `gain(7)` returns `7`. Update `maxSum = max(15, 7) = 15`.

#### **Step 3: Check node 20**
* `leftGain = 15`, `rightGain = 7`.
* `pathSum = 20 + 15 + 7 = 42`. Update `maxSum = max(15, 42) = 42`.
* Return gain: `20 + max(15, 7) = 35`.

#### **Step 4: Check root node -10**
```text
Tree:          -10
               /  \
        (G=9) 9    20 (G=35)
                  /  \
                 15   7
Compare at root: pathSum = -10 + 9 + 35 = 34 -> maxSum = max(42, 34) = 42
```
* `leftGain = 9`, `rightGain = 35`.
* `pathSum = -10 + 9 + 35 = 34`.
* `maxSum = max(42, 34) = 42`.
* Return gain: `-10 + max(9, 35) = 25`.
* **Result**: returns `42`.

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

function maxPathSum(root: TreeNode | null): number {
    // ==========================================
    // 1st Approach: Recursive Postorder Gain Tracking (Optimal)
    // ==========================================
    let maxSum = -Infinity;

    function getGain(node: TreeNode | null): number {
        if (node === null) return 0;

        // Calculate maximum gain from left and right subtrees (ignore negative contributions)
        const leftGain = Math.max(getGain(node.left), 0);
        const rightGain = Math.max(getGain(node.right), 0);

        // Path sum if we choose current node as the path bridge split point
        const currentPathSum = node.val + leftGain + rightGain;

        // Update the global maximum path sum
        maxSum = Math.max(maxSum, currentPathSum);

        // Return the maximum single path branch gain to parent node
        return node.val + Math.max(leftGain, rightGain);
    }

    getGain(root);
    return maxSum;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Postorder Gain (Optimal) |
| :--- | :--- |
| **Time Complexity** | **$O(N)$** — Visited each node exactly once. |
| **Space Complexity** | **$O(H)$** — Height of tree for implicit stack storage. |

#### Edge Cases Handled:
* **All Negative Values** (`[-3, -2, -1]`): `max(gain, 0)` checks prevent selecting negative leaf branches. The path sum at node `-1` is `-1 + 0 + 0 = -1`, updating `maxSum` correctly to `-1` (instead of 0, which doesn't exist).
* **Single Node**: returns `node.val` immediately.
