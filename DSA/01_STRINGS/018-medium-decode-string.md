# 018. Decode String (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Bloomberg, Amazon, Microsoft
>
> **Interview Tag**: 🔥 **MUST SOLVE** - A top-tier interview classic. Perfect for testing your command of parsing syntax trees using either **Stacks** or **Recursion**.

---

### 📝 1. Problem Statement
Given an encoded string, return its decoded string.

The encoding rule is: `k[encoded_string]`, where the `encoded_string` inside the square brackets is being repeated exactly `k` times. Note that `k` is guaranteed to be a positive integer.

You may assume that the input string is always valid; there are no extra spaces, square brackets are well-formed, etc. Furthermore, you may assume that the original data does not contain any digits and that digits are only for those repeat numbers, `k`. For example, there will not be input like `3a` or `2[4]`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "3[a]2[bc]"`
* **Output**: `"aaabcbc"`

#### Test Case 2
* **Input**: `s = "3[a2[c]]"`
* **Output**: `"accaccacc"`

#### Test Case 3
* **Input**: `s = "2[abc]3[cd]ef"`
* **Output**: `"abcabccdcdcdef"`

---

### 💬 3. What is This Problem Actually Asking?
We need to unpack/decompress a string that contains nested repeating patterns.
The format is always `count[pattern]`.
When we see nested brackets like `3[a2[c]]`, we must first decode the innermost bracket: `2[c]` becomes `cc`. Then the string becomes `3[acc]`, which decodes to `accaccacc`.

Since this requires parsing "last-in, first-out" nested groupings, we can solve it using either a **Stack** or **Recursive Call Stack**.

---

### 🌍 4. Real-Life Example
Think of nested **Russian Matryoshka dolls** containing drawing instructions:
* If you see a number followed by an opening doll `[`, you must set aside your current notepad on a storage shelf (the stack) and open a fresh blank notepad inside the new doll.
* Alternatively, you can just **hire a helper** (recursion) to open the doll, write down everything inside it, and hand you the finished sheet so you can tape it onto your paper!

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two highly professional approaches** that showcase complete mastery of parser design:

#### Approach 1: Dual Stacks (Iterative)
We maintain two stacks:
* `countStack`: holds the multipliers $k$ for parent scopes.
* `stringStack`: holds the accumulated decoded strings for parent scopes.
* **Pros**: Incredibly robust, explicit, and avoids deep function call stack memory issues.

#### Approach 2: Global Pointer Recursion (Highly Elegant)
Instead of managing manual stacks, we use a single pointer `i` that walks the string, and a recursive helper function `decode()`.
* When we see a number, we build it.
* When we see `[`, we recursively call `decode()` to solve the nested doll and return its string. We repeat it `num` times and append it to our active result.
* When we see `]`, we exit our current recursive level by returning the accumulated string.
* **Pros**: Incredibly elegant, very natural to write, and matches how professional compilers parse expressions!

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both the Iterative Dual Stacks approach and the Recursive parser.

```typescript
// ==========================================
// 1st Approach: Iterative Dual Stacks Parser
// ==========================================
function decodeString(s: string): string {
    const countStack: number[] = [];
    const stringStack: string[] = [];
    
    let currentStr = "";
    let currentNum = 0;

    for (let i = 0; i < s.length; i++) {
        const char = s[i];

        if (char >= '0' && char <= '9') {
            // Build the multi-digit repeat count
            currentNum = currentNum * 10 + (char.charCodeAt(0) - 48);
        } else if (char === '[') {
            // Push active state onto stacks
            countStack.push(currentNum);
            stringStack.push(currentStr);
            
            // Reset for the new nested bracket scope
            currentStr = "";
            currentNum = 0;
        } else if (char === ']') {
            // Exit the nested bracket scope
            const count = countStack.pop()!;
            const prevStr = stringStack.pop()!;
            
            // Build: parent prefix + (this nested result repeated 'count' times)
            currentStr = prevStr + currentStr.repeat(count);
        } else {
            // Regular letter, append to current work-in-progress string
            currentStr += char;
        }
    }

    return currentStr;
}

// ==========================================
// 2nd Approach: Global Pointer Recursion (Highly Recommended)
// ==========================================
function decodeStringRecursive(s: string): string {
    let i = 0;
    
    const decode = (): string => {
        let res = "";
        let num = 0;
        
        while (i < s.length) {
            let char = s[i];
            
            if (Number(char) >= 0 && Number(char) <= 9) {
                num = num * 10 + Number(char);
                i++;
            } else if (char === "[") {
                i++;
                let str = decode();
                res += str.repeat(num);
                num = 0;
            } else if (char === "]") {
                i++;
                return res;
            } else {
                res += char;
                i++;
            }
        }
        return res;
    }
    
    return decode();
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**:
  - **Approach 1 (Dual Stacks)**: **$O(L)$** — where $L$ is the length of the *decoded* output string.
  - **Approach 2 (Recursion)**: **$O(L)$** — where $L$ is the length of the *decoded* output string.
* **Space Complexity**:
  - **Approach 1 (Dual Stacks)**: **$O(D + L)$** — stack space up to max nesting depth $D$ plus the space for output $L$.
  - **Approach 2 (Recursion)**: **$O(D + L)$** — call stack space up to max nesting depth $D$ plus the space for output $L$.

#### Edge Cases Handled:
* **Multi-Digit Numbers** (`s = "100[a]"`): Handled perfectly by standard decimal building (`num * 10 + char`).
* **Deep Nesting** (`s = "2[2[2[a]]]"`): Recursion calls nested layers naturally, maintaining complete tracking purity (Correct).

---

### 🎬 8. Dry Run
Let's trace the recursive parser execution for `s = "3[a]2[bc]"`:

```text
▶ Level 0: decode() for "3[a]2[bc]"
  ├── Index 0: '3' ──► num = 3
  ├── Index 1: '[' ──► Spawn Level 1 helper:
  │     ▶ Level 1: decode() for "a]"
  │       ├── Index 2: 'a' ──► res = "a"
  │       └── Index 3: ']' ──► Return "a"
  ├── Level 0 receives "a", appends "a" * 3 ──► res = "aaa"
  ├── Index 4: '2' ──► num = 2
  ├── Index 5: '[' ──► Spawn Level 1 helper:
  │     ▶ Level 1: decode() for "bc]"
  │       ├── Index 6: 'b' ──► res = "b"
  │       ├── Index 7: 'c' ──► res = "bc"
  │       └── Index 8: ']' ──► Return "bc"
  └── Level 0 receives "bc", appends "bc" * 2 ──► res = "aaabcbc"
▶ Exit: Return final string "aaabcbc"
```
