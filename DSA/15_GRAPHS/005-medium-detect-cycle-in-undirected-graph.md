# 005. Detect Cycle in an Undirected Connected Graph (DFS) (Medium)

**Sheet**: Namaste DSA · 14. Graphs · [Practice](https://namastedev.com/practice/detect-cycle-in-an-undirected-connected-graph-dfs)

**Interview Tag**: 🔥 **MUST SOLVE** - The **parent check**: in an undirected graph, the edge you just came along doesn't count as a cycle.

---

### 📝 1. Problem Statement
You get the graph as an array of undirected edges `[u, v]`. Implement `hasCycle(edges)`: build an adjacency list, run DFS **from node 0**, and return `true` as soon as DFS meets a neighbour that is already visited and **isn't the node it just came from**. Only the component containing node 0 is explored.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `edges = [[0,1],[1,2]]`
* **Output**: `false`
* **Why**: A straight line 0–1–2.

#### Test Case 2
* **Input**: `edges = [[0,1],[1,2],[2,0]]`
* **Output**: `true`
* **Why**: The triangle 0–1–2–0.

#### Test Case 3
* **Input**: `edges = []`
* **Output**: `false`

#### Test Case 4
* **Input**: `edges = [[0,1],[1,2],[2,3],[3,1]]`
* **Output**: `true`
* **Why**: The cycle 1–2–3–1 hangs off node 0.

#### Test Case 5
* **Input**: `edges = [[0,1],[0,2],[0,3]]`
* **Output**: `false`
* **Why**: A star (a tree) has no cycle.

---

### 💬 3. What is This Problem Actually Asking?
In an undirected graph each edge appears in **both** adjacency lists, so from `1` you'll always see `0` again (the way you came). That's not a cycle. Any **other** already-visited neighbour means you reached it by a second route: a cycle.

---

### 🌍 4. Real-Life Example
Exploring a **maze with chalk**. You mark every junction you pass. Seeing your own chalk on the junction directly behind you is normal. Seeing your chalk on any other junction means the corridors loop back.

---

### 🛠️ 5. Data Structures & Algorithms Used
* **Data Structures**: adjacency list (`Map` so node labels can be any integers); a `visited` set.
* **Algorithm**: **DFS with parent tracking**: `dfs(node, parent)`. For each neighbour: if it's unvisited, recurse with `parent = node`; if it's visited and not `parent`, return `true`.
* **Alternative**: Union-Find: if an edge joins two nodes already in the same set, there's a cycle.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `edges = [[0,1],[1,2],[2,0]]`

| call | neighbour | visited? | parent? | result |
| :--- | :---: | :---: | :---: | :--- |
| dfs(0, −1) | 1 | no | — | recurse |
| dfs(1, 0) | 0 | yes | yes | skip |
| dfs(1, 0) | 2 | no | — | recurse |
| dfs(2, 1) | 1 | yes | yes | skip |
| dfs(2, 1) | 0 | yes | **no** | **cycle** → `true` |

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function hasCycle(edges: number[][]): boolean {
    const graph = new Map<number, number[]>();
    const link = (a: number, b: number) => {
        if (!graph.has(a)) graph.set(a, []);
        graph.get(a)!.push(b);
    };
    for (const [u, v] of edges) {
        link(u, v);
        link(v, u); // undirected
    }

    const visited = new Set<number>();
    function dfs(node: number, parent: number): boolean {
        visited.add(node);
        for (const next of graph.get(node) ?? []) {
            if (!visited.has(next)) {
                if (dfs(next, node)) return true;
            } else if (next !== parent) {
                return true; // reached an already-visited node by a second route
            }
        }
        return false;
    }

    return graph.has(0) ? dfs(0, -1) : false;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(V + E)$** over the component of node 0.
* **Space Complexity**: **$O(V + E)$**.

#### Edge Cases Handled:
* **No edges / no node 0**: `false`.
* **Trees**: every visited neighbour is the parent, so `false`.
* **Parallel edges** (`[0,1]` twice): would be reported as a cycle; the problem says inputs are well-formed, so this isn't guarded.
