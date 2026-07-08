# 015. Binary Tree Right Side View (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Facebook/Meta, Amazon, Google, Bloomberg
>
> **Interview Tag**: 🔥 **DFS ROOT-RIGHT-LEFT MAX DEPTH** - Highly optimized traversal for projecting boundaries.

---

### 📝 1. Problem Statement
Given the `root` of a binary tree, imagine yourself standing on the **right side** of it, return *the values of the nodes you can see ordered from top to bottom*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [1,2,3,null,5,null,4]`
* **Output**: `[1,3,4]`
* **Why**: Looking from the right side, the visible nodes at each level are 1, 3, and 4.
  ```text
       1            <-- 1
      / \
     2   3          <-- 3
      \   \
       5   4        <-- 4
  ```

#### Test Case 2
* **Input**: `root = [1,null,3]`
* **Output**: `[1,3]`
* **Why**: Node 3 blocks anything on its left, only 1 and 3 are visible.

---

### 💬 3. What is This Problem Actually Asking?
Return the rightmost node's value at each level of the binary tree.

---

### 🌍 4. Real-Life Example
Imagine viewing a tiered wedding cake from the side. You only see the outer edge of each cake tier. Even if a tier has decorations on its inner surface (left child), you can only see the rightmost decoration (right child) on the outer perimeter of each level.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Level Order BFS (Queue-based)
Perform a standard BFS level order traversal.
* For each level, loop through all nodes.
* Push the value of the **last node** of that level to our results array.
* **Pros**: Simple, matches the level-by-level requirement directly.
* **Cons**: Stores the entire level width in memory, which is sub-optimal compared to DFS.

#### Approach 2: Modified DFS (Root -> Right -> Left) (Optimal)
We perform a DFS traversal, but visit the **right child** before the left child.
* Pass down a `depth` variable (starting at 0).
* At each node, check if `depth === result.length`. If it is, this is the first time we are visiting a node at this depth, and since we traverse right first, it must be the rightmost node! Push its value to `result`.
* Recursively traverse `node.right` with `depth + 1`.
* Recursively traverse `node.left` with `depth + 1`.
* **Pros**: Incredibly clean, optimal **$O(H)$** space complexity.
* **Cons**: The order of traversal must be strictly `Right` then `Left` to guarantee the rightmost node is visited first.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with `root = [1, 2, 3, null, 5, null, 4]`.

#### **Step 0: Initial State**
* `result = []`. Call `dfs(1, 0)`.

#### **Step 1: Process root 1 (depth = 0)**
* `result.length === depth (0 === 0)`. Push `1` $\rightarrow$ `result = [1]`.
* Recurse right: `dfs(3, 1)`.

#### **Step 2: Process node 3 (depth = 1)**
* `result.length === depth (1 === 1)`. Push `3` $\rightarrow$ `result = [1, 3]`.
* Recurse right: `dfs(4, 2)`.

#### **Step 3: Process node 4 (depth = 2)**
* `result.length === depth (2 === 2)`. Push `4` $\rightarrow$ `result = [1, 3, 4]`.
* Node `4` has no children, recursion returns.

#### **Step 4: Recurse left from node 1 (node 2, depth = 1)**
* `result.length (3) !== depth (1)`. Do not push.
* Recurse right: `dfs(5, 2)`.

#### **Step 5: Process node 5 (depth = 2)**
```text
Tree:       1
           / \
          2   3
           \   \
            5   4
Pointers:   ▲
          node 5 (depth = 2) -> result.length is 3 -> already has level 2 (value 4) -> skip
```
* `result.length (3) !== depth (2)`. Do not push.
* Returns, loop finishes.
* **Result**: `[1, 3, 4]`.

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

function rightSideView(root: TreeNode | null): number[] {
    // ==========================================
    // 1st Approach: Level Order BFS (O(N) time, O(W) space)
    // ==========================================
    /*
    if (!root) return [];
    const result: number[] = [];
    const queue: TreeNode[] = [root];
    while (queue.length > 0) {
        const size = queue.length;
        for (let i = 0; i < size; i++) {
            const curr = queue.shift()!;
            
            // If it is the last element of current level, add to view
            if (i === size - 1) {
                result.push(curr.val);
            }

            if (curr.left) queue.push(curr.left);
            if (curr.right) queue.push(curr.right);
        }
    }
    return result;
    */

    // ==========================================
    // 2nd Approach: DFS Root -> Right -> Left (Optimal)
    // ==========================================
    const result: number[] = [];

    function dfs(node: TreeNode | null, depth: number) {
        if (node === null) return;

        // If this is the first node we see at this depth level
        if (depth === result.length) {
            result.push(node.val);
        }

        // Visit right child first so it populates the depth level first
        dfs(node.right, depth + 1);
        dfs(node.left, depth + 1);
    }

    dfs(root, 0);
    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Level Order BFS | Approach 2: DFS (Right First) |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Processed all nodes. | **$O(N)$** — Visited all nodes. |
| **Space Complexity** | **$O(W)$** — Stores widest level (queue size). | **$O(H)$** — Height of tree for stack storage. |

#### Edge Cases Handled:
* **Empty Tree** (`root = null`): returns empty array `[]`.
* **Left-skewed Tree** (`1 -> 2 -> 3`): DFS falls through left nodes correctly after exploring right nulls, adding 2 and 3 at each depth.
