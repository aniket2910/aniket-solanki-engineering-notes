# 002. Inversion of Array (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Flipkart, Microsoft
>
> **Interview Tag**: 🔥 **DIVIDE AND CONQUER COUNTING** - Advanced application of Merge Sort. Essential for understanding how sorting algorithms can calculate relationships between array element indices.

---

### 📝 1. Problem Statement
Given an array of integers `arr`, return the **Inversion Count** in the array. 

Two elements `arr[i]` and `arr[j]` form an inversion if `arr[i] > arr[j]` and `i < j`. An inversion count indicates how far the array is from being sorted. A sorted array has `0` inversions.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `arr = [2, 4, 1, 3, 5]`
* **Output**: `3`
* **Why**: The three inversions are `(2, 1)`, `(4, 1)`, and `(4, 3)`. All satisfying `i < j` and `arr[i] > arr[j]`.

#### Test Case 2
* **Input**: `arr = [1, 2, 3]`
* **Output**: `0`
* **Why**: The array is already sorted, so no pairs satisfy the inversion condition.

---

### 💬 3. What is This Problem Actually Asking?
We need to count how many pairs of elements in the array are "out of order".

---

### 🌍 4. Real-Life Example
Think of ranking music tracks. If your favorite songs list has Song 4 listed before Song 1, they are out of order. An inversion count measures the layout discordance. A score of 0 means perfect alignment with chronological order.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing how to optimize a quadratic comparison count:

#### Approach 1: Brute Force (Nested Loops)
We compare every pair of indices `i` and `j` where `i < j`. If `arr[i] > arr[j]`, increment our count.
* **Pros**: Simple to understand, constant space.
* **Cons**: Extremely slow ($O(N^2)$), causing TLE on array lengths over $10^4$.

#### Approach 2: Merge Sort Divide & Conquer (Optimal)
We recursively split the array into halves. While merging two sorted halves `left` and `right` using two pointers `i` and `j`:
* If `left[i] > right[j]`, then since the `left` array is already sorted, **all remaining elements in `left` starting from index `i` up to the end must also be greater than `right[j]`**.
* We can add these `(mid - i + 1)` inversions to our count instantly!
* **Pros**: Highly efficient $O(N \log N)$ runtime.
* **Cons**: Requires additional $O(N)$ space for the merge buffer.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `arr = [2, 4, 1]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `count = 0`, `left = [2, 4]`, `right = [1]`.

#### **Step 1: Merging [2, 4] and [1]**
```text
Left:  [  2,   4  ]  (idx 0 to 1, mid = 0)
          ▲
          i (idx 0)
Right: [  1  ]       (idx 2)
          ▲
          j (idx 2)
```
* **State check**: `arr[i] (2) > arr[j] (1)`.
* **Updates**: Inversion count increases by `(mid - i + 1) = (0 - 0 + 1) = 1` count. We push `1` into our sorted array temp buffer. `j` incremented.
* **Next**: `j` is now out of bounds. Copy remaining elements from `left` array.

#### **Step 2: Copying Suffix**
```text
Buffer: [ 1 ] -> Copy remaining left elements [2, 4]
Sorted: [ 1, 2, 4 ]
```
* **State check**: `i` pointers copied.
* **Updates**: Total inversion count accumulates `1` (plus any inversions counted from recursive splits, which was `1` from sorting `[2, 4]` (since `2 > 4` is false, but wait, recursive splits yielded `0` for `[2, 4]`, and `1` inversion here. Wait, let's verify if `[2, 4]` has any inversions: `2 < 4` so `0`. Thus total inversions for `[2, 4, 1]` is `2` (the pairs are `(2,1)` and `(4,1)`).
* **Next**: Merging completes. Returns `2`.

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function countInversions(arr: number[]): number {
    // ==========================================
    // 1st Approach: Brute Force Nested Loops (O(N^2))
    // ==========================================
    /*
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
                count++;
            }
        }
    }
    return count;
    */

    // ==========================================
    // 2nd Approach: Merge Sort Divide & Conquer (Optimal)
    // ==========================================
    const temp = new Array(arr.length);
    return mergeSortAndCount(arr, temp, 0, arr.length - 1);
}

function mergeSortAndCount(arr: number[], temp: number[], left: number, right: number): number {
    let count = 0;
    if (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        count += mergeSortAndCount(arr, temp, left, mid);
        count += mergeSortAndCount(arr, temp, mid + 1, right);
        count += mergeAndCount(arr, temp, left, mid, right);
    }
    return count;
}

function mergeAndCount(arr: number[], temp: number[], left: number, mid: number, right: number): number {
    let i = left;
    let j = mid + 1;
    let k = left;
    let count = 0;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
            // All elements in left array from current pointer 'i' to 'mid' are inversions
            count += (mid - i + 1);
        }
    }

    // Copy remaining elements
    while (i <= mid) {
        temp[k++] = arr[i++];
    }
    while (j <= right) {
        temp[k++] = arr[j++];
    }

    // Copy back to original array
    for (i = left; i <= right; i++) {
        arr[i] = temp[i];
    }

    return count;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Brute Force | Approach 2: Merge Sort Count |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N^2)$** — Nested index pair checking. | **$O(N \log N)$** — Recurrent dividing and linear merging. |
| **Space Complexity** | **$O(1)$** — Constant variables. | **$O(N)$** — Aux array for merging. |

#### Edge Cases Handled:
* **Single Element Array** (`arr = [5]`): Returns `0` (Correct).
* **Sorted Array** (`arr = [1, 2, 3]`): No inversions triggered, returns `0` (Correct).
* **Strictly Decreasing Array** (`arr = [3, 2, 1]`): All pairs are inverted, returns $N(N-1)/2 = 3(2)/2 = 3$ (Correct).
