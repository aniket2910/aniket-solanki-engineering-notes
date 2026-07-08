# 011. Diameter of a Binary Tree (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Facebook/Meta, Google, Amazon, Microsoft
>
> **Interview Tag**: 🔥 **DFS DEPTH TRAVERSAL UPDATE** - Key pattern for computing global properties based on local node states.

---

### 📝 1. Problem Statement
Given the `root` of a binary tree, return *the length of the **diameter** of the tree*.

The **diameter** of a binary tree is the **length of the longest path between any two nodes in a tree**. This path may or may not pass through the `root`.

The length of a path between two nodes is represented by the number of edges between them.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [1,2,3,4,5]`
* **Output**: `3`
* **Why**: The longest path is `4 -> 2 -> 1 -> 3` or `5 -> 2 -> 1 -> 3`, which has 3 edges.

#### Test Case 2
* **Input**: `root = [1,2]`
* **Output**: `1`
* **Why**: The only path is `2 -> 1`, which has 1 edge.

---

### 💬 3. What is This Problem Actually Asking?
Find the maximum sum of left-height and right-height over all nodes in the tree.

$$\text{diameter\_at\_node} = \text{height}(node.left) + \text{height}(node.right)$$

---

### 🌍 4. Real-Life Example
Imagine a network of water pipes connected in a tree structure. You want to find the longest continuous run of pipe between any two endpoints. The longest run is found by identifying a junction node where the combined length of the deepest left pipe network and the deepest right pipe network is maximized.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Pure Recursive Tuple DFS
A pure recursive helper function `dfs(node)` that returns a tuple `[height, maxDiameter]`.
* `height` is `Math.max(leftHeight, rightHeight) + 1`.
* `maxDiameter` is `Math.max(leftDiameter, rightDiameter, leftHeight + rightHeight)`.
* **Pros**: Clean functional style; avoids using a mutable global/outer scope variable.
* **Cons**: Marginally more tuple object allocations.

#### Approach 2: DFS Depth Traversal with Shared Max State (Optimal)
Maintain a shared `maxDiameter` variable. Perform a postorder traversal that calculates the height of the left and right subtrees:
* `leftHeight = dfs(node.left)`
* `rightHeight = dfs(node.right)`
* Update `maxDiameter = Math.max(maxDiameter, leftHeight + rightHeight)`.
* Return the height of the current node: `Math.max(leftHeight, rightHeight) + 1`.
* **Pros**: Simple, highly optimized, standard implementation pattern.
* **Cons**: Relies on mutable outer state.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with `root = [1, 2, 3, 4, 5]`.

#### **Step 0: Initial State**
* `maxDiameter = 0`. Call `dfs(1)`.

#### **Step 1: Check node 4 and 5 (leaves)**
* `dfs(4)` returns height `1`. `maxDiameter = max(0, 0 + 0) = 0`.
* `dfs(5)` returns height `1`. `maxDiameter = max(0, 0 + 0) = 0`.

#### **Step 2: Check node 2**
* `leftHeight = height(4) = 1`. `rightHeight = height(5) = 1`.
* Update diameter: `maxDiameter = max(0, 1 + 1) = 2`.
* Return height: `max(1, 1) + 1 = 2`.

#### **Step 3: Check node 3 (leaf)**
* `dfs(3)` returns height `1`. `maxDiameter = max(2, 0) = 2`.

#### **Step 4: Check root node 1**
```text
Tree:           1
               / \
        (H=2) 2   3 (H=1)
       / \
      4   5
Compare at root: diameter = 2 + 1 = 3 -> maxDiameter = max(2, 3) = 3
```
* `leftHeight = height(2) = 2`. `rightHeight = height(3) = 1`.
* Update diameter: `maxDiameter = max(2, 2 + 1) = 3`.
* Return height: `max(2, 1) + 1 = 3`.
* **Result**: returns `3`.

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

function diameterOfBinaryTree(root: TreeNode | null): number {
    // ==========================================
    // 1st Approach: Pure Recursive Tuple DFS (O(N) time, O(H) space)
    // ==========================================
    /*
    function getStats(node: TreeNode | null): [number, number] {
        if (!node) return [0, 0]; // [height, diameter]

        const [leftHeight, leftDiameter] = getStats(node.left);
        const [rightHeight, rightDiameter] = getStats(node.right);

        const currentHeight = Math.max(leftHeight, rightHeight) + 1;
        const currentDiameter = Math.max(
            leftHeight + rightHeight,
            Math.max(leftDiameter, rightDiameter)
        );

        return [currentHeight, currentDiameter];
    }
    return getStats(root)[1];
    */

    // ==========================================
    // 2nd Approach: DFS with Shared Max State (Optimal)
    // ==========================================
    let maxDiameter = 0;

    function dfs(node: TreeNode | null): number {
        if (node === null) return 0;

        const leftHeight = dfs(node.left);
        const rightHeight = dfs(node.right);

        // Update diameter if the path through current node is larger
        maxDiameter = Math.max(maxDiameter, leftHeight + rightHeight);

        // Return height of current node
        return Math.max(leftHeight, rightHeight) + 1;
    }

    dfs(root);
    return maxDiameter;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Tuple DFS | Approach 2: DFS with Shared State |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Visited each node once. | **$O(N)$** — Visited each node once. |
| **Space Complexity** | **$O(H)$** — Height of tree for call stack. | **$O(H)$** — Height of tree (implicit call stack). |

#### Edge Cases Handled:
* **Empty Tree** (`root = null`): returns `0`.
* **Single Node Tree**: returns `0` (since left/right heights are 0, diameter is 0).
* **Deep Skewed Tree** (`1 -> 2 -> 3`): correct traversal, yields height 3, diameter 2.
