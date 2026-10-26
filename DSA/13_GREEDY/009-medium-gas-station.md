# 009. Gas Station (Medium)

**Sheet**: Namaste DSA · 12. Greedy Algorithm · [LeetCode 134](https://leetcode.com/problems/gas-station/)

**Interview Tag**: 🔥 **MUST SOLVE** - A one-pass greedy with a **reset rule**. The proof is the interview: why can you skip all the stations you just passed?

---

### 📝 1. Problem Statement
`n` gas stations sit on a circular road. Station `i` gives `gas[i]` fuel, and driving from `i` to `i + 1` costs `cost[i]`. Starting with an empty tank, return the index of the station from which you can drive **once around the circle**, or `-1` if impossible. If a solution exists, it is unique.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `gas = [1,2,3,4,5]`, `cost = [3,4,5,1,2]`
* **Output**: `3`

#### Test Case 2
* **Input**: `gas = [2,3,4]`, `cost = [3,4,3]`
* **Output**: `-1`
* **Why**: Total gas 9 < total cost 10. No start can work.

#### Test Case 3
* **Input**: `gas = [5,1,2,3,4]`, `cost = [4,4,1,5,1]`
* **Output**: `4`

---

### 💬 3. What is This Problem Actually Asking?
Two facts:
1. If **total gas < total cost**, it's impossible from anywhere.
2. If you start at `s` and run dry before reaching station `j`, then **no station between `s` and `j` works either** (you arrived at each of them with ≥ 0 fuel, and still failed). So the next candidate is `j + 1`.

---

### 🌍 4. Real-Life Example
A **road trip on a ring road**. If you set off from town A and run out before town F, starting at B, C, D or E won't help: you passed through those with fuel to spare and still didn't make it. Try starting at F.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Try every start
Simulate a full lap from each station. $O(n^2)$.

#### Approach 2: One pass with reset (optimal)
* `total += gas[i] - cost[i]` over everything (feasibility).
* `tank += gas[i] - cost[i]`; if `tank < 0`, set `start = i + 1` and `tank = 0`.
* Answer: `total < 0 ? -1 : start`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `gas = [1,2,3,4,5]`, `cost = [3,4,5,1,2]` → net `[-2,-2,-2,3,3]`

| `i` | net | `tank` | action | `start` |
| :---: | :---: | :---: | :--- | :---: |
| 0 | −2 | −2 | reset | 1 |
| 1 | −2 | −2 | reset | 2 |
| 2 | −2 | −2 | reset | 3 |
| 3 | 3 | 3 | — | 3 |
| 4 | 3 | 6 | — | 3 |

`total = 0 ≥ 0`, return `3`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function canCompleteCircuit(gas: number[], cost: number[]): number {
    let total = 0; // fuel left after a full lap from anywhere: decides feasibility
    let tank = 0;  // fuel since the current candidate start
    let start = 0;

    for (let i = 0; i < gas.length; i++) {
        const net = gas[i] - cost[i];
        total += net;
        tank += net;
        if (tank < 0) {
            // Can't reach i + 1 from start, nor from any station in between
            start = i + 1;
            tank = 0;
        }
    }
    return total < 0 ? -1 : start;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n)$**.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **Total shortfall**: `-1` regardless of `start`.
* **Single station**: works if `gas[0] >= cost[0]`.
* **Start in the last slot**: `start` can be `n - 1`; it never ends at `n` when `total ≥ 0`, because then the final stretch must be non-negative.
