# 005. Insert Interval (Medium)

**Sheet**: Namaste DSA · 12. Greedy Algorithm · [LeetCode 57](https://leetcode.com/problems/insert-interval/)

**Interview Tag**: 🔥 **MUST SOLVE** - The intervals pattern in its tidiest form: **before, overlapping, after**.

---

### 📝 1. Problem Statement
`intervals` is a list of non-overlapping `[start, end]` intervals sorted by start. Insert `newInterval` so the list stays sorted and non-overlapping, merging wherever needed. Return the new list.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `intervals = [[1,3],[6,9]]`, `newInterval = [2,5]`
* **Output**: `[[1,5],[6,9]]`

#### Test Case 2
* **Input**: `intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]]`, `newInterval = [4,8]`
* **Output**: `[[1,2],[3,10],[12,16]]`
* **Why**: `[4,8]` overlaps `[3,5]`, `[6,7]` and `[8,10]`, which all merge into `[3,10]`.

#### Test Case 3
* **Input**: `intervals = []`, `newInterval = [5,7]`
* **Output**: `[[5,7]]`

#### Test Case 4
* **Input**: `intervals = [[1,5]]`, `newInterval = [6,8]`
* **Output**: `[[1,5],[6,8]]`

---

### 💬 3. What is This Problem Actually Asking?
The existing intervals fall into three groups relative to the new one:
1. ending **before** it starts → copy as is;
2. **overlapping** it → swallow into it (min of starts, max of ends);
3. starting **after** it ends → copy as is.

---

### 🌍 4. Real-Life Example
Adding a **meeting to a calendar** that's already tidy. Meetings that finish before yours stay. Meetings that clash with yours are merged into one big blocked slot. Meetings after yours stay.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: the sorted interval list, scanned once.
* **Algorithm**: **Linear three-phase scan**:
  * while `intervals[i][1] < newStart` → push it;
  * while `intervals[i][0] <= newEnd` → `newStart = min`, `newEnd = max`;
  * push the merged interval, then the rest.
* No sort is needed because the input is already sorted.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `[[1,2],[3,5],[6,7],[8,10],[12,16]]`, `newInterval = [4,8]`

| interval | phase | merged so far | result |
| :---: | :--- | :---: | :--- |
| [1,2] | before (2 < 4) | [4,8] | [[1,2]] |
| [3,5] | overlap (3 ≤ 8) | [3,8] | |
| [6,7] | overlap | [3,8] | |
| [8,10] | overlap (8 ≤ 8) | [3,10] | |
| — | push merged | | [[1,2],[3,10]] |
| [12,16] | after | | [[1,2],[3,10],[12,16]] |

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function insert(intervals: number[][], newInterval: number[]): number[][] {
    const result: number[][] = [];
    let [start, end] = newInterval;
    let i = 0;

    // 1. Intervals that end before the new one starts
    while (i < intervals.length && intervals[i][1] < start) {
        result.push(intervals[i++]);
    }
    // 2. Intervals that overlap: grow the new interval to cover them
    while (i < intervals.length && intervals[i][0] <= end) {
        start = Math.min(start, intervals[i][0]);
        end = Math.max(end, intervals[i][1]);
        i++;
    }
    result.push([start, end]);
    // 3. Intervals that start after it ends
    while (i < intervals.length) {
        result.push(intervals[i++]);
    }
    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n)$**, one pass.
* **Space Complexity**: **$O(n)$** for the output.

#### Edge Cases Handled:
* **Empty list**: phases 1 and 2 skip, returns `[newInterval]`.
* **Touching intervals** (`[1,5]` and `[5,7]`): `5 <= 5` counts as overlap, so they merge.
* **New interval before or after everything**: lands in the right place through phases 1 and 3.
