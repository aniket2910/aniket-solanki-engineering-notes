# 019. Largest Rectangle in Histogram (Hard)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **MUST SOLVE** - A legendary hard question. The ultimate test of your ability to identify boundary expansions using a monotonic stack.

---

### 📝 1. Problem Statement
Given an array of integers `heights` representing the histogram's bar height where the width of each bar is `1`, return *the area of the largest rectangle in the histogram*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `heights = [2, 1, 5, 6, 2, 3]`
* **Output**: `10`
* **Why**: The largest rectangle is formed by the bars `5` and `6` at index 2 and 3. The height of the rectangle is `5` and width is `2` (indices 2 and 3), yielding an area = `5 * 2 = 10`.

#### Test Case 2
* **Input**: `heights = [2, 4]`
* **Output**: `4`
* **Why**: The largest rectangle is either bar `4` (area = `4 * 1 = 4`) or both bars using height `2` (area = `2 * 2 = 4`).

---

### 💬 3. What is This Problem Actually Asking?
For each bar in the histogram, we want to know how far we can expand a rectangle of that bar's height to the left and right.
A rectangle of height `H` at index `i` can expand leftward until we hit a bar **strictly shorter** than `H`, and rightward until we hit a bar **strictly shorter** than `H`.
Thus, we need to find the **first smaller element on the left** and the **first smaller element on the right** for every bar. Doing this with nested loops takes $O(N^2)$ time. A monotonic stack resolves it in $O(N)$ time.

---

### 🌍 4. Real-Life Example
Think of **installing a large horizontal billboard** in a city alleyway:
* You have a row of buildings of different heights.
* You want to hang a rectangular banner that is anchored flat against the buildings.
* If you choose a height of 50 meters, the banner can span across adjacent buildings that are at least 50 meters tall.
* The moment you hit a building that is shorter than 50 meters, the banner is blocked and cannot extend further.

---

### 🛠️ 5. Data Structure & Algorithms Used

We use a **Monotonic Increasing Stack** of indices to process boundaries in a single pass:
* The stack stores indices of bars in strictly increasing order of their heights.
* We append a virtual bar of height `0` at the end of the array (at index `N`). This ensures that at the end of the traversal, all remaining bars in the stack are forced to be popped and processed.
* We iterate through indices `i` from `0` to `N`:
  * While the stack is not empty and `heights[i] < heights[stack[top]]`:
    * Pop the top index `hIdx` from the stack. The height of our rectangle is `heights[hIdx]`.
    * The right boundary (first smaller bar on the right) is `i`.
    * The left boundary (first smaller bar on the left) is the new top of the stack. If the stack is empty, it means there are no smaller bars to the left, so left boundary is `-1`.
    * Width = `right - left - 1` = `i - (stack.isEmpty() ? -1 : stack[top]) - 1`.
    * Area = `height * width`. Update `maxArea`.
  * Push `i` onto the stack.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Dry run with `heights = [2, 1, 5, 6, 2, 3]` ($N=6$, virtual `heights[6] = 0`):

* **i = 0** (height = 2): Stack empty. Push `0`. Stack = `[0]`.
* **i = 1** (height = 1): `heights[1] (1) < heights[0] (2)`.
  * Pop `hIdx = 0` (height = 2).
  * Stack is empty -> left = `-1`. Right = `1`.
  * Width = `1 - (-1) - 1 = 1`. Area = `2 * 1 = 2`.
  * Push `1`. Stack = `[1]`.
* **i = 2** (height = 5): `5 >= 1` (top). Push `2`. Stack = `[1, 2]`.
* **i = 3** (height = 6): `6 >= 5` (top). Push `3`. Stack = `[1, 2, 3]`.
* **i = 4** (height = 2): `heights[4] (2) < heights[3] (6)`.
  * Pop `hIdx = 3` (height = 6). Stack top is `2`. Left = `2`. Right = `4`.
  * Width = `4 - 2 - 1 = 1`. Area = `6 * 1 = 6`.
  * `heights[4] (2) < heights[2] (5)`.
  * Pop `hIdx = 2` (height = 5). Stack top is `1`. Left = `1`. Right = `4`.
  * Width = `4 - 1 - 1 = 2`. Area = `5 * 2 = 10` (New max!).
  * `heights[4] (2) >= heights[1] (1)`. Stop popping.
  * Push `4`. Stack = `[1, 4]`.
* **i = 5** (height = 3): `3 >= 2` (top). Push `5`. Stack = `[1, 4, 5]`.
* **i = 6** (virtual height = 0):
  * Pop `5` (height = 3). Left = `4`. Width = `6 - 4 - 1 = 1`. Area = `3 * 1 = 3`.
  * Pop `4` (height = 2). Left = `1`. Width = `6 - 1 - 1 = 4`. Area = `2 * 4 = 8`.
  * Pop `1` (height = 1). Left = `-1`. Width = `6 - (-1) - 1 = 6`. Area = `1 * 6 = 6`.
* Loop ends. Returns max area `10`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function largestRectangleArea(heights: number[]): number {
    const stack: number[] = []; // Stores indices
    let maxArea = 0;
    const n = heights.length;

    for (let i = 0; i <= n; i++) {
        // Use a virtual height of 0 at index n to flush all remaining elements in the stack
        const currentHeight = (i === n) ? 0 : heights[i];

        // While the current height is smaller than the height at stack's top index,
        // we can calculate the area of the rectangle with the top index as the height
        while (stack.length > 0 && currentHeight < heights[stack[stack.length - 1]]) {
            const hIdx = stack.pop()!;
            const height = heights[hIdx];
            
            // The right boundary is i.
            // The left boundary is the new top of the stack (if empty, it is -1).
            const leftBoundary = (stack.length === 0) ? -1 : stack[stack.length - 1];
            const width = i - leftBoundary - 1;
            
            maxArea = Math.max(maxArea, height * width);
        }

        stack.push(i);
    }

    return maxArea;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Complexity | Description |
| :--- | :---: | :--- |
| **Time Complexity** | **$O(N)$** | Every index in the histogram is pushed onto the stack once and popped at most once. |
| **Space Complexity** | **$O(N)$** | To store indices in the stack. |

#### Edge Cases Handled:
* **Strictly Decreasing Heights** (`[5, 4, 3, 2, 1]`): Handled cleanly, stack is popped immediately at each step.
* **All Same Heights** (`[2, 2, 2]`): Calculated correctly at the end when the virtual `0` flushes the stack.
* **Single Bar** (`[4]`): Stack is flushed at `i = 1` with virtual height `0`, returning `4 * 1 = 4`.
