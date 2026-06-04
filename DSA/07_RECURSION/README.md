# 🔁 Topic 07: Recursion & Backtracking

Welcome to the **Recursion & Backtracking Revision Hub**. This page is your high-speed reference for the core concepts, call stack mechanics, standard combinatorial patterns, and solved problem catalogs related to recursive search.

---

## 📌 1. Core Recursive Theory (Quick Recall)
Before writing any recursive or backtracking solution, keep these fundamental behaviors in mind:

* **The Call Stack**: Every recursive call pushes a new frame onto the CPU/JS execution **Call Stack** storing local variables and pointers.
  * *Revision Tip*: In JavaScript, the call stack limit is engine-dependent (typically ~10,000 frames in V8). If your depth exceeds this, you will trigger a `RangeError: Maximum call stack size exceeded` (Stack Overflow).
* **Base Case**: Every recursive function *must* have one or more base cases that stop execution and return a value without making further recursive calls. 
* **Backtracking (State Rollbacks)**: Backtracking is a systematic method of exploring all paths (state-space tree). When a path leads to a dead end (or after completing it), we must **undo (rollback)** the last choice we made (e.g., popping from an array, toggling a boolean visited flag) before moving to the next candidate branch.

---

## 💡 2. Major Recursion & Backtracking Patterns

When you see a combinatorial or tree-like decision problem, it almost always falls into one of these core patterns:

### A. Inclusion / Exclusion (Binary Choice)
* **What**: At each index `i`, you have a binary choice: either **include** the element `arr[i]` in the current candidate set or **exclude** it, then recurse for `i + 1`.
* **Why**: The absolute best approach for generating subset sums, powersets, or binary subsequences.
* **Example**: [002. Subset Sums](./002-medium-subset-sums.md)

### B. Loop-Based Backtracking (Permutations & Subsets)
* **What**: Iterating through all remaining elements using a loop `for (let i = start; i < n; i++)`, making a recursive call `backtrack(i + 1, path)`, and popping the added element after returning.
* **Why**: Great for combinations, permutations, and subsets where duplicates need to be skipped by checking `i > start && nums[i] === nums[i-1]`.
* **Example**: [001. Subsets II](./001-medium-subsets-ii.md)

### C. Divide and Conquer
* **What**: Breaking a large problem into two or more independent subproblems, solving them recursively, and combining the results.
* **Why**: Essential for algorithms like Merge Sort, Quick Sort, and Binary Exponentiation.

---

## 📂 3. Problem Catalog

Use this list to track your progress and quickly open specific problem write-ups.

| Index | Problem Name | Difficulty | Core Pattern / Concept |
| :---: | :--- | :---: | :--- |
| `001` | [Subsets II](./001-medium-subsets-ii.md) 🔥 | 🟡 Medium | Loop Backtracking & Duplicate Pruning |
| `002` | [Subset Sums](./002-medium-subset-sums.md) 🔥 | 🟡 Medium | Inclusion / Exclusion Binary Search Tree |

---

> [!TIP]
> **Revision Checklist**: When writing backtracking, always follow the **Choose $\rightarrow$ Explore $\rightarrow$ Unchoose** paradigm. Any state change you make before a recursive call (Choose) must be mirrored and undone immediately after the call returns (Unchoose)!
