# 007. Sum of Any Number of Arguments (Easy)

**Sheet**: Namaste DSA · 1. Foundation · [Practice](https://namastedev.com/practice/sum)

**Interview Tag**: Warm-up. The question is really about two JavaScript features: rest parameters (`...nums`) and `reduce`.

---

### 📝 1. Problem Statement
Write a function `sum` that accepts **any number of numeric arguments** and returns their total.

* `sum()` with no arguments returns `0`.
* Negative numbers and decimals must work.
* Don't use `eval()` or the `Function` constructor.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `1`, `2`, `3`
* **Output**: `6`

#### Test Case 2
* **Input**: `10`
* **Output**: `10`

#### Test Case 3
* **Input**: (no arguments)
* **Output**: `0`
* **Why**: An empty total is `0`, the starting value of the sum.

#### Test Case 4
* **Input**: `5`, `-5`, `10`, `20`
* **Output**: `30`

#### Test Case 5
* **Input**: `100`, `200`, `300`, `400`
* **Output**: `1000`

---

### 💬 3. What is This Problem Actually Asking?
"Can you write a function whose parameter count isn't fixed?" Once all the arguments are in one array, adding them up is a single loop.

---

### 🌍 4. Real-Life Example
A **supermarket checkout**: the cashier doesn't know in advance how many items are in your basket. Each item is scanned and added to a running total that starts at `0`. An empty basket costs `0`.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: The `arguments` object (old style)
Every non-arrow function has an array-like `arguments` object. You can loop over it with an index. It works, but it isn't a real array (no `reduce`), and arrow functions don't have it.

#### Approach 2: Rest parameters + `reduce` (modern, optimal)
`function sum(...nums: number[])` collects every argument into a **real array** called `nums`. Then `nums.reduce((total, n) => total + n, 0)` folds the array into one number. The initial value `0` is what makes `sum()` return `0` instead of throwing.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `sum(5, -5, 10, 20)`, so `nums = [5, -5, 10, 20]`.

| Step | `n` | `total` before | `total` after |
| :---: | :---: | :---: | :---: |
| 0 | — | — | `0` (initial value) |
| 1 | `5` | `0` | `5` |
| 2 | `-5` | `5` | `0` |
| 3 | `10` | `0` | `10` |
| 4 | `20` | `10` | `30` |

Returns `30`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function sum(...nums: number[]): number {
    // Rest parameters gather every argument into a real array.
    // The initial value 0 makes sum() with no arguments return 0.
    return nums.reduce((total, n) => total + n, 0);
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$**, one pass over the $N$ arguments.
* **Space Complexity**: **$O(N)$** for the `nums` array the rest parameter builds (the sum itself is $O(1)$).

#### Edge Cases Handled:
* **No arguments**: `reduce` on `[]` with an initial value returns `0`. Without the `0` it would throw `TypeError: Reduce of empty array with no initial value`.
* **Negatives and decimals**: plain `+` handles both. (`0.1 + 0.2` is `0.30000000000000004` in JS; mention floating point if the interviewer asks about decimals.)
