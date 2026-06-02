# 010. Kadane's Algorithm (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **GREEDY RUNNING SUM** - Standard, legendary array algorithm. Highly useful for demonstrating greedy vs. brute-force optimization patterns.

---

### 📝 1. Problem Statement
Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return *its sum*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]`
* **Output**: `6`
* **Why**: The contiguous subarray `[4, -1, 2, 1]` has the largest sum = `6`.

#### Test Case 2
* **Input**: `nums = [5, 4, -1, 7, 8]`
* **Output**: `23`
* **Why**: The contiguous subarray `[5, 4, -1, 7, 8]` (the whole array) has the largest sum = `23`.

---

### 💬 3. What is This Problem Actually Asking?
We need to find a slice of the array that, when added together, yields the largest possible sum. The subarray must be contiguous (no skipping elements).

---

### 🌍 4. Real-Life Example
Think of looking at the profit/loss history of a small retail business over a year. There are months with net losses (negative values) and months with net profits (positive values). You want to isolate a contiguous block of months that represents the most successful streak of the business. If the streak sum falls below 0, it means it's better to cut our losses and start counting a fresh streak from the next positive month.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing the optimization of subarray summation:

#### Approach 1: Brute Force (Nested Loops)
We test every possible subarray `nums[i...j]` by computing its sum using nested loops, and maintain the maximum sum.
* **Pros**: Simple conceptual model.
* **Cons**: Extremely slow ($O(N^2)$), causing TLE on massive arrays.

#### Approach 2: Kadane's Greedy Algorithm (Optimal)
> [!NOTE]
> For a detailed conceptual breakdown, mathematical proof, and visual explanation of this algorithm, refer to the [Kadane's Algorithm Blueprint](../ALGORITHMS/kadanes-algorithm.md).

We traverse the array exactly once. At each element, we decide whether to add it to our existing running sum, or start a new subarray beginning with the current element.
* If our running sum `currentSum` drops below `0`, we greedy-reset `currentSum` to `0` and start a new subarray.
* **Pros**: Fast, optimal single-pass $O(N)$ runtime, $O(1)$ constant space.
* **Cons**: None.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `nums = [-2, 1, -3, 4]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `maxSum = -2`, `currentSum = 0`

#### **Step 1: i = 0 (val = -2)**
* **Updates**: `currentSum = 0 + (-2) = -2`. `maxSum = max(-2, -2) = -2`.
* **Greedy Step**: Since `currentSum (-2) < 0`, reset `currentSum = 0`.
* **Next**: `i` advances to index 1.

#### **Step 2: i = 1 (val = 1)**
* **Updates**: `currentSum = 0 + 1 = 1`. `maxSum = max(-2, 1) = 1`.
* **Next**: `i` advances to index 2.

#### **Step 3: i = 2 (val = -3)**
* **Updates**: `currentSum = 1 + (-3) = -2`. `maxSum = max(1, -2) = 1`.
* **Greedy Step**: Since `currentSum (-2) < 0`, reset `currentSum = 0`.
* **Next**: `i` advances to index 3.

#### **Step 4: i = 3 (val = 4)**
* **Updates**: `currentSum = 0 + 4 = 4`. `maxSum = max(1, 4) = 4`.
* **Next**: End of loop. Returns `maxSum = 4`.

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function maxSubArray(nums: number[]): number {
    // ==========================================
    // 1st Approach: Brute Force Nested Loops (O(N^2))
    // ==========================================
    /*
    let maxSum = -Infinity;
    for (let i = 0; i < nums.length; i++) {
        let currentSum = 0;
        for (let j = i; j < nums.length; j++) {
            currentSum += nums[j];
            if (currentSum > maxSum) {
                maxSum = currentSum;
            }
        }
    }
    return maxSum;
    */

    // ==========================================
    // 2nd Approach: Kadane's Greedy Algorithm (Optimal)
    // ==========================================
    let maxSum = nums[0];
    let currentSum = 0;

    for (let i = 0; i < nums.length; i++) {
        currentSum += nums[i];

        if (currentSum > maxSum) {
            maxSum = currentSum;
        }

        if (currentSum < 0) {
            // Greedy Step: Reset if sum drops below 0
            currentSum = 0;
        }
    }

    return maxSum;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Brute Force | Approach 2: Kadane's Algorithm |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N^2)$** — Nested combinations traversal. | **$O(N)$** — Single pass over array. |
| **Space Complexity** | **$O(1)$** — Constant variables. | **$O(1)$** — Constant variables. |

#### Edge Cases Handled:
* **All Negative Numbers** (`nums = [-5, -2, -3]`): `maxSum` correctly initializes and tracks `-2`. `currentSum` resets at each step, preventing negative accumulator corruption (Correct).
* **Single Element Array** (`nums = [5]`): Loop executes once, returns `5` (Correct).
