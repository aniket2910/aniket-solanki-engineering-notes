# 024. Trapping Rainwater (Hard)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon, Facebook/Meta, Microsoft, Goldman Sachs
>
> **Interview Tag**: 🔥 **TWO-POINTER CLAMP BOUNDARY** - Legendary hard array problem. Tests understanding of prefix/suffix dynamic boundaries and converging single-pass pointers.

---

### 📝 1. Problem Statement
Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `height = [0,1,0,2,1,0,1,3,2,1,2,1]`
* **Output**: `6`
* **Why**: The elevation map has 6 units of trapped water in the valleys.

#### Test Case 2
* **Input**: `height = [4,2,0,3,2,5]`
* **Output**: `9`
* **Why**: Valley between heights 4 and 5 traps 9 units of water.

---

### 💬 3. What is This Problem Actually Asking?
We need to find the total volume of water trapped in the valleys of an elevation map. At any column `i`, the water level is bounded by the **minimum of the tallest bars to its left and right**, minus the height of column `i` itself:
$$	ext{Water}[i] = \max(0, \min(	ext{leftMax}[i], 	ext{rightMax}[i]) - 	ext{height}[i])$$

---

### 🌍 4. Real-Life Example
Think of looking at the skyline of a city with buildings of varying heights. After a heavy rain, puddles form on building roofs or in gaps between buildings. The depth of a puddle at any point is determined by the height of the shorter building boundary on either side of the puddle.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing space optimization of boundary scans:

#### Approach 1: Auxiliary Prefix & Suffix Max Arrays
We allocate two arrays: `leftMax` of size $N$ (storing peak height from left to right) and `rightMax` of size $N$ (storing peak height from right to left). We then sum `min(leftMax[i], rightMax[i]) - height[i]`.
* **Pros**: Simple, easy-to-follow formula implementation.
* **Cons**: Requires $O(N)$ auxiliary memory space.

#### Approach 2: Converging Two Pointers (Optimal)
We maintain two pointers: `left = 0` and `right = height.length - 1`. We also track `leftMax = 0` and `rightMax = 0`.
* Whichever bar `height[left]` or `height[right]` is **smaller** dictates the water level!
* If `height[left] <= height[right]`:
  * If `height[left] >= leftMax`, update `leftMax`.
  * Otherwise, add `leftMax - height[left]` to our water total, and increment `left++`.
* Else:
  * If `height[right] >= rightMax`, update `rightMax`.
  * Otherwise, add `rightMax - height[right]` to our water total, and decrement `right--`.
* **Pros**: Fast, optimal $O(N)$ runtime, constant $O(1)$ space.
* **Cons**: Counter-intuitive logical convergence.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `height = [3, 0, 2]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `left = 0`, `right = 2`, `leftMax = 0`, `rightMax = 0`, `totalWater = 0`

#### **Step 1: Compare heights (left = 0, right = 2)**
```text
height: [  3,   0,   2  ]
         idx0 idx1 idx2
Ptrs:      ▲         ▲
         left      right
```
* **State check**: `height[left] (3) > height[right] (2)`. Process right side.
* **Action**: `height[right] (2) >= rightMax (0)`. Update `rightMax = 2`. Decrement `right` to 1.
* **Next**: `left = 0`, `right = 1`.

#### **Step 2: Compare heights (left = 0, right = 1)**
```text
height: [  3,   0,   2  ]
         idx0 idx1 idx2
Ptrs:      ▲    ▲
         left right
```
* **State check**: `height[left] (3) > height[right] (0)`. Process right side.
* **Action**: `height[right] (0) < rightMax (2)`.
* **Updates**: Add `rightMax - height[right] = 2 - 0 = 2` to `totalWater`. Decrement `right` to 0.
* **Next**: Pointers meet. Loop terminates. Returns `2` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function trap(height: number[]): number {
    // ==========================================
    // 1st Approach: Prefix/Suffix Max Arrays (O(N) Space)
    // ==========================================
    /*
    const n = height.length;
    if (n === 0) return 0;
    const leftMax = new Array(n).fill(0);
    const rightMax = new Array(n).fill(0);

    leftMax[0] = height[0];
    for (let i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], height[i]);

    rightMax[n - 1] = height[n - 1];
    for (let i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], height[i]);

    let water = 0;
    for (let i = 0; i < n; i++) {
        water += Math.min(leftMax[i], rightMax[i]) - height[i];
    }
    return water;
    */

    // ==========================================
    // 2nd Approach: Converging Two Pointers (Optimal)
    // ==========================================
    let left = 0;
    let right = height.length - 1;
    let leftMax = 0;
    let rightMax = 0;
    let totalWater = 0;

    while (left < right) {
        if (height[left] <= height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                totalWater += leftMax - height[left];
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                totalWater += rightMax - height[right];
            }
            right--;
        }
    }

    return totalWater;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Max Arrays | Approach 2: Two-Pointer |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Three linear scans. | **$O(N)$** — Single pass over array. |
| **Space Complexity** | **$O(N)$** — Allocates left/right max arrays. | **$O(1)$** — Constant variables, fully in-place. |

#### Edge Cases Handled:
* **Symmetrical Valley** (`[3, 0, 3]`): Correctly traps 3 units (Correct).
