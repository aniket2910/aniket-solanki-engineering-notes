# 001. Two Sum II - Input Array Is Sorted (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Google, Microsoft, Adobe
>
> **Interview Tag**: 🔥 **SORTED TWO-POINTER SQUEEZE** - Core template for boundary clamping on sorted datasets. Links directly to the [Two-Pointer Blueprint](../ALGORITHMS/two-pointers.md).

---

### 📝 1. Problem Statement
Given a **1-indexed** array of integers `numbers` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific `target` number. 

Return the indices of the two numbers, `index1` and `index2`, added by one as an integer array `[index1, index2]` of length 2.

The tests are generated such that there is **exactly one solution**. You may not use the same element twice. Your solution must use only **constant extra space**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `numbers = [2,7,11,15]`, `target = 9`
* **Output**: `[1,2]`
* **Why**: The sum of 2 and 7 is 9. Therefore, `index1 = 1`, `index2 = 2`. We return `[1, 2]`.

#### Test Case 2
* **Input**: `numbers = [2,3,4]`, `target = 6`
* **Output**: `[1,3]`
* **Why**: The sum of 2 and 4 is 6. Therefore, `index1 = 1`, `index2 = 3`. We return `[1, 3]`.

---

### 💬 3. What is This Problem Actually Asking?
Find two distinct indices in a sorted array whose values sum to a given target, using $O(1)$ auxiliary space and 1-based indexing.

---

### 🌍 4. Real-Life Example
Imagine walking towards each other from two ends of a sorted row of weight plates. You want to pick exactly two plates that combine to a total target weight. If the combined weight is too heavy, you tell the person at the heavy end to step down to the next lighter plate. If it's too light, you step up to a heavier plate.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Binary Search
Iterate through each element, calculate its complement (`target - numbers[i]`), and use Binary Search to look for that complement in the rest of the array.
* **Pros**: Simple to conceptualize if you know binary search.
* **Cons**: Time complexity is **$O(N \log N)$**, which is sub-optimal.

#### Approach 2: Opposite Ends Two-Pointer Squeeze (Optimal)
Initialize two pointers: `left` at the beginning ($0$) and `right` at the end (`numbers.length - 1`). Since the array is sorted, check the sum:
* If `sum === target`, return `[left + 1, right + 1]`.
* If `sum < target`, increment `left` to increase the sum.
* If `sum > target`, decrement `right` to decrease the sum.
* **Pros**: Optimal **$O(N)$** time complexity, **$O(1)$** auxiliary space.
* **Cons**: Requires sorted input (which is given here).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with `numbers = [2, 7, 11, 15]` and `target = 9`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `left = 0`, `right = 3`

#### **Step 1: Check Sum (left = 0, right = 3)**
```text
Pointers: left = 0, right = 3
Array:    [  2,   7,  11,  15  ]
           idx0 idx1 idx2 idx3
Pointers:    ▲              ▲
           left           right
```
* **State check**: `numbers[left] + numbers[right] = 2 + 15 = 17`. `17 > 9` (too large).
* **Updates**: Decrement `right` pointer.
* **Next**: `left = 0`, `right = 2`.

#### **Step 2: Check Sum (left = 0, right = 2)**
```text
Pointers: left = 0, right = 2
Array:    [  2,   7,  11,  15  ]
           idx0 idx1 idx2 idx3
Pointers:    ▲         ▲
           left      right
```
* **State check**: `numbers[left] + numbers[right] = 2 + 11 = 13`. `13 > 9` (too large).
* **Updates**: Decrement `right` pointer.
* **Next**: `left = 0`, `right = 1`.

#### **Step 3: Check Sum (left = 0, right = 1) - Match!**
```text
Pointers: left = 0, right = 1
Array:    [  2,   7,  11,  15  ]
           idx0 idx1 idx2 idx3
Pointers:    ▲    ▲
           left right
```
* **State check**: `numbers[left] + numbers[right] = 2 + 7 = 9`. `9 === 9` (Match).
* **Updates**: Return `[left + 1, right + 1] = [1, 2]`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function twoSum(numbers: number[], target: number): number[] {
    // ==========================================
    // 1st Approach: Binary Search (O(N log N))
    // ==========================================
    /*
    for (let i = 0; i < numbers.length; i++) {
        const complement = target - numbers[i];
        let low = i + 1;
        let high = numbers.length - 1;
        while (low <= high) {
            const mid = Math.floor(low + (high - low) / 2);
            if (numbers[mid] === complement) {
                return [i + 1, mid + 1];
            } else if (numbers[mid] < complement) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
    }
    return [];
    */

    // ==========================================
    // 2nd Approach: Two-Pointer Squeeze (Optimal)
    // ==========================================
    let left = 0;
    let right = numbers.length - 1;

    while (left < right) {
        const sum = numbers[left] + numbers[right];

        if (sum === target) {
            return [left + 1, right + 1];
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

| Metric | Approach 1: Binary Search | Approach 2: Two-Pointer Squeeze |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N \log N)$** — Linear scan with log-N search. | **$O(N)$** — Single pass scanning inward. |
| **Space Complexity** | **$O(1)$** — Constant space. | **$O(1)$** — Constant space. |

#### Edge Cases Handled:
* **Negative Numbers** (`[-5, -3, -1, 0]`, target `-4`): Pointers shift correctly since numbers increment monotonically.
* **Minimum length 2**: Pointers start at indices 0 and 1, immediately evaluating the first candidate.
