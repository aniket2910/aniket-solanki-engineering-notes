# 012. Rotate Matrix by 90 Degrees (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft, Google
>
> **Interview Tag**: 🔥 **IN-PLACE TRANSPOSE & REVERSE** - Classical matrix puzzle. Tests spatial reasoning and index mapping to achieve $O(1)$ extra space rotation.

---

### 📝 1. Problem Statement
You are given an `n x n` 2D matrix representing an image, rotate the image by **90 degrees (clockwise)**.

You have to rotate the image **in-place**, which means you have to modify the input 2D matrix directly. **DO NOT** allocate another 2D matrix and do the rotation.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `matrix = [[1,2,3],[4,5,6],[7,8,9]]`
* **Output**: `[[7,4,1],[8,5,2],[9,6,3]]`
* **Why**: Rotating the matrix clockwise by 90 degrees transforms columns into rows in reverse order.

---

### 💬 3. What is This Problem Actually Asking?
We need to shift each cell $(i, j)$ in the square matrix clockwise by 90 degrees to cell $(j, n-1-i)$, strictly in-place.

---

### 🌍 4. Real-Life Example
Think of spinning a square Rubik's cube face by 90 degrees. Instead of creating a second Rubik's cube and copying the colors, you rotate the physical tiles in four-way cycle steps to achieve the rotation in place.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing space optimization:

#### Approach 1: Auxiliary Grid Mapping
We allocate a temporary grid of the same size, copy each cell to its target rotated cell `temp[j][n - 1 - i] = matrix[i][j]`, then copy it back.
* **Pros**: Simple, highly intuitive index mapping.
* **Cons**: Requires $O(N^2)$ auxiliary memory space, violating the in-place constraint.

#### Approach 2: Matrix Transpose then Row Reversal (Optimal)
We can achieve a clockwise 90-degree rotation by performing **two sequential in-place matrix operations**:
1.  **Transpose the matrix**: Swap cell `matrix[i][j]` with `matrix[j][i]` for all $i < j$. This swaps rows and columns.
2.  **Reverse each row**: Reverse each row array horizontally.
* **Pros**: Extremely elegant, very easy to write, optimal $O(N^2)$ runtime, constant $O(1)$ space.
* **Cons**: None.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `matrix = [[1, 2], [3, 4]]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `n = 2`

#### **Step 1: Transpose (Swap i, j where i < j)**
* **Swap indices (0, 1) and (1, 0)**: Swap `matrix[0][1] (2)` and `matrix[1][0] (3)`.
* **Updates**: Matrix becomes:
  ```text
  Row 0: [ 1,  3 ]
  Row 1: [ 2,  4 ]
  ```

#### **Step 2: Reverse each row**
* **Reverse Row 0**: `[1, 3]` becomes `[3, 1]`.
* **Reverse Row 1**: `[2, 4]` becomes `[4, 2]`.
* **Result**: Matrix becomes:
  ```text
  Row 0: [ 3,  1 ]
  Row 1: [ 4,  2 ]
  ```
  This is indeed `[[3, 1], [4, 2]]` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function rotate(matrix: number[][]): void {
    // ==========================================
    // 1st Approach: Auxiliary Matrix Mapping (O(N^2) Space)
    // ==========================================
    /*
    const n = matrix.length;
    const temp = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            temp[j][n - 1 - i] = matrix[i][j];
        }
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            matrix[i][j] = temp[i][j];
        }
    }
    */

    // ==========================================
    // 2nd Approach: Transpose and Row Reversal (Optimal)
    // ==========================================
    const n = matrix.length;

    // 1. Transpose the matrix
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }

    // 2. Reverse each row of the transposed matrix
    for (let i = 0; i < n; i++) {
        reverseRow(matrix[i]);
    }
}

function reverseRow(row: number[]): void {
    let l = 0;
    let r = row.length - 1;
    while (l < r) {
        const temp = row[l];
        row[l] = row[r];
        row[r] = temp;
        l++;
        r--;
    }
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Auxiliary Grid | Approach 2: Transpose + Reverse |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N^2)$** — Traverses every cell twice. | **$O(N^2)$** — Traverses every cell twice (once to transpose, once to reverse). |
| **Space Complexity** | **$O(N^2)$** — Allocates duplicate matrix. | **$O(1)$** — Constant in-place memory swaps. |

#### Edge Cases Handled:
* **Single Element Matrix** (`[[1]]`): The loops execute but no swaps occur; returns `[[1]]` (Correct).
