# 003. Fibonacci Number (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon
>
> **Interview Tag**: 🔥 **BASIC RECURSION & MEMOIZATION** - The classic entry point to understanding recurrence relations, recursive call stack frames, and memoized caching.

---

### 📝 1. Problem Statement
The **Fibonacci numbers**, commonly denoted `F(n)`, form a sequence, called the **Fibonacci sequence**, such that each number is the sum of the two preceding ones, starting from `0` and `1`. That is:
* `F(0) = 0, F(1) = 1`
* `F(n) = F(n - 1) + F(n - 2)`, for `n > 1`.

Given `n`, calculate `F(n)`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `n = 2`
* **Output**: `1`
* **Why**: `F(2) = F(1) + F(0) = 1 + 0 = 1`.

#### Test Case 2
* **Input**: `n = 4`
* **Output**: `3`
* **Why**: 
  * `F(2) = 1`
  * `F(3) = F(2) + F(1) = 1 + 1 = 2`
  * `F(4) = F(3) + F(2) = 2 + 1 = 3`.

---

### 💬 3. What is This Problem Actually Asking?
Calculate the $N$-th value in a sequence where each number is the sum of the previous two numbers.

---

### 🌍 4. Real-Life Example
Think of a pair of rabbits that reproduce according to the Fibonacci model, or building a staircase. If you can climb a staircase by taking either 1 or 2 steps at a time, the number of distinct ways to reach the $N$-th step is the $N$-th Fibonacci number.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** to solve this:

#### Approach 1: Naive Recursion
We directly translate the mathematical recurrence relation into code: `fib(n) = fib(n-1) + fib(n-2)`.
* **Pros**: Trivially simple and mirrors the mathematical definition.
* **Cons**: Incredibly slow. Because it recalculates the same subproblems repeatedly, it takes exponential $O(2^N)$ time, which times out for $N > 40$.

#### Approach 2: Iterative DP (Space Optimized)
Instead of recursion, we compute from the bottom up using two variables (`prev2` and `prev1`) to store the values of `F(i-2)` and `F(i-1)` as we iterate up to `n`.
* **Pros**: Optimal $O(N)$ runtime with $O(1)$ constant auxiliary space.
* **Cons**: Iterative approach doesn't demonstrate recursion concepts (though we can also show a memoized recursive approach).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 1 (Naive Recursion) with `n = 4` to show the call tree structure.

#### **Step 0: Initial Call**
* Call `fib(4)`

#### **Step 1: Expand fib(4)**
```text
               fib(4)
              /      \
          fib(3)    fib(2)
```
* **State check**: `n = 4` is not base case. Recurse left: `fib(3)`, and right: `fib(2)`.

#### **Step 2: Expand fib(3)**
```text
               fib(4)
              /      \
          fib(3)    fib(2)
          /    \
      fib(2)  fib(1)
```
* **State check**: `n = 3` is not base case. Recurse left: `fib(2)`, and right: `fib(1)`.

#### **Step 3: Expand fib(2) (from fib(3))**
```text
               fib(4)
              /      \
          fib(3)    fib(2)
          /    \
      fib(2)  fib(1)
      /    \
  fib(1)  fib(0)
```
* **State check**: `fib(2)` spawns `fib(1)` and `fib(0)`.
* **Leaf evaluations**:
  * `fib(1) = 1` (Base case)
  * `fib(0) = 0` (Base case)
* **Resolve fib(2)**: `1 + 0 = 1`.

#### **Step 4: Resolve fib(3)**
* We have `fib(2) = 1` and `fib(1) = 1`.
* `fib(3) = 1 + 1 = 2`.

#### **Step 5: Expand fib(2) (from fib(4) right branch)**
* Spawns `fib(1)` and `fib(0)` $\rightarrow$ resolves to `1`.
* **Resolve fib(4)**: `fib(3) + fib(2) = 2 + 1 = 3` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function fib(n: number): number {
    // ==========================================
    // 1st Approach: Naive Recursion (O(2^N))
    // ==========================================
    /*
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
    */

    // ==========================================
    // 2nd Approach: Iterative Bottom-Up DP (Optimal O(N) Time, O(1) Space)
    // ==========================================
    if (n <= 1) return n;
    
    let prev2 = 0; // F(0)
    let prev1 = 1; // F(1)
    
    for (let i = 2; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Naive Recursion | Approach 2: Bottom-Up DP |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(2^N)$** — Exponential branching due to duplicate subproblems. | **$O(N)$** — Single loop from $2$ to $N$. |
| **Space Complexity** | **$O(N)$** — Max height of the recursion tree on the call stack. | **$O(1)$** — Constants only. |

#### Edge Cases Handled:
* **n = 0**: Handled by the guard clause returning `0` immediately (Correct).
* **n = 1**: Handled by the guard clause returning `1` immediately (Correct).
