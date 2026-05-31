# 007. Set Matrix Zeroes (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **IN-PLACE MATRIX MANIPULATION** - Classical array question. Tests space-optimization thinking. Moving from $O(M \cdot N)$ auxiliary space to constant $O(1)$ space.

---

### 📝 1. Problem Statement
Given an `m x n` integer matrix `matrix`, if an element is `0`, set its entire row and column to `0`'s. Do it **in-place**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `matrix = [[1,1,1],[1,0,1],[1,1,1]]`
* **Output**: `[[1,0,1],[1,0,1],[1,0,1]]`
* **Why**: The zero is at `matrix[1][1]`. Thus, row 1 and column 1 are fully set to 0.

#### Test Case 2
* **Input**: `matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]`
* **Output**: `[[0,0,0,0],[0,4,5,0],[0,3,1,0]]`
* **Why**: Zeroes are at `matrix[0][0]` and `matrix[0][3]`. Column 0, Column 3, and Row 0 are set to 0.

---

### 💬 3. What is This Problem Actually Asking?
For every `0` in the matrix, we need to mark its row index and column index, then set all values in those rows and columns to `0`. The major catch is doing this **in-place** with constant space.

---

### 🌍 4. Real-Life Example
Imagine a grid of light switches where water leakage at one switch causes a short circuit that trips the circuit breaker for the entire row and column of switches. Instead of keeping a separate notepad to map which rows and cols tripped, we just flip the very first switch of that row and column to "OFF" as a flag, and then trip them all at the end.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing space optimization:

#### Approach 1: Auxiliary Arrays
We maintain two separate boolean arrays: `rowFlags` of size $M$ and `colFlags` of size $N$. We scan the matrix and set `rowFlags[i] = true` and `colFlags[j] = true` if `matrix[i][j] === 0`.
* **Pros**: Simple logic, easy to write.
* **Cons**: Uses $O(M + N)$ auxiliary memory space.

#### Approach 2: Matrix Sentinel Flags (Optimal)
Instead of allocating external arrays, we use the matrix's **first row and first column** themselves as our flagging arrays.
* `matrix[i][0] = 0` acts as `rowFlags[i]`
* `matrix[0][j] = 0` acts as `colFlags[j]`
* Since cell `matrix[0][0]` is shared, we use an auxiliary variable `col0` to track the state of the first column separately.
* **Pros**: Fast, optimal $O(M \cdot N)$ runtime, and $O(1)$ space.
* **Cons**: Complex index updating. Zeroes must be applied from **bottom-right back to top-left** to prevent overwriting the flag cells prematurely.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `matrix = [[1, 0], [1, 1]]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `col0 = 1`, `rows = 2`, `cols = 2`

#### **Step 1: Scan Matrix (i = 0, j = 0)**
* **State check**: `matrix[0][0] = 1`. No update.

#### **Step 2: Scan Matrix (i = 0, j = 1)**
* **State check**: `matrix[0][1] = 0`.
* **Updates**: We set sentinel flags: `matrix[0][0] = 0` (row flag) and `matrix[0][1] = 0` (col flag).

#### **Step 3: Scan Matrix (i = 1, j = 0)**
* **State check**: `matrix[1][0] = 1`. No update.

#### **Step 4: Scan Matrix (i = 1, j = 1)**
* **State check**: `matrix[1][1] = 1`. No update.

#### **Step 5: Apply Zeroes backwards (i = 1 down to 0)**
* **i = 1, j = 1**: `matrix[1][0] === 0`? No. `matrix[0][1] === 0`? Yes! (flag is 0). Set `matrix[1][1] = 0`.
* **i = 1, j = 0**: Since `col0` is 1, first column does not get zeroed out. `matrix[1][0]` remains 1.
* **i = 0, j = 1**: `matrix[0][0] === 0 || matrix[0][1] === 0`? Yes. Set `matrix[0][1] = 0`.
* **i = 0, j = 0**: Set by flags to 0.
* **Result**: Matrix is `[[0, 0], [1, 0]]` (Correct, column 1 is zeroed).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function setZeroes(matrix: number[][]): void {
    // ==========================================
    // 1st Approach: Auxiliary Flag Arrays (O(M + N) Space)
    // ==========================================
    /*
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rowFlags = new Array(rows).fill(false);
    const colFlags = new Array(cols).fill(false);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === 0) {
                rowFlags[i] = true;
                colFlags[j] = true;
            }
        }
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (rowFlags[i] || colFlags[j]) {
                matrix[i][j] = 0;
            }
        }
    }
    */

    // ==========================================
    // 2nd Approach: Sentinel Row/Col Flagging (Optimal)
    // ==========================================
    const rows = matrix.length;
    const cols = matrix[0].length;
    let col0 = 1;

    // Scan matrix, using the 0th row & col as flags
    for (let i = 0; i < rows; i++) {
        if (matrix[i][0] === 0) {
            col0 = 0;
        }
        for (let j = 1; j < cols; j++) {
            if (matrix[i][j] === 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }

    // Set zeroes backward to avoid overwriting sentinels
    for (let i = rows - 1; i >= 0; i--) {
        for (let j = cols - 1; j >= 1; j--) {
            if (matrix[i][0] === 0 || matrix[0][j] === 0) {
                matrix[i][j] = 0;
            }
        }
        if (col0 === 0) {
            matrix[i][0] = 0;
        }
    }
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Auxiliary Arrays | Approach 2: Sentinel Flags |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(M \cdot N)$** — Two full passes over matrix. | **$O(M \cdot N)$** — Two full passes over matrix. |
| **Space Complexity** | **$O(M + N)$** — Separate row/col storage vectors. | **$O(1)$** — Constant variables, fully in-place. |

#### Edge Cases Handled:
* **Single Element Matrix** (`[[0]]` or `[[1]]`): Correctly flips to `[[0]]` or stays `[[1]]`.
* **Zeroes in first Row/Col only**: Safely tracked via `col0` variable and index boundary separations.
