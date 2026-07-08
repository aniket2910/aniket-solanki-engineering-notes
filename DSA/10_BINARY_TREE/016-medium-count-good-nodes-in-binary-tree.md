# 016. Count Good Nodes in Binary Tree (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Microsoft, Amazon, Google
>
> **Interview Tag**: **DFS PATH MAX PROPAGATION** - Classic top-down state tracking pattern.

---

### 📝 1. Problem Statement
Given a binary tree `root`, a node $X$ in the tree is named **good** if in the path from root to $X$, there are no nodes with a value *greater than* $X$.

Return the number of **good** nodes in the binary tree.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [3,1,4,3,null,1,5]`
* **Output**: `4`
* **Why**: 
  * Root `3` is always good (no nodes preceding it).
  * Node `4` is good (path `3 -> 4`, max is 4, `4 >= 4`).
  * Node `5` is good (path `3 -> 4 -> 5`, max is 5, `5 >= 5`).
  * Node `3` (under left child `1`) is good (path `3 -> 1 -> 3`, max is 3, `3 >= 3`).
  * Node `1` (left child of root) is not good (`1 < 3`).
  * Node `1` (under right child `4`) is not good (`1 < 4`).
  * Total good nodes = 4.

#### Test Case 2
* **Input**: `root = [3,3,null,4,2]`
* **Output**: `3`
* **Why**: 
  * Root `3` is good.
  * Node `3` (left child) is good (`3 >= 3`).
  * Node `4` is good (`4 >= 3`).
  * Node `2` is not good (`2 < 3` path max).

---

### 💬 3. What is This Problem Actually Asking?
Tally all nodes in the tree whose value is greater than or equal to the maximum node value seen on the path from the root down to that node.

---

### 🌍 4. Real-Life Example
Imagine hiking down a mountain path. As you descend, you look for lookout points (nodes). A lookout point is "good" if it offers a clear view, which is only possible if you haven't passed any peak taller than your current altitude since you started the hike (i.e., your current altitude is the highest or equal to the highest peak on your path so far).

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Iterative DFS with Pair Stack
Use an explicit stack containing pairs `[currentNode, maxValSeenSoFar]`.
* Pop the node.
* If `node.val >= maxValSeenSoFar`, increment our `goodNodesCount` and update `maxValSeenSoFar = node.val`.
* Push children with their updated `maxValSeenSoFar`.
* **Pros**: No recursion call stack overhead.
* **Cons**: Marginally more tuple allocations on the stack.

#### Approach 2: Recursive DFS (Optimal)
We traverse the tree recursively, passing down the maximum value seen along the path.
* If `node === null`, return 0.
* Let `isGood = node.val >= maxVal ? 1 : 0`.
* Let `newMax = Math.max(maxVal, node.val)`.
* Return `isGood + dfs(node.left, newMax) + dfs(node.right, newMax)`.
* **Pros**: Incredibly short and highly optimized.
* **Cons**: Stack space is **$O(H)$**.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with `root = [3, 1, 4]`.

#### **Step 0: Initial State**
* Call `dfs(root, -Infinity) = dfs(node 3, -Infinity)`.

#### **Step 1: Process root 3**
* `node.val (3) >= maxVal (-Infinity)`. It is a good node (`count = 1`).
* Update `newMax = 3`.
* Recurse left: `dfs(node 1, 3)`.
* Recurse right: `dfs(node 4, 3)`.

#### **Step 2: Process left node 1**
* `node.val (1) < maxVal (3)`. Not a good node (`count = 0`).
* Returns `0`.

#### **Step 3: Process right node 4**
```text
Tree:       3
           / \
          1   4
Pointers:     ▲
          node 4 (maxVal = 3) -> val (4) >= maxVal (3) -> GOOD -> return 1
```
* `node.val (4) >= maxVal (3)`. It is a good node (`count = 1`).
* Returns `1`.

#### **Step 4: Combine**
* Root returns `1 (root) + 0 (left) + 1 (right) = 2`.
* **Result**: returns `2`.

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

function goodNodes(root: TreeNode | null): number {
    // ==========================================
    // 1st Approach: Iterative DFS with Pair Stack (O(N) time, O(H) space)
    // ==========================================
    /*
    if (!root) return 0;
    let count = 0;
    const stack: [TreeNode, number][] = [[root, -Infinity]];
    while (stack.length > 0) {
        const [node, maxVal] = stack.pop()!;
        if (node.val >= maxVal) {
            count++;
        }
        const nextMax = Math.max(maxVal, node.val);
        if (node.right) stack.push([node.right, nextMax]);
        if (node.left) stack.push([node.left, nextMax]);
    }
    return count;
    */

    // ==========================================
    // 2nd Approach: Recursive DFS Path Max (Optimal)
    // ==========================================
    function dfs(node: TreeNode | null, maxVal: number): number {
        if (node === null) return 0;

        let good = 0;
        if (node.val >= maxVal) {
            good = 1;
        }

        const nextMax = Math.max(maxVal, node.val);
        return good + dfs(node.left, nextMax) + dfs(node.right, nextMax);
    }

    return dfs(root, -Infinity);
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Iterative DFS | Approach 2: Recursive DFS |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Visited every node once. | **$O(N)$** — Visited every node once. |
| **Space Complexity** | **$O(H)$** — Height of tree for stack storage. | **$O(H)$** — Height of tree for implicit stack storage. |

#### Edge Cases Handled:
* **All Nodes Equal** (`[3, 3, 3]`): Every node values is $\ge$ path maximum, returns `3` correctly.
* **Decreasing Sequence** (`5 -> 4 -> 3`): Only root `5` is good; subsequent nodes are less than path max, returns `1` correctly.
