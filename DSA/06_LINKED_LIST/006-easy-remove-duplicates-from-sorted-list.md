# 006. Remove Duplicates from Sorted List (Easy)

---

### 📝 1. Problem Statement
Given the `head` of a sorted linked list, *delete all duplicates such that each element appears only once*. Return *the linked list **sorted** as well*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `head = [1, 1, 2]`
* **Output**: `[1, 2]`

#### Test Case 2
* **Input**: `head = [1, 1, 2, 3, 3]`
* **Output**: `[1, 2, 3]`

---

### 💬 3. What is This Problem Actually Asking?
We have a linked list that is **already sorted** in ascending order. We need to walk through it and delete duplicate values so that each number appears exactly once.

Because the list is sorted, **all duplicate numbers are guaranteed to be adjacent to each other** (next to each other). We can resolve this in a single pass without needing any sets or auxiliary space.

---

### 🌍 4. Real-Life Example
Think of a **train of passenger cars, where some adjacent cars have duplicate cargo tags**:
* `[Cargo 1] -> [Cargo 1] -> [Cargo 2] -> [Cargo 3] -> [Cargo 3]`
* To remove the duplicates, the conductor starts at the first car:
  * Looks at the next car. Since it has the same tag (`1`), the conductor unhooks it and links the first car directly to the third car (`Cargo 2`).
  * The conductor now looks at the next car (`Cargo 3`). Different tag! So the conductor walks forward to the `Cargo 2` car.
  * Looks at the next car. Same tag (`3`)! Unhooks it.
* The train is left with only unique cargo cars!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Singly Linked List** (`ListNode`).
* **Algorithm**: **Adjacent Pointer Comparison and Skip**.
  * *Why*: We place a single pointer `curr` at the `head`.
    * While `curr` and `curr.next` exist:
      * If `curr.val === curr.next.val`: We skip `curr.next` by rewiring `curr.next = curr.next.next`.
      * Otherwise (when they are unique): We simply advance our pointer `curr = curr.next`.
    * This modifies the chain entirely in-place.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

For the linked list `head = [1, 1, 2]`:

#### **Step 0: Initial State**
```text
Pointers: curr = Node(1)
List:     [ 1 ] ──► [ 1 ] ──► [ 2 ] ──► null
           ▲
          curr
```

#### **Step 1: First Iteration**
```text
* Comparison: curr.val (1) === curr.next.val (1)
* Action:     Duplicate detected! Bypass next node: curr.next = curr.next.next (Node(2))
* Pointers:   curr = Node(1) (Does not advance)

Linkage State:
List:     [ 1 ] ──────────────► [ 2 ] ──► null
           ▲      └─► [ 1 ] ──x
          curr
```

#### **Step 2: Second Iteration**
```text
* Comparison: curr.val (1) !== curr.next.val (2)
* Action:     Advance curr pointer
* Pointers:   curr = Node(2)
List:     [ 1 ] ──► [ 2 ] ──► null
                     ▲
                    curr
```
* **Next**: `curr.next` is null, loop exits. Returns `head` (`[1, 2]`).

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

function deleteDuplicates(head: ListNode | null): ListNode | null {
    let curr: ListNode | null = head;

    // Traverse the list
    while (curr !== null && curr.next !== null) {
        if (curr.val === curr.next.val) {
            // Found a duplicate! Skip the next node.
            // Do NOT advance curr pointer yet, because the new curr.next might also be a duplicate!
            curr.next = curr.next.next;
        } else {
            // No duplicate, safe to advance pointer
            curr = curr.next;
        }
    }

    return head;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We traverse the list of length $N$ exactly once.
* **Space Complexity**: **$O(1)$** — We only allocate a single tracking pointer variable (`curr`).

#### Edge Cases Handled:
* **Empty List or Single Node** (`head = null` or `head.next = null`): Loop conditions fail instantly. Returns `head` unchanged (Correct).
* **Multiple Duplicates in a Row** (`[1, 1, 1]`):
  * First pass: `curr` is first `1`. Skips second `1` $\rightarrow$ list becomes `1 -> 1`.
  * Since we don't advance `curr` on a deletion, we compare first `1` with the remaining `1` and skip it $\rightarrow$ list becomes `1 -> null`. Returns `[1]` (Correct).
