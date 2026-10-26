# 007. Find Peak Element (Medium)

**Sheet**: Namaste DSA · 6. Binary Search Algorithm · [LeetCode 162](https://leetcode.com/problems/find-peak-element/)

**Interview Tag**: 🔥 **MUST SOLVE** - Binary search on an **unsorted** array. The insight is the slope argument, so be ready to explain why it's correct.

---

### 📝 1. Problem Statement
A **peak** is an element strictly greater than its neighbours. Given `nums` (no two adjacent elements are equal), return the index of **any** peak. Treat `nums[-1]` and `nums[n]` as $-\infty$, so the ends can be peaks too. Required: **$O(\log n)$**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1,2,3,1]`
* **Output**: `2`
* **Why**: `3` is bigger than `2` and `1`.

#### Test Case 2
* **Input**: `nums = [1,2,1,3,5,6,4]`
* **Output**: `5`
* **Why**: `6` at index 5 is a peak. Index `1` (value `2`) is also a peak, and either answer is accepted.

#### Test Case 3
* **Input**: `nums = [1]`
* **Output**: `0`

#### Test Case 4
* **Input**: `nums = [2,1]`
* **Output**: `0`
* **Why**: `2` beats its only neighbour `1` and the imaginary $-\infty$ on the left.

---

### 💬 3. What is This Problem Actually Asking?
Compare `nums[mid]` with `nums[mid + 1]`. If the next value is **higher**, you're on an uphill slope, and walking uphill must eventually hit a peak (the array ends in $-\infty$). So a peak exists **to the right**. Otherwise one exists at `mid` or to the left.

---

### 🌍 4. Real-Life Example
Hiking in **fog** where you can only see one step ahead. If the ground rises in front of you, keep going that way: you can't fall off a cliff into "higher", so there's a summit ahead. If it drops, there's a summit where you stand or behind you.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Linear scan
Return the first `i` with `nums[i] > nums[i + 1]`. Correct, but $O(n)$.

#### Approach 2: Binary search on the slope (optimal)
* `nums[mid] < nums[mid + 1]` → uphill → `low = mid + 1`.
* else → downhill (or at a peak) → `high = mid`.
* Loop while `low < high`; when they meet, that index is a peak.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [1,2,1,3,5,6,4]`

| `low` | `high` | `mid` | `nums[mid]` vs `nums[mid+1]` | action |
| :---: | :---: | :---: | :---: | :--- |
| 0 | 6 | 3 | 3 < 5 (uphill) | `low = 4` |
| 4 | 6 | 5 | 6 > 4 (downhill) | `high = 5` |
| 4 | 5 | 4 | 5 < 6 (uphill) | `low = 5` |

`low === high === 5`, return `5`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function findPeakElement(nums: number[]): number {
    let low = 0;
    let high = nums.length - 1;

    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (nums[mid] < nums[mid + 1]) {
            low = mid + 1;   // uphill: a peak lies to the right
        } else {
            high = mid;      // downhill: mid or something left of it is a peak
        }
    }
    return low;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(\log n)$**.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **Single element**: `low === high` immediately, returns `0`.
* **Strictly increasing**: always uphill, ends at the last index.
* **Strictly decreasing**: always downhill, ends at index `0`.
* `mid + 1` is always in range because `mid < high` inside the loop.
