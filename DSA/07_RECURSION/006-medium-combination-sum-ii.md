# 006. Combination Sum II (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **BACKTRACKING WITH SINGLE-USE & DUPLICATE PRUNING** - Standard combinatorial search problem. Evaluates sorting-based duplicate exclusion when candidate elements contain duplicates and each element can be chosen at most once.

---

### 📝 1. Problem Statement
Given a collection of candidate numbers (`candidates`) and a target number (`target`), find all unique combinations in `candidates` where the candidate numbers sum to `target`.

Each number in `candidates` may only be used **once** in the combination.

The solution set **must not** contain duplicate combinations. Return the solution in **any order**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `candidates = [10, 1, 2, 7, 6, 1, 5]`, `target = 8`
* **Output**: `[[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]`
* **Why**: 
  * $1 + 1 + 6 = 8$
  * $1 + 2 + 5 = 8$
  * $1 + 7 = 8$
  * $2 + 6 = 8$
  All outputs are unique and use each candidate number at most once (we have two `1`s, so we can use `1` twice in `[1, 1, 6]`).

#### Test Case 2
* **Input**: `candidates = [2, 5, 2, 1, 2]`, `target = 5`
* **Output**: `[[1, 2, 2], [5]]`

---

### 💬 3. What is This Problem Actually Asking?
Find all subsets of the input array that sum to the target, ensuring each index is chosen at most once, and avoiding duplicate combinations in the output.

---

### 🌍 4. Real-Life Example
Imagine you are packing boxes of goods to match a weight limit of exactly 8 kg. You have multiple items of weights 1kg, 2kg, 5kg, 6kg, 7kg, 10kg, and another 1kg item. Since these are physical items, you can only pack each unique item once. The unique configurations of item selections you can pack to weigh exactly 8 kg are the answers.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach: Sorting + Backtracking with Duplicate Pruning
1. **Sort candidates**: Sorting `[10, 1, 2, 7, 6, 1, 5]` $\rightarrow$ `[1, 1, 2, 5, 6, 7, 10]`. This groups duplicate values together.
2. **Backtrack recursion**: Use a helper `backtrack(start, target, path)`.
3. **Loop-based branching**: In the loop `for (let i = start; i < candidates.length; i++)`:
   * If `candidates[i] > target`: Stop exploring this loop since all subsequent values are larger (early pruning).
   * If `i > start` and `candidates[i] === candidates[i - 1]`: **Skip** this candidate. This prevents creating duplicate combinations by choosing identical values at the same recursion depth.
   * Otherwise, push `candidates[i]`, recurse as `backtrack(i + 1, target - candidates[i], path)`, and pop (backtrack).

* **Pros**: Incredibly clean duplicate prevention mechanism, early termination optimizations, and uses $O(N)$ auxiliary stack space.
* **Cons**: Requires pre-sorting the array.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run with sorted `candidates = [1, 2, 2]`, `target = 3`.

```text
                       Root: f(start=0, tgt=3, path=[])
                      /          \              \
                  (i=0, val=1)   (i=1, val=2)   (i=2, val=2) <-- SKIP! (i>start, val==prev)
                    /              \
        f(start=1, tgt=2, [1])    f(start=2, tgt=1, [2])
        /          \                \
    (i=1, val=2)   (i=2, val=2)     (i=2, val=2) <-- target (1) < candidates[2] (2), PRUNE!
      /              \
f(s=2, t=0, [1,2])  f(s=3, t=0, [1,2]) <-- SKIP!
[Base Case] Save!
```

#### **Step 1: start = 0, target = 3**
* `i = 0`: Choose `candidates[0] = 1`. Recurse to `backtrack(1, 2, [1])`.
* `i = 1`: Choose `candidates[1] = 2`. Recurse to `backtrack(2, 1, [2])`.
* `i = 2`: `candidates[2] = 2`. Since `i > start` (2 > 0) and `candidates[2] === candidates[1]`, **SKIP** to avoid duplicate combinations.

#### **Step 2: Trace branch `backtrack(1, 2, [1])`**
* `i = 1`: Choose `candidates[1] = 2`. Recurse to `backtrack(2, 0, [1, 2])`.
  * `target = 0` $\rightarrow$ Save `[1, 2]`. Return.
* `i = 2`: `candidates[2] = 2`. Since `i > start` (2 > 1) and `candidates[2] === candidates[1]`, **SKIP**.

#### **Step 3: Trace branch `backtrack(2, 1, [2])`**
* `i = 2`: `candidates[2] = 2`. Since `2 > target` (2 > 1), loop breaks (pruned).

Result: `[[1, 2]]` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function combinationSum2(candidates: number[], target: number): number[][] {
    const result: number[][] = [];
    const currentPath: number[] = [];
    
    // 1. Sort elements to group duplicates together
    candidates.sort((a, b) => a - b);
    
    function backtrack(start: number, currentTarget: number): void {
        // Base Case
        if (currentTarget === 0) {
            result.push([...currentPath]);
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            // Early pruning: Since array is sorted, if the current element 
            // exceeds target, no subsequent element can sum to it.
            if (candidates[i] > currentTarget) {
                break;
            }
            
            // Skip duplicates at the same decision level
            if (i > start && candidates[i] === candidates[i - 1]) {
                continue;
            }
            
            // Choose
            currentPath.push(candidates[i]);
            
            // Explore (incrementing start index to prevent reusing the same element)
            backtrack(i + 1, currentTarget - candidates[i]);
            
            // Unchoose (Backtrack)
            currentPath.pop();
        }
    }
    
    backtrack(0, target);
    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Sorting + Pruning Backtracking |
| :--- | :--- |
| **Time Complexity** | **$O(2^N \cdot N)$** — In the worst-case (like `[1, 1, 1...]`), we generate all subsets. Copying each valid path to results takes $O(N)$. Sorting takes $O(N \log N)$ which is dominated by the recursion. |
| **Space Complexity** | **$O(N)$** — Aux recursion stack space of depth $N$ and temporary path storage of size $O(N)$. |

#### Edge Cases Handled:
* **All elements same** (`candidates = [2, 2, 2]`, `target = 2`): Sorting groups them; duplicate check ensures we only pick the first `2` at the root and return `[[2]]` once (Correct).
* **Target cannot be reached**: Guard clause `candidates[i] > currentTarget` terminates early, saving CPU cycles (Correct).
