# 003. House Robber (Medium)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 198](https://leetcode.com/problems/house-robber/)

**Interview Tag**: 🔥 **MUST SOLVE** - The "take it or skip it" DP. Its recurrence shows up again in many later problems.

---

### 📝 1. Problem Statement
Houses on a street hold `nums[i]` money. You can't rob **two adjacent houses** (the alarms are linked). Return the most money you can take.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1,2,3,1]`
* **Output**: `4`
* **Why**: Houses 0 and 2: `1 + 3`.

#### Test Case 2
* **Input**: `nums = [2,7,9,3,1]`
* **Output**: `12`
* **Why**: Houses 0, 2, 4: `2 + 9 + 1`.

#### Test Case 3
* **Input**: `nums = [2,1,1,2]`
* **Output**: `4`
* **Why**: Houses 0 and 3. The best picks aren't always every other house.

---

### 💬 3. What is This Problem Actually Asking?
At house `i` you either **rob it** (then you couldn't rob `i-1`, so add it to the best up to `i-2`) or **skip it** (keep the best up to `i-1`):

`best(i) = max(best(i-1), best(i-2) + nums[i])`

---

### 🌍 4. Real-Life Example
Choosing **which days to work double shifts** when you can't do two in a row. Each day you decide: take today's shift (and rest yesterday), or rest today and keep whatever yesterday's plan earned.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: two rolling variables `prev2` (best up to `i-2`) and `prev1` (best up to `i-1`).
* **Algorithm**: **1-D DP** with a take/skip choice.
* A greedy "take the biggest, block its neighbours" fails on inputs like `[2,1,1,2]`, which is why DP is needed.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [2,7,9,3,1]`

| `i` | `nums[i]` | skip (`prev1`) | rob (`prev2 + nums[i]`) | best |
| :---: | :---: | :---: | :---: | :---: |
| 0 | 2 | 0 | 0 + 2 | 2 |
| 1 | 7 | 2 | 0 + 7 | 7 |
| 2 | 9 | 7 | 2 + 9 | 11 |
| 3 | 3 | 11 | 7 + 3 | 11 |
| 4 | 1 | 11 | 11 + 1 | 12 |

Returns `12`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function rob(nums: number[]): number {
    let prev2 = 0; // best total up to house i - 2
    let prev1 = 0; // best total up to house i - 1

    for (const money of nums) {
        const best = Math.max(prev1, prev2 + money); // skip this house, or rob it
        prev2 = prev1;
        prev1 = best;
    }
    return prev1;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n)$**.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **One house**: `max(0, 0 + nums[0])`.
* **Empty street**: returns `0`.
* **Zero-value houses**: never hurt, since skipping is always allowed.
