# 002. Subset Sums (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **RECURSION & BACKTRACKING** - Classic backtracking problem focused on binary decision tree traversal (inclusion vs. exclusion of elements).

---

### 📝 1. Problem Statement
Given an array/list of integers `arr` of size `N`, return the sum of all subsets formed from the array. 

The output list of sums must be returned in **non-decreasing (sorted) order**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `arr = [2, 3]`
* **Output**: `[0, 2, 3, 5]`
* **Why**: The subsets are:
  * Empty set `[]` $\rightarrow$ sum = 0
  * `[2]` $\rightarrow$ sum = 2
  * `[3]` $\rightarrow$ sum = 3
  * `[2, 3]` $\rightarrow$ sum = 5
  Sorted order: `[0, 2, 3, 5]`.

#### Test Case 2
* **Input**: `arr = [1, 2, 1]`
* **Output**: `[0, 1, 1, 2, 2, 3, 3, 4]`
* **Why**: The subsets and their sums are:
  * `[]` $\rightarrow$ 0
  * `[1]` $\rightarrow$ 1
  * `[2]` $\rightarrow$ 2
  * `[1]` (second 1) $\rightarrow$ 1
  * `[1, 2]` $\rightarrow$ 3
  * `[1, 1]` $\rightarrow$ 2
  * `[2, 1]` $\rightarrow$ 3
  * `[1, 2, 1]` $\rightarrow$ 4
  Sorted order: `[0, 1, 1, 2, 2, 3, 3, 4]`.

---

### 💬 3. What is This Problem Actually Asking?
For an array of size $N$, there are $2^N$ possible subsets. We need to find the sum of elements for each of these subsets and return a list containing all $2^N$ sums sorted from smallest to largest.

---

### 🌍 4. Real-Life Example
Imagine you are at a checkout counter with a \$1 bill, a \$2 bill, and a \$5 bill in your pocket. You can pay using any combination of these bills. The possible total payment values you can make are the subset sums of `[1, 2, 5]`:
* Pay \$0 (use nothing)
* Pay \$1, \$2, or \$5 (use single bills)
* Pay \$3, \$6, or \$7 (use pairs of bills)
* Pay \$8 (use all three bills)
The list of possible sums: `[0, 1, 2, 3, 5, 6, 7, 8]`.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach: Recursion (Inclusion / Exclusion)
We can generate all subset sums using a recursive search tree:
1. At each index `i` (from `0` to `N - 1`), we have two choices for the element `arr[i]`:
   * **Exclude**: Do not add `arr[i]` to our running sum, and move to `i + 1`.
   * **Include**: Add `arr[i]` to our running sum, and move to `i + 1`.
2. When we reach the end of the array (`i === N`), we have formed one complete subset. We push the accumulated running sum into our results array.
3. Once all branches of the recursion tree have finished, we sort the results array in non-decreasing order.

* **Pros**: Simple, intuitive, optimal time complexity $O(2^N)$ for generating sums, and space complexity $O(N)$ for the call stack.
* **Cons**: Must sort the final array of size $2^N$, taking $O(2^N \log(2^N)) = O(2^N \cdot N)$ sorting time.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run the algorithm with `arr = [2, 3]`.

```text
                           f(idx=0, sum=0)
                          /               \
              (Exclude 2)                  (Include 2)
                 /                            \
         f(idx=1, sum=0)                      f(idx=1, sum=2)
          /           \                        /           \
    (Exclude 3)    (Include 3)           (Exclude 3)    (Include 3)
      /                 \                  /                 \
f(idx=2, sum=0)   f(idx=2, sum=3)    f(idx=2, sum=2)   f(idx=2, sum=5)
  [Base Case]       [Base Case]        [Base Case]       [Base Case]
  Push 0            Push 3             Push 2            Push 5
```

1. **Root**: Start at `index = 0, sum = 0`.
2. **Left Branch (Exclude 2)**: Call `helper(1, 0)`.
   * **Left-Left (Exclude 3)**: Call `helper(2, 0)`.
     * Base case reached (`index = 2`). Push `0` to sums. Backtrack.
   * **Left-Right (Include 3)**: Call `helper(2, 3)`.
     * Base case reached. Push `3` to sums. Backtrack.
3. **Right Branch (Include 2)**: Call `helper(1, 2)`.
   * **Right-Left (Exclude 3)**: Call `helper(2, 2)`.
     * Base case reached. Push `2` to sums. Backtrack.
   * **Right-Right (Include 3)**: Call `helper(2, 5)`.
     * Base case reached. Push `5` to sums. Backtrack.
4. **Final sorting**: Sort the collected sums `[0, 3, 2, 5]` $\rightarrow$ `[0, 2, 3, 5]`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function subsetSums(arr: number[]): number[] {
    const result: number[] = [];
    const n = arr.length;
    
    function calculateSums(index: number, currentSum: number): void {
        // Base case: if we have made a decision for all elements
        if (index === n) {
            result.push(currentSum);
            return;
        }
        
        // Choice 1: Exclude the current element
        calculateSums(index + 1, currentSum);
        
        // Choice 2: Include the current element
        calculateSums(index + 1, currentSum + arr[index]);
    }
    
    // Start recursion from index 0 with a running sum of 0
    calculateSums(0, 0);
    
    // Sort the resulting sums in non-decreasing order
    result.sort((a, b) => a - b);
    
    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Recursive Inclusion / Exclusion |
| :--- | :--- |
| **Time Complexity** | **$O(2^N + 2^N \log(2^N))$** $\approx$ **$O(2^N \cdot N)$** — There are $2^N$ recursive states, each taking $O(1)$ operations. Sorting the final list of size $2^N$ takes $O(2^N \log(2^N))$ time. |
| **Space Complexity** | **$O(N)$** — Aux space for the recursion stack of maximum depth $N$. (Output storage of size $2^N$ is excluded). |

#### Edge Cases Handled:
* **Empty Array** (`[]`): Returns `[0]` immediately, as the only subset is `[]` with sum 0 (Correct).
* **Array with Zeroes** (`[0, 0]`): Generates subset sums of `[0, 0, 0, 0]` correctly (Correct).
* **Negative Numbers** (`[-1, 2]`): Correctly calculates sums `[0, -1, 2, 1]`, sorted to `[-1, 0, 1, 2]` (Correct).
