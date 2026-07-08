# 001. Validate Binary Search Tree (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Bloomberg, Microsoft, Google, Facebook/Meta
>
> **Interview Tag**: 🔥 **DFS RANGE BOUNDARY** - Core pattern for checking range invariants down a tree.

---

### 📝 1. Problem Statement
Given the `root` of a binary tree, *determine if it is a valid binary search tree (BST)*.

A **valid BST** is defined as follows:
* The left subtree of a node contains only nodes with keys **less than** the node's key.
* The right subtree of a node contains only nodes with keys **greater than** the node's key.
* Both the left and right subtrees must also be binary search trees.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [2,1,3]`
* **Output**: `true`
* **Why**: The root is 2. The left child is 1 (1 < 2), and the right child is 3 (3 > 2).

#### Test Case 2
* **Input**: `root = [5,1,4,null,null,3,6]`
* **Output**: `false`
* **Why**: The root value is 5. Its right child is 4, which is less than 5. Also, the left child of 4 is 3, which is in the right subtree of 5 but is less than 5 (violates overall right subtree boundary).

---

### 💬 3. What is This Problem Actually Asking?
Check that every node in the tree falls strictly within the valid mathematical bounds determined by its ancestors:
$$\text{low} < \text{node.val} < \text{high}$$

---

### 🌍 4. Real-Life Example
Imagine a strict nested sorting cabinet at a library. If a cabinet drawer is labeled "D to H", every folder inside that drawer must fit between D and H. If there's a sub-drawer inside labeled "F to H", then folders in that sub-drawer must be strictly between F and H. Any folder found outside its designated alphabetical boundary makes the cabinet invalid.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Iterative Inorder Traversal with Stack
Perform an inorder traversal using a stack.
* In a valid BST, the inorder values must be strictly increasing.
* Maintain a variable `prevVal`.
* As we pop and visit each node, verify `node.val > prevVal`. Update `prevVal = node.val`.
* **Pros**: Standard inorder template; stops early on first violation.
* **Cons**: Stack size is **$O(H)$**.

#### Approach 2: Recursive DFS with Range Boundary (Optimal)
Traverse the tree, passing down a `min` and `max` bound.
* For the root, `min = null` and `max = null` (no bounds).
* When moving left, update the upper bound: `max = node.val`.
* When moving right, update the lower bound: `min = node.val`.
* At each node, verify:
  * `(min !== null && node.val <= min) || (max !== null && node.val >= max)` $\rightarrow$ return `false`.
* Recursively check `isValidBST(node.left, min, node.val) && isValidBST(node.right, node.val, max)`.
* **Pros**: Clear, robust, runs in **$O(N)$** time.
* **Cons**: Watch out for boundary comparisons with JS maximum integers (use `null` instead of `-Infinity/Infinity` to prevent edge overflow issues).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with `root = [5, 1, 4, null, null, 3, 6]`.

#### **Step 0: Initial State**
* Call `validate(5, null, null)`.

#### **Step 1: Check root node 5**
* Node value `5` is valid (no bounds).
* Recurse left: `validate(1, null, 5)`.
* Recurse right: `validate(4, 5, null)`.

#### **Step 2: Recurse left (node 1, bounds: min = null, max = 5)**
* Node value `1` is less than `5`. Valid.
* Left/right children are null. Returns `true`.

#### **Step 3: Recurse right (node 4, bounds: min = 5, max = null)**
```text
Tree:           5
               / \
              1   4 (bounds: min = 5, max = null)
Pointers:         ▲
          node 4 (val = 4) <= min (5) -> VIOLATION -> return FALSE
```
* Node value `4` violates lower bound (`4 <= 5`).
* Returns `false`.
* **Result**: Root returns `false`.

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

function isValidBST(root: TreeNode | null): boolean {
    // ==========================================
    // 1st Approach: Iterative Inorder Stack Validation (O(N) time, O(H) space)
    // ==========================================
    /*
    const stack: TreeNode[] = [];
    let curr = root;
    let prevVal: number | null = null;

    while (curr !== null || stack.length > 0) {
        while (curr !== null) {
            stack.push(curr);
            curr = curr.left;
        }

        curr = stack.pop()!;
        
        // Inorder value must be strictly greater than the previous visited value
        if (prevVal !== null && curr.val <= prevVal) {
            return false;
        }
        prevVal = curr.val;

        curr = curr.right;
    }
    return true;
    */

    // ==========================================
    // 2nd Approach: Recursive DFS Range Check (Optimal)
    // ==========================================
    function validate(node: TreeNode | null, min: number | null, max: number | null): boolean {
        if (node === null) return true;

        // Check value boundaries
        if ((min !== null && node.val <= min) || (max !== null && node.val >= max)) {
            return false;
        }

        // Left child must be less than current val. Right child must be greater than current val.
        return (
            validate(node.left, min, node.val) &&
            validate(node.right, node.val, max)
        );
    }

    return validate(root, null, null);
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Iterative Inorder | Approach 2: Recursive DFS |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Visited each node once. | **$O(N)$** — Checked each node boundaries once. |
| **Space Complexity** | **$O(H)$** — Height of tree for stack storage. | **$O(H)$** — Height of tree for implicit stack storage. |

#### Edge Cases Handled:
* **JS Number Overflow** (Node value is `Number.MIN_SAFE_INTEGER` or `Number.MAX_SAFE_INTEGER`): By using `null` instead of numeric values for initial bounds, we avoid bounds check failures for edge values.
* **Empty Tree** (`root = null`): returns `true`.
