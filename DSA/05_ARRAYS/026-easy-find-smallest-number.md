# 026. Find Smallest Number in an Array (Easy)

**Sheet**: Namaste DSA · 1. Foundation · [Practice](https://namastedev.com/practice/find-smallest-number)

**Interview Tag**: Warm-up. Know the running-minimum loop, and know why `Math.min(...arr)` is risky on huge arrays.

---

### 📝 1. Problem Statement
Given `arr`, return its **smallest** number.

* Empty array → `null`.
* Not an array, or contains a non-number / `NaN` / `Infinity` / `-Infinity` → `false`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `arr = [3, 1, 2]`
* **Output**: `1`

#### Test Case 2
* **Input**: `arr = [-5, 2, -3, 4]`
* **Output**: `-5`

#### Test Case 3
* **Input**: `arr = [-1.5, -0.1, 0, 2.2]`
* **Output**: `-1.5`

#### Test Case 4
* **Input**: `arr = []`
* **Output**: `null`
* **Why**: There is no smallest element of nothing.

#### Test Case 5
* **Input**: `arr = [1, "a"]`
* **Output**: `false`

#### Test Case 6
* **Input**: `arr = 42`
* **Output**: `false`

---

### 💬 3. What is This Problem Actually Asking?
Keep one variable that always holds "the smallest value seen so far", and replace it whenever something smaller shows up.

---

### 🌍 4. Real-Life Example
Finding the **cheapest flight** in a list of fares: you look at the first fare, remember it, then compare every next fare against the one you remembered and swap if the new one is cheaper.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: `Math.min(...arr)`
Short, but the spread passes every element as a separate function argument. Engines cap the argument count (around 100k+), so very large arrays throw `RangeError`. It also returns `Infinity` for an empty array, which you'd have to special-case.

#### Approach 2: Running minimum (optimal)
Start with `min = arr[0]` and scan the rest, updating `min` when `x < min`. Validation (`Number.isFinite`) happens in the same pass.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `arr = [-5, 2, -3, 4]`

| `i` | `x` | `x < min`? | `min` |
| :---: | :---: | :---: | :---: |
| start | — | — | `-5` |
| 1 | `2` | no | `-5` |
| 2 | `-3` | no | `-5` |
| 3 | `4` | no | `-5` |

Returns `-5`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function findSmallest(arr: unknown): number | null | false {
    if (!Array.isArray(arr)) return false;
    if (!arr.every((x) => Number.isFinite(x))) return false;
    if (arr.length === 0) return null;

    let min = arr[0] as number;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) min = arr[i];
    }
    return min;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$**. (The `every` check is a second pass; still linear.)
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **Single element**: the loop doesn't run, returns `arr[0]`.
* **All negatives / decimals**: plain `<` comparison handles both.
* **Empty array**: returns `null`, not `Infinity` (what `Math.min()` would give).
