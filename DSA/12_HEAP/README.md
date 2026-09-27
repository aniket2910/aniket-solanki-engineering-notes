# 🥞 Topic 12: Heaps & Priority Queues

Welcome to the **Heaps & Priority Queues Revision Hub**. This page is your portal to understanding binary heaps, array representation mapping, logarithmic insertion/deletion bounds, heap sort, and priority queue architectures.

---

## 📂 Topic Outline & Reference Cards

To make revision easy, the theory and code implementation have been segregated into dedicated files:

1.  **[Introduction to Heaps](./introduction-to-heaps.md)**
    *   What is a Heap?
    *   Complete Binary Tree properties.
    *   Array representation index mapping formulas.
    *   Min-Heap vs Max-Heap invariants.
2.  **[Heap Operations](./heap-operations.md)**
    *   Creating a Heap ($O(N)$ Build-Heap vs $O(N \log N)$ Insertion).
    *   Inserting a node (`heapifyUp`).
    *   Extracting Values & Deleting (`heapifyDown`).
3.  **[Heap Sort Algorithm](./heap-sort.md)**
    *   How Heap Sort works.
    *   In-place `heapSort` implementation code in TypeScript.
    *   Deep-dive analysis (Time & Space complexity, comparison with other sorting algorithms).
4.  **[Priority Queues](./priority-queues.md)**
    *   Queue vs Priority Queue.
    *   Priority Queue implementation in TypeScript using Min-Heap.
    *   Complexity chart and common applications.

---

## 📂 Problems Catalog

Use this catalog to quickly jump to the LeetCode problems solved under this category:

| Index | Problem Name | Difficulty | Key Concepts |
| :---: | :--- | :---: | :--- |
| `001` | [Kth Largest Element in a Stream](./001-easy-kth-largest-element-in-a-stream.md) 🔥 | 🟢 Easy | Min-heap stream threshold limit |
| `002` | [Last Stone Weight](./002-easy-last-stone-weight.md) 🔥 | 🟢 Easy | Max-heap simulation |
| `003` | [Kth Largest Element in an Array](./003-medium-kth-largest-element-in-an-array.md) 🔥 | 🟡 Medium | Bounded Min-heap / QuickSelect |
| `004` | [Top K Frequent Elements](./004-medium-top-k-frequent-elements.md) 🔥 | 🟡 Medium | Frequency mapping / Bucket Sort / Min-heap |
| `005` | [Kth Smallest Element in a Sorted Matrix](./005-medium-kth-smallest-element-in-a-sorted-matrix.md) | 🟡 Medium | Matrix pointers / Binary Search on range |

---

> [!TIP]
> **Revision Secret**: If a problem requires you to continuously retrieve the **minimum or maximum** element in a stream of changing numbers, **always think Heap/Priority Queue**. It is the absolute standard for $O(1)$ lookup and $O(\log N)$ update bounds!
