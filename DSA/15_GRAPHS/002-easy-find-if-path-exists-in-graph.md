# 002. Find if Path Exists in Graph (Easy)

**Sheet**: Namaste DSA · 14. Graphs · [LeetCode 1971](https://leetcode.com/problems/find-if-path-exists-in-graph/)

**Interview Tag**: 🔥 **MUST SOLVE** - Build an **adjacency list** from an edge list, then BFS. Every later graph problem starts with these two steps.

---

### 📝 1. Problem Statement
There are `n` vertices `0 … n-1` and a list of **undirected** `edges`. Return `true` if there's a path from `source` to `destination`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `n = 3`, `edges = [[0,1],[1,2],[2,0]]`, `source = 0`, `destination = 2`
* **Output**: `true`

#### Test Case 2
* **Input**: `n = 6`, `edges = [[0,1],[0,2],[3,5],[5,4],[4,3]]`, `source = 0`, `destination = 5`
* **Output**: `false`
* **Why**: `{0,1,2}` and `{3,4,5}` are separate components.

#### Test Case 3
* **Input**: `n = 1`, `edges = []`, `source = 0`, `destination = 0`
* **Output**: `true`

---

### 💬 3. What is This Problem Actually Asking?
Start at `source` and visit everything you can reach. If `destination` is visited, a path exists.

---

### 🌍 4. Real-Life Example
**"Can I get from my station to yours by metro?"** You don't need the route, just whether both stations are on connected lines. Spread out from your station line by line until you either reach theirs or run out of new stations.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structures**: adjacency list `graph[v] = [neighbours]` (add each edge both ways); `visited` boolean array.
* **Algorithm**: **BFS** with a queue (DFS works just as well).
* **Alternative**: Union-Find, then `find(source) === find(destination)`. Great when many such queries are asked on the same graph.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: test 2, `source = 0`, `destination = 5`

| queue | visit | new neighbours | visited |
| :--- | :---: | :--- | :--- |
| [0] | 0 | 1, 2 | {0,1,2} |
| [1,2] | 1 | — | {0,1,2} |
| [2] | 2 | — | {0,1,2} |
| [] | — | — | 5 never reached |

Returns `false`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function validPath(n: number, edges: number[][], source: number, destination: number): boolean {
    const graph: number[][] = Array.from({ length: n }, () => []);
    for (const [a, b] of edges) {
        graph[a].push(b); // undirected: add both directions
        graph[b].push(a);
    }

    const visited: boolean[] = new Array(n).fill(false);
    const queue: number[] = [source];
    visited[source] = true;

    for (let head = 0; head < queue.length; head++) {
        const v = queue[head];
        if (v === destination) return true;
        for (const next of graph[v]) {
            if (!visited[next]) {
                visited[next] = true;
                queue.push(next);
            }
        }
    }
    return false;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(V + E)$**.
* **Space Complexity**: **$O(V + E)$** for the adjacency list.

#### Edge Cases Handled:
* **`source === destination`**: returns `true` on the first pop.
* **Isolated vertices**: never reached unless they're the source.
* **Queue with a head index** instead of `shift()`: keeps each dequeue $O(1)$.
