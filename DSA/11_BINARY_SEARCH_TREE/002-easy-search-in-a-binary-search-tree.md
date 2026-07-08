# 002. Search in a Binary Search Tree (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Google, Microsoft
>
> **Interview Tag**: **BST PATH PRUNING** - Core binary search pattern on tree node hierarchies.

---

### 📝 1. Problem Statement
You are given the `root` of a binary search tree (BST) and an integer `val`.

Find the node in the BST that the node's value equals `val` and return the subtree rooted with that node. If such a node does not exist, return `null`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [4,2,7,1,3]`, `val = 2`
* **Output**: `[2,1,3]`
* **Why**: The node with value 2 is found, and we return the subtree rooted at 2.

#### Test Case 2
* **Input**: `root = [4,2,7,1,3]`, `val = 5`
* **Output**: `[]` (null)
* **Why**: No node has value 5.

---

### 💬 3. What is This Problem Actually Asking?
Locate the node containing `val` by pruning half the tree at each node based on the BST invariant.

---

### 🌍 4. Real-Life Example
Imagine looking for a specific house number on a street where odd numbers are on the left side and even numbers are on the right side. You stand at the main intersection. If the target house is odd, you completely ignore the right side of the street and head left, repeating this check at every fork.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Recursive Search
Compare `val` with `root.val`.
* If `root === null` or `root.val === val`, return `root`.
* If `val < root.val`, search left: `searchBST(root.left, val)`.
* Otherwise, search right: `searchBST(root.right, val)`.
* **Pros**: Simple, matches BST mathematical definition.
* **Cons**: Imposes call stack memory overhead of **$O(H)$**.

#### Approach 2: Iterative Search (Optimal)
We use a loop to traverse down.
* While `curr !== null` and `curr.val !== val`:
  * If `val < curr.val`, `curr = curr.left`.
  * Otherwise, `curr = curr.right`.
* Return `curr`.
* **Pros**: Highly optimal **$O(1)$** auxiliary space (no stack allocation).
* **Cons**: None.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with `root = [4, 2, 7, 1, 3]` and `val = 2`.

#### **Step 0: Initial State**
* `curr = root (node 4)`.

#### **Step 1: Check node 4**
```text
Tree:       4
           / \
          2   7
         / \
        1   3
Pointers: ▲
         curr (node 4) -> 2 < 4 -> move left
```
* `2 < 4`. Move left: `curr = curr.left (node 2)`.

#### **Step 2: Check node 2 - Match!**
```text
Tree:       4
           / \
          2   7
         / \
        1   3
Pointers: ▲
         curr (node 2) -> val matches -> return node 2
```
* `curr.val (2) === val (2)`.
* Loop terminates.
* **Result**: returns subtree rooted at node `2`.

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

function searchBST(root: TreeNode | null, val: number): TreeNode | null {
    // ==========================================
    // 1st Approach: Recursive Search (O(H) space)
    // ==========================================
    /*
    if (root === null || root.val === val) {
        return root;
    }
    return val < root.val ? searchBST(root.left, val) : searchBST(root.right, val);
    */

    // ==========================================
    // 2nd Approach: Iterative Search (Optimal - O(1) space)
    // ==========================================
    let curr = root;

    while (curr !== null && curr.val !== val) {
        if (val < curr.val) {
            curr = curr.left;
        } else {
            curr = curr.right;
        }
    }

    return curr;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Recursive Search | Approach 2: Iterative Search |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(H)$** — Path length from root to target node. | **$O(H)$** — Path length down the tree. |
| **Space Complexity** | **$O(H)$** — Height of tree for call stack. | **$O(1)$** — Constant memory space. |

#### Edge Cases Handled:
* **Empty Tree** (`root = null`): returns `null` immediately.
* **Target Not Found**: Traverses to a leaf node, shifts to `null` child, exits loop and returns `null`.
