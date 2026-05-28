# 003. Best Time to Buy and Sell Stock (Easy)

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
We want to find the largest possible gap between two numbers in an array, with the strict rule that **the smaller number (buy day) must appear before the larger number (sell day)**.

The optimal constraints are:
* **Linear Time ($O(N)$)**: We are only allowed to scan the price history once.
* **Constant Space ($O(1)$)**: We cannot use nested loops ($O(N^2)$) as they will time out on large price histories.

---

### 🌍 4. Real-Life Example
Think of a **financial trader looking at a stock price history chart**:
* As you scan the chart from left to right (chronological time):
  * You constantly keep your eye on the **lowest price** you have seen so far (`minPrice`).
  * For every new day's price, you calculate in your head: *"If I bought at the lowest price seen so far and sold today, how much money would I make?"* (`price - minPrice`).
  * If this potential profit is higher than the best profit you've made in the past, you write it down as your new record (`maxProfit`).

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Array** (representing prices over time).
* **Algorithm**: **Single-Pass Running Minimum Tracking (Greedy / Kadane's Style)**.
  * *Why*: We don't need to check every pair of days. By simply remembering the lowest buying point we've seen so far as we traverse forward, we can instantly calculate the maximum profit possible if we sold on the current day in $O(1)$ operations.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function maxProfit(prices: number[]): number {
    let minPrice: number = Infinity;
    let maxProfit: number = 0;

    for (let i = 0; i < prices.length; i++) {
        const price = prices[i];

        // 1. Keep track of the lowest buying price seen so far
        if (price < minPrice) {
            minPrice = price;
        } 
        // 2. Otherwise, check if selling today yields a higher record profit
        else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }

    return maxProfit;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We traverse the array of length $N$ exactly once.
* **Space Complexity**: **$O(1)$** — We use only two constant-sized variables (`minPrice`, `maxProfit`).

#### Edge Cases Handled:
* **Single Day Price History** (`prices = [5]`): The loop runs once, `minPrice` becomes `5`. The `else if` is skipped. Returns `maxProfit` (`0`) (Correct, cannot sell on the same day).
* **Strictly Decreasing Prices** (`prices = [5, 4, 3, 2]`): `minPrice` keeps updating downward. The `price - minPrice` is never positive. Returns `0` (Correct).
* **Stock Spikes Up and Down** (`prices = [2, 10, 1, 3]`):
  * At price `10`: `minPrice` is `2`. Profit = $10 - 2 = 8$ (`maxProfit = 8`).
  * At price `1`: `minPrice` updates to `1`.
  * At price `3`: Profit = $3 - 1 = 2$. It is smaller than `8`, so `maxProfit` remains `8`. Returns `8` (Correct).
