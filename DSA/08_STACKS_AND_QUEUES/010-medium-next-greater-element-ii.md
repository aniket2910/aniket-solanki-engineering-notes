# 010. Next Greater Element II (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Google, Microsoft
>
> **Interview Tag**: 🔥 **MUST SOLVE** - A top-tier interview question. Tests your ability to handle circular arrays and modulo arithmetic alongside monotonic stacks.

---

### 📝 1. Problem Statement
Given a circular integer array `nums` (i.e., the next element of `nums[nums.length - 1]` is `nums[0]`), return *the **next greater number** for every element in `nums`*.

The **next greater number** of a number `x` is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number. If it doesn't exist, return `-1` for this number.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1, 2, 1]`
* **Output**: `[2, -1, 2]`
* **Why**:
  * For the first `1`, the next greater number is `2`.
  * For `2`, there is no greater number in the circular array, so return `-1`.
  * For the second `1`, we wrap around to the beginning. The next greater number is `2`.

#### Test Case 2
* **Input**: `nums = [5, 4, 3, 2, 1]`
* **Output**: `[-1, 5, 5, 5, 5]`
* **Why**:
  * For `5`, no greater element exists circular-wise. Return `-1`.
  * For `4`, wrapping around to `5` gives next greater. Same for `3`, `2`, `1`.

---

### 💬 3. What is This Problem Actually Asking?
We need to find the next greater element for each index, but the search doesn't stop at the end of the array—it wraps around to the beginning.
Instead of actually copying the array to double its size (which wastes space), we can simulate a doubled array of size $2N$ and use modulo arithmetic to index elements.

---

### 🌍 4. Real-Life Example
Think of a **circular clock face**:
* You are sitting at hour mark 10. You want to find the first hour mark ahead of you that has a larger value than yours, but you can only search clockwise.
* You look forward to 11, 12, then wrap around to 1, 2, 3...
* Since the numbers repeat in a circle, you can complete one full rotation to search for your target.

---

### 🛠️ 5. Data Structure & Algorithms Used

We use a **Monotonic Stack** traversing the simulated doubled array from right to left:
* The array size is $N$. We run a loop from `2N - 1` down to `0` to simulate traversing a doubled array `[nums + nums]`.
* At each step, the actual index in the array is `i % N`.
* We maintain a stack containing elements in decreasing order:
  * While the stack is not empty and the top of the stack is less than or equal to the current element `nums[i % N]`, we pop from the stack.
  * If we are in the first half of the simulation (`i < N`):
    * If the stack is not empty, the next greater element for index `i` is the top of the stack.
    * Otherwise, it is `-1`.
  * Push `nums[i % N]` onto the stack.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Dry run with `nums = [1, 2, 1]` ($N = 3$, loop $i$ runs from 5 down to 0):

#### **Phase 1: i = 5 down to 3 (Simulated second pass to populate stack)**
* **i = 5** (`idx = 2`, value = `1`): Stack is empty. Push `1`. Stack = `[ 1 ]`.
* **i = 4** (`idx = 1`, value = `2`): `2 >= 1` (top). Pop `1`. Push `2`. Stack = `[ 2 ]`.
* **i = 3** (`idx = 0`, value = `1`): `1 < 2` (top). Push `1`. Stack = `[ 2, 1 ]`.

#### **Phase 2: i = 2 down to 0 (Actual result construction)**
* **i = 2** (`idx = 2`, value = `1`):
  * `1 < 1` (top of stack `[2, 1]` is `1`? No, equal). Pop `1`. Stack is now `[ 2 ]`.
  * Top of stack is `2`. So `result[2] = 2`.
  * Push `1`. Stack = `[ 2, 1 ]`.
* **i = 1** (`idx = 1`, value = `2`):
  * `2 >= 1` (top). Pop `1`. Stack = `[ 2 ]`.
  * `2 >= 2` (top). Pop `2`. Stack = `[]`.
  * Stack is empty. So `result[1] = -1`.
  * Push `2`. Stack = `[ 2 ]`.
* **i = 0** (`idx = 0`, value = `1`):
  * `1 < 2` (top). Top of stack is `2`. So `result[0] = 2`.
  * Push `1`. Stack = `[ 2, 1 ]`.

Final Result: `[2, -1, 2]`

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function nextGreaterElements(nums: number[]): number[] {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack: number[] = []; // Stores the values (or indices) of elements

    // Loop through a virtual duplicated array backwards (from 2N-1 down to 0)
    for (let i = 2 * n - 1; i >= 0; i--) {
        const val = nums[i % n];

        // Pop elements from the stack that are smaller than or equal to the current element
        while (stack.length > 0 && stack[stack.length - 1] <= val) {
            stack.pop();
        }

        // Only populate results for the actual indices of the array (second half of the loop)
        if (i < n) {
            if (stack.length > 0) {
                result[i] = stack[stack.length - 1];
            }
        }

        stack.push(val);
    }

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Complexity | Description |
| :--- | :---: | :--- |
| **Time Complexity** | **$O(N)$** | We run the loop $2N$ times. Each index's value is pushed onto the stack once and popped at most once. |
| **Space Complexity** | **$O(N)$** | In the worst-case, the stack stores up to $N$ elements. |

#### Edge Cases Handled:
* **All Same Elements** (`[1, 1, 1]`): Stack pops equal elements, leaving stack empty. Result = `[-1, -1, -1]`. Correct.
* **Single Element Array** (`[5]`): Loop runs for index 0, stack gets emptied, returns `[-1]`. Correct.
