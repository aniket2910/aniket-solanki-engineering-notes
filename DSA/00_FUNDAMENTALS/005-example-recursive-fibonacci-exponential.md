# 005. Example: Recursive Fibonacci (O(2^N) Exponential Scale)

This document traces the exponential growth of branching recursive trees and analyzes how caching (memoization) optimizes execution back to linear boundaries.

---

### 📝 1. Problem Definition
Calculate the $N	ext{-th}$ Fibonacci number where $F(n) = F(n-1) + F(n-2)$.

---

### 💻 2. Standard Recursive Approach

```typescript
function fibonacciRecursive(n: number): number {
    if (n <= 1) return n;
    
    // Branching recursion
    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}
```

#### Complexity Analysis:
* **Time Complexity**: **$O(2^N)$ (Exponential Time)**.
  * Every call to `fibonacciRecursive(N)` generates **two** separate recursive branches (`N-1` and `N-2`).
  * The recursion tree reaches depth $N$. At each level, the operational call volume doubles:
    $$	ext{Calls} = 1 + 2 + 4 + 8 + \dots + 2^N = 2^{N+1} - 1 pprox O(2^N)$$
* **Space Complexity**: **$O(N)$**. The Call Stack matches the maximum tree height depth $N$.

---

### 💻 3. Memoized Dynamic Programming Approach

By caching the calculated value of each index inside an auxiliary structure, we prevent redundant calculations:

```typescript
function fibonacciMemoized(n: number, memo: Map<number, number> = new Map()): number {
    if (n <= 1) return n;
    if (memo.has(n)) return memo.get(n)!;

    const result = fibonacciMemoized(n - 1, memo) + fibonacciMemoized(n - 2, memo);
    memo.set(n, result);
    return result;
}
```

#### Complexity Analysis:
* **Time Complexity**: **$O(N)$ (Linear Time)**.
  * Each Fibonacci index from $0$ to $N$ is calculated exactly **once**. Subsequent requests are resolved in $O(1)$ map lookup time.
* **Space Complexity**: **$O(N)$** due to the auxiliary memoization map size and the recursive stack depth.

---

### 📊 4. Practical Scaling Comparisons

Let's watch how operations scale:

| Fibonacci Index ($N$) | $O(N)$ Memoized Operations | $O(2^N)$ Recursive Operations |
| :--- | :---: | :---: |
| **$5$** | 5 | 15 |
| **$10$** | 10 | 177 |
| **$20$** | 20 | 21,891 |
| **$30$** | 30 | 2,692,537 |
| **$40$** | 40 | **331,160,281 (330 Million!)** |
| **$50$** | 50 | **40,730,022,147 (40 Billion!)** |
