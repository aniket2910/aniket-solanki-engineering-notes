# 001. Climbing Stairs (Easy)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 70](https://leetcode.com/problems/climbing-stairs/)

**Interview Tag**: 🔥 **MUST SOLVE** - "Hello world" of DP. Use it to show the full journey: recursion → memo → table → two variables.

---

### 📝 1. Problem Statement
You climb a staircase of `n` steps, taking **1 or 2 steps** at a time. In how many distinct ways can you reach the top?

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `n = 2`
* **Output**: `2`
* **Why**: `1+1` or `2`.

#### Test Case 2
* **Input**: `n = 3`
* **Output**: `3`
* **Why**: `1+1+1`, `1+2`, `2+1`.

#### Test Case 3
* **Input**: `n = 5`
* **Output**: `8`

#### Test Case 4
* **Input**: `n = 45`
* **Output**: `1836311903`
* **Why**: Plain recursion would make about $2^{45}$ calls here; DP makes 45.

---

### 💬 3. What is This Problem Actually Asking?
Your **last move** onto step `n` was either a 1-step (from `n-1`) or a 2-step (from `n-2`). So `ways(n) = ways(n-1) + ways(n-2)`: the Fibonacci numbers.

---

### 🌍 4. Real-Life Example
Counting the **ways to pay ₹n using only ₹1 and ₹2 coins, in order**. Whatever the sequence, the last coin was a 1 or a 2, so the count for `n` is the count for `n-1` plus the count for `n-2`.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Plain recursion
`ways(n-1) + ways(n-2)`, recomputing the same values over and over: $O(2^n)$.

#### Approach 2: Memoization (top-down DP)
Cache each `ways(i)` the first time it's computed: $O(n)$ time, $O(n)$ space.

#### Approach 3: Two variables (bottom-up, optimal)
Each value only needs the previous two, so keep just `prev2` and `prev1` and roll forward: $O(n)$ time, $O(1)$ space.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `n = 5`, with `ways(1) = 1`, `ways(2) = 2`

| step `i` | `prev2` | `prev1` | `ways(i) = prev1 + prev2` |
| :---: | :---: | :---: | :---: |
| 3 | 1 | 2 | 3 |
| 4 | 2 | 3 | 5 |
| 5 | 3 | 5 | 8 |

Returns `8`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function climbStairs(n: number): number {
    if (n <= 2) return n;

    let prev2 = 1; // ways to reach step 1
    let prev1 = 2; // ways to reach step 2
    for (let i = 3; i <= n; i++) {
        const current = prev1 + prev2; // last move was a 1-step or a 2-step
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n)$**.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **`n = 1` and `n = 2`**: returned directly.
* **`n = 45`**: `1836311903` still fits in a 32-bit signed int (and easily in a JS number).
