# 019. Reverse Pairs (Hard)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon
>
> **Interview Tag**: 🔥 **MODIFIED MERGE SORT** - Hard classic array problem. Essential for mastering index relations counting and split-and-conquer recurrences.

---

### 📝 1. Problem Statement
Given an integer array `nums`, return *the number of reverse pairs in the array*.

A reverse pair is a pair `(i, j)` where:
1.  `0 <= i < j < nums.length` and
2.  `nums[i] > 2 * nums[j]`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1,3,2,3,1]`
* **Output**: `2`
* **Why**: The two reverse pairs are `(1, 4)` since `nums[1] (3) > 2 * nums[4] (2)` and `(3, 4)` since `nums[3] (3) > 2 * nums[4] (2)`.

#### Test Case 2
* **Input**: `nums = [2,4,3,5,1]`
* **Output**: `3`
* **Why**: The reverse pairs are `(1, 4)` (`4 > 2`), `(2, 4)` (`3 > 2`), and `(3, 4)` (`5 > 2`).

---

### 💬 3. What is This Problem Actually Asking?
We need to count how many pairs of indices `i` and `j` satisfy the relation `nums[i] > 2 * nums[j]` where $i$ appears before $j$.

---

### 🌍 4. Real-Life Example
Imagine auditing product transactions. You want to identify instances where an early transaction price is more than double the price of a later transaction. This measures sudden market drops. We count these drop points across chronological stages.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing how merge divisions accelerate comparisons:

#### Approach 1: Brute Force (Nested Loops)
We check every index pair `i` and `j` where `i < j`, and increment our count if `nums[i] > 2 * nums[j]`.
* **Pros**: Simple to write.
* **Cons**: Incredibly slow ($O(N^2)$), causing TLE on array lengths over $5 \cdot 10^3$.

#### Approach 2: Modified Merge Sort (Optimal)
Just like Inversion Count, we leverage the **Merge Sort** partition tree.
* When we split an array into sorted halves `left` and `right`:
  * We can count pairs **before** merging.
  * For each element in `left` at index `i`, we find how many elements in `right` at index `j` satisfy `left[i] > 2 * right[j]`.
  * Since both halves are sorted, as we increase `i`, the pointer `j` in the right array **will only move forward** (monotonically). We can count all valid elements in $O(M + N)$ total steps!
* **Pros**: Highly efficient $O(N \log N)$ runtime.
* **Cons**: Requires $O(N)$ space for the merge buffer.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `left = [3, 4]`, `right = [1]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `count = 0`, `i = 0`, `j = 0`, `mid = 1`

#### **Step 1: Check pairs**
```text
Left:  [  3,   4  ]  (idx 0 to 1)
          ▲
          i (idx 0)
Right: [  1  ]       (idx 2)
          ▲
          j (idx 0)
```
* **State check**: `left[i] (3) > 2 * right[j] (2)`? Yes!
* **Action**: Increment `j` to 1. `count` accumulates `j - 0 = 1`.
* **Next**: `i` increments to 1.

#### **Step 2: Check next element**
```text
Left:  [  3,   4  ]
               ▲
               i (idx 1)
Right: [  1  ]
               ▲
               j (idx 1)
```
* **State check**: `left[i] (4) > 2 * right[j] (2)`? No (4 is not > 2 * undef).
* **Updates**: `count` accumulates `j = 1` (total count becomes 2).
* **Result**: Returns `2` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function reversePairs(nums: number[]): number {
    // ==========================================
    // 1st Approach: Brute Force Pairs (O(N^2))
    // ==========================================
    /*
    let count = 0;
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] > 2 * nums[j]) count++;
        }
    }
    return count;
    */

    // ==========================================
    // 2nd Approach: Modified Merge Sort (Optimal)
    // ==========================================
    return mergeSortAndCount(nums, 0, nums.length - 1);
}

function mergeSortAndCount(nums: number[], left: number, right: number): number {
    if (left >= right) return 0;
    const mid = left + Math.floor((right - left) / 2);
    let count = 0;

    count += mergeSortAndCount(nums, left, mid);
    count += mergeSortAndCount(nums, mid + 1, right);
    count += countPairs(nums, left, mid, right);
    merge(nums, left, mid, right);

    return count;
}

function countPairs(nums: number[], left: number, mid: number, right: number): number {
    let count = 0;
    let j = mid + 1;

    for (let i = left; i <= mid; i++) {
        while (j <= right && nums[i] > 2 * nums[j]) {
            j++;
        }
        count += (j - (mid + 1));
    }
    return count;
}

function merge(nums: number[], left: number, mid: number, right: number): void {
    const temp: number[] = [];
    let i = left;
    let j = mid + 1;

    while (i <= mid && j <= right) {
        if (nums[i] <= nums[j]) {
            temp.push(nums[i++]);
        } else {
            temp.push(nums[j++]);
        }
    }

    while (i <= mid) temp.push(nums[i++]);
    while (j <= right) temp.push(nums[j++]);

    for (let k = left; k <= right; k++) {
        nums[k] = temp[k - left];
    }
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Brute Force | Approach 2: Modified Merge |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N^2)$** — Double nested index checking. | **$O(N \log N)$** — Recurrent dividing and linear merging. |
| **Space Complexity** | **$O(1)$** — Constant variables. | **$O(N)$** — Aux array for merging. |

#### Edge Cases Handled:
* **Array with huge numbers**: Floating calculations prevent JS/TS numeric overflows easily (Correct).
