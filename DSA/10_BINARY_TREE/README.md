# 🌳 Topic 10: Binary Trees

Welcome to the **Binary Trees Revision Hub**. This page is your comprehensive theoretical and practical guide to tree architectures, hierarchical nodes, traversal algorithms, and our curated problem catalog.

---

## 📌 1. Introduction to Trees

A **Tree** is a non-linear, hierarchical data structure consisting of nodes connected by directed edges. Unlike arrays, strings, or linked lists, trees are multi-branching and do not contain cycles.

### Key Terminology
*   **Node**: A structure containing a value and references to child nodes.
*   **Root**: The top node of a tree from which all other nodes descend. (Exactly one per tree).
*   **Edge**: The link/pointer connecting parent node to child node.
*   **Parent / Child**: If node $A$ links to node $B$, $A$ is the parent, and $B$ is the child.
*   **Leaf Node**: A node with no children (its left/right pointers are `null`).
*   **Subtree**: A tree structure formed by a child node and all of its descendants.
*   **Depth of a Node**: The number of edges from the root to that specific node. (Root is depth 0).
*   **Height of a Node**: The number of edges on the longest downward path from that node to a leaf.
*   **Height of a Tree**: The height of the root node (longest path from root to leaf).

---

## 💡 2. Types of Trees

Trees are classified based on branching rules and balancing properties:

1.  **Binary Tree**: Every node has at most 2 children (conventionally called `left` and `right`).
2.  **Binary Search Tree (BST)**: A binary tree where for *every* node:
    *   All values in the left subtree are **less than** the node's value.
    *   All values in the right subtree are **greater than** the node's value.
3.  **Balanced Binary Tree** (e.g. AVL, Red-Black): A binary tree where the height difference between the left and right subtrees of *any* node is at most 1. This guarantees $O(\log N)$ search, insertion, and deletion times.
4.  **Full Binary Tree**: Every node has either 0 or 2 children. (No node has exactly 1 child).
5.  **Complete Binary Tree**: All levels are completely filled except possibly the last level, which is filled from left to right.
6.  **Perfect Binary Tree**: All internal nodes have exactly 2 children, and all leaves are at the exact same level.

---

## 🔄 3. Tree Traversals (DFS vs BFS)

To search or process trees, we must visit every node. Since trees are non-linear, we traverse them using two main strategies: Depth-First Search (DFS) and Breadth-First Search (BFS).

### A. Depth-First Search (DFS)
DFS climbs down a branch as far as possible before climbing back up. There are three standard orderings based on when the root node is visited:

| Traversal | Order | Common Use Case |
| :--- | :--- | :--- |
| **Preorder** | Root $\rightarrow$ Left $\rightarrow$ Right | Copying/serializing trees, prefix math expressions. |
| **Inorder** | Left $\rightarrow$ Root $\rightarrow$ Right | Retrieving values from a BST in sorted order. |
| **Postorder** | Left $\rightarrow$ Right $\rightarrow$ Root | Tree deletion, bottom-up calculations (height, diameter, subtree check). |

### B. Breadth-First Search (BFS / Level Order)
BFS processes the tree level-by-level from top to bottom, scanning left to right.
*   *Use Case*: Shortest paths, printing trees, level summaries.

### Traversal Cheat Sheet (Must Remember!)
*   **DFS Space Complexity**: **$O(H)$** where $H$ is the height of the tree. In the worst-case (skewed tree), $H = N$. In the best-case (balanced tree), $H = \log N$.
*   **BFS Space Complexity**: **$O(W)$** where $W$ is the maximum width of the tree. In the worst-case (perfect tree), the leaf level has $N/2$ nodes, requiring $O(N)$ space.
*   **Recursion Invariant**: Every recursive call occupies space on the call stack. Always consider the **implicit call stack** when assessing space complexity.
*   **Iterative Conversion**: To convert recursive DFS to iterative, use an **explicit Stack** ($O(H)$ space). To convert BFS, use a **Queue** ($O(W)$ space).

---

## 📂 4. Problem Catalog

Use this table to track your revision progress. All problems contain **both recursive and iterative** implementations.

| Index | Problem Name | Difficulty | Core Pattern / Concept |
| :---: | :--- | :---: | :--- |
| `001` | [Preorder Traversal](./001-easy-preorder-traversal.md) 🔥 | 🟢 Easy | DFS: Root $\rightarrow$ Left $\rightarrow$ Right Stack |
| `002` | [Inorder Traversal](./002-easy-inorder-traversal.md) 🔥 | 🟢 Easy | DFS: Left $\rightarrow$ Root $\rightarrow$ Right Stack |
| `003` | [Postorder Traversal](./003-easy-postorder-traversal.md) 🔥 | 🟢 Easy | DFS: Left $\rightarrow$ Right $\rightarrow$ Root Stack |
| `004` | [Level Order Traversal](./004-medium-level-order-traversal.md) 🔥 | 🟡 Medium | BFS: Queue level eviction loop |
| `005` | [Maximum Depth of Binary Tree](./005-easy-maximum-depth-of-binary-tree.md) 🔥 | 🟢 Easy | Divide-and-conquer height calculation |
| `006` | [Path Sum](./006-easy-path-sum.md) 🔥 | 🟢 Easy | Top-down backtracking sum reduction |
| `007` | [Symmetric Tree](./007-easy-symmetric-tree.md) 🔥 | 🟢 Easy | Twin mirror-pointer comparison |
| `008` | [Invert a Binary Tree](./008-easy-invert-binary-tree.md) 🔥 | 🟢 Easy | Level/subtree pointer swaps |
| `009` | [Same Tree](./009-easy-same-tree.md) | 🟢 Easy | Structural matching recursion |
| `010` | [Balanced Binary Tree](./010-easy-balanced-binary-tree.md) 🔥 | 🟢 Easy | Bottom-up DFS height violation check |
| `011` | [Diameter of a Binary Tree](./011-easy-diameter-of-binary-tree.md) 🔥 | 🟢 Easy | Height search updating global max crossing path |
| `012` | [Zigzag Level Order Traversal](./012-medium-zigzag-level-order-traversal.md) | 🟡 Medium | BFS: Level queue with conditional reverse |
| `013` | [Subtree of another Tree](./013-easy-subtree-of-another-tree.md) | 🟢 Easy | Subtree matching recursion |
| `014` | [Lowest Common Ancestor](./014-medium-lowest-common-ancestor.md) 🔥 | 🟡 Medium | Bottom-up LCA branch lookup propagation |
| `015` | [Binary Tree Right Side View](./015-medium-binary-tree-right-side-view.md) 🔥 | 🟡 Medium | DFS Root-Right-Left max depth tracker |
| `016` | [Count Good Nodes in Binary Tree](./016-medium-count-good-nodes-in-binary-tree.md) | 🟡 Medium | DFS path max boundary propagation |
| `017` | [Populating Next Right Pointers in Each Node](./017-medium-populating-next-right-pointers.md) 🔥 | 🟡 Medium | BFS level link chains / Pointer iteration |
| `018` | [Binary Tree Maximum Path Sum](./018-hard-binary-tree-maximum-path-sum.md) 🔥 | 🔴 Hard | Dynamic postorder branch sum optimization |

---

> [!TIP]
> **Revision Secret**: If a tree problem asks for a calculation that depends on child results (e.g. checking balance, calculating diameter/height, or summarizing values), **always think bottom-up Postorder DFS**. If it requires passing down a state (like path sums or path maximums), **think top-down Preorder DFS**.
