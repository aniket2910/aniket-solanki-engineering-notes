# 002. Container with Most Water (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon, Facebook/Meta, Microsoft, Adobe
>
> **Interview Tag**: 🔥 **OPPOSITE ENDS GREEDY HEIGHT SQUEEZE** - Classic greedy boundary contraction. Links directly to the [Two-Pointer Blueprint](../ALGORITHMS/two-pointers.md).

---

### 📝 1. Problem Statement
You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the $i^{\text{th}}$ line are `(i, 0)` and `(i, height[i])`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.

**Notice** that you may not slant the container.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `height = [1,8,6,2,5,4,8,3,7]`
* **Output**: `49`
* **Why**: The vertical lines are represented by array `[1,8,6,2,5,4,8,3,7]`. In this case, the max area of water the container can contain is between index 1 (height 8) and index 8 (height 7). The width is `8 - 1 = 7`, and the height is `min(8, 7) = 7`. The area is `7 * 7 = 49`.

#### Test Case 2
* **Input**: `height = [1,1]`
* **Output**: `1`
* **Why**: The width is `1 - 0 = 1`, and the height is `min(1, 1) = 1`. The area is `1 * 1 = 1`.

---

### 💬 3. What is This Problem Actually Asking?
Find two elements in an array such that their distance multiplied by the minimum of their heights is maximized.

---

### 🌍 4. Real-Life Example
Imagine choosing two vertical supports on a bridge to hang a banner between them. The banner's width is the distance between the supports, but its height is restricted by the shorter of the two supports. To get the maximum banner surface area, you start by picking the absolute leftmost and rightmost supports, and iteratively move inward from whichever support is shorter, hoping to find a taller one that offsets the loss in width.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Brute Force
Check every possible pair of lines and calculate the volume of water they can hold, updating the maximum found.
* **Pros**: Simple nested iteration.
* **Cons**: Time complexity is **$O(N^2)$**, leading to Time Limit Exceeded (TLE) for large inputs.

#### Approach 2: Opposite Ends Two-Pointer Squeeze (Optimal)
Initialize two pointers: `left = 0` and `right = height.length - 1`. 
* At each step, calculate the area: `area = (right - left) * Math.min(height[left], height[right])`.
* Update `maxArea`.
* Move the pointer pointing to the **shorter line** inward (e.g., if `height[left] < height[right]`, then `left++`, else `right--`). This is because moving the taller pointer inward can never increase the area, as the area is bounded by the shorter line, and the width is decreasing.
* **Pros**: Optimal **$O(N)$** time complexity, **$O(1)$** space.
* **Cons**: None.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with `height = [1, 8, 6, 2, 5, 4, 8, 3, 7]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `left = 0`, `right = 8`, `maxArea = 0`

#### **Step 1: Check Area (left = 0, right = 8)**
```text
Pointers: left = 0, right = 8
Array:    [  1,   8,   6,   2,   5,   4,   8,   3,   7  ]
           idx0 idx1 idx2 idx3 idx4 idx5 idx6 idx7 idx8
Pointers:    ▲                                        ▲
           left                                     right
```
* **State check**: `width = 8`, `h = min(1, 7) = 1`. `area = 8 * 1 = 8`. `maxArea = max(0, 8) = 8`.
* **Updates**: Since `height[left] (1) < height[right] (7)`, increment `left`.
* **Next**: `left = 1`, `right = 8`.

#### **Step 2: Check Area (left = 1, right = 8)**
```text
Pointers: left = 1, right = 8
Array:    [  1,   8,   6,   2,   5,   4,   8,   3,   7  ]
           idx0 idx1 idx2 idx3 idx4 idx5 idx6 idx7 idx8
Pointers:         ▲                                   ▲
                left                                right
```
* **State check**: `width = 7`, `h = min(8, 7) = 7`. `area = 7 * 7 = 49`. `maxArea = max(8, 49) = 49`.
* **Updates**: Since `height[left] (8) > height[right] (7)`, decrement `right`.
* **Next**: `left = 1`, `right = 7`.

#### **Step 3: Check Area (left = 1, right = 7)**
```text
Pointers: left = 1, right = 7
Array:    [  1,   8,   6,   2,   5,   4,   8,   3,   7  ]
           idx0 idx1 idx2 idx3 idx4 idx5 idx6 idx7 idx8
Pointers:         ▲                               ▲
                left                            right
```
* **State check**: `width = 6`, `h = min(8, 3) = 3`. `area = 6 * 3 = 18`. `maxArea = max(49, 18) = 49`.
* **Updates**: Since `height[left] (8) > height[right] (3)`, decrement `right`.
* **Next**: `left = 1`, `right = 6`.

... [Steps continue until pointers meet, keeping maxArea at 49]

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function maxArea(height: number[]): number {
    // ==========================================
    // 1st Approach: Brute Force Pairs (O(N^2))
    // ==========================================
    /*
    let maxVal = 0;
    const n = height.length;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const area = (j - i) * Math.min(height[i], height[j]);
            maxVal = Math.max(maxVal, area);
        }
    }
    return maxVal;
    */

    // ==========================================
    // 2nd Approach: Opposite Ends Squeeze (Optimal)
    // ==========================================
    let left = 0;
    let right = height.length - 1;
    let maxVal = 0;

    while (left < right) {
        const width = right - left;
        const currentHeight = Math.min(height[left], height[right]);
        const area = width * currentHeight;
        
        maxVal = Math.max(maxVal, area);

        // Shift the shorter boundary inward
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxVal;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Brute Force | Approach 2: Opposite Ends Squeeze |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N^2)$** — Nested iteration loops checking all pairs. | **$O(N)$** — Single pass converging pointers. |
| **Space Complexity** | **$O(1)$** — Constant memory space. | **$O(1)$** — Constant space. |

#### Edge Cases Handled:
* **Uniform Heights** (`[5, 5, 5, 5]`): Decrements/increments correctly reduce width step-by-step while testing outer boundary area limits first.
* **Large Heights at Extremes**: Max area is computed immediately in the first few steps without missing internal configurations.
