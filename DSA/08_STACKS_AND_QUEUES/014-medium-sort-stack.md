# 014. Sort a Stack (Medium)

> [!IMPORTANT]
> **Interview Tag**: Recursion & Stack - A classic puzzle question. Frequently asked in core system interviews to test your ability to think recursively and use call stacks as implicit storage.

---

### 📝 1. Problem Statement
Given a Stack, sort it in-place such that the greatest element is at the top of the stack. 

You must solve this problem **recursively** without using any loops (`for` or `while`). You are only allowed to use standard stack operations:
* `push()`
* `pop()`
* `peek()` / `top()`
* `isEmpty()`

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `stack = [3, 2, 1, 5, 4]` (where 4 is top)
* **Output**: `[1, 2, 3, 4, 5]` (where 5 is top)

#### Test Case 2
* **Input**: `stack = [-3, 14, 18, -5, 30]` (where 30 is top)
* **Output**: `[-5, -3, 14, 18, 30]` (where 30 is top)

---

### 💬 3. What is This Problem Actually Asking?
We need to sort a stack, but we cannot create a new array, list, or use loops. We can only use the recursive call stack (which acts as a temporary implicit stack storage) to hold elements while we reinsert them in sorted order.

---

### 🌍 4. Real-Life Example
Think of a **very narrow tube containing numbered tennis balls**:
* The tube is so narrow that you can only take balls out from the top (`pop`) and drop them in at the top (`push`).
* You don't have any table space to lay all the balls out.
* However, you have **memory** (the recursive call stack). You can hold a ball in your hand, look at the remaining balls, hold the next ball in your other hand, and insert them back in the correct order.

---

### 🛠️ 5. Data Structure & Algorithms Used

We use two recursive functions:
1. **`sortStack(stack)`**:
   * Base Case: If the stack is empty, return.
   * Otherwise, `pop()` the top element and store it in a temporary variable `temp`.
   * Recursively call `sortStack(stack)` to sort the remaining stack.
   * Insert `temp` back into the sorted stack at the correct position using the helper function `insertSorted`.

2. **`insertSorted(stack, val)`**:
   * Base Case: If the stack is empty, or the top of the stack is smaller than `val` (assuming we want ascending order with largest at top), we just `push(val)`.
   * Otherwise:
     * `pop()` the top element `temp` (since it is larger than `val` and must sit above `val`).
     * Recursively call `insertSorted(stack, val)`.
     * Push `temp` back onto the stack.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Dry run of `insertSorted(stack, 3)` when sorted `stack = [1, 2, 5]` (5 is top):

#### **Step 1: insertSorted([1, 2, 5], 3)**
* Is stack empty? No. Is `3 > 5`? No.
* Pop `5`. Call `insertSorted([1, 2], 3)`.

#### **Step 2: insertSorted([1, 2], 3)**
* Is stack empty? No. Is `3 > 2`? Yes!
* Push `3` onto stack. Stack becomes `[1, 2, 3]`.
* Return to Step 1.

#### **Step 3: Resume Step 1**
* Push the popped element `5` back onto stack.
* Stack becomes `[1, 2, 3, 5]`.
* Complete!

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function sortStack(stack: number[]): void {
    // Base case: If stack is empty, it is already sorted
    if (stack.length === 0) {
        return;
    }

    // Pop the top element
    const temp = stack.pop()!;

    // Sort the remaining stack recursively
    sortStack(stack);

    // Insert the popped element back at its correct sorted position
    insertSorted(stack, temp);
}

function insertSorted(stack: number[], val: number): void {
    // Base case: If stack is empty or val is greater than the top element, push it
    if (stack.length === 0 || val >= stack[stack.length - 1]) {
        stack.push(val);
        return;
    }

    // If top element is greater than val, pop it
    const temp = stack.pop()!;

    // Recursively find the correct position for val in the remaining stack
    insertSorted(stack, val);

    // Push the popped element back on top
    stack.push(temp);
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Complexity | Description |
| :--- | :---: | :--- |
| **Time Complexity** | **$O(N^2)$** | For a stack of size $N$, `sortStack` is called $N$ times. In the worst case, `insertSorted` does up to $N$ steps to insert an element. |
| **Space Complexity** | **$O(N)$** | To support the recursive call stack of depth $N$. |

#### Edge Cases Handled:
* **Already Sorted Stack**: Runs correctly, call stack depth is handled without redundant swaps.
* **Negative Numbers**: The comparisons `val >= stack[stack.length - 1]` handle negatives naturally.
