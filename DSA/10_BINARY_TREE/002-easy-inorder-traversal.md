# 002. Binary Tree Inorder Traversal (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft, Google, Adobe
>
> **Interview Tag**: 🔥 **DFS INORDER TRAVERSAL** - Basic Depth-First Search pattern. Links directly to the [Binary Tree Traversals Blueprint](../ALGORITHMS/binary-tree-traversals.md).

---

### 📝 1. Problem Statement
Given the `root` of a binary tree, return *the inorder traversal of its nodes' values*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [1, null, 2, 3]`
* **Output**: `[1, 3, 2]`
* **Why**: Leftmost is Root `1` (which has no left child). Then visit `1`, then move to its right subtree `2`. Before visiting `2`, visit its left child `3`.

#### Test Case 2
* **Input**: `root = []`
* **Output**: `[]`
* **Why**: The tree is empty.

---

### 💬 3. What is This Problem Actually Asking?
Traverse all nodes of a binary tree in the order: **Left Subtree $\rightarrow$ Root $\rightarrow$ Right Subtree**.

---

### 🌍 4. Real-Life Example
Imagine a genealogical tree where you want to read names in order of chronological age. You go down to the absolute oldest line of descendants first (leftmost), then the parent (root), then the younger siblings/descendants (right).

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Recursive DFS
Using the system call stack, recursively traverse left, process root, then recursively traverse right.
* **Pros**: Simple, highly readable recursion.
* **Cons**: Imposes recursive call stack memory overhead of **$O(H)$**.

#### Approach 2: Iterative DFS with Stack (Optimal)
We simulate recursion using a stack and a pointer `curr`.
* We loop while `curr !== null` or `stack.length > 0`.
* We push all left child nodes to stack until we reach `null` (going all the way left).
* We pop the top node from stack, process its value.
* We set `curr = curr.right` to process its right subtree.
* **Pros**: Avoids stack overflow issues.
* **Cons**: Marginally more complex to track pointer states.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with a tree where root `1` has left child `2` and right child `3`.

#### **Step 0: Initial State**
* **Variables**: `curr = root (node 1)`, `stack = []`, `result = []`

#### **Step 1: Shift Left**
```text
Stack:    [ 1, 2 ]
Tree:       1
           / \
          2   3
Pointers: ▲
         curr (reaches null below 2)
```
* **State check**: Push `1`, then `2` to stack. `curr` becomes `null`.
* **Updates**: `stack = [1, 2]`.

#### **Step 2: Pop & Process Node 2**
```text
Stack:    [ 1 ]
Pointers:   ▲
          curr (popped 2)
```
* **State check**: Pop node `2`. Push to result $\rightarrow$ `result = [2]`.
* **Updates**: Set `curr = curr.right` (which is `null`).
* **Next**: `stack = [1]`, `curr = null`.

#### **Step 3: Pop & Process Node 1**
```text
Stack:    []
Pointers: ▲
         curr (popped 1)
```
* **State check**: Pop node `1`. Push to result $\rightarrow$ `result = [2, 1]`.
* **Updates**: Set `curr = curr.right` (node `3`).
* **Next**: `stack = []`, `curr = node 3`.

#### **Step 4: Push & Process Node 3**
```text
Stack:    []
Pointers:   ▲
          curr (popped 3)
```
* **State check**: Push node `3` to stack. Pop `3` immediately since it has no left child. Push to result $\rightarrow$ `result = [2, 1, 3]`.
* **Updates**: Set `curr = curr.right` (`null`).
* **Next**: Stack is empty and `curr === null`, loop terminates.

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

function inorderTraversal(root: TreeNode | null): number[] {
    // ==========================================
    // 1st Approach: Recursive DFS (O(N) time, O(H) space)
    // ==========================================
    /*
    const result: number[] = [];
    function traverse(node: TreeNode | null) {
        if (!node) return;
        traverse(node.left);
        result.push(node.val);
        traverse(node.right);
    }
    traverse(root);
    return result;
    */

    // ==========================================
    // 2nd Approach: Iterative Stack DFS (Optimal)
    // ==========================================
    const result: number[] = [];
    const stack: TreeNode[] = [];
    let curr = root;

    while (curr !== null || stack.length > 0) {
        // Go to the leftmost node of current subtree
        while (curr !== null) {
            stack.push(curr);
            curr = curr.left;
        }

        // Process the node
        curr = stack.pop()!;
        result.push(curr.val);

        // Move to the right subtree
        curr = curr.right;
    }

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Recursive DFS | Approach 2: Iterative Stack |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Visited each of the $N$ nodes exactly once. | **$O(N)$** — Each node is pushed and popped exactly once. |
| **Space Complexity** | **$O(H)$** — Height of the tree (implicit recursive call stack). | **$O(H)$** — Height of the tree (explicit stack size). |

#### Edge Cases Handled:
* **Empty Tree** (`root = null`): Loop condition `curr !== null || stack.length > 0` evaluates false immediately, returns `[]`.
* **Right Skewed Tree** (`1 -> 2 -> 3`): Pushes leftmost node (which is `1` itself), pops it, moves to `2`, etc., yielding correct traversal.
