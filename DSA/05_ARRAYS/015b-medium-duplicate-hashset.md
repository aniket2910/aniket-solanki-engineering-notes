# 015b. Find the Duplicate Number (Visited Hash Set) (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **HASH SET CHECKING** - Core set lookup. Tests direct element caching, showing the fundamental trade-off between memory and speed.

---

### 📝 1. Problem Statement
Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive.

There is only **one repeated number** in `nums`, return *this repeated number*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1,3,4,2,2]`
* **Output**: `2`
* **Why**: The integer `2` appears twice in the array.

---

### 💬 3. What is This Problem Actually Asking?
Record seen numbers in a table and return the first number that has already been registered in that table.

---

### 🌍 4. Real-Life Example
Imagine a guest sign-in desk at a secure building. As guests arrive, you write their name on a sign-in sheet. If a guest tries to sign in and their name is already on the sheet, you sound an alarm because a duplicate name indicates a security breach.

---

### 🛠️ 5. Data Structure & Algorithms Used

We contrast hash set caching against the constant space cycle detector:

#### Approach 1: Floyd's Cycle Detection
We project the indices to pointers and detect cycle entry loops.
* **Pros**: Incredibly space-efficient ($O(1)$ constant space).
* **Cons**: Complex index jumper logic.

#### Approach 2: Visited Hash Set (Optimal for standard lookup)
We maintain a Hash Set of seen numbers. As we traverse `nums`, we query the set:
* If `set.has(num)` is true, return `num` as the duplicate.
* Otherwise, `set.add(num)`.
* **Pros**: Extremely simple logic, single-pass lookup in average $O(1)$ time per element.
* **Cons**: Requires $O(N)$ auxiliary memory space.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `nums = [1, 3, 2, 2]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `visited = Set {}`

#### **Step 1: i = 0 (val = 1)**
* **State check**: `visited.has(1)`? No.
* **Updates**: Add `1` to `visited`. `visited = Set {1}`.
* **Next**: `i` advances to index 1.

#### **Step 2: i = 1 (val = 3)**
* **State check**: `visited.has(3)`? No.
* **Updates**: Add `3` to `visited`. `visited = Set {1, 3}`.
* **Next**: `i` advances to index 2.

#### **Step 3: i = 2 (val = 2)**
* **State check**: `visited.has(2)`? No.
* **Updates**: Add `2` to `visited`. `visited = Set {1, 3, 2}`.
* **Next**: `i` advances to index 3.

#### **Step 4: i = 3 (val = 2) - Collision!**
* **State check**: `visited.has(2)`? Yes!
* **Result**: Duplicate found. Returns `2`.

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function findDuplicate(nums: number[]): number {
    // ==========================================
    // 1st Approach: Floyd's Cycle Detection (O(1) Space)
    // ==========================================
    /*
    let tortoise = nums[0];
    let hare = nums[0];
    do {
        tortoise = nums[tortoise];
        hare = nums[nums[hare]];
    } while (tortoise !== hare);
    tortoise = nums[0];
    while (tortoise !== hare) {
        tortoise = nums[tortoise];
        hare = nums[hare];
    }
    return tortoise;
    */

    // ==========================================
    // 2nd Approach: Visited Hash Set (Optimal in logic)
    // ==========================================
    const visited = new Set<number>();

    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        if (visited.has(num)) {
            // Already seen! Return duplicate
            return num;
        }
        visited.add(num);
    }

    return -1;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Floyd's Cycle | Approach 2: Visited Hash Set |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Linear traversal steps. | **$O(N)$** — Single pass over array. |
| **Space Complexity** | **$O(1)$** — Constant variables. | **$O(N)$** — Aux set containing elements. |

#### Edge Cases Handled:
* **Duplicate at Index 1** (`[2, 2, 3]`): Instantly catches duplicate on index 1, returning `2` (Correct).
