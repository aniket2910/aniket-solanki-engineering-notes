# 🪙 Topic 13: Greedy Algorithms

Welcome to the **Greedy Algorithms Revision Hub**. A greedy algorithm makes the locally best choice at every step and never revisits it. This page covers when that's safe, the handful of greedy shapes interviews reuse, and the solved catalog.

---

## 📌 1. Core Greedy Theory (Quick Recall)

* **The bet**: at each step, take the option that looks best right now, and never undo it. No backtracking, no table of sub-answers.
* **When it's safe**: when you can argue that some optimal answer **starts with the greedy choice** (the "greedy choice property"), and the rest of the problem is a smaller copy of the original (optimal substructure).
* **How to argue it in an interview**: the **exchange argument**. "Take any optimal answer. If it doesn't use my greedy choice, swap that choice in. The answer doesn't get worse. So an optimal answer with my choice exists."
* **When it fails**: if a counter-example exists, use DP. Coin Change with coins `[1,3,4]` and amount 6 is the classic: greedy gives `4+1+1`, the best is `3+3`.
* **Complexity**: usually dominated by a **sort**, $O(n \log n)$, followed by one linear pass.

---

## 💡 2. Major Greedy Patterns

### A. Sort, then sweep
* **What**: Sort by the right key, then walk once making decisions.
* **The key matters**: sort by **difference** ([Two City Scheduling](./001-medium-two-city-scheduling.md)), by **end time** ([Non-overlapping Intervals](./007-medium-non-overlapping-intervals.md)), or both arrays ([Assign Cookies](./002-easy-assign-cookies.md)).

### B. Intervals
* **What**: Classify each interval as before / overlapping / after, or keep the earliest-ending one.
* **Examples**: [Insert Interval](./005-medium-insert-interval.md), [Merge Intervals](../05_ARRAYS/013-medium-merge-intervals.md), [Non-overlapping Intervals](./007-medium-non-overlapping-intervals.md).

### C. Running state with a reset
* **What**: Track one running quantity; when it goes bad, reset and move the start forward.
* **Examples**: [Gas Station](./009-medium-gas-station.md), Kadane's algorithm.

### D. Two passes
* **What**: Satisfy the constraint from the left, then from the right, and combine.
* **Example**: [Candy](./011-hard-candy.md).

### E. Counting / sweep line
* **What**: Turn events into `+1 / −1` changes and prefix-sum them.
* **Examples**: [Car Pooling](./010-medium-car-pooling.md), [Task Scheduler](./008-medium-task-scheduler.md) (counting formula).

---

## 📂 3. Problem Catalog

| Index | Problem Name | Difficulty | Core Pattern / Concept |
| :---: | :--- | :---: | :--- |
| `001` | [Two City Scheduling](./001-medium-two-city-scheduling.md) 🔥 | 🟡 Medium | Sort by Cost Difference |
| `002` | [Assign Cookies](./002-easy-assign-cookies.md) | 🟢 Easy | Sort Both + Two Pointers |
| `003` | [Lemonade Change](./003-easy-lemonade-change.md) | 🟢 Easy | Simulation, Spend Big Bills First |
| `004` | [Best Time to Buy and Sell Stock II](./004-medium-best-time-to-buy-and-sell-stock-ii.md) 🔥 | 🟡 Medium | Sum of Positive Differences |
| `005` | [Insert Interval](./005-medium-insert-interval.md) 🔥 | 🟡 Medium | Before / Overlap / After Scan |
| `006` | [Merge Intervals](../05_ARRAYS/013-medium-merge-intervals.md) 🔥 | 🟡 Medium | Sort by Start + Merge |
| `007` | [Partition Labels](./006-medium-partition-labels.md) 🔥 | 🟡 Medium | Last Occurrence + Stretching Window |
| `008` | [Non-overlapping Intervals](./007-medium-non-overlapping-intervals.md) 🔥 | 🟡 Medium | Earliest End First (Activity Selection) |
| `009` | [Task Scheduler](./008-medium-task-scheduler.md) 🔥 | 🟡 Medium | Frame Around the Most Frequent Task |
| `010` | [Gas Station](./009-medium-gas-station.md) 🔥 | 🟡 Medium | Running Tank with Reset |
| `011` | [Car Pooling](./010-medium-car-pooling.md) 🔥 | 🟡 Medium | Difference Array / Sweep Line |
| `012` | [Candy](./011-hard-candy.md) 🔥 | 🔴 Hard | Two-Pass Left/Right Constraints |

---

**Revision Checklist**: before coding a greedy, say the exchange argument out loud in one sentence. If you can't, look for a counter-example; if you find one, it's a DP problem.
