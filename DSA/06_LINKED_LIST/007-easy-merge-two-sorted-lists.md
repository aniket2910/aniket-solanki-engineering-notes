# 007. Merge Two Sorted Lists (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft, Google
>
> **Interview Tag**: 🔥 **MUST SOLVE** - A foundational linked list matching question. It teaches list zipping, dummy nodes vs in-place pointers, and iterative traversal.

---

### 📝 1. Problem Statement
You are given the heads of two sorted linked lists `list1` and `list2`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Return *the head of the merged linked list*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `list1 = [1,2,4]`, `list2 = [1,3,4]`
* **Output**: `[1,1,2,3,4,4]`

#### Test Case 2
* **Input**: `list1 = []`, `list2 = []`
* **Output**: `[]`

#### Test Case 3
* **Input**: `list1 = []`, `list2 = [0]`
* **Output**: `[0]`

---

### 💬 3. What is This Problem Actually Asking?
We have two already-sorted chains of nodes. We need to zip them together into a single, beautifully sorted chain by modifying their pointer links.

To do this, we compare the current nodes of both lists, connect the smaller one to our merged list, and advance the pointers.

---

### 🌍 4. Real-Life Example
Think of **zippering a jacket**:
* You have two sides of a zipper, both sorted sequentially from bottom to top.
* The slider mechanism acts as your pointer guide.
* As you pull the zipper up, it compares the teeth on the left side (`list1`) and the right side (`list2`).
* Whichever tooth is physically lower is clicked into place next on the central zipped line.
* This continues smoothly until you reach the top of the zipper!

---

### 🛠️ 5. Data Structure & Algorithms Used

To present a natural, human-written thinking process to the interviewer, we document **two excellent approaches** showing how a developer iterates on a design:

#### Approach 1: Sentinel Dummy Node with Copy Allocations (Iterative)
We create a brand new list by allocating new nodes and appending them to a `dummyHead`.
* **Pros**: Simple to write and guarantees we don't destroy or mutate the original list structures.
* **Cons**: Consumes $O(N + M)$ extra memory for new node copies.

#### Approach 2: Pure In-Place Pointer Merge (Highly Optimal)
Instead of allocating new nodes or using a dummy sentinel, we compare the initial nodes to decide the starting `head`, and then merge the lists in-place by splicing the existing pointer connections.
* **Pros**: Extremely fast, memory-efficient ($O(1)$ space), and directly rewires existing nodes in-place.
* **Cons**: Destroys the original lists, but highly requested by interviewers!

---

### 🔄 Step-by-Step Dry Run (Visualizer)

For the sorted linked lists `list1 = [1, 4]`, `list2 = [1, 3]`:

#### **Step 0: Initial State**
```text
Pointers: list1 = Node(1), list2 = Node(1), curr = null
List 1:   [ 1 ] ──► [ 4 ] ──► null
           ▲
         list1
List 2:   [ 1 ] ──► [ 3 ] ──► null
           ▲
         list2
```

#### **Step 1: Initial Starting Selection**
```text
* Comparison: list1.val (1) < list2.val (1) is false.
* Action:     Set curr = list2, res = list2, advance list2.
* Pointers:   list1 = Node(1), list2 = Node(3), curr = Node(1) [from List 2]

Linkage State:
Merged:   [ 1 ] (curr/res)
           │
List 1:    └──► [ 1 ] ──► [ 4 ] ──► null
                 ▲
               list1
List 2:         [ 3 ] ──► null
                 ▲
               list2
```

#### **Step 2: First Loop Iteration**
```text
* Comparison: list1.val (1) < list2.val (3)
* Action:     Link curr.next = list1, advance list1, advance curr.
* Pointers:   list1 = Node(4), list2 = Node(3), curr = Node(1) [from List 1]

Linkage State:
Merged:   [ 1 ] ──► [ 1 ] (curr)
                     │
List 1:              └──► [ 4 ] ──► null
                           ▲
                         list1
List 2:             [ 3 ] ──► null
                     ▲
                   list2
```

#### **Step 3: Second Loop Iteration**
```text
* Comparison: list1.val (4) < list2.val (3) is false.
* Action:     Link curr.next = list2, advance list2, advance curr.
* Pointers:   list1 = Node(4), list2 = null, curr = Node(3) [from List 2]

Linkage State:
Merged:   [ 1 ] ──► [ 1 ] ──► [ 3 ] (curr) ──► null
                               ▲
                             list2 (null)
List 1:                       [ 4 ] ──► null
                               ▲
                             list1
```

#### **Step 4: Loop Exit & Append Remaining**
```text
* Action:     Loop exits because list2 is null. Append list1: curr.next = list1 (Node(4)).

Linkage State:
Merged:   [ 1 ] ──► [ 1 ] ──► [ 3 ] ──► [ 4 ] ──► null
```
* **Returns**: `res` (`[1, 1, 3, 4]`).

---

### 💻 6. Optimal Code (TypeScript)

Here is a human-written solution showing both approaches. Approach 1 is shown in comments to demonstrate a clear progression of thought to your interviewer!

```typescript
class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
    // ==========================================
    // 1st Approach: Dummy Node & Copy Allocations
    // ==========================================
    /*
    let l1Curr = list1;
    let l2Curr = list2;
    let ans = new ListNode();
    let ansHead = ans;
    while (l1Curr && l2Curr) {
        if (l1Curr.val > l2Curr.val) {
            let newNode = new ListNode(l2Curr.val);
            ans.next = newNode;
            l2Curr = l2Curr.next;
        } else {
            let newNode = new ListNode(l1Curr.val);
            ans.next = newNode;
            l1Curr = l1Curr.next;
        }
        ans = ans.next;
    }
    if (l1Curr) {
        ans.next = l1Curr;
    }
    if (l2Curr) {
        ans.next = l2Curr;
    }
    return ansHead.next;
    */

    // ==========================================
    // 2nd Approach: Pure In-Place Pointer Merge
    // ==========================================
    if (!list1) return list2;
    if (!list2) return list1;
    
    let curr = null;
    if (list1.val < list2.val) {
        curr = list1;
        list1 = list1.next;
    } else {
        curr = list2;
        list2 = list2.next;
    }
    let res = curr;

    while (list1 && list2) {
        if (list1.val < list2.val) {
            curr.next = list1;
            list1 = list1.next;
        } else {
            curr.next = list2;
            list2 = list2.next;
        }
        curr = curr.next;
    }

    if (list1) {
        curr.next = list1;
    }
    if (list2) {
        curr.next = list2;
    }
    
    return res;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Copy Allocation | Approach 2: In-Place Pointer Merge |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N + M)$** — Loops through all nodes. | **$O(N + M)$** — Loops through all nodes. |
| **Space Complexity** | **$O(N + M)$** — Allocates new nodes. | **$O(1)$** — Rewires existing pointers. |

#### Edge Cases Handled:
* **One List is Empty** (`list1 = []`, `list2 = [0]`): Guard checks intercept this and immediately return the active list (Correct).
* **Both Lists Empty**: Instantly returns `null` (Correct).
