# 014. Merge Two Sorted Arrays Without Extra Space (Hard)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **IN-PLACE SHIFTING** - Hard classic array question. Tests array boundaries, sorting without allocations, and backwards pointer manipulation.

---

### 📝 1. Problem Statement
You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.

Merge `nums1` and `nums2` into a single array sorted in non-decreasing order.

The final sorted array should not be returned by the function, but instead be **stored inside the array `nums1`**. To accommodate this, `nums1` has a length of `m + n`, where the first `m` elements denote the elements that should be merged, and the last `n` elements are set to `0` and should be ignored. `nums2` has a length of `n`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums1 = [1,2,3,0,0,0]`, `m = 3`, `nums2 = [2,5,6]`, `n = 3`
* **Output**: `[1,2,2,3,5,6]`
* **Why**: The elements being merged are `[1,2,3]` and `[2,5,6]`. The result is `[1,2,2,3,5,6]`.

#### Test Case 2
* **Input**: `nums1 = [1]`, `m = 1`, `nums2 = []`, `n = 0`
* **Output**: `[1]`
* **Why**: There is nothing to merge from `nums2`.

---

### 💬 3. What is This Problem Actually Asking?
We need to combine two sorted arrays into `nums1` **in-place** with constant $O(1)$ extra memory. The key is to fill the array from **back to front** to avoid overwriting valid elements in `nums1`.

---

### 🌍 4. Real-Life Example
Imagine you are cleaning a shelf in a library. The left side of the shelf holds a sorted stack of books, and there is empty space at the very right end. You have another sorted stack of books in a box on the floor. To merge them onto the shelf without using any extra table space, you compare the largest books from the shelf and the box, and place the largest one at the very end of the shelf, working your way backward.

---

### 🛠️ 5. Data Structure & Algorithms Used

We contrast front-to-back vs back-to-front merging:

#### Approach 1: Standard Merging from Front to Back
We merge from index 0. Because writing to `nums1` prematurely overwrites its own uninspected values, we must copy the first $m$ elements of `nums1` to an auxiliary array first.
* **Pros**: Simple, standard two-pointer comparison.
* **Cons**: Requires $O(M)$ auxiliary memory space, failing the strict in-place constraint.

#### Approach 2: Three-Pointer Backwards Merging (Optimal)
We place three pointers:
* `i = m - 1` (last active element in `nums1`)
* `j = n - 1` (last element in `nums2`)
* `k = m + n - 1` (last index in `nums1` container)
* We compare `nums1[i]` and `nums2[j]`, write the **larger** one to `nums1[k]`, and decrement pointers backward.
* **Pros**: Fast, optimal $O(M + N)$ runtime, true in-place execution with $O(1)$ constant space.
* **Cons**: None.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `nums1 = [1, 3, 0, 0] (m=2)` and `nums2 = [2, 4] (n=2)`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `i = 1`, `j = 1`, `k = 3`

#### **Step 1: Compare elements (i = 1, j = 1)**
```text
nums1: [  1,   3,   0,   0  ]
               ▲         ▲
               i         k
nums2: [  2,   4  ]
               ▲
               j
```
* **State check**: `nums1[i] (3)` vs `nums2[j] (4)`.
* **Action**: `4 > 3`, so write `nums2[j] (4)` to `nums1[k]`. Decrement `j` and `k`.
* **Updates**: `nums1 = [1, 3, 0, 4]`. `j = 0`, `k = 2`.

#### **Step 2: Compare elements (i = 1, j = 0)**
```text
nums1: [  1,   3,   0,   4  ]
               ▲    ▲
               i    k
nums2: [  2,   4  ]
          ▲
          j
```
* **State check**: `nums1[i] (3)` vs `nums2[j] (2)`.
* **Action**: `3 > 2`, so write `nums1[i] (3)` to `nums1[k]`. Decrement `i` and `k`.
* **Updates**: `nums1 = [1, 3, 3, 4]`. `i = 0`, `k = 1`.

#### **Step 3: Compare elements (i = 0, j = 0)**
```text
nums1: [  1,   3,   3,   4  ]
          ▲    ▲
          i    k
nums2: [  2,   4  ]
          ▲
          j
```
* **State check**: `nums1[i] (1)` vs `nums2[j] (2)`.
* **Action**: `2 > 1`, so write `nums2[j] (2)` to `nums1[k]`. Decrement `j` and `k`.
* **Updates**: `nums1 = [1, 2, 3, 4]`. `j = -1`, `k = 0`.
* **Next**: Loop terminates as `j` is out of bounds. Returns `nums1 = [1, 2, 3, 4]` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
    // ==========================================
    // 1st Approach: Auxiliary Array Front-to-Back (O(M) Space)
    // ==========================================
    /*
    const nums1Copy = nums1.slice(0, m);
    let i = 0, j = 0, k = 0;
    while (i < m && j < n) {
        if (nums1Copy[i] <= nums2[j]) {
            nums1[k++] = nums1Copy[i++];
        } else {
            nums1[k++] = nums2[j++];
        }
    }
    while (i < m) nums1[k++] = nums1Copy[i++];
    while (j < n) nums1[k++] = nums2[j++];
    */

    // ==========================================
    // 2nd Approach: Three-Pointer Backwards Merge (Optimal)
    // ==========================================
    let i = m - 1;         // Index of last active element in nums1
    let j = n - 1;         // Index of last element in nums2
    let k = m + n - 1;     // Index of last insertion slot in nums1

    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) {
            nums1[k] = nums1[i];
            i--;
        } else {
            nums1[k] = nums2[j];
            j--;
        }
        k--;
    }

    // If there are remaining elements in nums2, copy them
    while (j >= 0) {
        nums1[k] = nums2[j];
        j--;
        k--;
    }
    // Note: If i >= 0, they are already in their correct places in nums1!
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Auxiliary Copy | Approach 2: Backwards Merge |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(M + N)$** — Single pass over active elements. | **$O(M + N)$** — Single pass over active elements. |
| **Space Complexity** | **$O(M)$** — Allocates duplicate copy of nums1. | **$O(1)$** — Constant in-place memory. |

#### Edge Cases Handled:
* **nums1 empty (m = 0)**: Pointers adjust, all elements from `nums2` are successfully copied into `nums1`.
* **nums2 empty (n = 0)**: Loop doesn't execute; `nums1` remains unchanged (Correct).
