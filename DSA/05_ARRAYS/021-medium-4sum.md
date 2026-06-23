# 021. 4Sum (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Google
>
> **Interview Tag**: 🔥 **MULTI-POINTER SQUEEZE** - Advanced expansion of two-pointer scans. Tests index deduplication, sorted array skips, and nested iteration boundaries.

---

### 📝 1. Problem Statement
Given an array `nums` of `n` integers, return *an array of all the **unique** quadruplets* `[nums[a], nums[b], nums[c], nums[d]]` such that:
1.  `0 <= a, b, c, d < n`
2.  `a`, `b`, `c`, and `d` are **distinct**.
3.  `nums[a] + nums[b] + nums[c] + nums[d] == target`.

You may return the answer in **any order**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1,0,-1,0,-2,2]`, `target = 0`
* **Output**: `[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]`
* **Why**: The quadruplets represent all unique groupings of four numbers that add up to `0`.

---

### 💬 3. What is This Problem Actually Asking?
We need to find all unique combinations of four numbers in an array that sum to `target`. We must ensure no duplicate quadruplets are returned.

---

### 🌍 4. Real-Life Example
Imagine choosing a team of four students to participate in a competition where the sum of their weight categories must be exactly `target` (e.g. `200 kg`). You sort the students by weight, fix the first student, fix the second student, and then use two sliders on the remaining students to find perfect combinations.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing how nesting reduces combinations:

#### Approach 1: Brute Force (4 Nested Loops)
We try all combinations using four nested loops, and use a set to filter out duplicate quadruplets.
* **Pros**: Simple code.
* **Cons**: Incredibly slow ($O(N^4)$), causing TLE on arrays larger than size 80.

#### Approach 2: Sorting with Nested Loops and Two-Pointer Squeeze (Optimal)
We sort the array first. This enables two crucial optimizations:
1.  **Deduplication**: We can easily skip duplicates by checking if `nums[i] === nums[i - 1]`.
2.  **Two-Pointer Convergence**: We fix two indices `i` and `j` (using two outer loops). We then place `left = j + 1` and `right = nums.length - 1` and squeeze them together to find remaining pairs matching `remainingTarget = target - nums[i] - nums[j]`.
* **Pros**: Highly optimized $O(N^3)$ runtime.
* **Cons**: Hard to manage all duplicate skip checks.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with sorted `nums = [-2, -1, 0, 1, 2]`, `target = 0`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `i = 0 (val = -2)`, `j = 1 (val = -1)`, `left = 2 (val = 0)`, `right = 4 (val = 2)`

#### **Step 1: Check Sum (i = 0, j = 1, left = 2, right = 4)**
```text
nums: [ -2,  -1,   0,   1,   2 ]
        idx0 idx1 idx2 idx3 idx4
Ptrs:    ▲    ▲    ▲         ▲
         i    j   left     right
```
* **State check**: `sum = -2 + (-1) + 0 + 2 = -1`. `sum (-1) < target (0)`.
* **Updates**: Sum is too small. Increment `left` to 3.
* **Next**: `left = 3`, `right = 4`.

#### **Step 2: Check Sum (i = 0, j = 1, left = 3, right = 4) - Match!**
```text
nums: [ -2,  -1,   0,   1,   2 ]
        idx0 idx1 idx2 idx3 idx4
Ptrs:    ▲    ▲         ▲    ▲
         i    j        left right
```
* **State check**: `sum = -2 + (-1) + 1 + 2 = 0`.
* **Updates**: Match! Push `[-2, -1, 1, 2]` to result. Increment `left` and decrement `right` to continue looking.
* **Result**: Quadruplet saved. Returns list of matches.

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function fourSum(nums: number[], target: number): number[][] {
    // ==========================================
    // 1st Approach: Brute Force Quadruplets (O(N^4))
    // ==========================================
    /*
    // Check all nested indexes i, j, k, l. Skip duplicates using Sets.
    // Extremely slow and unviable.
    */

    // ==========================================
    // 2nd Approach: Sorting with Two-Pointer Squeeze (Optimal)
    // ==========================================
    const result: number[][] = [];
    const n = nums.length;
    if (n < 4) return [];

    // 1. Sort the array
    nums.sort((a, b) => a - b);

    for (let i = 0; i < n - 3; i++) {
        // Skip duplicate values for pointer i
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        for (let j = i + 1; j < n - 2; j++) {
            // Skip duplicate values for pointer j
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;

            let left = j + 1;
            let right = n - 1;

            while (left < right) {
                const sum = nums[i] + nums[j] + nums[left] + nums[right];

                if (sum === target) {
                    result.push([nums[i], nums[j], nums[left], nums[right]]);

                    // Skip duplicates for left and right pointers
                    while (left < right && nums[left] === nums[left + 1]) left++;
                    while (left < right && nums[right] === nums[right - 1]) right--;

                    left++;
                    right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
    }

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Brute Force | Approach 2: Two-Pointer Squeeze |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N^4)$** — Four nested loops. | **$O(N^3)$** — Two outer loops with inner two-pointer scan. |
| **Space Complexity** | **$O(	ext{quadruplets})$** — Storage for combinations. | **$O(1)$** — Constant auxiliary memory. |

#### Edge Cases Handled:
* **Array smaller than 4 elements**: Handled by check boundary `n < 4`, returns empty array immediately (Correct).
