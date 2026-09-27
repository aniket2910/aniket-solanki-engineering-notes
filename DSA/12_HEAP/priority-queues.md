# Priority Queues

This document provides a highly visual, plain-English breakdown of **Priority Queues**, highlighting their heap-based implementations, a generic TypeScript class, and real-world system applications.

---

## 📌 1. What is a Priority Queue?

A **Priority Queue** is an abstract data structure similar to a standard queue, except that each element has an associated **priority**.
*   In a **Standard Queue (FIFO)**, elements are dequeued in the exact order they arrived.
*   In a **Priority Queue**, elements are dequeued based on priority: elements with higher priority (or lower priority values in a min-priority queue) are served first.

### Why use a Heap?
We could implement a Priority Queue using an array or linked list, but the complexities are sub-optimal:
*   *Unsorted Array*: Enqueue $O(1)$, Dequeue $O(N)$ (requires searching for highest priority).
*   *Sorted Array*: Enqueue $O(N)$ (requires shifting elements), Dequeue $O(1)$.
*   **Binary Heap (Optimal)**: Enqueue **$O(\log N)$**, Dequeue **$O(\log N)$**, Peek **$O(1)$**.

---

### ⚠️ Inefficient Sorting Technique vs. Heap Technique

#### 1. Sorting Technique (Inefficient)
A simple way to build a priority queue is to push items onto an array and sort it descending/ascending on every single insert. 

```javascript
class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    // enqueue: Push the Value and sort
    enqueue(value, priority) {
        this.queue.push({ value, priority });
        this.queue.sort((a, b) => b.priority - a.priority); // Highest Priority first (Max-Priority)
    }

    // dequeue: Remove the highest priority item from the front
    dequeue() {
        return this.queue.shift();  // Remove the first item
    }

    peek() {
        return this.queue[0];
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

// Demo Usage:
const pq = new PriorityQueue();
pq.enqueue("Fever", 1);
pq.enqueue("Accident", 5);
pq.enqueue("Headache", 3);

console.log(pq.dequeue());  // { value: 'Accident', priority: 5 }
console.log(pq.dequeue());  // { value: 'Headache', priority: 3 }
```

*   **Complexity Trap**: Sorting takes **$O(N \log N)$** time. Calling `sort()` on every `enqueue` makes insertion very slow. If you insert $N$ items, the total complexity scales to **$O(N^2 \log N)$**.
*   **The Better Way**: A binary heap resolves this by bubble adjustments (`heapifyUp` and `heapifyDown`) taking only **$O(\log N)$** per insert/delete.

---

## 💻 2. Min-Priority Queue Implementation (TypeScript)

Here is a generic, production-ready implementation of a Min-Priority Queue (where smaller priority numbers are processed first).

```typescript
class MinPriorityNode<T> {
    element: T;
    priority: number;
    constructor(element: T, priority: number) {
        this.element = element;
        this.priority = priority;
    }
}

class MinPriorityQueue<T> {
    private heap: MinPriorityNode<T>[] = [];

    // Helper: get parent, left, right indices
    private getParentIdx(i: number): number { return Math.floor((i - 1) / 2); }
    private getLeftIdx(i: number): number { return 2 * i + 1; }
    private getRightIdx(i: number): number { return 2 * i + 2; }

    // Enqueue: Insert a new element with a priority
    public enqueue(element: T, priority: number): void {
        const newNode = new MinPriorityNode(element, priority);
        this.heap.push(newNode);
        this.heapifyUp(this.heap.length - 1);
    }

    // Dequeue: Extract and return the element with the lowest priority number
    public dequeue(): T | null {
        if (this.isEmpty()) return null;
        
        const root = this.heap[0];
        const lastNode = this.heap.pop()!;
        
        if (this.heap.length > 0) {
            this.heap[0] = lastNode;
            this.heapifyDown(0);
        }
        
        return root.element;
    }

    // Peek: View lowest priority element without removing it
    public peek(): T | null {
        if (this.isEmpty()) return null;
        return this.heap[0].element;
    }

    public size(): number { return this.heap.length; }
    public isEmpty(): boolean { return this.heap.length === 0; }

    // Bubble Up
    private heapifyUp(index: number): void {
        let curr = index;
        while (curr > 0) {
            const parent = this.getParentIdx(curr);
            if (this.heap[curr].priority < this.heap[parent].priority) {
                // Swap
                const temp = this.heap[curr];
                this.heap[curr] = this.heap[parent];
                this.heap[parent] = temp;
                
                curr = parent;
            } else {
                break;
            }
        }
    }

    // Bubble Down
    private heapifyDown(index: number): void {
        let curr = index;
        const size = this.heap.length;
        
        while (this.getLeftIdx(curr) < size) {
            const left = this.getLeftIdx(curr);
            const right = this.getRightIdx(curr);
            let smallest = curr;
            
            if (left < size && this.heap[left].priority < this.heap[smallest].priority) {
                smallest = left;
            }
            if (right < size && this.heap[right].priority < this.heap[smallest].priority) {
                smallest = right;
            }
            
            if (smallest !== curr) {
                // Swap
                const temp = this.heap[curr];
                this.heap[curr] = this.heap[smallest];
                this.heap[smallest] = temp;
                
                curr = smallest;
            } else {
                break;
            }
        }
    }
}
```

---

## 💻 3. Max-Priority Queue Implementation (Heap Technique)

Instead of sorting the entire array, we use a binary Max-Heap to bubble values up and down, keeping the largest priority element at index 0.

```typescript
class MaxPriorityNode<T> {
    value: T;
    priority: number;
    constructor(value: T, priority: number) {
        this.value = value;
        this.priority = priority;
    }
}

class MaxPriorityQueue<T> {
    private heap: MaxPriorityNode<T>[] = [];

    // Enqueue an item
    public enqueue(value: T, priority: number): void {
        this.heap.push(new MaxPriorityNode(value, priority));
        this.heapifyUp();
    }

    // Move new node up
    private heapifyUp(): void {
        let index = this.heap.length - 1;
        while (index > 0) {
            let parent = Math.floor((index - 1) / 2);
            if (this.heap[index].priority <= this.heap[parent].priority) break;
            this.swap(index, parent);
            index = parent;
        }
    }

    // Dequeue highest-priority item
    public dequeue(): MaxPriorityNode<T> | null {
        if (this.heap.length === 0) return null;
        const max = this.heap[0];
        const end = this.heap.pop()!;

        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.heapifyDown();
        }
        return max;
    }

    // Restore heap downwards
    private heapifyDown(): void {
        let index = 0;
        let length = this.heap.length;
        while (true) {
            let left = 2 * index + 1;
            let right = 2 * index + 2;
            let largest = index;

            if (left < length && this.heap[left].priority > this.heap[largest].priority) {
                largest = left;
            }

            if (right < length && this.heap[right].priority > this.heap[largest].priority) {
                largest = right;
            }

            if (largest === index) break;
            this.swap(index, largest);
            index = largest;
        }
    }

    // View front item
    public front(): MaxPriorityNode<T> | null {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    public size(): number {
        return this.heap.length;
    }

    // Is Empty?
    public isEmpty(): boolean {
        return this.heap.length === 0;
    }

    // Swap Helper
    private swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
}
```

---

## 🚀 4. LeetCode Environment Built-in Priority Queue

In the **LeetCode environment**, JavaScript and TypeScript developers have access to a built-in priority queue feature. This is provided by the `@datastructures-js/priority-queue` library under the hood, running an efficient heap-based implementation so you do not need to write one from scratch.

### API Reference & Usage

#### Creating a Priority Queue
```javascript
// Min Priority Queue (Default prioritizes smaller values)
const minPq = new MinPriorityQueue(); 

// Max Priority Queue (Prioritizes larger values)
const maxPq = new MaxPriorityQueue();
```

#### Enqueue & Dequeue Methods
```javascript
// Inserting nodes: priority is passed as the second argument
maxPq.enqueue("Fever", 1);
maxPq.enqueue("Accident", 5);
maxPq.enqueue("Headache", 3);

// size() / isEmpty()
console.log(maxPq.size()); // 3

// front(): peeks the highest priority node
console.log(maxPq.front()); // { element: "Accident", priority: 5 }

// dequeue(): extracts the node
const patient = maxPq.dequeue();
console.log(patient.element); // "Accident"
```

> [!NOTE]
> For complex objects, you can pass a custom priority resolver function in the options object during construction:
> `const pq = new MinPriorityQueue({ priority: (patient) => patient.severity });`
>
> You can read more about it in the official LeetCode documentation.

---

## 🛠️ 5. Time Complexity Summary

| Operation | Sorting Queue | Heap-based Priority Queue (Self / LC Built-in) |
| :--- | :---: | :---: |
| **Enqueue / Push** | $O(N \log N)$ (sorting) | **$O(\log N)$** (bubble up) |
| **Dequeue / Pop** | $O(1)$ (shift) | **$O(\log N)$** (bubble down) |
| **Peek / Front** | $O(1)$ | **$O(1)$** |

---

## 📂 6. Common Real-World Applications

1.  **Dijkstra's Shortest Path Algorithm**: Uses a min-priority queue to repeatedly extract the next unvisited node with the absolute minimum tentative distance.
2.  **Prim's Minimum Spanning Tree Algorithm**: Uses a min-priority queue to select the minimum-weight edge connecting the tree to a new vertex.
3.  **Huffman Coding**: A data compression algorithm that repeatedly combines the two least frequent characters (lowest priority counts) using a min-priority queue.
4.  **Operating System Task Scheduling**: Processes with higher priority (e.g. real-time system events) are scheduled in a priority queue to override standard CPU time-slicing.
