# 017. Populating Next Right Pointers in Each Node (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Microsoft, Amazon, Google, Facebook/Meta
>
> **Interview Tag**: 🔥 **BFS LEVEL CHAIN LINK** - Essential tree pointer restructuring pattern.

---

### 📝 1. Problem Statement
You are given a **perfect binary tree** where all leaves are on the same level, and every parent has two children. The binary tree has the following definition:

```typescript
class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    next: TreeNode | null;
}
```

Populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to `null`.

Initially, all next pointers are set to `null`.

Follow up:
* You may only use constant extra space.
* The implicit stack space page is fine (recursive counts as $O(1)$ space).

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `root = [1,2,3,4,5,6,7]`
* **Output**: `[1,#,2,3,#,4,5,6,7,#]` (where `#` represents the next pointer pointing to null)
* **Why**: The level connections are established:
  * Level 0: `1 -> null`
  * Level 1: `2 -> 3 -> null`
  * Level 2: `4 -> 5 -> 6 -> 7 -> null`

#### Test Case 2
* **Input**: `root = []`
* **Output**: `[]`
* **Why**: The tree is empty.

---

### 💬 3. What is This Problem Actually Asking?
Connect each node in a level to the node directly to its right on the same level.

---

### 🌍 4. Real-Life Example
Imagine a row of houses in a neighborhood. At each level of the street (tiers), neighbors want to set up an emergency communication line (the `next` pointer) pointing directly to their neighbor on the right. This allows messages to pass down the street quickly without having to go back up to the city manager (parent node).

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Breadth-First Search (BFS) with Queue
Perform a standard BFS level-by-level traversal.
* For each level, loop through the nodes:
  * Connect the current node to the next node in the queue: `curr.next = (i < levelSize - 1) ? queue[0] : null`.
  * Enqueue children.
* **Pros**: Straightforward, works on any binary tree shape.
* **Cons**: Uses **$O(W) = O(N)$** auxiliary space to store queue elements, failing the constant space follow-up.

#### Approach 2: Iterative Pointer Chaining (Optimal)
Since it is a **perfect binary tree**, we can leverage the parent level's `next` pointers to establish child level connections without a queue.
* Start with `leftmost = root`.
* While `leftmost.left` is not null (we have a next level to connect):
  * Maintain a pointer `curr` scanning the current level (starting at `leftmost`).
  * Connect left child to right child: `curr.left.next = curr.right`.
  * If `curr.next` exists, connect right child to neighbor's left child: `curr.right.next = curr.next.left`.
  * Shift `curr = curr.next` along the level.
  * Move down to the next level: `leftmost = leftmost.left`.
* **Pros**: Optimal **$O(1)$** auxiliary space, **$O(N)$** time complexity.
* **Cons**: Relies on the tree being perfect (though a variation can work for general trees using sentinel dummy nodes).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with `root = [1, 2, 3, 4, 5, 6, 7]`.

#### **Step 0: Initial State**
* `leftmost = root (node 1)`.

#### **Step 1: Level 0 Connections (curr = node 1)**
```text
curr:       1 -> null
           / \
          2   3
Connection: curr.left.next (2.next) = curr.right (3)
```
* Connect left to right: `2.next = 3`.
* `curr.next` is null.
* Shift down level: `leftmost = 2`.

#### **Step 2: Level 1 Connections (curr = node 2)**
```text
curr:       2 -> 3
           / \  / \
          4  5  6  7
Connections: 4.next = 5
             curr.right.next (5.next) = curr.next.left (3.left -> 6)
```
* Connect left to right: `4.next = 5`.
* Connect cross-children: `5.next = 6`.
* Shift `curr = curr.next (3)`.
* Connect `6.next = 7`.
* `curr.next` is null.
* Shift down level: `leftmost = 4`.
* **Result**: All levels linked!

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    next: TreeNode | null;
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null, next?: TreeNode | null) {
        this.val = (val===undefined ? 0 : val);
        this.left = (left===undefined ? null : left);
        this.right = (right===undefined ? null : right);
        this.next = (next===undefined ? null : next);
    }
}

function connect(root: TreeNode | null): TreeNode | null {
    // ==========================================
    // 1st Approach: BFS with Queue (O(N) time, O(N) space)
    // ==========================================
    /*
    if (!root) return null;
    const queue: TreeNode[] = [root];
    while (queue.length > 0) {
        const size = queue.length;
        for (let i = 0; i < size; i++) {
            const curr = queue.shift()!;
            
            // Connect to right neighbor if not the last node in level
            if (i < size - 1) {
                curr.next = queue[0];
            } else {
                curr.next = null;
            }

            if (curr.left) queue.push(curr.left);
            if (curr.right) queue.push(curr.right);
        }
    }
    return root;
    */

    // ==========================================
    // 2nd Approach: Iterative Level Pointer Chaining (Optimal)
    // ==========================================
    if (root === null) return null;

    let leftmost = root;

    // Loop until we reach the leaf level
    while (leftmost.left !== null) {
        let curr: TreeNode | null = leftmost;

        while (curr !== null) {
            // Connection 1: Left child to Right child
            curr.left!.next = curr.right;

            // Connection 2: Right child to next neighbor's Left child
            if (curr.next !== null) {
                curr.right!.next = curr.next.left;
            }

            // Move to next node in current level
            curr = curr.next;
        }

        // Move to the leftmost node of the next level
        leftmost = leftmost.left;
    }

    return root;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: BFS Queue | Approach 2: Pointer Chaining |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Processed all $N$ nodes. | **$O(N)$** — Visited all node links. |
| **Space Complexity** | **$O(N)$** — Queue storage for levels. | **$O(1)$** — Constant memory space. |

#### Edge Cases Handled:
* **Empty Tree** (`root = null`): returns `null`.
* **Single Node**: Loop `leftmost.left !== null` is skipped, returns immediately (node.next is already null).
