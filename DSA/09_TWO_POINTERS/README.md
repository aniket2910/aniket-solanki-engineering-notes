# 👥 Topic 09: Two Pointers & Sliding Window

Welcome to the **Two Pointers & Sliding Window Revision Hub**. This page is your high-speed reference for coordinate squeezing, linear boundary optimization, frequency mapping, and solved problem catalogs.

---

## 📌 1. Core Mechanics (Quick Recall)
Before starting any problem in this section, keep the fundamental mechanics in mind:

*   **Two-Pointer Opposite End Squeeze**:
    *   Initialize `left = 0`, `right = length - 1`.
    *   Iterate while `left < right`.
    *   Squeeze inwards based on the sum comparison to a target (on sorted inputs).
*   **Sliding Window State Tracking**:
    *   Maintain a contiguous subarray range defined by `[left, right]`.
    *   Expand `right` to include elements. If the window condition is violated, increment `left` to shrink the window and re-establish the invariant.
    *   *Revision Tip*: Never reset the inner loop! Ensure pointers only advance forward, maintaining $O(N)$ amortized time.

---

## 📂 2. Problem Catalog

Use this list to track your progress and quickly open specific problem write-ups.

| Index | Problem Name | Difficulty | Core Pattern / Concept |
| :---: | :--- | :---: | :--- |
| `001` | [Two Sum (Two-Pointer)](../05_ARRAYS/020b-easy-two-sum-twopointer.md) 🔥 | 🟢 Easy | Sorting & Sorted Two-Pointer Squeeze |
| `002` | [Two Sum II - Input Array Is Sorted](./001-medium-two-sum-ii.md) 🔥 | 🟡 Medium | Opposite Ends Two-Pointer Squeeze |
| `003` | [Find the Index of the First Occurrence in a String](../01_STRINGS/026-easy-find-index-first-occurrence.md) 🔥 | 🟢 Easy | Two-Pointer Sliding Window / KMP Substring Search |
| `004` | [Intersection of Two Linked Lists](../06_LINKED_LIST/008-easy-intersection-of-two-linked-lists.md) 🔥 | 🟢 Easy | Dual Traversal Pointer Squeeze / Offset Alignment |
| `005` | [Container with Most Water](./002-medium-container-with-most-water.md) 🔥 | 🟡 Medium | Opposite Ends Greedy Height Squeeze |
| `006` | [3Sum](../05_ARRAYS/023-medium-3sum.md) 🔥 | 🟡 Medium | Outer Loop with Sorted Two-Pointer Squeeze |
| `007` | [Trapping Rainwater](../05_ARRAYS/024-hard-trapping-rainwater.md) 🔥 | 🔴 Hard | Converging Two-Pointer Peak Bounds |
| `008` | [Longest Substring Without Repeating Characters](../01_STRINGS/022-medium-longest-substring-without-repeating-characters.md) 🔥 | 🟡 Medium | Sliding Window with Map Index Cache |
| `009` | [Longest Repeating Character Replacement](./003-medium-longest-repeating-character-replacement.md) 🔥 | 🟡 Medium | Sliding Window with Max Frequency tracking |
| `010` | [Permutation in String](./004-medium-permutation-in-string.md) 🔥 | 🟡 Medium | Fixed Size Sliding Window Array Check |
| `011` | [Sliding Window Maximum](../08_STACKS_AND_QUEUES/020-hard-sliding-window-maximum.md) 🔥 | 🔴 Hard | Monotonic Deque Index/Value Eviction |

---

> [!TIP]
> **Revision Secret**: If the input is **sorted** and the objective is finding a pair, range, or maximum capacity, immediately think **Two-Pointer Squeeze**. If the input is **contiguous** but unsorted and you must track variable lengths, think **Sliding Window**.
