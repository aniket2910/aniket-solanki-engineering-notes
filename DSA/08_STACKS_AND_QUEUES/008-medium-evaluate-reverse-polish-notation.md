# 008. Evaluate Reverse Polish Notation (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 LinkedIn, Google, Amazon
>
> **Interview Tag**: Mathematical Parsers - Classic stack application. Frequently asked by compiler, VM, and database teams to test expressions evaluation parsing logic.

---

### 📝 1. Problem Statement
You are given an array of strings `tokens` that represents an arithmetic expression in a **Reverse Polish Notation** (postfix notation).

Evaluate the expression. Return *an integer that represents the value of the expression*.

Note that:
* The valid operators are `'+'`, `'-'`, `'*'`, and `'/'`.
* Each operand may be an integer or another expression.
* The division between two integers always **truncates toward zero**.
* There will not be any division by zero.
* The input represents a valid arithmetic expression in reverse polish notation.
* The answer and all the intermediate calculations can be represented in a **32-bit integer**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `tokens = ["2", "1", "+", "3", "*"]`
* **Output**: `9`
* **Why**: `((2 + 1) * 3) = 9`

#### Test Case 2
* **Input**: `tokens = ["4", "13", "5", "/", "+"]`
* **Output**: `6`
* **Why**: `(4 + (13 / 5)) = 6` (Note: `13 / 5 = 2.6`, which truncates toward zero to become `2`).

#### Test Case 3
* **Input**: `tokens = ["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]`
* **Output**: `22`

---

### 💬 3. What is This Problem Actually Asking?
In standard math (infix notation), we write operators between numbers: `2 + 3`. This requires parenthesis to enforce order of operations, e.g., `(2 + 1) * 3`.
In Reverse Polish Notation (postfix notation), operators follow their operands: `2 1 + 3 *`. This notation is designed to be evaluated from left to right without needing parentheses. We must process elements sequentially and resolve operators using the most recently seen numbers.

---

### 🌍 4. Real-Life Example
Think of a **scientific calculator** (such as HP calculators) that uses Postfix entry:
* You type `2`, hit Enter.
* You type `1`, hit Enter.
* You hit `+`. The calculator immediately grabs `2` and `1` from the top of the stack, adds them, and displays `3` on the screen.
* You type `3`, hit Enter.
* You hit `*`. The calculator grabs the running result `3` and the new `3`, multiplies them, and shows `9`.

---

### 🛠️ 5. Data Structure & Algorithms Used
We use a **Stack** of numbers:
* Iterate through `tokens`:
  * If the token is a number: Convert it to an integer and push it onto the stack.
  * If the token is an operator (`+`, `-`, `*`, `/`):
    * Pop the top number `num2` (the second operand).
    * Pop the next top number `num1` (the first operand).
    * Apply the operator (`num1 operator num2`).
    * **Truncate Division**: For division, use `Math.trunc(num1 / num2)` to ensure it truncates toward zero (e.g. `-1.5` becomes `-1`, not `-2`).
    * Push the result back onto the stack.
* At the end of the loop, the stack will contain exactly one number, which is our final answer.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Dry run with `tokens = ["4", "13", "5", "/", "+"]`:

#### **Step 1: token = "4"**
* Number. Push `4`.
* Stack = `[ 4 ]`

#### **Step 2: token = "13"**
* Number. Push `13`.
* Stack = `[ 4, 13 ]`

#### **Step 3: token = "5"**
* Number. Push `5`.
* Stack = `[ 4, 13, 5 ]`

#### **Step 4: token = "/"**
* Operator. Pop `num2` = `5`. Pop `num1` = `13`.
* Calculation: `Math.trunc(13 / 5) = Math.trunc(2.6) = 2`.
* Push `2`.
* Stack = `[ 4, 2 ]`

#### **Step 5: token = "+"**
* Operator. Pop `num2` = `2`. Pop `num1` = `4`.
* Calculation: `4 + 2 = 6`.
* Push `6`.
* Stack = `[ 6 ]`

Final Output: `6`

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function evalRPN(tokens: string[]): number {
    const stack: number[] = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (token === "+" || token === "-" || token === "*" || token === "/") {
            // Pop operands in reverse order
            const num2 = stack.pop()!;
            const num1 = stack.pop()!;
            let result = 0;

            if (token === "+") {
                result = num1 + num2;
            } else if (token === "-") {
                result = num1 - num2;
            } else if (token === "*") {
                result = num1 * num2;
            } else if (token === "/") {
                // Math.trunc trims decimal digits, satisfying "truncate toward zero"
                result = Math.trunc(num1 / num2);
            }
            
            stack.push(result);
        } else {
            // Convert string operand to number and push
            stack.push(parseInt(token, 10));
        }
    }

    return stack.pop()!;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Complexity | Description |
| :--- | :---: | :--- |
| **Time Complexity** | **$O(N)$** | We process all $N$ tokens exactly once. Stack operations take $O(1)$ time. |
| **Space Complexity** | **$O(N)$** | In the worst-case (e.g. expression with all numbers followed by operators), the stack stores up to $N$ numbers. |

#### Edge Cases Handled:
* **Negative Numbers** (e.g. `"-11"`): Correctly parsed via `parseInt` and handled in divisions where `Math.trunc` truncates toward zero correctly.
* **Single Token** (e.g. `["18"]`): Loop runs once, pushes `18`, returns `18`. Correct.
* **Large Integers**: Handled correctly as JS numbers support double-precision floats which easily represent 32-bit integers without precision loss.
