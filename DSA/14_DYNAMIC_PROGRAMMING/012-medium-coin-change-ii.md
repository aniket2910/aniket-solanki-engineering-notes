# 012. Coin Change II (Medium)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 518](https://leetcode.com/problems/coin-change-ii/)

**Interview Tag**: 🔥 **MUST SOLVE** - Counting **combinations**, not permutations. The order of the two loops is the whole question.

---

### 📝 1. Problem Statement
Given an `amount` and coin values `coins` (unlimited supply), return the **number of combinations** of coins that make up `amount`. `1+2` and `2+1` are the same combination.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `amount = 5`, `coins = [1,2,5]`
* **Output**: `4`
* **Why**: `5`, `2+2+1`, `2+1+1+1`, `1+1+1+1+1`.

#### Test Case 2
* **Input**: `amount = 3`, `coins = [2]`
* **Output**: `0`

#### Test Case 3
* **Input**: `amount = 10`, `coins = [10]`
* **Output**: `1`

#### Test Case 4
* **Input**: `amount = 0`, `coins = [7]`
* **Output**: `1`
* **Why**: Using no coins is one way to make 0.

---

### 💬 3. What is This Problem Actually Asking?
`ways[a]` = number of combinations that make `a`. Process the coins **one at a time** in the outer loop. While processing coin `c`, `ways[a] += ways[a - c]` adds the combinations that use at least one more `c`. Because coins are added in a fixed order, `1+2` and `2+1` are counted once.

---

### 🌍 4. Real-Life Example
**Packing a gift box** with chocolates of fixed sizes. You decide how many of size 1 to use, then how many of size 2, then size 5, always in that order. That's why "1 then 2" and "2 then 1" are the same box.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: `ways` array of length `amount + 1`, `ways[0] = 1`.
* **Algorithm**: **Unbounded knapsack, counting**:
  * **coins outer, amounts inner** → combinations (this problem).
  * Amounts outer, coins inner → permutations (each order counted separately), a different problem.
* The inner loop goes **upwards** so a coin can be used again (unbounded), the opposite of [Partition Equal Subset Sum](./011-medium-partition-equal-subset-sum.md).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `amount = 5`, `coins = [1,2,5]`

| after coin | ways[0] | [1] | [2] | [3] | [4] | [5] |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| start | 1 | 0 | 0 | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 2 | 1 | 1 | 2 | 2 | 3 | 3 |
| 5 | 1 | 1 | 2 | 2 | 3 | 4 |

Returns `4`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function change(amount: number, coins: number[]): number {
    const ways: number[] = new Array(amount + 1).fill(0);
    ways[0] = 1; // one way to make 0: use no coins

    // Coins in the OUTER loop: each combination is built in one fixed coin order
    for (const c of coins) {
        for (let a = c; a <= amount; a++) {
            ways[a] += ways[a - c]; // combinations that use one more coin c
        }
    }
    return ways[amount];
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(|coins| \times \text{amount})$**.
* **Space Complexity**: **$O(\text{amount})$**.

#### Edge Cases Handled:
* **`amount = 0`**: `1` (the empty combination).
* **Unreachable amount**: stays `0`.
* **Swapped loops**: would count `1+2` and `2+1` separately and return `9` for test 1 instead of `4`.
