# 002. Search in a 2D Matrix (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **FLATTENED BINARY SEARCH** - Highly common standard interview question. Tests matrix index coordinate mapping onto sorted 1D array boundaries.

---

### 📝 1. Problem Statement
Write an efficient algorithm that searches for a value `target` in an `m x n` integer matrix `matrix`. This matrix has the following properties:
1.  Integers in each row are sorted from left to right.
2.  The first integer of each row is greater than the last integer of the previous row.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]]`, `target = 3`
* **Output**: `true`
* **Why**: The value `3` exists at row 0, column 1.

#### Test Case 2
* **Input**: `matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]]`, `target = 13`
* **Output**: `false`
* **Why**: The value `13` does not exist anywhere in the matrix.

---

### 💬 3. What is This Problem Actually Asking?
Since the matrix is fully sorted row-by-row and the start of each row is larger than the end of the previous one, the entire matrix can be traversed as a single, contiguous sorted 1D list. We need to perform binary search on this virtual 1D list.

---

### 🌍 4. Real-Life Example
Imagine a catalog book where all products are listed in alphabetical order across multiple pages. To find a specific product, you don't scan each page from left to right. You open the catalog directly to the middle page and compare page start/end values to decide whether to flip forward or backward.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing the optimization of 2D searching:

#### Approach 1: Row Binary Search followed by Column Binary Search
We first run binary search on the 0th column to isolate which row could contain the target. Once the correct row is identified, we run a standard binary search on that row.
* **Pros**: Uses standard binary search components without index arithmetic.
* **Cons**: Requires two consecutive binary searches ($O(\log M + \log N)$), which is slightly more code.

#### Approach 2: Virtual 1D Flattened Binary Search (Optimal)
We define search boundaries from `left = 0` to `right = (rows * cols) - 1`. During search, the virtual index `mid` is mapped directly to 2D matrix coordinates via:
* `row = Math.floor(mid / cols)`
* `col = mid % cols`
* **Pros**: Single elegant search loop, optimal $O(\log(M \cdot N))$ runtime.
* **Cons**: Requires index arithmetic mapping.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `matrix = [[1, 3, 5], [10, 11, 16]]`, `target = 3` (rows = 2, cols = 3).

#### **Step 0: Initial State (Before loop)**
* **Variables**: `left = 0`, `right = 5`, `cols = 3`

#### **Step 1: mid = 2**
```text
Virtual 1D: [  1,   3,   5,  10,  11,  16  ]
              idx0 idx1 idx2 idx3 idx4 idx5
Pointers:    ▲         ▲                  ▲
            left      mid               right
```
* **State check**: `mid = 2`. Coord: `row = Math.floor(2 / 3) = 0`, `col = 2 % 3 = 2`. `val = matrix[0][2] = 5`.
* **Updates**: Since `val (5) > target (3)`, narrow search boundary to the left: `right = mid - 1 = 1`.
* **Next**: Recalculate `mid`.

#### **Step 2: mid = 0**
```text
Virtual 1D: [  1,   3,   5,  10,  11,  16  ]
              idx0 idx1 idx2 idx3 idx4 idx5
Pointers:    ▲    ▲
          left/mid right
```
* **State check**: `mid = 0`. Coord: `row = 0`, `col = 0`. `val = matrix[0][0] = 1`.
* **Updates**: Since `val (1) < target (3)`, narrow search boundary to the right: `left = mid + 1 = 1`.
* **Next**: Recalculate `mid`.

#### **Step 3: mid = 1**
```text
Virtual 1D: [  1,   3,   5,  10,  11,  16  ]
              idx0 idx1 idx2 idx3 idx4 idx5
Pointers:         ▲
             left/mid/right
```
* **State check**: `mid = 1`. Coord: `row = 0`, `col = 1`. `val = matrix[0][1] = 3`.
* **Updates**: `val === target`. Match found! Returns `true`.

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function searchMatrix(matrix: number[][], target: number): boolean {
    if (matrix.length === 0 || matrix[0].length === 0) return false;

    // ==========================================
    // 1st Approach: Dual Binary Search (O(log M + log N))
    // ==========================================
    /*
    let top = 0;
    let bottom = matrix.length - 1;
    let targetRow = -1;

    while (top <= bottom) {
        let mid = Math.floor((top + bottom) / 2);
        if (matrix[mid][0] <= target && target <= matrix[mid][matrix[mid].length - 1]) {
            targetRow = mid;
            break;
        } else if (matrix[mid][0] > target) {
            bottom = mid - 1;
        } else {
            top = mid + 1;
        }
    }

    if (targetRow === -1) return false;

    let l = 0;
    let r = matrix[targetRow].length - 1;
    while (l <= r) {
        let mid = Math.floor((l + r) / 2);
        if (matrix[targetRow][mid] === target) return true;
        else if (matrix[targetRow][mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    return false;
    */

    // ==========================================
    // 2nd Approach: Flattened Binary Search (Optimal)
    // ==========================================
    const rows = matrix.length;
    const cols = matrix[0].length;
    let left = 0;
    let right = rows * cols - 1;

    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        const row = Math.floor(mid / cols);
        const col = mid % cols;
        const val = matrix[row][col];

        if (val === target) {
            return true;
        } else if (val < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return false;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Dual BS | Approach 2: Flattened BS |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(\log M + \log N)$** — Row search then column search. | **$O(\log(M \cdot N))$** — Single binary search over flat space. |
| **Space Complexity** | **$O(1)$** — Constant auxiliary variables. | **$O(1)$** — Constant variables. |

#### Edge Cases Handled:
* **Single Element Matrix** (`matrix = [[5]]`, `target = 5`): `left = 0, right = 0, mid = 0`. Matches and returns `true` (Correct).
* **Target Out of Range** (`target = 99`): `left` keeps advancing rightward until `left > right`. Returns `false` (Correct).
* **Empty Matrix** (`matrix = []`): Addressed by the early exit guard clause (Correct).
