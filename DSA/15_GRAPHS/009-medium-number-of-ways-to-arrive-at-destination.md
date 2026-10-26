# 009. Number of Ways to Arrive at Destination (Medium)

**Sheet**: Namaste DSA · 14. Graphs · [LeetCode 1976](https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/)

**Interview Tag**: 🔥 **MUST SOLVE** - **Dijkstra + counting**: keep, for each node, how many shortest paths reach it.

---

### 📝 1. Problem Statement
A city has intersections `0 … n-1` and **two-way** roads `roads[i] = [u, v, time]`. Return the number of **different shortest-time routes** from `0` to `n - 1`, modulo $10^9 + 7$.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `n = 7`, `roads = [[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]]`
* **Output**: `4`
* **Why**: The shortest time is 7, achieved by `0→6`, `0→4→6`, `0→1→2→5→6` and `0→1→3→5→6`.

#### Test Case 2
* **Input**: `n = 2`, `roads = [[1,0,10]]`
* **Output**: `1`

#### Test Case 3
* **Input**: `n = 4`, `roads = [[0,1,1],[0,2,1],[1,3,1],[2,3,1]]`
* **Output**: `2`

---

### 💬 3. What is This Problem Actually Asking?
Run Dijkstra. Alongside `dist[v]`, keep `ways[v]` = number of shortest routes to `v`. When relaxing `u → v`:
* **strictly shorter** route found → `dist[v] = new`, `ways[v] = ways[u]` (old routes are no longer shortest);
* **equally short** → `ways[v] += ways[u]` (more ways to arrive at the same best time).

---

### 🌍 4. Real-Life Example
A **delivery app** finding the quickest route and how many equally quick alternatives exist. If you can reach a junction in 10 minutes via 2 routes, and another junction in 10 minutes via 3 routes, a shop just after both with equal road times has 5 equally quick routes.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structures**: adjacency list; a **min-heap** of `[time, node]`; `dist[]` and `ways[]`.
* **Algorithm**: **Dijkstra with path counting**. A node's `ways` is final when it's popped with its final distance, because all its shortest predecessors were popped earlier (times are positive).
* Skip stale heap entries (`time > dist[node]`).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: test 3 (a square 0–1–3 and 0–2–3, each road 1)

| pop | relax | `dist` | `ways` |
| :---: | :--- | :--- | :--- |
| 0 (0) | 1 ← 1, 2 ← 1 | [0,1,1,∞] | [1,1,1,0] |
| 1 (1) | 3 ← 2 (shorter) | [0,1,1,2] | [1,1,1,1] |
| 2 (1) | 3 = 2 (equal) | [0,1,1,2] | [1,1,1,2] |
| 3 (2) | — | | |

Returns `ways[3] = 2`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class MinHeap {
    private items: [number, number][] = []; // [time, node]

    get size(): number {
        return this.items.length;
    }

    push(item: [number, number]): void {
        const a = this.items;
        a.push(item);
        let i = a.length - 1;
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (a[p][0] <= a[i][0]) break;
            [a[p], a[i]] = [a[i], a[p]];
            i = p;
        }
    }

    pop(): [number, number] {
        const a = this.items;
        const top = a[0];
        const last = a.pop()!;
        if (a.length > 0) {
            a[0] = last;
            let i = 0;
            while (true) {
                const l = 2 * i + 1;
                const r = l + 1;
                let m = i;
                if (l < a.length && a[l][0] < a[m][0]) m = l;
                if (r < a.length && a[r][0] < a[m][0]) m = r;
                if (m === i) break;
                [a[m], a[i]] = [a[i], a[m]];
                i = m;
            }
        }
        return top;
    }
}

function countPaths(n: number, roads: number[][]): number {
    const MOD = 1_000_000_007;
    const graph: [number, number][][] = Array.from({ length: n }, () => []);
    for (const [u, v, t] of roads) {
        graph[u].push([v, t]);
        graph[v].push([u, t]); // two-way roads
    }

    const dist: number[] = new Array(n).fill(Infinity);
    const ways: number[] = new Array(n).fill(0);
    dist[0] = 0;
    ways[0] = 1;

    const heap = new MinHeap();
    heap.push([0, 0]);
    while (heap.size > 0) {
        const [time, u] = heap.pop();
        if (time > dist[u]) continue; // stale entry

        for (const [v, t] of graph[u]) {
            const arrive = time + t;
            if (arrive < dist[v]) {
                dist[v] = arrive;            // strictly faster: start counting again
                ways[v] = ways[u];
                heap.push([arrive, v]);
            } else if (arrive === dist[v]) {
                ways[v] = (ways[v] + ways[u]) % MOD; // another equally fast way in
            }
        }
    }
    return ways[n - 1];
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(E \log V)$**.
* **Space Complexity**: **$O(V + E)$**.

#### Edge Cases Handled:
* **Two nodes, one road**: `1`.
* **Large counts**: kept under $10^9 + 7$ with `% MOD` on every addition.
* **Large times**: shortest times can reach about $10^{12}$, still exact in a JS number (below $2^{53}$).
