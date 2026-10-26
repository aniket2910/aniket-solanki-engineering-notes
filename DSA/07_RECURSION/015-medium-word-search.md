# 015. Word Search (Medium)

**Sheet**: Namaste DSA · 11. Backtracking · [LeetCode 79](https://leetcode.com/problems/word-search/)

**Interview Tag**: 🔥 **MUST SOLVE** - Backtracking on a **grid**: DFS in four directions, mark a cell visited, and un-mark it on the way back.

---

### 📝 1. Problem Statement
Given an `m × n` grid of letters `board` and a string `word`, return `true` if `word` can be traced through **horizontally or vertically adjacent** cells, using each cell **at most once**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]`, `word = "ABCCED"`
* **Output**: `true`

#### Test Case 2
* **Input**: `board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]`, `word = "SEE"`
* **Output**: `true`

#### Test Case 3
* **Input**: `board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]`, `word = "ABCB"`
* **Output**: `false`
* **Why**: After `A→B→C`, the only `B` nearby is the one already used.

#### Test Case 4
* **Input**: `board = [["a"]]`, `word = "a"`
* **Output**: `true`

---

### 💬 3. What is This Problem Actually Asking?
Try every cell as a starting point. From a cell that matches `word[i]`, step to a neighbour that matches `word[i + 1]`, and so on. A cell can't be reused **within one path**, but after a path fails it must be free again for other paths.

---

### 🌍 4. Real-Life Example
**Boggle**. You trace a word through touching tiles with your finger and can't press the same tile twice in one word. If a path dead-ends, you lift your finger back one tile and try a different neighbour.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: the grid itself, used as the visited marker (temporarily overwrite a cell with `"#"`).
* **Algorithm**: **DFS backtracking**. `dfs(r, c, i)`:
  1. `i === word.length` → found.
  2. Out of bounds, or `board[r][c] !== word[i]` → fail.
  3. Mark the cell, try the 4 neighbours with `i + 1`, then **restore** the letter.
* **Pruning**: if some letter appears more often in `word` than on the board, return `false` before searching.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `word = "SEE"`

```text
A B C E
S F C S
A D E E
```

* Start cells that match `S`: (1,0) and (1,3).
* From (1,0): neighbours `A`, `F`, `A`. None is `E`, so that start fails.
* From (1,3): up is (0,3) `E` → need second `E`: its neighbours `C`, `S`(used) fail. Back up. Down is (2,3) `E` → its neighbour (2,2) `E` matches the last letter. `i === 3`, return `true`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function exist(board: string[][], word: string): boolean {
    const rows = board.length;
    const cols = board[0].length;

    function dfs(r: number, c: number, i: number): boolean {
        if (i === word.length) return true;
        if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
        if (board[r][c] !== word[i]) return false;

        const saved = board[r][c];
        board[r][c] = "#"; // mark as used for this path

        const found =
            dfs(r + 1, c, i + 1) ||
            dfs(r - 1, c, i + 1) ||
            dfs(r, c + 1, i + 1) ||
            dfs(r, c - 1, i + 1);

        board[r][c] = saved; // un-mark: other paths may use this cell
        return found;
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (dfs(r, c, 0)) return true;
        }
    }
    return false;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(m \cdot n \cdot 3^L)$**, where $L$ is the word length: every cell is a start, and after the first step each cell has at most 3 unvisited neighbours.
* **Space Complexity**: **$O(L)$** recursion depth (the board is marked in place).

#### Edge Cases Handled:
* **Reusing a cell** (`"ABCB"`): the `"#"` mark blocks it.
* **Restoring the board**: without the restore, a failed path would leave cells blocked for later starts.
* **1×1 board**: works through the same checks.
