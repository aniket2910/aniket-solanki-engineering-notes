# 010. Min Cost to Connect All Points (Medium)

**Sheet**: Namaste DSA · 14. Graphs · [LeetCode 1584](https://leetcode.com/problems/min-cost-to-connect-all-points/)

**Interview Tag**: 🔥 **MUST SOLVE** - **Minimum Spanning Tree**. On a complete graph, the array version of **Prim's** beats Kruskal's.

---

### 📝 1. Problem Statement
Given points `points[i] = [x, y]`, the cost to connect two points is their **Manhattan distance** `|x1 - x2| + |y1 - y2|`. Return the minimum total cost to connect all points, so that there's exactly one path between any two.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `points = [[0,0],[2,2],[3,10],[5,2],[7,0]]`
* **Output**: `20`

#### Test Case 2
* **Input**: `points = [[3,12],[-2,5],[-4,1]]`
* **Output**: `18`

#### Test Case 3
* **Input**: `points = [[0,0]]`
* **Output**: `0`

---

### 💬 3. What is This Problem Actually Asking?
"Connect everything as cheaply as possible, with no loops" is the definition of a **minimum spanning tree**. Every pair of points can be connected, so the graph is **complete**: about $n^2/2$ edges.

---

### 🌍 4. Real-Life Example
**Laying water pipes between villages**. Start from one village, and repeatedly lay the cheapest pipe from the connected network to a village that isn't connected yet, until every village is on the network.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Kruskal's
Build all $n^2/2$ edges, sort them, and add each with Union-Find unless it makes a cycle. $O(n^2 \log n)$ and $O(n^2)$ memory.

#### Approach 2: Prim's with an array (optimal for dense graphs)
* `best[i]` = cheapest edge from the current tree to point `i`.
* Repeat `n` times: pick the cheapest point not yet in the tree, add its `best` to the total, then update `best` for every remaining point using distances from the new point.
* $O(n^2)$ time, $O(n)$ memory, and no heap needed, because every point is a neighbour anyway.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `points = [[3,12],[-2,5],[-4,1]]`

| add point | cost | `best` for the rest |
| :---: | :---: | :--- |
| 0 (start) | 0 | p1: 12, p2: 18 |
| 1 | 12 | p2: min(18, 2 + 4 = 6) = 6 |
| 2 | 6 | — |

Total `0 + 12 + 6 = 18`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function minCostConnectPoints(points: number[][]): number {
    const n = points.length;
    const inTree: boolean[] = new Array(n).fill(false);
    const best: number[] = new Array(n).fill(Infinity); // cheapest link from the tree to each point
    best[0] = 0;

    let total = 0;
    for (let added = 0; added < n; added++) {
        // Pick the closest point not yet in the tree
        let u = -1;
        for (let i = 0; i < n; i++) {
            if (!inTree[i] && (u === -1 || best[i] < best[u])) u = i;
        }
        inTree[u] = true;
        total += best[u];

        // The new point may offer cheaper links to the others
        for (let v = 0; v < n; v++) {
            if (inTree[v]) continue;
            const d = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
            if (d < best[v]) best[v] = d;
        }
    }
    return total;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n^2)$**, which matches the number of edges in a complete graph.
* **Space Complexity**: **$O(n)$**.

#### Edge Cases Handled:
* **Single point**: total `0`.
* **Points sharing coordinates**: distance `0` edges are fine.
* **Negative coordinates**: `Math.abs` handles them.
