# 010. Largest Odd Number in a String (Easy)

---

### 📝 1. Problem Statement
You are given a string `num`, representing a large integer. Return *the **largest-valued odd integer** (as a string) that is a **non-empty substring** of `num`, or an empty string `""` if no odd integer exists*.

A **substring** is a contiguous sequence of characters within a string.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `num = "52"`
* **Output**: `"5"`
* **Why**: The only non-empty substrings that represent integers are `"5"`, `"2"`, and `"52"`. Out of these, `"5"` is the only odd number.

#### Test Case 2
* **Input**: `num = "4206"`
* **Output**: `""`
* **Why**: No odd numbers can be formed from `"4206"`.

#### Test Case 3
* **Input**: `num = "35427"`
* **Output**: `"35427"`
* **Why**: The entire string represents an odd integer since it ends in `'7'` (which is odd). Therefore, `"35427"` is the largest odd substring.

---

### 💬 3. What is This Problem Actually Asking?
We are given a huge integer represented as a string. We want to find the largest contiguous substring that forms an odd number.

* **Mathematical Property**: An integer is odd if and only if its **last digit is odd**! 
* The rest of the digits to its left can be anything (even or odd).
* E.g. `"3542"` ends in `'2'` (even), so the whole number is even. But if we strip `'2'` off, we get `"354"` which ends in `'4'` (even). If we strip `'4'` off, we get `"35"` which ends in `'5'` (odd) $\rightarrow$ `"35"` is the largest odd number!
* Therefore, to find the **largest** odd substring, we should scan the string from **right to left** (backwards) and find the first odd digit. The entire prefix of the string up to this digit is our answer!

---

### 🌍 4. Real-Life Example
Imagine a **train of number carriages**:
* `[3] - [5] - [4] - [2]`
* You want to uncouple/split the train at some point such that the entire remaining front portion forms an odd number.
* To make the train as long (largest-valued) as possible, you walk from the very back carriage forward:
  * Carriage `[2]`: Even. Uncouple and throw away.
  * Carriage `[4]`: Even. Uncouple and throw away.
  * Carriage `[5]`: Odd! You stop here.
* The remaining train is `[3] - [5]`, which is the longest possible odd number train!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: None (scalar integers).
* **Algorithm**: **Reverse Linear Scan (Backwards Right-to-Left Search)**.
  * *Why*: Scanning from right to left allows us to find the first odd digit in $O(1)$ average time. Once found, we take the substring from index `0` up to `i + 1`. This avoids examining any digits to the left of the first odd digit unnecessarily.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function largestOddNumber(num: string): string {
    // Scan backwards from the rightmost digit
    for (let i = num.length - 1; i >= 0; i--) {
        const digit = num.charCodeAt(i) - 48; // Convert char to numeric digit (ASCII '0' is 48)

        // If the digit is odd, the prefix from index 0 up to i is our largest odd number
        if (digit % 2 !== 0) {
            return num.substring(0, i + 1);
        }
    }

    // If no odd digit was found in the entire string
    return "";
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — In the worst case (all digits are even), we scan the entire string of length $N$ once. In the best/average case, we find an odd digit quickly (e.g. on the very first step if the last digit is odd, which is a $O(1)$ operation).
* **Space Complexity**: **$O(1)$** auxiliary space — We only use a single loop pointer. The substring creation is the only memory allocation, which is standard for returning the output.

#### Edge Cases Handled:
* **All Even Digits** (`num = "2468"`): The loop completes without finding an odd digit. Returns `""` (Correct).
* **Single Digit - Odd** (`num = "7"`): `i = 0`, digit is 7 (odd). Returns `num.substring(0, 1)` which is `"7"` (Correct).
* **Single Digit - Even** (`num = "8"`): `i = 0`, digit is 8 (even). Returns `""` (Correct).

---

### 🎬 8. Dry Run
Let's trace `num = "3542"` (length 4):

#### **Step 0: Initial State**
```text
Pointer: i = 3
String:  " 3 5 4 2 "
           0 1 2 3
Pointer:         ▲
                 i
```
* **Condition**: `parseInt(num[3]) % 2 !== 0` -> `parseInt('2') % 2 !== 0` (2 % 2 !== 0 is false).
* **Decision**: Even digit. Decrement `i`.
* **Next**: `i` becomes 2.

#### **Step 1: i = 2**
```text
Pointer: i = 2
String:  " 3 5 4 2 "
           0 1 2 3
Pointer:       ▲
               i
```
* **Condition**: `parseInt(num[2]) % 2 !== 0` -> `parseInt('4') % 2 !== 0` (4 % 2 !== 0 is false).
* **Decision**: Even digit. Decrement `i`.
* **Next**: `i` becomes 1.

#### **Step 2: i = 1**
```text
Pointer: i = 1
String:  " 3 5 4 2 "
           0 1 2 3
Pointer:     ▲
             i
```
* **Condition**: `parseInt(num[1]) % 2 !== 0` -> `parseInt('5') % 2 !== 0` (5 % 2 !== 0 is true!).
* **Decision**: Odd digit found at index 1!
* **Slice**: Slice the string from start up to index `i + 1` (2) -> `num.substring(0, 2)`.
* **Final Result**: Returns `"35"`.
