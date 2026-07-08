# 001. Binary Tree Preorder Traversal (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft, Google, Facebook/Meta
>
> **Interview Tag**: 🔥 **DFS PREORDER TRAVERSAL** - Basic Depth-First Search pattern. Links directly to the [Binary Tree Traversals Blueprint](../ALGORITHMS/binary-tree-traversals.md).

---

### 📝 1. Problem Statement
Given the `root` of a binary tree, return *the preorder traversal of its nodes' values*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [1, null, 2, 3]` (represented as parent-child layout: Root `1` has no left, right is `2`, which has left `3`)
* **Output**: `[1, 2, 3]`
* **Why**: We visit Root `1`, then move to its right child `2`, then visit left child of `2` which is `3`.

#### Test Case 2
* **Input**: `root = []`
* **Output**: `[]`
* **Why**: The tree is empty.

---

### 💬 3. What is This Problem Actually Asking?
Traverse all nodes of a binary tree in the order: **Root $\rightarrow$ Left Child $\rightarrow$ Right Child**.

---

### 🌍 4. Real-Life Example
Imagine a command hierarchy in a military brigade. The Commander (Root) receives an order first. They pass the order down to their Left Lieutenant (Left Child) first to propagate through their entire division, and only after that division is fully briefed do they pass it to their Right Lieutenant (Right Child) to propagate.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Recursive DFS
Using the system call stack, process the node value, recursively call preorder on the left child, and recursively call preorder on the right child.
* **Pros**: Incredibly simple to write.
* **Cons**: Uses implicit recursive call stack memory of size **$O(H)$**.

#### Approach 2: Iterative DFS with Stack (Optimal)
We use an explicit LIFO Stack to simulate recursion.
* Push `root` to stack.
* While stack is not empty, pop the top node, record its value.
* Push its **right child** first, then its **left child** (so the left child is popped and processed first).
* **Pros**: Eliminates risk of call stack overflow.
* **Cons**: Requires explicit stack management.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with a tree where root `1` has left child `2` and right child `3`.

#### **Step 0: Initial State**
* **Variables**: `stack = [root] (node 1)`, `result = []`

#### **Step 1: Process Node 1**
```text
Stack:    [ 1 ]
Tree:       1
           / \
          2   3
Pointers: ▲
         curr (popped 1)
```
* **State check**: Pop node `1`. Push to result $\rightarrow$ `result = [1]`.
* **Updates**: Pop child nodes of `1`. Push `3` (right) then `2` (left) to stack.
* **Next**: `stack = [3, 2]`.

#### **Step 2: Process Node 2**
```text
Stack:    [ 3, 2 ]
Pointers:      ▲
             curr (popped 2)
```
* **State check**: Pop node `2`. Push to result $\rightarrow$ `result = [1, 2]`.
* **Updates**: Node `2` has no children. Stack remains `[3]`.
* **Next**: `stack = [3]`.

#### **Step 3: Process Node 3**
```text
Stack:    [ 3 ]
Pointers:   ▲
          curr (popped 3)
```
* **State check**: Pop node `3`. Push to result $\rightarrow$ `result = [1, 2, 3]`.
* **Updates**: Node `3` has no children. Stack is empty.
* **Next**: Loop terminates.

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

function preorderTraversal(root: TreeNode | null): number[] {
    // ==========================================
    // 1st Approach: Recursive DFS (O(N) time, O(H) space)
    // ==========================================
    /*
    const result: number[] = [];
    function traverse(node: TreeNode | null) {
        if (!node) return;
        result.push(node.val);
        traverse(node.left);
        traverse(node.right);
    }
    traverse(root);
    return result;
    */

    // ==========================================
    // 2nd Approach: Iterative Stack DFS (Optimal)
    // ==========================================
    if (!root) return [];
    
    const result: number[] = [];
    const stack: TreeNode[] = [root];

    while (stack.length > 0) {
        const curr = stack.pop()!;
        result.push(curr.val);

        // Push right child first so left is processed first
        if (curr.right) {
            stack.push(curr.right);
        }
        if (curr.left) {
            stack.push(curr.left);
        }
    }

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Recursive DFS | Approach 2: Iterative Stack |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Visited each of the $N$ nodes exactly once. | **$O(N)$** — Popped and pushed each node exactly once. |
| **Space Complexity** | **$O(H)$** — Height of the tree (implicit recursive call stack). | **$O(H)$** — Height of the tree (explicit stack size). |

#### Edge Cases Handled:
* **Empty Tree** (`root = null`): Loop bypassed immediately, returns empty array `[]`.
* **Skewed Left Tree** (`1 -> 2 -> 3`): Correctly processes sequentially. Stack size matches maximum height ($N$).
