# 017. Find the Starting Point of Loop in Linked List (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **FLOYD'S DETECT & MEET** - Core linked list challenge. Tests mathematical pointer convergence to find loop starting nodes in constant space.

---

### 📝 1. Problem Statement
Given the `head` of a linked list, return *the node where the cycle begins. If there is no cycle, return `null`*.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer.

**Do not modify** the linked list.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `head = [3,2,0,-4]`, `pos = 1` (value `2` connects to `-4` which loops back to `2`)
* **Output**: `ListNode` with value `2`
* **Why**: The cycle begins at node `2`.

#### Test Case 2
* **Input**: `head = [1]`, `pos = -1` (no loop)
* **Output**: `null`
* **Why**: There is no cycle in the list.

---

### 💬 3. What is This Problem Actually Asking?
Find the entry point of the cycle without using extra memory space.

---

### 🌍 4. Real-Life Example
Imagine you are walking down a main highway that eventually forks off into a circular loop track. If you start walking from the head, you will enter the loop. You want to identify the exact intersection gate where the main highway joins the loop.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing set hashing vs. mathematical pointer meetings:

#### Approach 1: Hash Set Visited Node Mapping
We traverse the list, adding each node's reference to a set. The first node we encounter that is already in the set is the loop starting point.
* **Pros**: Simple logic.
* **Cons**: Requires $O(N)$ auxiliary space.

#### Approach 2: Floyd's Cycle Detection (Optimal)
> [!NOTE]
> For a detailed conceptual breakdown, mathematical proof, and visual explanation of this algorithm, refer to the [Floyd's Cycle Detection Blueprint](../ALGORITHMS/floyds-cycle-detection.md).

1.  **Detect Cycle**: Move `tortoise` by 1 step, and `hare` by 2 steps. If they meet, a cycle exists.
2.  **Find Entry Point**: Set `tortoise` back to the `head` of the list. Move **both** `tortoise` and `hare` exactly 1 step at a time. The node where they meet again is the start of the cycle!
* **Mathematical Rationale**: Let $L_1$ be distance from head to loop entry, $L_2$ be distance from entry to meeting point, and $C$ be loop length. When they meet, distance traveled by `hare` = $2 	imes$ distance by `tortoise`.
  $L_1 + L_2 + n \cdot C = 2 \cdot (L_1 + L_2) \implies L_1 = (n \cdot C) - L_2$.
  Thus, moving both pointers at speed 1 from head and meet point will converge exactly at loop entry!
* **Pros**: Optimal $O(N)$ runtime, $O(1)$ constant space.
* **Cons**: None.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `[3, 2, 0, -4]` where `-4` loops to `2`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `tortoise = 3`, `hare = 3`

#### **Step 1: Detect meeting point (Phase 1)**
* **Step 1**: `tortoise` moves to `2`, `hare` moves to `0`.
* **Step 2**: `tortoise` moves to `0`, `hare` moves to `2` (since `-4 -> 2`).
* **Step 3**: `tortoise` moves to `-4`, `hare` moves to `-4`.
* **Meet**: Meet at `-4`.

#### **Step 2: Find start (Phase 2)**
* **Action**: Reset `tortoise = 3` (head). Keep `hare = -4`.
* **Step 1**: Move both 1 step.
  * `tortoise` moves to `2`.
  * `hare` moves to `2`.
* **Meet**: Meet at node `2`.
* **Result**: Cycle entry start is node `2` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val===undefined ? 0 : val);
        this.next = (next===undefined ? null : next);
    }
}

function detectCycle(head: ListNode | null): ListNode | null {
    // ==========================================
    // 1st Approach: Hash Set Node Caching (O(N) Space)
    // ==========================================
    /*
    const visited = new Set<ListNode>();
    let curr = head;
    while (curr !== null) {
        if (visited.has(curr)) return curr;
        visited.add(curr);
        curr = curr.next;
    }
    return null;
    */

    // ==========================================
    // 2nd Approach: Floyd's Cycle Detection (Optimal)
    // ==========================================
    if (head === null || head.next === null) return null;

    let tortoise: ListNode | null = head;
    let hare: ListNode | null = head;

    // Phase 1: Detect cycle meeting point
    while (hare !== null && hare.next !== null) {
        tortoise = tortoise!.next;
        hare = hare.next.next;

        if (tortoise === hare) {
            // Cycle detected! Reset tortoise to find entry
            tortoise = head;
            while (tortoise !== hare) {
                tortoise = tortoise!.next;
                hare = hare!.next;
            }
            return tortoise; // Return start of cycle
        }
    }

    return null; // No cycle
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Hash Set | Approach 2: Floyd's Detection |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Traverses each node. | **$O(N)$** — Linear pointer steps. |
| **Space Complexity** | **$O(N)$** — Aux set storage allocation. | **$O(1)$** — Constant variables, fully in-place. |

#### Edge Cases Handled:
* **No cycle** (`pos = -1`): Hare reaches `null` safely, returns `null` (Correct).
