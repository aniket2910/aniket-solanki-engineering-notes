# 003. Binary Tree Postorder Traversal (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft, Google
>
> **Interview Tag**: 🔥 **DFS POSTORDER TRAVERSAL** - Basic Depth-First Search pattern. Links directly to the [Binary Tree Traversals Blueprint](../ALGORITHMS/binary-tree-traversals.md).

---

### 📝 1. Problem Statement
Given the `root` of a binary tree, return *the postorder traversal of its nodes' values*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [1, null, 2, 3]`
* **Output**: `[3, 2, 1]`
* **Why**: We visit the left subtree of `1` (null), then the right subtree of `1` (which is `2`). Before visiting `2`, we visit its left child `3` and its right child (null). So, we visit `3`, then root `2`, then root `1`.

#### Test Case 2
* **Input**: `root = []`
* **Output**: `[]`
* **Why**: The tree is empty.

---

### 💬 3. What is This Problem Actually Asking?
Traverse all nodes of a binary tree in the order: **Left Subtree $\rightarrow$ Right Subtree $\rightarrow$ Root**.

---

### 🌍 4. Real-Life Example
Imagine compiling folders in a file directory system to calculate total storage size. You cannot calculate the parent folder's size (Root) until you have fully calculated the sizes of all its sub-folders (Left and Right subtrees).

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Recursive DFS
Using the system call stack, recursively traverse left, recursively traverse right, then process the root.
* **Pros**: Simple, highly readable recursion.
* **Cons**: Uses implicit recursive call stack memory of size **$O(H)$**.

#### Approach 2: Iterative DFS with Stack & Visited Set (Optimal)
Simulating postorder traversal iteratively is slightly more complex because you visit the root node twice before processing it (once when going left, once when going right).
* We use a stack `[root]` and a `visited` Set to track nodes whose subtrees have been fully processed.
* At each step, peek the top node of the stack:
  * If the node has a left child and it hasn't been visited, push it to stack.
  * Else if the node has a right child and it hasn't been visited, push it to stack.
  * Else (both subtrees processed or empty), pop the node, record its value, and add it to the `visited` set.
* **Pros**: Eliminates call stack overflow risk.
* **Cons**: Requires tracking visited nodes to prevent infinite loops.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with a tree where root `1` has left child `2` and right child `3`.

#### **Step 0: Initial State**
* **Variables**: `stack = [root (node 1)]`, `visited = Set{}`, `result = []`

#### **Step 1: Peek Node 1**
```text
Stack:    [ 1, 2 ]
Tree:       1
           / \
          2   3
Pointers: ▲
         peek (node 1) -> pushes unvisited left child 2
```
* **State check**: Peek `1`. Left child `2` is unvisited. Push `2` to stack.
* **Updates**: `stack = [1, 2]`.

#### **Step 2: Peek Node 2**
```text
Stack:    [ 1 ]
Pointers:   ▲
          curr (popped 2)
```
* **State check**: Peek `2`. It has no children.
* **Updates**: Pop `2`, push to result $\rightarrow$ `result = [2]`. Add `2` to `visited`.
* **Next**: `stack = [1]`.

#### **Step 3: Peek Node 1**
```text
Stack:    [ 1, 3 ]
Pointers:   ▲
          peek (node 1) -> pushes unvisited right child 3
```
* **State check**: Peek `1`. Left child `2` is in `visited`. Right child `3` is unvisited. Push `3` to stack.
* **Updates**: `stack = [1, 3]`.

#### **Step 4: Peek Node 3**
```text
Stack:    [ 1 ]
Pointers:   ▲
          curr (popped 3)
```
* **State check**: Peek `3`. It has no children.
* **Updates**: Pop `3`, push to result $\rightarrow$ `result = [2, 3]`. Add `3` to `visited`.
* **Next**: `stack = [1]`.

#### **Step 5: Peek Node 1**
```text
Stack:    []
Pointers: ▲
         curr (popped 1)
```
* **State check**: Peek `1`. Both children `2` and `3` are in `visited`.
* **Updates**: Pop `1`, push to result $\rightarrow$ `result = [2, 3, 1]`. Add `1` to `visited`.
* **Next**: Stack is empty, loop terminates.

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

function postorderTraversal(root: TreeNode | null): number[] {
    // ==========================================
    // 1st Approach: Recursive DFS (O(N) time, O(H) space)
    // ==========================================
    /*
    const result: number[] = [];
    function traverse(node: TreeNode | null) {
        if (!node) return;
        traverse(node.left);
        traverse(node.right);
        result.push(node.val);
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
    const visited = new Set<TreeNode>();

    while (stack.length > 0) {
        const curr = stack[stack.length - 1]; // Peek top element

        if (curr.left && !visited.has(curr.left)) {
            stack.push(curr.left);
        } else if (curr.right && !visited.has(curr.right)) {
            stack.push(curr.right);
        } else {
            // Both subtrees processed, pop and visit
            stack.pop();
            result.push(curr.val);
            visited.add(curr);
        }
    }

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Recursive DFS | Approach 2: Iterative Stack |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Visited each of the $N$ nodes exactly once. | **$O(N)$** — Visited each node and sub-branch checks exactly once. |
| **Space Complexity** | **$O(H)$** — Height of the tree (implicit recursive call stack). | **$O(N)$** — Height of the tree for stack + set of all nodes visited. |

#### Edge Cases Handled:
* **Empty Tree** (`root = null`): Handled by early check `!root`, returns `[]`.
* **Single Node Tree**: Stack has 1 element, left/right check fails, node is immediately popped and returned.
