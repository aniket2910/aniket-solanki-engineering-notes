# 009. Find First and Last Position of Element in Sorted Array (Medium)

**Sheet**: Namaste DSA · 6. Binary Search Algorithm · [LeetCode 34](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

**Interview Tag**: 🔥 **MUST SOLVE** - Lower bound and upper bound in one problem. If you can write these two, you can write any binary search.

---

### 📝 1. Problem Statement
Given `nums` sorted in non-decreasing order (duplicates allowed), return `[first, last]`: the first and last index of `target`. Return `[-1, -1]` if it's absent. Required: **$O(\log n)$**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [5,7,7,8,8,10]`, `target = 8`
* **Output**: `[3,4]`

#### Test Case 2
* **Input**: `nums = [5,7,7,8,8,10]`, `target = 6`
* **Output**: `[-1,-1]`

#### Test Case 3
* **Input**: `nums = []`, `target = 0`
* **Output**: `[-1,-1]`

#### Test Case 4
* **Input**: `nums = [2,2,2,2]`, `target = 2`
* **Output**: `[0,3]`

---

### 💬 3. What is This Problem Actually Asking?
Run binary search **twice**. A normal binary search stops at *any* match. Here, on a match, you **record it and keep going**: left for the first index, right for the last.

---

### 🌍 4. Real-Life Example
A **dictionary** with several entries for "set". Finding *a* "set" is one lookup. To find where the "set" entries **start**, you keep flipping left while you still see "set"; to find where they **end**, you keep flipping right.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Find one, then expand
Binary search any match, then walk left and right. Breaks to $O(n)$ when the whole array is `target`.

#### Approach 2: Two biased binary searches (optimal)
One helper `bound(goLeft)`:
* on `nums[mid] === target`: save `mid`, then `high = mid - 1` (first) or `low = mid + 1` (last).
* otherwise move like normal binary search.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [5,7,7,8,8,10]`, `target = 8`

**First occurrence** (go left on match):

| `low` | `high` | `mid` | `nums[mid]` | action | `ans` |
| :---: | :---: | :---: | :---: | :--- | :---: |
| 0 | 5 | 2 | 7 | `low = 3` | -1 |
| 3 | 5 | 4 | 8 | match, `high = 3` | 4 |
| 3 | 3 | 3 | 8 | match, `high = 2` | 3 |

**Last occurrence** (go right on match): `mid = 2 → low = 3`, `mid = 4 → ans 4, low = 5`, `mid = 5 (10) → high = 4`. Result `4`.

Returns `[3, 4]`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function searchRange(nums: number[], target: number): number[] {
    // goLeft = true finds the first index, false finds the last
    function bound(goLeft: boolean): number {
        let low = 0;
        let high = nums.length - 1;
        let ans = -1;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            if (nums[mid] === target) {
                ans = mid;                 // record, then keep searching one side
                if (goLeft) high = mid - 1;
                else low = mid + 1;
            } else if (nums[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return ans;
    }

    return [bound(true), bound(false)];
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(\log n)$**, two binary searches.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **Empty array**: both searches return `-1`.
* **All elements equal the target**: `[0, n - 1]`, still $O(\log n)$.
* **Single occurrence**: both searches land on the same index.
