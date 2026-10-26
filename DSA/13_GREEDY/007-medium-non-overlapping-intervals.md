# 007. Non-overlapping Intervals (Medium)

**Sheet**: Namaste DSA · 12. Greedy Algorithm · [LeetCode 435](https://leetcode.com/problems/non-overlapping-intervals/)

**Interview Tag**: 🔥 **MUST SOLVE** - The **activity selection** problem in disguise: sort by **end**, not by start.

---

### 📝 1. Problem Statement
Given `intervals`, return the **minimum number of intervals to remove** so the rest don't overlap. Intervals that only touch (`[1,2]` and `[2,3]`) do **not** overlap.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `intervals = [[1,2],[2,3],[3,4],[1,3]]`
* **Output**: `1`
* **Why**: Remove `[1,3]`; the rest only touch.

#### Test Case 2
* **Input**: `intervals = [[1,2],[1,2],[1,2]]`
* **Output**: `2`

#### Test Case 3
* **Input**: `intervals = [[1,2],[2,3]]`
* **Output**: `0`

#### Test Case 4
* **Input**: `intervals = [[1,100],[11,22],[1,11],[2,12]]`
* **Output**: `2`
* **Why**: Keep `[1,11]` and `[11,22]`; remove the other two.

---

### 💬 3. What is This Problem Actually Asking?
Removing the fewest = **keeping the most**. To keep as many as possible, always keep the interval that **finishes earliest**, because it leaves the most room for the rest.

---

### 🌍 4. Real-Life Example
Booking **one meeting room** for as many meetings as possible. Pick the meeting that ends first, then the next one that starts after it ends, and so on. A long meeting that starts early would block many short ones.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: intervals sorted by end time.
* **Algorithm**: **Greedy (earliest end first)**:
  * Keep the first interval, remember `prevEnd`.
  * Next interval starts at or after `prevEnd` → keep it, update `prevEnd`.
  * Otherwise it overlaps → remove it (count it), keep `prevEnd` (the earlier end is better).
* **Why sort by end, not start**: `[1,100]` starts first but would block everything.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `[[1,100],[11,22],[1,11],[2,12]]` → sorted by end: `[1,11], [2,12], [11,22], [1,100]`

| interval | start ≥ `prevEnd`? | action | `prevEnd` | removed |
| :---: | :---: | :--- | :---: | :---: |
| [1,11] | first | keep | 11 | 0 |
| [2,12] | 2 < 11 | remove | 11 | 1 |
| [11,22] | 11 ≥ 11 | keep | 22 | 1 |
| [1,100] | 1 < 22 | remove | 22 | 2 |

Returns `2`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function eraseOverlapIntervals(intervals: number[][]): number {
    if (intervals.length === 0) return 0;
    const sorted = [...intervals].sort((a, b) => a[1] - b[1]); // earliest end first

    let removed = 0;
    let prevEnd = sorted[0][1];
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i][0] >= prevEnd) {
            prevEnd = sorted[i][1]; // no overlap: keep it
        } else {
            removed++;              // overlaps the kept one, which ends earlier: drop this
        }
    }
    return removed;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n \log n)$** for the sort.
* **Space Complexity**: **$O(n)$** for the sorted copy.

#### Edge Cases Handled:
* **Touching intervals**: `>=` treats `[1,2]` then `[2,3]` as compatible.
* **Identical intervals**: all but one are removed.
* **Empty input**: `0`.
