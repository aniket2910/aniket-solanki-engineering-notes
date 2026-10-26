# 017. Super Egg Drop (Hard)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 887](https://leetcode.com/problems/super-egg-drop/)

**Interview Tag**: 🔥 **MUST SOLVE** - A classic DP where **flipping the question** turns an $O(k n^2)$ table into an $O(k \log n)$-ish one.

---

### 📝 1. Problem Statement
You have `k` identical eggs and a building with `n` floors. There's a critical floor `f` (`0 ≤ f ≤ n`): eggs dropped from above `f` break, eggs dropped at or below `f` don't. A broken egg can't be reused. Return the **minimum number of drops** that guarantees you find `f`, in the worst case.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `k = 1`, `n = 2`
* **Output**: `2`
* **Why**: With one egg you must test floor 1, then floor 2, in order.

#### Test Case 2
* **Input**: `k = 2`, `n = 6`
* **Output**: `3`

#### Test Case 3
* **Input**: `k = 3`, `n = 14`
* **Output**: `4`

---

### 💬 3. What is This Problem Actually Asking?
Instead of "how many drops for `n` floors?", ask: **with `m` drops and `k` eggs, how many floors can I fully cover?** Call it `floors(m, k)`. Drop once:
* the egg **breaks** → you can still cover `floors(m-1, k-1)` floors below;
* it **survives** → you can cover `floors(m-1, k)` floors above;
* plus the floor you just tested.

`floors(m, k) = floors(m-1, k-1) + floors(m-1, k) + 1`. The answer is the smallest `m` with `floors(m, k) >= n`.

---

### 🌍 4. Real-Life Example
**Stress-testing phones** by dropping them from different heights with a limited number of test phones. With one phone you must climb floor by floor. With more phones you can take bigger risks early, because a broken phone only narrows the search to the floors below.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: `dp[k][n]` = min drops
For each floor `x`: `1 + max(dp[k-1][x-1], dp[k][n-x])`, minimised over `x`. $O(k n^2)$, too slow for `n = 10^4`. (Binary search over `x` brings it to $O(k n \log n)$.)

#### Approach 2: Floors covered by `m` drops (optimal)
1-D array `cover[e]` for `e = 1…k`, updated once per extra drop. Loop `e` **downwards** so `cover[e-1]` still holds the previous drop's value. Stop when `cover[k] >= n`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `k = 2`, `n = 6`

| drops `m` | `cover[1]` | `cover[2]` |
| :---: | :---: | :---: |
| 1 | 1 | 1 |
| 2 | 2 | 3 |
| 3 | 3 | **6** ≥ 6 |

Returns `3`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function superEggDrop(k: number, n: number): number {
    // cover[e] = most floors we can fully resolve with e eggs and the drops used so far
    const cover: number[] = new Array(k + 1).fill(0);
    let drops = 0;

    while (cover[k] < n) {
        drops++;
        // Downwards so cover[e - 1] is still the value from the previous drop count
        for (let e = k; e >= 1; e--) {
            cover[e] = cover[e - 1] + cover[e] + 1; // breaks below + survives above + this floor
        }
    }
    return drops;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(k \cdot m)$**, where `m` is the answer (at most `n`, and about $\log_2 n$ when eggs are plentiful).
* **Space Complexity**: **$O(k)$**.

#### Edge Cases Handled:
* **One egg**: `cover[1]` grows by 1 per drop, so the answer is `n` (linear search).
* **Plenty of eggs**: behaves like binary search, about $\lceil \log_2(n+1) \rceil$ drops.
* **`n = 0`**: the loop doesn't run, `0` drops.
