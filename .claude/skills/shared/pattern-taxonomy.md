# DSA Pattern Taxonomy (shared source of truth)

This file is the **single canonical list of pattern labels** used across the notebook. Two skills
read it so their labels never drift apart:

- **`dsa-solve-logger`** — stamps every solved problem with a pattern from this list and files it
  into the matching pattern log (`DSA/SOLVE_LOG/<slug>.md`).
- **`company-interview-drill`** — tags DSA questions with the same labels so a company's asked
  questions line up with the pattern logs the user has been building.

**The rule for both skills:** never invent a new label on the fly. Always pick from the table below.
If a problem genuinely doesn't fit any row, that's a signal — surface it to the user and ask whether
to (a) map it to the closest existing pattern, or (b) add a new row here. Adding a pattern is a
deliberate edit to *this file*, not a silent choice inside one skill, because the whole point is that
the label means the same thing everywhere.

Why a fixed taxonomy matters: the pattern logs are a revision resource that only works if
"Sliding Window" always lands in the same file. Free-text pattern names ("sliding-window",
"window", "two-pointer window") would scatter the same idea across three files and destroy the
accumulation. The `slug` column is authoritative — it *is* the log filename.

## How to use a row

- **`slug`** → the log file is `DSA/SOLVE_LOG/<slug>.md`. Lowercase, kebab-case, stable forever.
- **`Pattern`** → the human label written in the log entry and used by the drill.
- **`Recognize it when…`** → the trigger that tells you a problem belongs to this pattern. Use this
  to classify; if two patterns both seem to fit, log the *primary* one and mention the secondary in
  the entry's insight line.
- **`Typical structures`** → the data structures that usually carry this pattern. Handy as the
  default for the "core data structure" field, but always defer to what the user actually used.

## The patterns

| slug | Pattern | Recognize it when… | Typical structures |
| :--- | :--- | :--- | :--- |
| `sliding-window` | Sliding Window | Contiguous subarray/substring, "longest/shortest/at most K", running window | Array, string, hash map |
| `two-pointers` | Two Pointers | Sorted array, pair/triplet sums, converging or read/write pointers, dedupe in place | Array, string |
| `fast-slow-pointers` | Fast & Slow Pointers | Cycle detection, middle of list, "happy number", tortoise-and-hare | Linked list, array |
| `merge-intervals` | Merge Intervals | Overlapping ranges, "merge/insert interval", scheduling by start/end | Array of intervals, sorting |
| `cyclic-sort` | Cyclic Sort | Numbers in range `1..n`, "find missing/duplicate/first missing positive" in place | Array |
| `linked-list-reversal` | In-place Linked List Reversal | Reverse a list or sublist, reverse in K-groups, no extra space | Linked list |
| `bfs` | Breadth-First Search | Shortest path in unweighted graph, level-order, "minimum steps", grid flood by layers | Queue, graph, tree, matrix |
| `dfs` | Depth-First Search | Explore all paths, connected components, tree traversals, "does a path exist" | Stack/recursion, graph, tree |
| `backtracking` | Backtracking | Generate all combinations/permutations/arrangements, constraint search, "all valid…" | Recursion, array |
| `binary-search` | Binary Search | Sorted input, "search space" answers, "min/max value that satisfies", rotated array | Array (sorted or monotonic predicate) |
| `top-k-heap` | Top-K Elements (Heap) | "K largest/smallest/most frequent", running median, streaming order | Heap / priority queue |
| `k-way-merge` | K-way Merge | Merge K sorted lists/arrays, "smallest range covering K lists" | Heap, linked list |
| `subsets` | Subsets / Combinatorics | Power set, combinations, "all subsets", BFS-style accumulation of choices | Array, recursion |
| `greedy` | Greedy | Locally optimal choice proven globally optimal, "maximum/minimum with a sort-then-pick" | Array, sorting, heap |
| `dynamic-programming` | Dynamic Programming | Overlapping subproblems + optimal substructure, "count ways / min cost / longest…" | 1D/2D table, memoized recursion |
| `topological-sort` | Topological Sort | Dependency ordering, "course schedule", DAG linearization, cycle-in-directed-graph | Graph, queue (Kahn's) |
| `union-find` | Union-Find (DSU) | Connectivity/grouping, "number of provinces/islands by union", redundant connection | Disjoint-set / array parent |
| `trie` | Trie | Prefix search, autocomplete, word dictionary, "starts with" | Trie (n-ary tree) |
| `bit-manipulation` | Bit Manipulation | XOR tricks, "single number", counting bits, subsets via bitmask | Integers, bitmask |
| `prefix-sum` | Prefix Sum | Range-sum queries, "subarray sums to K", running totals, difference arrays | Array, hash map |
| `monotonic-stack` | Monotonic Stack | "Next greater/smaller element", stack that stays sorted, histogram areas | Stack |
| `hashing` | Hashing / Frequency Count | O(1) lookup, dedupe, anagrams, "count occurrences", complement lookup | Hash map, hash set |
| `matrix` | Matrix Traversal | 2D grid walk, spiral, rotate in place, flood fill, islands (when not framed as DFS/BFS) | 2D array |
| `math` | Math / Number Theory | GCD/LCM, primes, digit manipulation, modular arithmetic, base conversion | Integers |
| `divide-and-conquer` | Divide & Conquer | Split-solve-combine, merge sort, quickselect, "find in split halves" | Array, recursion |
| `recursion` | Recursion (plain) | Self-similar structure with no DP table or backtracking bookkeeping | Recursion, stack |
| `sorting` | Sorting | Answer falls out after ordering; custom comparators; "sort then scan" | Array, comparator |
| `design` | Data Structure Design | "Implement LRU/LFU/min-stack/rate limiter", build a structure with API guarantees | Composite (map + list + heap…) |

## Notes on overlap

Many problems wear two hats (a matrix problem solved with BFS; a DP solved with a monotonic stack).
When that happens:

1. **Log the pattern that is the real *learning* of the problem** — the one whose recognition
   unlocks the solution. "Number of islands" is filed under `bfs` or `dfs` (the technique), not
   `matrix` (the container), because recognizing it as a graph traversal is the insight.
2. **Name the secondary pattern in the one-line insight** so cross-references survive.
3. When unsure which is primary, ask the user rather than guessing — they know what clicked for them.
