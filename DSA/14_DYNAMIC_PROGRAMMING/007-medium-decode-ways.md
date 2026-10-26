# 007. Decode Ways (Medium)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 91](https://leetcode.com/problems/decode-ways/)

**Interview Tag**: 🔥 **MUST SOLVE** - Climbing Stairs with **conditions on each step**. The zeros are the whole difficulty.

---

### 📝 1. Problem Statement
Letters are encoded as numbers: `A = 1`, `B = 2`, …, `Z = 26`. Given a string of digits `s`, return how many ways it can be decoded back into letters. Codes like `"06"` are invalid (no leading zeros).

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "12"`
* **Output**: `2`
* **Why**: `"AB"` (1, 2) or `"L"` (12).

#### Test Case 2
* **Input**: `s = "226"`
* **Output**: `3`
* **Why**: `2 2 6`, `22 6`, `2 26`.

#### Test Case 3
* **Input**: `s = "06"`
* **Output**: `0`
* **Why**: `0` alone isn't a letter, and `06` isn't a valid code.

#### Test Case 4
* **Input**: `s = "11106"`
* **Output**: `2`
* **Why**: `1 1 10 6` and `11 10 6`. The `0` must pair with the `1` before it.

---

### 💬 3. What is This Problem Actually Asking?
The last letter of a decoding uses either the **last digit** (if it's `1`–`9`) or the **last two digits** (if they form `10`–`26`). So:

`ways(i) = (s[i-1] ≠ '0' ? ways(i-1) : 0) + (10 ≤ s[i-2..i-1] ≤ 26 ? ways(i-2) : 0)`

---

### 🌍 4. Real-Life Example
Reading a **phone keypad message with no spaces**. "1226" could be 1-2-2-6, 12-2-6, 1-22-6, 1-2-26 or 12-26. At each point you ask: can the last digit stand alone? Can the last two digits stand together?

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: two rolling counts (`ways(i-1)`, `ways(i-2)`).
* **Algorithm**: **1-D DP** like Climbing Stairs, but each step is only allowed when its digit(s) form a valid code.
* Base: `ways(0) = 1` (the empty prefix has one decoding: nothing).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `s = "226"`

| `i` | one digit | valid? | two digits | valid? | `ways(i)` |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 0 | | | | | 1 |
| 1 | `2` | yes (+1) | — | — | 1 |
| 2 | `2` | yes (+1) | `22` | yes (+1) | 2 |
| 3 | `6` | yes (+2) | `26` | yes (+1) | 3 |

Returns `3`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function numDecodings(s: string): number {
    let prev2 = 1;                       // ways(i - 2), starts as ways(0) for the empty prefix
    let prev1 = s[0] === "0" ? 0 : 1;    // ways(1)

    for (let i = 2; i <= s.length; i++) {
        let current = 0;
        const one = Number(s[i - 1]);
        const two = Number(s.slice(i - 2, i));

        if (one >= 1) current += prev1;               // last letter uses one digit
        if (two >= 10 && two <= 26) current += prev2; // last letter uses two digits

        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n)$**.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **Leading zero** (`"06"`): `ways(1) = 0`, and nothing recovers it.
* **`"10"` / `"20"`**: the `0` can only be read together with the previous digit.
* **`"30"`**: neither `0` nor `30` is valid, so the answer becomes `0`.
