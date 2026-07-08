# 008. Invert a Binary Tree (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon, Microsoft, Adobe
>
> **Interview Tag**: 🔥 **DFS SWAP RECURSION** - Essential tree pointer restructuring pattern.

---

### 📝 1. Problem Statement
Given the `root` of a binary tree, *invert the tree*, and return *its root*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [4,2,7,1,3,6,9]`
* **Output**: `[4,7,2,9,6,3,1]`
* **Why**: The tree is inverted:
  ```text
        4                 4
       / \               / \
      2   7     ==>     7   2
     / \ / \           / \ / \
    1  3 6  9         9  6 3  1
  ```

#### Test Case 2
* **Input**: `root = []`
* **Output**: `[]`
* **Why**: The tree is empty.

---

### 💬 3. What is This Problem Actually Asking?
Swap the left and right children of every node in the binary tree.

---

### 🌍 4. Real-Life Example
Imagine looking at a digital organizational chart and clicking a "Flip Layout" button. All reporting relationships remain the same, but the visual orientation is mirrored: left-side sub-departments are now on the right, and vice versa.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Iterative BFS with Queue
Use a queue to traverse the tree level by level.
* Enqueue the `root`.
* Pop a node, swap its left and right children.
* Enqueue any non-null children.
* **Pros**: Simple, standard BFS structure.
* **Cons**: Queue memory overhead.

#### Approach 2: Recursive DFS (Optimal)
Perform a postorder/preorder traversal and swap pointers.
* If `root === null`, return `null`.
* Swap the left and right pointers of the current node:
  ```typescript
  const temp = root.left;
  root.left = root.right;
  root.right = temp;
  ```
* Recursively invert the left and right subtrees.
* **Pros**: Incredibly short and highly intuitive.
* **Cons**: Call stack memory footprint of **$O(H)$**.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with a tree where root `4` has left child `2` and right child `7`.

#### **Step 0: Initial State**
* Call `invertTree(4)`.

#### **Step 1: Swap children at root 4**
```text
Tree:       4                 4
           / \     ==>       / \
          2   7             7   2
Pointers: ▲                 ▲
         left              left (now points to 7)
```
* Temp swap: `left = 7`, `right = 2`.
* Recurse on left child (7) $\rightarrow$ inverts children of 7.
* Recurse on right child (2) $\rightarrow$ inverts children of 2.
* **Result**: Returns inverted root `4`.

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

function invertTree(root: TreeNode | null): TreeNode | null {
    // ==========================================
    // 1st Approach: Iterative BFS Queue (O(N) time, O(W) space)
    // ==========================================
    /*
    if (!root) return null;
    const queue: TreeNode[] = [root];
    while (queue.length > 0) {
        const curr = queue.shift()!;
        
        // Swap left and right children
        const temp = curr.left;
        curr.left = curr.right;
        curr.right = temp;

        if (curr.left) queue.push(curr.left);
        if (curr.right) queue.push(curr.right);
    }
    return root;
    */

    // ==========================================
    // 2nd Approach: Recursive DFS Swap (Optimal)
    // ==========================================
    if (root === null) return null;

    // Swap left and right child pointers
    const temp = root.left;
    root.left = root.right;
    root.right = temp;

    // Recurse down subtrees
    invertTree(root.left);
    invertTree(root.right);

    return root;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Iterative BFS | Approach 2: Recursive DFS |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Processed all $N$ nodes. | **$O(N)$** — Processed all $N$ nodes. |
| **Space Complexity** | **$O(W)$** — Queue storage. | **$O(H)$** — Height of tree for recursive call stack. |

#### Edge Cases Handled:
* **Empty Tree** (`root = null`): returns `null` immediately.
* **Single Node**: swaps null children, returns same root.
* **Skewed Tree**: Left-skewed tree gets converted to right-skewed tree correctly.
