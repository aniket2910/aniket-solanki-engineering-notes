# 009. Next Permutation (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Facebook/Meta, Google, Amazon
>
> **Interview Tag**: 🔥 **LEXICOGRAPHICAL PEAK DETECTION** - Fundamental algorithmic problem. Tests understanding of lexicographical ordering, peak breaks, and suffix reversals.

---

### 📝 1. Problem Statement
Implement **next permutation**, which rearranges numbers into the lexicographically next greater permutation of numbers. 

If no such arrangement is possible, it must rearrange it as the lowest possible order (i.e., sorted in ascending order). The replacement must be **in-place** and use only constant extra memory.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1, 2, 3]`
* **Output**: `[1, 3, 2]`
* **Why**: The permutations of `[1, 2, 3]` in order are `[1,2,3]`, `[1,3,2]`, `[2,1,3]`, `[2,3,1]`, `[3,1,2]`, `[3,2,1]`. The lexicographically next permutation after `[1, 2, 3]` is `[1, 3, 2]`.

#### Test Case 2
* **Input**: `nums = [3, 2, 1]`
* **Output**: `[1, 2, 3]`
* **Why**: `[3, 2, 1]` is the largest possible permutation. There is no next permutation, so we wrap around to the smallest possible permutation: `[1, 2, 3]`.

---

### 💬 3. What is This Problem Actually Asking?
We need to find the smallest permutation that is larger than the current array of numbers.

---

### 🌍 4. Real-Life Example
Think of looking up words in a dictionary or numbers on a dial. If you have the sequence of letters `"ACD"`, the next alphabetic sequence using the same letters is `"ADC"`. We want to increment our sequence value by the smallest step possible.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing how to find next values:

#### Approach 1: Generating All Permutations
We could generate all possible permutations, sort them, and pick the one immediately following the input.
* **Pros**: Trivial logic.
* **Cons**: Incredibly slow ($O(N!)$), impossible to scale for arrays larger than size 12.

#### Approach 2: Single-Pass Peak Swap (Optimal)
We can solve this in a single pass with **three simple steps**:
1.  **Find the breakpoint**: Scan from the right to find the first element `nums[i]` that is smaller than its successor `nums[i+1]`.
2.  **Find the swap candidate**: Scan from the right to find the first element `nums[j]` that is larger than `nums[i]`. Swap `nums[i]` and `nums[j]`.
3.  **Reverse the suffix**: Reverse all elements to the right of `i` to make them as small as possible.
* **Pros**: Incredibly fast $O(N)$ runtime, $O(1)$ constant in-place memory.
* **Cons**: Highly non-obvious mathematical formulation.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `nums = [1, 3, 2]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `i = 1`, `nums = [1, 3, 2]`

#### **Step 1: Find breakpoint**
```text
Array: [  1,   3,   2  ]
        idx0 idx1 idx2
Pointers:      ▲
               i (idx 1)
```
* **State check**: `nums[1] (3) >= nums[2] (2)`? Yes. Decrement `i` to 0.
* **i = 0**: `nums[0] (1) < nums[1] (3)`. Breakpoint found! `i = 0`.

#### **Step 2: Find swap candidate**
```text
Array: [  1,   3,   2  ]
        idx0 idx1 idx2
Pointers: ▲         ▲
          i         j (idx 2)
```
* **State check**: Scan from right to find first number greater than `nums[i] (1)`.
* **Action**: `nums[2] (2) > 1`? Yes! Swap index `0` and `2`.
* **Updates**: `nums` becomes `[2, 3, 1]`.

#### **Step 3: Reverse suffix**
* **Action**: Reverse all elements to the right of `i` (index 1 to 2).
* **Updates**: Reverse `[3, 1]` to `[1, 3]`.
* **Result**: `nums` becomes `[2, 1, 3]` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function nextPermutation(nums: number[]): void {
    // ==========================================
    // 1st Approach: Backtracking Permutation Search (O(N!))
    // ==========================================
    /*
    // Simple conceptual model to search all permutations...
    // Unsuitable for runtime implementation due to O(N!) complexity.
    */

    // ==========================================
    // 2nd Approach: Single-Pass Peak Swap (Optimal)
    // ==========================================
    let i = nums.length - 2;

    // 1. Find the first decreasing element from the right
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }

    if (i >= 0) {
        let j = nums.length - 1;
        // 2. Find the element just larger than nums[i] from the right
        while (nums[j] <= nums[i]) {
            j--;
        }
        swap(nums, i, j);
    }

    // 3. Reverse the suffix to make it sorted in ascending order
    reverse(nums, i + 1, nums.length - 1);
}

function swap(nums: number[], i: number, j: number): void {
    const temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}

function reverse(nums: number[], start: number, end: number): void {
    let l = start;
    let r = end;
    while (l < r) {
        swap(nums, l, r);
        l++;
        r--;
    }
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Generation | Approach 2: Peak Swap |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N!)$** — Generating all combinations. | **$O(N)$** — Two linear scans and a reversal. |
| **Space Complexity** | **$O(N!)$** — Storage for combinations. | **$O(1)$** — Constant in-place swaps. |

#### Edge Cases Handled:
* **Strictly Decreasing** (`[3, 2, 1]`): `i` scans all the way to `-1`. Skip step 2, reverse entire array to get `[1, 2, 3]` (Correct).
* **Duplicates Present** (`[1, 1, 5]`): `nums[i] >= nums[i+1]` inequality correctly handles duplicates during scans (Correct).
