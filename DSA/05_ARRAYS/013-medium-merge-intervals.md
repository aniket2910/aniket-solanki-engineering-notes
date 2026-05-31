# 013. Merge Overlapping Subintervals (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **SORTING AND MERGING** - Core scheduler problem. Tests interval overlap conditions and sorted merge boundaries.

---

### 📝 1. Problem Statement
Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `intervals = [[1,3],[2,6],[8,10],[15,18]]`
* **Output**: `[[1,6],[8,10],[15,18]]`
* **Why**: Since intervals `[1,3]` and `[2,6]` overlap, they merge into `[1,6]`.

#### Test Case 2
* **Input**: `intervals = [[1,4],[4,5]]`
* **Output**: `[[1,5]]`
* **Why**: Intervals `[1,4]` and `[4,5]` are considered overlapping at boundary index `4`.

---

### 💬 3. What is This Problem Actually Asking?
We need to group all overlapping time slices into single continuous ranges.

---

### 🌍 4. Real-Life Example
Think of booking meetings in a conference room. If one meeting is scheduled from 1:00 PM to 3:00 PM (`[1,3]`) and another from 2:00 PM to 6:00 PM (`[2,6]`), the conference room is booked continuously from 1:00 PM to 6:00 PM. We merge these bookings into a single block `[1,6]`.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing how interval sorting simplifies merge checks:

#### Approach 1: Brute Force Pairwise Merging
For every interval, we scan all other intervals to check for overlaps. If found, we merge them and restart the scans.
* **Pros**: Simple conceptual model.
* **Cons**: Incredibly slow ($O(N^2)$) and hard to manage overlapping sub-states accurately.

#### Approach 2: Sorting by Start Time then Single-Pass Merge (Optimal)
We sort all intervals based on their **start times** first.
* Once sorted, we insert the first interval into a `merged` list.
* For each subsequent interval:
  * If it overlaps with the last interval in `merged` (i.e. `current.start <= lastMerged.end`), we update `lastMerged.end = Math.max(lastMerged.end, current.end)`.
  * Otherwise, it does not overlap, so we push `current` into `merged` list.
* **Pros**: Optimal $O(N \log N)$ runtime, incredibly clean logic.
* **Cons**: Requires sorting.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `intervals = [[1, 3], [2, 6], [8, 10]]`.

#### **Step 0: Initial State (Before loop)**
* **Action**: Sort intervals by start time. Already sorted.
* **Variables**: `merged = [[1, 3]]`

#### **Step 1: i = 1 (interval = [2, 6])**
* **State check**: Compare with last merged `[1, 3]`. `current.start (2) <= lastMerged.end (3)`? Yes! (Overlap).
* **Updates**: Merge intervals. `lastMerged.end = Math.max(3, 6) = 6`.
* **merged**: `[[1, 6]]`
* **Next**: `i` advances to index 2.

#### **Step 2: i = 2 (interval = [8, 10])**
* **State check**: Compare with last merged `[1, 6]`. `current.start (8) <= lastMerged.end (6)`? No. (No overlap).
* **Updates**: Push `[8, 10]` to `merged`.
* **merged**: `[[1, 6], [8, 10]]`
* **Next**: Loop terminates. Returns `merged`.

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function merge(intervals: number[][]): number[][] {
    if (intervals.length <= 1) return intervals;

    // ==========================================
    // 1st Approach: Brute Force Pairwise Merging (O(N^2))
    // ==========================================
    /*
    // Check all combinations, merge overlapping elements,
    // and repeat until no overlaps remain. Unsuitable for production.
    */

    // ==========================================
    // 2nd Approach: Sorting and Single-Pass Merge (Optimal)
    // ==========================================
    // 1. Sort intervals by start time
    intervals.sort((a, b) => a[0] - b[0]);

    const merged: number[][] = [intervals[0]];

    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const lastMerged = merged[merged.length - 1];

        // 2. Check if current interval overlaps with the last merged interval
        if (current[0] <= lastMerged[1]) {
            // Overlap detected: merge by updating the end time
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
        } else {
            // No overlap: add the current interval as a new range
            merged.push(current);
        }
    }

    return merged;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Brute Force | Approach 2: Sort + Merge |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N^2)$** — Redundant pairwise scanning. | **$O(N \log N)$** — Dominating sorting phase. |
| **Space Complexity** | **$O(1)$** — Constant variables. | **$O(N)$** — Storage for sorted elements list. |

#### Edge Cases Handled:
* **Single Interval**: Returns input array directly.
* **Fully Nested Intervals** (`[[1, 10], [2, 3], [4, 5]]`): Correctly merges everything into `[[1, 10]]` via `Math.max` checks (Correct).
