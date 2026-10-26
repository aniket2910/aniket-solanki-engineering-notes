# 008. Maximum Product Subarray (Medium)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 152](https://leetcode.com/problems/maximum-product-subarray/)

**Interview Tag**: 🔥 **MUST SOLVE** - [Kadane's](../05_ARRAYS/010-medium-kadanes-algorithm.md) for products. The twist: track the **minimum** too, because a negative can flip it to the maximum.

---

### 📝 1. Problem Statement
Given an integer array `nums`, return the largest product of any **non-empty contiguous subarray**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [2,3,-2,4]`
* **Output**: `6`
* **Why**: `[2,3]`.

#### Test Case 2
* **Input**: `nums = [-2,0,-1]`
* **Output**: `0`

#### Test Case 3
* **Input**: `nums = [-2,3,-4]`
* **Output**: `24`
* **Why**: The two negatives cancel: `-2 × 3 × -4`.

#### Test Case 4
* **Input**: `nums = [-2]`
* **Output**: `-2`

---

### 💬 3. What is This Problem Actually Asking?
For every position, keep the **largest** and the **smallest** product of a subarray ending there. Multiplying by a negative swaps their roles: the most negative product times a negative becomes the biggest positive.

---

### 🌍 4. Real-Life Example
Tracking a **leveraged bet** that can double or reverse each day. Yesterday's worst loss could become today's best gain if the market flips sign, so a trader keeps an eye on both the best and the worst running result.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: three variables: `maxEnd`, `minEnd`, `best`.
* **Algorithm**: **DP with two states** per index:
  * `maxEnd = max(x, x * prevMax, x * prevMin)`
  * `minEnd = min(x, x * prevMax, x * prevMin)`
  * Including plain `x` lets a new subarray start here (that's how a `0` resets everything).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [-2,3,-4]`

| `x` | `maxEnd` | `minEnd` | `best` |
| :---: | :---: | :---: | :---: |
| -2 | -2 | -2 | -2 |
| 3 | max(3, -6, -6) = 3 | min(3, -6, -6) = -6 | 3 |
| -4 | max(-4, -12, 24) = 24 | min(-4, -12, 24) = -12 | 24 |

Returns `24`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function maxProduct(nums: number[]): number {
    let maxEnd = nums[0]; // largest product of a subarray ending here
    let minEnd = nums[0]; // smallest (most negative) product ending here
    let best = nums[0];

    for (let i = 1; i < nums.length; i++) {
        const x = nums[i];
        const a = x * maxEnd;
        const b = x * minEnd;
        // A negative x swaps which of a, b is larger; x alone starts a fresh subarray
        maxEnd = Math.max(x, a, b);
        minEnd = Math.min(x, a, b);
        best = Math.max(best, maxEnd);
    }
    return best;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n)$**.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **Zeros**: `x = 0` makes both states `0`, then the next element starts fresh.
* **Single negative**: `best` starts at `nums[0]`, so `[-2]` returns `-2`, not `0`.
* **Even number of negatives**: the `minEnd` track carries the negative product until it flips.
