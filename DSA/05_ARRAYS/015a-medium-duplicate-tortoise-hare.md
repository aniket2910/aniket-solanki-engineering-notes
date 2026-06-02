# 015a. Find the Duplicate Number (Floyd's Cycle Detection) (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **CYCLE DETECTION** - Premium interview classic. Demonstrates how to map array elements to a linked list node graph, finding the cycle entry point in constant space.

---

### 📝 1. Problem Statement
Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive.

There is only **one repeated number** in `nums`, return *this repeated number*.

You must solve the problem **without** modifying the array `nums` and uses only **constant $O(1)$ extra space**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1,3,4,2,2]`
* **Output**: `2`
* **Why**: The integer `2` appears twice in the array.

#### Test Case 2
* **Input**: `nums = [3,1,3,4,2]`
* **Output**: `3`
* **Why**: The integer `3` appears twice in the array.

---

### 💬 3. What is This Problem Actually Asking?
We need to find the duplicate number under strict constraints:
1.  **Do not modify** the input array (rules out sorting or index flagging).
2.  Use **only constant $O(1)$ space** (rules out hash sets or frequency tracking arrays).

---

### 🌍 4. Real-Life Example
Imagine a maze where each room has a signpost pointing to the next room number. Since there are $N+1$ rooms but only room numbers $1$ to $N$, two rooms must point to the same room. If you start walking from room 0 and follow the signposts, you will eventually enter a loop (cycle). The duplicate signpost is the entrance door to that loop!

---

### 🛠️ 5. Data Structure & Algorithms Used

We contrast graph cycles vs frequency tracking:

#### Approach 1: Visited Hash Set
We record visited values inside a Hash Set. If a value is already present, it is the duplicate.
* **Pros**: Simple logic.
* **Cons**: Requires $O(N)$ extra space, violating the strict constraint.

#### Approach 2: Floyd's Cycle Detection (Tortoise and Hare) (Optimal)
> [!NOTE]
> For a detailed conceptual breakdown, mathematical proof, and visual explanation of this algorithm, refer to the [Floyd's Cycle Detection Blueprint](../ALGORITHMS/floyds-cycle-detection.md).

Since values are in the range `[1, n]`, we can treat the array index-value pairs as a linked list graph where `curr -> nums[curr]`.
* We initialize `tortoise = nums[0]` and `hare = nums[0]`.
* **Phase 1: Detect cycle**: `tortoise` moves 1 step at a time (`nums[tortoise]`), `hare` moves 2 steps (`nums[nums[hare]]`) until they meet.
* **Phase 2: Find cycle entry point**: Reset `tortoise` to `nums[0]`. Move both `tortoise` and `hare` exactly 1 step at a time until they meet. The meeting node is the duplicate number!
* **Pros**: Fast, optimal $O(N)$ runtime, $O(1)$ space, does not modify input array.
* **Cons**: Highly non-obvious mathematical proof of cycle entries.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `nums = [1, 3, 4, 2, 2]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `tortoise = 1`, `hare = 1`

#### **Step 1: Phase 1 - Find Meeting Point**
* **Step 1**:
  * `tortoise` moves 1 step: `nums[1] = 3`.
  * `hare` moves 2 steps: `nums[nums[1]] = nums[3] = 2`.
* **Step 2**:
  * `tortoise` moves 1 step: `nums[3] = 2`.
  * `hare` moves 2 steps: `nums[nums[2]] = nums[4] = 2`.
* **Meet**: `tortoise === hare` at value `2`. Phase 1 complete.

#### **Step 2: Phase 2 - Find Cycle Entry**
* **Action**: Reset `tortoise` to `nums[0] = 1`. Keep `hare` at `2`.
* **Step 1**:
  * `tortoise` moves 1 step: `nums[1] = 3`.
  * `hare` moves 1 step: `nums[2] = 4`.
* **Step 2**:
  * `tortoise` moves 1 step: `nums[3] = 2`.
  * `hare` moves 1 step: `nums[4] = 2`.
* **Result**: Meet at `2`. The duplicate number is `2` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function findDuplicate(nums: number[]): number {
    // ==========================================
    // 1st Approach: Hash Set Tracking (O(N) Space)
    // ==========================================
    /*
    const visited = new Set<number>();
    for (let num of nums) {
        if (visited.has(num)) return num;
        visited.add(num);
    }
    return -1;
    */

    // ==========================================
    // 2nd Approach: Floyd's Cycle Detection (Optimal)
    // ==========================================
    let tortoise = nums[0];
    let hare = nums[0];

    // Phase 1: Detect cycle (meeting point)
    do {
        tortoise = nums[tortoise];
        hare = nums[nums[hare]];
    } while (tortoise !== hare);

    // Phase 2: Find the entry point of the cycle (the duplicate)
    tortoise = nums[0];
    while (tortoise !== hare) {
        tortoise = nums[tortoise];
        hare = nums[hare];
    }

    return tortoise;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Hash Set | Approach 2: Floyd's Cycle |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Single pass over array. | **$O(N)$** — Linear traversal steps. |
| **Space Complexity** | **$O(N)$** — Aux set memory allocations. | **$O(1)$** — Constant variables, zero helper arrays. |

#### Edge Cases Handled:
* **Duplicate at the end** (`[1, 3, 2, 4, 2]`): Floyd's traversal successfully tracks loops even when the duplicate is at boundary indices (Correct).
