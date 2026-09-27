# 002. Last Stone Weight (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Google, LinkedIn
>
> **Interview Tag**: 🔥 **MAX-HEAP SIMULATION** - Standard greedy collision modeling pattern.

---

### 📝 1. Problem Statement
You are given an array of integers `stones` where `stones[i]` is the weight of the $i^{\text{th}}$ stone.

We are playing a game with the stones. On each turn, we choose the **heaviest two stones** and smash them together. Suppose the heaviest two stones have weights `x` and `y` with `x <= y`. The result of this smash is:
*   If `x == y`, both stones are destroyed.
*   If `x != y`, the stone of weight `x` is destroyed, and the stone of weight `y` has new weight `y - x`.

At the end of the game, there is **at most one** stone left.

Return *the weight of the last remaining stone*. If there are no stones left, return `0`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `stones = [2,7,4,1,8,1]`
* **Output**: `1`
* **Why**:
  * Smash 8 and 7 $\rightarrow$ remaining stone becomes 1 $\rightarrow$ `stones = [2,4,1,1,1]`
  * Smash 4 and 2 $\rightarrow$ remaining stone becomes 2 $\rightarrow$ `stones = [2,1,1,1]`
  * Smash 2 and 1 $\rightarrow$ remaining stone becomes 1 $\rightarrow$ `stones = [1,1,1]`
  * Smash 1 and 1 $\rightarrow$ both destroyed $\rightarrow$ `stones = [1]`
  * One stone left, weight is 1.

#### Test Case 2
* **Input**: `stones = [1]`
* **Output**: `1`
* **Why**: Only one stone, game ends.

---

### 💬 3. What is This Problem Actually Asking?
We need to repeatedly retrieve and remove the two largest values in a collection, calculate their absolute difference, and insert the non-zero difference back into the collection, repeating until 0 or 1 element remains.

---

### 🌍 4. Real-Life Example
Imagine a competitive tournament of sumo wrestlers. The organizer always schedules matches between the two heaviest wrestlers. If they are exactly the same weight, they both exhaust themselves and retire. If one is heavier, he wins but tires out, effectively reducing his weight capability by the opponent's weight. Matches repeat until one champion remains.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach: Max-Heap Simulation
*   Create a Max-Heap containing all stone weights.
*   While heap size $> 1$:
    *   Extract the largest stone `y` (first extraction).
    *   Extract the second largest stone `x` (second extraction).
    *   If `y > x`, calculate `y - x` and insert it back into the heap.
*   If heap size is `1`, return the root element. Else return `0`.
*   **Time Complexity**: $O(N \log N)$ since we insert all $N$ elements into the heap, and at each iteration we perform $O(\log N)$ extraction/insertion operations.
*   **Space Complexity**: $O(N)$ to store elements in the heap.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `stones = [2, 7, 4, 1, 8, 1]`.

#### **Step 1: Build Max-Heap**
* `heap = [8, 7, 4, 1, 2, 1]`

#### **Step 2: Smash 8 and 7**
* Extract `y = 8`
* Extract `x = 7`
* `y - x = 1` $\rightarrow$ Insert `1`.
* `heap = [4, 2, 1, 1, 1]`.

#### **Step 3: Smash 4 and 2**
```text
State: heap = [4, 2, 1, 1, 1]
Extract y = 4
Extract x = 2
Insert diff (4 - 2 = 2):
Heap after insert: [2, 1, 1, 1]
                    2
                   / \
                  1   1
                 /
                1
```
* Extract `y = 4`
* Extract `x = 2`
* `y - x = 2` $\rightarrow$ Insert `2`.
* `heap = [2, 1, 1, 1]`.

#### **Step 4: Smash 2 and 1**
* Extract `y = 2`, `x = 1` $\rightarrow$ Insert `1`.
* `heap = [1, 1, 1]`.

#### **Step 5: Smash 1 and 1**
* Extract `y = 1`, `x = 1` $\rightarrow$ both destroyed (no insertion).
* `heap = [1]`.
* Loop terminates (size is 1).
* **Result**: returns `1`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class MaxiHeap {
    private heap: number[] = [];

    constructor(arr?: number[]) {
        if (arr) {
            this.heap = [...arr];
            const startIdx = Math.floor(this.heap.length / 2) - 1;
            for (let i = startIdx; i >= 0; i--) {
                this.heapifyDown(i);
            }
        }
    }

    public insert(val: number): void {
        this.heap.push(val);
        this.heapifyUp(this.heap.length - 1);
    }

    public extractMax(): number {
        const max = this.heap[0];
        const end = this.heap.pop()!;
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.heapifyDown(0);
        }
        return max;
    }

    public size(): number {
        return this.heap.length;
    }

    private heapifyUp(idx: number): void {
        let curr = idx;
        while (curr > 0) {
            const parent = Math.floor((curr - 1) / 2);
            if (this.heap[curr] > this.heap[parent]) {
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
            let largest = curr;

            if (left < length && this.heap[left] > this.heap[largest]) {
                largest = left;
            }
            if (right < length && this.heap[right] > this.heap[largest]) {
                largest = right;
            }

            if (largest !== curr) {
                [this.heap[curr], this.heap[largest]] = [this.heap[largest], this.heap[curr]];
                curr = largest;
            } else {
                break;
            }
        }
    }
}

function lastStoneWeight(stones: number[]): number {
    // Build Max-Heap in O(N)
    const maxHeap = new MaxiHeap(stones);

    while (maxHeap.size() > 1) {
        const y = maxHeap.extractMax();
        const x = maxHeap.extractMax();

        if (y > x) {
            maxHeap.insert(y - x);
        }
    }

    return maxHeap.size() === 1 ? maxHeap.extractMax() : 0;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Implementation |
| :--- | :--- |
| **Time Complexity** | **$O(N \log N)$** — Heapification takes $O(N)$. We smash stones at most $N-1$ times, with each turn taking $O(\log N)$. |
| **Space Complexity** | **$O(N)$** — Space to store the array elements in the Max-Heap structure. |

#### Edge Cases Handled:
*   **Single Stone** (`stones.length = 1`): loop is skipped and it returns `stones[0]`.
*   **All Stones Destroyed**: If matching stones cancel out, heap terminates empty and returns `0`.
