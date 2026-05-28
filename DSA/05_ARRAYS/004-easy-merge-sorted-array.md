# 004. Merge Sorted Array (Easy)

---

### 📝 1. Problem Statement
You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.

**Merge** `nums1` and `nums2` into a single array sorted in non-decreasing order.

The final sorted array should not be returned by the function, but instead be **stored inside the array `nums1`**. To accommodate this, `nums1` has a length of `m + n`, where the first `m` elements denote the elements that should be merged, and the last `n` elements are set to `0` and should be ignored. `nums2` has a length of `n`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums1 = [1, 2, 3, 0, 0, 0]`, `m = 3`, `nums2 = [2, 5, 6]`, `n = 3`
* **Output**: `nums1` becomes `[1, 2, 2, 3, 5, 6]`
* **Why**: The arrays we are merging are `[1, 2, 3]` and `[2, 5, 6]`. The result is stored in `nums1`.

#### Test Case 2
* **Input**: `nums1 = [1]`, `m = 1`, `nums2 = []`, `n = 0`
* **Output**: `nums1` becomes `[1]`

#### Test Case 3
* **Input**: `nums1 = [0]`, `m = 0`, `nums2 = [1]`, `n = 1`
* **Output**: `nums1` becomes `[1]`

---

### 💬 3. What is This Problem Actually Asking?
We need to combine two already-sorted arrays into one single sorted array.

The strict constraints are:
* **No Extra Space ($O(1)$ Auxiliary Space)**: We cannot allocate a new array to hold the combined elements.
* **In-Place in `nums1`**: We must overwrite the values in `nums1` directly.
* **The Challenge**: If we start merging from the front (left-to-right), we risk overwriting active elements of `nums1` before we have had a chance to process them, unless we shift elements (which is highly inefficient at $O(N^2)$ time).

---

### 🌍 4. Real-Life Example
Imagine you are **sorting two rows of physical files into a single cabinet drawer**:
* Row 1 (`nums1`) has files at the front (`m` elements) and empty space at the back (`n` slots).
* Row 2 (`nums2`) has `n` files.
* If you start placing files from the front of Row 1, you'll have to keep pushing all files back to make room (tiring and slow).
* Instead, you **start from the back of the cabinet drawer** (which is completely empty). 
* You compare the *last* files of both rows (the largest alphabetically), grab the bigger one, and place it at the very back of the drawer.
* You step forward and repeat. Because you work from the empty back space forward, you never have to shift any files!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Arrays** (contiguous memory allowing instant $O(1)$ random index writes).
* **Algorithm**: **Two-Pointer Merge from the Back (Right-to-Left)**.
  * *Why*: Since the end of `nums1` is pre-allocated empty space (initialized as `0`), it acts as a safe write buffer. Placing the largest elements at the back first eliminates any need for shifting elements, resulting in a clean linear $O(M + N)$ time complexity.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
/**
 Do not return anything, modify nums1 in-place instead.
 */
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
    let i: number = m - 1;         // Pointer for last active element in nums1
    let j: number = n - 1;         // Pointer for last element in nums2
    let writePointer: number = m + n - 1; // Pointer for the empty end of nums1

    // Merge in reverse order (largest elements first at the back)
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) {
            nums1[writePointer] = nums1[i];
            i--;
        } else {
            nums1[writePointer] = nums2[j];
            j--;
        }
        writePointer--;
    }
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(M + N)$** — In the worst case, we make exactly $M + N$ comparisons and writes to merge both arrays.
* **Space Complexity**: **$O(1)$** — No auxiliary space is allocated. The merge occurs completely in-place.

#### Edge Cases Handled:
* **`nums1` is Empty** (`m = 0`, `nums1 = [0]`, `nums2 = [1]`):
  * `i = -1`, `j = 0`, `writePointer = 0`.
  * The loop condition `j >= 0` is true.
  * Since `i >= 0` is false, it executes the `else` branch: `nums1[0] = nums2[0]` (places `1`). `j` becomes `-1`. Loop exits (Correct).
* **`nums2` is Empty** (`n = 0`, `nums1 = [1]`, `nums2 = []`):
  * `j = -1`. The loop `j >= 0` never runs. `nums1` remains `[1]` (Correct).
* **Elements in `nums2` are all smaller than `nums1`** (`nums1 = [4,5,6,0,0,0]`, `nums2 = [1,2,3]`):
  * The larger elements of `nums1` (`6, 5, 4`) are moved to the back first.
  * When `i` becomes `-1`, the remaining elements of `nums2` (`3, 2, 1`) are copied directly into the front of `nums1` (Correct).
