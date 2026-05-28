# 003. Best Time to Buy and Sell Stock (Easy)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **MUST SOLVE** - A top-tier interview classic. Perfect for testing sliding window concepts and greedy tracking of running minima.

---

### 📝 1. Problem Statement
You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the *maximum profit* you can achieve from this transaction. If you cannot achieve any profit, return `0`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `prices = [7, 1, 5, 3, 6, 4]`
* **Output**: `5`
* **Why**: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = $6 - 1 = 5$. (Note: buying on day 2 and selling on day 1 is not allowed because you must buy before you sell).

#### Test Case 2
* **Input**: `prices = [7, 6, 4, 3, 1]`
* **Output**: `0`
* **Why**: In this case, no transactions are done (prices keep dropping), so max profit = `0`.

---

### 💬 3. What is This Problem Actually Asking?
We want to find the largest possible positive difference between two numbers in an array, under the condition that **the smaller number (buy day) must appear before the larger number (sell day)**.

---

### 🌍 4. Real-Life Example
Think of a **financial trader looking at a stock price history chart**:
* As you scan the chart from left to right (chronological time):
  * You constantly keep your eye on the **lowest price** you have seen so far (`minPrice`).
  * For every new day's price, you calculate in your head: *"If I bought at the lowest price seen so far and sold today, how much money would I make?"* (`price - minPrice`).
  * If this potential profit is higher than the best profit you've made in the past, you write it down as your new record (`maxProfit`).

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing how to optimize a brute-force search into a highly efficient single-pass search:

#### Approach 1: Brute Force (Nested Loops)
We check every possible pair of buy and sell days and keep track of the maximum profit.
* **Pros**: Simple to write.
* **Cons**: Extremely slow ($O(N^2)$), which will result in a Time Limit Exceeded (TLE) error on large price histories.

#### Approach 2: Running Minimum Tracking (Greedy)
We traverse the prices array exactly once. As we walk, we maintain two values: the minimum price seen so far (`minPrice`), and the maximum profit achieved so far (`maxProfit`).
* At each step, if we find a lower price than `minPrice`, we update it.
* Otherwise, we check if selling at the current price yields a new record profit, and update `maxProfit` accordingly.
* **Pros**: Fast, optimal $O(N)$ runtime, and takes $O(1)$ space.

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function maxProfit(prices: number[]): number {
    // ==========================================
    // 1st Approach: Brute Force Nested Loops (TLE)
    // ==========================================
    /*
    let maxProfit = 0;
    for (let i = 0; i < prices.length; i++) {
        for (let j = i + 1; j < prices.length; j++) {
            let profit = prices[j] - prices[i];
            if (profit > maxProfit) {
                maxProfit = profit;
            }
        }
    }
    return maxProfit;
    */

    // ==========================================
    // 2nd Approach: Running Minimum Tracking (Optimal)
    // ==========================================
    let minPrice = Infinity;
    let maxProfit = 0;

    for (let i = 0; i < prices.length; i++) {
        let price = prices[i];

        if (price < minPrice) {
            // Track the lowest price we've seen to buy
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            // Found a higher sell profit!
            maxProfit = price - minPrice;
        }
    }

    return maxProfit;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Brute Force | Approach 2: Running Min |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N^2)$** — Nested index pair comparisons. | **$O(N)$** — Single pass over array. |
| **Space Complexity** | **$O(1)$** — Constant variables. | **$O(1)$** — Constant variables. |

#### Edge Cases Handled:
* **Single Day Price History** (`prices = [5]`): The loop runs once, `minPrice` becomes `5`. Returns `0` (Correct, cannot buy and sell on the same day).
* **Strictly Decreasing Prices** (`prices = [5, 4, 3, 2]`): `minPrice` keeps updating downward, profit is never positive. Returns `0` (Correct).
