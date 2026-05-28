# 010. Largest Odd Number in a String (Easy)

---

### 📝 1. Problem Statement
You are given a string `num`, representing a large integer. Return the largest-valued odd integer (as a string) that is a non-empty substring of `num`, or an empty string `""` if no odd integer exists.

A **substring** is a contiguous sequence of characters within a string.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `num = "52"`
* **Output**: `"5"`
* **Why**: The only odd substring is `"5"`. The substring `"52"` is even.

#### Test Case 2
* **Input**: `num = "4206"`
* **Output**: `""`
* **Why**: There are no odd numbers that can be formed as contiguous substrings from `"4206"` because all digits are even.

#### Test Case 3
* **Input**: `num = "35427"`
* **Output**: `"35427"`
* **Why**: The number `"35427"` ends in `'7'`, which is odd. Thus, the entire string is already the largest odd number possible.

---

### 💬 3. What is This Problem Actually Asking?
We want to find the largest contiguous substring of `num` that represents an odd number.

A simple math rule: **An integer is odd if and only if its last digit is odd** (i.e., ends in `'1'`, `'3'`, `'5'`, `'7'`, or `'9'`).
To make a number as large as possible, we want it to have as many digits as possible starting from the very first digit. 
So:
* The substring must start at the very beginning of the string (index `0`) to retain maximum magnitude.
* The substring must end at some odd digit.
* To maximize the value, we should search for the **rightmost odd digit** in the string. 
* Once we find that rightmost odd digit, everything from index `0` up to that digit's index is our answer!

---

### 🌍 4. Real-Life Example
Imagine a long **freight train** where each car has a number painted on it. You want to detach a front portion of the train such that the number formed by the remaining front cars ends in an odd digit, and you want this train to be as long (and therefore as valuable) as possible.
* To find where to uncouple, you walk from the **caboose (the back of the train) forward to the locomotive (the front)**.
* The very first odd-numbered car you encounter is where you make the cut.
* You keep everything from that car all the way to the front locomotive! That's the longest possible odd train.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: Pure String. No extra allocations.
* **Algorithm**: **Reverse Linear Scan**.
  - We start a pointer `i` at the end of the string: `i = num.length - 1`.
  - We scan backwards towards the front:
    - At each index `i`, we check if the character `num[i]` is one of the odd digits: `'1', '3', '5', '7', '9'`.
    - If it is odd, we immediately return the substring from the beginning up to index `i` (inclusive): `num.substring(0, i + 1)`.
  - If we scan the entire string and find no odd digits, we return `""`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function largestOddNumber(num: string): string {
    // Scan backwards from the rightmost character
    for (let i = num.length - 1; i >= 0; i--) {
        const char = num[i];
        
        // Check if the digit is odd. 
        // In ASCII, odd digits are '1', '3', '5', '7', '9'.
        // Converting to a number code or checking set membership is O(1).
        if (char === '1' || char === '3' || char === '5' || char === '7' || char === '9') {
            // Slice the string from start to index i (inclusive)
            return num.substring(0, i + 1);
        }
    }

    // No odd digit found
    return "";
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — In the worst case (where there is no odd digit or it is at the very beginning), we scan all $N$ characters of the string.
* **Space Complexity**: **$O(1)$** auxiliary space — We only store loop variables. The return value takes up to $O(N)$ space for the sliced substring, but we don't use any extra helper data structures.

#### Edge Cases Handled:
* **No Odd Digits** (`num = "2468"`): The loop completes without finding any odd digit, returning `""` (Correct).
* **Entire String is Odd** (`num = "1357"`): The loop immediately finds `'7'` at index 3, and returns the whole string `"1357"` in $O(1)$ time (Correct).
* **Odd Digit at index 0** (`num = "3246"`): The loop scans backwards, skips `'6'`, `'4'`, `'2'`, and finds `'3'` at index 0. Returns `"3"` (Correct).
