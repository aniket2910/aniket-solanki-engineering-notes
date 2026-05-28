# 008. Intersection of Two Linked Lists (Easy)

---

### 📝 1. Problem Statement
Given the heads of two singly linked-lists `headA` and `headB`, return *the node at which the two lists intersect*. If the two linked lists have no intersection at all, return `null`.

For example, the following two linked lists begin to intersect at node `c1`:
```text
A:          a1 → a2
                   ↘
                     c1 → c2 → c3
                   ↗
B:     b1 → b2 → b3
```

The test cases are generated such that there are no cycles anywhere in the entire linked structure.
**Note** that the linked lists must **retain their original structure** after the function returns.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `intersectVal = 8`, `listA = [4, 1, 8, 4, 5]`, `listB = [5, 6, 1, 8, 4, 5]`, `skipA = 2`, `skipB = 3`
* **Output**: `Intersected at '8'`
* **Why**: The intersected node's value is `8` (note that the transition occurs at the same reference node, not just identical value nodes).

#### Test Case 2
* **Input**: `intersectVal = 0`, `listA = [2, 6, 4]`, `listB = [1, 5]`, `skipA = 3`, `skipB = 2`
* **Output**: `null`
* **Why**: The two lists do not intersect, so we return `null`.

---

### 💬 3. What is This Problem Actually Asking?
We have two different linked lists that eventually merge into a shared "Y-shaped" tail. We need to find the **exact reference node** where this merge occurs.

The difficulty is that **the two lists can be of different lengths**.
* List A has a head segment of length $L_A$ before the merge.
* List B has a head segment of length $L_B$ before the merge.
* Because of this length difference, if we place two pointers at the two heads and move them forward at the same speed, they will arrive at the merge node at different times, missing each other!
* We must align them in linear time ($O(N + M)$) and constant space ($O(1)$).

---

### 🌍 4. Real-Life Example
Think of **two friends walking along different hiking trails that eventually merge into a single shared trail**:
* Friend A's trail is **3 miles long** before the merge.
* Friend B's trail is **5 miles long** before the merge.
* If they start walking at the same speed, Friend A reaches the merge point first and is already far down the shared trail by the time Friend B arrives.
* To coordinate their arrival:
  * When Friend A reaches the end of the shared trail, they immediately teleport to the **beginning of Friend B's trail**.
  * When Friend B reaches the end of the shared trail, they immediately teleport to the **beginning of Friend A's trail**.
* By swapping paths, **both friends walk exactly the same total distance** ($3 + 5 = 8$ miles) before they meet! They will arrive at the merge node at the exact same step!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Singly Linked Lists** (`ListNode`).
* **Algorithm**: **Cyclic Path-Equality Pointer Swap**.
  * *Why*: We declare two pointer variables: `pA` starting at `headA`, and `pB` starting at `headB`.
    * In each step, we advance both pointers: `pA = pA.next` and `pB = pB.next`.
    * When `pA` reaches the end (`null`), we redirect it to `headB`.
    * When `pB` reaches the end (`null`), we redirect it to `headA`.
  * If they intersect, they will meet at the intersection node because both pointers are guaranteed to have walked exactly $A + B + \text{shared}$ nodes.
  * If they do not intersect, they will both hit `null` at the exact same step at the end of their cyclic swap, exiting the loop cleanly and returning `null`.

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

function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
    if (headA === null || headB === null) {
        return null;
    }

    let pA: ListNode | null = headA;
    let pB: ListNode | null = headB;

    // The loop will terminate either when they meet (intersection node)
    // or when both reach null at the same time (no intersection)
    while (pA !== pB) {
        // If pA hits the end, redirect it to headB; otherwise move forward
        pA = pA === null ? headB : pA.next;
        // If pB hits the end, redirect it to headA; otherwise move forward
        pB = pB === null ? headA : pB.next;
    }

    return pA;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(M + N)$** — In the worst case, each pointer walks exactly $M + N$ steps (where $M$ and $N$ are the lengths of List A and List B).
* **Space Complexity**: **$O(1)$** — We use only two constant pointer variables (`pA`, `pB`).

#### Edge Cases Handled:
* **No Intersection** (`listA = [2,6]`, `listB = [1]`):
  * `pA` walks `2 -> 6 -> null` $\rightarrow$ redirects to `headB` (`1`).
  * `pB` walks `1 -> null` $\rightarrow$ redirects to `headA` (`2`).
  * In the second cycle, both will walk the remaining lengths and hit `null` at the exact same step, causing `pA === pB` (`null === null`) to be true. The loop terminates, returning `null` (Correct).
* **Lists of Equal Length Intersecting**: Pointers meet on the first pass without needing to trigger the swap redirection (Correct).
