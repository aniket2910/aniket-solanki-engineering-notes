# 006. Max Consecutive Ones (Easy)

---

### 📝 1. Problem Statement
Given a binary array `nums`, return the maximum number of consecutive `1`'s in the array.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1, 1, 0, 1, 1, 1]`
* **Output**: `3`
* **Why**: The first two digits are consecutive `1`s. The last three digits are consecutive `1`s. The maximum number of consecutive `1`s is `3`.

#### Test Case 2
* **Input**: `nums = [1, 0, 1, 1, 0, 1]`
* **Output**: `2`

---

### 💬 3. What is This Problem Actually Asking?
We are given an array containing only `0`s and `1`s. We need to find the longest contiguous block of `1`s in the array and return its length.

The optimal constraints are:
* **Linear Time ($O(N)$)**: We must find the answer in a single scan of the array.
* **Constant Space ($O(1)$)**: We must use only $O(1)$ extra space.

---

### 🌍 4. Real-Life Example
Think of tracking a **fitness streak**:
* You have a list of days where `1` represents a day you went to the gym, and `0` represents a day you missed.
* You scan your calendar day-by-day:
  * When you go to the gym (`1`), your current streak increases by `1`. You check if this current streak is your personal best (`maxCount`) and write it down if it is.
  * When you miss a day (`0`), your current streak resets to `0`.
* In the end, your personal best streak is the answer!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Array** (binary array).
* **Algorithm**: **Single-Pass Counting with Running Maximum**.
  * *Why*: We only need to know the length of the current streak and the maximum streak seen so far. A single pass is sufficient because we check every element once and update our running variables in $O(1)$ constant time.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function findMaxConsecutiveOnes(nums: number[]): number {
    let maxCount: number = 0;
    let currentCount: number = 0;

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === 1) {
            currentCount++;
            // Update maxCount dynamically as the streak grows
            if (currentCount > maxCount) {
                maxCount = currentCount;
            }
        } else {
            // Streak broken! Reset currentCount to 0
            currentCount = 0;
        }
    }

    return maxCount;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We traverse the array of length $N$ exactly once.
* **Space Complexity**: **$O(1)$** — We use only two constant-sized variables (`maxCount`, `currentCount`).

#### Edge Cases Handled:
* **All Zeroes** (`nums = [0, 0, 0]`): `currentCount` never increments. Returns `0` (Correct).
* **All Ones** (`nums = [1, 1, 1]`): `currentCount` increments to `3` and updates `maxCount` to `3`. Returns `3` (Correct).
* **Streak at the Very End** (`nums = [0, 1, 1]`): `maxCount` is updated to `2` in the final iteration. Returns `2` (Correct).
