# 002. Example: Linear Search and Two Sum (O(N) vs. O(N^2))

This document analyzes the exact computational progression from a brute-force nested lookup ($O(N^2)$) to an optimized hash-based mapping ($O(N)$) using the Two Sum problem.

---

### 📝 1. Problem Definition
Given an array `nums` and a `target`, find two indices that add up to `target`.

---

### 💻 2. Brute Force Implementation (Nested Loops)

```typescript
function twoSumBruteForce(nums: number[], target: number): number[] {
    let operations = 0;
    const n = nums.length;

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            operations++;
            if (nums[i] + nums[j] === target) {
                console.log(`Total Brute Force Operations: ${operations}`);
                return [i, j];
            }
        }
    }
    return [];
}
```

#### Complexity Analysis:
* **Time Complexity**: **$O(N^2)$ (Quadratic Time)**.
  * In the worst-case scenario (no valid pair exists, or the pair is at the very end), the outer loop runs $N$ times, and the inner loop runs on average $N/2$ times.
  * Sum of operations: $rac{N(N-1)}{2} = rac{N^2 - N}{2} pprox O(N^2)$.
* **Space Complexity**: **$O(1)$ (Constant Space)**. No auxiliary arrays or structures are allocated in memory.

---

### 💻 3. Optimal Implementation (Hash Map Lookup)

```typescript
function twoSumOptimal(nums: number[], target: number): number[] {
    let operations = 0;
    const numMap = new Map<number, number>(); // Auxiliary memory allocation

    for (let i = 0; i < nums.length; i++) {
        operations++;
        const complement = target - nums[i];

        if (numMap.has(complement)) {
            console.log(`Total Optimal Operations: ${operations}`);
            return [numMap.get(complement)!, i];
        }

        numMap.set(nums[i], i);
    }
    return [];
}
```

#### Complexity Analysis:
* **Time Complexity**: **$O(N)$ (Linear Time)**.
  * The array is traversed in a single pass of length $N$.
  * Map property lookups (`has`) and assignments (`set`) run in average $O(1)$ constant time.
  * Total worst-case operations: $N 	imes O(1) = O(N)$.
* **Space Complexity**: **$O(N)$ (Linear Space)**.
  * The auxiliary Map stores up to $N$ unique entries in the worst case.

---

### 📊 4. Practical Scaling Comparisons

Observe how operations scale exponentially as the array size $N$ increases:

| Array Size ($N$) | $O(N)$ Optimal Operations | $O(N^2)$ Brute Force Operations | System Scaling Behavior |
| :--- | :---: | :---: | :--- |
| **$10$** | 10 | 45 | Execution takes microseconds. |
| **$100$** | 100 | 4,950 | Instantaneous execution. |
| **$1,000$** | 1,000 | 499,500 | Standard desktop execution under 1 millisecond. |
| **$10,000$** | 10,000 | 49,995,000 | 0.1ms vs. ~150ms. |
| **$100,000$** | 100,000 | **4,999,950,000 (5 Billion!)** | **0.5ms vs. CPU Thread Freeze / Crash** (exceeds call threshold limits). |
