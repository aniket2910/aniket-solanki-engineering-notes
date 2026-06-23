# 002. Reverse Integer (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Bloomberg, Google, Apple


---

### 📝 1. Problem Statement
Given a signed 32-bit integer `x`, return `x` with its digits reversed. If reversing `x` causes the value to go outside the signed 32-bit integer range `[-2^31, 2^31 - 1]`, then return `0`.

**Assume the environment does not allow you to store 64-bit integers (signed or unsigned).**

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `x = 123`
* **Output**: `321`

#### Test Case 2
* **Input**: `x = -123`
* **Output**: `-321`

#### Test Case 3
* **Input**: `x = 120`
* **Output**: `21`

#### Test Case 4
* **Input**: `x = 1534236469`
* **Output**: `0`
* **Why**: The reverse of `1534236469` is `9646324351`. Since `9646324351 > 2147483647` (which is $2^{31} - 1$), the value overflows the signed 32-bit integer limit, so we return `0`.

---

### 💬 3. What is This Problem Actually Asking?
We need to reverse the digits of a number while keeping the negative sign intact if it exists. 

The core challenge is **handling 32-bit integer limits**:
* The maximum limit is `2,147,483,647` (let's call it `INT_MAX`).
* The minimum limit is `-2,147,483,648` (let's call it `INT_MIN`).
* If the reversed number is going to grow larger than `INT_MAX` or smaller than `INT_MIN`, we must instantly stop and return `0`. 
* **The Catch**: We cannot just reverse the number and check if it's too big at the end, because we are told we cannot store 64-bit integers. We must detect the overflow *before* it actually happens.

---

### 🌍 4. Real-Life Example
Think of a **mechanical counter/odometer** in a car that only has 10 dials (digits) and can only display numbers up to `2,147,483,647`. If you attempt to dial a number larger than that, the mechanical gears cannot display it and would jam, fail, or reset to zero.

---

### 🛠️ 5. Data Structure & Algorithm Used
No special data structures are required. We solve this using **Digit Extraction & Reconstruction** with custom overflow boundary checks in each loop iteration.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace the digit extraction, sign-preserving truncation, and active 32-bit overflow check operations step-by-step:

#### **Case 1: Standard Negative Integer (`x = -123`)**

##### **Step 0: Initial State**
```text
x = -123, reversed = 0
INT_MAX = 2147483647 (limit / 10 = 214748364)
INT_MIN = -2147483648 (limit / 10 = -214748364)
```

##### **Step 1: First Iteration**
* **Condition**: `x !== 0` is **True**.
* **Extraction & Truncation**:
  ```text
  pop = -123 % 10 = -3
  x   = Math.trunc(-123 / 10) = -12
  ```
* **Overflow/Underflow Checks**:
  * `reversed > 214748364` ($0 > 214748364$) $\rightarrow$ False.
  * `reversed < -214748364` ($0 < -214748364$) $\rightarrow$ False.
* **Reconstruction**:
  ```text
  reversed = (0 * 10) + (-3) = -3
  ```
* **End of Iteration**: `x = -12`, `reversed = -3`.

##### **Step 2: Second Iteration**
* **Condition**: `x !== 0` is **True**.
* **Extraction & Truncation**:
  ```text
  pop = -12 % 10 = -2
  x   = Math.trunc(-12 / 10) = -1
  ```
* **Overflow/Underflow Checks**: Pass.
* **Reconstruction**:
  ```text
  reversed = (-3 * 10) + (-2) = -32
  ```
* **End of Iteration**: `x = -1`, `reversed = -32`.

##### **Step 3: Third Iteration**
* **Condition**: `x !== 0` is **True**.
* **Extraction & Truncation**:
  ```text
  pop = -1 % 10 = -1
  x   = Math.trunc(-1 / 10) = 0
  ```
* **Overflow/Underflow Checks**: Pass.
* **Reconstruction**:
  ```text
  reversed = (-32 * 10) + (-1) = -321
  ```
* **End of Iteration**: `x = 0`, `reversed = -321`.

##### **Step 4: Loop Termination**
* **Condition**: `x !== 0` is **False**. Loop exits. Returns `reversed` (**`-321`**).

---

#### **Case 2: Overflow Detection (`x = 1534236469`)**

##### **Step 0: Initial State**
```text
x = 1534236469, reversed = 0
```

##### **Steps 1 to 9 (Digit Accumulation)**:
The loop extracts digits `9`, `6`, `4`, `6`, `3`, `2`, `4`, `3`, `5` sequentially.
* **State before last digit**: `x = 1`, `reversed = 964632435`

##### **Step 10: Final Iteration & Overflow Check**
* **Condition**: `x !== 0` is **True**.
* **Extraction & Truncation**:
  ```text
  pop = 1 % 10 = 1
  x   = Math.trunc(1 / 10) = 0
  ```
* **Positive Overflow Check**:
  * Is `reversed > Math.trunc(INT_MAX / 10)`?
    Is `964632435 > 214748364`? $\rightarrow$ **True!**
* **Decision**: Overflow detected! Instantly return **`0`**.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function reverse(x: number): number {
    const INT_MAX = 2147483647;  // 2^31 - 1
    const INT_MIN = -2147483648; // -2^31
    
    let reversed: number = 0;
    
    while (x !== 0) {
        // x % 10 preserves the sign in JS/TS (e.g. -123 % 10 = -3)
        const pop = x % 10;
        
        // Truncate towards zero (crucial to handle negative decimals correctly in JS/TS)
        x = Math.trunc(x / 10);
        
        // 1. Positive Overflow Check:
        // If reversed will exceed INT_MAX / 10, or if it equals INT_MAX / 10 and the next digit is > 7
        if (reversed > Math.trunc(INT_MAX / 10) || (reversed === Math.trunc(INT_MAX / 10) && pop > 7)) {
            return 0;
        }
        
        // 2. Negative Underflow Check:
        // If reversed will be less than INT_MIN / 10, or if it equals INT_MIN / 10 and the next digit is < -8
        if (reversed < Math.trunc(INT_MIN / 10) || (reversed === Math.trunc(INT_MIN / 10) && pop < -8)) {
            return 0;
        }
        
        // Reconstruct the reversed number
        reversed = (reversed * 10) + pop;
    }
    
    return reversed;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(\log_{10}(N))$** — Proportional to the number of digits in `x`.
* **Space Complexity**: **$O(1)$** — We use only constant-sized scalar variables.

#### Edge Cases Handled:
* **Zero (`0`)**: Loop terminates instantly. Returns `0` (Correct).
* **Number ending in 0** (`120`): `pop = 0`, `reversed = 0`, then `pop = 2`, `reversed = 2`, then `pop = 1`, `reversed = 21`. Automatically strips trailing zeros (Correct).
* **Overflowing Limit** (`1534236469`): In the final loop iteration, `reversed = 964632435` which is $> 214748364$. The overflow check triggers and returns `0` (Correct).
