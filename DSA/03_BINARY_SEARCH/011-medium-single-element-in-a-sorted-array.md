# 011. Single Element in a Sorted Array (Medium)

**Sheet**: Namaste DSA · 6. Binary Search Algorithm · [LeetCode 540](https://leetcode.com/problems/single-element-in-a-sorted-array/)

**Interview Tag**: 🔥 **MUST SOLVE** - Binary search on **index parity**. XOR solves it in $O(n)$; the interviewer wants $O(\log n)$.

---

### 📝 1. Problem Statement
`nums` is sorted, and every element appears **exactly twice** except one that appears once. Return the single element in **$O(\log n)$** time and $O(1)$ space.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1,1,2,3,3,4,4,8,8]`
* **Output**: `2`

#### Test Case 2
* **Input**: `nums = [3,3,7,7,10,11,11]`
* **Output**: `10`

#### Test Case 3
* **Input**: `nums = [1]`
* **Output**: `1`

#### Test Case 4
* **Input**: `nums = [1,1,2]`
* **Output**: `2`

---

### 💬 3. What is This Problem Actually Asking?
**Before** the single element, every pair starts at an **even** index: `(0,1), (2,3), …`. **After** it, everything shifts by one and pairs start at **odd** indexes. So look at an even index `mid`: if `nums[mid] === nums[mid + 1]`, the pattern is still intact and the single element is to the right. If not, it's at `mid` or to the left.

---

### 🌍 4. Real-Life Example
**Couples seated in pairs** along a row of chairs (chairs 0-1, 2-3, …), with one person who came alone. Everyone left of the solo guest sits in their couple's proper chair pair. Everyone to the right is shifted one chair over. Checking one even chair tells you which side the solo guest is on.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: XOR everything
`a ^ a = 0`, so XOR of the whole array leaves the single element. $O(n)$, doesn't use the sorted order.

#### Approach 2: Binary search on even indexes (optimal)
* Force `mid` to be even (`if (mid % 2 === 1) mid--`).
* `nums[mid] === nums[mid + 1]` → pair is intact → single is right → `low = mid + 2`.
* otherwise → single is at `mid` or left → `high = mid`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [3,3,7,7,10,11,11]`

| `low` | `high` | `mid` (even) | `nums[mid]`, `nums[mid+1]` | action |
| :---: | :---: | :---: | :---: | :--- |
| 0 | 6 | 2 | 7, 7 (pair) | `low = 4` |
| 4 | 6 | 4 (5 → 4) | 10, 11 (broken) | `high = 4` |

`low === high === 4`, return `nums[4] = 10`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function singleNonDuplicate(nums: number[]): number {
    let low = 0;
    let high = nums.length - 1;

    while (low < high) {
        let mid = Math.floor((low + high) / 2);
        if (mid % 2 === 1) mid--; // always look at the start of a pair

        if (nums[mid] === nums[mid + 1]) {
            low = mid + 2;   // pairs intact up to here: single is to the right
        } else {
            high = mid;      // pattern already broken: single is mid or left
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
* **Single-element array**: loop doesn't run.
* **Single element first or last**: `high` shrinks to 0, or `low` jumps by 2 up to `n - 1`.
* `mid + 1` is always in range: `mid` is even and `< high`, and `high` is always even.
