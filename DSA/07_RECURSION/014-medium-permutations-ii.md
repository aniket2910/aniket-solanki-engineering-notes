# 014. Permutations II (Medium)

**Sheet**: Namaste DSA · 11. Backtracking · [LeetCode 47](https://leetcode.com/problems/permutations-ii/)

**Interview Tag**: 🔥 **MUST SOLVE** - [Permutations](./011-medium-permutations.md) with duplicates. The one-line skip rule is what's being tested.

---

### 📝 1. Problem Statement
Given `nums` that **may contain duplicates**, return all **distinct** orderings, in any order.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1,1,2]`
* **Output**: `[[1,1,2],[1,2,1],[2,1,1]]`
* **Why**: $3!/2! = 3$ distinct orderings. Swapping the two `1`s doesn't make a new one.

#### Test Case 2
* **Input**: `nums = [1,2,3]`
* **Output**: `[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]`

#### Test Case 3
* **Input**: `nums = [2,2,2]`
* **Output**: `[[2,2,2]]`

---

### 💬 3. What is This Problem Actually Asking?
Generate permutations as usual, but **never put the same value in the same position twice**. Sort first so equal values sit side by side; then among equal values, always use them in their left-to-right order.

---

### 🌍 4. Real-Life Example
Arranging **two identical red balls and one blue ball** in a row. Labelling them "red #1" and "red #2" would double-count every arrangement. The fix is a house rule: red #1 always goes down before red #2.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: sorted `nums` + `used: boolean[]`.
* **Algorithm**: **Backtracking with a duplicate skip**:

```text
skip i if  used[i]
       or (i > 0 && nums[i] === nums[i-1] && !used[i-1])
```

The second rule says: you may only use this copy of a value if the previous identical copy is already placed in the path. That forces identical values into a fixed order, so each distinct arrangement is built once.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [1,1,2]` (already sorted; call them 1a, 1b, 2)

```text
[]
├─ 1a → [1]  ├─ 1b → [1,1] → 2 → [1,1,2] ✔
│            └─ 2  → [1,2] → 1b → [1,2,1] ✔
├─ 1b → skipped (1a is equal and unused)
└─ 2  → [2]  ├─ 1a → [2,1] → 1b → [2,1,1] ✔
             └─ 1b → skipped (1a unused)
```

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function permuteUnique(nums: number[]): number[][] {
    nums.sort((a, b) => a - b); // equal values next to each other
    const result: number[][] = [];
    const path: number[] = [];
    const used: boolean[] = new Array(nums.length).fill(false);

    function backtrack(): void {
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            // Use identical values only in left-to-right order
            if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;

            used[i] = true;
            path.push(nums[i]);
            backtrack();
            path.pop();
            used[i] = false;
        }
    }

    backtrack();
    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n \cdot n!)$** in the worst case (all distinct), plus $O(n \log n)$ to sort.
* **Space Complexity**: **$O(n)$**.

#### Edge Cases Handled:
* **All equal** (`[2,2,2]`): only the first copy is ever chosen first, one result.
* **No duplicates**: the skip rule never fires; same as Permutations.
* **Forgetting to sort**: equal values aren't adjacent, the skip rule misses them and duplicates appear.
