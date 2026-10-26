# 003. Sqrt(x) (Easy)

**Sheet**: Namaste DSA · 6. Binary Search Algorithm · [LeetCode 69](https://leetcode.com/problems/sqrtx/)

**Interview Tag**: 🔥 **MUST SOLVE** - "Binary search on the answer": you search a range of numbers, not an array.

---

### 📝 1. Problem Statement
Given a non-negative integer `x`, return the square root of `x` **rounded down** to the nearest integer. You may not use `Math.sqrt`, `**` or `Math.pow`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `x = 4`
* **Output**: `2`

#### Test Case 2
* **Input**: `x = 8`
* **Output**: `2`
* **Why**: √8 ≈ 2.828, rounded down to `2`.

#### Test Case 3
* **Input**: `x = 0`
* **Output**: `0`

#### Test Case 4
* **Input**: `x = 1`
* **Output**: `1`

#### Test Case 5
* **Input**: `x = 2147395599`
* **Output**: `46339`
* **Why**: `46339² = 2147302921 ≤ x`, but `46340² = 2147395600 > x`.

---

### 💬 3. What is This Problem Actually Asking?
Find the **largest integer `m` with `m * m <= x`**. Candidates `0, 1, 2, …, x` are sorted, and the test "`m * m <= x`" is `true` for a prefix of them and `false` after. Binary search finds the last `true`.

---

### 🌍 4. Real-Life Example
Guessing the side of a **square floor** from its area. Area 8 m²: try 4 m (16, too big), try 2 m (4, fits), try 3 m (9, too big). The biggest side that fits is 2 m. Each guess halves the range of sides left to try.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Linear scan
Try `m = 1, 2, 3, …` until `m * m > x`. $O(\sqrt{x})$, about 46,000 steps for the biggest inputs.

#### Approach 2: Binary search on the answer (optimal)
Search `low = 0 … high = x`. For `mid`, if `mid * mid <= x`, `mid` is a valid answer: record it and look right for a bigger one. Otherwise look left. $O(\log x)$, about 31 steps.

**Overflow note**: in JS numbers are doubles, so `mid * mid` up to $2^{62}$ is exact enough here. In Java/C++ use `mid <= x / mid` or a `long`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `x = 8`

| `low` | `high` | `mid` | `mid²` | `≤ 8`? | `ans` |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 0 | 8 | 4 | 16 | no → `high = 3` | 0 |
| 0 | 3 | 1 | 1 | yes → `low = 2` | 1 |
| 2 | 3 | 2 | 4 | yes → `low = 3` | 2 |
| 3 | 3 | 3 | 9 | no → `high = 2` | 2 |

`low > high`, returns `2`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function mySqrt(x: number): number {
    let low = 0;
    let high = x;
    let ans = 0;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (mid * mid <= x) {
            ans = mid;       // mid fits: remember it, try something bigger
            low = mid + 1;
        } else {
            high = mid - 1;  // mid is too big
        }
    }
    return ans;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(\log x)$**.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **`x = 0` and `x = 1`**: the first `mid` already gives the answer.
* **Perfect squares**: `mid * mid === x` counts as "fits", so `4 → 2`.
* **Largest 32-bit input**: 31 iterations, and `mid * mid` stays exact in a double.
