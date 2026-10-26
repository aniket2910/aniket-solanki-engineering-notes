# 001. Two City Scheduling (Medium)

**Sheet**: Namaste DSA · 12. Greedy Algorithm · [LeetCode 1029](https://leetcode.com/problems/two-city-scheduling/)

**Interview Tag**: 🔥 **MUST SOLVE** - The cleanest "sort by the **difference**" greedy. The proof is one sentence, so practise saying it.

---

### 📝 1. Problem Statement
`2n` people are being flown to interviews. `costs[i] = [aCost, bCost]` is what it costs to fly person `i` to city A or city B. Exactly `n` people must go to each city. Return the minimum total cost.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `costs = [[10,20],[30,200],[400,50],[30,20]]`
* **Output**: `110`
* **Why**: People 0 and 1 to A (10 + 30), people 2 and 3 to B (50 + 20).

#### Test Case 2
* **Input**: `costs = [[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]`
* **Output**: `1859`

#### Test Case 3
* **Input**: `costs = [[515,563],[451,713],[537,709],[343,819],[855,779],[457,60],[650,359],[631,42]]`
* **Output**: `3086`

---

### 💬 3. What is This Problem Actually Asking?
Imagine sending **everyone to B** first. Moving person `i` to A then changes the bill by `aCost - bCost`. You must move exactly `n` people, so move the `n` people whose move **saves the most** (most negative `aCost - bCost`).

---

### 🌍 4. Real-Life Example
Two **warehouses** must each get half of the delivery trucks. For every truck you compare "how much cheaper is warehouse A than B for this truck?" and give A the trucks where A is the biggest bargain.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: the `costs` array, sorted.
* **Algorithm**: **Greedy by difference**. Sort by `aCost - bCost` ascending; the first `n` go to A, the rest to B.
* **Why greedy is right**: whoever goes to A, the total is `sum(bCost of all) + sum(aCost - bCost of the A group)`. The first part is fixed, so minimising the total means picking the `n` smallest differences.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `[[10,20],[30,200],[400,50],[30,20]]`

| person | A | B | A − B |
| :---: | :---: | :---: | :---: |
| 1 | 30 | 200 | −170 |
| 0 | 10 | 20 | −10 |
| 3 | 30 | 20 | 10 |
| 2 | 400 | 50 | 350 |

Sorted by `A − B`: persons 1, 0 → A (30 + 10); persons 3, 2 → B (20 + 50). Total `110`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function twoCitySchedCost(costs: number[][]): number {
    // Sort by how much cheaper city A is than city B for each person
    const sorted = [...costs].sort((x, y) => (x[0] - x[1]) - (y[0] - y[1]));
    const n = sorted.length / 2;

    let total = 0;
    for (let i = 0; i < sorted.length; i++) {
        total += i < n ? sorted[i][0] : sorted[i][1]; // first half → A, second half → B
    }
    return total;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n \log n)$** for the sort.
* **Space Complexity**: **$O(n)$** for the sorted copy (or $O(\log n)$ sorting in place).

#### Edge Cases Handled:
* **Equal differences**: any order among ties gives the same total.
* **A cheaper for everyone**: still only `n` go to A; the ones where A saves least go to B.
