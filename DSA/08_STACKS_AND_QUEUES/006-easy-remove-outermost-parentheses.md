# 006. Remove Outermost Parentheses (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google
>
> **Interview Tag**: String Decomposition - Ideal for practicing count-based nesting tracking and filtering string components.

---

### 📝 1. Problem Statement
A valid parentheses string is either empty `""`, `"(" + A + ")"`, or `A + B`, where `A` and `B` are valid parentheses strings, and `+` represents string concatenation.
* For example, `""`, `"()"`, `"(())()"`, and `"(())()" + "()"` are all valid parentheses strings.

A valid parentheses string `s` is **primitive** if it is non-empty and cannot be split into two or more non-empty valid parentheses strings.

Given a valid parentheses string `s`, consider its primitive decomposition: `s = P_1 + P_2 + ... + P_k`, where `P_i` are primitive valid parentheses strings.

Return `s` after removing the outermost parentheses of every primitive string in the primitive decomposition of `s`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "(()())(())"`
* **Output**: `"()()()"`
* **Why**: The primitive decomposition is `"(()())" + "(())"`. Removing outermost parentheses gives `"()()"` + `"()"` = `"()()()"`.

#### Test Case 2
* **Input**: `s = "(()())(())(()(()))"`
* **Output**: `"()()()()(())"`
* **Why**: The primitive decomposition is `"(()())" + "(())" + "(()(()))"`. Removing outermost parentheses gives `"()()"` + `"()"` + `"()(())"` = `"()()()()(())"`.

#### Test Case 3
* **Input**: `s = "()()"`
* **Output**: `""`
* **Why**: The primitive decomposition is `"()" + "()"`. Removing outermost parentheses from both yields `"" + ""` = `""`.

---

### 💬 3. What is This Problem Actually Asking?
We need to strip off the first level of parentheses (the outermost wrap) for each standalone valid bracket segment.
Any parenthesis that exists at depth level 0 (the outermost layer) should be discarded. Any parenthesis at depth level $\ge 1$ should be kept.

---

### 🌍 4. Real-Life Example
Think of **nested envelopes**:
* You receive a package containing multiple main envelopes.
* Inside each main envelope is one or more smaller letters or cards.
* This problem asks you to open every main envelope, throw away the outer packaging, and stack the inner letters together.

---

### 🛠️ 5. Data Structure & Algorithms Used
Although we can use a Stack, a simple **counter** representing current nesting depth `opened` is much faster and uses $O(1)$ auxiliary space.

#### The Depth Tracking Strategy:
* Initialize a string builder `result` and a counter `opened = 0`.
* Iterate through the characters of `s`:
  * If the character is `'('`:
    * If `opened > 0` (meaning it's not the outermost opening parenthesis), append it to `result`.
    * Increment `opened`.
  * If the character is `')'`:
    * Decrement `opened`.
    * If `opened > 0` (meaning it's not the outermost closing parenthesis), append it to `result`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Dry run with `s = "(()())"`:

| Index | Char | Action on `opened` | Condition Checked | Result String |
| :---: | :---: | :---: | :--- | :--- |
| 0 | `(` | Increment to 1 | `opened (0) > 0`? No. (Skip append) | `""` |
| 1 | `(` | Increment to 2 | `opened (1) > 0`? Yes. Append `(` | `"` |
| 2 | `)` | Decrement to 1 | `opened (1) > 0`? Yes. Append `)` | `"()"` |
| 3 | `(` | Increment to 2 | `opened (1) > 0`? Yes. Append `(` | `"()(`" |
| 4 | `)` | Decrement to 1 | `opened (1) > 0`? Yes. Append `)` | `"()()"` |
| 5 | `)` | Decrement to 0 | `opened (0) > 0`? No. (Skip append) | `"()()"` |

Final Output: `"()()"`

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function removeOuterParentheses(s: string): string {
    let result = "";
    let opened = 0;

    for (let i = 0; i < s.length; i++) {
        const char = s[i];

        if (char === '(') {
            // Only add if it is not the start of a new primitive group (depth level > 0)
            if (opened > 0) {
                result += char;
            }
            opened++;
        } else if (char === ')') {
            opened--;
            // Only add if it is not the end of a primitive group (depth level > 0)
            if (opened > 0) {
                result += char;
            }
        }
    }

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Complexity | Description |
| :--- | :---: | :--- |
| **Time Complexity** | **$O(N)$** | A single linear scan through the string of length $N$. |
| **Space Complexity** | **$O(N)$** | To store the output string. Auxiliary space is **$O(1)$** since we only use a primitive count variable. |

#### Edge Cases Handled:
* **All Single Brackets** (`"()()()"`): Decomposes to three primitive `"()"` groups. Outermost bracket of each is stripped, returning empty string `""`.
* **Deeply Nested Brackets** (`"(((())))"`): Outer layer at index 0 and 7 are removed, returning `"((()))"`.
