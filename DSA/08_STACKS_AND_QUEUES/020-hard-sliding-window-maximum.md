# 020. Sliding Window Maximum (Hard)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **MUST SOLVE** - A highly popular hard problem. Perfectly demonstrates how a double-ended queue (Deque) can optimize sliding window lookups from linear $O(K)$ per window to amortized $O(1)$ constant time.

---

### 📝 1. Problem Statement
You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.

Return *the max sliding window*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1,3,-1,-3,5,3,6,7]`, `k = 3`
* **Output**: `[3,3,5,5,6,7]`
* **Why**:
  ```text
  Window position                Max
  -------------------------     -----
  [1  3  -1] -3  5  3  6  7       3
   1 [3  -1  -3] 5  3  6  7       3
   1  3 [-1  -3  5] 3  6  7       5
   1  3  -1 [-3  5  3] 6  7       5
   1  3  -1  -3 [5  3  6] 7       6
   1  3  -1  -3  5 [3  6  7]      7
  ```

#### Test Case 2
* **Input**: `nums = [1]`, `k = 1`
* **Output**: `[1]`

---

### 💬 3. What is This Problem Actually Asking?
We need to find the maximum element in every contiguous subarray of size `k`.
A brute-force scan of each window takes $O(N \times k)$ time, which will result in a Time Limit Exceeded (TLE) error for large inputs. We need to find the maximum of each window in $O(1)$ amortized time.

---

### 🌍 4. Real-Life Example
Think of a **spotlight scanning a row of buildings** of different heights:
* The spotlight has a width of `k` buildings.
* As you move the spotlight to the right:
  * If you see a building that is taller than all buildings to its left, the shorter buildings to its left can **never** be the tallest building in any spotlight window that includes this tall building.
  * We can immediately forget about those shorter buildings.
  * The tallest building blocks the view, and is the candidate for the maximum.

---

### 🛠️ 5. Data Structure & Algorithms Used

We use a **Monotonic Queue** implemented using a Double-Ended Queue (Deque):
* We store **element indices** in the Deque.
* The Deque maintains indices of elements in **strictly decreasing order** of their corresponding values:
  * The front of the Deque always contains the index of the maximum element in the current window.
* For each index `i` from `0` to `N - 1`:
  1. **Evict Out-of-Bounds Indices**: If the index at the front of the deque falls outside the current window (i.e. `deque[front] < i - k + 1`), remove it from the front.
  2. **Maintain Monotonic Property**: While the deque is not empty and the current value `nums[i]` is greater than or equal to the value at the back of the deque (`nums[deque[back]]`):
     * Remove the back index from the deque (since `nums[i]` is larger and appears later, the older elements can never be the maximum of this or any future window).
  3. **Add Current Index**: Push `i` to the back of the deque.
  4. **Record Maximum**: If our window size is at least `k` (i.e. `i >= k - 1`), the maximum value of the window is `nums[deque[front]]`. Append it to our result array.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Dry run with `nums = [1, 3, -1, -3, 5]`, `k = 3`:

* **i = 0** (val = 1): Deque = `[0]`. Window not complete.
* **i = 1** (val = 3): `3 >= nums[0] (1)`. Pop `0`. Push `1`. Deque = `[1]`. Window not complete.
* **i = 2** (val = -1): `-1 < nums[1] (3)`. Push `2`. Deque = `[1, 2]`.
  * Window complete (`i >= 2`). Max is `nums[deque[0]]` = `nums[1]` = `3`.
  * Result = `[3]`.
* **i = 3** (val = -3): `-3 < nums[2] (-1)`. Push `3`. Deque = `[1, 2, 3]`.
  * Window complete. Max is `nums[deque[0]]` = `nums[1]` = `3`.
  * Result = `[3, 3]`.
* **i = 4** (val = 5):
  * Check out-of-bounds: `deque[0] (1) < 4 - 3 + 1 (2)`? Yes! Pop `1` from front. Deque becomes `[2, 3]`.
  * `5 >= nums[3] (-3)`. Pop `3`.
  * `5 >= nums[2] (-1)`. Pop `2`.
  * Deque is empty. Push `4`. Deque = `[4]`.
  * Window complete. Max is `nums[deque[0]]` = `nums[4]` = `5`.
  * Result = `[3, 3, 5]`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function maxSlidingWindow(nums: number[], k: number): number[] {
    const n = nums.length;
    const result: number[] = [];
    const deque: number[] = []; // Stores INDICES of elements

    for (let i = 0; i < n; i++) {
        // 1. Evict index that has fallen out of the sliding window bounds
        if (deque.length > 0 && deque[0] < i - k + 1) {
            deque.shift(); // Remove from front
        }

        // 2. Maintain decreasing order in deque
        // Pop indices from back whose values are smaller than or equal to current value
        while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
            deque.pop(); // Remove from back
        }

        // 3. Add current element's index
        deque.push(i);

        // 4. Record result once we have processed at least k elements
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Complexity | Description |
| :--- | :---: | :--- |
| **Time Complexity** | **$O(N)$** | Each element's index is enqueued and dequeued from the deque at most once. |
| **Space Complexity** | **$O(k)$** | The deque stores at most $k$ indices representing the current window. |

#### Edge Cases Handled:
* **k = 1**: Deque is processed and records values immediately at each index, returning a copy of the array. Correct.
* **Strictly Decreasing Array** (`[5, 4, 3, 2]`, `k=2`): Deque maintains all indices `[0, 1, 2]`, returning `[5, 4, 3]`. Correct.
* **Strictly Increasing Array** (`[1, 2, 3, 4]`, `k=2`): Deque is popped immediately on every push, returning `[2, 3, 4]`. Correct.
