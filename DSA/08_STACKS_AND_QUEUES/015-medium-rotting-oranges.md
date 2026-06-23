# 015. Rotting Oranges (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **MUST SOLVE** - A top-tier interview favorite. Demonstrates how to use a queue to simulate a **multi-source Breadth-First Search (BFS)** for modeling parallel spread simulations.

---

### 📝 1. Problem Statement
You are given an `m x n` `grid` where each cell can have one of three values:
* `0` representing an empty cell,
* `1` representing a fresh orange, or
* `2` representing a rotten orange.

Every minute, any fresh orange that is **4-directionally adjacent** (up, down, left, right) to a rotten orange becomes rotten.

Return *the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return `-1`*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `grid = [[2,1,1],[1,1,0],[0,1,1]]`
* **Output**: `4`

#### Test Case 2
* **Input**: `grid = [[2,1,1],[0,1,1],[1,0,1]]`
* **Output**: `-1`
* **Why**: The fresh orange at the bottom-left corner (row 2, col 0) is isolated because empty cells block the spread.

#### Test Case 3
* **Input**: `grid = [[0,2]]`
* **Output**: `0`
* **Why**: Since there are already 0 fresh oranges, 0 minutes are needed.

---

### 💬 3. What is This Problem Actually Asking?
We need to simulate a contagion spreading in a grid.
Since multiple rotten oranges can start rotting their neighbors simultaneously, the spread happens in **parallel waves**. This level-by-level parallel progression matches a **Breadth-First Search (BFS)**, which uses a queue.

---

### 🌍 4. Real-Life Example
Think of a **wildfire spreading in a forest**:
* Some trees are already on fire (`2` - rotten oranges).
* Other trees are green and healthy (`1` - fresh oranges).
* Fire spreads in waves to adjacent trees.
* If a healthy tree is blocked by a lake or concrete barrier (`0`), the fire can never reach it. We want to find the total time it takes for the entire forest to burn down.

---

### 🛠️ 5. Data Structure & Algorithms Used

We use a **BFS Queue** to simulate time layers:
1. Scan the grid to count all fresh oranges (`freshCount`) and push the coordinates `[r, c]` of all starting rotten oranges into a `queue`.
2. Initialize `minutes = 0`.
3. While the `queue` is not empty and `freshCount > 0`:
   * Get the number of rotten oranges in this wave (let's call it `size`).
   * Process all `size` oranges:
     * For each, check its 4 neighbors (up, down, left, right).
     * If a neighbor is within bounds and is a fresh orange (`1`):
       * Change it to rotten (`2`).
       * Decrement `freshCount` by 1.
       * Enqueue the neighbor's coordinates.
   * If any new oranges were rotted in this round, increment `minutes` by 1.
4. After BFS finishes, if `freshCount === 0`, return `minutes`. Otherwise, return `-1`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Dry run with `grid = [[2, 1, 1], [1, 1, 0], [0, 1, 1]]`:

#### **Step 0: Initial Count**
* Rotten oranges at: `[[0, 0]]`. Queue = `[ [0,0] ]`.
* `freshCount` = `6`. `minutes` = `0`.

#### **Minute 1 (BFS Wave 1)**
* Pop `[0,0]`. Its fresh neighbors are `[0, 1]` and `[1, 0]`.
* Mark them rotten. `freshCount` becomes `4`. Enqueue both.
* Queue = `[ [0, 1], [1, 0] ]`. `minutes` becomes `1`.

#### **Minute 2 (BFS Wave 2)**
* Pop `[0, 1]`. Neighbor `[0, 2]` is fresh. Mark rotten, enqueue.
* Pop `[1, 0]`. Neighbor `[1, 1]` is fresh. Mark rotten, enqueue.
* `freshCount` becomes `2`.
* Queue = `[ [0, 2], [1, 1] ]`. `minutes` becomes `2`.

#### **Minute 3 (BFS Wave 3)**
* Pop `[0, 2]`. No fresh neighbors.
* Pop `[1, 1]`. Neighbor `[2, 1]` is fresh. Mark rotten, enqueue.
* `freshCount` becomes `1`.
* Queue = `[ [2, 1] ]`. `minutes` becomes `3`.

#### **Minute 4 (BFS Wave 4)**
* Pop `[2, 1]`. Neighbor `[2, 2]` is fresh. Mark rotten, enqueue.
* `freshCount` becomes `0`.
* Queue = `[ [2, 2] ]`. `minutes` becomes `4`.

* Since `freshCount === 0`, the loop terminates. Returns `4`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function orangesRotting(grid: number[][]): number {
    const rows = grid.length;
    const cols = grid[0].length;
    const queue: [number, number][] = [];
    let freshCount = 0;

    // Step 1: Scan grid to count fresh oranges and enqueue rotten ones
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 2) {
                queue.push([r, c]);
            } else if (grid[r][c] === 1) {
                freshCount++;
            }
        }
    }

    if (freshCount === 0) return 0;

    let minutes = 0;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Up, Down, Left, Right

    // Step 2: Multi-source BFS
    while (queue.length > 0 && freshCount > 0) {
        const levelSize = queue.length;
        let rottedThisMinute = false;

        for (let i = 0; i < levelSize; i++) {
            const [r, c] = queue.shift()!;

            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;

                // Check boundary and if orange is fresh
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
                    grid[nr][nc] = 2; // Rot the orange
                    freshCount--;
                    queue.push([nr, nc]);
                    rottedThisMinute = true;
                }
            }
        }

        if (rottedThisMinute) {
            minutes++;
        }
    }

    return freshCount === 0 ? minutes : -1;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Complexity | Description |
| :--- | :---: | :--- |
| **Time Complexity** | **$O(M \times N)$** | We visit each cell in the $M \times N$ grid a constant number of times during initialization and BFS search. |
| **Space Complexity** | **$O(M \times N)$** | In the worst-case, the queue can store all elements in the grid. |

#### Edge Cases Handled:
* **No Fresh Oranges** (`freshCount = 0`): Instantly returns `0`. Correct.
* **Oranges Cannot Be Reached** (isolated by empty cells): BFS terminates with `freshCount > 0`, returning `-1`. Correct.
