# 005. Combination Sum (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **BACKTRACKING WITH REUSABLE ELEMENTS** - Standard combinatorial search problem. Evaluates command of recursion index management to allow element re-use while preventing duplicate combination sets.

---

### 📝 1. Problem Statement
Given an array of **distinct** integers `candidates` and a target integer `target`, return a list of all **unique combinations** of `candidates` where the chosen numbers sum to `target`. You may return the combinations in **any order**.

The **same** number may be chosen from `candidates` an **unlimited number of times**. Two combinations are unique if the frequency of at least one of the chosen numbers is different.

It is guaranteed that the number of unique combinations that sum up to `target` is less than `150` combinations for the given input.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `candidates = [2, 3, 6, 7]`, `target = 7`
* **Output**: `[[2, 2, 3], [7]]`
* **Why**: 
  * $2 + 2 + 3 = 7$.
  * $7 = 7$.
  These are the only two unique combinations.

#### Test Case 2
* **Input**: `candidates = [2, 3, 5]`, `target = 8`
* **Output**: `[[2, 2, 2, 2], [2, 3, 3], [3, 5]]`

---

### 💬 3. What is This Problem Actually Asking?
We need to find all combinations of numbers from the input array that sum to the target, allowing us to select any number as many times as we want, but ensuring we don't return duplicates (like `[2, 3, 3]` and `[3, 2, 3]`).

---

### 🌍 4. Real-Life Example
Imagine you are buying items from a vending machine that only accepts \$2, \$3, and \$5 coins. If your total purchase is exactly \$8, what combinations of coins can you use to pay? You could pay with four \$2 coins, or one \$2 and two \$3 coins, or one \$3 and one \$5 coin.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach: Recursion / Backtracking (Index Reuse Decision)
To ensure we find all combinations without generating duplicates, we process candidates sequentially from left to right using a recursive backtracking function `backtrack(index, target, path)`:
1. **Base Cases**:
   * If `target === 0`: We have found a valid combination. Add a copy of `path` to the result.
   * If `target < 0` or `index === candidates.length`: The path exceeds the target or we have run out of candidates. Stop search.
2. **Decisions (Inclusion/Exclusion)**:
   * **Include**: Choose the element at `candidates[index]`. Since we can reuse it, we do not increment the index: `backtrack(index, target - candidates[index], path)`.
   * **Exclude**: Skip the element at `candidates[index]` and move to the next index: `backtrack(index + 1, target, path)`.

* **Pros**: Simple, does not require sorting, and avoids duplicates naturally because elements are selected in a strict left-to-right ordering.
* **Cons**: Highly branch-intensive recursive tree; time complexity depends on the depth and candidate values.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run the inclusion/exclusion state updates with `candidates = [2, 3]`, `target = 5`.

```text
                                     f(idx=0, tgt=5, path=[])
                                    /                        \
                    (Exclude 2)                              (Include 2)
                      /                                          \
            f(idx=1, tgt=5, path=[])                   f(idx=0, tgt=3, path=[2])
             /                    \                      /                    \
       (Exclude 3)            (Include 3)          (Exclude 2)            (Include 2)
         /                        \                  /                        \
f(idx=2, tgt=5)           f(idx=1, tgt=2)     f(idx=1, tgt=3, path=[2])  f(idx=0, tgt=1, path=[2,2])
  [Out of bounds]           /           \         /          \             /          \
  Return                    ...         ...     Exclude 3  Include 3    Exclude 2   Include 2
                                                           [2,3] (tgt=0)            [2,2,2] (tgt=-1)
                                                           Return true              Return false
```

#### **Step 1: Start at root `f(0, 5, [])`**
* Include 2: Call `f(0, 3, [2])`.
* Exclude 2: Call `f(1, 5, [])`.

#### **Step 2: Trace include branch `f(0, 3, [2])`**
* Include 2: Call `f(0, 1, [2, 2])`.
  * In `f(0, 1, [2, 2])`, include 2 results in `target = -1` (invalid).
  * Exclude 2: Call `f(1, 1, [2, 2])`.
    * In `f(1, 1, [2, 2])`, include 3 results in `target = -2` (invalid).
    * Exclude 3 results in `idx = 2` (out of bounds).
* Exclude 2: Call `f(1, 3, [2])`.
  * Include 3: Call `f(1, 0, [2, 3])` $\rightarrow$ Target 0! Save `[2, 3]` to results.

#### **Step 3: Trace exclude branch `f(1, 5, [])`**
* Include 3: Call `f(1, 2, [3])` $\rightarrow$ eventually terminates without target 0.
* Exclude 3: Call `f(2, 5, [])` $\rightarrow$ out of bounds.

Result: `[[2, 3]]` (or `[[2, 2, 3], [7]]` for the first test case).

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function combinationSum(candidates: number[], target: number): number[][] {
    const result: number[][] = [];
    const currentCombination: number[] = [];
    
    function findCombinations(index: number, currentTarget: number): void {
        // Base Cases
        if (currentTarget === 0) {
            result.push([...currentCombination]);
            return;
        }
        if (currentTarget < 0 || index === candidates.length) {
            return;
        }
        
        // Choice 1: Include candidates[index] (re-use it)
        currentCombination.push(candidates[index]);
        findCombinations(index, currentTarget - candidates[index]);
        currentCombination.pop(); // Backtrack
        
        // Choice 2: Exclude candidates[index] (move to next index)
        findCombinations(index + 1, currentTarget);
    }
    
    findCombinations(0, target);
    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Recursive Inclusion / Exclusion with Re-use |
| :--- | :--- |
| **Time Complexity** | **$O(2^{\text{target}} \cdot K)$** — Where $K$ is the average length of combinations. The number of states is bounded by the branching factor. In the worst-case, if candidates contain small values (e.g. `2`), recursion depth can reach $\text{target}/2$. |
| **Space Complexity** | **$O(\text{target})$** — Aux stack space is bounded by the maximum recursion depth ($\text{target} / \min(\text{candidate})$). |

#### Edge Cases Handled:
* **Target smaller than all candidates**: Quickly returns empty array since include decisions immediately cross target bounds into negative numbers (Correct).
* **Single Element Array**: If `candidates = [2]` and `target = 6`, recurses and yields `[[2, 2, 2]]` (Correct).
