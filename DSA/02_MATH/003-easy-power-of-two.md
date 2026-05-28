# 003. Power of Two (Easy)

---

### 📝 1. Problem Statement
Given an integer `n`, return `true` if it is a **power of two**. Otherwise, return `false`.

An integer `n` is a power of two if there exists an integer `x` such that $n == 2^x$.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `n = 1`
* **Output**: `true`
* **Why**: $2^0 = 1$.

#### Test Case 2
* **Input**: `n = 16`
* **Output**: `true`
* **Why**: $2^4 = 16$.

#### Test Case 3
* **Input**: `n = 3`
* **Output**: `false`

#### Test Case 4
* **Input**: `n = -8`
* **Output**: `false`
* **Why**: Powers of two are strictly positive. Negative numbers can never be powers of two.

---

### 💬 3. What is This Problem Actually Asking?
We need to check if a number belongs to the sequence of doubling numbers: `1, 2, 4, 8, 16, 32, 64, ...`

* **The Math Approach**: We could loop and keep dividing `n` by `2`. If we get a remainder of `1` (unless `n` is `1` itself), it's not a power of two.
* **The Bitwise Approach**: We can check how the number is represented in binary.
  * Powers of two look like this in binary:
    * `1` $\rightarrow$ `0000 0001`
    * `2` $\rightarrow$ `0000 0010`
    * `4` $\rightarrow$ `0000 0100`
    * `8` $\rightarrow$ `0000 1000`
  * Notice that a power of two **always has exactly one single set bit (`1`)** in its binary format.

---

### 🌍 4. Real-Life Example
Think of **cell division (mitosis)**:
* A single cell divides into `2`.
* Those `2` divide into `4`.
* Those `4` divide into `8`, and then `16`, `32`, etc.
* If you count the total number of cells in any generation of this ideal process, it will **always** be a power of two. You can never have a generation with exactly `3` cells.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: None (scalar integers).
* **Algorithm**: **Bitwise AND Bit-Clearing (`n & (n - 1)`)**.
  * *Why*: If you subtract `1` from a power of two, its only set bit (`1`) becomes `0`, and all trailing zeros to its right flip to `1`.
    * Example: `n = 4` (`0100`) $\rightarrow$ `n - 1 = 3` (`0011`).
    * If we perform a bitwise AND (`n & (n - 1)`):
      `0100 & 0011 = 0000` (which is `0`).
  * For any number that is *not* a power of two, it has other set bits that will not be cleared.
    * Example: `n = 6` (`0110`) $\rightarrow$ `n - 1 = 5` (`0101`).
      `0110 & 0101 = 0100` (which is `4`, not `0`).
  * So, `n > 0 && (n & (n - 1)) === 0` is the ultimate $O(1)$ check!

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function isPowerOfTwo(n: number): boolean {
    // 1. Powers of two must be strictly greater than 0.
    // 2. n & (n - 1) clears the only set bit. If it results in exactly 0, it's a power of two.
    return n > 0 && (n & (n - 1)) === 0;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(1)$** — It executes a single bitwise comparison in constant time.
* **Space Complexity**: **$O(1)$** — No memory is allocated.

#### Edge Cases Handled:
* **Zero (`0`)**: `n > 0` evaluates to `false` instantly. Returns `false` (Correct).
* **Negative Numbers** (`-8`): `n > 0` evaluates to `false` instantly. Returns `false` (Correct).
* **Integer Bounds** ($2^{30}$): The bitwise operations handle signed 32-bit integers perfectly. Returns `true` (Correct).
