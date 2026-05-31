# 023. 3Sum (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **SORTED TWO-POINTER CLAMP** - High-frequency interview classic. Essential for mastering duplicates deduplication, boundary clamping, and index coordination.

---

### 📝 1. Problem Statement
Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.

Notice that the solution set must not contain duplicate triplets.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [-1,0,1,2,-1,-4]`
* **Output**: `[[-1,-1,2],[-1,0,1]]`
* **Why**: The unique triplets that sum to 0 are `[-1,-1,2]` and `[-1,0,1]`.

#### Test Case 2
* **Input**: `nums = [0,1,1]`
* **Output**: `[]`
* **Why**: No three elements sum to 0.

---

### 💬 3. What is This Problem Actually Asking?
Find all unique sets of three numbers in the array that add up to `0`. We must make sure no duplicate triplets are included.

---

### 🌍 4. Real-Life Example
Imagine choosing three products from a catalogue whose prices combine to zero out a promotion credit of exactly $100$ (target). You sort all products by price, fix the first choice, and then use two boundary pointers to find perfect product complements.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing how sorting simplifies duplicate prevention:

#### Approach 1: Brute Force with Set Deduplication
We try all combinations using three nested loops, sort triplets to maintain consistent order, and use a set to filter out duplicate lists.
* **Pros**: Simple conceptual model.
* **Cons**: Incredibly slow ($O(N^3)$), causing TLE on larger inputs.

#### Approach 2: Sorting with Nested Loop & Two-Pointer Squeeze (Optimal)
We sort the array first.
* We loop $i$ from $0$ to $n - 1$.
* If `nums[i] === nums[i-1]`, we skip to avoid duplicates.
* We set `left = i + 1` and `right = nums.length - 1` and squeeze them together:
  * If `sum === 0`, push to results, and shift both `left` and `right` past duplicates.
  * If `sum < 0`, `left++` (increases sum).
  * If `sum > 0`, `right--` (decreases sum).
* **Pros**: Optimal $O(N^2)$ runtime, constant $O(1)$ space.
* **Cons**: None.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with sorted `nums = [-2, -1, 0, 1, 1]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `i = 0 (val = -2)`, `left = 1 (val = -1)`, `right = 4 (val = 1)`

#### **Step 1: Check Sum (i = 0, left = 1, right = 4)**
```text
nums: [ -2,  -1,   0,   1,   1 ]
        idx0 idx1 idx2 idx3 idx4
Ptrs:    ▲    ▲              ▲
         i   left          right
```
* **State check**: `sum = -2 + (-1) + 1 = -2`. `sum (-2) < 0`.
* **Updates**: Increment `left` to 2.
* **Next**: `left = 2`, `right = 4`.

#### **Step 2: Check Sum (i = 0, left = 2, right = 4) - Match!**
```text
nums: [ -2,  -1,   0,   1,   1 ]
        idx0 idx1 idx2 idx3 idx4
Ptrs:    ▲         ▲         ▲
         i        left     right
```
* **State check**: `sum = -2 + 0 + 1 = -1 < 0`. Increment `left` to 3.

#### **Step 3: Check Sum (i = 1 (val = -1), left = 2, right = 4) - Match!**
```text
nums: [ -2,  -1,   0,   1,   1 ]
        idx0 idx1 idx2 idx3 idx4
Ptrs:         ▲    ▲         ▲
              i   left     right
```
* **State check**: `sum = -1 + 0 + 1 = 0`.
* **Updates**: Match! Push `[-1, 0, 1]` to results. Skip duplicates for `left/right`. Returns match list.

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function threeSum(nums: number[]): number[][] {
    // ==========================================
    // 1st Approach: Brute Force Triplets (O(N^3))
    // ==========================================
    /*
    const result: number[][] = [];
    const n = nums.length;
    const uniqueTriplets = new Set<string>();
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            for (let k = j + 1; k < n; k++) {
                if (nums[i] + nums[j] + nums[k] === 0) {
                    const triplet = [nums[i], nums[j], nums[k]].sort((a,b)=>a-b);
                    const key = triplet.join(',');
                    if (!uniqueTriplets.has(key)) {
                        uniqueTriplets.add(key);
                        result.push(triplet);
                    }
                }
            }
        }
    }
    return result;
    */

    // ==========================================
    // 2nd Approach: Sorted Two-Pointer Squeeze (Optimal)
    // ==========================================
    const result: number[][] = [];
    nums.sort((a, b) => a - b);

    for (let i = 0; i < nums.length - 2; i++) {
        // Skip duplicate elements for outer loop pointer 'i'
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        let left = i + 1;
        let right = nums.length - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];

            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);

                // Skip duplicate elements for left and right pointers
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;

                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
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
| **Time Complexity** | **$O(N^3)$** — Triple nested iteration loop. | **$O(N^2)$** — Outer loop with inner two-pointer scan. |
| **Space Complexity** | **$O(	ext{triplets})$** — Storage for combinations. | **$O(1)$** — Constant auxiliary memory. |

#### Edge Cases Handled:
* **All Zeroes** (`[0, 0, 0, 0]`): Deduplication correctly outputs a single `[[0, 0, 0]]` (Correct).
