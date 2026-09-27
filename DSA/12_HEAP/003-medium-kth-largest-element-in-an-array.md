# 003. Kth Largest Element in an Array (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Facebook/Meta, Amazon, Microsoft, Bloomberg, Google
>
> **Interview Tag**: 🔥 **MIN-HEAP BOUNDED SIZE** - Classic pattern for tracking top-K values in an array.

---

### 📝 1. Problem Statement
Given an integer array `nums` and an integer `k`, return *the* $k^{\text{th}}$ *largest element in the array*.

Note that it is the $k^{\text{th}}$ largest element in the sorted order, not the $k^{\text{th}}$ distinct element.

Can you solve it without sorting in $O(n)$ time complexity?

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [3,2,1,5,6,4]`, `k = 2`
* **Output**: `5`
* **Why**: The sorted array is `[1, 2, 3, 4, 5, 6]`. The 2nd largest element is 5.

#### Test Case 2
* **Input**: `nums = [3,2,3,1,2,4,5,5,6]`, `k = 4`
* **Output**: `4`
* **Why**: The sorted array is `[1, 2, 2, 3, 3, 4, 5, 5, 6]`. The 4th largest element is 4.

---

### 💬 3. What is This Problem Actually Asking?
Locate the $k^{\text{th}}$ element from the end of the sorted array without performing a full sorting operation (which would take $O(N \log N)$).

---

### 🌍 4. Real-Life Example
Imagine you are a teacher checking grades. You want to award prizes to the top 3 scores. Instead of sorting the tests of all 100 students (which is slow), you make a small list on a sticky note of the top 3 highest scores you've seen so far. As you check each test, if it's higher than the lowest score on your note, you replace that lowest score with the new score. After checking all papers, the lowest score on your sticky note is the 3rd highest grade.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Min-Heap of Size $K$ (Optimal & Practical)
*   We maintain a Min-Heap of size $k$.
*   Iterate through `nums`:
    *   Insert the number into the Min-Heap.
    *   If heap size exceeds $k$, pop the root (which is the smallest element).
*   At the end of the array, the Min-Heap contains the $k$ largest elements. The root of the heap is the smallest of these $k$ elements, which corresponds to the $k^{\text{th}}$ largest element of the array.
*   **Pros**: Highly reliable, standard heap application, handles streaming data inputs.
*   **Cons**: Worst-case runtime is **$O(N \log k)$**.

#### Approach 2: QuickSelect (Alternate - $O(N)$ Average Time)
*   Based on the QuickSort partitioning algorithm.
*   Choose a random pivot and partition the array into elements larger than pivot and elements smaller than pivot.
*   Recurse into the partition containing the target $k^{\text{th}}$ index.
*   **Pros**: $O(N)$ average time complexity.
*   **Cons**: Worst-case is **$O(N^2)$** if array is sorted and pivot selection is poor (unstable).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [3, 2, 1, 5, 6, 4]`, `k = 2`.

#### **Step 1: Process `3`**
* Enqueue `3`. `heap = [3]` (size = 1).

#### **Step 2: Process `2`**
* Enqueue `2`. `heap = [2, 3]` (size = 2).

#### **Step 3: Process `1`**
* Enqueue `1`. `heap = [1, 3, 2]` (size = 3).
* Exceeds `k = 2` $\rightarrow$ Dequeue root `1` $\rightarrow$ `heap = [2, 3]` (size = 2).

#### **Step 4: Process `5`**
* Enqueue `5`. `heap = [2, 3, 5]` (size = 3).
* Exceeds `k = 2` $\rightarrow$ Dequeue root `2` $\rightarrow$ `heap = [3, 5]` (size = 2).

#### **Step 5: Process `6`**
```text
State: heap = [3, 5]
Process value 6:
Enqueue 6:        [3, 5, 6] (size is 3)
                  / \
                 5   6
Exceeds size 2 -> Dequeue root 3:
New Heap:         [5, 6] (size is 2)
                  /
                 6
```
* Enqueue `6`. `heap = [3, 5, 6]`.
* Exceeds `k = 2` $\rightarrow$ Dequeue root `3` $\rightarrow$ `heap = [5, 6]`.

#### **Step 6: Process `4`**
* Enqueue `4`. `heap = [4, 6, 5]`.
* Exceeds `k = 2` $\rightarrow$ Dequeue root `4` $\rightarrow$ `heap = [5, 6]`.
* Return root: `5`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class BoundedMinHeap {
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

function findKthLargest(nums: number[], k: number): number {
    // ==========================================
    // 1st Approach: QuickSelect (O(N) Average, O(N^2) Worst)
    // ==========================================
    /*
    function quickSelect(left: number, right: number, targetIdx: number): number {
        if (left === right) return nums[left];

        const pivotIdx = Math.floor(Math.random() * (right - left + 1)) + left;
        // Swap pivot with right
        [nums[pivotIdx], nums[right]] = [nums[right], nums[pivotIdx]];

        let partitionIdx = left;
        for (let i = left; i < right; i++) {
            if (nums[i] < nums[right]) {
                [nums[i], nums[partitionIdx]] = [nums[partitionIdx], nums[i]];
                partitionIdx++;
            }
        }
        [nums[partitionIdx], nums[right]] = [nums[right], nums[partitionIdx]];

        if (partitionIdx === targetIdx) {
            return nums[partitionIdx];
        } else if (partitionIdx < targetIdx) {
            return quickSelect(partitionIdx + 1, right, targetIdx);
        } else {
            return quickSelect(left, partitionIdx - 1, targetIdx);
        }
    }

    return quickSelect(0, nums.length - 1, nums.length - k);
    */

    // ==========================================
    // 2nd Approach: Min-Heap of Size K (Optimal & Stable - O(N log K))
    // ==========================================
    const minHeap = new BoundedMinHeap();

    for (let num of nums) {
        minHeap.insert(num);
        if (minHeap.size() > k) {
            minHeap.extractMin();
        }
    }

    return minHeap.peek();
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Min-Heap | Approach 2: QuickSelect |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N \log k)$** — Processing $N$ items, heap limits to size $k$. | **$O(N)$** Average, **$O(N^2)$** Worst Case. |
| **Space Complexity** | **$O(k)$** — Stores the top $k$ values in the heap. | **$O(1)$** (or $O(\log N)$ recursion stack space). |

#### Edge Cases Handled:
*   **$N = k$**: Heap expands to size $k$ and never dequeues. Returns root element (the minimum of the entire array, i.e. 1st largest).
*   **Negative Values**: Negatives are sorted correctly by value inequalities.
