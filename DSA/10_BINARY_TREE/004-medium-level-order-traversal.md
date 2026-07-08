# 004. Binary Tree Level Order Traversal (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 LinkedIn, Google, Amazon, Microsoft, Facebook/Meta
>
> **Interview Tag**: 🔥 **BFS LEVEL ORDER QUEUE** - Fundamental Breadth-First Search pattern. Links directly to the [Binary Tree Traversals Blueprint](../ALGORITHMS/binary-tree-traversals.md).

---

### 📝 1. Problem Statement
Given the `root` of a binary tree, return *the level order traversal of its nodes' values*. (i.e., from left to right, level by level).

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [3,9,20,null,null,15,7]`
* **Output**: `[[3],[9,20],[15,7]]`
* **Why**: The root level is `[3]`. The next level contains `[9, 20]`. The third level contains `[15, 7]`.

#### Test Case 2
* **Input**: `root = [1]`
* **Output**: `[[1]]`
* **Why**: The tree contains only 1 level.

---

### 💬 3. What is This Problem Actually Asking?
Traverse the tree level-by-level, returning a list of list of node values representing each level from top to bottom, left to right.

---

### 🌍 4. Real-Life Example
Imagine a company org chart. The CEO is Level 1. The Vice Presidents are Level 2. The Directors are Level 3. A level-order traversal groups employees by their rank, listing all VPs, then all Directors, rather than drilling down one specific reporting line at a time.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Recursive DFS (with Level Index)
We can solve level-order traversal using DFS by passing down a `level` index (starting at 0).
* If the result array size is equal to `level`, we initialize a new sub-array: `result[level] = []`.
* We push the current node's value to `result[level]`.
* We recursively call DFS on `left` and `right` child with `level + 1`.
* **Pros**: Simple, does not require an explicit queue.
* **Cons**: Depth-first routing behavior is less intuitive for level-based results; call stack height is **$O(H)$**.

#### Approach 2: Iterative BFS with Queue (Optimal)
We use a Queue to traverse level by level.
* Initialize a queue with `[root]`.
* In each iteration, record the `levelSize` (size of the queue).
* Run a loop `levelSize` times to dequeue nodes, record their values in a `currentLevel` array, and enqueue their left/right children.
* Push `currentLevel` to the final results.
* **Pros**: Natural breadth-first progression, matches structural layouts.
* **Cons**: Dequeuing from Javascript array shifts elements, causing $O(W)$ operations unless a custom LinkedList Deque is used (for typical interview scale, standard array `.shift()` is acceptable).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with a tree where root `3` has left child `9` and right child `20`.

#### **Step 0: Initial State**
* **Variables**: `queue = [3]`, `result = []`

#### **Step 1: Level 0 (Level Size = 1)**
```text
Queue:    [ 3 ]
Pointers:   ▲
          curr (dequeued 3)
```
* **State check**: Dequeue `3`. Push to `currentLevel = [3]`. Enqueue children `9` and `20`.
* **Updates**: `result = [[3]]`, `queue = [9, 20]`.
* **Next**: Next iteration of outer loop.

#### **Step 2: Level 1 (Level Size = 2)**
```text
Queue:    [ 9, 20 ]
Pointers:   ▲
          curr (dequeued 9)
```
* **State check**: Dequeue `9`. `currentLevel = [9]`. It has no children.
* **State check**: Dequeue `20`. `currentLevel = [9, 20]`. It has no children.
* **Updates**: `result = [[3], [9, 20]]`, `queue = []`.
* **Next**: Queue is empty, loop terminates.

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

function levelOrder(root: TreeNode | null): number[][] {
    // ==========================================
    // 1st Approach: Recursive DFS with Level Index (O(N) time, O(H) space)
    // ==========================================
    /*
    const result: number[][] = [];
    function dfs(node: TreeNode | null, level: number) {
        if (!node) return;
        if (result.length === level) {
            result.push([]);
        }
        result[level].push(node.val);
        dfs(node.left, level + 1);
        dfs(node.right, level + 1);
    }
    dfs(root, 0);
    return result;
    */

    // ==========================================
    // 2nd Approach: Iterative BFS Queue (Optimal)
    // ==========================================
    if (!root) return [];

    const result: number[][] = [];
    const queue: TreeNode[] = [root];

    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel: number[] = [];

        for (let i = 0; i < levelSize; i++) {
            const curr = queue.shift()!;
            currentLevel.push(curr.val);

            if (curr.left) queue.push(curr.left);
            if (curr.right) queue.push(curr.right);
        }

        result.push(currentLevel);
    }

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Recursive DFS | Approach 2: Iterative BFS |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Visited each node exactly once. | **$O(N)$** — Processed each node exactly once. |
| **Space Complexity** | **$O(H)$** — Height of tree for recursive call stack. | **$O(W)$** — Max width of tree (up to $N/2$ nodes stored in queue). |

#### Edge Cases Handled:
* **Empty Tree** (`root = null`): Handled by early check, returns empty array `[]`.
* **Deep Skewed Tree**: BFS queue size remains 1 at all times, making space complexity optimal $O(1)$ compared to DFS $O(N)$ call stack.
