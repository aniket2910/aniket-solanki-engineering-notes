# 004. Implement Stack using Queues (Medium)

> [!IMPORTANT]
> **Interview Tag**: System Simulation - Excellent for testing creative data flow design. The **single-queue rotation method** is highly preferred by interviewers over the two-queue approach due to its minimal footprint.

---

### 📝 1. Problem Statement
Implement a Last-In, First-Out (LIFO) stack using only standard queue operations. The stack must support:
* `push(x)`: Pushes element `x` onto the stack.
* `pop()`: Removes the element on top of the stack and returns it.
* `top()`: Returns the element on top of the stack without removing it.
* `empty()`: Returns `true` if the stack is empty, otherwise `false`.

You must implement this stack using **only one Queue** container. Standard queue operations include `enqueue` (add to back), `dequeue` (remove from front), `peek` (get front element), and `size`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**:
  ```typescript
  let myStack = new MyStack();
  myStack.push(1); // Queue represents stack [1]
  myStack.push(2); // Queue represents stack [1, 2]
  myStack.top();   // Returns 2
  myStack.pop();   // Returns 2, stack is [1]
  myStack.empty(); // Returns false
  ```
* **Output**: Correct stack behavior using a queue.

---

### 💬 3. What is This Problem Actually Asking?
A queue is FIFO (First-In, First-Out). A stack is LIFO (Last-In, First-Out). We need to transform FIFO behavior into LIFO.
The key trick is: whenever we add a new element to the back of the queue, we need a way to move it to the front so that it gets dequeued first.

---

### 🌍 4. Real-Life Example
Think of a **Circular Rotating Spice Rack (Lazy Susan)**:
* You load spices from the back of the rack.
* To make sure the spice you just added is the one you retrieve first, you spin the rack until the newly added spice rotates all the way around to the front.
* All other spices rotate behind it, maintaining their relative order, but the newest one is now right in front of you.

---

### 🛠️ 5. Data Structure & Algorithms Used

We use a single standard JavaScript array acting strictly as a queue (using `.push()` for `enqueue` and `.shift()` for `dequeue`).

#### The Rotation Trick (in `push(x)`):
1. Get the current size of the queue before pushing, say `size`.
2. Enqueue the new element `x` to the back of the queue.
3. Run a loop `size` times:
   * Dequeue the element from the front.
   * Immediately enqueue it back to the rear.
4. By the end of this loop, the new element `x` has rotated to the front of the queue, and all older elements are shifted behind it in correct stack order.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Let's dry run `push(1)`, `push(2)`, `pop()`.

#### **Step 1: push(1)**
* Queue size before push is `0`.
* Enqueue `1`. Queue = `[ 1 ]`.
* Loop runs `0` times.
* Queue representation: Front -> `[ 1 ]` <- Rear.

#### **Step 2: push(2)**
* Queue size before push is `1`.
* Enqueue `2`. Queue = `[ 1, 2 ]`.
* Loop runs `1` time:
  * Dequeue `1` from front. Queue becomes `[ 2 ]`.
  * Enqueue `1` to rear. Queue becomes `[ 2, 1 ]`.
* Queue representation: Front -> `[ 2, 1 ]` <- Rear. (Notice `2` is now at the front!).

#### **Step 3: pop()**
* Dequeue directly from front.
* Dequeue returns `2`.
* Queue becomes `[ 1 ]`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class MyStack {
    private queue: number[];

    constructor() {
        this.queue = [];
    }

    push(x: number): void {
        const size = this.queue.length;
        // Enqueue the new element
        this.queue.push(x);

        // Rotate the queue: Dequeue the front element and enqueue it to the back
        // Do this for all elements that were in the queue before pushing 'x'
        for (let i = 0; i < size; i++) {
            const temp = this.queue.shift()!;
            this.queue.push(temp);
        }
    }

    pop(): number {
        if (this.empty()) {
            return -1;
        }
        // Since we rotated on push, the top stack element is at the front of the queue
        return this.queue.shift()!;
    }

    top(): number {
        if (this.empty()) {
            return -1;
        }
        return this.queue[0];
    }

    empty(): boolean {
        return this.queue.length === 0;
    }
}
```

---

### 📊 7. Complexity & Edge Cases

| Operation | Time Complexity | Space Complexity |
| :--- | :---: | :---: |
| `push()` | **$O(N)$** — Rotates all $N$ elements once. | **$O(1)$** — Done in-place in the queue. |
| `pop()` | **$O(1)$** | **$O(1)$** |
| `top()` | **$O(1)$** | **$O(1)$** |
| `empty()` | **$O(1)$** | **$O(1)$** |

#### Trade-offs:
* This design trades off `push` performance ($O(N)$ time) to make `pop` and `top` run in $O(1)$ time. This is optimal if your read/pop frequency is much higher than your push frequency.
