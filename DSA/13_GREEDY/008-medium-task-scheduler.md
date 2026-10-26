# 008. Task Scheduler (Medium)

**Sheet**: Namaste DSA · 12. Greedy Algorithm · [LeetCode 621](https://leetcode.com/problems/task-scheduler/)

**Interview Tag**: 🔥 **MUST SOLVE** - A greedy with a **counting formula**. Interviewers often accept the heap simulation, then ask for the $O(n)$ formula.

---

### 📝 1. Problem Statement
`tasks` is a list of CPU tasks labelled `A`–`Z`. Each takes one time unit. Two runs of the **same** task must be at least `n` units apart (the CPU can idle meanwhile). Return the minimum number of units to finish all tasks.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `tasks = ["A","A","A","B","B","B"]`, `n = 2`
* **Output**: `8`
* **Why**: `A B idle A B idle A B`.

#### Test Case 2
* **Input**: `tasks = ["A","C","A","B","D","B"]`, `n = 1`
* **Output**: `6`
* **Why**: `A B A B C D`, no idling needed.

#### Test Case 3
* **Input**: `tasks = ["A","A","A","B","B","B"]`, `n = 3`
* **Output**: `10`
* **Why**: `A B idle idle A B idle idle A B`.

---

### 💬 3. What is This Problem Actually Asking?
The **most frequent task** decides the shape. If `A` appears `maxCount` times, there are `maxCount - 1` gaps between them, each needing `n` slots after the `A`. That's a frame of `(maxCount - 1) * (n + 1)` slots, plus one final slot for each task tied at `maxCount`. Other tasks fill the gaps; if there are more tasks than slots, no idling is needed and the answer is just `tasks.length`.

---

### 🌍 4. Real-Life Example
A **gym routine** where each muscle group needs `n` days of rest. If you have to train legs 3 times with 2 rest days between, the schedule is at least `legs _ _ legs _ _ legs`. Other workouts can go in the blanks; only leftover blanks become rest days.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Max-heap simulation
Each cycle of `n + 1` slots, run the most frequent remaining tasks. Easy to explain, $O(n \log 26)$.

#### Approach 2: Counting formula (optimal)
* `maxCount` = highest frequency; `tiedAtMax` = how many tasks have it.
* `answer = max(tasks.length, (maxCount - 1) * (n + 1) + tiedAtMax)`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `tasks = ["A","A","A","B","B","B"]`, `n = 2`

* Counts: A = 3, B = 3 → `maxCount = 3`, `tiedAtMax = 2`.
* Frame: `(3 - 1) * (2 + 1) + 2 = 6 + 2 = 8`.

```text
[A B _] [A B _] [A B]
```

* `max(6, 8) = 8`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function leastInterval(tasks: string[], n: number): number {
    const counts = new Array(26).fill(0);
    for (const t of tasks) counts[t.charCodeAt(0) - 65]++;

    const maxCount = Math.max(...counts);
    const tiedAtMax = counts.filter((c) => c === maxCount).length;

    // Frame built around the most frequent task, or no idling at all if tasks fill it
    const frame = (maxCount - 1) * (n + 1) + tiedAtMax;
    return Math.max(tasks.length, frame);
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(T)$** for counting `T` tasks (26 is constant).
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **`n = 0`**: frame is `maxCount - 1 + tiedAtMax ≤ T`, answer is `T`.
* **Many different tasks**: the frame overflows and `tasks.length` wins.
* **Several tasks tied at the max**: each adds one slot to the last row.
