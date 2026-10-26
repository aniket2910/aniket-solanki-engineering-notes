# 013. Unique Paths (Medium)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 62](https://leetcode.com/problems/unique-paths/)

**Interview Tag**: 🔥 **MUST SOLVE** - The entry point to **2-D grid DP**, and a nice chance to mention the combinatorics shortcut.

---

### 📝 1. Problem Statement
A robot starts at the top-left of an `m × n` grid and can only move **right** or **down**. How many different paths reach the bottom-right corner?

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `m = 3`, `n = 7`
* **Output**: `28`

#### Test Case 2
* **Input**: `m = 3`, `n = 2`
* **Output**: `3`
* **Why**: Right-Down-Down, Down-Right-Down, Down-Down-Right.

#### Test Case 3
* **Input**: `m = 1`, `n = 1`
* **Output**: `1`

---

### 💬 3. What is This Problem Actually Asking?
You reach a cell either **from above** or **from the left**, so `paths(r, c) = paths(r-1, c) + paths(r, c-1)`. Every cell in the top row and left column has exactly one path.

---

### 🌍 4. Real-Life Example
Walking through a **city grid of one-way streets** that only go east or south. The number of routes to any crossing is the number of routes to the crossing north of it plus the routes to the crossing west of it.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: 2-D table
`dp[r][c] = dp[r-1][c] + dp[r][c-1]`. $O(m \cdot n)$ space.

#### Approach 2: One row (optimal DP)
Keep only one row: `row[c] += row[c-1]`. Before the update `row[c]` is "from above", and `row[c-1]` is already the new "from the left". $O(n)$ space.

#### Approach 3: Combinatorics
Every path is `m-1` downs and `n-1` rights in some order: $\binom{m+n-2}{m-1}$. Mention it; the DP is what generalises (obstacles, costs).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `m = 3`, `n = 3`

| row | `row` after |
| :---: | :--- |
| 0 | [1, 1, 1] |
| 1 | [1, 2, 3] |
| 2 | [1, 3, 6] |

Returns `6`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function uniquePaths(m: number, n: number): number {
    // row[c] = number of paths to column c of the current row
    const row: number[] = new Array(n).fill(1); // the top row: only one way (keep going right)

    for (let r = 1; r < m; r++) {
        for (let c = 1; c < n; c++) {
            row[c] += row[c - 1]; // from above (old row[c]) + from the left (new row[c-1])
        }
    }
    return row[n - 1];
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(m \cdot n)$**.
* **Space Complexity**: **$O(n)$**.

#### Edge Cases Handled:
* **Single row or column**: only one path; the loops don't change the 1s.
* **1×1**: `1`.
