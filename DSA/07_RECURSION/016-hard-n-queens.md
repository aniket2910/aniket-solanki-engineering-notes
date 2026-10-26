# 016. N-Queens (Hard)

**Sheet**: Namaste DSA · 11. Backtracking · [LeetCode 51](https://leetcode.com/problems/n-queens/)

**Interview Tag**: 🔥 **MUST SOLVE** - The classic backtracking showcase. The senior signal is the $O(1)$ conflict check with column and diagonal sets.

---

### 📝 1. Problem Statement
Place `n` queens on an `n × n` chessboard so that **no two attack each other** (no shared row, column or diagonal). Return every distinct board, each as an array of strings where `"Q"` is a queen and `"."` is empty. Any order.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `n = 4`
* **Output**: `[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]`
* **Why**: There are exactly two solutions for a 4×4 board.

#### Test Case 2
* **Input**: `n = 1`
* **Output**: `[["Q"]]`

#### Test Case 3
* **Input**: `n = 3`
* **Output**: `[]`
* **Why**: No arrangement works on 2×2 or 3×3 boards.

---

### 💬 3. What is This Problem Actually Asking?
Every row gets **exactly one** queen. So go row by row, choose a column for that row's queen, and only continue if that column and both diagonals are still free. When all `n` rows are filled, record the board.

---

### 🌍 4. Real-Life Example
Seating **`n` rival guests** at a banquet grid where rivals can't share a row, a column or a diagonal line of sight. You seat one guest per row; if a row has no safe seat left, you go back and move the previous guest.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structures**: three sets for $O(1)$ conflict checks:
  * `cols`: columns already holding a queen.
  * `diag`: `row - col` is constant along a "\" diagonal.
  * `anti`: `row + col` is constant along a "/" diagonal.
* **Algorithm**: **Backtracking row by row**. Place, add to the three sets, recurse to the next row, then remove (backtrack).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `n = 4` (first solution)

```text
row 0: col 0 → … dead end later, backtrack; col 1 ✔   . Q . .
row 1: col 3 ✔ (col 0 and 2 hit diagonals)            . . . Q
row 2: col 0 ✔                                         Q . . .
row 3: col 2 ✔                                         . . Q .
```

All rows filled → record `[".Q..","...Q","Q...","..Q."]`, then keep backtracking to find the second board.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function solveNQueens(n: number): string[][] {
    const result: string[][] = [];
    const queens: number[] = []; // queens[row] = column of that row's queen
    const cols = new Set<number>();
    const diag = new Set<number>();  // row - col
    const anti = new Set<number>();  // row + col

    function place(row: number): void {
        if (row === n) {
            result.push(queens.map((c) => ".".repeat(c) + "Q" + ".".repeat(n - c - 1)));
            return;
        }
        for (let col = 0; col < n; col++) {
            if (cols.has(col) || diag.has(row - col) || anti.has(row + col)) continue;

            queens.push(col);
            cols.add(col); diag.add(row - col); anti.add(row + col);

            place(row + 1);

            queens.pop();
            cols.delete(col); diag.delete(row - col); anti.delete(row + col);
        }
    }

    place(0);
    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n!)$** roughly: row 0 has `n` choices, row 1 at most `n - 1`, and so on, with diagonals pruning much more.
* **Space Complexity**: **$O(n)$** for the sets, `queens` and the recursion (output aside).

#### Edge Cases Handled:
* **`n = 1`**: one board, `["Q"]`.
* **`n = 2` and `n = 3`**: every branch dies, returns `[]`.
* **Building strings only at the end**: boards are built from `queens` once per solution, not copied on every step.
