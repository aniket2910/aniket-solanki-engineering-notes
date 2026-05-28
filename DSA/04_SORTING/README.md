# 📊 Topic 04: Sorting Algorithms

Welcome to the **Sorting Algorithms Revision Hub**. This page is your high-speed reference for comparison metrics, stability definitions, complexity matrices, and solved problem catalogs.

---

## 📌 1. Core Sorting Concepts (Quick Recall)
When studying sorting algorithms, make sure you can instantly explain these three metrics:

* **Stability**: A sorting algorithm is **stable** if it preserves the original relative order of duplicate elements. 
  * *Why it matters*: If you sort a list of transactions by date first, and then sort them by customer name, a **stable** sort guarantees the transactions for each customer remain sorted by date. Merge Sort is stable; Quick Sort is not.
* **In-Place vs. Out-of-Place**:
  * **In-place**: Uses $O(1)$ extra space (modifies input array directly, e.g., Bubble, Insertion, Heap Sort).
  * **Out-of-place**: Requires auxiliary memory to copy elements (e.g., Merge Sort requires $O(N)$ extra space).
* **Comparison vs. Non-Comparison**:
  * **Comparison Sorts**: Read elements and compare their values (e.g., $a \le b$). The mathematical lower limit for any comparison sort is $O(N \log N)$ time.
  * **Non-Comparison Sorts**: Do not compare values; they bucket elements based on integer keys (e.g., Counting Sort, Radix Sort). Can achieve linear $O(N + K)$ time but are limited to specific data types (like bounded integers).

---

## 💡 2. Sorting Complexity Matrix

| Algorithm | Best Time | Average Time | Worst Time | Space | Stable? | In-Place? |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Bubble Sort** | $O(N)$ | $O(N^2)$ | $O(N^2)$ | $O(1)$ | Yes | Yes |
| **Insertion Sort** | $O(N)$ | $O(N^2)$ | $O(N^2)$ | $O(1)$ | Yes | Yes |
| **Merge Sort** | $O(N \log N)$ | $O(N \log N)$ | $O(N \log N)$ | $O(N)$ | **Yes** | No |
| **Quick Sort** | $O(N \log N)$ | $O(N \log N)$ | $O(N^2)$ | $O(\log N)$ | No | **Yes** |
| **Heap Sort** | $O(N \log N)$ | $O(N \log N)$ | $O(N \log N)$ | $O(1)$ | No | **Yes** |

---

## 📂 3. Problem Catalog

Use this list to track your progress and quickly open specific problem write-ups.

| Index | Problem Name | Difficulty | Core Pattern / Concept |
| :---: | :--- | :---: | :--- |
| `001` | [Sort an Array (912)](./001-medium-sort-an-array.md) | 🟡 Medium | Merge Sort (Divide & Conquer) |

---

> [!TIP]
> **Revision Checklist**: In technical interviews, if you need to sort an array in-place with guaranteed $O(N \log N)$ time, **Heap Sort** is the theoretical winner ($O(1)$ auxiliary space). However, in practice, **Quick Sort** is usually faster because of cache locality, and **Merge Sort** is preferred if you need a guaranteed stable sort.
