# 004. House Robber II (Medium)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 213](https://leetcode.com/problems/house-robber-ii/)

**Interview Tag**: 🔥 **MUST SOLVE** - Turn a circle into **two straight lines** and reuse [House Robber](./003-medium-house-robber.md).

---

### 📝 1. Problem Statement
Same as House Robber, but the houses are arranged in a **circle**: the first and last houses are neighbours. Return the most money you can rob without taking two adjacent houses.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [2,3,2]`
* **Output**: `3`
* **Why**: Houses 0 and 2 are adjacent on the circle, so `2 + 2` isn't allowed.

#### Test Case 2
* **Input**: `nums = [1,2,3,1]`
* **Output**: `4`

#### Test Case 3
* **Input**: `nums = [1,2,3]`
* **Output**: `3`

#### Test Case 4
* **Input**: `nums = [5]`
* **Output**: `5`

---

### 💬 3. What is This Problem Actually Asking?
The circle only adds one rule: you can't take **both** the first and the last house. So either skip the first house (rob from `1 … n-1`) or skip the last (rob from `0 … n-2`). Each is a normal straight-line House Robber; take the better one.

---

### 🌍 4. Real-Life Example
Seating **guests at a round table** where certain neighbours mustn't both be invited. Cut the circle at one seat: once you've decided that seat stays empty, the rest is just a straight row.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Algorithm**: **Reduction + 1-D DP**: `max(robLine(0, n-2), robLine(1, n-1))`.
* **Special case**: with one house, both ranges are empty, so return `nums[0]` directly.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [2,3,2]`

| line | houses | best |
| :--- | :---: | :---: |
| skip last | `[2,3]` | 3 |
| skip first | `[3,2]` | 3 |

`max(3, 3) = 3`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function rob(nums: number[]): number {
    if (nums.length === 1) return nums[0];

    // Straight-line House Robber on nums[from..to]
    function robLine(from: number, to: number): number {
        let prev2 = 0;
        let prev1 = 0;
        for (let i = from; i <= to; i++) {
            const best = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = best;
        }
        return prev1;
    }

    // First and last are neighbours: leave out one or the other
    return Math.max(robLine(0, nums.length - 2), robLine(1, nums.length - 1));
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n)$**, two linear passes.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **One house**: returned directly (both lines would be empty otherwise).
* **Two houses**: each line has one house, returns the bigger.
