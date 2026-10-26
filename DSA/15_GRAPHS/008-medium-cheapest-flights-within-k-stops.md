# 008. Cheapest Flights Within K Stops (Medium)

**Sheet**: Namaste DSA · 14. Graphs · [LeetCode 787](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

**Interview Tag**: 🔥 **MUST SOLVE** - Shortest path with a **limit on edges**. Plain Dijkstra breaks here; **Bellman-Ford with `k + 1` rounds** fits exactly.

---

### 📝 1. Problem Statement
There are `n` cities and directed `flights[i] = [from, to, price]`. Return the cheapest price from `src` to `dst` using **at most `k` stops** (so at most `k + 1` flights), or `-1` if there's no such route.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `n = 4`, `flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]]`, `src = 0`, `dst = 3`, `k = 1`
* **Output**: `700`
* **Why**: 0 → 1 → 3 costs 700. 0 → 1 → 2 → 3 costs 400 but needs 2 stops.

#### Test Case 2
* **Input**: `n = 3`, `flights = [[0,1,100],[1,2,100],[0,2,500]]`, `src = 0`, `dst = 2`, `k = 1`
* **Output**: `200`

#### Test Case 3
* **Input**: `n = 3`, `flights = [[0,1,100],[1,2,100],[0,2,500]]`, `src = 0`, `dst = 2`, `k = 0`
* **Output**: `500`
* **Why**: No stops allowed, so only the direct flight counts.

#### Test Case 4
* **Input**: `n = 2`, `flights = [[1,0,100]]`, `src = 0`, `dst = 1`, `k = 1`
* **Output**: `-1`

---

### 💬 3. What is This Problem Actually Asking?
After round `r` of Bellman-Ford, `cost[v]` is the cheapest price to reach `v` using **at most `r` flights**. So run exactly `k + 1` rounds and read `cost[dst]`. The catch: each round must read from the **previous round's** costs, otherwise one round could chain several flights together.

---

### 🌍 4. Real-Life Example
A **travel agent limited to 1 layover**. Round 1: list the price of every city you can reach directly. Round 2: for every city reached in round 1, see if one more flight gets somewhere cheaper. Stop after round 2, however tempting a cheaper 3-flight route looks.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: `cost[]` array plus a copy per round.
* **Algorithm**: **Bellman-Ford limited to `k + 1` rounds**: relax every flight from a **snapshot** of the previous round.
* **Why not plain Dijkstra**: it keeps only the cheapest way to each city, but a pricier route with **fewer** stops may be the only one that fits the limit. (Dijkstra on `(city, stops)` states also works.)

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: test 1, `k = 1` → 2 rounds

| round | cost[0] | cost[1] | cost[2] | cost[3] |
| :---: | :---: | :---: | :---: | :---: |
| start | 0 | ∞ | ∞ | ∞ |
| 1 (≤ 1 flight) | 0 | 100 | ∞ | ∞ |
| 2 (≤ 2 flights) | 0 | 100 | 200 | 700 |

Returns `700`. (A 3rd round would find 400, but it isn't allowed.)

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
    let cost: number[] = new Array(n).fill(Infinity);
    cost[src] = 0;

    // Round r allows at most r flights; k stops means k + 1 flights
    for (let round = 0; round <= k; round++) {
        const next = [...cost]; // relax from the previous round only
        for (const [from, to, price] of flights) {
            if (cost[from] !== Infinity && cost[from] + price < next[to]) {
                next[to] = cost[from] + price;
            }
        }
        cost = next;
    }
    return cost[dst] === Infinity ? -1 : cost[dst];
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(k \cdot E)$**.
* **Space Complexity**: **$O(n)$**.

#### Edge Cases Handled:
* **`k = 0`**: one round, direct flights only.
* **Unreachable `dst`**: stays `Infinity`, returns `-1`.
* **Updating `cost` in place** inside a round would let `0 → 1 → 2` happen in round 1, breaking the stop limit.
