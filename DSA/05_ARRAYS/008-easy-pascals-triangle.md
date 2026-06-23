# 008. Pascal's Triangle I (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Google, Microsoft
>
> **Interview Tag**: 🔥 **ITERATIVE BLOCK GENERATION** - Core array logic. Essential for understanding dynamic array allocations, indexing arithmetic, and mathematical row updates.

---

### 📝 1. Problem Statement
Given an integer `numRows`, return the first `numRows` of **Pascal's triangle**. 

In Pascal's triangle, each number is the sum of the two numbers directly above it.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `numRows = 5`
* **Output**: `[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]`
* **Why**: Row 0 is `[1]`. Row 1 is `[1, 1]`. Row 2 is `[1, 1+1, 1] = [1, 2, 1]`. Row 3 is `[1, 1+2, 2+1, 1] = [1, 3, 3, 1]`. Row 4 is `[1, 1+3, 3+3, 3+1, 1] = [1, 4, 6, 4, 1]`.

#### Test Case 2
* **Input**: `numRows = 1`
* **Output**: `[[1]]`
* **Why**: Returns a single row of size 1 containing only `1`.

---

### 💬 3. What is This Problem Actually Asking?
We need to generate a list of arrays representing Pascal's triangle. Each row is of length index + 1, starts and ends with `1`, and all other values are computed by adding the elements at indices `j-1` and `j` in the previous row.

---

### 🌍 4. Real-Life Example
Think of building a pyramid of cups. The weight supported by each cup is equal to half the weight of the two cups sitting directly above it. The cups on the edges only support weight from one side, while cups in the middle accumulate weights from both sides.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing algebraic vs. DP iteration:

#### Approach 1: Mathematical Combination Formula ($nCr$)
We calculate each element in row $i$ at column $j$ using the combination formula $nCr = rac{i!}{j!(i-j)!}$.
* **Pros**: Can calculate any cell independently.
* **Cons**: Slow ($O(N^3)$ or $O(N^2)$ with factorials), high integer overflow risk on larger rows due to large factorials.

#### Approach 2: Iterative Row-by-Row Dynamic Programming (Optimal)
We generate row $i$ by allocating an array of size $i + 1$, filling all elements with `1`. We then loop through index $j$ from $1$ to $i - 1$ and calculate:
* `row[j] = prevRow[j - 1] + prevRow[j]`
* **Pros**: Fast, optimal $O(N^2)$ runtime, zero multiplication or factorials, safe from overflows.
* **Cons**: None.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `numRows = 4`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `triangle = []`

#### **Step 1: i = 0**
* **Action**: Generate row 0 of size 1: `row = [1]`.
* **Updates**: `triangle = [[1]]`

#### **Step 2: i = 1**
* **Action**: Generate row 1 of size 2: `row = [1, 1]`.
* **Updates**: `triangle = [[1], [1, 1]]`

#### **Step 3: i = 2**
* **Action**: Generate row 2 of size 3: `row = [1, 1, 1]`.
* **Inner loop**: $j = 1$. `row[1] = triangle[1][0] + triangle[1][1] = 1 + 1 = 2`.
* **Updates**: `row` becomes `[1, 2, 1]`. `triangle = [[1], [1, 1], [1, 2, 1]]`

#### **Step 4: i = 3**
* **Action**: Generate row 3 of size 4: `row = [1, 1, 1, 1]`.
* **Inner loop**:
  * $j = 1$: `row[1] = triangle[2][0] + triangle[2][1] = 1 + 2 = 3`.
  * $j = 2$: `row[2] = triangle[2][1] + triangle[2][2] = 2 + 1 = 3`.
* **Updates**: `row` becomes `[1, 3, 3, 1]`. `triangle = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]]`
* **Next**: Ends. Returns `triangle`.

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function generate(numRows: number): number[][] {
    // ==========================================
    // 1st Approach: nCr Math (O(N^3) with factorial overhead)
    // ==========================================
    /*
    function getFactorial(num: number): number {
        let res = 1;
        for (let i = 2; i <= num; i++) res *= i;
        return res;
    }
    function nCr(n: number, r: number): number {
        return getFactorial(n) / (getFactorial(r) * getFactorial(n - r));
    }
    const result: number[][] = [];
    for (let i = 0; i < numRows; i++) {
        const row: number[] = [];
        for (let j = 0; j <= i; j++) {
            row.push(nCr(i, j));
        }
        result.push(row);
    }
    return result;
    */

    // ==========================================
    // 2nd Approach: Dynamic Programming Row Tally (Optimal)
    // ==========================================
    const triangle: number[][] = [];

    for (let i = 0; i < numRows; i++) {
        // Pre-allocate row filled with 1s
        const row = new Array(i + 1).fill(1);

        // Fill in the middle elements
        for (let j = 1; j < i; j++) {
            row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
        }

        triangle.push(row);
    }

    return triangle;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Combinations | Approach 2: DP Addition |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N^3)$** — Calculate each cells math combinations. | **$O(N^2)$** — Symmetrical triangular cells visit. |
| **Space Complexity** | **$O(1)$** — Symmetrical cells calculation. | **$O(1)$** — Excluding result storage. |

#### Edge Cases Handled:
* **numRows = 0**: Returns empty `[]` array.
* **numRows = 1**: Returns `[[1]]` successfully.
