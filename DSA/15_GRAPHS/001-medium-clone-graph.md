# 001. Clone Graph (Medium)

**Sheet**: Namaste DSA · 14. Graphs · [LeetCode 133](https://leetcode.com/problems/clone-graph/)

**Interview Tag**: 🔥 **MUST SOLVE** - Graph traversal plus a **visited map that is also the copy map**. Tests whether you handle cycles.

---

### 📝 1. Problem Statement
Given a reference to one node of a **connected undirected graph**, return a **deep copy** of the whole graph. Each node has a `val` and a list of `neighbors`.

In the tests the graph is written as an adjacency list: entry `i` lists the neighbours of the node with value `i + 1`, and you're handed node `1`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `adjList = [[2,4],[1,3],[2,4],[1,3]]`
* **Output**: `[[2,4],[1,3],[2,4],[1,3]]`
* **Why**: A 4-node cycle 1–2–3–4–1. The copy has the same shape, made of new nodes.

#### Test Case 2
* **Input**: `adjList = [[]]`
* **Output**: `[[]]`
* **Why**: One node, no neighbours.

#### Test Case 3
* **Input**: `adjList = []`
* **Output**: `[]`
* **Why**: Empty graph: the input node is `null`.

---

### 💬 3. What is This Problem Actually Asking?
Walk the graph (DFS or BFS). The first time you meet an original node, create its copy and **remember the pair** `original → copy`. When you meet it again (cycles!), reuse the remembered copy instead of making another.

---

### 🌍 4. Real-Life Example
**Copying a group chat's contact web** to a new phone. For each person you create a new contact card once. When someone's friend list mentions a person you've already copied, you link to that existing card instead of creating a duplicate.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: `Map<original, copy>`, which is both the visited set and the lookup for cycles.
* **Algorithm**: **DFS**:
  * if `node` is in the map, return its copy;
  * otherwise create the copy, store it **before** visiting neighbours (otherwise a cycle would recurse forever), then fill its `neighbors` with the clones of the original's neighbours.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: 1–2, 1–4, 2–3, 3–4

```text
clone(1): new 1', map {1→1'}
  clone(2): new 2', map {1,2}
    clone(1): in map → 1'
    clone(3): new 3'
      clone(2): in map → 2'
      clone(4): new 4'
        clone(1): in map → 1'
        clone(3): in map → 3'
  clone(4): in map → 4'
```

Every node is created once, and every edge is copied.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class _Node {
    val: number;
    neighbors: _Node[];
    constructor(val?: number, neighbors?: _Node[]) {
        this.val = val === undefined ? 0 : val;
        this.neighbors = neighbors === undefined ? [] : neighbors;
    }
}

function cloneGraph(node: _Node | null): _Node | null {
    const copies = new Map<_Node, _Node>();

    function clone(original: _Node): _Node {
        const existing = copies.get(original);
        if (existing) return existing; // already copied (this is how cycles end)

        const copy = new _Node(original.val);
        copies.set(original, copy);    // register BEFORE visiting neighbours
        for (const neighbor of original.neighbors) {
            copy.neighbors.push(clone(neighbor));
        }
        return copy;
    }

    return node === null ? null : clone(node);
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(V + E)$**: each node and edge is visited once.
* **Space Complexity**: **$O(V)$** for the map and the recursion.

#### Edge Cases Handled:
* **`null` input**: returns `null`.
* **Single node**: a copy with an empty neighbour list.
* **Cycles**: ended by the map lookup.
* **Shallow copy bug**: returning original nodes in a neighbour list; the hub's judge checks that no original node appears in the copy.
