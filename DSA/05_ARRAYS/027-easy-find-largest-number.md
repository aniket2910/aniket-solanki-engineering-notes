# 027. Find Largest Number in an Array (Easy)

**Sheet**: Namaste DSA · 1. Foundation · [Practice](https://namastedev.com/practice/find-largest-number)

**Interview Tag**: Warm-up, the mirror of [026. Find Smallest Number](./026-easy-find-smallest-number.md). A classic trap: starting `max` at `0` breaks all-negative arrays.

---

### 📝 1. Problem Statement
Given `arr`, return its **largest** number.

* Empty array → `null`.
* Not an array, or contains a non-number / `NaN` / `Infinity` / `-Infinity` → `false`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `arr = [3, 1, 2]`
* **Output**: `3`

#### Test Case 2
* **Input**: `arr = [-5, 2, -3, 4]`
* **Output**: `4`

#### Test Case 3
* **Input**: `arr = [-1, -2, -3]`
* **Output**: `-1`
* **Why**: If `max` started at `0`, this would wrongly return `0`.

#### Test Case 4
* **Input**: `arr = []`
* **Output**: `null`

#### Test Case 5
* **Input**: `arr = [NaN]`
* **Output**: `false`

---

### 💬 3. What is This Problem Actually Asking?
Keep "the largest value seen so far" and replace it whenever something bigger shows up. Seed it from the data (`arr[0]`), never from a guess like `0`.

---

### 🌍 4. Real-Life Example
A **high-jump competition**: the current record is the first jumper's height, and every later jump that beats it becomes the new record. If every jump were below ground level (negative), the record would still be the best of those, not "0".

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: Array, read once.
* **Algorithm**: **Running maximum**. Seed with `arr[0]` (or `-Infinity`), scan, and replace on `x > max`. Validate with `Number.isFinite` first.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `arr = [-1, -2, -3]`

| `i` | `x` | `x > max`? | `max` |
| :---: | :---: | :---: | :---: |
| start | — | — | `-1` |
| 1 | `-2` | no | `-1` |
| 2 | `-3` | no | `-1` |

Returns `-1`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function findLargest(arr: unknown): number | null | false {
    if (!Array.isArray(arr)) return false;
    if (!arr.every((x) => Number.isFinite(x))) return false;
    if (arr.length === 0) return null;

    // Seed from the data, not from 0: an all-negative array must still work
    let max = arr[0] as number;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$**.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **All negatives**: seeding from `arr[0]` returns `-1`, not `0`.
* **Empty array**: `null`.
* **Invalid input**: `false` for non-arrays and for `NaN` / `Infinity` / non-number elements.
