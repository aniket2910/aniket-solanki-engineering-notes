# 🔍 Topic 11: Binary Search Trees (BST)

Welcome to the **Binary Search Trees Revision Hub**. This page is your reference card for sorted node invariants, binary split lookup mechanisms, height-balanced search complexities, and our solved problem catalog.

---

## 📌 1. Introduction to BSTs

A **Binary Search Tree (BST)** is a specialized binary tree structure that maintains a strict value ordering invariant across all its nodes.

### The BST Invariant
For every node $X$ in the tree:
*   Every node in the **left subtree** of $X$ must have a value strictly **less than** $X$'s value:
    $$\text{val}(Y) < \text{val}(X) \quad \forall Y \in \text{LeftSubtree}(X)$$
*   Every node in the **right subtree** of $X$ must have a value strictly **greater than** $X$'s value:
    $$\text{val}(Z) > \text{val}(X) \quad \forall Z \in \text{RightSubtree}(X)$$
*   Both the left and right subtrees must also be binary search trees.

### Search & Update Complexities
Because of this ordering, searching a BST is similar to Binary Search on a sorted array: at each node, we compare the target value with the node's value and prune half the search space.

| Operation | Average Case (Balanced Tree) | Worst Case (Skewed Tree) |
| :--- | :---: | :---: |
| **Search** | **$O(\log N)$** | **$O(N)$** |
| **Insertion** | **$O(\log N)$** | **$O(N)$** |
| **Deletion** | **$O(\log N)$** | **$O(N)$** |

*   *Revision Tip*: To prevent the worst-case $O(N)$ behavior (skewed trees), self-balancing trees like AVL or Red-Black trees automatically restructure themselves during insertion/deletion to keep height at $O(\log N)$.

---

## 🔄 2. BST Traversals & Properties

Understanding traversals on BSTs unlocks many standard properties:

1.  **Inorder Traversal (Left -> Root -> Right)**:
    *   **CRITICAL PROPERTY**: An inorder traversal of a BST visits the nodes in **strictly increasing, sorted order**.
    *   *Usage*: Finding sorted node sequences, finding the $K^{\text{th}}$ smallest/largest element, validating if a binary tree is a BST.
2.  **Preorder Traversal (Root -> Left -> Right)**:
    *   *Usage*: Reconstructing/copying a BST.
3.  **Postorder Traversal (Left -> Right -> Root)**:
    *   *Usage*: Deleting a BST bottom-up, checking sub-range properties.

### Must Remember Invariants!
*   **Duplicate Values**: Standard BST definitions do not allow duplicate keys. If duplicates are required, they are typically stored by maintaining a frequency count inside each node, or by adopting a convention (e.g. storing duplicates strictly in the left/right subtree).
*   **Successor / Predecessor**:
    *   *Inorder Successor*: The node with the smallest value greater than $X$ (go right once, then all the way left).
    *   *Inorder Predecessor*: The node with the largest value less than $X$ (go left once, then all the way right).

---

## 📂 3. Problem Catalog

Use this table to track your revision progress. All problems contain **both recursive and iterative** implementations.

| Index | Problem Name | Difficulty | Core Pattern / Concept |
| :---: | :--- | :---: | :--- |
| `001` | [Valid Binary Search Tree](./001-medium-validate-binary-search-tree.md) 🔥 | 🟡 Medium | Range-boundary checks / Inorder sorting |
| `002` | [Search in a BST](./002-easy-search-in-a-binary-search-tree.md) | 🟢 Easy | Recursive division vs Pointer redirection |
| `003` | [Insert into a BST](./003-medium-insert-into-a-binary-search-tree.md) | 🟡 Medium | Invariant-based leaf node insertion |
| `004` | [Kth Smallest Element](./004-medium-kth-smallest-element-in-a-bst.md) 🔥 | 🟡 Medium | Inorder count tracking / Stack-based traversal |
| `005` | [Lowest Common Ancestor of a BST](./005-medium-lowest-common-ancestor-of-a-binary-search-tree.md) 🔥 | 🟡 Medium | Node value split check / Range partitioning |

---

> [!TIP]
> **Revision Secret**: If a BST problem requires operations based on node order (like finding duplicates, checking validity, or retrieving elements in order), **always think Inorder DFS**. If it requires searching, insertion, or LCA lookup, **use the value-range invariant** to prune your search path to only one branch!
