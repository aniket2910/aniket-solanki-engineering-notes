# 005. Valid Parentheses (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon, Microsoft, Meta, Bloomberg
>
> **Interview Tag**: 🔥 **MUST SOLVE** - A top 10 interview question of all time. This is the absolute golden standard for demonstrating LIFO nested ordering and boundary check conditions.

---

### 📝 1. Problem Statement
Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "()[]{}"`
* **Output**: `true`

#### Test Case 2
* **Input**: `s = "(]"`
* **Output**: `false`

#### Test Case 3
* **Input**: `s = "([)]"`
* **Output**: `false` (incorrect closing order)

#### Test Case 4
* **Input**: `s = "{[]}"`
* **Output**: `true`

---

### 💬 3. What is This Problem Actually Asking?
We need to verify if brackets are nested properly. A closing bracket must match the **most recently opened** unmatched bracket. This "most recent" pattern is the definition of LIFO (Last-In, First-Out), making a stack the perfect tool.

---

### 🌍 4. Real-Life Example
Think of **nested HTML tags** or **undo logs in text editors**:
* When you type an opening tag `<div>`, you push it onto your stack of open tags.
* If you then write `<span>`, you push that onto the stack: `[div, span]`.
* When you write a closing tag, it **must** close the most recent tag. Thus, `</span>` matches `span` at the top of the stack and closes it. If you tried to write `</div>` before closing `<span>`, the system would trigger a layout error.

---

### 🛠️ 5. Data Structure & Algorithms Used
We use a **Stack** of characters:
1. As we iterate through string `s`:
   * If we see an opening bracket (`(`, `{`, `[`), we **push** it onto the stack.
   * If we see a closing bracket (`)`, `}`, `]`):
     * If the stack is empty, it means we have a closing bracket with no open match. Return `false`.
     * Pop the top element from the stack. If it does not match the current closing bracket, return `false`.
2. After completing the loop, check if the stack is empty. If it's not (e.g. `s = "((("`), we have unmatched open brackets. Return `false`. Otherwise, return `true`.

To write clean code, we map closing brackets to their matching opening brackets in a lookup map: `')' -> '('`, `']' -> '['`, `'}' -> '{'`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run with `s = "([)]"`:

#### **Step 1: char = '('**
* Open bracket. Push to stack.
* Stack = `[ '(' ]`

#### **Step 2: char = '['**
* Open bracket. Push to stack.
* Stack = `[ '(', '[' ]`

#### **Step 3: char = ')'**
* Close bracket. We pop from stack: popped = `'['`.
* Matching check: Does ` poppped === '(' ` (the match for `)` )?
* `'[' !== '('` -> Mismatch! Return `false` immediately.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function isValid(s: string): boolean {
    const stack: string[] = [];
    
    // Map closing brackets to their corresponding opening brackets
    const bracketMap: { [key: string]: string } = {
        ')': '(',
        '}': '{',
        ']': '['
    };

    for (let i = 0; i < s.length; i++) {
        const char = s[i];

        if (char === '(' || char === '{' || char === '[') {
            // Push opening brackets onto the stack
            stack.push(char);
        } else if (char === ')' || char === '}' || char === ']') {
            // If we see a closing bracket but stack is empty, it's invalid
            if (stack.length === 0) {
                return false;
            }
            
            // Pop the top of the stack and check if it matches the current closing bracket
            const top = stack.pop();
            if (top !== bracketMap[char]) {
                return false;
            }
        }
    }

    // If stack is empty, all brackets were matched correctly
    return stack.length === 0;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Complexity | Description |
| :--- | :---: | :--- |
| **Time Complexity** | **$O(N)$** | We scan the string of length $N$ exactly once. Stack operations `push` and `pop` take $O(1)$ time. |
| **Space Complexity** | **$O(N)$** | In the worst-case (e.g., `s = "((((("`), we push all elements onto the stack. |

#### Edge Cases Handled:
* **Empty String**: Returns `true` (technically valid, but if constraints state length $\ge 1$, we handle it).
* **Only Open Brackets** (`"((("`): The loop completes, but `stack.length === 3` is not 0. Returns `false`.
* **Only Close Brackets** (`")))"`): On the first step, stack is empty, returns `false` immediately.
