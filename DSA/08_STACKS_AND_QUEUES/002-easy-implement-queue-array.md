# 002. Implement Queue using Array (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Core CS Fundamentals, Microsoft
>
> **Interview Tag**: Core Fundamentals - Essential for understanding circular buffers, queue pointer wrap-around, and modulo index arithmetic.

---

### 📝 1. Problem Statement
Implement a Queue data structure using a fixed-size array. The queue must support the following standard operations:
* `enqueue(x)`: Adds an element `x` to the back of the queue.
* `dequeue()`: Removes and returns the element from the front of the queue. If the queue is empty, return `-1`.
* `front()`: Returns the element at the front of the queue without removing it.
* `size()`: Returns the number of elements in the queue.
* `isEmpty()`: Returns `true` if the queue is empty, otherwise `false`.

To implement this efficiently (meaning `enqueue` and `dequeue` are both **$O(1)$** time), use a **circular array** implementation. Avoid shifting array elements during `dequeue`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**:
  ```typescript
  let queue = new CircularQueue(3);
  queue.enqueue(10);
  queue.enqueue(20);
  queue.enqueue(30);
  queue.dequeue(); // Returns 10
  queue.enqueue(40); // Wraps around to fill index 0
  queue.front(); // Returns 20
  ```
* **Output**: Correct queue behavior.

---

### 💬 3. What is This Problem Actually Asking?
We need to simulate a **First-In, First-Out (FIFO)** container. The hardest part of doing this with an array is avoiding $O(N)$ dequeue times (which occur if you shift all other items forward after removing the first one).
To achieve $O(1)$ time, we keep two indices: `front` and `rear`, and let them wrap around to the beginning of the array using modulo arithmetic `(index + 1) % capacity`.

---

### 🌍 4. Real-Life Example
Think of a **roundabouts queue** or a **circular conveyor belt**:
* Luggage is loaded onto the belt at the `rear` loading point (`enqueue`).
* Passengers retrieve luggage from the belt at the `front` retrieval point (`dequeue`).
* Once the belt slots wrap around, new luggage can occupy the slots that passengers have already emptied.

---

### 🛠️ 5. Data Structure & Algorithms Used
We maintain:
1. `arr`: A fixed-size array of size `capacity`.
2. `front`: Pointer to the first element in the queue.
3. `rear`: Pointer to the last element in the queue.
4. `currSize`: Running count of elements in the queue (makes check for empty/full trivial).

* **Enqueue**: If full, throw overflow. Otherwise, update `rear = (rear + 1) % capacity`, put element at `arr[rear]`, and increment `currSize`.
* **Dequeue**: If empty, return `-1`. Otherwise, retrieve `arr[front]`, update `front = (front + 1) % capacity`, and decrement `currSize`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run a circular queue of capacity 3:

#### **Step 0: Initial State**
* `front` = `0`, `rear` = `-1`, `currSize` = `0`
* `arr` = `[ null, null, null ]`

#### **Step 1: enqueue(10)**
* `rear = (rear + 1) % 3` = `0`.
* `arr[0] = 10`. `currSize` = `1`.
* `arr` = `[ 10, null, null ]`

#### **Step 2: enqueue(20)**
* `rear = (rear + 1) % 3` = `1`.
* `arr[1] = 20`. `currSize` = `2`.
* `arr` = `[ 10, 20, null ]`

#### **Step 3: dequeue()**
* Returns `arr[front]` -> `arr[0] = 10`.
* `front = (front + 1) % 3` = `1`. `currSize` = `1`.
* `arr` = `[ (empty), 20, null ]`

#### **Step 4: enqueue(30) then enqueue(40)**
* `enqueue(30)`: `rear` = `2`, `arr[2] = 30`, `currSize` = `2`.
* `enqueue(40)`: `rear = (2 + 1) % 3 = 0`. `arr[0] = 40`, `currSize` = `3`.
* `arr` = `[ 40, 20, 30 ]` (the queue is full, `front` points to `20` at index 1).

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class CircularQueue {
    private arr: number[];
    private frontIdx: number;
    private rearIdx: number;
    private currSize: number;
    private capacity: number;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.arr = new Array(capacity);
        this.frontIdx = 0;
        this.rearIdx = -1;
        this.currSize = 0;
    }

    enqueue(x: number): void {
        if (this.currSize === this.capacity) {
            throw new Error("Queue Overflow: Queue is full");
        }
        // Wrap around rear pointer circular-wise
        this.rearIdx = (this.rearIdx + 1) % this.capacity;
        this.arr[this.rearIdx] = x;
        this.currSize++;
    }

    dequeue(): number {
        if (this.isEmpty()) {
            return -1;
        }
        const val = this.arr[this.frontIdx];
        // Wrap around front pointer circular-wise
        this.frontIdx = (this.frontIdx + 1) % this.capacity;
        this.currSize--;
        return val;
    }

    front(): number {
        if (this.isEmpty()) {
            return -1;
        }
        return this.arr[this.frontIdx];
    }

    size(): number {
        return this.currSize;
    }

    isEmpty(): boolean {
        return this.currSize === 0;
    }
}
```

---

### 📊 7. Complexity & Edge Cases

| Operation | Time Complexity | Space Complexity |
| :--- | :---: | :---: |
| `enqueue()` | **$O(1)$** | **$O(1)$** |
| `dequeue()` | **$O(1)$** | **$O(1)$** |
| `front()` | **$O(1)$** | **$O(1)$** |
| `isEmpty()` | **$O(1)$** | **$O(1)$** |

#### Edge Cases Handled:
* **Circular Wrap-around**: Correctly re-uses index positions `0` after `front` has moved past them, utilizing space perfectly without memory leaks.
* **Underflow/Overflow**: Blocked by checking `currSize === 0` and `currSize === capacity`.
