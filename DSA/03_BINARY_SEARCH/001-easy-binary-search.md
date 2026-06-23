# 001. Binary Search (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon, Microsoft


---

### 📝 1. Problem Statement
Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.

You must write an algorithm with **$O(\log N)$** runtime complexity.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [-1,0,3,5,9,12]`, `target = 9`
* **Output**: `4`
* **Why**: `9` exists in `nums` and its index is `4`.

#### Test Case 2
* **Input**: `nums = [-1,0,3,5,9,12]`, `target = 2`
* **Output**: `-1`
* **Why**: `2` does not exist in `nums` so we return `-1`.

---

### 💬 3. What is This Problem Actually Asking?
We need to find the position of a specific target number inside an array that is **already sorted** in ascending order. 

* The key constraint is **$O(\log N)$ time complexity**.
* This means we are **not** allowed to scan the array element-by-element from left to right (which takes linear $O(N)$ time).
* Instead, in every single step, we must look at the middle element, compare it to our target, and discard exactly half of the remaining numbers.

---

### 🌍 4. Real-Life Example
Think of searching for a name in a physical **telephone book** or a word in a **printed dictionary**:
* You don't flip through page 1, page 2, page 3.
* Instead, you open the book exactly in the middle.
* If the name you are looking for comes alphabetically *after* the page you opened, you discard the entire first half of the book. 
* You repeat this halving process on the remaining second half until you land on the correct page.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Sorted Array**.
  * *Why*: The array is sorted and supports constant-time $O(1)$ random indexing, allowing us to instantly jump to the middle index (`mid`).
* **Algorithm**: **Binary Search (Two-Pointer Divide & Conquer)**.
  * *Why*: The sorted nature of the data allows us to guarantee that all elements to the left of `mid` are smaller than `nums[mid]`, and all elements to the right are larger. This permits halving the search space in $O(1)$ decisions.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace the binary search boundaries `left` and `right` halving the search space step-by-step:

Input: `nums = [-1, 0, 3, 5, 9, 12]`, `target = 9`

#### **Step 0: Initial State**
```text
Pointers: left = 0, right = 5
Array:    [ -1,  0,  3,  5,  9, 12 ]
           idx0 idx1 idx2 idx3 idx4 idx5
Pointers:   ▲                    ▲
          left                 right
```

#### **Step 1: First Iteration**
* **Pointers**: `left = 0`, `right = 5`
* **Calculate mid**:
  ```text
  mid = 0 + Math.floor((5 - 0) / 2) = 2
  ```
* **Visual State**:
  ```text
  Array:    [ -1,  0,  3,  5,  9, 12 ]
             idx0 idx1 idx2 idx3 idx4 idx5
  Pointers:   ▲        ▲        ▲
            left      mid     right
  ```
* **Comparison**: `nums[mid]` ($3$) `< target` ($9$) $\rightarrow$ **True**.
* **Decision**: Target must be in the right half. Discard the left half.
* **Update left**: `left = mid + 1` (becomes 3).

---

#### **Step 2: Second Iteration**
* **Pointers**: `left = 3`, `right = 5`
* **Calculate mid**:
  ```text
  mid = 3 + Math.floor((5 - 3) / 2) = 4
  ```
* **Visual State**:
  ```text
  Array:    [ -1,  0,  3,  5,  9, 12 ]
             idx0 idx1 idx2 idx3 idx4 idx5
  Pointers:                  ▲    ▲    ▲
                           left  mid right
  ```
* **Comparison**: `nums[mid]` ($9$) `=== target` ($9$) $\rightarrow$ **True!**
* **Decision**: Target found at index `4`!
* **Return**: **`4`**.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function search(nums: number[], target: number): number {
    let left: number = 0;
    let right: number = nums.length - 1;

    while (left <= right) {
        // Calculate the middle index.
        // Math.floor((right - left) / 2) prevents potential 32-bit integer overflow 
        // that can happen with (left + right) / 2 if both pointers are huge numbers.
        const mid: number = left + Math.floor((right - left) / 2);

        if (nums[mid] === target) {
            return mid; // Target found, return index
        } else if (nums[mid] < target) {
            // Target is in the right half; discard left half
            left = mid + 1;
        } else {
            // Target is in the left half; discard right half
            right = mid - 1;
        }
    }

    return -1; // Target not found
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(\log N)$** — The search range is divided in half during every loop iteration. For an array of size $1,000,000$, it will take at most $\approx 20$ comparisons.
* **Space Complexity**: **$O(1)$** — We only allocate a few scalar pointer variables (`left`, `right`, `mid`) regardless of the array's size.

#### Edge Cases Handled:
* **Single Element Array** (`nums = [5]`, `target = 5`):
  * `left = 0`, `right = 0`. Loop runs once because `left <= right` ($0 \le 0$).
  * `mid = 0`. `nums[0] === 5` matches target. Returns `0` (Correct).
* **Target Smaller than Minimum** (`nums = [3, 5]`, `target = 1`):
  * Loop keeps shrinking `right` pointer (`right = mid - 1`). Eventually, `right` becomes negative. Loop exits. Returns `-1` (Correct).
* **Integer Overflow Avoidance**: By using `left + Math.floor((right - left) / 2)` instead of `Math.floor((left + right) / 2)`, the code is bulletproof even for array sizes near $2^{31} - 1$.
