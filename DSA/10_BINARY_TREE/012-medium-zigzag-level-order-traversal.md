# 012. Binary Tree Zigzag Level Order Traversal (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Microsoft, Amazon, Google, Bloomberg
>
> **Interview Tag**: **BFS LEVEL ORDER ZIGZAG** - BFS queue pattern with direction switching.

---

### 📝 1. Problem Statement
Given the `root` of a binary tree, return *the zigzag level order traversal of its nodes' values*. (i.e., from left to right, then right to left for the next level, and alternate between).

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [3,9,20,null,null,15,7]`
* **Output**: `[[3],[20,9],[15,7]]`
* **Why**: 
  * Level 0: `[3]` (Left-to-right)
  * Level 1: `[20, 9]` (Right-to-left)
  * Level 2: `[15, 7]` (Left-to-right)

#### Test Case 2
* **Input**: `root = [1]`
* **Output**: `[[1]]`
* **Why**: Alternations only start from Level 1.

---

### 💬 3. What is This Problem Actually Asking?
Perform a level order traversal, but reverse the element ordering of every odd-indexed level (1-indexed second level, fourth level, etc.).

---

### 🌍 4. Real-Life Example
Imagine a standard lawn mower scanning a field. Instead of starting back at the left edge for every single row, it mows left-to-right, turns down to the next row, mows right-to-left, and continues in a snake-like "zigzag" path to optimize path movement.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Recursive DFS (with Level & Unshift)
We can solve zigzag traversal using DFS by passing down a `level` index (starting at 0).
* If the result array size is equal to `level`, we initialize a new sub-array.
* If `level % 2 === 0`, push the node's value to the end of `result[level]` (`result[level].push(node.val)`).
* If `level % 2 !== 0`, insert the node's value at the beginning of `result[level]` (`result[level].unshift(node.val)`).
* Recursively traverse left and right child with `level + 1`.
* **Pros**: Simple recursive setup, avoids queue structures.
* **Cons**: Array `.unshift()` operation takes $O(W)$ time per insertion, where $W$ is level size, causing performance overhead.

#### Approach 2: Iterative BFS with Queue & Level Array Flag (Optimal)
Perform a standard BFS traversal using a Queue.
* Maintain a boolean flag `leftToRight = true`.
* In each iteration, retrieve the `levelSize`.
* Create a temporary array `currentLevel` of size `levelSize`.
* For each dequeued node:
  * Find its target index: if `leftToRight` is true, index is `i` (forward). Otherwise, index is `levelSize - 1 - i` (reverse).
  * Insert node value directly at target index.
  * Enqueue children.
* Push `currentLevel` to results and invert `leftToRight = !leftToRight`.
* **Pros**: Natural BFS level order sequence; index positioning is $O(1)$ constant time (highly optimal).
* **Cons**: Requires explicit flag management.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with a tree where root `3` has left child `9` and right child `20`.

#### **Step 0: Initial State**
* **Variables**: `queue = [3]`, `result = []`, `leftToRight = true`

#### **Step 1: Level 0 (Size = 1, leftToRight = true)**
```text
Queue:          [ 3 ]
leftToRight:    true (Index = 0)
currentLevel:   [ 3 ]
```
* Dequeue `3`. Put at index `0` $\rightarrow$ `currentLevel = [3]`. Enqueue `9`, `20`.
* `result = [[3]]`, `leftToRight = false`, `queue = [9, 20]`.

#### **Step 2: Level 1 (Size = 2, leftToRight = false)**
```text
Queue:          [ 9, 20 ]
leftToRight:    false (Index = 1 - i)
currentLevel:   [ _, _ ]
i=0 (node 9):   Put at index 1 -> [ _, 9 ]
i=1 (node 20):  Put at index 0 -> [ 20, 9 ]
```
* Dequeue `9` ($i=0$). Target index: `2 - 1 - 0 = 1`. `currentLevel = [_, 9]`.
* Dequeue `20` ($i=1$). Target index: `2 - 1 - 1 = 0`. `currentLevel = [20, 9]`.
* `result = [[3], [20, 9]]`, `leftToRight = true`, `queue = []`.
* **Result**: Loop terminates. Returns `[[3], [20, 9]]`.

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

function zigzagLevelOrder(root: TreeNode | null): number[][] {
    // ==========================================
    // 1st Approach: Recursive DFS Level insertion (O(N * W) time, O(H) space)
    // ==========================================
    /*
    const result: number[][] = [];
    function dfs(node: TreeNode | null, level: number) {
        if (!node) return;
        if (result.length === level) {
            result.push([]);
        }
        if (level % 2 === 0) {
            result[level].push(node.val);
        } else {
            result[level].unshift(node.val); // Shifting is O(W)
        }
        dfs(node.left, level + 1);
        dfs(node.right, level + 1);
    }
    dfs(root, 0);
    return result;
    */

    // ==========================================
    // 2nd Approach: Iterative BFS with Index Placement (Optimal)
    // ==========================================
    if (!root) return [];

    const result: number[][] = [];
    const queue: TreeNode[] = [root];
    let leftToRight = true;

    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = new Array<number>(levelSize);

        for (let i = 0; i < levelSize; i++) {
            const curr = queue.shift()!;
            
            // Determine placement index based on direction
            const index = leftToRight ? i : levelSize - 1 - i;
            currentLevel[index] = curr.val;

            if (curr.left) queue.push(curr.left);
            if (curr.right) queue.push(curr.right);
        }

        result.push(currentLevel);
        leftToRight = !leftToRight; // Alternate direction
    }

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Recursive DFS | Approach 2: Iterative BFS |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N \cdot W)$** — Array unshifting operations at each level. | **$O(N)$** — Direct indexing placement is $O(1)$ per node. |
| **Space Complexity** | **$O(H)$** — Height of tree for call stack. | **$O(W)$** — Max width of tree (queue storage). |

#### Edge Cases Handled:
* **Empty Tree** (`root = null`): returns `[]`.
* **Single Node**: loop runs once, `leftToRight` alternates, returns `[[1]]` immediately.
* **Deep Skewed Tree**: BFS queue size is 1, space is optimal $O(1)$.
