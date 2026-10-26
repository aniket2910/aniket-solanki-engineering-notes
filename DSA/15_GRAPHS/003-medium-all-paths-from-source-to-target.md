# 003. All Paths From Source to Target (Medium)

**Sheet**: Namaste DSA · 14. Graphs · [LeetCode 797](https://leetcode.com/problems/all-paths-from-source-to-target/)

**Interview Tag**: Backtracking on a **DAG**. No visited set is needed, and the interviewer will ask why.

---

### 📝 1. Problem Statement
`graph` is a **directed acyclic graph** with nodes `0 … n-1`, where `graph[i]` lists the nodes you can go to from `i`. Return every path from node `0` to node `n - 1`, in any order.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `graph = [[1,2],[3],[3],[]]`
* **Output**: `[[0,1,3],[0,2,3]]`

#### Test Case 2
* **Input**: `graph = [[4,3,1],[3,2,4],[3],[4],[]]`
* **Output**: `[[0,4],[0,3,4],[0,1,3,4],[0,1,2,3,4],[0,1,4]]`

#### Test Case 3
* **Input**: `graph = [[1],[]]`
* **Output**: `[[0,1]]`

---

### 💬 3. What is This Problem Actually Asking?
DFS from `0`, keeping the current path. Reaching `n - 1` means one complete path: record a copy. Then back up and try the next edge. Because the graph has **no cycles**, a path can never revisit a node, so no visited set is needed.

---

### 🌍 4. Real-Life Example
Listing **every route through a one-way theme park** from the entrance to the exit. Since paths only go forward, you can't loop; you just follow each fork, note the route when you hit the exit, and walk back to the last fork to try the other way.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: the given adjacency list; a `path` array used as a stack.
* **Algorithm**: **DFS backtracking**: push node, recurse into each neighbour, pop.
* **Why no visited set**: in a DAG, a node can be on many different paths, and you **want** to visit it once per path. A cycle is the only thing a visited set would protect against.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `graph = [[1,2],[3],[3],[]]`

```text
path [0]
├─ 1 → [0,1] → 3 → [0,1,3] ✔ record
└─ 2 → [0,2] → 3 → [0,2,3] ✔ record
```

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function allPathsSourceTarget(graph: number[][]): number[][] {
    const target = graph.length - 1;
    const result: number[][] = [];
    const path: number[] = [0];

    function dfs(node: number): void {
        if (node === target) {
            result.push([...path]);
            return;
        }
        for (const next of graph[node]) {
            path.push(next);
            dfs(next);
            path.pop(); // backtrack to try the next edge
        }
    }

    dfs(0);
    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(2^n \cdot n)$** in the worst case: a DAG can have $2^{n-2}$ paths, each up to `n` long.
* **Space Complexity**: **$O(n)$** for `path` and recursion (output aside).

#### Edge Cases Handled:
* **Two nodes**: one path `[0,1]`.
* **Shared sub-paths**: walked once per path that uses them, as required.
