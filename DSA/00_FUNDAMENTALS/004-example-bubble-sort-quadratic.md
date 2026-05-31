# 004. Example: Bubble Sort (O(N^2) Quadratic Scale)

This document provides a detailed trace of nested comparative swapping and its mathematical representation.

---

### 📝 1. Problem Definition
Sort an array in ascending order by repeatedly inspecting and swapping adjacent out-of-order elements.

---

### 💻 2. Implementation

```typescript
function bubbleSort(nums: number[]): number[] {
    const n = nums.length;
    let comparisons = 0;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
            comparisons++;
            if (nums[j] > nums[j + 1]) {
                const temp = nums[j];
                nums[j] = nums[j + 1];
                nums[j + 1] = temp;
            }
        }
    }
    console.log(`Total comparisons: ${comparisons}`);
    return nums;
}
```

---

### 🔄 3. Mathematical Derivation of $O(N^2)$

*   The outer loop executes $N$ times.
*   On the $i$-th iteration of the outer loop, the inner loop executes $N - 1 - i$ times.
*   Sum of comparisons is:
    $$(N-1) + (N-2) + (N-3) + \dots + 1 = rac{N(N-1)}{2} = rac{N^2 - N}{2}$$
*   In asymptotic Big-O notation:
    1. Ignore lower-order terms: drop the $-N$ term.
    2. Ignore constant factors: drop the dividing factor of 2.
    3. This leaves: **$O(N^2)$ (Quadratic Time)**.
* **Space Complexity**: **$O(1)$ (Constant Space)** because all operations are performed directly in-place.

---

### 📊 4. Practical Scaling Comparisons

Let's watch how the total operations scale:

| Array Size ($N$) | Comparisons ($rac{N^2 - N}{2}$) | Target Big-O Scale |
| :--- | :---: | :---: |
| **$5$** | 10 | 25 |
| **$50$** | 1,225 | 2,500 |
| **$500$** | 124,750 | 250,000 |
| **$5,000$** | 12,497,500 | 25,000,000 |
| **$50,000$** | **1,249,975,000 (1.2 Billion!)** | 2,500,000,000 |
