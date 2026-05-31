# 006. Pow(x, n) (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **DIVIDE AND CONQUER** - Core binary exponentiation problem. Tests understanding of numeric limits, recursion vs iteration, and bitwise/division optimization.

---

### 📝 1. Problem Statement
Implement `pow(x, n)`, which calculates `x` raised to the power `n` (i.e., $x^n$).

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `x = 2.00000`, `n = 10`
* **Output**: `1024.00000`
* **Why**: $2^{10} = 1024$.

#### Test Case 2
* **Input**: `x = 2.00000`, `n = -2`
* **Output**: `0.25000`
* **Why**: $2^{-2} = 1 / 2^2 = 1 / 4 = 0.25$.

---

### 💬 3. What is This Problem Actually Asking?
We need to multiply $x$ by itself $n$ times. However, since $n$ can be as large as $2 \cdot 10^9$ or $-2 \cdot 10^9$, we must avoid linear time multiplication ($O(N)$) to prevent Time Limit Exceeded (TLE) errors.

---

### 🌍 4. Real-Life Example
Think of paper folding. If you fold a sheet of paper in half 10 times, you get $2^{10} = 1024$ layers. You didn't fold it 1024 individual times; you doubled the thickness at each of the 10 folds. This is the essence of exponential growth via doubling.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** demonstrating how exponent halving achieves logarithmic runtime:

#### Approach 1: Recursive Binary Exponentiation
Using the mathematical identity:
* If $n$ is even, $x^n = (x^2)^{n/2}$
* If $n$ is odd, $x^n = x \cdot (x^2)^{(n-1)/2}$
* **Pros**: Highly intuitive recursion formulas.
* **Cons**: Uses call stack memory ($O(\log N)$ space). Can cause call stack overflow on systems with small stack limits.

#### Approach 2: Iterative Binary Exponentiation (Optimal)
We maintain a running product `currentProduct` and multiply it into our `result` whenever the current power exponent $N$ is odd, halving $N$ and squaring `currentProduct` at each step.
* **Pros**: Constant $O(1)$ space, no call stack overhead.
* **Cons**: Slightly less intuitive loop logic to update active powers.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run the optimal iterative code with `x = 2.0`, `n = 10`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `result = 1.0`, `currentProduct = 2.0`, `N = 10`

#### **Step 1: i = 10 (Even)**
* **State check**: `i % 2 === 0` (10 is even).
* **Updates**: `result` remains `1.0`. `currentProduct` becomes `2.0 * 2.0 = 4.0`.
* **Next**: `i` is halved to `5`.

#### **Step 2: i = 5 (Odd)**
* **State check**: `i % 2 === 1` (5 is odd).
* **Updates**: `result` becomes `result * currentProduct = 1.0 * 4.0 = 4.0`. `currentProduct` becomes `4.0 * 4.0 = 16.0`.
* **Next**: `i` is halved (floored) to `2`.

#### **Step 3: i = 2 (Even)**
* **State check**: `i % 2 === 0` (2 is even).
* **Updates**: `result` remains `4.0`. `currentProduct` becomes `16.0 * 16.0 = 256.0`.
* **Next**: `i` is halved to `1`.

#### **Step 4: i = 1 (Odd)**
* **State check**: `i % 2 === 1` (1 is odd).
* **Updates**: `result` becomes `result * currentProduct = 4.0 * 256.0 = 1024.0`. `currentProduct` becomes `256.0 * 256.0 = 65536.0`.
* **Next**: `i` becomes `0`. Loop terminates. Returns `1024.0`.

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function myPow(x: number, n: number): number {
    // ==========================================
    // 1st Approach: Recursive Binary Exponentiation (O(log N))
    // ==========================================
    /*
    function helper(x: number, exp: number): number {
        if (exp === 0) return 1;
        const half = helper(x, Math.floor(exp / 2));
        if (exp % 2 === 0) {
            return half * half;
        } else {
            return x * half * half;
        }
    }

    if (n < 0) {
        return 1 / helper(x, -n);
    }
    return helper(x, n);
    */

    // ==========================================
    // 2nd Approach: Iterative Binary Exponentiation (Optimal)
    // ==========================================
    let N = n;
    if (N < 0) {
        x = 1 / x;
        N = -N;
    }

    let result = 1.0;
    let currentProduct = x;

    for (let i = N; i > 0; i = Math.floor(i / 2)) {
        if (i % 2 === 1) {
            result = result * currentProduct;
        }
        currentProduct = currentProduct * currentProduct;
    }

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Recursive Binary | Approach 2: Iterative Binary |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(\log N)$** — Exponent divided by 2 at each stage. | **$O(\log N)$** — Number of loop iterations is logarithmic. |
| **Space Complexity** | **$O(\log N)$** — Recursive system call stack size. | **$O(1)$** — Constant variables. |

#### Edge Cases Handled:
* **Negative Exponents** (`n = -2`): Exponent is inverted, $x$ becomes $1/x$, and calculations proceed with positive exponents (Correct).
* **Exponent Zero** (`n = 0`): The loop doesn't execute; returns `1.0` (Correct).
* **Negative Base** (`x = -2.0, n = 3`): Odd power retains negative sign, returns `-8.0` (Correct).
* **Minimum Integer Overflow** (`n = -2147483648`): Converting to positive requires special handling in languages like C++/Java, but in TypeScript/JS standard double-precision numbers handle it seamlessly.
