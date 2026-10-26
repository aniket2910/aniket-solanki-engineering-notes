# 004. Reconstruct Itinerary (Hard)

**Sheet**: Namaste DSA · 14. Graphs · [LeetCode 332](https://leetcode.com/problems/reconstruct-itinerary/)

**Interview Tag**: 🔥 **MUST SOLVE** - **Eulerian path** with Hierholzer's algorithm: post-order DFS, then reverse.

---

### 📝 1. Problem Statement
`tickets[i] = [from, to]` are flight tickets. Starting at `"JFK"`, use **every ticket exactly once** and return the itinerary. If several itineraries work, return the one that is **smallest in lexical order** when read as one string. At least one valid itinerary exists.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]`
* **Output**: `["JFK","MUC","LHR","SFO","SJC"]`

#### Test Case 2
* **Input**: `tickets = [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]`
* **Output**: `["JFK","ATL","JFK","SFO","ATL","SFO"]`
* **Why**: `["JFK","SFO","ATL","JFK","ATL","SFO"]` also uses every ticket, but is lexically larger.

#### Test Case 3
* **Input**: `tickets = [["JFK","KUL"],["JFK","NRT"],["NRT","JFK"]]`
* **Output**: `["JFK","NRT","JFK","KUL"]`
* **Why**: Going to `KUL` first (smaller name) is a dead end with tickets left over.

---

### 💬 3. What is This Problem Actually Asking?
Find a walk that uses every edge once (an Eulerian path). Greedily taking the alphabetically smallest flight can get stuck (test 3). **Hierholzer's fix**: do DFS, always taking the smallest unused ticket, and add an airport to the answer only **after** all its outgoing tickets are used up. Dead ends are added first, so reversing the list at the end gives the correct order.

---

### 🌍 4. Real-Life Example
**Retracing a trip from boarding passes**. If you eagerly fly to the alphabetically first city and get stranded there with unused passes, that city must really be your **final** stop. Writing stops down "from the end backwards" as you get stuck sorts this out automatically.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: `Map<airport, destinations[]>`, each list sorted in **reverse** so `pop()` gives the smallest destination in $O(1)$.
* **Algorithm**: **Hierholzer's (post-order DFS)**:
  * `visit(a)`: while `a` has tickets, pop the smallest and `visit` it; then push `a` onto `route`.
  * Return `route` reversed.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: test 3. Adjacency (smallest first): JFK → [KUL, NRT], NRT → [JFK]

```text
visit(JFK): take KUL
  visit(KUL): no tickets → route [KUL]
visit(JFK) cont.: take NRT
  visit(NRT): take JFK
    visit(JFK): no tickets left → route [KUL, JFK]
  NRT done → route [KUL, JFK, NRT]
JFK done → route [KUL, JFK, NRT, JFK]
```

Reversed: `["JFK","NRT","JFK","KUL"]`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function findItinerary(tickets: string[][]): string[] {
    const graph = new Map<string, string[]>();
    for (const [from, to] of tickets) {
        if (!graph.has(from)) graph.set(from, []);
        graph.get(from)!.push(to);
    }
    // Sort descending so pop() hands out the lexically smallest destination
    for (const list of graph.values()) list.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));

    const route: string[] = [];
    function visit(airport: string): void {
        const out = graph.get(airport);
        while (out && out.length > 0) {
            visit(out.pop()!);
        }
        route.push(airport); // added only once every ticket out of here is used
    }

    visit("JFK");
    return route.reverse();
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(E \log E)$** for sorting the tickets; the DFS itself is $O(E)$.
* **Space Complexity**: **$O(E)$** for the graph, route and recursion.

#### Edge Cases Handled:
* **Dead-end branch** (test 3): ends up last after the reverse.
* **Duplicate tickets** between the same airports: both are in the list and both get used.
* **Airports with no outgoing tickets**: `graph.get` is `undefined`, the loop skips.
