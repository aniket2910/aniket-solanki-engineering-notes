# 🧮 Topic 14: Dynamic Programming

Welcome to the **Dynamic Programming Revision Hub**. DP is recursion that remembers: solve each sub-problem once, store it, and build bigger answers from smaller ones. This page covers how to find the recurrence, the standard DP shapes, and the solved catalog.

---

## 📌 1. Core DP Theory (Quick Recall)

* **Two conditions**: **overlapping sub-problems** (the same smaller question is asked many times) and **optimal substructure** (the best answer is built from best answers to smaller questions).
* **The four-step recipe** (say it in interviews):
  1. **State**: what does `dp[i]` (or `dp[i][j]`) mean, in one sentence?
  2. **Transition**: how is `dp[i]` built from smaller states? Usually "what was the **last** choice?"
  3. **Base cases**: the smallest states you know directly.
  4. **Answer**: which state holds the final answer?
* **Top-down vs bottom-up**:
  * **Memoization** (top-down): plain recursion + a cache. Easiest to derive.
  * **Tabulation** (bottom-up): fill a table in dependency order. No recursion depth limit.
* **Space optimisation**: if `dp[i]` only needs the previous one or two states, keep just those variables ($O(n)$ → $O(1)$).

---

## 💡 2. Major DP Patterns

### A. 1-D "last step" DP
* `dp[i]` depends on `dp[i-1]`, `dp[i-2]`.
* **Examples**: [Climbing Stairs](./001-easy-climbing-stairs.md), [Min Cost Climbing Stairs](./002-easy-min-cost-climbing-stairs.md), [Decode Ways](./007-medium-decode-ways.md).

### B. Take it or skip it
* `best(i) = max(skip, take + best(i-2))`.
* **Examples**: [House Robber](./003-medium-house-robber.md), [House Robber II](./004-medium-house-robber-ii.md).

### C. Knapsack
* **0/1** (each item once, loop the capacity **backwards**): [Partition Equal Subset Sum](./011-medium-partition-equal-subset-sum.md).
* **Unbounded** (items reusable, loop **forwards**): [Coin Change](./005-medium-coin-change.md) (min count), [Coin Change II](./012-medium-coin-change-ii.md) (count combinations: coins in the outer loop).

### D. Subarray / subsequence
* Ending-at-`i` states: [Maximum Subarray](../05_ARRAYS/010-medium-kadanes-algorithm.md), [Maximum Product Subarray](./008-medium-maximum-product-subarray.md) (track max **and** min).
* [Longest Increasing Subsequence](./010-medium-longest-increasing-subsequence.md): $O(n^2)$ DP or $O(n \log n)$ with binary search.

### E. Strings
* Prefix DP: [Word Break](./009-medium-word-break.md).
* Palindromes by expanding centres: [Palindromic Substrings](./006-medium-palindromic-substrings.md), [Longest Palindromic Substring](../01_STRINGS/023-medium-longest-palindromic-substring.md).

### F. Grid DP
* `dp[r][c] = dp[r-1][c] + dp[r][c-1]`, compressed to one row: [Unique Paths](./013-medium-unique-paths.md).

### G. Interval DP
* `dp[i][j]` over a range, trying every split point `k`: [Minimum Cost to Cut a Stick](./016-hard-minimum-cost-to-cut-a-stick.md).

### H. Flip the question
* Instead of "min moves for `n`", ask "max `n` for `m` moves": [Super Egg Drop](./017-hard-super-egg-drop.md).

### I. DP-flavoured greedy
* Reachability can be tracked with one number: [Jump Game](./014-medium-jump-game.md), [Jump Game II](./015-medium-jump-game-ii.md).

---

## 📂 3. Problem Catalog

| Index | Problem Name | Difficulty | Core Pattern / Concept |
| :---: | :--- | :---: | :--- |
| `001` | [Climbing Stairs](./001-easy-climbing-stairs.md) 🔥 | 🟢 Easy | Fibonacci Recurrence, Two Variables |
| `002` | [Min Cost Climbing Stairs](./002-easy-min-cost-climbing-stairs.md) | 🟢 Easy | 1-D DP with `min` |
| `003` | [House Robber](./003-medium-house-robber.md) 🔥 | 🟡 Medium | Take / Skip |
| `004` | [House Robber II](./004-medium-house-robber-ii.md) 🔥 | 🟡 Medium | Circle → Two Lines |
| `005` | [Coin Change](./005-medium-coin-change.md) 🔥 | 🟡 Medium | Unbounded Knapsack (Min Count) |
| `006` | [Palindromic Substrings](./006-medium-palindromic-substrings.md) 🔥 | 🟡 Medium | Expand Around Centres |
| `007` | [Longest Palindromic Substring](../01_STRINGS/023-medium-longest-palindromic-substring.md) 🔥 | 🟡 Medium | Expand Around Centres |
| `008` | [Decode Ways](./007-medium-decode-ways.md) 🔥 | 🟡 Medium | 1-D DP with Valid-Step Conditions |
| `009` | [Maximum Subarray](../05_ARRAYS/010-medium-kadanes-algorithm.md) 🔥 | 🟡 Medium | Kadane's Algorithm |
| `010` | [Maximum Product Subarray](./008-medium-maximum-product-subarray.md) 🔥 | 🟡 Medium | Track Max and Min |
| `011` | [Word Break](./009-medium-word-break.md) 🔥 | 🟡 Medium | Prefix DP + Set Lookup |
| `012` | [Longest Increasing Subsequence](./010-medium-longest-increasing-subsequence.md) 🔥 | 🟡 Medium | Tails + Binary Search |
| `013` | [Partition Equal Subset Sum](./011-medium-partition-equal-subset-sum.md) 🔥 | 🟡 Medium | 0/1 Knapsack (Backwards Loop) |
| `014` | [Coin Change II](./012-medium-coin-change-ii.md) 🔥 | 🟡 Medium | Unbounded Knapsack (Count Combinations) |
| `015` | [Unique Paths](./013-medium-unique-paths.md) 🔥 | 🟡 Medium | Grid DP, One Row |
| `016` | [Jump Game](./014-medium-jump-game.md) 🔥 | 🟡 Medium | Farthest Reach |
| `017` | [Jump Game II](./015-medium-jump-game-ii.md) 🔥 | 🟡 Medium | Implicit BFS Levels |
| `018` | [Minimum Cost to Cut a Stick](./016-hard-minimum-cost-to-cut-a-stick.md) 🔥 | 🔴 Hard | Interval DP |
| `019` | [Super Egg Drop](./017-hard-super-egg-drop.md) 🔥 | 🔴 Hard | Floors Covered by `m` Drops |

---

**Revision Checklist**: if you can't name the state in one sentence, you aren't ready to code. Write the plain recursion first, add a cache, and only then turn it into a table.
