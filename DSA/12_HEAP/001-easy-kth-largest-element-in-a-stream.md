# 001. Kth Largest Element in a Stream (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Google, Facebook/Meta
>
> **Interview Tag**: 🔥 **MIN-HEAP STREAM LIMIT** - Core pattern for tracking top-K values in a continuous data feed.

---

### 📝 1. Problem Statement
Design a class to find the $k^{\text{th}}$ largest element in a stream. Note that it is the $k^{\text{th}}$ largest element in the sorted order, not the $k^{\text{th}}$ distinct element.

Implement `KthLargest` class:
*   `KthLargest(int k, int[] nums)` Initializes the object with the integer `k` and the stream of integers `nums`.
*   `int add(int val)` Appends the integer `val` to the stream and returns the element representing the $k^{\text{th}}$ largest element in the stream.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**:
  * Operations: `["KthLargest", "add", "add", "add", "add", "add"]`
  * Arguments: `[[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]`
* **Output**: `[null, 4, 5, 5, 8, 8]`
* **Why**:
  ```text
  KthLargest kthLargest = new KthLargest(3, [4, 5, 8, 2]);
  kthLargest.add(3);   // returns 4 (stream: [2, 3, 4, 5, 8], 3rd largest is 4)
  kthLargest.add(5);   // returns 5 (stream: [2, 3, 4, 5, 5, 8], 3rd largest is 5)
  kthLargest.add(10);  // returns 5 (stream: [2, 3, 4, 5, 5, 8, 10], 3rd largest is 5)
  kthLargest.add(9);   // returns 8 (stream: [2, 3, 4, 5, 5, 8, 9, 10], 3rd largest is 8)
  kthLargest.add(4);   // returns 8 (stream: [2, 3, 4, 4, 5, 5, 8, 9, 10], 3rd largest is 8)
  ```

---

### 💬 3. What is This Problem Actually Asking?
We need to maintain a collection of numbers where we can insert new values dynamically and easily identify the $k^{\text{th}}$ largest value.
*   Instead of keeping all numbers, we only need to keep the **top $k$ largest numbers** seen so far.
*   Among these top $k$ numbers, the smallest one represents the $k^{\text{th}}$ largest overall!

---

### 🌍 4. Real-Life Example
Imagine a live gaming leaderboard that displays the top 3 highest scores of all time. When a new score comes in:
1.  If it is smaller than the 3rd place score, it is ignored.
2.  If it is larger, it pushes the old 3rd place score off the leaderboard and takes its place.
3.  The 3rd place score is the smallest value on the leaderboard, representing the 3rd largest score overall.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach: Min-Heap of Size $K$
*   We initialize a Min-Heap.
*   We add all numbers from `nums` into our Min-Heap.
*   If the Min-Heap size exceeds $k$, we dequeue (remove the minimum element).
*   For each new `add(val)`:
    *   We enqueue `val`.
    *   If the heap size exceeds $k$, we dequeue.
    *   The root of the Min-Heap (`heap[0]`) is the smallest of our top-$k$ elements, which is the $k^{\text{th}}$ largest element.
*   **Time Complexity**:
    *   Initialization: $O(N \log k)$ where $N$ is length of `nums`.
    *   Each Add: $O(\log k)$.
*   **Space Complexity**: $O(k)$ to store the top $k$ elements.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Initialize with `k = 3`, `nums = [4, 5, 8, 2]`.

#### **Step 1: Build Heap of Size 3**
* Add `4` $\rightarrow$ `heap = [4]`
* Add `5` $\rightarrow$ `heap = [4, 5]`
* Add `8` $\rightarrow$ `heap = [4, 5, 8]`
* Add `2` $\rightarrow$ `heap = [2, 4, 8, 5]` (Min-Heap size is 4).
  * Exceeds `k = 3` $\rightarrow$ Dequeue minimum `2` $\rightarrow$ `heap = [4, 5, 8]`.

#### **Step 2: Add `3`**
* Enqueue `3` $\rightarrow$ `heap = [3, 4, 8, 5]`.
* Exceeds `k = 3` $\rightarrow$ Dequeue minimum `3` $\rightarrow$ `heap = [4, 5, 8]`.
* Return root `4`.

#### **Step 3: Add `5`**
```text
State: Heap size limit = 3
Enqueue 5:        [4, 5, 8, 5] (size is 4)
                  / \
                 5   8
                /
               5
Exceeds size 3 -> Dequeue root 4:
New Heap:         [5, 5, 8] (size is 3)
                  / \
                 5   8
Return root:      5
```
* Enqueue `5` $\rightarrow$ `heap = [4, 5, 8, 5]`.
* Exceeds `k = 3` $\rightarrow$ Dequeue minimum `4` $\rightarrow$ `heap = [5, 5, 8]`.
* Return root `5`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
// Custom Min-Heap implementation for JS/TS
class MiniHeap {
    private heap: number[] = [];

    public insert(val: number): void {
        this.heap.push(val);
        this.heapifyUp(this.heap.length - 1);
    }

    public extractMin(): number {
        const min = this.heap[0];
        const end = this.heap.pop()!;
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.heapifyDown(0);
        }
        return min;
    }

    public peek(): number {
        return this.heap[0];
    }

    public size(): number {
        return this.heap.length;
    }

    private heapifyUp(idx: number): void {
        let curr = idx;
        while (curr > 0) {
            const parent = Math.floor((curr - 1) / 2);
            if (this.heap[curr] < this.heap[parent]) {
                [this.heap[curr], this.heap[parent]] = [this.heap[parent], this.heap[curr]];
                curr = parent;
            } else {
                break;
            }
        }
    }

    private heapifyDown(idx: number): void {
        let curr = idx;
        const length = this.heap.length;
        while (2 * curr + 1 < length) {
            let left = 2 * curr + 1;
            let right = 2 * curr + 2;
            let smallest = curr;

            if (left < length && this.heap[left] < this.heap[smallest]) {
                smallest = left;
            }
            if (right < length && this.heap[right] < this.heap[smallest]) {
                smallest = right;
            }

            if (smallest !== curr) {
                [this.heap[curr], this.heap[smallest]] = [this.heap[smallest], this.heap[curr]];
                curr = smallest;
            } else {
                break;
            }
        }
    }
}

class KthLargest {
    private minHeap: MiniHeap;
    private k: number;

    constructor(k: number, nums: number[]) {
        this.minHeap = new MiniHeap();
        this.k = k;
        
        for (let num of nums) {
            this.add(num);
        }
    }

    add(val: number): number {
        this.minHeap.insert(val);
        if (this.minHeap.size() > this.k) {
            this.minHeap.extractMin();
        }
        return this.minHeap.peek();
    }
}

/**
 * Your KthLargest object will be instantiated and called as such:
 * var obj = new KthLargest(k, nums)
 * var param_1 = obj.add(val)
 */
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Implementation |
| :--- | :--- |
| **Time Complexity (Constructor)** | **$O(N \log k)$** — Inserts $N$ elements, popping once size exceeds $k$. |
| **Time Complexity (Add)** | **$O(\log k)$** — Single element push and possible bubble adjustment. |
| **Space Complexity** | **$O(k)$** — Auxiliary space to store the top $k$ values in the heap. |

#### Edge Cases Handled:
*   **$N < k$**: Initial array size is smaller than $k$. The code correctly keeps all elements in the heap until the size exceeds $k$ in subsequent additions.
*   **Duplicates**: Duplicate numbers are handled correctly by standard heap indices.
