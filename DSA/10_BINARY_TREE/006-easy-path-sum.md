# 006. Path Sum (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Microsoft, Amazon, Google, Meta
>
> **Interview Tag**: 🔥 **DFS TOP-DOWN BACKTRACKING** - Fundamental top-down path validation pattern.

---

### 📝 1. Problem Statement
Given the `root` of a binary tree and an integer `targetSum`, return `true` if the tree has a **root-to-leaf** path such that adding up all the values along the path equals `targetSum`.

A **leaf** is a node with no children.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [5,4,8,11,null,13,4,7,2,null,null,null,1]`, `targetSum = 22`
* **Output**: `true`
* **Why**: The root-to-leaf path `5 -> 4 -> 11 -> 2` sums to `5 + 4 + 11 + 2 = 22`.

#### Test Case 2
* **Input**: `root = [1,2,3]`, `targetSum = 5`
* **Output**: `false`
* **Why**: The root-to-leaf paths are `1 -> 2` (sum = 3) and `1 -> 3` (sum = 4). Neither matches 5.

---

### 💬 3. What is This Problem Actually Asking?
Determine if there exists a path starting from the root and ending at a leaf node whose values add up to exactly `targetSum`.

---

### 🌍 4. Real-Life Example
Imagine embarking on a toll highway. You start with exactly $22 in cash (`targetSum`). Each toll booth along the road charges a specific amount (`node.val`). You want to find out if there's a path through the toll highway system that leaves you with exactly $0 when you exit at a toll road terminal (leaf node).

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Iterative DFS with Pair Stack
Use an explicit stack storing pairs `[currentNode, currentRemainingSum]`.
* Push `[root, targetSum - root.val]` to stack.
* Pop elements, and if we reach a leaf node with `remainingSum === 0`, return `true`.
* Otherwise, push children to stack with their updated remaining sums.
* **Pros**: No recursion stack overflow risk.
* **Cons**: Marginally more complex storage overhead (tuples in stack).

#### Approach 2: Recursive DFS (Optimal)
We perform a top-down traversal, subtracting the current node's value from `targetSum`.
* If `root === null`, return `false`.
* If we are at a leaf node (`root.left === null && root.right === null`), check if `targetSum === root.val`.
* Recursively check left and right subtrees with `targetSum - root.val`.
* **Pros**: Very clean, straightforward logic.
* **Cons**: Recursive call stack overhead of **$O(H)$**.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with a tree where root `5` has left child `4` and right child `8`, `targetSum = 9`.

#### **Step 0: Initial State**
* Call `hasPathSum(5, 9)`.

#### **Step 1: Check root (5)**
* Not a leaf. Decrement target: `9 - 5 = 4`.
* Recurse on left: `hasPathSum(4, 4)`.
* Recurse on right: `hasPathSum(8, 4)`.

#### **Step 2: Recurse on Left (node 4)**
```text
Tree:       5
           / \
          4   8
Target:   9 -> 4
Pointers: ▲
         node 4 (leaf) -> targetSum (4) === node.val (4) -> TRUE
```
* Node `4` is a leaf node. Check if `targetSum (4) === node.val (4)`. This is true.
* Returns `true`.
* The right child recursion `hasPathSum(8, 4)` is short-circuited.
* **Result**: Return `true`.

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

function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
    // ==========================================
    // 1st Approach: Iterative DFS with Pair Stack (O(N) time, O(H) space)
    // ==========================================
    /*
    if (!root) return false;
    const stack: [TreeNode, number][] = [[root, targetSum - root.val]];
    while (stack.length > 0) {
        const [node, currSum] = stack.pop()!;
        
        // If leaf and target is met
        if (!node.left && !node.right && currSum === 0) {
            return true;
        }

        if (node.right) {
            stack.push([node.right, currSum - node.right.val]);
        }
        if (node.left) {
            stack.push([node.left, currSum - node.left.val]);
        }
    }
    return false;
    */

    // ==========================================
    // 2nd Approach: Top-Down Recursive DFS (Optimal)
    // ==========================================
    if (root === null) return false;

    // Check if leaf node
    if (root.left === null && root.right === null) {
        return targetSum === root.val;
    }

    const remainingSum = targetSum - root.val;
    return hasPathSum(root.left, remainingSum) || hasPathSum(root.right, remainingSum);
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Iterative DFS | Approach 2: Recursive DFS |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Visited each node once. | **$O(N)$** — Visited each node once. |
| **Space Complexity** | **$O(H)$** — Height of tree for explicit stack storage. | **$O(H)$** — Height of tree (implicit call stack). |

#### Edge Cases Handled:
* **Empty Tree** (`root = null`): Returns `false` immediately.
* **Negative Values / Targets** (e.g. node values are negative): Handled correctly since we use exact mathematical difference without greedy early pruning.
* **Single Node with Target Match**: Returns true immediately inside leaf condition.
