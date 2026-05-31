# 016. Find the Repeating and Missing Number (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **MATH EQUATIONS SOLVER** - Premium array riddle. Tests ability to construct linear and quadratic equations to isolate two variables in a single pass.

---

### 📝 1. Problem Statement
Given an unsorted array of size `n`. Array elements are in the range `[1, n]`. One number from set `{1, 2, …n}` is missing and one number occurs twice in the array. Find these two numbers.

Return them in a tuple or array in the format `[repeating, missing]`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `arr = [3, 1, 3]`
* **Output**: `[3, 2]`
* **Why**: The repeating number is `3` and the missing number is `2`.

#### Test Case 2
* **Input**: `arr = [4, 3, 6, 2, 1, 1]`
* **Output**: `[1, 5]`
* **Why**: The repeating number is `1` and the missing number is `5`.

---

### 💬 3. What is This Problem Actually Asking?
Among numbers `1` to $N$, one number has replaced another. We need to find both in $O(N)$ time and $O(1)$ space.

---

### 🌍 4. Real-Life Example
Imagine a classroom where each student has a designated chair numbered $1$ to $N$. During roll call, you count total students and find one chair is empty, while two students are squished onto a single chair. You want to identify the truant student and the double-seated student without checking every student's ID sheet individually.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing mathematical systems vs. tracking arrays:

#### Approach 1: Frequency Array / Hash Map
We maintain a count array of size $N+1$. We record frequencies of each element, then iterate from $1$ to $N$ to find the element with frequency 2 (repeating) and frequency 0 (missing).
* **Pros**: Simple, intuitive logic.
* **Cons**: Requires $O(N)$ auxiliary memory space.

#### Approach 2: System of Math Equations (Optimal)
We can solve this in a single pass using simple math sum equations:
1.  Sum of first $N$ numbers: $S_N = rac{N(N+1)}{2}$
2.  Sum of squares of first $N$ numbers: $S_{N^2} = rac{N(N+1)(2N+1)}{6}$
Let $X$ be the repeating number and $Y$ be the missing number.
*   Actual Sum of elements: $S = \sum arr[i]$
*   Actual Sum of squares of elements: $S^2 = \sum arr[i]^2$
This gives us two equations:
*   $X - Y = S - S_N$ (Eq 1)
*   $X^2 - Y^2 = S^2 - S_{N^2}$
    *   $\implies (X-Y)(X+Y) = S^2 - S_{N^2}$
    *   $\implies X + Y = rac{S^2 - S_{N^2}}{X-Y}$ (Eq 2)
We solve Eq 1 and Eq 2 for $X$ and $Y$!
* **Pros**: Optimal $O(N)$ runtime, true $O(1)$ constant space.
* **Cons**: Risk of numeric overflow on sum of squares calculations on massive arrays. Requires large integer sizes in C++/Java.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `arr = [3, 1, 3]` ($N=3$).

#### **Step 0: Initial State (Before loop)**
* **Expected Math**:
  * $S_N = rac{3 \cdot 4}{2} = 6$.
  * $S_{N^2} = rac{3 \cdot 4 \cdot 7}{6} = 14$.

#### **Step 1: Calculate Actual Sums**
* **Loop through `[3, 1, 3]`**:
  * Actual Sum $S = 3 + 1 + 3 = 7$.
  * Actual Sum of Squares $S^2 = 9 + 1 + 9 = 19$.

#### **Step 2: Solve Equations**
* **Equation 1**: $X - Y = S - S_N = 7 - 6 = 1$.
* **Equation 2**: $X^2 - Y^2 = 19 - 14 = 5$.
  * $X + Y = rac{X^2 - Y^2}{X-Y} = rac{5}{1} = 5$.
* **Solve**:
  * Add Eq 1 and Eq 2: $2X = 6 \implies X = 3$ (Repeating).
  * $Y = X - 1 = 2$ (Missing).
* **Result**: Returns `[3, 2]` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function findRepeatingAndMissing(arr: number[]): [number, number] {
    // ==========================================
    // 1st Approach: Auxiliary Frequency Array (O(N) Space)
    // ==========================================
    /*
    const n = arr.length;
    const freq = new Array(n + 1).fill(0);
    for (let num of arr) freq[num]++;
    let repeating = -1, missing = -1;
    for (let i = 1; i <= n; i++) {
        if (freq[i] === 2) repeating = i;
        if (freq[i] === 0) missing = i;
    }
    return [repeating, missing];
    */

    // ==========================================
    // 2nd Approach: Mathematical System (Optimal)
    // ==========================================
    const n = arr.length;

    // Expected Sum and Square Sum
    const Sn = (n * (n + 1)) / 2;
    const Sn2 = (n * (n + 1) * (2 * n + 1)) / 6;

    // Actual Sum and Square Sum
    let S = 0;
    let S2 = 0;

    for (let i = 0; i < n; i++) {
        S += arr[i];
        S2 += arr[i] * arr[i];
    }

    // X - Y = S - Sn
    const diff = S - Sn;

    // X^2 - Y^2 = S2 - Sn2
    const diffSquares = S2 - Sn2;

    // X + Y = (X^2 - Y^2) / (X - Y)
    const sum = diffSquares / diff;

    // Solve for X (Repeating) and Y (Missing)
    const repeating = (diff + sum) / 2;
    const missing = sum - repeating;

    return [repeating, missing];
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Frequency Array | Approach 2: Equations |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Single pass over array. | **$O(N)$** — Single pass over array. |
| **Space Complexity** | **$O(N)$** — Allocates size N frequency array. | **$O(1)$** — Constant variables, zero allocations. |

#### Edge Cases Handled:
* **N = 2** (`[2, 2]`): Sum: 4 (Expected 3). Square sum: 8 (Expected 5). $X - Y = 1, X + Y = 3 \implies X = 2, Y = 1$. Returns `[2, 1]` (Correct).
