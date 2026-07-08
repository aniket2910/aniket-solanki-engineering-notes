# 013. Subtree of Another Tree (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Google, Microsoft, Facebook/Meta
>
> **Interview Tag**: **DFS SUBTREE MATCH** - Dual recursion structural template.

---

### 📝 1. Problem Statement
Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of `root` with the same structure and node values of `subRoot` and `false` otherwise.

A subtree of a binary tree `tree` is a tree that consists of a node in `tree` and all of this node's descendants. The tree `tree` could also be considered as a subtree of itself.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [3,4,5,1,2]`, `subRoot = [4,1,2]`
* **Output**: `true`
* **Why**: The tree `subRoot` matches the subtree rooted at `4` in `root`.

#### Test Case 2
* **Input**: `root = [3,4,5,1,2,null,null,null,null,0]`, `subRoot = [4,1,2]`
* **Output**: `false`
* **Why**: The subtree rooted at `4` in `root` has a child `0` under `2`, whereas `subRoot` does not have child `0` under `2`. They do not match.

---

### 💬 3. What is This Problem Actually Asking?
Determine if there exists a node in `root` such that comparing the tree rooted at this node with `subRoot` yields an identical structural match.

---

### 🌍 4. Real-Life Example
Imagine looking at a massive corporate organizational chart (`root`) and checking if a specific team structure (`subRoot`) exists exactly as specified under any regional director. You scan the main org chart, and every time you find a director with the same title as the team manager, you compare their entire reporting line node-by-node.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Tree Serialization comparison
Serialize both trees into unique string representations (preorder strings including null indicators, e.g., `#,4,#,1,#,2,#`) and check if `subRoot`'s serialized string is a substring of `root`'s serialized string.
* **Pros**: Can run in **$O(N + M)$** time if using KMP substring search.
* **Cons**: String formatting and character boundary matching must be done carefully to avoid false positive substring matches (e.g. node value `12` matching node value `2`).

#### Approach 2: Double Recursive DFS (Optimal)
We use a primary recursion `isSubtree` and a secondary comparison `isSameTree`.
* In `isSubtree(root, subRoot)`:
  * If `root === null`, return `false` (cannot contain subRoot).
  * If `isSameTree(root, subRoot)` returns `true`, return `true`.
  * Otherwise, check recursively: `isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot)`.
* In `isSameTree(p, q)`:
  * If both are `null`, return `true`.
  * If one is `null` or values differ, return `false`.
  * Return `p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right)`.
* **Pros**: Incredibly robust, clean, easy to read, uses no extra heap storage.
* **Cons**: Worst case time complexity is **$O(N \cdot M)$** if the structure matches repeatedly but fails at the leaf level. (On average, it runs much faster).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with `root = [3, 4, 5, 1, 2]` and `subRoot = [4, 1, 2]`.

#### **Step 0: Initial State**
* Call `isSubtree(node 3, subRoot)`.

#### **Step 1: Check root node 3**
* `isSameTree(node 3, node 4)` fails because `3 !== 4`.
* Recurse on left: `isSubtree(node 4, subRoot)`.

#### **Step 2: Check node 4**
* Call `isSameTree(node 4, node 4)`:
  * `4 === 4`. Compare left: `isSameTree(node 1, node 1)`.
  * `1 === 1`. Compare left/right: `isSameTree(null, null) = true`.
  * Compare right: `isSameTree(node 2, node 2)`.
  * `2 === 2`. Compare left/right: `isSameTree(null, null) = true`.
  * Left and Right subtrees match. `isSameTree` returns `true`.
* `isSubtree` receives `true` from `isSameTree` and immediately short-circuits.

```text
Tree:        3
            / \
    Match! 4   5
          / \
         1   2
isSameTree(4, subRoot) -> TRUE -> Short-circuit returns TRUE
```
* **Result**: Returns `true`.

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

function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
    // ==========================================
    // 1st Approach: Tree Serialization check (O(N + M) time, O(N + M) space)
    // ==========================================
    /*
    function serialize(node: TreeNode | null): string {
        if (node === null) return ",#";
        return `,${node.val}` + serialize(node.left) + serialize(node.right);
    }
    const rootStr = serialize(root);
    const subStr = serialize(subRoot);
    return rootStr.includes(subStr);
    */

    // ==========================================
    // 2nd Approach: Double Recursive DFS (Optimal)
    // ==========================================
    if (root === null) return false; // subRoot cannot be subtree of null

    if (isSameTree(root, subRoot)) return true;

    // Check if subRoot matches any subtree in left or right branches
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
    if (p === null && q === null) return true;
    if (p === null || q === null) return false;

    return (
        p.val === q.val &&
        isSameTree(p.left, q.left) &&
        isSameTree(p.right, q.right);
    );
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Serialization | Approach 2: Double DFS |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N + M)$** — String generation and substring scan. | **$O(N \cdot M)$** — Worst case comparison at each node. |
| **Space Complexity** | **$O(N + M)$** — String allocations in memory heap. | **$O(H_{\text{root}})$** — Height of the tree for recursion stack. |

#### Edge Cases Handled:
* **`subRoot` is larger than `root`**: Recursion naturally hits base case `root === null` and yields `false`.
* **Value sub-matching** (e.g. node 4 has same value but different children): `isSameTree` correctly fails structural matches at leaves.
