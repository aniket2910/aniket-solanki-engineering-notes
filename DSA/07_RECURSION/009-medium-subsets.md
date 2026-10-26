# 009. Subsets (Medium)

**Sheet**: Namaste DSA · 11. Backtracking · [LeetCode 78](https://leetcode.com/problems/subsets/)

**Interview Tag**: 🔥 **MUST SOLVE** - The root of the backtracking family. Learn the "take it / skip it" tree here and [Subsets II](./001-medium-subsets-ii.md), Combination Sum and Permutations become small changes.

---

### 📝 1. Problem Statement
Given an array `nums` of **unique** integers, return every possible subset (the power set). The answer must not contain duplicate subsets, and may be in any order.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1,2,3]`
* **Output**: `[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]`
* **Why**: 3 elements, each in or out: $2^3 = 8$ subsets.

#### Test Case 2
* **Input**: `nums = [0]`
* **Output**: `[[],[0]]`

#### Test Case 3
* **Input**: `nums = [4,7]`
* **Output**: `[[],[4],[7],[4,7]]`

---

### 💬 3. What is This Problem Actually Asking?
For every element there are exactly two choices: **take it or skip it**. Walking through all elements and making every combination of choices produces every subset exactly once.

---

### 🌍 4. Real-Life Example
**Pizza toppings**: with mushrooms, olives and peppers you can order any combination, from a plain base (the empty set) to all three. For each topping you just say yes or no, giving $2 \times 2 \times 2 = 8$ different pizzas.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Backtracking with a start index (optimal and most reusable)
`backtrack(start)` first **records the current path** (every path is a valid subset), then tries adding each `nums[i]` for `i >= start`, recurses with `i + 1`, and **removes it again** (the backtrack step). The `start` index stops `[2,1]` from repeating `[1,2]`.

#### Approach 2: Bitmask
Numbers `0 … 2^n - 1`; bit `j` of the number says whether `nums[j]` is in the subset. Neat, but it doesn't extend to the "with duplicates" or "sum to target" variants the way backtracking does.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [1,2,3]`

```text
backtrack(0) path=[]        → record []
├─ add 1 → backtrack(1) path=[1]      → record [1]
│   ├─ add 2 → backtrack(2) [1,2]     → record [1,2]
│   │   └─ add 3 → backtrack(3) [1,2,3] → record [1,2,3]
│   └─ add 3 → backtrack(3) [1,3]     → record [1,3]
├─ add 2 → backtrack(2) path=[2]      → record [2]
│   └─ add 3 → backtrack(3) [2,3]     → record [2,3]
└─ add 3 → backtrack(3) path=[3]      → record [3]
```

8 subsets recorded.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function subsets(nums: number[]): number[][] {
    const result: number[][] = [];
    const path: number[] = [];

    function backtrack(start: number): void {
        result.push([...path]); // every path is a subset: copy it (path keeps changing)

        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]);   // choose
            backtrack(i + 1);     // explore with only later elements
            path.pop();           // un-choose (backtrack)
        }
    }

    backtrack(0);
    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n \cdot 2^n)$**: $2^n$ subsets, each copied in up to $O(n)$.
* **Space Complexity**: **$O(n)$** recursion depth and `path` (the output itself is $O(n \cdot 2^n)$).

#### Edge Cases Handled:
* **Single element**: `[[], [x]]`.
* **Copying the path**: pushing `path` itself instead of `[...path]` would leave every entry pointing at the same (finally empty) array.
