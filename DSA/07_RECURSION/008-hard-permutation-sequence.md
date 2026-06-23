# 008. Permutation Sequence (Hard)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon, Microsoft
>
> **Interview Tag**: 🔥 **MATHEMATICAL BLOCK SELECTION** - High-impact combinations problem. Tests capacity to bypass generating $O(N!)$ permutations by mathematically jumping to the exact $k$-th permutation using factorials.

---

### 📝 1. Problem Statement
The set `[1, 2, 3, ..., n]` contains a total of `n!` unique permutations.

By listing and labeling all of the permutations in order, we get the following sequence for `n = 3`:
1. `"123"`
2. `"132"`
3. `"213"`
4. `"231"`
5. `"312"`
6. `"321"`

Given `n` and `k`, return the $k$-th permutation sequence as a string.

**Constraints:**
* `1 <= n <= 9`
* `1 <= k <= n!`

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `n = 3`, `k = 3`
* **Output**: `"213"`
* **Why**: The permutations in sorted order are `"123"`, `"132"`, `"213"`, `"231"`, `"312"`, `"321"`. The 3rd permutation is `"213"`.

#### Test Case 2
* **Input**: `n = 4`, `k = 9`
* **Output**: `"2314"`

---

### 💬 3. What is This Problem Actually Asking?
We need to find the $k$-th permutation in lexicographical order for the sequence of numbers from $1$ to $N$.

---

### 🌍 4. Real-Life Example
Imagine you are trying to guess a combination lock sequence of $N$ digits. The instruction manual tells you that the correct code is the $9$-th smallest permutation of the digits `1`, `2`, `3`, and `4`. Instead of writing down all 24 possible permutations to count to the 9th, you can use math to determine the exact digits of the code step-by-step.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** to solve this:

#### Approach 1: Backtracking Permutation Generation (Brute Force)
We generate all permutations of the array `[1, ..., n]` using a standard recursive backtracking helper. We count each permutation as it is generated, and when we hit the $k$-th one, we stop and return it.
* **Pros**: Simple, built on top of the standard backtracking template.
* **Cons**: Slower worst-case runtime of $O(N!)$ because it generates permutations. For $N = 9$, $9! = 362,880$ states, which can cause lag or Time Limit Exceeded (TLE) in tight interview systems.

#### Approach 2: Mathematical Factorial Block Slicing (Optimal)
We can determine the digits of the $k$-th permutation one-by-one:
1. If we have $N$ digits, there are $N!$ total permutations.
2. The permutations are divided into $N$ equal blocks based on their starting digit. Each block contains $(N-1)!$ permutations.
   * For example, for $N = 3$, there are $2! = 2$ permutations starting with `1`, two starting with `2`, and two starting with `3`.
3. If we convert $k$ to a 0-indexed offset (`k = k - 1`), the index of the first digit is `Math.floor(k / (n - 1)!)`.
4. We select the number at this index from our list of available numbers, append it to our result, and remove it from the list.
5. We update `k` to the remainder `k = k % (n - 1)!` and repeat the process for the next digit slot.
* **Pros**: Optimal $O(N^2)$ runtime and $O(N)$ space. No recursive branch backtracking overhead.
* **Cons**: Highly non-obvious mathematical formulation.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run the mathematical block slicing (Approach 2) with `n = 3` and `k = 3`.

#### **Step 0: Initial State**
* List of numbers: `[1, 2, 3]`
* Factorials precomputed: `0! = 1`, `1! = 1`, `2! = 2`
* Adjust `k` to 0-index: `k = 3 - 1 = 2`
* `result = ""`

#### **Step 1: Determine Digit 1**
* Remaining digits to choose: 3. Block size is $(3 - 1)! = 2! = 2$.
* `index = Math.floor(k / 2!) = Math.floor(2 / 2) = 1`.
* Pick number at index 1 from `[1, 2, 3]` $\rightarrow$ `'2'`.
* Remove `'2'` from list $\rightarrow$ list becomes `[1, 3]`.
* Update `k = k % 2! = 2 % 2 = 0`.
* `result = "2"`.

#### **Step 2: Determine Digit 2**
* Remaining digits to choose: 2. Block size is $(2 - 1)! = 1! = 1$.
* `index = Math.floor(k / 1!) = Math.floor(0 / 1) = 0`.
* Pick number at index 0 from `[1, 3]` $\rightarrow$ `'1'`.
* Remove `'1'` from list $\rightarrow$ list becomes `[3]`.
* Update `k = k % 1! = 0 % 1 = 0`.
* `result = "21"`.

#### **Step 3: Determine Digit 3**
* Remaining digits to choose: 1. Block size is $(1 - 1)! = 0! = 1$.
* `index = Math.floor(k / 0!) = Math.floor(0 / 1) = 0`.
* Pick number at index 0 from `[3]` $\rightarrow$ `'3'`.
* Remove `'3'` from list $\rightarrow$ list becomes `[]`.
* `result = "213"` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function getPermutation(n: number, k: number): string {
    // ==========================================
    // 1st Approach: Backtracking Permutations (O(N!))
    // ==========================================
    /*
    // Standard backtracking loop generating all permutations...
    // Return early when permutation count === k.
    */

    // ==========================================
    // 2nd Approach: Mathematical Block Slicing (Optimal O(N^2))
    // ==========================================
    const numbers: number[] = [];
    const factorials: number[] = [1];
    
    // 1. Precompute factorials and populate available numbers list
    let fact = 1;
    for (let i = 1; i <= n; i++) {
        numbers.push(i);
        fact *= i;
        factorials.push(fact);
    }
    
    // Convert k to 0-indexed offset
    let targetOffset = k - 1;
    let result = "";
    
    // 2. Mathematically decode the digits one by one
    for (let i = n - 1; i >= 0; i--) {
        // Block size is i!
        const blockSize = factorials[i];
        const selectedIndex = Math.floor(targetOffset / blockSize);
        
        // Append selected number to the result
        result += numbers[selectedIndex];
        
        // Remove number from available candidates (takes O(N) shift)
        numbers.splice(selectedIndex, 1);
        
        // Update offset for the next iteration
        targetOffset %= blockSize;
    }
    
    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Generation | Approach 2: Block Slicing |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N! \cdot N)$** — Generating permutations up to $K$. | **$O(N^2)$** — Loop runs $N$ times, and array splicing (`splice`) takes $O(N)$ shift operations. |
| **Space Complexity** | **$O(N)$** — Aux recursion call stack depth of $O(N)$. | **$O(N)$** — Storage for factorials and numbers arrays. |

#### Edge Cases Handled:
* **k = 1**: Target offset is `0`, selects the first element from the list at each step, yielding the sorted numbers string `"123..."` (Correct).
* **k = n!**: Target offset is `n! - 1`, selects the last element from the list at each step, yielding the reversed numbers string `"321..."` (Correct).
* **n = 1**: The loop runs once for `i = 0`, selecting `numbers[0] = 1`, and returning `"1"` (Correct).
