# Round 3 — DSA: Topics, Patterns & The Talking Protocol

Full round-3 debrief (bucket sort review + the heap lesson): [../round-3-dsa.md](../round-3-dsa.md).

---

## The talking protocol (this is scored as much as the code)

1. **Clarify input properties**: sorted? duplicates? negatives? size bounds? — and if the interviewer counter-asks ("what would sortedness buy you?"), ANSWER IT.
2. **List every approach with time AND space** before picking. Breadth first.
3. **Never price an unfinished algorithm.** "Loop through and take the top ones" has no complexity until the selection step is specified.
4. **Justify the pick against the constraints out loud**: "n = 10⁶, one-shot, in-memory → bucket sort's O(n) beats O(n log k); if this were a stream I'd switch to the heap."
5. Code clean. State complexity of what you wrote. Offer test cases (edges: empty, single, all-same, negatives, k = d).
6. **"I don't know" protocol**: one sentence of reasoning toward the answer → honest admission → curiosity. Never naked.

## Topic priority for 3.5 YOE product companies (in order)

1. **Hashmaps + arrays + strings** (frequency counting, prefix sums, anagrams) — every loop has one
2. **Two pointers + sliding window** (longest substring without repeat, min window substring, container with water)
3. **Heaps** ← my blocking gap. Implement from scratch, then: Kth Largest, Top K Frequent, Merge K Sorted Lists, Median from Stream
4. **Intervals** (merge, insert, meeting rooms — sort + sweep; meeting rooms II is a heap!)
5. **Stack** (valid parens, monotonic stack: next greater element, daily temperatures)
6. **Binary search** (on arrays AND on answer-space: koko bananas, capacity to ship)
7. **Trees: BFS/DFS** (level order, depth, LCA, validate BST)
8. **Linked lists** (reverse, cycle detect, merge)
9. **Graphs — light** (islands count, clone graph, course schedule/topo sort)
10. **DP — light** (climbing stairs, house robber, coin change, LIS) — product companies at SDE-2 rarely go deeper

## The top-k approach ladder (recite in 90 seconds)

| Approach | Time | Space | Wins when |
|---|---|---|---|
| Count + sort entries | O(n + d log d) | O(d) | d small; need full ranking |
| Count + k max-scans | O(n + k·d) | O(d) | k < log₂(d) — that's the crossover |
| Count + min-heap size k | O(n + d log k) | O(d + k) | k ≪ d; **only one that works on streams** |
| Count + bucket sort | O(n) | O(n + d) | one-shot, in-memory — optimal time |
| Count + quickselect | O(n + d) avg, O(d²) worst | O(d) | linear expected + O(d) space; random pivot |

## Heap: the mental model (never blank on this again)

- Complete binary tree in an array: children of `i` at `2i+1, 2i+2`; parent at `⌊(i−1)/2⌋`.
- Min-heap: parent ≤ children → minimum at root. Insert: append + sift-up, O(log n). Extract-min: swap root/last, pop, sift-down, O(log n). Build from array: O(n).
- **Top-k trick**: heap of size k holds the current winners; the root is the WEAKEST winner — the gatekeeper. Newcomer beats root → evict root, insert newcomer. It's a *min*-heap for top-k-largest because the only element you need instantly is the weakest winner.
- Where heaps hide in real systems: schedulers (next timer to fire), rate limiters, merge of sorted streams, Dijkstra, "Top 10 Courses" over a Kafka stream — k=10 heap updated per event. **I built the production version of this; recognize it in interviews.**

## Complexity answers they grill on

- **"Why is hashmap O(1)?"** — Amortized O(1) per op assuming a good hash spreading keys across buckets; worst case O(n) when keys collide into one bucket. JS `Map` is typically a hash table; insertion-ordered iteration.
- **"Why is sorting O(n log n)?"** — Comparison sorts can't beat n log n (decision-tree lower bound: n! leaves need log(n!) ≈ n log n comparisons). Non-comparison sorts (counting, radix, bucket) beat it by exploiting structure — which is exactly why bucket sort gets O(n) on frequencies: frequencies are bounded integers in [1, n].
- **"Your recursion's space?"** — Max depth of the call stack, not total calls. Binary-split recursion over n records: O(log n) depth. (This is MY fault-isolation pattern — the answer connects DSA to my resume.)
- **Amortized vs worst case**: dynamic array push is amortized O(1), worst O(n) on resize. Rate limiters and gc-sensitive paths care about the worst case, not the average.

## JS/TS-specific traps

- `Array.from({length: 10**6}, () => [])` = a million allocations up front. Lazy-allocate sparse buckets: `(buckets[i] ??= []).push(x)`. Measured on my own solution: 74.5ms/38.5MB → 27.3ms/14.7MB.
- `sort()` without comparator sorts LEXICOGRAPHICALLY — `[10, 9, 2].sort()` → `[10, 2, 9]`. Always `(a, b) => a - b`.
- No built-in heap/priority queue in JS — be ready to write one (that's WHY they love asking heap problems in Node shops).
- Numbers are floats: integers safe to 2⁵³; `| 0` truncates to 32-bit.
- `Map` over object for non-string keys and when keys are user data (no prototype pollution).
