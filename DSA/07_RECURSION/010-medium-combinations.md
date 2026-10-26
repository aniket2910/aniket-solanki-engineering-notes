# 010. Combinations (Medium)

**Sheet**: Namaste DSA · 11. Backtracking · [LeetCode 77](https://leetcode.com/problems/combinations/)

**Interview Tag**: [Subsets](./009-medium-subsets.md) with a fixed size. Shows the **pruning** trick that makes backtracking fast.

---

### 📝 1. Problem Statement
Given `n` and `k`, return every combination of `k` numbers chosen from `1 … n`. Order inside the answer doesn't matter.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `n = 4`, `k = 2`
* **Output**: `[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]`
* **Why**: $\binom{4}{2} = 6$ pairs.

#### Test Case 2
* **Input**: `n = 1`, `k = 1`
* **Output**: `[[1]]`

#### Test Case 3
* **Input**: `n = 3`, `k = 3`
* **Output**: `[[1,2,3]]`

---

### 💬 3. What is This Problem Actually Asking?
Same "take numbers in increasing order" tree as subsets, but only **record a path when it has exactly `k` numbers**, and stop going deeper once it does.

---

### 🌍 4. Real-Life Example
Picking a **2-person team** from 4 colleagues. Alice+Bob is the same team as Bob+Alice, so you only list each team once by always writing names in roll-call order.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Algorithm**: **Backtracking with a start number**.
  * `backtrack(start)`: if `path.length === k`, record a copy and return.
  * Try every `i` from `start` upward, push, recurse with `i + 1`, pop.
* **Pruning**: if `need = k - path.length` numbers are still needed, the loop can stop at `n - need + 1`. Starting later would leave too few numbers to fill the path, so those branches are cut before they start.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `n = 4`, `k = 2`

```text
start=1 path=[]  (need 2 → i up to 3)
├─ 1 → start=2 path=[1] (need 1 → i up to 4)
│    ├─ 2 → [1,2] ✔   ├─ 3 → [1,3] ✔   └─ 4 → [1,4] ✔
├─ 2 → start=3 path=[2]
│    ├─ 3 → [2,3] ✔   └─ 4 → [2,4] ✔
└─ 3 → start=4 path=[3]
     └─ 4 → [3,4] ✔
(i = 4 at the top level is pruned: nothing left to pair it with)
```

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function combine(n: number, k: number): number[][] {
    const result: number[][] = [];
    const path: number[] = [];

    function backtrack(start: number): void {
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        const need = k - path.length;
        // Prune: starting after n - need + 1 can't fill the remaining slots
        for (let i = start; i <= n - need + 1; i++) {
            path.push(i);
            backtrack(i + 1);
            path.pop();
        }
    }

    backtrack(1);
    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(k \cdot \binom{n}{k})$**: one copy of length `k` per combination.
* **Space Complexity**: **$O(k)$** recursion depth.

#### Edge Cases Handled:
* **`k === n`**: exactly one combination, `[1 … n]`.
* **`k === 1`**: `n` single-number combinations.
