# 012. Find K Closest Elements (Medium)

**Sheet**: Namaste DSA · 6. Binary Search Algorithm · [LeetCode 658](https://leetcode.com/problems/find-k-closest-elements/)

**Interview Tag**: 🔥 **MUST SOLVE** - Binary search for a **window start**, not a value. A favourite follow-up after the two-pointer answer.

---

### 📝 1. Problem Statement
Given a sorted array `arr`, an integer `k` and a value `x`, return the `k` elements closest to `x`, **sorted ascending**. When two elements are equally close, the **smaller** one wins.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `arr = [1,2,3,4,5]`, `k = 4`, `x = 3`
* **Output**: `[1,2,3,4]`
* **Why**: `1` and `5` are both 2 away from `3`; the smaller (`1`) wins.

#### Test Case 2
* **Input**: `arr = [1,2,3,4,5]`, `k = 4`, `x = -1`
* **Output**: `[1,2,3,4]`

#### Test Case 3
* **Input**: `arr = [1,1,2,3,4,5]`, `k = 4`, `x = -1`
* **Output**: `[1,1,2,3]`

#### Test Case 4
* **Input**: `arr = [1,3]`, `k = 1`, `x = 2`
* **Output**: `[1]`

---

### 💬 3. What is This Problem Actually Asking?
The answer is always a **contiguous window** of length `k` in the sorted array. So the question is just: **where does the window start?** Possible starts are `0 … n - k`, and you can binary search them.

---

### 🌍 4. Real-Life Example
Choosing **`k` seats in a row** closest to the stage at position `x`. The best seats are always next to each other. Slide a block of `k` seats: if the seat just past the right end is closer to the stage than the seat at the left end, shift the block right.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Two pointers shrinking inward
Start with the whole array; drop whichever end is farther from `x` until `k` remain. $O(n - k)$.

#### Approach 2: Binary search on the window start (optimal)
For a candidate start `mid`, compare the element leaving on the left, `arr[mid]`, with the element that would enter on the right, `arr[mid + k]`:
* `x - arr[mid] > arr[mid + k] - x` → the right one is closer → start must be **after** `mid` → `low = mid + 1`.
* otherwise → `high = mid` (ties keep the left, smaller element).

Signed differences (not `Math.abs`) are deliberate: they stay correct when both elements are on the same side of `x`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `arr = [1,2,3,4,5]`, `k = 4`, `x = 3`. Starts range over `0 … 1`.

| `low` | `high` | `mid` | `x - arr[mid]` | `arr[mid+k] - x` | action |
| :---: | :---: | :---: | :---: | :---: | :--- |
| 0 | 1 | 0 | 3 − 1 = 2 | 5 − 3 = 2 | tie → `high = 0` |

Start `0`, return `arr.slice(0, 4) = [1,2,3,4]`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function findClosestElements(arr: number[], k: number, x: number): number[] {
    let low = 0;
    let high = arr.length - k; // last possible window start

    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        // Compare the element the window would drop (left) with the one it would gain (right)
        if (x - arr[mid] > arr[mid + k] - x) {
            low = mid + 1;   // the right side is strictly closer: shift the window right
        } else {
            high = mid;      // left side is closer or tied (smaller wins)
        }
    }
    return arr.slice(low, low + k);
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(\log(n - k) + k)$**, the search plus copying the window.
* **Space Complexity**: **$O(1)$** extra (the output array aside).

#### Edge Cases Handled:
* **`x` below every element**: window settles at start `0`.
* **`x` above every element**: window settles at `n - k`.
* **`k === n`**: `high = 0`, returns the whole array.
* **Ties**: the `else` branch keeps the smaller (left) element.
