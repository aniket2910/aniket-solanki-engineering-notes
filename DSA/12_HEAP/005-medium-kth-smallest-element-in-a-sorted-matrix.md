# 005. Kth Smallest Element in a Sorted Matrix (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Google, Facebook/Meta, ByteDance
>
> **Interview Tag**: **HEAP MULTI-POINTER** - Core pattern for merging sorted structures using heaps.

---

### 📝 1. Problem Statement
Given an `n x n` `matrix` where each of the rows and columns are sorted in ascending order, return *the* $k^{\text{th}}$ *smallest element in the matrix*.

Note that it is the $k^{\text{th}}$ smallest element **in the sorted order**, not the $k^{\text{th}}$ distinct element.

You must find a solution with a memory complexity better than $O(n^2)$.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**:
  ```text
  matrix = [
    [1,  5,  9],
    [10, 11, 13],
    [12, 13, 15]
  ]
  k = 8
  ```
* **Output**: `13`
* **Why**: The sorted representation is `[1, 5, 9, 10, 11, 12, 13, 13, 15]`. The 8th smallest element is 13.

#### Test Case 2
* **Input**: `matrix = [[-5]]`, `k = 1`
* **Output**: `-5`
* **Why**: Only one element in the matrix.

---

### 💬 3. What is This Problem Actually Asking?
Locate the $k^{\text{th}}$ element of the matrix if it were flattened and fully sorted, taking advantage of the row-wise and column-wise sorting constraints.

---

### 🌍 4. Real-Life Example
Imagine a company divided into 3 departments, and each department has employee folders sorted by hire date (oldest to newest). HR wants to find the 5th oldest employee company-wide. Instead of compiling folders from all departments (slow), HR compares the oldest folder from each department. They pick the oldest overall, pull it, and bring forward the next oldest folder from that specific department, repeating until they have selected 5 folders.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Min-Heap Row Heads (Merge Sorted Lists - $O(K \log N)$)
*   Since all rows are sorted, this is similar to merging $N$ sorted lists.
*   Initialize a Min-Heap.
*   Push the first element of each row into the heap: `{ val, r, c }`.
*   Iterate $K$ times:
    *   Extract the minimum element `node = heap.dequeue()`.
    *   If there is a next element in the same row (`node.c + 1 < N`), insert it: `{ matrix[node.r][node.c + 1], node.r, node.c + 1 }`.
*   The $K^{\text{th}}$ extracted value is the answer.
*   **Pros**: Highly intuitive; uses $O(N)$ space.
*   **Cons**: Time complexity is **$O(K \log N)$** (slow if $K \approx N^2$).

#### Approach 2: Binary Search on Range (Optimal - $O(N \log(\text{Max} - \text{Min}))$)
*   The search space is bounded by the smallest value `matrix[0][0]` and the largest value `matrix[N-1][N-1]`.
*   Perform Binary Search on this range to find a pivot value `mid`.
*   Count how many elements in the matrix are less than or equal to `mid`.
    *   Since columns are sorted, we can count in $O(N)$ time by starting at the bottom-left corner and traversing up/right.
*   If count $< k$, shift search space: `low = mid + 1`. Else, `high = mid`.
*   **Pros**: Incredibly fast: **$O(N \log(\text{Max} - \text{Min}))$** time and **$O(1)$** auxiliary space!
*   **Cons**: Less intuitive range setup.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Using Approach 1 (Min-Heap Row Heads) with Test Case 1, $k = 8$.

#### **Step 1: Enqueue first element of each row**
* Row 0: `1` (c=0)
* Row 1: `10` (c=0)
* Row 2: `12` (c=0)
* `heap = [1 (r0,c0), 10 (r1,c0), 12 (r2,c0)]`

#### **Step 2: Iterate K = 8 times**
*   **Iter 1**: Extract `1` (r0,c0). Next in row 0 is index 1 (value 5) $\rightarrow$ Insert `5 (r0,c1)`.
    `heap = [5 (r0,c1), 10 (r1,c0), 12 (r2,c0)]`
*   **Iter 2**: Extract `5` (r0,c1). Next in row 0 is index 2 (value 9) $\rightarrow$ Insert `9 (r0,c2)`.
    `heap = [9 (r0,c2), 10 (r1,c0), 12 (r2,c0)]`
*   **Iter 3**: Extract `9` (r0,c2). Next in row 0 is out of bounds.
    `heap = [10 (r1,c0), 12 (r2,c0)]`
*   **Iter 4**: Extract `10` (r1,c0). Next in row 1 is index 1 (value 11) $\rightarrow$ Insert `11 (r1,c1)`.
    `heap = [11 (r1,c1), 12 (r2,c0)]`
*   **Iter 5**: Extract `11` (r1,c1). Next in row 1 is index 2 (value 13) $\rightarrow$ Insert `13 (r1,c2)`.
    `heap = [12 (r2,c0), 13 (r1,c2)]`
*   **Iter 6**: Extract `12` (r2,c0). Next in row 2 is index 1 (value 13) $\rightarrow$ Insert `13 (r2,c1)`.
    `heap = [13 (r1,c2), 13 (r2,c1)]`
*   **Iter 7**: Extract `13` (r1,c2). Next in row 1 is out of bounds.
    `heap = [13 (r2,c1)]`
*   **Iter 8**: Extract `13` (r2,c1). Loop ends.
*   **Result**: returns `13`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class MatrixNode {
    val: number;
    r: number;
    c: number;
    constructor(val: number, r: number, c: number) {
        this.val = val;
        this.r = r;
        this.c = c;
    }
}

class MatrixMinHeap {
    private heap: MatrixNode[] = [];

    public insert(node: MatrixNode): void {
        this.heap.push(node);
        this.heapifyUp(this.heap.length - 1);
    }

    public extractMin(): MatrixNode {
        const min = this.heap[0];
        const end = this.heap.pop()!;
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.heapifyDown(0);
        }
        return min;
    }

    public size(): number {
        return this.heap.length;
    }

    private heapifyUp(idx: number): void {
        let curr = idx;
        while (curr > 0) {
            const parent = Math.floor((curr - 1) / 2);
            if (this.heap[curr].val < this.heap[parent].val) {
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

            if (left < length && this.heap[left].val < this.heap[smallest].val) {
                smallest = left;
            }
            if (right < length && this.heap[right].val < this.heap[smallest].val) {
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

function kthSmallest(matrix: number[][], k: number): number {
    // ==========================================
    // 1st Approach: Binary Search on Range (Optimal - O(N log(Max-Min)) time, O(1) space)
    // ==========================================
    const n = matrix.length;
    let low = matrix[0][0];
    let high = matrix[n - 1][n - 1];

    function countLessOrEqual(target: number): number {
        let count = 0;
        let r = n - 1; // start bottom-left
        let c = 0;
        
        while (r >= 0 && c < n) {
            if (matrix[r][c] <= target) {
                count += r + 1; // all elements above it in the same column are also <= target
                c++;
            } else {
                r--;
            }
        }
        return count;
    }

    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (countLessOrEqual(mid) < k) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }

    return low;

    // ==========================================
    // 2nd Approach: Min-Heap Row Heads (O(K log N) time, O(N) space)
    // ==========================================
    /*
    const n = matrix.length;
    const minHeap = new MatrixMinHeap();

    // Insert first element of each row
    for (let r = 0; r < Math.min(n, k); r++) {
        minHeap.insert(new MatrixNode(matrix[r][0], r, 0));
    }

    let node = minHeap.peek(); // dummy initialization
    for (let i = 0; i < k; i++) {
        node = minHeap.extractMin();
        if (node.c + 1 < n) {
            minHeap.insert(new MatrixNode(matrix[node.r][node.c + 1], node.r, node.c + 1));
        }
    }

    return node.val;
    */
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Min-Heap | Approach 2: Binary Search |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(K \log N)$** — Where $N$ is matrix dimensions, $K$ extractions. | **$O(N \log(\text{Max} - \text{Min}))$** — Outer range binary search. |
| **Space Complexity** | **$O(N)$** — Heap capacity limited by number of rows. | **$O(1)$** — Constant variables only. |

#### Edge Cases Handled:
*   **$k = 1$**: Binary search count loops correctly identify first index, or Min-Heap completes on first iteration returning first value.
*   **Negative Values**: Range `low` and `high` boundaries accommodate negative integers correctly.
