# 004. Linked List Cycle (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft, Google
>
> **Interview Tag**: 🔥 **MUST SOLVE** - One of the most famous Linked List questions in history. Often asked to test your understanding of pointer operations and the tradeoff between time/space complexity.

---

### 📝 1. Problem Statement
Given `head`, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer. Internally, `pos` is used to denote the index of the node that tail's `next` pointer is connected to. **Note that `pos` is not passed as a parameter.**

Return `true` *if there is a cycle in the linked list*. Otherwise, return `false`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `head = [3, 2, 0, -4]`, `pos = 1` (meaning tail points back to index 1)
* **Output**: `true`
* **Why**: There is a cycle in the linked list, where the tail connects back to the 1st node (0-indexed).

#### Test Case 2
* **Input**: `head = [1, 2]`, `pos = 0`
* **Output**: `true`
* **Why**: There is a cycle where the tail connects back to the head.

#### Test Case 3
* **Input**: `head = [1]`, `pos = -1`
* **Output**: `false`
* **Why**: There is no cycle in the list.

---

### 💬 3. What is This Problem Actually Asking?
We need to determine if a linked list contains a loop (cycle).
* If a list has no cycle, we will eventually reach the end of the list where a node's `next` pointer points to `null`.
* If a list **has** a cycle, the traversal loop will run forever in an infinite circle, and we will never hit `null`.

The core interview challenge is to solve this **without utilizing extra memory** ($O(1)$ auxiliary space).

---

### 🌍 4. Real-Life Example
Think of **two runners on a circular running track**:
* If they start running, and **Runner A (Slow)** runs at a speed of 1 lap per hour, while **Runner B (Fast)** runs at 2 laps per hour.
* If the track is a straight line, the Fast Runner will quickly disappear into the distance and reach the end of the line, never seeing the Slow Runner again.
* If the track is a **circular loop**, the Fast Runner will eventually lap the Slow Runner and they will bump into each other again!

---

### 🛠️ 5. Data Structure & Algorithms Used

To demonstrate balanced computer science engineering to the interviewer, we explain **two distinct approaches** showing the tradeoff between memory and complexity:

#### Approach 1: Floyd's Cycle-Finding Algorithm (Tortoise & Hare) - Optimal
> [!NOTE]
> For a detailed conceptual breakdown, mathematical proof, and visual explanation of this algorithm, refer to the [Floyd's Cycle Detection Blueprint](../ALGORITHMS/floyds-cycle-detection.md).

We declare two pointer variables starting at `head`:
* `slow` (advances by 1 node: `slow = slow.next`).
* `fast` (advances by 2 nodes: `fast = fast.next.next`).
* If there is no cycle, `fast` will hit `null` quickly.
* If there is a cycle, because `fast` moves exactly 1 node per step faster than `slow`, the distance between them shrinks by exactly 1 in each iteration. Eventually, `fast` will catch up to `slow` and they will meet (`slow === fast`), proving a cycle exists.
* **Pros**: $O(1)$ extremely optimal space.

#### Approach 2: Hash Set / Visited Nodes Tracking
We traverse the linked list node-by-node and store the reference of each visited node in a Hash Set.
* Before moving to the next node, we check if the current node is already in our Set.
* If it is, we have traversed this node before, which proves there is a cycle!
* **Pros**: Highly intuitive to explain and easy to implement.
* **Cons**: Consumes $O(N)$ extra space to store the visited nodes.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

For the linked list `head = [3, 2, 0, -4]`, `pos = 1` (where the tail `-4` points back to `2`):

#### **Step 0: Initial State**
```text
Pointers: slow = Node(3), fast = Node(3)
List:     [ 3 ] ──► [ 2 ] ──► [ 0 ] ──► [ -4 ]
                     ▲                     │
                     └─────────────────────┘
           ▲
       slow/fast
```

#### **Step 1: First Iteration**
```text
1. Advance slow: slow = slow.next (Node(2))
2. Advance fast: fast = fast.next.next (Node(0))

Linkage State:
          [ 3 ] ──► [ 2 ] ──► [ 0 ] ──► [ -4 ]
                     ▲         ▲           │
                     │         fast        │
                     └─────────────────────┘
                     ▲
                    slow
```

#### **Step 2: Second Iteration**
```text
1. Advance slow: slow = slow.next (Node(0))
2. Advance fast: fast = fast.next.next (Node(-4) -> Node(2))

Linkage State:
          [ 3 ] ──► [ 2 ] ──► [ 0 ] ──► [ -4 ]
                     ▲         ▲           │
                     │        slow         │
                     └─────────────────────┘
                     ▲
                    fast
```

#### **Step 3: Third Iteration**
```text
1. Advance slow: slow = slow.next (Node(-4))
2. Advance fast: fast = fast.next.next (Node(2) -> Node(0) -> Node(-4))

Linkage State:
          [ 3 ] ──► [ 2 ] ──► [ 0 ] ──► [ -4 ]
                     ▲                     ▲
                     │                  slow/fast
                     └─────────────────────┘
```
* **Next**: `slow === fast` (both point to `Node(-4)`). Loop exits. Returns `true`.

---

### 💻 6. Optimal Codes (TypeScript)

#### Code - Approach 1: Floyd's Cycle-Finding Algorithm (Tortoise & Hare)

```typescript
class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

function hasCycle(head: ListNode | null): boolean {
    if (head === null || head.next === null) {
        return false;
    }

    let slow: ListNode | null = head;
    let fast: ListNode | null = head;

    // fast moves twice as fast as slow
    while (fast !== null && fast.next !== null) {
        slow = slow!.next;
        fast = fast.next.next;

        // If they meet, a cycle exists
        if (slow === fast) {
            return true;
        }
    }

    // If fast hits null, no cycle exists
    return false;
}
```

---

#### Code - Approach 2: Hash Set Visited Nodes Tracking

```typescript
function hasCycleHashSet(head: ListNode | null): boolean {
    if (head === null || head.next === null) {
        return false;
    }

    // Hash Set to store references to visited nodes
    const visited = new Set<ListNode>();
    let current: ListNode | null = head;

    while (current !== null) {
        // If we've already visited this node, a cycle exists!
        if (visited.has(current)) {
            return true;
        }

        // Mark the node as visited
        visited.add(current);
        current = current.next;
    }

    // We reached null, so no cycle exists
    return false;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Floyd's Tortoise & Hare | Approach 2: Hash Set Visited Tracking |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — `fast` meets `slow` in at most $N$ steps once inside the loop. | **$O(N)$** — We visit each node in the list of length $N$ at most once. Set lookup is $O(1)$ average. |
| **Space Complexity** | **$O(1)$** — Uses only two pointer variables. | **$O(N)$** — Stores all node references in a Set of size $N$. |

#### Edge Cases Handled:
* **Empty List or Single Node** (`head = null` or `head.next = null`): Initial guards capture this and return `false` immediately (Correct).
* **Two Node Loop** (`1 -> 2 -> 1`):
  * Tortoise & Hare meet in exactly 2 loops (Correct).
  * Hash Set detects `1` on second visit and returns `true` (Correct).
