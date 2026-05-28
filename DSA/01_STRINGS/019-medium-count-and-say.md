# 019. Count and Say (Medium)

---

### 📝 1. Problem Statement
The **count-and-say** sequence is a sequence of digit strings defined by the recursive formula:
* `countAndSay(1) = "1"`
* `countAndSay(n)` is the run-length encoding of `countAndSay(n - 1)`.

**Run-length encoding (RLE)** is a string compression method where consecutive identical characters are replaced by the concatenation of the character count and the character itself.

For example, to compress `"3322251"`:
* `"33"` is grouped as **two `'3'`s** $\rightarrow$ `"23"`
* `"222"` is grouped as **three `'2'`s** $\rightarrow$ `"32"`
* `"5"` is grouped as **one `'5'`** $\rightarrow$ `"15"`
* `"1"` is grouped as **one `'1'`** $\rightarrow$ `"11"`
* The resulting RLE string is `"23321511"`.

Given a positive integer `n`, return the *${n}^{\text{th}}$ term of the count-and-say sequence*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `n = 1`
* **Output**: `"1"`

#### Test Case 2
* **Input**: `n = 4`
* **Output**: `"1211"`
* **Why**:
  * `countAndSay(1) = "1"`
  * `countAndSay(2)` $\rightarrow$ say `"1"` $\rightarrow$ **one `'1'`** $\rightarrow$ `"11"`
  * `countAndSay(3)` $\rightarrow$ say `"11"` $\rightarrow$ **two `'1'`s** $\rightarrow$ `"21"`
  * `countAndSay(4)` $\rightarrow$ say `"21"` $\rightarrow$ **one `'2'`, then one `'1'`** $\rightarrow$ `"1211"`

---

### 💬 3. What is This Problem Actually Asking?
We need to generate terms of a sequence, where each term is the verbal description of the previous term's consecutive matching digits.

To go from term $k$ to term $k+1$, we read the digits of term $k$ from left to right, group adjacent matching digits, count them, and concatenate `[count][digit]` to form the next string.

We must repeat this generation process $n-1$ times starting from `"1"`.

---

### 🌍 4. Real-Life Example
Imagine a **conveyor belt carrying fruits**:
* Stage 1: `[🍎]` $\rightarrow$ You describe it as: "One apple". (You write down: `1🍎` $\rightarrow$ `"11"`).
* Stage 2: `[🍎, 🍎]` $\rightarrow$ You describe it as: "Two apples". (You write down: `2🍎` $\rightarrow$ `"21"`).
* Stage 3: `[🍎, 🍎, 🍌]` $\rightarrow$ You describe it as: "Two apples, one banana". (You write down: `2🍎 1🍌` $\rightarrow$ `"2111"`).
* This is exactly the same mechanism! We count consecutive identical items and write `count` followed by the `item`.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: String.
* **Algorithm**: **Iterative Run-Length Encoding**.
  - We initialize our starting term: `result = "1"`.
  - We loop $n - 1$ times to generate successive terms:
    - Set up an empty string builder `nextResult = []`.
    - Initialize a reading pointer `i = 0` on the current `result` string.
    - While `i < result.length`:
      - Count how many consecutive digits match `result[i]`. Initialize `count = 1`.
      - While the next digit exists and is identical (`result[i] === result[i + 1]`):
        - Increment `count`.
        - Increment `i` to move the pointer forward.
      - Append the `count` and the character `result[i]` to `nextResult`.
      - Increment `i` to point to the next new digit.
    - Update `result = nextResult.join('')`.
  - Return `result`.

Using string arrays (`string[]`) to accumulate the parts and `.join('')` at the end prevents $O(K^2)$ string concatenation overhead on longer sequences!

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function countAndSay(n: number): string {
    // Base term
    let result = "1";

    // Generate up to the n-th term
    for (let term = 2; term <= n; term++) {
        const nextResult: string[] = [];
        let i = 0;

        while (i < result.length) {
            const char = result[i];
            let count = 1;

            // Count consecutive matching characters
            while (i + 1 < result.length && result[i] === result[i + 1]) {
                count++;
                i++;
            }

            // Append count and digit
            nextResult.push(count.toString(), char);
            i++;
        }

        result = nextResult.join('');
    }

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(L)$** — where $L$ is the sum of the lengths of all generated strings up to term $n$. Although the string lengths grow exponentially at a rate of approximately 1.3 (known as Conway's constant), for $n \le 30$, this is highly efficient and executes in milliseconds.
* **Space Complexity**: **$O(M)$** — where $M$ is the length of the $n^{\text{th}}$ term string, which is the maximum amount of space needed for string building at the last step.

#### Edge Cases Handled:
* **$n = 1$**: The loop from `term = 2` to `1` does not execute. Returns `"1"` immediately (Correct).
* **No consecutive matches** (`result = "1211"`):
  * `i = 0`: `'1'` $\rightarrow$ count 1. Appends `"11"`.
  * `i = 1`: `'2'` $\rightarrow$ count 1. Appends `"12"`.
  * `i = 2`: `'1'` $\rightarrow$ matches next `'1'`, count 2. Appends `"21"`.
  * Result: `"111221"` (Correct).

---

### 🎬 8. Dry Run
Let's trace the transition from `result = "21"` (term 3) to term 4 (`"1211"`) with `nextResult = []`:

#### **Step 0: i = 0**
```text
Pointers: i = 0
result:   " 2   1 "
            0   1
Pointer:    ▲
            i
```
* **Character**: `char = '2'`, `count = 1`.
* **Comparison**: `result[i+1]` is `'1'`, which is not equal to `char` ('2').
* **Decision**: Group finished. Append `count` ("1") and `char` ("2") to `nextResult`.
* **Next**: `nextResult` becomes `["1", "2"]`. `i` becomes 1.

#### **Step 1: i = 1**
```text
Pointers: i = 1
result:   " 2   1 "
            0   1
Pointer:        ▲
                i
```
* **Character**: `char = '1'`, `count = 1`.
* **Comparison**: `i + 1` (2) is not `< result.length` (2).
* **Decision**: Group finished. Append `count` ("1") and `char` ("1") to `nextResult`.
* **Next**: `nextResult` becomes `["1", "2", "1", "1"]`. `i` becomes 2.
* **Exit**: `i` (2) is $\ge$ `result.length` (2). Loop exits.
* **Result**: `nextResult.join('')` -> `"1211"`.
