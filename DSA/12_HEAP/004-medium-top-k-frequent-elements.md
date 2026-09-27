# 004. Top K Frequent Elements (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Facebook/Meta, Google, Microsoft, Bloomberg
>
> **Interview Tag**: 🔥 **HEAP FREQUENCY BUCKETS** - Core pattern for element extraction based on frequency thresholds.

---

### 📝 1. Problem Statement
Given an integer array `nums` and an integer `k`, return *the* `k` *most frequent elements*. You may return the answer in **any order**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1,1,1,2,2,3]`, `k = 2`
* **Output**: `[1,2]`
* **Why**: The frequencies are: 1 has frequency 3, 2 has frequency 2, 3 has frequency 1. The top 2 most frequent are 1 and 2.

#### Test Case 2
* **Input**: `nums = [1]`, `k = 1`
* **Output**: `[1]`
* **Why**: Frequencies: 1 has frequency 1. The top 1 most frequent is 1.

---

### 💬 3. What is This Problem Actually Asking?
Count the frequency of each unique number, and retrieve the $k$ keys associated with the highest frequency counts.

---

### 🌍 4. Real-Life Example
Imagine a radio station tracking requested songs. At the end of the week, the DJ wants to play the Top 3 most requested songs. First, the station counts how many times each song was played (frequency mapping). Then they sort or filter them to isolate the top 3 items.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Frequency Map + Min-Heap of size $K$
1.  Build a frequency map: key $\rightarrow$ count.
2.  Maintain a Min-Heap of size $k$ based on frequency values.
3.  For each unique key in our map:
    *   Insert the key into the Min-Heap.
    *   If heap size exceeds $k$, dequeue the root (the element with the lowest frequency).
4.  At the end, the Min-Heap contains the $k$ most frequent elements.
5.  **Pros**: Standard heap usage; space complexity bounded by unique keys.
6.  **Cons**: Time complexity is **$O(U \log k)$** where $U$ is number of unique elements.

#### Approach 2: Bucket Sort (Optimal - $O(N)$ Space-Time)
1.  Build a frequency map.
2.  Create an array of buckets where the index represents frequency: `buckets[freq] = [elements]`.
3.  Iterate through the frequency map and place each element in its corresponding bucket.
4.  Iterate backwards from the end of the bucket array (highest frequency down to 1) and collect elements until we have $k$ elements.
5.  **Pros**: Linear **$O(N)$** time complexity.
6.  **Cons**: Higher memory overhead for empty buckets.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [1, 1, 1, 2, 2, 3]`, `k = 2`.

#### **Step 1: Build Frequency Map**
* `freqMap = { 1: 3, 2: 2, 3: 1 }`

#### **Step 2: Bucket Sort Array Construction**
* Max frequency is 6 (length of array).
* `buckets = [[], [], [], [], [], [], []]`
* Populate:
  * Element `1` (freq 3) $\rightarrow$ `buckets[3] = [1]`
  * Element `2` (freq 2) $\rightarrow$ `buckets[2] = [1, 2]` (Wait! Buckets are initialized empty. `buckets[2]` will have `[2]`, `buckets[3]` has `[1]`). Let's trace correctly:
    * Freq of `1` is 3 $\rightarrow$ `buckets[3] = [1]`
    * Freq of `2` is 2 $\rightarrow$ `buckets[2] = [2]`
    * Freq of `3` is 1 $\rightarrow$ `buckets[1] = [3]`
* `buckets` state:
  * `0`: `[]`
  * `1`: `[3]`
  * `2`: `[2]`
  * `3`: `[1]`
  * `4`: `[]`
  * `5`: `[]`
  * `6`: `[]`

#### **Step 3: Collect backwards**
```text
State: buckets = [ [], [3], [2], [1], [], [], [] ]
Target: k = 2
Step 1: Iterate index 6 down to 1.
  - idx 3: bucket is [1]. Collect elements -> result = [1]
  - idx 2: bucket is [2]. Collect elements -> result = [1, 2]
Result length is 2. Terminate and return.
```
* Read `buckets[3]` $\rightarrow$ add `1` to result $\rightarrow$ `result = [1]`.
* Read `buckets[2]` $\rightarrow$ add `2` to result $\rightarrow$ `result = [1, 2]`.
* Result size is $2$. Terminate.
* **Result**: returns `[1, 2]`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class FreqMinNode {
    val: number;
    count: number;
    constructor(val: number, count: number) {
        this.val = val;
        this.count = count;
    }
}

class FreqMinHeap {
    private heap: FreqMinNode[] = [];

    public insert(node: FreqMinNode): void {
        this.heap.push(node);
        this.heapifyUp(this.heap.length - 1);
    }

    public extractMin(): FreqMinNode {
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

    public getElements(): number[] {
        return this.heap.map(node => node.val);
    }

    private heapifyUp(idx: number): void {
        let curr = idx;
        while (curr > 0) {
            const parent = Math.floor((curr - 1) / 2);
            if (this.heap[curr].count < this.heap[parent].count) {
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

            if (left < length && this.heap[left].count < this.heap[smallest].count) {
                smallest = left;
            }
            if (right < length && this.heap[right].count < this.heap[smallest].count) {
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

function topKFrequent(nums: number[], k: number): number[] {
    // ==========================================
    // 1st Approach: Frequency Map + Min-Heap of Size K (O(N log K))
    // ==========================================
    /*
    const freqMap = new Map<number, number>();
    for (let num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }

    const minHeap = new FreqMinHeap();
    for (let [val, count] of freqMap.entries()) {
        minHeap.insert(new FreqMinNode(val, count));
        if (minHeap.size() > k) {
            minHeap.extractMin();
        }
    }

    return minHeap.getElements();
    */

    // ==========================================
    // 2nd Approach: Bucket Sort (Optimal - O(N) Space & Time)
    // ==========================================
    const freqMap = new Map<number, number>();
    for (let num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }

    // Array of buckets, size goes up to nums.length
    const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);

    for (let [num, freq] of freqMap.entries()) {
        buckets[freq].push(num);
    }

    const result: number[] = [];
    // Read buckets backwards (highest frequency first)
    for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
        if (buckets[i].length > 0) {
            for (let num of buckets[i]) {
                result.push(num);
                if (result.length === k) break;
            }
        }
    }

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Min-Heap | Approach 2: Bucket Sort |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N \log k)$** — Processing $N$ frequencies inside size-$k$ heap. | **$O(N)$** — Single map iteration and sequential bucket scans. |
| **Space Complexity** | **$O(N)$** — Frequency map storage and heap. | **$O(N)$** — Buckets array storage and frequency map. |

#### Edge Cases Handled:
*   **All Elements have Frequency 1**: Handled correctly by bucket array mapping.
*   **$k$ equals Unique Elements Count**: Correctly returns all unique keys.
