# Heap Operations & Mechanics

This document provides a highly visual, plain-English breakdown of **Heap Operations**, detailing how to build a heap, insert elements, extract the root element, and write the core algorithms in TypeScript.

---

## 📌 1. Inserting a Node (`heapifyUp`)

When inserting a node, we must preserve both the **shape property** (complete tree) and the **heap invariant** (value ordering).

### What is Heapify?
**Heapify** is the process of moving values up or down the binary tree to maintain the heap property. It is essentially restructuring or rearranging elements within the tree structure so that the parent-child relationship complies with the heap ordering constraint (Min-Heap or Max-Heap). When we insert at the end and bubble up, this is called **Heapify-Up**.

### The Algorithm
1.  Append the new element to the **end of the array** (this preserves the complete binary tree structure at the next open slot).
2.  Compare the new element with its parent.
3.  If the element violates the heap invariant (e.g. smaller than parent in Min-Heap, or larger than parent in Max-Heap), **swap them**.
4.  Move the index up to the parent and repeat step 2-3 (bubbling up) until the invariant is restored or we reach the root (index 0).

### Dry Run: Inserting `1` into Min-Heap `[5, 10, 20, 30]`
* **Step 0**: Start `insert(1)` into `[5, 10, 20, 30]`.
* **Step 1**: Push `1` at the end of the array:
  `heap = [5, 10, 20, 30, 1]`, `lastIndex = 4`.
* **Step 2**: Call `heapifyUp(4)`.
  * `i = 4` $\rightarrow$ `parentIndex = 1` (value 10). Compare `1 < 10` $\rightarrow$ Swap!
    `heap = [5, 1, 20, 30, 10]`
  * `i = 1` $\rightarrow$ `parentIndex = 0` (value 5). Compare `1 < 5` $\rightarrow$ Swap!
    `heap = [1, 5, 20, 30, 10]`
  * `i = 0` $\rightarrow$ Loop ends.
* **Final State**: `heap = [1, 5, 20, 30, 10]`.

### Visualizing Insertion of `5` in Min-Heap:
```text
Initial Heap: [10, 15, 30]           Append 5 at end: [10, 15, 30, 5]
           10                                     10
         /    \                                 /    \
       15      30                             15      30
                                             /
                                            5 (idx 3)

Swap 5 with parent 15 (idx 1):        Swap 5 with root 10 (idx 0):
           10                                     5
         /    \                                 /   \
        5      30                              10    30
       /                                      /
     15                                     15
```

### TypeScript Code: `heapifyUp`
```typescript
function heapifyUp(heap: number[], index: number): void {
    let curr = index;
    while (curr > 0) {
        const parent = Math.floor((curr - 1) / 2);
        
        // In Min-Heap: swap if child is smaller than parent
        if (heap[curr] < heap[parent]) {
            // Swap values
            const temp = heap[curr];
            heap[curr] = heap[parent];
            heap[parent] = temp;
            
            curr = parent; // Move up
        } else {
            break;
        }
    }
}
```

---

## 🔄 2. Extracting the Root (`heapifyDown`)

Deletion or extraction from a heap only happens from the **top (root) of the tree** which corresponds to `heap[0]`.
* In a **Min-Heap**: the minimum value is extracted from the heap.
* In a **Max-Heap**: the maximum value is extracted from the heap.

**Heapify-Down** is the process of restoring the heap invariant after removing the root element (or when an element moves downwards in the tree).

### The Algorithm
1.  Extract the value at **index 0** (to return it).
2.  Replace the root element with the **very last element** in the array, then decrement array length (preserves the complete binary tree structure).
3.  Compare the new root with its children.
4.  Swap the node with its **smallest child** (in Min-Heap) or **largest child** (in Max-Heap) if it violates the invariant.
5.  Move down to that child's index and repeat steps 3-4 (bubbling down) until the invariant is restored or we hit a leaf.

### TypeScript Code: `heapifyDown`
```typescript
function heapifyDown(heap: number[], index: number, heapSize: number): void {
    let curr = index;
    while (2 * curr + 1 < heapSize) {
        const left = 2 * curr + 1;
        const right = 2 * curr + 2;
        let smallest = curr;

        if (left < heapSize && heap[left] < heap[smallest]) {
            smallest = left;
        }
        if (right < heapSize && heap[right] < heap[smallest]) {
            smallest = right;
        }

        if (smallest !== curr) {
            // Swap values
            const temp = heap[curr];
            heap[curr] = heap[smallest];
            heap[smallest] = temp;

            curr = smallest; // Move down
        } else {
            break;
        }
    }
}
```

---

## 🛠️ 3. Creating/Building a Heap

There are two approaches to converting a raw unsorted array of size $N$ into a valid heap:

### Approach A: Bottom-Up Build Heap (Optimal - $O(N)$)
Instead of starting from an empty heap, we treat the input array as a complete binary tree. Since leaf nodes already satisfy the heap property (they have no children), we only need to heapify internal nodes.
*   Start from the **last non-leaf node** (located at index $\lfloor N/2 \rfloor - 1$).
*   Run `heapifyDown` on each node going backwards from this index to index 0.
*   **Time Complexity Proof**: Although each heapifyDown call takes $O(\log N)$, the nodes close to the leaves (the vast majority of nodes) only bubble down a few levels. Summing the heights of all nodes yields:
    $$\sum_{h=0}^{\log N} \frac{N}{2^{h+1}} \cdot O(h) = O(N)$$

### Approach B: Top-Down Insertion ($O(N \log N)$)
Start with an empty heap and iteratively call `insert` (adding at the end and calling `heapifyUp`) for all $N$ elements.
*   **Time Complexity**: Each insert takes $O(\log N)$ on average, and we do this $N$ times, yielding $O(N \log N)$ time.

### TypeScript Code: `buildMinHeap` (Optimal $O(N)$)
```typescript
function buildMinHeap(arr: number[]): void {
    const n = arr.length;
    // Start from last non-leaf node and heapify down
    const startIdx = Math.floor(n / 2) - 1;
    for (let i = startIdx; i >= 0; i--) {
        heapifyDown(arr, i, n);
    }
}
```

---

## 💻 4. Complete MinHeap Class Implementation & Dry Run

Below is a complete `MinHeap` class implemented in TypeScript. It is pre-initialized with `[5, 10, 20, 30]` to demonstrate insertions and extractions sequentially, matching the step-by-step dry run below.

```typescript
class MinHeap {
    public heap: number[];

    constructor() {
        this.heap = [5, 10, 20, 30];
    }

    private getLeftChildIndex(i: number): number { return (2 * i) + 1; }
    private getRightChildIndex(i: number): number { return (2 * i) + 2; }
    private getParentIndex(i: number): number { return Math.floor((i - 1) / 2); }

    // Insert a value into the heap
    public insert(val: number): void {
        this.heap.push(val);
        const lastIndex = this.heap.length - 1;
        this.heapifyUp(lastIndex);
    }

    // Restore Min-Heap property by bubbling up
    private heapifyUp(i: number): void {
        let curr = i;
        while (curr > 0) {
            const parentIndex = this.getParentIndex(curr);
            if (this.heap[curr] < this.heap[parentIndex]) {
                // Swap values
                const temp = this.heap[curr];
                this.heap[curr] = this.heap[parentIndex];
                this.heap[parentIndex] = temp;

                curr = parentIndex;
            } else {
                break;
            }
        }
    }

    // Extract (remove) and return the minimum element (root)
    public extract(): number | null {
        if (this.heap.length === 0) return null;
        
        const min = this.heap[0];
        const lastIndex = this.heap.length - 1;
        
        // Swap root with the last element
        this.heap[0] = this.heap[lastIndex];
        this.heap.pop(); // Remove the last element
        
        if (this.heap.length > 0) {
            this.heapifyDown(0); 
        }
        
        return min;
    }

    // Restore Min-Heap property by bubbling down
    private heapifyDown(i: number): void {
        let curr = i;
        const left = this.getLeftChildIndex(curr);
        const right = this.getRightChildIndex(curr);
        const n = this.heap.length;

        let smallest = curr;
        if (left < n && this.heap[left] < this.heap[smallest]) {
            smallest = left;
        }
        if (right < n && this.heap[right] < this.heap[smallest]) {
            smallest = right;
        }
        
        if (smallest !== curr) {
            // Swap values
            const temp = this.heap[curr];
            this.heap[curr] = this.heap[smallest];
            this.heap[smallest] = temp;

            this.heapifyDown(smallest); // Recursive call
        }
    }

    // Peek the minimum element (root) without extracting
    public peek(): number | null {
        if (this.heap.length === 0) return null;
        return this.heap[0];
    }
}

class MaxHeap {
    public heap: number[] = [];

    private getLeftChildIndex(i: number): number { return (2 * i) + 1; }
    private getRightChildIndex(i: number): number { return (2 * i) + 2; }
    private getParentIndex(i: number): number { return Math.floor((i - 1) / 2); }

    // Insert a value into the Max-Heap
    public insert(val: number): void {
        this.heap.push(val);
        const lastIndex = this.heap.length - 1;
        this.heapifyUp(lastIndex);
    }

    // Restore Max-Heap property by bubbling up
    private heapifyUp(i: number): void {
        let curr = i;
        while (curr > 0) {
            const parentIndex = this.getParentIndex(curr);
            if (this.heap[curr] > this.heap[parentIndex]) {
                // Swap values
                const temp = this.heap[curr];
                this.heap[curr] = this.heap[parentIndex];
                this.heap[parentIndex] = temp;

                curr = parentIndex;
            } else {
                break;
            }
        }
    }

    // Extract (remove) and return the maximum element (root)
    public extract(): number | null {
        if (this.heap.length === 0) return null;
        
        const max = this.heap[0];
        const lastIndex = this.heap.length - 1;
        
        // Swap root with the last element
        this.heap[0] = this.heap[lastIndex];
        this.heap.pop(); // Remove the last element
        
        if (this.heap.length > 0) {
            this.heapifyDown(0); 
        }
        
        return max;
    }

    // Restore Max-Heap property by bubbling down
    private heapifyDown(i: number): void {
        let curr = i;
        const left = this.getLeftChildIndex(curr);
        const right = this.getRightChildIndex(curr);
        const n = this.heap.length;

        let largest = curr;
        if (left < n && this.heap[left] > this.heap[largest]) {
            largest = left;
        }
        if (right < n && this.heap[right] > this.heap[largest]) {
            largest = right;
        }
        
        if (largest !== curr) {
            // Swap values
            const temp = this.heap[curr];
            this.heap[curr] = this.heap[largest];
            this.heap[largest] = temp;

            this.heapifyDown(largest); // Recursive call
        }
    }

    // Peek the maximum element (root) without extracting
    public peek(): number | null {
        if (this.heap.length === 0) return null;
        return this.heap[0];
    }
}

```

### Trace: Step-by-Step State Transitions

We trace the operations on a `MinHeap` initialized with `heap = [5, 10, 20, 30]`.

#### **Operation 1: `insert(5)`**
* **Step 1**: Append `5` at the end:
  `heap = [5, 10, 20, 30, 5]`, `lastIndex = 4`.
* **Step 2**: Call `heapifyUp(4)`.
  * `i = 4` $\rightarrow$ `parentIndex = 1` (value 10). Compare `5 < 10` $\rightarrow$ Swap!
    `heap = [5, 5, 20, 30, 10]`
  * `i = 1` $\rightarrow$ `parentIndex = 0` (value 5). Compare `5 < 5` $\rightarrow$ False $\rightarrow$ Break.
* **Final State**: `heap = [5, 5, 20, 30, 10]`.

#### **Operation 2: `insert(20)`**
* **Step 1**: Append `20` at the end:
  `heap = [5, 5, 20, 30, 10, 20]`, `lastIndex = 5`.
* **Step 2**: Call `heapifyUp(5)`.
  * `i = 5` $\rightarrow$ `parentIndex = 2` (value 20). Compare `20 < 20` $\rightarrow$ False $\rightarrow$ Break.
* **Final State**: `heap = [5, 5, 20, 30, 10, 20]`.

#### **Operation 3: `insert(4)`**
* **Step 1**: Append `4` at the end:
  `heap = [5, 5, 20, 30, 10, 20, 4]`, `lastIndex = 6`.
* **Step 2**: Call `heapifyUp(6)`.
  * `i = 6` $\rightarrow$ `parentIndex = 2` (value 20). Compare `4 < 20` $\rightarrow$ Swap!
    `heap = [5, 5, 4, 30, 10, 20, 20]`
  * `i = 2` $\rightarrow$ `parentIndex = 0` (value 5). Compare `4 < 5` $\rightarrow$ Swap!
    `heap = [4, 5, 5, 30, 10, 20, 20]`
  * `i = 0` $\rightarrow$ Loop ends.
* **Final State**: `heap = [4, 5, 5, 30, 10, 20, 20]`.

#### **Operation 4: `insert(10)`**
* **Step 1**: Append `10` at the end:
  `heap = [4, 5, 5, 30, 10, 20, 20, 10]`, `lastIndex = 7`.
* **Step 2**: Call `heapifyUp(7)`.
  * `i = 7` $\rightarrow$ `parentIndex = 3` (value 30). Compare `10 < 30` $\rightarrow$ Swap!
    `heap = [4, 5, 5, 10, 10, 20, 20, 30]`
  * `i = 3` $\rightarrow$ `parentIndex = 1` (value 5). Compare `10 < 5` $\rightarrow$ False $\rightarrow$ Break.
* **Final State**: `heap = [4, 5, 5, 10, 10, 20, 20, 30]`.

#### **Operation 5: `insert(1)`**
* **Step 1**: Append `1` at the end:
  `heap = [4, 5, 5, 10, 10, 20, 20, 30, 1]`, `lastIndex = 8`.
* **Step 2**: Call `heapifyUp(8)`.
  * `i = 8` $\rightarrow$ `parentIndex = 3` (value 10). Compare `1 < 10` $\rightarrow$ Swap!
    `heap = [4, 5, 5, 1, 10, 20, 20, 30, 10]`
  * `i = 3` $\rightarrow$ `parentIndex = 1` (value 5). Compare `1 < 5` $\rightarrow$ Swap!
    `heap = [4, 1, 5, 5, 10, 20, 20, 30, 10]`
  * `i = 1` $\rightarrow$ `parentIndex = 0` (value 4). Compare `1 < 4` $\rightarrow$ Swap!
    `heap = [1, 4, 5, 5, 10, 20, 20, 30, 10]`
  * `i = 0` $\rightarrow$ Loop ends.
* **Final State**: `heap = [1, 4, 5, 5, 10, 20, 20, 30, 10]`.

#### **Operation 6: `insert(0)`**
* **Step 1**: Append `0` at the end:
  `heap = [1, 4, 5, 5, 10, 20, 20, 30, 10, 0]`, `lastIndex = 9`.
* **Step 2**: Call `heapifyUp(9)`.
  * `i = 9` $\rightarrow$ `parentIndex = 4` (value 10). Compare `0 < 10` $\rightarrow$ Swap!
    `heap = [1, 4, 5, 5, 0, 20, 20, 30, 10, 10]`
  * `i = 4` $\rightarrow$ `parentIndex = 1` (value 4). Compare `0 < 4` $\rightarrow$ Swap!
    `heap = [1, 0, 5, 5, 4, 20, 20, 30, 10, 10]`
  * `i = 1` $\rightarrow$ `parentIndex = 0` (value 1). Compare `0 < 1` $\rightarrow$ Swap!
    `heap = [0, 1, 5, 5, 4, 20, 20, 30, 10, 10]`
  * `i = 0` $\rightarrow$ Loop ends.
* **Final State**: `heap = [0, 1, 5, 5, 4, 20, 20, 30, 10, 10]`.

#### **Operation 7: `peek()`**
* Returns root element: `0`.

#### **Operation 8: `extract()` (First extraction)**
* **Step 1**: Swap root `heap[0] (0)` with last element `heap[9] (10)` $\rightarrow$ `heap = [10, 1, 5, 5, 4, 20, 20, 30, 10, 0]`.
* **Step 2**: Pop the last element $\rightarrow$ `heap = [10, 1, 5, 5, 4, 20, 20, 30, 10]`.
* **Step 3**: Call `heapifyDown(0)`.
  * `i = 0`. Left child index 1 (value 1), right child index 2 (value 5). Smallest child is index 1.
    Compare parent `10` with smallest child `1` $\rightarrow$ Swap!
    `heap = [1, 10, 5, 5, 4, 20, 20, 30, 10]`
  * `i = 1`. Left child index 3 (value 5), right child index 4 (value 4). Smallest child is index 4.
    Compare parent `10` with smallest child `4` $\rightarrow$ Swap!
    `heap = [1, 4, 5, 5, 10, 20, 20, 30, 10]`
  * `i = 4`. Left child index 9 is out of bounds. Loop ends.
* **Extracted Value**: `0`.
* **Final State**: `heap = [1, 4, 5, 5, 10, 20, 20, 30, 10]`.

#### **Operation 9: `extract()` (Second extraction)**
* **Step 1**: Swap root `heap[0] (1)` with last element `heap[8] (10)` $\rightarrow$ `heap = [10, 4, 5, 5, 10, 20, 20, 30, 1]`.
* **Step 2**: Pop the last element $\rightarrow$ `heap = [10, 4, 5, 5, 10, 20, 20, 30]`.
* **Step 3**: Call `heapifyDown(0)`.
  * `i = 0`. Left child index 1 (value 4), right child index 2 (value 5). Smallest child is index 1.
    Compare parent `10` with smallest child `4` $\rightarrow$ Swap!
    `heap = [4, 10, 5, 5, 10, 20, 20, 30]`
  * `i = 1`. Left child index 3 (value 5), right child index 4 (value 10). Smallest child is index 3.
    Compare parent `10` with smallest child `5` $\rightarrow$ Swap!
    `heap = [4, 5, 5, 10, 10, 20, 20, 30]`
  * `i = 3`. Left child index 7 (value 30), right child index 8 is out of bounds. Smallest child is index 7.
    Compare parent `10` with smallest child `30` $\rightarrow$ False $\rightarrow$ Break.
* **Extracted Value**: `1`.
* **Final State**: `heap = [4, 5, 5, 10, 10, 20, 20, 30]`.
