# 🕸️ Topic 15: Graphs

Welcome to the **Graphs Revision Hub**. A graph is a set of nodes joined by edges: cities and roads, people and friendships, tasks and dependencies. This page covers how to represent one, the traversal and shortest-path toolkit, and the solved catalog.

---

## 📌 1. Core Graph Theory (Quick Recall)

* **Vocabulary**: vertices ($V$) and edges ($E$); **directed** (one-way) vs **undirected** (both ways); **weighted** edges carry a cost; a **DAG** is a directed graph with no cycles.
* **Representation**:
  * **Adjacency list** `graph[v] = [neighbours]`: $O(V + E)$ space, the default for interviews.
  * **Adjacency matrix** `m[u][v]`: $O(V^2)$ space, only for dense graphs or $O(1)$ edge checks.
  * Most problems hand you an **edge list**: build the adjacency list first (both directions if undirected).
* **Visited tracking** is mandatory on anything that can contain cycles; otherwise traversal never ends.
* **Traversal costs**: BFS and DFS are both $O(V + E)$.

---

## 💡 2. Major Graph Patterns

### A. BFS / DFS traversal
* Reachability and copying: [Find if Path Exists](./002-easy-find-if-path-exists-in-graph.md), [Clone Graph](./001-medium-clone-graph.md).
* BFS on a grid: [Rotting Oranges](../08_STACKS_AND_QUEUES/015-medium-rotting-oranges.md).

### B. Backtracking on a DAG
* All paths, no visited set needed: [All Paths From Source to Target](./003-medium-all-paths-from-source-to-target.md).

### C. Cycle detection
* Undirected: DFS with a **parent** check: [Detect Cycle in an Undirected Graph](./005-medium-detect-cycle-in-undirected-graph.md).
* Directed: track nodes on the current DFS path, or use Kahn's algorithm.

### D. Topological sort
* DFS post-order reversed, or Kahn's BFS on in-degrees: [Topological Sort (DFS)](./006-medium-topological-sort-dfs.md).

### E. Union-Find
* Components and redundant edges: [Number of Operations to Make Network Connected](./007-medium-number-of-operations-to-make-network-connected.md).

### F. Shortest paths
* **Dijkstra** (non-negative weights, min-heap): [Number of Ways to Arrive at Destination](./009-medium-number-of-ways-to-arrive-at-destination.md).
* **Bellman-Ford** (limited edges or negative weights): [Cheapest Flights Within K Stops](./008-medium-cheapest-flights-within-k-stops.md).

### G. Minimum spanning tree and Euler paths
* **Prim's** on a dense graph: [Min Cost to Connect All Points](./010-medium-min-cost-to-connect-all-points.md).
* **Hierholzer's** for using every edge once: [Reconstruct Itinerary](./004-hard-reconstruct-itinerary.md).

---

## 📂 3. Problem Catalog

| Index | Problem Name | Difficulty | Core Pattern / Concept |
| :---: | :--- | :---: | :--- |
| `001` | [Clone Graph](./001-medium-clone-graph.md) 🔥 | 🟡 Medium | DFS + Original→Copy Map |
| `002` | [Find if Path Exists in Graph](./002-easy-find-if-path-exists-in-graph.md) 🔥 | 🟢 Easy | Adjacency List + BFS |
| `003` | [All Paths From Source to Target](./003-medium-all-paths-from-source-to-target.md) | 🟡 Medium | DAG Backtracking |
| `004` | [Reconstruct Itinerary](./004-hard-reconstruct-itinerary.md) 🔥 | 🔴 Hard | Hierholzer's Eulerian Path |
| `005` | [Detect Cycle in an Undirected Graph](./005-medium-detect-cycle-in-undirected-graph.md) 🔥 | 🟡 Medium | DFS with Parent Check |
| `006` | [Topological Sort (DFS)](./006-medium-topological-sort-dfs.md) 🔥 | 🟡 Medium | Post-Order DFS, Reversed |
| `007` | [Number of Operations to Make Network Connected](./007-medium-number-of-operations-to-make-network-connected.md) 🔥 | 🟡 Medium | Union-Find Components |
| `008` | [Cheapest Flights Within K Stops](./008-medium-cheapest-flights-within-k-stops.md) 🔥 | 🟡 Medium | Bellman-Ford, k + 1 Rounds |
| `009` | [Number of Ways to Arrive at Destination](./009-medium-number-of-ways-to-arrive-at-destination.md) 🔥 | 🟡 Medium | Dijkstra + Path Counting |
| `010` | [Min Cost to Connect All Points](./010-medium-min-cost-to-connect-all-points.md) 🔥 | 🟡 Medium | Prim's MST, O(n²) Array Version |

---

**Revision Checklist**: start every graph answer with "I'll build an adjacency list" and "do I need a visited set?" Then pick the tool by the question: reachability → BFS/DFS, ordering → topological sort, grouping → Union-Find, cheapest path → Dijkstra (or Bellman-Ford with limits).
