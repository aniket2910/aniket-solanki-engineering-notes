# 012. Combination Sum III (Medium)

**Sheet**: Namaste DSA · 11. Backtracking · [LeetCode 216](https://leetcode.com/problems/combination-sum-iii/)

**Interview Tag**: [Combinations](./010-medium-combinations.md) plus a target sum. Two stopping conditions: size and sum.

---

### 📝 1. Problem Statement
Find every combination of `k` numbers that add up to `n`, using only digits `1` to `9`, each **at most once**. Return the combinations in any order, without duplicates.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `k = 3`, `n = 7`
* **Output**: `[[1,2,4]]`
* **Why**: `1 + 2 + 4 = 7` is the only way with three distinct digits.

#### Test Case 2
* **Input**: `k = 3`, `n = 9`
* **Output**: `[[1,2,6],[1,3,5],[2,3,4]]`

#### Test Case 3
* **Input**: `k = 4`, `n = 1`
* **Output**: `[]`
* **Why**: The smallest sum of four distinct digits is `1+2+3+4 = 10 > 1`.

---

### 💬 3. What is This Problem Actually Asking?
Choose digits in increasing order (so no combination repeats). Stop a branch as soon as the sum goes over `n` or the path has `k` digits. Record it only when both `length === k` **and** `sum === n`.

---

### 🌍 4. Real-Life Example
Paying exactly **₹7 with 3 different coins** from a purse that holds one coin of each value 1–9. You try coins from smallest up and give up on a handful as soon as it's already worth more than 7.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Algorithm**: **Backtracking with pruning**.
  * `backtrack(start, remaining)`.
  * If `path.length === k`: record when `remaining === 0`, then return either way.
  * Loop `d = start … 9`; if `d > remaining`, **break** (digits only get bigger, so the rest are too big too).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `k = 3`, `n = 7`

```text
[] rem 7
├─ 1 → [1] rem 6
│   ├─ 2 → [1,2] rem 4
│   │   ├─ 3 → [1,2,3] rem 1 ✗ (size 3, rem ≠ 0)
│   │   ├─ 4 → [1,2,4] rem 0 ✔
│   │   └─ 5 > 4 → break
│   ├─ 3 → [1,3] rem 3 → 4 > 3 break
│   └─ 4 → [1,4] rem 2 → 5 > 2 break …
├─ 2 → [2] rem 5 → 3 → [2,3] rem 2 → 4 > 2 break …
└─ …
```

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function combinationSum3(k: number, n: number): number[][] {
    const result: number[][] = [];
    const path: number[] = [];

    function backtrack(start: number, remaining: number): void {
        if (path.length === k) {
            if (remaining === 0) result.push([...path]);
            return;
        }
        for (let d = start; d <= 9; d++) {
            if (d > remaining) break; // larger digits overshoot too
            path.push(d);
            backtrack(d + 1, remaining - d);
            path.pop();
        }
    }

    backtrack(1, n);
    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(\binom{9}{k} \cdot k)$** at most, a tiny constant bound (at most 126 combinations of 1–9).
* **Space Complexity**: **$O(k)$**.

#### Edge Cases Handled:
* **Impossible targets** (`k = 4, n = 1`): every branch is pruned, returns `[]`.
* **`n` above 45** (`1+…+9`): no combination, returns `[]`.
