# 016. Minimum Cost to Cut a Stick (Hard)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 1547](https://leetcode.com/problems/minimum-cost-to-cut-a-stick/)

**Interview Tag**: 🔥 **MUST SOLVE** - **Interval DP** (the matrix-chain-multiplication family). The trick is choosing which cut happens **first**.

---

### 📝 1. Problem Statement
A wooden stick runs from `0` to `n`. You must make cuts at the positions in `cuts`, in any order you choose. Each cut costs the **current length of the piece** being cut. Return the minimum total cost.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `n = 7`, `cuts = [1,3,4,5]`
* **Output**: `16`
* **Why**: Cut at 3 (cost 7), then 5 on `[3,7]` (cost 4), then 1 on `[0,3]` (cost 3), then 4 on `[3,5]` (cost 2): `7 + 4 + 3 + 2 = 16`.

#### Test Case 2
* **Input**: `n = 9`, `cuts = [5,6,1,4,2]`
* **Output**: `22`

#### Test Case 3
* **Input**: `n = 5`, `cuts = [2]`
* **Output**: `5`

---

### 💬 3. What is This Problem Actually Asking?
Add the two ends, sort: `points = [0, …cuts sorted…, n]`. Let `cost(i, j)` be the cheapest way to make every cut strictly between `points[i]` and `points[j]`. If the **first** cut in that piece is at `points[k]`, it costs the piece length `points[j] - points[i]`, and then the two halves are independent:

`cost(i, j) = (points[j] - points[i]) + min over k of (cost(i, k) + cost(k, j))`

---

### 🌍 4. Real-Life Example
A **sawmill** charges by the length of the plank put on the saw. If you need cuts at 1, 3, 4 and 5 on a 7-metre plank, starting with the middle cut makes later cuts happen on short pieces, which is cheaper than slicing off 1 metre at a time from the full plank.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: 2-D table `dp[i][j]` over pairs of points (`m = cuts.length + 2` points).
* **Algorithm**: **Interval DP**, filled by increasing gap `j - i`:
  * gap 1 (no cut inside) → `0`;
  * larger gaps use the formula above, trying every `k` between `i` and `j`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `n = 5`, `cuts = [2]` → `points = [0, 2, 5]`

| interval | inside cuts | best |
| :---: | :---: | :---: |
| [0,2] | none | 0 |
| [2,5] | none | 0 |
| [0,5] | k = 2 | (5 − 0) + 0 + 0 = 5 |

Returns `5`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function minCost(n: number, cuts: number[]): number {
    const points = [0, ...[...cuts].sort((a, b) => a - b), n];
    const m = points.length;
    // dp[i][j] = min cost to make every cut strictly between points[i] and points[j]
    const dp: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));

    for (let gap = 2; gap < m; gap++) {
        for (let i = 0; i + gap < m; i++) {
            const j = i + gap;
            let best = Infinity;
            for (let k = i + 1; k < j; k++) {
                best = Math.min(best, dp[i][k] + dp[k][j]); // points[k] is cut first
            }
            dp[i][j] = best + (points[j] - points[i]);     // first cut costs this piece's length
        }
    }
    return dp[0][m - 1];
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(c^3)$** for `c` cuts (independent of `n`, which can be up to $10^6$).
* **Space Complexity**: **$O(c^2)$**.

#### Edge Cases Handled:
* **One cut**: always costs `n`.
* **Unsorted `cuts`**: sorted first; the formula depends on neighbours being adjacent.
* **Huge `n`**: never used as an array size, only in arithmetic.
