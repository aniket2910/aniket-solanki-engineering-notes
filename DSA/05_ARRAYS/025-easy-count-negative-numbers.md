# 025. Count Negative Numbers in an Array (Easy)

**Sheet**: Namaste DSA · 1. Foundation · [Practice](https://namastedev.com/practice/count-negative)

**Interview Tag**: Warm-up with a twist. The counting is trivial; the points are in **validating the input** the way a production function would.

---

### 📝 1. Problem Statement
Given `arr`, return how many elements are **strictly less than 0**.

Validation rules:
* If `arr` is not an array, return `false`.
* If any element is not a number, or is `NaN`, `Infinity` or `-Infinity`, return `false`.
* An empty array is valid and returns `0`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `arr = [-1, 0, 1]`
* **Output**: `1`
* **Why**: Only `-1` is below zero. `0` is not negative.

#### Test Case 2
* **Input**: `arr = [-2, -5, -7]`
* **Output**: `3`

#### Test Case 3
* **Input**: `arr = [0, 2, 3]`
* **Output**: `0`

#### Test Case 4
* **Input**: `arr = []`
* **Output**: `0`

#### Test Case 5
* **Input**: `arr = null`
* **Output**: `false`
* **Why**: Not an array.

#### Test Case 6
* **Input**: `arr = [1, "a"]`
* **Output**: `false`
* **Why**: Contains a non-number.

#### Test Case 7
* **Input**: `arr = [1, Infinity]`
* **Output**: `false`
* **Why**: `Infinity` is a number type but not finite.

---

### 💬 3. What is This Problem Actually Asking?
Two jobs: **guard** (reject anything that isn't a clean array of finite numbers) and **count** (one pass, add one for every `x < 0`).

---

### 🌍 4. Real-Life Example
A **bank statement checker**: before counting how many transactions were withdrawals (negative amounts), it first refuses a statement that has a blank or garbled amount, because any count on bad data would be wrong.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: Array, read once.
* **Algorithm**: **Linear scan with validation**.
  * `Array.isArray(arr)` is the reliable array check (`typeof []` is `"object"`, which also matches `null` and `{}`).
  * `Number.isFinite(x)` is true only for real finite numbers: it rejects strings, `NaN`, `Infinity` and `-Infinity` in one call. (The global `isFinite("8")` would coerce the string and say `true`, which is the trap.)
  * Validate and count in the **same loop**, so the array is read once.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `arr = [-1, 0, 1]`

| `i` | `x` | finite number? | `x < 0`? | `count` |
| :---: | :---: | :---: | :---: | :---: |
| 0 | `-1` | yes | yes | `1` |
| 1 | `0` | yes | no | `1` |
| 2 | `1` | yes | no | `1` |

Returns `1`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function countNegatives(arr: unknown): number | false {
    if (!Array.isArray(arr)) return false;

    let count = 0;
    for (const x of arr) {
        // Number.isFinite rejects non-numbers, NaN, Infinity and -Infinity in one check
        if (!Number.isFinite(x)) return false;
        if ((x as number) < 0) count++;
    }
    return count;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$**, one pass.
* **Space Complexity**: **$O(1)$**, one counter.

#### Edge Cases Handled:
* **Empty array**: the loop never runs, returns `0`.
* **`0` and `-0`**: neither is `< 0` (`-0 < 0` is `false` in JS), so neither is counted.
* **Strings like `"8"`**: rejected, because `Number.isFinite` does not coerce.
