# 📦 Topic 08: Stacks & Queues

Welcome to the **Stacks & Queues Revision Hub**. This page is your high-speed reference for linear data structures, buffer queues, monotonic stacks, LRU/LFU caches, and sliding window queue architectures.

---

## 📌 1. Core Stack & Queue Theory (Quick Recall)

Keep these fundamental behaviors in mind when designing stack- and queue-based systems:

* **Stack (LIFO - Last In, First Out)**:
  * Operations: `push(x)`, `pop()`, `peek()`, `isEmpty()`.
  * Time Complexity: All operations are **$O(1)$**.
  * Use Cases: Function call stacks, matching parentheses, undo/redo buffers, depth-first search (DFS) state.
* **Queue (FIFO - First In, First Out)**:
  * Operations: `enqueue(x)`, `dequeue()`, `peek()`, `isEmpty()`.
  * Time Complexity: All operations are **$O(1)$** (when implemented with a linked list or circular buffer).
  * Use Cases: Task scheduling, print buffers, breadth-first search (BFS) queues, messaging pipelines.
* **Double-Ended Queue (Deque)**:
  * Supports $O(1)$ insertions and deletions from **both the front and the back**.
  * Essential for sliding window maximum optimizations.

---

## 💡 2. Major Stack & Queue Patterns

### A. Monotonic Stack
* **What**: A stack that maintains its elements in a strict sorted order (strictly increasing or strictly decreasing).
* **Why**: Allows you to find the **Next Greater Element** or **Next Smaller Element** for every element in an array in linear $O(N)$ time instead of brute-force $O(N^2)$ time.
* **Key Trick**: When a new element violates the sorted property, pop elements from the stack until the property is restored, then push the new element.

### B. Min Stack / Max Stack
* **What**: A stack that retrieves the minimum or maximum element in $O(1)$ time.
* **Why**: Standard stacks only access the top. By keeping a parallel stack of running minimums/maximums (or mapping elements with state), we can retrieve min/max instantly.

### C. Double Stack for Queue
* **What**: Simulating FIFO behavior using two LIFO stacks (`inStack` and `outStack`).
* **Why**: Demonstrates how two opposite pointer flows can flip direction, transforming a LIFO flow into a FIFO flow.

### D. Monotonic Queue (Sliding Window Maximum)
* **What**: A queue (usually a Deque) that stores elements in sorted order of value but also keeps track of their index positions.
* **Why**: Solves the maximum element in every sliding window of size $K$ in $O(N)$ time.

---

## 📂 3. Problem Catalog

Use this list to track your progress and quickly open specific problem write-ups.

| Index | Problem Name | Difficulty | Core Pattern / Concept |
| :---: | :--- | :---: | :--- |
| `001` | [Implement Stack using Array](./001-easy-implement-stack-array.md) | 🟢 Easy | Array Indexing & Pointer Bounds |
| `002` | [Implement Queue using Array](./002-easy-implement-queue-array.md) | 🟢 Easy | Circular Array Indexing & Modulo Arithmetic |
| `003` | [Implement Queue using Stacks](./003-medium-implement-queue-stacks.md) 🔥 | 🟡 Medium | Amortized $O(1)$ Double Stack Push/Pop |
| `004` | [Implement Stack using Queues](./004-medium-implement-stack-queues.md) | 🟡 Medium | Single Queue Rotation Flow |
| `005` | [Valid Parentheses](./005-easy-valid-parentheses.md) 🔥 | 🟢 Easy | LIFO Bracket Matching Map |
| `006` | [Remove Outermost Parentheses](./006-easy-remove-outermost-parentheses.md) | 🟢 Easy | Depth Level Bracket Filtering Counter |
| `007` | [Min Stack](./007-medium-min-stack.md) 🔥 | 🟡 Medium | Auxiliary Min Value Stack / Math Offset Formula |
| `008` | [Evaluate Reverse Polish Notation](./008-medium-evaluate-reverse-polish-notation.md) | 🟡 Medium | LIFO Operand Stacking & Operator Execution |
| `009` | [Next Greater Element I](./009-easy-next-greater-element-i.md) | 🟢 Easy | Monotonic Stack with Hash Map Lookup |
| `010` | [Next Greater Element II](./010-medium-next-greater-element-ii.md) 🔥 | 🟡 Medium | Monotonic Stack with Array Doubling/Modulo Simulation |
| `011` | [Next Smaller Element](./011-medium-next-smaller-element.md) | 🟡 Medium | Monotonic Stack Right-to-Left Traversal |
| `012` | [Daily Temperatures](./012-medium-daily-temperatures.md) 🔥 | 🟡 Medium | Monotonic Decreasing Stack (Index Caching) |
| `013` | [Stock Span Problem](./013-medium-stock-span.md) | 🟡 Medium | Monotonic Stack Index Difference Comparison |
| `014` | [Sort a Stack](./014-medium-sort-stack.md) | 🟡 Medium | Recursive Stack Sorting (LIFO Choice Rollback) |
| `015` | [Rotting Oranges](./015-medium-rotting-oranges.md) 🔥 | 🟡 Medium | Multi-source Breadth-First Search (BFS) Queue |
| `016` | [Celebrity Problem](./016-medium-celebrity-problem.md) | 🟡 Medium | Two-Pointer Candidate Elimination |
| `017` | [LRU Cache](./017-hard-lru-cache.md) 🔥 | 🔴 Hard | Hash Map + Doubly Linked List (O(1) Get/Put) |
| `018` | [LFU Cache](./018-hard-lfu-cache.md) 🔥 | 🔴 Hard | Frequency Map + Doubly Linked Lists Indexing |
| `019` | [Largest Rectangle in Histogram](./019-hard-largest-rectangle-histogram.md) 🔥 | 🔴 Hard | Monotonic Increasing Stack Boundary Finding |
| `020` | [Sliding Window Maximum](./020-hard-sliding-window-maximum.md) 🔥 | 🔴 Hard | Monotonic Deque Index/Value Eviction |
| `021` | [Maximum of Minimums for Every Window](./021-hard-max-of-mins-every-window.md) | 🔴 Hard | Next Smaller/Prev Smaller Boundaries with Array Mapping |
| `022` | [Asteroid Collision](./022-medium-asteroid-collision.md) 🔥 | 🟡 Medium | Stack-Based Pruning of Opposing Vector Elements |

---

## 📈 Revision Checklist
* When matching brackets or nested structures, **always think Stack (LIFO)**.
* When tracking order of operations or BFS layers, **always think Queue (FIFO)**.
* When asked to find the **next greater/smaller element** in an array, reach for a **Monotonic Stack**.
* When designing high-performance custom caches (LRU/LFU), combine a **Hash Map** (for $O(1)$ search) with a **Doubly Linked List** (for $O(1)$ deletion and insertion).
