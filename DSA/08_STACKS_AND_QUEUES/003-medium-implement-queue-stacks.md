# 003. Implement Queue using Stacks (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **MUST SOLVE** - An absolute classic. Directly tests your understanding of data flow manipulation, amortized time complexity analysis, and LIFO/FIFO conversions.

---

### 📝 1. Problem Statement
Implement a First-In, First-Out (FIFO) queue using only two Last-In, First-Out (LIFO) stacks. The implemented queue should support all standard queue operations:
* `push(x)`: Pushes element `x` to the back of the queue.
* `pop()`: Removes the element from the front of the queue and returns it.
* `peek()`: Returns the element at the front of the queue without removing it.
* `empty()`: Returns `true` if the queue is empty, otherwise `false`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**:
  ```typescript
  let myQueue = new MyQueue();
  myQueue.push(1); // Queue is [1]
  myQueue.push(2); // Queue is [1, 2]
  myQueue.peek();  // Returns 1
  myQueue.pop();   // Returns 1, Queue is [2]
  myQueue.empty(); // Returns false
  ```
* **Output**: Correct queue behavior using stacks.

---

### 💬 3. What is This Problem Actually Asking?
A stack reverses order (LIFO). If we push elements into a stack and pop them out, the order is reversed.
If we push elements into a stack, pop them all out, and push them into a **second** stack, their order is reversed twice—which restores their original order! Double reversal produces FIFO behavior.

---

### 🌍 4. Real-Life Example
Think of an **Inbox and Outbox filing system** on an office desk:
* As documents arrive, you stack them on top of your **Inbox tray** (`push` to input stack). The newest documents are at the top.
* When you need to process a document (FIFO order), you take the papers from your Inbox and flip them one-by-one into the **Outbox tray** (`pop` from input, `push` to output).
* Now, the oldest document (which was at the very bottom of the Inbox) is sitting at the very top of the Outbox, ready to be picked up first!
* You process documents directly from the Outbox. As long as there are documents in the Outbox, you don't touch the Inbox. Once the Outbox is empty, you transfer the next batch from the Inbox.

---

### 🛠️ 5. Data Structure & Algorithms Used

We use two stacks:
1. `inputStack`: Handles incoming `push` operations.
2. `outputStack`: Handles outgoing `pop` and `peek` operations.

#### The Amortized $O(1)$ Approach:
* **Push(x)**: Always push to `inputStack` ($O(1)$ time).
* **Pop() / Peek()**:
  * If `outputStack` is empty:
    * Pop all elements from `inputStack` and push them into `outputStack`. (This flips the LIFO order to FIFO).
  * Pop/peek the top element of `outputStack` ($O(1)$ time).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Let's dry run the operations: `push(1)`, `push(2)`, `peek()`, `pop()`.

#### **Step 1: push(1)**
* `inputStack` = `[ 1 ]`
* `outputStack` = `[]`

#### **Step 2: push(2)**
* `inputStack` = `[ 1, 2 ]`
* `outputStack` = `[]`

#### **Step 3: peek()**
* `outputStack` is empty. We transfer everything:
  * Pop `2` from `inputStack` -> push to `outputStack` = `[ 2 ]`.
  * Pop `1` from `inputStack` -> push to `outputStack` = `[ 2, 1 ]`.
* Now, `inputStack` = `[]`, `outputStack` = `[ 2, 1 ]`.
* Top of `outputStack` is `1`. We return `1`.

#### **Step 4: pop()**
* `outputStack` is not empty, so we pop directly from it.
* Pop `1` from `outputStack`. Return `1`.
* `inputStack` = `[]`, `outputStack` = `[ 2 ]`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class MyQueue {
    private inputStack: number[];
    private outputStack: number[];

    constructor() {
        this.inputStack = [];
        this.outputStack = [];
    }

    push(x: number): void {
        this.inputStack.push(x);
    }

    pop(): number {
        this.shiftStacks();
        return this.outputStack.pop() ?? -1;
    }

    peek(): number {
        this.shiftStacks();
        return this.outputStack[this.outputStack.length - 1] ?? -1;
    }

    empty(): boolean {
        return this.inputStack.length === 0 && this.outputStack.length === 0;
    }

    /**
     * Helper function to shift elements from inputStack to outputStack
     * only when the outputStack is empty.
     */
    private shiftStacks(): void {
        if (this.outputStack.length === 0) {
            while (this.inputStack.length > 0) {
                this.outputStack.push(this.inputStack.pop()!);
            }
        }
    }
}
```

---

### 📊 7. Complexity & Edge Cases

| Operation | Time Complexity (Worst-Case) | Time Complexity (Amortized) | Space Complexity |
| :--- | :---: | :---: | :---: |
| `push()` | **$O(1)$** | **$O(1)$** | **$O(1)$** |
| `pop()` | **$O(N)$** | **$O(1)$** | **$O(1)$** |
| `peek()` | **$O(N)$** | **$O(1)$** | **$O(1)$** |
| `empty()` | **$O(1)$** | **$O(1)$** | **$O(1)$** |

#### Why Pop/Peek is Amortized $O(1)$:
Although a single `pop()` call might take $O(N)$ time when `outputStack` is empty (due to transferring $N$ elements), **each element is pushed to the input stack exactly once, popped from the input stack exactly once, pushed to the output stack exactly once, and popped from the output stack exactly once**.
Thus, over $K$ operations, the total work is $4K$ stack operations, yielding an average or **amortized time complexity of $O(1)$** per operation!
