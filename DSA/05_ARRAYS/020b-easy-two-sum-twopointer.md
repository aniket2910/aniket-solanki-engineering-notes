# 020b. Two Sum (Sorted Two-Pointer) (Easy)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **SORTED TWO-POINTER SCAN** - Classical binary partition scan. Tests sorting element indices, tracking original positions, and squeezing boundaries.

---

### 📝 1. Problem Statement
Given an array of integers `nums` and an integer `target`, return *indices of the two numbers such that they add up to `target`*.

You may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [2,7,11,15]`, `target = 9`
* **Output**: `[0,1]`
* **Why**: $2 + 7 = 9$.

---

### 💬 3. What is This Problem Actually Asking?
We need to find two numbers that sum to target. Instead of hash maps, we can sort the array and use two pointers to converge on the target sum.

---

### 🌍 4. Real-Life Example
Imagine a sliding ruler with numbers on both ends. You want to adjust the left slider and right slider until the sum of the numbers they point to is exactly `9`. If the current sum is too small, you slide the left boundary rightward. If the sum is too large, you slide the right boundary leftward.

---

### 🛠️ 5. Data Structure & Algorithms Used

We contrast sorted boundaries vs hash mapping:

#### Approach 1: Hash Map complement lookup
We cache values in a set to achieve linear space.
* **Pros**: Simple, does not require sorting original indices.
* **Cons**: Allocates $O(N)$ space.

#### Approach 2: Sort and Two-Pointer Squeeze (Optimal for space)
Because sorting changes indices, we create a list of tuples `{ value, originalIndex }` and sort them by value.
* We place two pointers: `left = 0` (smallest value) and `right = nums.length - 1` (largest value).
* While `left < right`:
  * If `sum === target`, return `[left.originalIndex, right.originalIndex]`.
  * If `sum < target`, increment `left++` (increases sum).
  * If `sum > target`, decrement `right--` (decreases sum).
* **Pros**: Clean logical convergence, constant space if we can mutate the array (or $O(N)$ space for indexing).
* **Cons**: Sorting adds $O(N \log N)$ runtime.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with sorted `nums = [2, 7, 11, 15]`, `target = 9`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `left = 0`, `right = 3`, `target = 9`

#### **Step 1: Compare sum (left = 0, right = 3)**
```text
Array: [  2,   7,  11,  15  ]
        idx0 idx1 idx2 idx3
Pointers: ▲              ▲
        left           right
```
* **State check**: `sum = nums[left] + nums[right] = 2 + 15 = 17`.
* **Updates**: Since `sum (17) > target (9)`, decrement `right` to 2.
* **Next**: `left = 0`, `right = 2`.

#### **Step 2: Compare sum (left = 0, right = 2)**
```text
Array: [  2,   7,  11,  15  ]
        idx0 idx1 idx2 idx3
Pointers: ▲         ▲
        left      right
```
* **State check**: `sum = 2 + 11 = 13`.
* **Updates**: Since `sum (13) > target (9)`, decrement `right` to 1.
* **Next**: `left = 0`, `right = 1`.

#### **Step 3: Compare sum (left = 0, right = 1) - Match!**
```text
Array: [  2,   7,  11,  15  ]
        idx0 idx1 idx2 idx3
Pointers: ▲    ▲
        left right
```
* **State check**: `sum = 2 + 7 = 9`.
* **Result**: Matches target. Returns original indices `[0, 1]` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
interface NumWithIndex {
    val: number;
    idx: number;
}

function twoSum(nums: number[], target: number): number[] {
    // ==========================================
    // 1st Approach: Hash Map Lookup (O(N) Time)
    // ==========================================
    /*
    const numMap = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (numMap.has(comp)) return [numMap.get(comp)!, i];
        numMap.set(nums[i], i);
    }
    return [];
    */

    // ==========================================
    // 2nd Approach: Sort and Two-Pointer Squeeze (Optimal in concept)
    // ==========================================
    const indexedNums: NumWithIndex[] = nums.map((val, idx) => ({ val, idx }));

    // Sort by values
    indexedNums.sort((a, b) => a.val - b.val);

    let left = 0;
    let right = indexedNums.length - 1;

    while (left < right) {
        const sum = indexedNums[left].val + indexedNums[right].val;

        if (sum === target) {
            return [indexedNums[left].idx, indexedNums[right].idx];
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }

    return [];
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Hash Map Lookup | Approach 2: Two-Pointer Sort |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Single pass. | **$O(N \log N)$** — Dominating sorting phase. |
| **Space Complexity** | **$O(N)$** — Aux set tracking. | **$O(N)$** — Storage for original index mapping list. |

#### Edge Cases Handled:
* **Target matches elements at boundaries** (`nums = [2, 15], target = 17`): Correctly resolves immediately on first iteration.
