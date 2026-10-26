# 007. Number of Operations to Make Network Connected (Medium)

**Sheet**: Namaste DSA · 14. Graphs · [LeetCode 1319](https://leetcode.com/problems/number-of-operations-to-make-network-connected/)

**Interview Tag**: 🔥 **MUST SOLVE** - **Union-Find** (Disjoint Set Union) in its natural habitat: counting components.

---

### 📝 1. Problem Statement
`n` computers are numbered `0 … n-1`, and `connections[i] = [a, b]` is a cable between two of them. In one operation you can **unplug any cable and plug it between two other computers**. Return the minimum number of operations to connect every computer, or `-1` if it's impossible.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `n = 4`, `connections = [[0,1],[0,2],[1,2]]`
* **Output**: `1`
* **Why**: Cable 1–2 is redundant; move it to connect computer 3.

#### Test Case 2
* **Input**: `n = 6`, `connections = [[0,1],[0,2],[0,3],[1,2],[1,3]]`
* **Output**: `2`

#### Test Case 3
* **Input**: `n = 6`, `connections = [[0,1],[0,2],[0,3],[1,2]]`
* **Output**: `-1`
* **Why**: 6 computers need at least 5 cables; there are only 4.

---

### 💬 3. What is This Problem Actually Asking?
* Connecting `n` computers needs at least `n - 1` cables. Fewer → `-1`.
* Otherwise there are always enough spare cables, and the answer is **(number of connected groups) − 1**: one cable joins two groups.

So the real work is counting connected components.

---

### 🌍 4. Real-Life Example
Several **office networks** that aren't linked yet. To make one network out of 3 islands you need 2 bridges. As long as there are enough cables in total, the redundant ones (loops inside an island) can be repurposed as bridges.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: **Union-Find** with path compression (and union by size).
  * `find(x)` returns the group's representative, flattening the path as it goes.
  * `union(a, b)` merges two groups and returns `false` if they were already the same.
* **Algorithm**: start with `components = n`; every successful union reduces it by 1. Answer: `components - 1`.
* **Alternative**: BFS/DFS from every unvisited computer, counting starts.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `n = 4`, `connections = [[0,1],[0,2],[1,2]]`

| cable | same group already? | `components` |
| :---: | :---: | :---: |
| start | | 4 |
| 0–1 | no → merge | 3 |
| 0–2 | no → merge | 2 |
| 1–2 | yes (spare cable) | 2 |

`3 cables ≥ n - 1 = 3`, answer `2 - 1 = 1`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function makeConnected(n: number, connections: number[][]): number {
    if (connections.length < n - 1) return -1; // not enough cables in total

    const parent = Array.from({ length: n }, (_, i) => i);
    const size: number[] = new Array(n).fill(1);

    function find(x: number): number {
        while (parent[x] !== x) {
            parent[x] = parent[parent[x]]; // path compression (halving)
            x = parent[x];
        }
        return x;
    }

    let components = n;
    for (const [a, b] of connections) {
        let ra = find(a);
        let rb = find(b);
        if (ra === rb) continue;           // redundant cable inside one group
        if (size[ra] < size[rb]) [ra, rb] = [rb, ra];
        parent[rb] = ra;                   // union by size
        size[ra] += size[rb];
        components--;
    }
    return components - 1;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(E \cdot \alpha(n))$**, effectively linear ($\alpha$ is the inverse Ackermann function).
* **Space Complexity**: **$O(n)$**.

#### Edge Cases Handled:
* **Too few cables**: `-1` before any work.
* **Already connected**: one component, answer `0`.
* **Isolated computers**: each is its own component until a cable reaches it.
