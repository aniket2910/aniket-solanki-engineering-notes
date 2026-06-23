# 024. Roman to Integer (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Adobe, Apple, Google, Microsoft
>
> **Interview Tag**: 🔥 **LOOKAHEAD COMPRESSION** - Core string-map conversion. Tests understanding of symbol lookahead conditions and greedy aggregation.

---

### 📝 1. Problem Statement
Roman numerals are represented by seven different symbols: `I`, `V`, `X`, `L`, `C`, `D` and `M`.

```text
Symbol       Value
I             1
V             5
X             10
L             50
C             100
D             500
M             1000
```

For example, `2` is written as `II` in Roman numeral, just two ones added together. `12` is written as `XII`, which is simply `X + II`. The number `27` is written as `XXVII`, which is `XX + V + II`.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not `IIII`. Instead, the number four is written as `IV`. Because the one is before the five we subtract it making four. The same principle applies to number nine, which is written as `IX`. There are six instances where subtraction is used:
*   `I` can be placed before `V` (5) and `X` (10) to make 4 and 9. 
*   `X` can be placed before `L` (50) and `C` (100) to make 40 and 90. 
*   `C` can be placed before `D` (500) and `M` (1000) to make 400 and 900.

Given a roman numeral, convert it to an integer.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "III"`
* **Output**: `3`
* **Why**: `I = 1, II = 2, III = 3`.

#### Test Case 2
* **Input**: `s = "LVIII"`
* **Output**: `58`
* **Why**: `L = 50, V = 5, III = 3`.

---

### 💬 3. What is This Problem Actually Asking?
We need to convert a Roman numeral string into its integer value, correctly handling subtraction cases when a smaller symbol appears before a larger symbol.

---

### 🌍 4. Real-Life Example
Think of reading an old grandfather clock face or reading book chapters labeled with Roman numerals. If you see the sequence `"IV"`, you don't add $1 + 5 = 6$. You see the $1$ precedes the $5$, which tells you to subtract it, yielding $4$.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing lookup styles:

#### Approach 1: Substring Map Replacement
We replace all subtraction substrings (`"IV"`, `"IX"`, `"XL"`, etc.) with dummy single symbols representing their combined values, and then sum single symbols.
* **Pros**: Simple logic.
* **Cons**: Inefficient due to multiple string allocations.

#### Approach 2: Lookahead Subtraction Check (Optimal)
We maintain a lookup dictionary of Roman symbols. We traverse the string from left to right:
* If the value of the current symbol `currVal` is **smaller** than the value of the successor symbol `nextVal`, we **subtract** `currVal` from our running total.
* Otherwise, we **add** `currVal` to our running total.
* **Pros**: Optimal $O(N)$ runtime, constant $O(1)$ space.
* **Cons**: None.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `s = "XIV"`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `total = 0`, `map = {'I': 1, 'V': 5, 'X': 10}`

#### **Step 1: i = 0 (char = 'X')**
```text
s:        [  X,   I,   V  ]
            idx0 idx1 idx2
Pointers:    ▲    ▲
            curr next
```
* **State check**: `val('X') = 10`, `val('I') = 1`. Since `10 >= 1`, add `10` to `total`.
* **Updates**: `total = 10`.
* **Next**: `i` advances to index 1.

#### **Step 2: i = 1 (char = 'I')**
```text
s:        [  X,   I,   V  ]
            idx0 idx1 idx2
Pointers:         ▲    ▲
                 curr next
```
* **State check**: `val('I') = 1`, `val('V') = 5`. Since `1 < 5` (precedes larger), **subtract** `1` from `total`.
* **Updates**: `total = 10 - 1 = 9`.
* **Next**: `i` advances to index 2.

#### **Step 3: i = 2 (char = 'V')**
* **State check**: Last element. Add `5` to `total`.
* **Updates**: `total = 9 + 5 = 14`.
* **Result**: Loop terminates. Returns `14` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function romanToInt(s: string): number {
    // ==========================================
    // 1st Approach: Substring Mapping Replacements (O(N) Time & Space)
    // ==========================================
    /*
    const replacements = {
        "IV": "a", "IX": "b", "XL": "c", "XC": "d", "CD": "e", "CM": "f"
    };
    const values = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000,
        'a': 4, 'b': 9, 'c': 40, 'd': 90, 'e': 400, 'f': 900
    };
    let modified = s;
    for (let key in replacements) {
        modified = modified.split(key).join(replacements[key]);
    }
    let total = 0;
    for (let char of modified) {
        total += values[char];
    }
    return total;
    */

    // ==========================================
    // 2nd Approach: Lookahead Subtraction Check (Optimal)
    // ==========================================
    const romanMap: { [key: string]: number } = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
    };

    let total = 0;

    for (let i = 0; i < s.length; i++) {
        const currVal = romanMap[s[i]];
        const nextVal = i + 1 < s.length ? romanMap[s[i + 1]] : 0;

        if (currVal < nextVal) {
            // Smaller precedes larger: subtract value
            total -= currVal;
        } else {
            // Otherwise, add value
            total += currVal;
        }
    }

    return total;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Replacements | Approach 2: Lookahead |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Multiple string replacements and scans. | **$O(N)$** — Single pass over Roman numeral string. |
| **Space Complexity** | **$O(N)$** — Aux modified string allocations. | **$O(1)$** — Constant lookup map and variables. |

#### Edge Cases Handled:
* **Single character** (`"M"`): Loop runs once, returns `1000` (Correct).
