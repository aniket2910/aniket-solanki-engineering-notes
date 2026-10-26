# 002. Min Cost Climbing Stairs (Easy)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 746](https://leetcode.com/problems/min-cost-climbing-stairs/)

**Interview Tag**: [Climbing Stairs](./001-easy-climbing-stairs.md) with costs: **count ways** becomes **minimise cost**, and `+` becomes `min`.

---

### 📝 1. Problem Statement
`cost[i]` is the price of stepping **on** stair `i`. After paying, you can climb 1 or 2 stairs. You may start on stair `0` or stair `1`. Return the minimum cost to reach the **top**, which is the position just past the last stair.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `cost = [10,15,20]`
* **Output**: `15`
* **Why**: Start on stair 1, pay 15, jump 2 to the top.

#### Test Case 2
* **Input**: `cost = [1,100,1,1,1,100,1,1,100,1]`
* **Output**: `6`
* **Why**: Step only on the 1s, skipping every 100.

#### Test Case 3
* **Input**: `cost = [0,0]`
* **Output**: `0`

---

### 💬 3. What is This Problem Actually Asking?
Let `best(i)` be the cheapest way to **stand at position `i`** (not yet paid for `i`). You got there from `i-1` (paying `cost[i-1]`) or `i-2` (paying `cost[i-2]`):

`best(i) = min(best(i-1) + cost[i-1], best(i-2) + cost[i-2])`, with `best(0) = best(1) = 0`. The answer is `best(n)`.

---

### 🌍 4. Real-Life Example
A **toll road** where each exit charges a fee when you pass through it, and you can skip the next exit by taking an express lane. You want to reach the city at the end paying the least, so at each exit you ask: is it cheaper to have come from the previous exit or the one before?

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: two rolling variables (the full `best[]` table is only needed to explain it).
* **Algorithm**: **1-D DP**, bottom-up, the same shape as Climbing Stairs with `min` instead of `+`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `cost = [10,15,20]`

| position `i` | from `i-1` | from `i-2` | `best(i)` |
| :---: | :---: | :---: | :---: |
| 0 | — | — | 0 |
| 1 | — | — | 0 |
| 2 | 0 + 15 = 15 | 0 + 10 = 10 | 10 |
| 3 (top) | 10 + 20 = 30 | 0 + 15 = 15 | 15 |

Returns `15`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function minCostClimbingStairs(cost: number[]): number {
    let twoBack = 0; // best(i - 2)
    let oneBack = 0; // best(i - 1)

    for (let i = 2; i <= cost.length; i++) {
        const current = Math.min(oneBack + cost[i - 1], twoBack + cost[i - 2]);
        twoBack = oneBack;
        oneBack = current;
    }
    return oneBack; // best(n): standing at the top
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n)$**.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **Two stairs**: one loop iteration, `min(cost[0], cost[1])`.
* **"Top" is past the last stair**: the loop runs to `i = n`, not `n - 1`, which is the common off-by-one.
