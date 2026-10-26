# 011. Permutations (Medium)

**Sheet**: Namaste DSA · 11. Backtracking · [LeetCode 46](https://leetcode.com/problems/permutations/)

**Interview Tag**: 🔥 **MUST SOLVE** - Where order **does** matter. The `used[]` array replaces the start index.

---

### 📝 1. Problem Statement
Given an array `nums` of **distinct** integers, return all possible orderings of it, in any order.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1,2,3]`
* **Output**: `[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]`
* **Why**: $3! = 6$ orderings.

#### Test Case 2
* **Input**: `nums = [0,1]`
* **Output**: `[[0,1],[1,0]]`

#### Test Case 3
* **Input**: `nums = [1]`
* **Output**: `[[1]]`

---

### 💬 3. What is This Problem Actually Asking?
Fill positions one by one. For each position, any element **not already used** can go there. When every position is filled, you have one permutation.

---

### 🌍 4. Real-Life Example
Seating **3 guests in 3 chairs**. Chair 1 can take any of the 3 guests, chair 2 any of the 2 still standing, chair 3 the last one: $3 \times 2 \times 1 = 6$ seatings.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: `used: boolean[]` marks which elements are already in the path.
* **Algorithm**: **Backtracking**.
  * Unlike subsets, every recursion level loops over **all** indexes (an element earlier in the array can come later in the order), skipping the used ones.
  * Mark `used[i]`, recurse, then unmark.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [1,2,3]`

```text
[]
├─ 1 → [1]  ├─ 2 → [1,2] → 3 → [1,2,3] ✔
│           └─ 3 → [1,3] → 2 → [1,3,2] ✔
├─ 2 → [2]  ├─ 1 → [2,1] → 3 → [2,1,3] ✔
│           └─ 3 → [2,3] → 1 → [2,3,1] ✔
└─ 3 → [3]  ├─ 1 → [3,1] → 2 → [3,1,2] ✔
            └─ 2 → [3,2] → 1 → [3,2,1] ✔
```

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function permute(nums: number[]): number[][] {
    const result: number[][] = [];
    const path: number[] = [];
    const used: boolean[] = new Array(nums.length).fill(false);

    function backtrack(): void {
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;      // already placed in this ordering
            used[i] = true;
            path.push(nums[i]);
            backtrack();
            path.pop();                 // backtrack
            used[i] = false;
        }
    }

    backtrack();
    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n \cdot n!)$**: $n!$ permutations, each copied in $O(n)$.
* **Space Complexity**: **$O(n)$** for `path`, `used` and the recursion.

#### Edge Cases Handled:
* **One element**: one permutation.
* **Duplicates in the input**: not allowed here; see [Permutations II](./014-medium-permutations-ii.md) for the skip rule that handles them.
