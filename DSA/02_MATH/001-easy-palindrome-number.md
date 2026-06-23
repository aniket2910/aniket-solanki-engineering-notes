# 001. Palindrome Number (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon, Microsoft


---

### 📝 1. Problem Statement
Given an integer `x`, return `true` if `x` is a **palindrome**, and `false` otherwise.

An integer is a palindrome when it reads the same backward as forward. For example, `121` is a palindrome while `123` is not.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `x = 121`
* **Output**: `true`
* **Why**: `121` reads as `121` from left to right and from right to left.

#### Test Case 2
* **Input**: `x = -121`
* **Output**: `false`
* **Why**: From left to right, it reads `-121`. From right to left, it becomes `121-`. Therefore it is not a palindrome.

#### Test Case 3
* **Input**: `x = 10`
* **Output**: `false`
* **Why**: Reads `01` from right to left, which is not equal to `10`.

---

### 💬 3. What is This Problem Actually Asking?
We need to check if a number reads the exact same way forward and backward. 
* Negative numbers can **never** be palindromes because the minus sign (`-`) at the front will end up at the very back when reversed.
* Numbers ending in `0` (like `10` or `200`) can **never** be palindromes unless the number itself is `0`, because no integer starts with a leading `0` (like `01` or `002`).

---

### 🌍 4. Real-Life Example
Think of a **folding mirror** or a **symmetric pattern** on a piece of paper:
* If you write `1 2 1` on a paper and fold it exactly in half down the middle of `2`, the left `1` matches the right `1` perfectly.
* If you write `1 2 3` and fold it, the `1` does not match the `3`. It lacks symmetry.

---

### 🛠️ 5. Data Structure & Algorithm Used
There are two common ways to solve this:
1. **String Conversion (Two-Pointer)**: Convert the number to a string, then check if it's symmetric from the outside in.
2. **Mathematical Reversal (No String)**: Instead of converting to a string, we reverse the second half of the number mathematically using division (`/`) and modulo (`%`) operators.

*Since the follow-up asks to solve it **without** converting to a string, our optimal code uses the **Mathematical Reversal** algorithm.*

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace the mathematical division and modulo operations step-by-step for both odd-length (`x = 121`) and even-length (`x = 1221`) palindrome inputs:

#### **Case 1: Odd-Length Palindrome (`x = 121`)**

##### **Step 0: Initial State**
```text
x = 121
revertedNumber = 0
```

##### **Step 1: First Iteration**
* **Condition**: `x > revertedNumber` ($121 > 0$) is **True**.
* **Mathematical Operations**:
  ```text
  Extract digit:   121 % 10                = 1
  Reconstruct:     (revertedNumber * 10) + 1 = (0 * 10) + 1 = 1
  Shrink x:        Math.floor(121 / 10)    = 12
  ```
* **Result**: `x = 12`, `revertedNumber = 1`.

##### **Step 2: Second Iteration**
* **Condition**: `x > revertedNumber` ($12 > 1$) is **True**.
* **Mathematical Operations**:
  ```text
  Extract digit:   12 % 10                 = 2
  Reconstruct:     (revertedNumber * 10) + 2 = (1 * 10) + 2 = 12
  Shrink x:        Math.floor(12 / 10)     = 1
  ```
* **Result**: `x = 1`, `revertedNumber = 12`.

##### **Step 3: Loop Termination**
* **Condition**: `x > revertedNumber` ($1 > 12$) is **False**. Loop exits.

##### **Final Comparison**:
* Since the digit count was odd, we check if `x === Math.floor(revertedNumber / 10)`:
  `1 === Math.floor(12 / 10)` $\rightarrow$ `1 === 1` $\rightarrow$ **`true`**.

---

#### **Case 2: Even-Length Palindrome (`x = 1221`)**

##### **Step 0: Initial State**
```text
x = 1221
revertedNumber = 0
```

##### **Step 1: First Iteration**
* **Condition**: `x > revertedNumber` ($1221 > 0$) is **True**.
* **Mathematical Operations**:
  ```text
  Extract digit:   1221 % 10               = 1
  Reconstruct:     (revertedNumber * 10) + 1 = (0 * 10) + 1 = 1
  Shrink x:        Math.floor(1221 / 10)   = 122
  ```
* **Result**: `x = 122`, `revertedNumber = 1`.

##### **Step 2: Second Iteration**
* **Condition**: `x > revertedNumber` ($122 > 1$) is **True**.
* **Mathematical Operations**:
  ```text
  Extract digit:   122 % 10                = 2
  Reconstruct:     (revertedNumber * 10) + 2 = (1 * 10) + 2 = 12
  Shrink x:        Math.floor(122 / 10)    = 12
  ```
* **Result**: `x = 12`, `revertedNumber = 12`.

##### **Step 3: Loop Termination**
* **Condition**: `x > revertedNumber` ($12 > 12$) is **False**. Loop exits.

##### **Final Comparison**:
* Since the digit count was even, we check if `x === revertedNumber`:
  `12 === 12` $\rightarrow$ **`true`**.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function isPalindrome(x: number): boolean {
    // Edge Cases:
    // 1. Negative numbers are not palindromes (due to the '-' sign)
    // 2. Numbers ending in 0 (except 0 itself) are not palindromes
    if (x < 0 || (x % 10 === 0 && x !== 0)) {
        return false;
    }

    let revertedNumber: number = 0;
    
    // We only reverse the second half of the number to prevent integer overflow
    while (x > revertedNumber) {
        // Extract the last digit of x and add it to revertedNumber
        revertedNumber = (revertedNumber * 10) + (x % 10);
        // Remove the last digit from x
        x = Math.floor(x / 10);
    }

    // x is now the first half of the number, revertedNumber is the reversed second half.
    // For even number of digits (e.g. 1221): x = 12, revertedNumber = 12.
    // For odd number of digits (e.g. 121): x = 1, revertedNumber = 12. 
    // We can get rid of the middle digit by doing revertedNumber / 10.
    return x === revertedNumber || x === Math.floor(revertedNumber / 10);
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(\log_{10}(N))$** — Since we divide the input number by `10` in every iteration, the loop runs proportional to the number of digits in `x`.
* **Space Complexity**: **$O(1)$** — We only use one constant variable (`revertedNumber`) to store the reversed half.

#### Edge Cases Handled:
* **Zero (`0`)**: `x === 0` enters the loop, `x > revertedNumber` ($0 > 0$) is false. Loop doesn't run. Returns `true` (Correct).
* **Single Digit** (e.g. `5`): `5 > 0` enters loop. `revertedNumber = 5`, `x = 0`. Returns `x === Math.floor(revertedNumber / 10)` ($0 === 0$), which is `true` (Correct).
* **Negative Numbers** (e.g. `-15`): Caught immediately by the initial `if` block. Returns `false` (Correct).
