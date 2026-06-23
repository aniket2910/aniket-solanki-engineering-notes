# 004. Subset Sum Equals to Target (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft
>
> **Interview Tag**: 🔥 **RECURSIVE COMBINATIONS & DP** - Core subset searching problem. Tests ability to express search states and optimize exponential recursive trees using memoization or DP.

---

### 📝 1. Problem Statement
Given an array of positive integers `nums` and a `target` sum, determine if there exists a subset of the array whose elements sum up exactly to `target`. 

Return `true` if such a subset exists, otherwise return `false`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [3, 34, 4, 12, 5, 2]`, `target = 9`
* **Output**: `true`
* **Why**: The subset `[4, 5]` sums to $4 + 5 = 9$. (Another matching subset is `[3, 4, 2]`).

#### Test Case 2
* **Input**: `nums = [3, 34, 4, 12, 5, 2]`, `target = 30`
* **Output**: `false`
* **Why**: No combination of elements from the array can sum to exactly 30.

---

### 💬 3. What is This Problem Actually Asking?
We need to determine if we can choose a subset of numbers from the input array such that their sum equals the given target.

---

### 🌍 4. Real-Life Example
Imagine you are trying to pay a bill of exactly \$9 at a cash register using some bills in your wallet: a \$3 bill, a \$34 bill, a \$4 bill, a \$12 bill, a \$5 bill, and a \$2 bill. You want to know if you can hand over a combination of bills that matches the bill amount exactly without needing change.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** to solve this:

#### Approach 1: Naive Recursion (Inclusion / Exclusion Tree)
At each element `nums[i]`, we have two decisions:
1. **Exclude**: Check if target can be formed from the rest of the array: `solve(i - 1, target)`.
2. **Include** (if `nums[i] <= target`): Subtract `nums[i]` from target and check the rest: `solve(i - 1, target - nums[i])`.
* **Pros**: Natural and simple recursive backtracking formulation.
* **Cons**: Inefficient. Runs in $O(2^N)$ time because the same target/index subproblems are solved repeatedly.

#### Approach 2: Recursive Backtracking with Memoization (Optimal)
We use a 2D cache table `memo[index][target]` to store the results of subproblems. Before executing a recursive branch, we check if `memo[index][target]` has already been computed.
* **Pros**: Reduces the time complexity from exponential $O(2^N)$ to pseudo-polynomial $O(N \cdot \text{target})$.
* **Cons**: Requires auxiliary $O(N \cdot \text{target})$ space for the memoization table.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run the recursive process with `nums = [3, 4]`, `target = 4` using memoization.

```text
                                  f(index=1, target=4)
                                 /                    \
                     (Exclude 4)                       (Include 4)
                       /                                  \
             f(index=0, target=4)                  f(index=0, target=0)
             /                  \                       [Base Case]
     (Exclude 3)             (Include 3)                Return true
       /                        \
f(idx=-1, target=4)      f(idx=-1, target=1)
   [Base Case]              [Base Case]
   Return false             Return false
```

#### **Step 1: Check root `f(1, 4)`**
* Compare `nums[1] = 4` with `target = 4`.
* Try including 4: Recurse to `f(0, 0)`.

#### **Step 2: Base Case Reached**
* `target === 0` in `f(0, 0)`. Return `true` immediately up the call stack.
* Since the include branch returned `true`, the root `f(1, 4)` returns `true` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function isSubsetSum(nums: number[], target: number): boolean {
    // ==========================================
    // 1st Approach: Naive Recursion (O(2^N))
    // ==========================================
    /*
    function recurse(index: number, currentTarget: number): boolean {
        if (currentTarget === 0) return true;
        if (index < 0 || currentTarget < 0) return false;
        
        // Exclude OR Include
        return recurse(index - 1, currentTarget) || 
               recurse(index - 1, currentTarget - nums[index]);
    }
    return recurse(nums.length - 1, target);
    */

    // ==========================================
    // 2nd Approach: Memoized Recursion (Optimal O(N * Target))
    // ==========================================
    const n = nums.length;
    // memo[i][j] stores: -1 (unvisited), 0 (false), 1 (true)
    const memo: number[][] = Array.from({ length: n }, () => new Array(target + 1).fill(-1));
    
    function checkSubset(index: number, currentTarget: number): boolean {
        // Base cases
        if (currentTarget === 0) return true;
        if (index < 0 || currentTarget < 0) return false;
        
        // Return cached result if already calculated
        if (memo[index][currentTarget] !== -1) {
            return memo[index][currentTarget] === 1;
        }
        
        // Decision 1: Exclude the element at 'index'
        const exclude = checkSubset(index - 1, currentTarget);
        
        // Decision 2: Include the element at 'index' (if target allows)
        let include = false;
        if (nums[index] <= currentTarget) {
            include = checkSubset(index - 1, currentTarget - nums[index]);
        }
        
        // Cache result and return
        const result = exclude || include;
        memo[index][currentTarget] = result ? 1 : 0;
        return result;
    }
    
    return checkSubset(n - 1, target);
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Naive Recursion | Approach 2: Memoized Recursion |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(2^N)$** — Worst-case binary tree recursion branch count. | **$O(N \cdot \text{target})$** — We solve each distinct state `(index, target)` at most once. |
| **Space Complexity** | **$O(N)$** — Call stack depth equivalent to array size $N$. | **$O(N \cdot \text{target}) + O(N)$** — Memory for the memoization matrix plus call stack. |

#### Edge Cases Handled:
* **target is 0**: Handled immediately by base case returning `true` (Correct).
* **nums contains values greater than target**: Inclusions are guarded by `nums[index] <= currentTarget` to prevent negative targets (Correct).
* **Single Element Array**: If `nums = [5]` and `target = 5`, recursion returns `true`. If `target = 3`, it correctly returns `false` (Correct).
