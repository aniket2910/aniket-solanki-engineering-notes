# 🛠️ Topic 07: Core Algorithmic Blueprints

Welcome to the **Core Algorithmic Blueprints Revision Hub**. This page serves as an in-depth reference for standard algorithmic blueprints, loop structures, and state-machine templates. Use these guides to master complex operations and map them directly to solved catalog problems.

---

## 📂 Algorithmic Blueprint Catalog

| Index | Algorithm Name | Key Conceptual Mechanics | Solved Problem Links |
| :---: | :--- | :--- | :--- |
| `001` | [KMP Prefix Table (LPS) & String Concatenation](./kmp-prefix-table.md) 🔥 | Proper Prefixes vs Suffixes, `lps` array building backtracking loops, doubled-string mathematical proofs. | [Repeated Substring Pattern](../01_STRINGS/025-easy-repeated-substring-pattern.md), [First Occurrence in a String](../01_STRINGS/026-easy-find-index-first-occurrence.md) |
| `002` | [Floyd's Cycle Detection (Tortoise & Hare)](./floyds-cycle-detection.md) 🔥 | Speed-1 vs Speed-2 pointer lap collisions, loop entry mathematical convergence proofs. | [Linked List Cycle](../06_LINKED_LIST/004-easy-linked-list-cycle.md), [Cycle II (Starting Point)](../06_LINKED_LIST/017-medium-linked-list-cycle-ii.md), [Find the Duplicate Number](../05_ARRAYS/015a-medium-duplicate-tortoise-hare.md) |
| `003` | [Boyer-Moore Voting Algorithm](./boyer-moore-voting.md) 🔥 | Balance-of-power voting, 1-to-1 candidate cancellation scans. | [Majority Element I](../05_ARRAYS/017a-easy-majority-element-boyer-moore.md), [Majority Element II](../05_ARRAYS/018-medium-majority-element-ii.md) |
| `004` | [Kadane's Algorithm](./kadanes-algorithm.md) 🔥 | Greedy contiguous running sums, negative streak resets. | [Maximum Subarray (Kadane's)](../05_ARRAYS/010-medium-kadanes-algorithm.md) |
| `005` | [Dutch National Flag Algorithm](./dutch-national-flag.md) 🔥 | Three-pointer partitioning scans (`low`, `mid`, `high`), single-pass in-place sorts. | [Sort Colors](../05_ARRAYS/011a-medium-sort-colors-dutch-flag.md) |
| `006` | [Binary Exponentiation](./binary-exponentiation.md) 🔥 | Exponential doubling base squarings, logarithmic power halvings. | [Pow(x, n)](../02_MATH/006-medium-powx-n.md) |
| `007` | [Two-Pointer Technique](./two-pointers.md) 🔥 | Opposite end squeeze/clamp, fast-slow cycles, and read/write partitions. | [Two Sum](../05_ARRAYS/020b-easy-two-sum-twopointer.md), [Two Sum II](../09_TWO_POINTERS/001-medium-two-sum-ii.md), [Container with Most Water](../09_TWO_POINTERS/002-medium-container-with-most-water.md), [3Sum](../05_ARRAYS/023-medium-3sum.md), [Trapping Rainwater](../05_ARRAYS/024-hard-trapping-rainwater.md) |
| `008` | [Sliding Window Algorithm](./sliding-window.md) 🔥 | Subarray/substring boundary optimization, expanding right side and shrinking left side. | [Longest Substring Without Repeating Characters](../01_STRINGS/022-medium-longest-substring-without-repeating-characters.md), [Longest Repeating Character Replacement](../09_TWO_POINTERS/003-medium-longest-repeating-character-replacement.md), [Permutation in String](../09_TWO_POINTERS/004-medium-permutation-in-string.md), [Sliding Window Maximum](../08_STACKS_AND_QUEUES/020-hard-sliding-window-maximum.md) |

---

> [!TIP]
> **Revision Secret**: Whenever you encounter a problem that requires a complex algorithmic state check, do not write code blindly. Check the corresponding **Algorithmic Blueprint** here, review its mathematical loop invariant, and map the structures directly to the problem boundaries.
