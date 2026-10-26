# 004. Best Time to Buy and Sell Stock II (Medium)

**Sheet**: Namaste DSA · 12. Greedy Algorithm · [LeetCode 122](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/)

**Interview Tag**: 🔥 **MUST SOLVE** - Follow-up to [Best Time to Buy and Sell Stock](../05_ARRAYS/003-easy-best-time-to-buy-and-sell-stock.md). With unlimited trades, **collect every uphill step**.

---

### 📝 1. Problem Statement
`prices[i]` is a stock's price on day `i`. You may buy and sell **as many times as you like**, but hold at most one share at a time (you can sell and buy again on the same day). Return the maximum profit.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `prices = [7,1,5,3,6,4]`
* **Output**: `7`
* **Why**: Buy 1 sell 5 (+4), buy 3 sell 6 (+3).

#### Test Case 2
* **Input**: `prices = [1,2,3,4,5]`
* **Output**: `4`
* **Why**: Buy 1 sell 5 (+4), the same as +1 +1 +1 +1 day by day.

#### Test Case 3
* **Input**: `prices = [7,6,4,3,1]`
* **Output**: `0`

---

### 💬 3. What is This Problem Actually Asking?
Any profitable trade from day `a` to day `b` equals the sum of the daily changes between them. So the best total is the **sum of all positive day-to-day increases**: take every rise, skip every fall.

---

### 🌍 4. Real-Life Example
A **hiker paid per metre climbed**. Walking over hills and valleys, they earn for every uphill metre and nothing for downhill. Their pay is just the sum of all the climbs, however the trail is split up.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Peak-valley
Find each local minimum (buy) and the next local maximum (sell). Correct, but more index bookkeeping.

#### Approach 2: Sum of positive differences (optimal greedy)
`profit += max(0, prices[i] - prices[i - 1])` for each day. A long rise `1 → 5` is collected as `+1 +1 +1 +1`, which is the same `4`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `prices = [7,1,5,3,6,4]`

| day | change | collect? | profit |
| :---: | :---: | :---: | :---: |
| 1 | 1 − 7 = −6 | no | 0 |
| 2 | 5 − 1 = +4 | yes | 4 |
| 3 | 3 − 5 = −2 | no | 4 |
| 4 | 6 − 3 = +3 | yes | 7 |
| 5 | 4 − 6 = −2 | no | 7 |

Returns `7`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function maxProfit(prices: number[]): number {
    let profit = 0;
    for (let i = 1; i < prices.length; i++) {
        // Every rise from yesterday to today is profit we can lock in
        if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
    }
    return profit;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n)$**.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **Always falling**: nothing collected, `0`.
* **Single day**: loop doesn't run, `0`.
* **Flat days**: a change of `0` adds nothing.
