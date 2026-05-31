# 📦 Topic 05: Arrays & Array Manipulation

Welcome to the **Arrays & Array Manipulation Revision Hub**. This page is your high-speed reference for contiguous memory mechanics, dynamic array resizing costs, common patterns, and solved problem catalogs.

---

## 📌 1. Core Array Theory (Quick Recall)
Before starting any array problem, keep these fundamental behaviors in mind:

* **Contiguous Memory**: Arrays are stored in a single continuous block of memory. This allows **instant $O(1)$ random access** (reading or writing at `nums[i]`) because the CPU can calculate the exact memory address mathematically.
* **Resizing Cost (Dynamic Arrays)**:
  * Static arrays have a fixed size.
  * Dynamic arrays (like JS/TS arrays under the hood, or vectors in C++) resize automatically. When they run out of space, they allocate a new block of memory that is **double the size**, copy all existing elements ($O(N)$ time), and free the old memory.
* **Basic Complexity Matrix**:
  * **Access**: $O(1)$
  * **Search (Unsorted)**: $O(N)$ (linear scan)
  * **Search (Sorted)**: $O(\log N)$ (using Binary Search)
  * **Insertion/Deletion at End**: $O(1)$ (Amortized)
  * **Insertion/Deletion at Start/Middle**: $O(N)$ (requires shifting elements in memory)

---

## 💡 2. Major Array Patterns

Most array problems are unlocked by applying one of these high-yield patterns:

### A. Two-Pointer (Read/Write or Opposite Direction)
* **What**: Maintaining two index pointers that move either toward the center, or at different speeds (read/write).
* **Why**: Perfect for in-place modifications, reversing, or searching pairs in sorted arrays.
* **Example**: [001. Remove Duplicates from Sorted Array](./001-easy-remove-duplicates-from-sorted-array.md) (uses Read/Write pointer)

### B. Prefix Sum
* **What**: Creating an auxiliary array where `prefix[i]` stores the sum of all elements from index `0` to `i`.
* **Why**: Allows you to answer subarray sum queries in $O(1)$ time after a single $O(N)$ pre-processing pass.

### C. Kadane's Algorithm
* **What**: Maintaining a running maximum subarray sum at each index: `currentSum = Math.max(num, currentSum + num)`.
* **Why**: Resolves the Maximum Subarray problem in linear $O(N)$ time instead of nested loop $O(N^2)$ time.

---

## 📂 3. Problem Catalog

Use this list to track your progress and quickly open specific problem write-ups.

| Index | Problem Name | Difficulty | Core Pattern / Concept |
| :---: | :--- | :---: | :--- |
| `001` | [Remove Duplicates from Sorted Array](./001-easy-remove-duplicates-from-sorted-array.md) 🔥 | 🟢 Easy | Two-Pointer (Read/Write Pointer) |
| `002` | [Remove Element](./002-easy-remove-element.md) | 🟢 Easy | Two-Pointer (Read/Write Pointer) |
| `003` | [Best Time to Buy and Sell Stock](./003-easy-best-time-to-buy-and-sell-stock.md) 🔥 | 🟢 Easy | Running Minimum Profit Tracking |
| `004` | [Merge Sorted Array](./004-easy-merge-sorted-array.md) 🔥 | 🟢 Easy | Two-Pointer Merge from the Back |
| `005` | [Move Zeroes](./005-easy-move-zeroes.md) 🔥 | 🟢 Easy | Two-Pointer (Swap non-zeroes forward) |
| `006` | [Max Consecutive Ones](./006-easy-max-consecutive-ones.md) | 🟢 Easy | Single-Pass Counting & Running Max |
| `007` | [Set Matrix Zeroes](./007-medium-set-matrix-zeroes.md) 🔥 | 🟡 Medium | First Row/Col Sentinel Flagging |
| `008` | [Pascal's Triangle I](./008-easy-pascals-triangle.md) | 🟢 Easy | Dynamic Programming Vector Addition |
| `009` | [Next Permutation](./009-medium-next-permutation.md) 🔥 | 🟡 Medium | Single-Pass Peak Swap |
| `010` | [Kadane's Algorithm](./010-medium-kadanes-algorithm.md) 🔥 | 🟡 Medium | Greedy Running Maxima Sum |
| `011a` | [Sort Colors (Dutch Flag)](./011a-medium-sort-colors-dutch-flag.md) 🔥 | 🟡 Medium | Three-Pointer Partitioning (Single Pass) |
| `011b` | [Sort Colors (Counting)](./011b-medium-sort-colors-counting.md) 🔥 | 🟡 Medium | Frequency Array Re-writing (Two Pass) |
| `012` | [Rotate Matrix by 90 Degrees](./012-medium-rotate-image.md) 🔥 | 🟡 Medium | In-Place Transpose & Row Reversal |
| `013` | [Merge Overlapping Subintervals](./013-medium-merge-intervals.md) 🔥 | 🟡 Medium | Sorting & Single-Pass Merge Boundary |
| `014` | [Merge Sorted Arrays (O(1) Space)](./014-hard-merge-sorted-array-o1.md) 🔥 | 🔴 Hard | Backwards Three-Pointer In-Place Merge |
| `015a` | [Find Duplicate Number (Floyd's)](./015a-medium-duplicate-tortoise-hare.md) 🔥 | 🟡 Medium | Floyd's Cycle Detection (Tortoise and Hare) |
| `015b` | [Find Duplicate Number (Hash Set)](./015b-medium-duplicate-hashset.md) 🔥 | 🟡 Medium | Caching Visited Elements |
| `016` | [Find Repeating and Missing Number](./016-medium-find-repeating-and-missing.md) 🔥 | 🟡 Medium | System of Algebraic Math Equations |
| `017a` | [Majority Element-I (Boyer-Moore)](./017a-easy-majority-element-boyer-moore.md) 🔥 | 🟢 Easy | Boyer-Moore Balance-of-Power Voting |
| `017b` | [Majority Element-I (Hash Map)](./017b-easy-majority-element-hashmap.md) 🔥 | 🟢 Easy | Whiteboard Tally Frequency Count |
| `018` | [Majority Element-II](./018-medium-majority-element-ii.md) 🔥 | 🟡 Medium | Extended Boyer-Moore Voting (Two Candidates) |
| `019` | [Reverse Pairs](./019-hard-reverse-pairs.md) 🔥 | 🔴 Hard | Modified Merge Sort Divide & Conquer Counting |
| `020a` | [Two Sum (Hash Map)](./020a-easy-two-sum-hashmap.md) 🔥 | 🟢 Easy | Complement Index Caching Lookup |
| `020b` | [Two Sum (Two-Pointer)](./020b-easy-two-sum-twopointer.md) 🔥 | 🟢 Easy | Sorting & Sorted Two-Pointer Squeeze |
| `021` | [4Sum](./021-medium-4sum.md) 🔥 | 🟡 Medium | Symmetrical Sorting & Four-Pointer Squeeze |
| `022` | [Longest Consecutive Sequence](./022-medium-longest-consecutive-sequence.md) 🔥 | 🟡 Medium | Sequence Start Lookup via Hash Set |

---

> [!TIP]
> **Revision Checklist**: Whenever you are asked to perform an operation **in-place** on an array (without allocating extra space), **always think Two-Pointer (Read/Write)**. It is the absolute standard for filtering, partition-swapping, and index compaction!
