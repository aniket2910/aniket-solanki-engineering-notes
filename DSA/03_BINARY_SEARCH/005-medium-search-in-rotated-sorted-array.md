# 005. Search in Rotated Sorted Array (Medium)

**Sheet**: Namaste DSA · 6. Binary Search Algorithm · [LeetCode 33](https://leetcode.com/problems/search-in-rotated-sorted-array/)

**Interview Tag**: 🔥 **MUST SOLVE** - The most asked binary-search twist. The key sentence: "at least one half is always sorted".

---

### 📝 1. Problem Statement
A sorted array of **distinct** integers was rotated at some unknown pivot, e.g. `[0,1,2,4,5,6,7]` became `[4,5,6,7,0,1,2]`. Given the rotated array `nums` and a `target`, return the index of `target`, or `-1` if it's absent. Required: **$O(\log n)$**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [4,5,6,7,0,1,2]`, `target = 0`
* **Output**: `4`

#### Test Case 2
* **Input**: `nums = [4,5,6,7,0,1,2]`, `target = 3`
* **Output**: `-1`

#### Test Case 3
* **Input**: `nums = [1]`, `target = 0`
* **Output**: `-1`

#### Test Case 4
* **Input**: `nums = [5,1,3]`, `target = 5`
* **Output**: `0`

#### Test Case 5
* **Input**: `nums = [3,1]`, `target = 1`
* **Output**: `1`

---

### 💬 3. What is This Problem Actually Asking?
Plain binary search needs the whole array sorted. Here only **pieces** are sorted. But cut the array at any `mid` and **one of the two halves is fully sorted**. For the sorted half you can test "is `target` inside it?" with two comparisons, and that tells you which half to keep.

---

### 🌍 4. Real-Life Example
A **circular bookshelf** where someone moved the first few books to the end. Open the shelf at the middle: one side still reads A→Z without a break. If the title you want falls within that side's first and last titles, search there; otherwise it's on the other side.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: Array.
* **Algorithm**: **Modified Binary Search**.
  1. If `nums[mid] === target`, done.
  2. If `nums[low] <= nums[mid]`, the **left half is sorted**. Keep left if `nums[low] <= target < nums[mid]`, else go right.
  3. Otherwise the **right half is sorted**. Keep right if `nums[mid] < target <= nums[high]`, else go left.
* `<=` in `nums[low] <= nums[mid]` matters when `low === mid` (two elements left).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [4,5,6,7,0,1,2]`, `target = 0`

| `low` | `high` | `mid` | `nums[mid]` | sorted half | target inside? | action |
| :---: | :---: | :---: | :---: | :--- | :---: | :--- |
| 0 | 6 | 3 | 7 | left `[4..7]` | no | `low = 4` |
| 4 | 6 | 5 | 1 | left `[0..1]` | yes (`0 ≤ 0 < 1`) | `high = 4` |
| 4 | 4 | 4 | 0 | — | found | return `4` |

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function search(nums: number[], target: number): number {
    let low = 0;
    let high = nums.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (nums[mid] === target) return mid;

        if (nums[low] <= nums[mid]) {
            // Left half [low..mid] is sorted
            if (nums[low] <= target && target < nums[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            // Right half [mid..high] is sorted
            if (nums[mid] < target && target <= nums[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(\log n)$**, half the range is dropped every step.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **No rotation** (`[1,2,3]`): the left half is always sorted, so it's plain binary search.
* **Two elements** (`[3,1]`): `low === mid`, the `<=` correctly treats `[3]` as the sorted left half.
* **Duplicates**: not allowed here. With duplicates (LeetCode 81) `nums[low] === nums[mid]` can't tell which side is sorted, and the worst case becomes $O(n)$.
