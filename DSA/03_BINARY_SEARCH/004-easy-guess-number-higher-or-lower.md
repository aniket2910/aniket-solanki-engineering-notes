# 004. Guess Number Higher or Lower (Easy)

**Sheet**: Namaste DSA · 6. Binary Search Algorithm · [LeetCode 374](https://leetcode.com/problems/guess-number-higher-or-lower/)

**Interview Tag**: The textbook binary search, but through an API. Read the API's sign convention carefully: it is the opposite of what most people expect.

---

### 📝 1. Problem Statement
A number `pick` was chosen between `1` and `n`. You can call a provided function `guess(num)`:

* returns `-1` if your guess is **too high** (`num > pick`),
* returns `1` if your guess is **too low** (`num < pick`),
* returns `0` if you got it.

Return `pick`. (`guess` is provided by the judge; in the hub it answers for the test case's `pick`.)

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `n = 10`, `pick = 6`
* **Output**: `6`

#### Test Case 2
* **Input**: `n = 1`, `pick = 1`
* **Output**: `1`

#### Test Case 3
* **Input**: `n = 2`, `pick = 1`
* **Output**: `1`

#### Test Case 4
* **Input**: `n = 2126753390`, `pick = 1702766719`
* **Output**: `1702766719`
* **Why**: A linear guess would take over a billion calls; binary search takes about 31.

---

### 💬 3. What is This Problem Actually Asking?
"Write binary search where the comparison is a function call." The numbers `1…n` are the sorted array; `guess(mid)` tells you which half to throw away.

---

### 🌍 4. Real-Life Example
The **"I'm thinking of a number" game** with a friend. You never guess 1, 2, 3…; you say "50?", hear "lower", say "25?", and halve the range each time.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: An implicit sorted range `[1, n]` (no array is stored).
* **Algorithm**: **Binary Search**.
  * `guess(mid) === -1` → `mid` is too high → `high = mid - 1`.
  * `guess(mid) === 1` → `mid` is too low → `low = mid + 1`.
  * `0` → return `mid`.
* **Midpoint**: `low + Math.floor((high - low) / 2)`. In JS `(low + high)` can't overflow for these sizes, but this form is the habit interviewers look for (it matters in Java/C++).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `n = 10`, `pick = 6`

| `low` | `high` | `mid` | `guess(mid)` | action |
| :---: | :---: | :---: | :---: | :--- |
| 1 | 10 | 5 | `1` (too low) | `low = 6` |
| 6 | 10 | 8 | `-1` (too high) | `high = 7` |
| 6 | 7 | 6 | `0` | return `6` |

---

### 💻 6. Optimal Code (TypeScript)

```typescript
/**
 * guess(num) is provided by the judge:
 *   -1 if num > pick, 1 if num < pick, 0 if num === pick
 */
declare function guess(num: number): number;

function guessNumber(n: number): number {
    let low = 1;
    let high = n;

    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        const res = guess(mid);
        if (res === 0) return mid;
        if (res === -1) high = mid - 1; // my guess was too high
        else low = mid + 1;             // my guess was too low
    }
    return -1; // unreachable when pick is in [1, n]
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(\log n)$** calls to `guess`.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **`n = 1`**: the first `mid` is `1`, found immediately.
* **`pick` at either end**: the range shrinks onto it; `low <= high` keeps the last single-element range in play.
* **Sign mix-up**: `-1` means *your* number is higher than the pick. Reversing it loops forever or returns `-1`.
