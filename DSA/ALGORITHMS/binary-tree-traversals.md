# Binary Tree Traversals Algorithm Blueprint

This document provides a highly visual, plain-English breakdown of **Binary Tree Traversals**, including standard Depth-First Search (DFS) and Breadth-First Search (BFS) templates in both recursive and iterative styles.

---

## 📌 1. DFS Traversals (Preorder, Inorder, Postorder)

Depth-First Search (DFS) explores a branch as deeply as possible before backtracking. Depending on when you visit/process the root node relative to its children, there are three types:

1.  **Preorder (Root -> Left -> Right)**: Process root first, then left subtree, then right subtree.
    *   *Usage*: Copying/serializing trees, prefix mathematical expressions.
2.  **Inorder (Left -> Root -> Right)**: Process left subtree first, then root, then right subtree.
    *   *Usage*: Retrieving elements in sorted order from a Binary Search Tree (BST).
3.  **Postorder (Left -> Right -> Root)**: Process left subtree, then right subtree, then root last.
    *   *Usage*: Deleting trees, bottom-up calculations (height, diameter, subtree problems).

### DFS Mechanics (TypeScript Templates)

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
```

#### Preorder Traversal
*   **Recursive**:
    ```typescript
    function preorderRecursive(root: TreeNode | null, result: number[] = []): number[] {
        if (!root) return result;
        result.push(root.val);
        preorderRecursive(root.left, result);
        preorderRecursive(root.right, result);
        return result;
    }
    ```
*   **Iterative (Stack)**:
    ```typescript
    function preorderIterative(root: TreeNode | null): number[] {
        if (!root) return [];
        const result: number[] = [];
        const stack: TreeNode[] = [root];
        while (stack.length > 0) {
            const curr = stack.pop()!;
            result.push(curr.val);
            // Push right before left, so left is processed first (LIFO stack)
            if (curr.right) stack.push(curr.right);
            if (curr.left) stack.push(curr.left);
        }
        return result;
    }
    ```

#### Inorder Traversal
*   **Recursive**:
    ```typescript
    function inorderRecursive(root: TreeNode | null, result: number[] = []): number[] {
        if (!root) return result;
        inorderRecursive(root.left, result);
        result.push(root.val);
        inorderRecursive(root.right, result);
        return result;
    }
    ```
*   **Iterative (Stack)**:
    ```typescript
    function inorderIterative(root: TreeNode | null): number[] {
        const result: number[] = [];
        const stack: TreeNode[] = [];
        let curr = root;
        while (curr !== null || stack.length > 0) {
            while (curr !== null) {
                stack.push(curr);
                curr = curr.left; // Go all the way left
            }
            curr = stack.pop()!;
            result.push(curr.val);
            curr = curr.right; // Visit right subtree
        }
        return result;
    }
    ```

#### Postorder Traversal
*   **Recursive**:
    ```typescript
    function postorderRecursive(root: TreeNode | null, result: number[] = []): number[] {
        if (!root) return result;
        postorderRecursive(root.left, result);
        postorderRecursive(root.right, result);
        result.push(root.val);
        return result;
    }
    ```
*   **Iterative (Stack)**:
    ```typescript
    function postorderIterative(root: TreeNode | null): number[] {
        if (!root) return [];
        const result: number[] = [];
        const stack: TreeNode[] = [root];
        const visited = new Set<TreeNode>();
        while (stack.length > 0) {
            const curr = stack[stack.length - 1]; // Peek
            if (curr.left && !visited.has(curr.left)) {
                stack.push(curr.left);
            } else if (curr.right && !visited.has(curr.right)) {
                stack.push(curr.right);
            } else {
                result.push(stack.pop()!.val);
                visited.add(curr);
            }
        }
        return result;
    }
    ```

---

## 📌 2. BFS / Level Order Traversal

Breadth-First Search (BFS) processes the tree level-by-level, starting from the root and going downwards, scanning left-to-right at each level.

*   *Usage*: Shortest path in unweighted graphs/trees, level-by-level operations, printing tree levels.

### BFS Mechanics (TypeScript Template)

```typescript
function levelOrder(root: TreeNode | null): number[][] {
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

## 📂 Related Problem List
*   [001. Preorder Traversal](../10_BINARY_TREE/001-easy-preorder-traversal.md)
*   [002. Inorder Traversal](../10_BINARY_TREE/002-easy-inorder-traversal.md)
*   [003. Postorder Traversal](../10_BINARY_TREE/003-easy-postorder-traversal.md)
*   [004. Level Order Traversal](../10_BINARY_TREE/004-medium-level-order-traversal.md)
*   [012. Zigzag Level Order Traversal](../10_BINARY_TREE/012-medium-zigzag-level-order-traversal.md)
