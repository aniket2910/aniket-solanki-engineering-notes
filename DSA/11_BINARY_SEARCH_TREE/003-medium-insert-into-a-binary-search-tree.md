# 003. Insert into a Binary Search Tree (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Google, LinkedIn
>
> **Interview Tag**: **BST INSERTION PATH** - Structural node modification and path traversal pattern.

---

### 📝 1. Problem Statement
You are given the `root` of a binary search tree (BST) and a `val` to insert into the tree. Return *the root of the BST after the insertion*. It is **guaranteed** that the new value does not exist in the original BST.

**Notice** that there may exist multiple valid ways for the insertion, as long as the tree remains a BST after insertion. You can return any of them.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [4,2,7,1,3]`, `val = 5`
* **Output**: `[4,2,7,1,3,5]`
* **Why**: We insert 5 as the left child of 7 (since 5 > 4 and 5 < 7). This maintains BST properties.

#### Test Case 2
* **Input**: `root = []`, `val = 5`
* **Output**: `[5]`
* **Why**: The tree is empty, so 5 becomes the new root node.

---

### 💬 3. What is This Problem Actually Asking?
Locate the correct leaf position in the BST that satisfies the ordering invariant for `val`, and insert a new `TreeNode(val)` at that location.

---

### 🌍 4. Real-Life Example
Imagine a mail sorter putting a new letter into a slot. They stand at the main routing station. The letter ZIP code is larger than current station range, so they pass it to the right bin. This repeats until they find an empty slot (null link) at the end of the line where they place the letter.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Recursive Insertion
Traverse down the tree:
* If `root === null`, return `new TreeNode(val)`.
* If `val < root.val`, insert left: `root.left = insertIntoBST(root.left, val)`.
* Otherwise, insert right: `root.right = insertIntoBST(root.right, val)`.
* Return `root`.
* **Pros**: Incredibly short and highly intuitive.
* **Cons**: Imposes recursive call stack memory of size **$O(H)$**.

#### Approach 2: Iterative Insertion (Optimal)
Traverse using a pointer to locate the node whose child should receive the new value.
* If `root === null`, return `new TreeNode(val)`.
* Maintain `curr = root`.
* Loop:
  * If `val < curr.val`:
    * If `curr.left === null`, set `curr.left = new TreeNode(val)` and break.
    * Else `curr = curr.left`.
  * Else:
    * If `curr.right === null`, set `curr.right = new TreeNode(val)` and break.
    * Else `curr = curr.right`.
* Return `root`.
* **Pros**: Optimal **$O(1)$** auxiliary space (no stack allocation).
* **Cons**: Marginally more code to track child insertion conditions.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with `root = [4, 2, 7, 1, 3]` and `val = 5`.

#### **Step 0: Initial State**
* `curr = root (node 4)`.

#### **Step 1: Check node 4**
* `5 > 4`. Since `curr.right` (node 7) is not null, move right: `curr = node 7`.

#### **Step 2: Check node 7**
```text
Tree:       4
           / \
          2   7
         / \   \ (new leaf node 5 inserted here)
        1   3
Pointers:     ▲
            curr (node 7) -> 5 < 7 and curr.left is null -> insert 5 -> BREAK
```
* `5 < 7`. Since `curr.left` is null, insert: `curr.left = new TreeNode(5)`.
* Break.
* **Result**: returns root `4`.

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

function insertIntoBST(root: TreeNode | null, val: number): TreeNode | null {
    // ==========================================
    // 1st Approach: Recursive Insertion (O(H) space)
    // ==========================================
    /*
    if (root === null) {
        return new TreeNode(val);
    }
    if (val < root.val) {
        root.left = insertIntoBST(root.left, val);
    } else {
        root.right = insertIntoBST(root.right, val);
    }
    return root;
    */

    // ==========================================
    // 2nd Approach: Iterative Insertion (Optimal - O(1) space)
    // ==========================================
    const newNode = new TreeNode(val);
    if (root === null) return newNode;

    let curr = root;
    while (true) {
        if (val < curr.val) {
            if (curr.left === null) {
                curr.left = newNode;
                break;
            }
            curr = curr.left;
        } else {
            if (curr.right === null) {
                curr.right = newNode;
                break;
            }
            curr = curr.right;
        }
    }

    return root;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Recursive Insertion | Approach 2: Iterative Insertion |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(H)$** — Path from root to insertion leaf. | **$O(H)$** — Path from root to insertion leaf. |
| **Space Complexity** | **$O(H)$** — Height of tree for recursive stack. | **$O(1)$** — Constant memory space. |

#### Edge Cases Handled:
* **Empty Tree** (`root = null`): returns the new node immediately.
* **Insertion under single-child node**: Correctly traverses down the non-null branch, reaching the correct leaf boundary.
