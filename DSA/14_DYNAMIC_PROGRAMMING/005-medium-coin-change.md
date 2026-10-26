# 005. Coin Change (Medium)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 322](https://leetcode.com/problems/coin-change/)

**Interview Tag**: 🔥 **MUST SOLVE** - The unbounded-knapsack template for **minimum count**. Know why greedy fails here.

---

### 📝 1. Problem Statement
Given coin values `coins` (unlimited supply of each) and an `amount`, return the **fewest coins** that add up to `amount`, or `-1` if it can't be made.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `coins = [1,2,5]`, `amount = 11`
* **Output**: `3`
* **Why**: `5 + 5 + 1`.

#### Test Case 2
* **Input**: `coins = [2]`, `amount = 3`
* **Output**: `-1`

#### Test Case 3
* **Input**: `coins = [1]`, `amount = 0`
* **Output**: `0`

#### Test Case 4
* **Input**: `coins = [1,3,4]`, `amount = 6`
* **Output**: `2`
* **Why**: `3 + 3`. Greedy would take `4 + 1 + 1` (3 coins).

---

### 💬 3. What is This Problem Actually Asking?
To make amount `a`, the **last coin** you add is some `c`. Then the rest is the best way to make `a - c`. So:

`dp[a] = 1 + min(dp[a - c])` over every coin `c ≤ a`, with `dp[0] = 0`.

---

### 🌍 4. Real-Life Example
A **cashier with odd coin values** trying to give change with as few coins as possible. With ₹1, ₹3 and ₹4 coins, "always use the biggest coin" gives 4+1+1 for ₹6, but 3+3 is better. The cashier needs to know the best answer for every smaller amount first.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: `dp` array of size `amount + 1`, filled with `Infinity` (unreachable) except `dp[0] = 0`.
* **Algorithm**: **Bottom-up DP (unbounded knapsack, minimise)**. For each amount `a` from 1 up, try every coin.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `coins = [1,3,4]`, `amount = 6`

| `a` | try 1 | try 3 | try 4 | `dp[a]` |
| :---: | :---: | :---: | :---: | :---: |
| 0 | | | | 0 |
| 1 | dp[0]+1 = 1 | — | — | 1 |
| 2 | dp[1]+1 = 2 | — | — | 2 |
| 3 | dp[2]+1 = 3 | dp[0]+1 = 1 | — | 1 |
| 4 | dp[3]+1 = 2 | dp[1]+1 = 2 | dp[0]+1 = 1 | 1 |
| 5 | dp[4]+1 = 2 | dp[2]+1 = 3 | dp[1]+1 = 2 | 2 |
| 6 | dp[5]+1 = 3 | dp[3]+1 = 2 | dp[2]+1 = 3 | 2 |

Returns `2`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function coinChange(coins: number[], amount: number): number {
    const dp: number[] = new Array(amount + 1).fill(Infinity);
    dp[0] = 0; // zero coins make zero

    for (let a = 1; a <= amount; a++) {
        for (const c of coins) {
            if (c <= a && dp[a - c] + 1 < dp[a]) {
                dp[a] = dp[a - c] + 1; // last coin is c
            }
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(\text{amount} \times |coins|)$**.
* **Space Complexity**: **$O(\text{amount})$**.

#### Edge Cases Handled:
* **`amount = 0`**: `0` coins.
* **Unreachable amounts**: stay `Infinity`, returned as `-1`.
* **Greedy counter-example** (`[1,3,4]`, 6): DP finds `3 + 3`.
