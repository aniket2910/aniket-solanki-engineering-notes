# 011. Partition Equal Subset Sum (Medium)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 416](https://leetcode.com/problems/partition-equal-subset-sum/)

**Interview Tag**: 🔥 **MUST SOLVE** - The **0/1 knapsack** template, with the backwards loop that makes each item usable once.

---

### 📝 1. Problem Statement
Given an array of positive integers `nums`, return `true` if it can be split into **two subsets with equal sums**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1,5,11,5]`
* **Output**: `true`
* **Why**: `[1,5,5]` and `[11]` both sum to 11.

#### Test Case 2
* **Input**: `nums = [1,2,3,5]`
* **Output**: `false`
* **Why**: The total 11 is odd.

#### Test Case 3
* **Input**: `nums = [1,1]`
* **Output**: `true`

#### Test Case 4
* **Input**: `nums = [2,2,3,5]`
* **Output**: `false`
* **Why**: The total is 12, but no subset sums to 6.

---

### 💬 3. What is This Problem Actually Asking?
If the total is odd, it's impossible. Otherwise the question is just: **is there a subset that sums to `total / 2`?** The other subset is everything else.

---

### 🌍 4. Real-Life Example
**Splitting a pile of parcels** between two delivery bikes so both carry exactly the same weight. You only need to find parcels that add up to half the total; the rest automatically make up the other half.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: boolean array `can[s]` = "some subset of the items seen so far sums to `s`", for `s = 0 … target`.
* **Algorithm**: **0/1 knapsack (subset sum)**:
  * `can[0] = true`.
  * For each number `x`, for `s` from `target` **down to** `x`: `can[s] ||= can[s - x]`.
* **Why backwards**: going down means `can[s - x]` still describes subsets **without** `x`, so `x` is used at most once. Going up would let `x` be reused (that's the unbounded version, [Coin Change II](./012-medium-coin-change-ii.md)).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [1,5,11,5]`, `target = 11`. Reachable sums after each number:

| after | reachable sums |
| :---: | :--- |
| start | {0} |
| 1 | {0, 1} |
| 5 | {0, 1, 5, 6} |
| 11 | {0, 1, 5, 6, 11} ✔ |

`can[11]` is `true`, return `true`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function canPartition(nums: number[]): boolean {
    const total = nums.reduce((a, b) => a + b, 0);
    if (total % 2 === 1) return false;
    const target = total / 2;

    const can: boolean[] = new Array(target + 1).fill(false);
    can[0] = true; // the empty subset

    for (const x of nums) {
        // Backwards so each number is used at most once
        for (let s = target; s >= x; s--) {
            if (can[s - x]) can[s] = true;
        }
        if (can[target]) return true; // early exit
    }
    return can[target];
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n \cdot \text{target})$**.
* **Space Complexity**: **$O(\text{target})$**.

#### Edge Cases Handled:
* **Odd total**: rejected immediately.
* **One number bigger than half**: it can never be in the half-sum subset, the inner loop skips it.
* **Two equal numbers**: `[1,1]` → target 1 → `true`.
