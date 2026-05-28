# 013. Add Two Numbers (Medium)

---

### 📝 1. Problem Statement
You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `l1 = [2, 4, 3]`, `l2 = [5, 6, 4]`
* **Output**: `[7, 0, 8]`
* **Why**: $342 + 465 = 807$. (Digits stored in reverse order: `2 -> 4 -> 3` represents $342$).

#### Test Case 2
* **Input**: `l1 = [0]`, `l2 = [0]`
* **Output**: `[0]`

#### Test Case 3
* **Input**: `l1 = [9,9,9,9,9,9,9]`, `l2 = [9,9,9,9]`
* **Output**: `[8,9,9,9,0,0,0,1]`
* **Why**: $9999999 + 9999 = 10009998$.

---

### 💬 3. What is This Problem Actually Asking?
We need to perform standard elementary school **addition with carries**, but the digits are stored as nodes in two linked lists.
* **The Blessing**: The digits are stored in **reverse order** (meaning the ones place is at the head, followed by the tens place, hundreds place, etc.). This is actually a major advantage! In standard addition, we always start adding from the ones place (right-to-left). Since the lists start at the ones place (head-to-tail), we can just traverse forward from head to tail, adding numbers naturally!
* **The Challenge**: We must manage carry-over values (e.g. $8 + 7 = 15 \rightarrow$ write $5$, carry $1$). If we finish traversing both lists but still have a remaining carry of `1`, we must append a new node at the very end to hold it.

---

### 🌍 4. Real-Life Example
Think of doing **addition with paper cards**:
* You have two stacks of cards. 
  * Stack A has digits: `[2, 4, 3]` (representing 342)
  * Stack B has digits: `[5, 6, 4]` (representing 465)
* You pull the top card of both stacks:
  1. $2 + 5 = 7$. No carry. You write `7`.
  2. $4 + 6 = 10$. You write `0`, carry `1` to the next step.
  3. $3 + 4 + \text{carry}(1) = 8$. You write `8`.
* You are left with Stack `[7, 0, 8]`!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Singly Linked List** (`ListNode`).
* **Algorithm**: **Sentinel Dummy Node + Elementary Addition Loop**.
  * *Why*: We allocate a `dummyHead` sentinel node.
    * We place a `curr` pointer at `dummyHead`.
    * We maintain a `carry` integer variable initialized to `0`.
    * We loop while `l1` exists, `l2` exists, or `carry > 0`:
      * Sum the values: `sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry`.
      * Update carry: `carry = Math.floor(sum / 10)`.
      * Create the next node containing the digit: `curr.next = new ListNode(sum % 10)`.
      * Move pointers: `curr = curr.next`, `l1 = l1.next`, `l2 = l2.next`.
    * Returns `dummyHead.next`.

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

function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    // Sentinel Dummy Node to anchor the resulting sum list
    const dummyHead = new ListNode(-1);
    let curr: ListNode = dummyHead;
    
    let carry: number = 0;

    // Loop continues if there are remaining digits in l1, l2, or an active carry
    while (l1 !== null || l2 !== null || carry > 0) {
        let sum: number = carry;

        if (l1 !== null) {
            sum += l1.val;
            l1 = l1.next;
        }

        if (l2 !== null) {
            sum += l2.val;
            l2 = l2.next;
        }

        // Calculate new carry and current digit to write
        carry = Math.floor(sum / 10);
        curr.next = new ListNode(sum % 10);
        
        // Move result list pointer forward
        curr = curr.next;
    }

    return dummyHead.next;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(\max(M, N))$** — The loop runs proportional to the length of the longer list among `l1` and `l2` (plus at most 1 extra iteration for a remaining carry).
* **Space Complexity**: **$O(\max(M, N))$** — The resulting list requires $O(\max(M, N) + 1)$ node allocations to store the sum.

#### Edge Cases Handled:
* **Carry at the Very End** (`l1 = [9]`, `l2 = [1]`):
  * `9 + 1 = 10` $\rightarrow$ write `0`, `carry = 1`.
  * In the next loop iteration, `l1 === null` and `l2 === null`, but `carry = 1 > 0` is true.
  * Loop runs: `sum = 1`, `carry = 0`, `curr.next = Node(1)`.
  * Returns `[0, 1]` (representing 10) (Correct).
* **Lists of Different Lengths** (`[9, 9] + [1]`):
  * First step: `9 + 1 = 10` $\rightarrow$ write `0`, `carry = 1`.
  * Second step: `9 + \text{carry}(1) = 10` $\rightarrow$ write `0`, `carry = 1`.
  * Third step: carry `1` written $\rightarrow$ returns `[0, 0, 1]` (Correct).
