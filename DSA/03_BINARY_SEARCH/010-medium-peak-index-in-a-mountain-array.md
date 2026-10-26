# 010. Peak Index in a Mountain Array (Medium)

**Sheet**: Namaste DSA · 6. Binary Search Algorithm · [LeetCode 852](https://leetcode.com/problems/peak-index-in-a-mountain-array/)

**Interview Tag**: The easier sibling of [007. Find Peak Element](./007-medium-find-peak-element.md): here there is exactly **one** peak.

---

### 📝 1. Problem Statement
`arr` is a **mountain**: it strictly increases up to one peak, then strictly decreases. Return the index of the peak in **$O(\log n)$**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `arr = [0,1,0]`
* **Output**: `1`

#### Test Case 2
* **Input**: `arr = [0,2,1,0]`
* **Output**: `1`

#### Test Case 3
* **Input**: `arr = [0,10,5,2]`
* **Output**: `1`

#### Test Case 4
* **Input**: `arr = [1,3,5,7,4]`
* **Output**: `3`

---

### 💬 3. What is This Problem Actually Asking?
Each index is either on the **up slope** (`arr[i] < arr[i+1]`) or the **down slope**. The answers form `up up up down down`, and the peak is the **first "down"**. That's a first-`true` binary search.

---

### 🌍 4. Real-Life Example
A **mountain trail** marked with altitude signs. At any sign you look at the next one: higher means the summit is ahead, lower means you've passed it or are standing on it.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: Array.
* **Algorithm**: **Lower-bound Binary Search** on the predicate `arr[mid] > arr[mid + 1]`.
  * up slope → `low = mid + 1`
  * down slope (or the peak) → `high = mid`

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `arr = [1,3,5,7,4]`

| `low` | `high` | `mid` | slope at `mid` | action |
| :---: | :---: | :---: | :---: | :--- |
| 0 | 4 | 2 | 5 < 7 (up) | `low = 3` |
| 3 | 4 | 3 | 7 > 4 (down) | `high = 3` |

`low === high === 3`, return `3`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function peakIndexInMountainArray(arr: number[]): number {
    let low = 0;
    let high = arr.length - 1;

    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (arr[mid] < arr[mid + 1]) {
            low = mid + 1;   // still climbing
        } else {
            high = mid;      // descending: the peak is mid or before it
        }
    }
    return low;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(\log n)$**.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **Shortest mountain** (`[0,1,0]`): one step to find index 1.
* **Peak next to the end**: `low` climbs right up to it.
* The input is guaranteed to be a mountain, so the peak is never at index `0` or `n - 1`.
