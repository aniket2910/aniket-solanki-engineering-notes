# 009. Palindrome Linked List (Easy)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **MUST SOLVE** - An outstanding interview question. Tests your ability to find a list's middle, reverse sub-parts, and manage space-time complexity trade-offs.

---

### 📝 1. Problem Statement
Given the `head` of a singly linked list, return `true` *if it is a palindrome or `false` otherwise*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `head = [1, 2, 2, 1]`
* **Output**: `true`

#### Test Case 2
* **Input**: `head = [1, 2]`
* **Output**: `false`

---

### 💬 3. What is This Problem Actually Asking?
We need to check if the sequence of node values is symmetrical (reads the same from left-to-right and right-to-left).

Singly linked lists only have `next` pointers (we cannot traverse backwards). So we have two strategic directions:
1. Copy the values into a data structure that supports two-pointer traversal (like an Array).
2. Cleverly reverse the second half of the linked list in-place so we can compare it with the first half using only forward pointers!

---

### 🌍 4. Real-Life Example
Think of a **train of passenger cars symmetric by cargo type**:
* **Approach 1**: You write down the cargo types on a sheet of paper. Then you check the paper from both ends.
* **Approach 2 (In-Place)**: You find the middle coupling, split the train, physically reverse all second-half cars, and align them side-by-side with the first half to inspect them directly. This saves paper!

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two distinct approaches** to showcase analytical depth to your interviewer:

#### Approach 1: Array Copy Conversion (Highly Intuitive)
We iterate through the linked list, dump all node values into an array, and then run a standard two-pointer check towards the center.
* **Pros**: Incredibly simple, fast to write, and avoids modifying the input list.
* **Cons**: Consumes $O(N)$ extra space to store the array values.

#### Approach 2: Middle Finding + Reversal + Comparison (Optimal)
We perform an in-place inspection:
1. **Find the Middle**: Walk the list with `slow` and `fast` pointers.
2. **Reverse the Second Half**: Reverse the second half starting at the middle node.
3. **Compare**: Slide pointers on the first half and reversed second half together, comparing values.
* **Pros**: Highly optimal, runs in $O(1)$ auxiliary space.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

For the linked list `head = [1, 2, 2, 1]`:

#### **Stage 1: Find Middle Node**

##### **Step 0: Initial State**
```text
Pointers: slow = Node(1), fast = Node(1)
List:     [ 1 ] ──► [ 2 ] ──► [ 2 ] ──► [ 1 ] ──► null
           ▲
       slow/fast
```

##### **Step 1: First Iteration**
```text
* Actions:  slow = slow.next (Node(2)), fast = fast.next.next (Node(2))
* Pointers: slow = Node(2), fast = Node(2) [index 2]
List:     [ 1 ] ──► [ 2 ] ──► [ 2 ] ──► [ 1 ] ──► null
                     ▲         ▲
                   slow       fast
```

##### **Step 2: Second Iteration**
```text
* Actions:  slow = slow.next (Node(2)), fast = fast.next.next (null)
* Pointers: slow = Node(2) [index 2], fast = null
List:     [ 1 ] ──► [ 2 ] ──► [ 2 ] ──► [ 1 ] ──► null
                               ▲                 ▲
                             slow               fast (null)
```
* **Loop Exit**: `fast` is `null`. `slow` represents the starting point of the second half.

---

#### **Stage 2: Reverse Second Half**

##### **Step 0: Initial State**
```text
Pointers: prev = null, curr = Node(2) [index 2]
List:     [ 2 ] ──► [ 1 ] ──► null
           ▲
          curr
```

##### **Step 1: First Iteration**
```text
* Actions:  temp = curr.next (Node(1)), curr.next = prev (null)
            prev = curr (Node(2)), curr = temp (Node(1))
Linkage State:
          null ◄── [ 2 ]        [ 1 ] ──► null
                    ▲            ▲
                  prev          curr
```

##### **Step 2: Second Iteration**
```text
* Actions:  temp = curr.next (null), curr.next = prev (Node(2))
            prev = curr (Node(1)), curr = temp (null)
Linkage State:
          null ◄── [ 2 ] ◄── [ 1 ]
                              ▲     ▲
                            prev   curr (null)
```
* **Reversal finished**. Reversed second half head is `prev` (`Node(1)` -> `[1, 2]`).

---

#### **Stage 3: Palindrome Value Comparison**

##### **Step 0: Comparison Initialization**
```text
Pointers: p1 = head (Node(1)), p2 = prev (Node(1))
List 1:   [ 1 ] ──► [ 2 ] ──► ...
           ▲
          p1
List 2:   [ 1 ] ──► [ 2 ] ──► null
           ▲
          p2
```

##### **Step 1: First Compare**
* **Check**: `p1.val` (1) === `p2.val` (1) -> Match!
* **Actions**: `p1 = p1.next` (`Node(2)`), `p2 = p2.next` (`Node(2)`)

##### **Step 2: Second Compare**
* **Check**: `p1.val` (2) === `p2.val` (2) -> Match!
* **Actions**: `p1 = p1.next` (`Node(2)`), `p2 = p2.next` (`null`)
* **Loop Exit**: `p2` is `null`. Palindrome check passes! Returns `true`.

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

function isPalindrome(head: ListNode | null): boolean {
    // ==========================================
    // 1st Approach: Array Copy Conversion
    // ==========================================
    /*
    if (!head || !head.next) return true;
    
    let vals: number[] = [];
    let curr: ListNode | null = head;
    while (curr) {
        vals.push(curr.val);
        curr = curr.next;
    }
    
    let left = 0;
    let right = vals.length - 1;
    while (left < right) {
        if (vals[left] !== vals[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
    */

    // ==========================================
    // 2nd Approach: In-Place Middle Reversal (Optimal)
    // ==========================================
    if (!head || !head.next) return true;

    // 1. Find middle node (slow stops at middle)
    let slow: ListNode | null = head;
    let fast: ListNode | null = head;
    while (fast && fast.next) {
        slow = slow!.next;
        fast = fast.next.next;
    }

    // 2. Reverse second half starting from slow
    let prev: ListNode | null = null;
    let curr: ListNode | null = slow;
    while (curr) {
        let temp: ListNode | null = curr.next;
        curr.next = prev;
        prev = curr;
        curr = temp;
    }

    // 3. Compare both halves (prev is head of reversed second half)
    let p1: ListNode | null = head;
    let p2: ListNode | null = prev;
    
    while (p2) {
        if (p1!.val !== p2.val) {
            return false;
        }
        p1 = p1!.next;
        p2 = p2.next;
    }

    return true;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Array Copy | Approach 2: In-Place Reversal |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — We scan the list once and the array once. | **$O(N)$** — $N/2$ steps to find middle, $N/2$ to reverse, $N/2$ to compare. |
| **Space Complexity** | **$O(N)$** — Required to store values in the array. | **$O(1)$** — Pure in-place operations using pointer re-wiring. |

#### Edge Cases Handled:
* **Symmetric vs Asymmetric Odd/Even Lists**: Both lists terminate accurately because the loop condition `while (p2)` cleanly stops when the shorter second half runs out.
* **Single Element list** (`[1]`): Returns `true` instantly via our initial guard (Correct).
