# 006. Topological Sort (DFS) (Medium)

**Sheet**: Namaste DSA · 14. Graphs · [Practice](https://namastedev.com/practice/topological-sort-dfs)

**Interview Tag**: 🔥 **MUST SOLVE** - The ordering behind build systems and course schedules. Know both the **DFS post-order** version and Kahn's BFS.

---

### 📝 1. Problem Statement
Given a **directed acyclic graph** with `n` vertices `0 … n-1` and adjacency list `adj`, return **any** topological ordering: an order of all vertices where every edge `u → v` has `u` before `v`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `n = 3`, `adj = [[1],[2],[]]`
* **Output**: `[0,1,2]`

#### Test Case 2
* **Input**: `n = 4`, `adj = [[1,2],[3],[3],[]]`
* **Output**: `[0,2,1,3]`
* **Why**: `[0,1,2,3]` is also valid; any order that respects the edges is accepted.

#### Test Case 3
* **Input**: `n = 1`, `adj = [[]]`
* **Output**: `[0]`

#### Test Case 4
* **Input**: `n = 4`, `adj = [[1],[],[3],[]]`
* **Output**: `[2,3,0,1]`
* **Why**: Two separate chains; any interleaving that keeps `0` before `1` and `2` before `3` works.

---

### 💬 3. What is This Problem Actually Asking?
A vertex can only be placed after everything that points to it. DFS gives this for free: when DFS **finishes** a vertex, every vertex reachable from it has already finished. So the **finish order, reversed**, puts each vertex before everything it points to.

---

### 🌍 4. Real-Life Example
**Getting dressed**: socks before shoes, trousers before shoes, shirt before tie. Think of each item, finish every item that must come *after* it first ("shoes are done"), and write items down as they finish. Reading that list backwards gives a valid dressing order.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: DFS post-order (this problem)
`visited[]`; `dfs(v)` visits all unvisited neighbours, then pushes `v` to `order`. Run from every unvisited vertex (the graph may be disconnected), then reverse `order`.

#### Approach 2: Kahn's algorithm (BFS)
Count in-degrees; start a queue with every in-degree-0 vertex; pop, append, and decrement neighbours' in-degrees. Bonus: if fewer than `n` vertices come out, the graph had a cycle.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `n = 4`, `adj = [[1,2],[3],[3],[]]`

```text
dfs(0)
  dfs(1)
    dfs(3) → finish 3       order [3]
  finish 1                  order [3,1]
  dfs(2): 3 already visited
  finish 2                  order [3,1,2]
finish 0                    order [3,1,2,0]
```

Reversed: `[0,2,1,3]`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function topologicalSort(n: number, adj: number[][]): number[] {
    const visited: boolean[] = new Array(n).fill(false);
    const order: number[] = [];

    function dfs(v: number): void {
        visited[v] = true;
        for (const next of adj[v]) {
            if (!visited[next]) dfs(next);
        }
        order.push(v); // everything after v is already in `order`
    }

    for (let v = 0; v < n; v++) {
        if (!visited[v]) dfs(v); // disconnected parts too
    }
    return order.reverse();
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(V + E)$**.
* **Space Complexity**: **$O(V)$** for `visited`, `order` and recursion.

#### Edge Cases Handled:
* **Disconnected graph**: the outer loop starts a DFS in every component.
* **No edges**: any order of `0 … n-1` is valid.
* **Cycles**: not allowed here. To detect one, track a "currently on the DFS path" state, or use Kahn's count check.
