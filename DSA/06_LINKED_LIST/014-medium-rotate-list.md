# 014. Rotate List (Medium)

---

### 📝 1. Problem Statement
Given the `head` of a linked list, rotate the list to the right by `k` places.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `head = [1, 2, 3, 4, 5]`, `k = 2`
* **Output**: `[4, 5, 1, 2, 3]`
* **Why**: 
  * Rotate 1 place to the right: `[5, 1, 2, 3, 4]`
  * Rotate 2 places to the right: `[4, 5, 1, 2, 3]`

#### Test Case 2
* **Input**: `head = [0, 1, 2]`, `k = 4`
* **Output**: `[2, 0, 1]`
* **Why**:
  * Rotate 1 place: `[2, 0, 1]`
  * Rotate 2 places: `[1, 2, 0]`
  * Rotate 3 places: `[0, 1, 2]` (back to start!)
  * Rotate 4 places: `[2, 0, 1]` (equivalent to rotating $4 \pmod 3 = 1$ place).

---

### 💬 3. What is This Problem Actually Asking?
We need to shift the elements of our linked list to the right by `k` slots. Elements pushed off the end (tail) must wrap around to the front (head).

The primary challenges are:
* **`k` can be extremely large**: If `k = 2,000,000,000` and list length is `3`, performing rotations one-by-one in a loop will time out. 
  * *The Solution*: Calculate the length of the list `length`. If `k` is larger than `length`, we only need to perform `k % length` rotations because rotating a list by its own length results in the exact same list.
* **Efficient Re-Linking**: We want to do this without shifting elements. We can achieve this by joining the tail node to the head node to form a **circular ring**, and then cutting this ring at the exact correct index!

---

### 🌍 4. Real-Life Example
Think of a **rotating combination padlock or combination lock dial containing numbers**:
* You have numbers `[1, 2, 3, 4, 5]` formed in a closed loop circle.
* If you rotate the circle to the right by 2 positions:
  * The numbers are now positioned: `[4, 5, 1, 2, 3]`.
* If you want to lay it out flat as a straight line again, you simply locate the gap between `3` and `4`, and **decouple/cut the link at that specific boundary**.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Singly Linked List** (`ListNode`).
* **Algorithm**: **Circular List Creation and Split**.
  * *Why*: Rather than moving elements, we:
    1. Walk the list to find its **length** `L`, ending on the tail node.
    2. Connect `tail.next = head` to form a **circular loop**.
    3. Calculate the exact split index from the beginning: `splitStep = L - (k % L)`.
    4. Walk `splitStep` steps from the head. This lands us on the **new tail node** of our rotated list.
    5. Save `newHead = newTail.next`.
    6. Cut the circle: `newTail.next = null`.
    7. Return `newHead`.

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

function rotateRight(head: ListNode | null, k: number): ListNode | null {
    if (head === null || head.next === null || k === 0) {
        return head;
    }

    // Step 1: Calculate the length of the list and locate the tail node
    let length = 1;
    let tail: ListNode = head;
    while (tail.next !== null) {
        tail = tail.next;
        length++;
    }

    // Step 2: Form a circular loop
    tail.next = head;

    // Step 3: Calculate the exact steps needed to reach the new tail.
    // k % length handles cases where k is larger than the list length.
    const stepsToNewTail = length - (k % length);
    
    let newTail: ListNode = head;
    for (let i = 1; i < stepsToNewTail; i++) {
        newTail = newTail.next!;
    }

    // Step 4: Break the circular loop and return the new head
    const newHead = newTail.next;
    newTail.next = null;

    return newHead;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** —
  * Finding length and tail takes $N$ steps.
  * Moving to the split node takes at most $N$ steps.
  * **Total Time Complexity**: **$O(N)$**
* **Space Complexity**: **$O(1)$** — All rotations occur completely in-place by re-wiring pointer arrows. No extra memory is allocated.

#### Edge Cases Handled:
* **`k` is a Multiple of Length** (`nums = [1, 2]`, `k = 4`):
  * `length = 2`. `k % length = 4 % 2 = 0`.
  * `stepsToNewTail = 2 - 0 = 2`.
  * `newTail` starts at `head` (`1`), loops once $\rightarrow$ advances to `2`.
  * `newHead = newTail.next` (which is `head`, i.e. `1`).
  * `newTail.next = null` cuts the loop. Returns `[1, 2]` unchanged (Correct).
* **Empty List or Single Node** (`head = null` or `head.next = null`): Initial `if` check intercepts this and returns `head` immediately (Correct).
