# 011a. Sort an Array of 0's, 1's, and 2's (Dutch National Flag) (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **THREE-POINTER PARTITIONING** - Classical sorting constraint. Tests single-pass partition sorting without using standard library sort utilities.

---

### 📝 1. Problem Statement
Given an array `nums` with `n` objects colored red, white, or blue, sort them **in-place** so that objects of the same color are adjacent, with the colors in the order red, white, and blue.

We will use the integers `0`, `1`, and `2` to represent the color red, white, and blue, respectively. You must solve this **without** using the library's sort function.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [2, 0, 2, 1, 1, 0]`
* **Output**: `[0, 0, 1, 1, 2, 2]`
* **Why**: All 0s are grouped first, followed by 1s, and then 2s.

#### Test Case 2
* **Input**: `nums = [2, 0, 1]`
* **Output**: `[0, 1, 2]`
* **Why**: The colors are placed in ascending order.

---

### 💬 3. What is This Problem Actually Asking?
We need to sort an array containing only three distinct keys (`0`, `1`, `2`) in **one single pass** using constant $O(1)$ extra space.

---

### 🌍 4. Real-Life Example
Imagine a recycling facility with a conveyor belt carrying red, white, and blue plastic bottles. Instead of sorting them by storing them in huge separate bins and dumping them back, you have three mechanical arms:
* Arm 1 (`low`) pushes all red bottles (`0`) to the extreme left.
* Arm 2 (`mid`) checks the current bottle.
* Arm 3 (`high`) pushes all blue bottles (`2`) to the extreme right.
* White bottles (`1`) naturally settle in the middle!

---

### 🛠️ 5. Data Structure & Algorithms Used

We compare this single-pass partition method against a two-pass counting approach:

#### Approach 1: Counting Sort (Two-Pass)
We count the frequencies of `0`s, `1`s, and `2`s, then write them back sequentially.
* **Pros**: Simple, easy to code.
* **Cons**: Requires **two passes** over the array (one to count, one to write back).

#### Approach 2: Dutch National Flag Algorithm (Optimal)
> [!NOTE]
> For a detailed conceptual breakdown, mathematical proof, and visual explanation of this algorithm, refer to the [Dutch National Flag Blueprint](../ALGORITHMS/dutch-national-flag.md).

We maintain three pointers: `low` (boundary of `0`s), `mid` (current scan cursor), and `high` (boundary of `2`s).
* If `nums[mid] === 0`: Swap `nums[low]` and `nums[mid]`, increment `low++` and `mid++`.
* If `nums[mid] === 1`: Increment `mid++`.
* If `nums[mid] === 2`: Swap `nums[mid]` and `nums[high]`, decrement `high--` (do not increment `mid` since swapped element from `high` is uninspected).
* **Pros**: True **single-pass** $O(N)$ runtime, constant $O(1)$ space, in-place swaps.
* **Cons**: Tricky pointer logic regarding when to increment `mid`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `nums = [2, 0, 1]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `low = 0`, `mid = 0`, `high = 2`

#### **Step 1: mid = 0 (val = 2)**
```text
Pointers: low = 0, mid = 0, high = 2
Array:    [  2,   0,   1  ]
           idx0 idx1 idx2
Pointers:    ▲         ▲
          low/mid     high
```
* **State check**: `nums[mid] === 2`.
* **Action**: Swap `nums[mid]` and `nums[high]`. Decrement `high`.
* **Updates**: `nums` becomes `[1, 0, 2]`. `high` becomes `1`.
* **Next**: `mid` remains `0` to scan the newly swapped element.

#### **Step 2: mid = 0 (val = 1)**
```text
Pointers: low = 0, mid = 0, high = 1
Array:    [  1,   0,   2  ]
           idx0 idx1 idx2
Pointers:    ▲    ▲
          low/mid high
```
* **State check**: `nums[mid] === 1`.
* **Action**: Increment `mid`.
* **Updates**: `mid` becomes `1`.

#### **Step 3: mid = 1 (val = 0)**
```text
Pointers: low = 0, mid = 1, high = 1
Array:    [  1,   0,   2  ]
           idx0 idx1 idx2
Pointers:    ▲    ▲
            low mid/high
```
* **State check**: `nums[mid] === 0`.
* **Action**: Swap `nums[low]` and `nums[mid]`, increment `low++`, `mid++`.
* **Updates**: Swap index 0 and 1. `nums` becomes `[0, 1, 2]`. `low = 1`, `mid = 2`.
* **Next**: Loop terminates since `mid (2) > high (1)`.

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function sortColors(nums: number[]): void {
    // ==========================================
    // 1st Approach: Counting Sort (Two-Pass O(N))
    // ==========================================
    /*
    let count0 = 0, count1 = 0, count2 = 0;
    for (let num of nums) {
        if (num === 0) count0++;
        else if (num === 1) count1++;
        else count2++;
    }
    let idx = 0;
    while (count0--) nums[idx++] = 0;
    while (count1--) nums[idx++] = 1;
    while (count2--) nums[idx++] = 2;
    */

    // ==========================================
    // 2nd Approach: Dutch National Flag (Optimal)
    // ==========================================
    let low = 0;
    let mid = 0;
    let high = nums.length - 1;

    while (mid <= high) {
        if (nums[mid] === 0) {
            swap(nums, low, mid);
            low++;
            mid++;
        } else if (nums[mid] === 1) {
            mid++;
        } else {
            // nums[mid] === 2
            swap(nums, mid, high);
            high--;
            // Do NOT increment mid here as the swapped element needs inspection!
        }
    }
}

function swap(nums: number[], i: number, j: number): void {
    const temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Counting Sort | Approach 2: Dutch Flag |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Two full passes over the array. | **$O(N)$** — True single-pass over the array. |
| **Space Complexity** | **$O(1)$** — Fixed frequency storage variables. | **$O(1)$** — Constant in-place swaps. |

#### Edge Cases Handled:
* **All Identical Elements** (`[1, 1, 1]`): `mid` pointer simply scans and increments; no swaps occur (Correct).
* **Already Sorted** (`[0, 1, 2]`): Moves through positions with minimal swaps, correctly retaining ordering (Correct).
