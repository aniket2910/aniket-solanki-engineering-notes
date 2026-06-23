# 011. Next Smaller Element (Medium)

> [!IMPORTANT]
> **Interview Tag**: Monotonic Stack Foundations - Symmetrical counterpart to Next Greater Element. A fundamental building block for advanced histogram problems (like Largest Rectangle in Histogram).

---

### 📝 1. Problem Statement
Given an array of integers `nums`, find the **Next Smaller Element (NSE)** for every element in the array. 

The next smaller element of an element `nums[i]` is the **first element to its right** that is strictly smaller than `nums[i]`. If no such element exists to the right, the next smaller element is defined as `-1`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [4, 8, 5, 2, 25]`
* **Output**: `[2, 5, 2, -1, -1]`
* **Why**:
  * For `4`: First element to its right smaller than `4` is `2`.
  * For `8`: First element to its right smaller than `8` is `5`.
  * For `5`: First element to its right smaller than `5` is `2`.
  * For `2`: No element to its right is smaller than `2`. Return `-1`.
  * For `25`: No element to its right. Return `-1`.

#### Test Case 2
* **Input**: `nums = [1, 3, 0, 2, 5]`
* **Output**: `[0, 0, -1, -1, -1]`

---

### 💬 3. What is This Problem Actually Asking?
For each position in the array, we want to look forward (rightward) and locate the very first number that is smaller than the current number.
By traversing the array from right to left, we can use a stack to cache elements that could potentially be the next smaller element for preceding numbers.

---

### 🌍 4. Real-Life Example
Think of **buying a depreciating asset** (like a car or smartphone model):
* You are sitting on day `i` looking at a price tag. You want to wait until the price drops to a **strictly cheaper price** than today's price.
* You scan prices chronologically from left to right, wishing to find the first day the price drops below your current day's price.

---

### 🛠️ 5. Data Structure & Algorithms Used

We use a **Monotonic Increasing Stack** traversing the array from right to left:
* By traversing backwards, we maintain a stack of candidates in strictly increasing order (bottom to top).
* For each element `nums[i]`:
  * While the stack is not empty and the top of the stack is greater than or equal to `nums[i]`, we pop from the stack (since they can never be the next smaller element for any element to the left of `nums[i]`).
  * If the stack is not empty, the next smaller element is the top of the stack.
  * If the stack is empty, return `-1`.
  * Push `nums[i]` onto the stack.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Dry run with `nums = [4, 8, 5, 2, 25]` (traversing from index 4 down to 0):

#### **Step 1: i = 4 (value = 25)**
* Stack is empty. NSE for `25` is `-1`.
* Push `25`.
* Stack = `[ 25 ]`, Result = `[?, ?, ?, ?, -1]`

#### **Step 2: i = 3 (value = 2)**
* `25` (top) >= `2`. Pop `25`.
* Stack is empty. NSE for `2` is `-1`.
* Push `2`.
* Stack = `[ 2 ]`, Result = `[?, ?, ?, -1, -1]`

#### **Step 3: i = 2 (value = 5)**
* `2` (top) < `5`. Top of stack is `2`.
* NSE for `5` is `2`.
* Push `5`.
* Stack = `[ 2, 5 ]`, Result = `[?, ?, 2, -1, -1]`

#### **Step 4: i = 1 (value = 8)**
* `5` (top) < `8`. Top of stack is `5`.
* NSE for `8` is `5`.
* Push `8`.
* Stack = `[ 2, 5, 8 ]`, Result = `[?, 5, 2, -1, -1]`

#### **Step 5: i = 0 (value = 4)**
* `8` (top) >= `4`. Pop `8`.
* `5` (top) >= `4`. Pop `5`.
* `2` (top) < `4`. Top of stack is `2`.
* NSE for `4` is `2`.
* Push `4`.
* Stack = `[ 2, 4 ]`, Result = `[2, 5, 2, -1, -1]`

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function nextSmallerElement(nums: number[]): number[] {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack: number[] = [];

    // Traverse from right to left
    for (let i = n - 1; i >= 0; i--) {
        const val = nums[i];

        // Maintain monotonic increasing order in stack (bottom to top)
        // Pop elements that are greater than or equal to current element
        while (stack.length > 0 && stack[stack.length - 1] >= val) {
            stack.pop();
        }

        // If stack is not empty, top element is the next smaller element
        if (stack.length > 0) {
            result[i] = stack[stack.length - 1];
        }

        // Push current element as a candidate for elements to the left
        stack.push(val);
    }

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Complexity | Description |
| :--- | :---: | :--- |
| **Time Complexity** | **$O(N)$** | A single backward pass over the array of size $N$. Each element is pushed and popped at most once. |
| **Space Complexity** | **$O(N)$** | To store elements in the stack. In the worst-case (increasing array), the stack stores up to $N$ elements. |

#### Edge Cases Handled:
* **Strictly Decreasing Array** (`[5, 4, 3, 2, 1]`): Since each element's next smaller is the immediate right element, stack keeps popping, resulting in `[4, 3, 2, 1, -1]`. Correct.
* **Strictly Increasing Array** (`[1, 2, 3, 4, 5]`): No element has a smaller element to its right. Returns `[-1, -1, -1, -1, -1]`. Correct.
