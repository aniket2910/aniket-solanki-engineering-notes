# 003. Example: Binary Search (O(log N) Logarithmic Scale)

This document traces the mathematical behavior of logarithmic halving during array search operations.

---

### 📝 1. Problem Definition
Locate a target value inside a sorted array of integers.

---

### 💻 2. Implementation

```typescript
function binarySearch(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;
    let steps = 0;

    while (left <= right) {
        steps++;
        const mid = left + Math.floor((right - left) / 2);
        
        if (nums[mid] === target) {
            console.log(`Binary Search steps taken: ${steps}`);
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1; // Halve search window (discard left)
        } else {
            right = mid - 1; // Halve search window (discard right)
        }
    }
    return -1;
}
```

---

### 🔄 3. Mathematical Derivation of $O(\log N)$

At each iteration of the search loop, the active search window size is divided by 2:
*   Initial state: Size = $N$
*   Iteration 1: Size = $N / 2$
*   Iteration 2: Size = $N / 4$
*   Iteration $K$: Size = $N / 2^K$

The search process terminates in the worst case when the active search window size is reduced to 1:
$$rac{N}{2^K} = 1 \implies N = 2^K \implies K = \log_2(N)$$

Thus, the maximum number of steps required to locate the target (or verify its absence) is proportional to the **binary logarithm of the input size $N$**:
*   **Time Complexity**: **$O(\log N)$ (Logarithmic Time)**.
*   **Space Complexity**: **$O(1)$ (Constant Space)**. No dynamic auxiliary memory structures are allocated.

---

### 📊 4. Practical Scaling Comparisons

Let's watch how the logarithmic steps map against standard linear searches:

| Array Size ($N$) | $O(\log N)$ Maximum Steps | $O(N)$ Linear Search Steps |
| :--- | :---: | :---: |
| **$8$** | 3 steps | 8 steps |
| **$64$** | 6 steps | 64 steps |
| **$1,024$** | 10 steps | 1,024 steps |
| **$1,048,576$ (1 Million)** | **20 steps** | 1,048,576 steps |
| **$1,073,741,824$ (1 Billion)** | **30 steps** | 1,073,741,824 steps |
