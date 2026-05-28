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
* **Example**: [001. Remove Duplicates from Sorted Array](file:///Users/aniketsolanki/Desktop/work/aniket-solanki-engineering-notes/DSA/05_ARRAYS/001-easy-remove-duplicates-from-sorted-array.md) (uses Read/Write pointer)

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
| `001` | [Remove Duplicates from Sorted Array](file:///Users/aniketsolanki/Desktop/work/aniket-solanki-engineering-notes/DSA/05_ARRAYS/001-easy-remove-duplicates-from-sorted-array.md) | 🟢 Easy | Two-Pointer (Read/Write Pointer) |
| `002` | [Remove Element](file:///Users/aniketsolanki/Desktop/work/aniket-solanki-engineering-notes/DSA/05_ARRAYS/002-easy-remove-element.md) | 🟢 Easy | Two-Pointer (Read/Write Pointer) |

---

> [!TIP]
> **Revision Checklist**: Whenever you are asked to perform an operation **in-place** on an array (without allocating extra space), **always think Two-Pointer (Read/Write)**. It is the absolute standard for filtering, partition-swapping, and index compaction!
