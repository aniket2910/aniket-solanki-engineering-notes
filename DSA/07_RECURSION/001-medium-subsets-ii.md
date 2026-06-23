# 001. Subsets II (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon, Facebook/Meta
>
> **Interview Tag**: 🔥 **BACKTRACKING WITH DUPLICATE ELIMINATION** - Classic backtracking search problem. Tests sorting-based duplicate prevention and state-space tree traversal.

---

### 📝 1. Problem Statement
Given an integer array `nums` that may contain duplicates, return *all possible subsets (the power set)*.

The solution set **must not** contain duplicate subsets. Return the solution in **any order**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1, 2, 2]`
* **Output**: `[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]`
* **Why**: By sorting and systematically selecting combinations, we generate unique subsets while skipping identical recursive branches.

#### Test Case 2
* **Input**: `nums = [0]`
* **Output**: `[[], [0]]`

---

### 💬 3. What is This Problem Actually Asking?
We need to generate the power set (all $2^N$ combinations of elements) of a given array. However, because the array has duplicate elements, simply generating all subsets will result in duplicates (e.g., choosing the first `2` vs. the second `2`). We must skip choices that would lead to identical combinations.

---

### 🌍 4. Real-Life Example
Imagine you are packing bags with souvenirs for friends. You have 1 maple leaf keychain, and 2 identical moose keychains. The unique selections of keychains you can pack are:
* No keychains `[]`
* Maple leaf only `[maple]`
* Maple leaf + 1 moose `[maple, moose]`
* Maple leaf + 2 moose `[maple, moose, moose]`
* 1 moose only `[moose]`
* 2 moose only `[moose, moose]`

Picking the first moose vs. picking the second moose doesn't create a different distinct gift selection.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** to solve this problem:

#### Approach 1: Power Set Generation with Set Filtering
We could generate all $2^N$ subsets using a naive backtracking template or bit manipulation, convert each subset to a sorted string key, store them in a Hash Set to filter duplicates, and convert them back.
* **Pros**: Simple logic built on top of standard subset generation.
* **Cons**: Inefficient. Checking for duplicates in a set takes extra time and memory, resulting in $O(2^N \cdot N \log N)$ runtime.

#### Approach 2: Backtracking with Sorting and Index Skipping (Optimal)
We can avoid generating duplicates entirely:
1. **Sort the array**: Putting duplicates next to each other (e.g. `[2, 2, 1]` becomes `[1, 2, 2]`) is key.
2. **Backtrack recursion**: Use a helper function `backtrack(start, path)` to build subsets.
3. **Pruning**: Inside the iteration from `i = start` to `nums.length - 1`, if `nums[i] === nums[i - 1]` and `i > start`, we skip the iteration. This ensures we only choose the *first* occurrence of a duplicate element at the current decision level, preventing duplicate branches.
* **Pros**: Optimal time complexity $O(2^N \cdot N)$. Minimal memory overhead.
* **Cons**: Requires pre-sorting the array and careful indexing logic.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `nums = [2, 1, 2]`.

#### **Step 0: Pre-sorting**
* Sort `nums` $\rightarrow$ `nums = [1, 2, 2]`.

#### **Step 1: Recursive Call Tree**
```text
                       [] (start=0)
                     /    \        \
                 [1] (s=1) [2] (s=2)  [2] (s=3) <-- SKIP! (i=2, start=1, nums[2]==nums[1])
                /     \       \
          [1,2] (s=2) [1,2]    [2,2] (s=3)
             /          (i=2, start=2, SKIP!)
     [1,2,2] (s=3)
```

1. **`backtrack(0, [])`**:
   * Add `[]` to result.
   * `i = 0`: Add `nums[0] (1)`. Call `backtrack(1, [1])`.
2. **`backtrack(1, [1])`**:
   * Add `[1]` to result.
   * `i = 1`: Add `nums[1] (2)`. Call `backtrack(2, [1, 2])`.
3. **`backtrack(2, [1, 2])`**:
   * Add `[1, 2]` to result.
   * `i = 2`: Add `nums[2] (2)`. Call `backtrack(3, [1, 2, 2])`.
4. **`backtrack(3, [1, 2, 2])`**:
   * Add `[1, 2, 2]` to result.
   * Loop doesn't run (`start >= length`). Backtracks to step 2.
5. **Back in `backtrack(1, [1])`**:
   * Pop `2` $\rightarrow$ path = `[1]`.
   * `i = 2`: `nums[2]` is `2`. Since `i > start` (2 > 1) and `nums[2] === nums[1]`, **SKIP** to avoid duplicating `[1, 2]`.
   * Backtracks to step 1.
6. **Back in `backtrack(0, [])`**:
   * Pop `1` $\rightarrow$ path = `[]`.
   * `i = 1`: Add `nums[1] (2)`. Call `backtrack(2, [2])`.
7. **`backtrack(2, [2])`**:
   * Add `[2]` to result.
   * `i = 2`: Add `nums[2] (2)`. Call `backtrack(3, [2, 2])`.
8. **`backtrack(3, [2, 2])`**:
   * Add `[2, 2]` to result.
   * Loop doesn't run. Backtracks.
9. **Back in `backtrack(0, [])`**:
   * `i = 2`: `nums[2]` is `2`. Since `i > start` (2 > 0) and `nums[2] === nums[1]`, **SKIP** to avoid duplicating `[2]`.
   * Done!

Result: `[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function subsetsWithDup(nums: number[]): number[][] {
    const result: number[][] = [];
    
    // 1. Sort to place duplicates adjacent to one another
    nums.sort((a, b) => a - b);
    
    function backtrack(start: number, currentPath: number[]): void {
        // Deep copy the current subset path and push to results
        result.push([...currentPath]);
        
        for (let i = start; i < nums.length; i++) {
            // 2. If the current element is a duplicate of the previous element,
            // and we are NOT looking at the first element of this recursive level (i > start),
            // skip it to avoid duplicate subset branches.
            if (i > start && nums[i] === nums[i - 1]) {
                continue;
            }
            
            // Choose
            currentPath.push(nums[i]);
            
            // Explore
            backtrack(i + 1, currentPath);
            
            // Unchoose (Backtrack)
            currentPath.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Set Filtering | Approach 2: Sorting + Pruning |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(2^N \cdot N \log N)$** — Generates all subsets and serializes/sorts for set lookup. | **$O(2^N \cdot N)$** — Generating and copying each of the subsets of average size $N$. Sorting takes $O(N \log N)$ which is dominated by $O(2^N)$. |
| **Space Complexity** | **$O(2^N \cdot N)$** — Heavy overhead of storing duplicate subsets in a Set. | **$O(N)$** — Recursion stack depth of $O(N)$, and temporary path array of size $O(N)$. (Output excluded). |

#### Edge Cases Handled:
* **All Duplicates** (`[2, 2, 2]`): Sorting groups them; the `i > start` duplicate condition guarantees we generate `[]`, `[2]`, `[2, 2]`, `[2, 2, 2]` once each (Correct).
* **Empty/Single Element** (`[0]`): Handled correctly, outputting `[[], [0]]` (Correct).
* **Already Sorted** (`[1, 2, 3]`): Standard backtracking works without any skips (Correct).
