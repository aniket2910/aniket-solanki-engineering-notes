# 008. Find Minimum in Rotated Sorted Array (Medium)

**Sheet**: Namaste DSA · 6. Binary Search Algorithm · [LeetCode 153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)

**Interview Tag**: 🔥 **MUST SOLVE** - Companion to [005. Search in Rotated Sorted Array](./005-medium-search-in-rotated-sorted-array.md). The minimum is the **rotation point**.

---

### 📝 1. Problem Statement
A sorted array of **unique** integers was rotated between `1` and `n` times. Return its minimum element in **$O(\log n)$** time.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [3,4,5,1,2]`
* **Output**: `1`

#### Test Case 2
* **Input**: `nums = [4,5,6,7,0,1,2]`
* **Output**: `0`

#### Test Case 3
* **Input**: `nums = [11,13,15,17]`
* **Output**: `11`
* **Why**: Rotated `n` times = not rotated at all.

#### Test Case 4
* **Input**: `nums = [2,1]`
* **Output**: `1`

---

### 💬 3. What is This Problem Actually Asking?
Find the one place where the array "drops". Compare `nums[mid]` with the **last** element `nums[high]`:
* `nums[mid] > nums[high]` → the drop is to the right of `mid`.
* otherwise → `mid..high` is sorted, so the minimum is `mid` or to its left.

---

### 🌍 4. Real-Life Example
A **24-hour clock schedule** that was printed starting from 3 pm: `15, 16, …, 23, 0, 1, …, 14`. The earliest hour (`0`) is right where the numbers wrap around. Looking at any middle entry and the last entry tells you which side the wrap is on.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: Array.
* **Algorithm**: **Binary Search against the right end** (`low < high` form).
  * Comparing with `nums[high]` (not `nums[low]`) handles the "not rotated" case without a special branch: a fully sorted range always has `nums[mid] <= nums[high]`, so it keeps moving left to index 0.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [4,5,6,7,0,1,2]`

| `low` | `high` | `mid` | `nums[mid]` vs `nums[high]` | action |
| :---: | :---: | :---: | :---: | :--- |
| 0 | 6 | 3 | 7 > 2 | `low = 4` |
| 4 | 6 | 5 | 1 ≤ 2 | `high = 5` |
| 4 | 5 | 4 | 0 ≤ 1 | `high = 4` |

`low === high === 4`, return `nums[4] = 0`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function findMin(nums: number[]): number {
    let low = 0;
    let high = nums.length - 1;

    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (nums[mid] > nums[high]) {
            low = mid + 1;   // the drop (and the minimum) is right of mid
        } else {
            high = mid;      // mid..high is sorted: minimum is mid or left of it
        }
    }
    return nums[low];
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(\log n)$**.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **Not rotated**: always takes `high = mid`, ends at index 0.
* **Single element**: loop doesn't run.
* **Minimum at the last index** (`[2,1]`): `2 > 1` moves `low` to 1.
