# 025. Repeated Substring Pattern (Easy)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **PERIODIC PATTERN DETECTION** - Core string manipulation classic. Highly elegant lookahead trick or KMP pattern analysis. Perfect for testing out-of-the-box conceptual thinking.

---

### 📝 1. Problem Statement
Given a string `s`, check if it can be constructed by taking a substring of it and appending multiple copies of the substring together.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "abab"`
* **Output**: `true`
* **Why**: It is the substring `"ab"` repeated twice.

#### Test Case 2
* **Input**: `s = "aba"`
* **Output**: `false`
* **Why**: The string cannot be formed by repeating any of its substrings.

#### Test Case 3
* **Input**: `s = "abcabcabcabc"`
* **Output**: `true`
* **Why**: It is the substring `"abc"` repeated four times or `"abcabc"` repeated twice.

---

### 💬 3. What is This Problem Actually Asking?
Determine if the string `s` has a repeating periodic substring pattern that can reconstruct `s` in its entirety when repeated $K$ times (where $K \ge 2$).

---

### 🌍 4. Real-Life Example
Imagine a textile printing machine stamping a continuous pattern on a ribbon. If the ribbon reads `"STRIPESTRIPESTRIPESTRIPE"`, you want to verify if this design is a single template `"STRIPE"` stamped repeatedly, or if it is a unique, non-repeating custom ribbon.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **three approaches** showing the progression from simple simulation to string mathematics and optimal KMP prefix analysis:

#### Approach 1: Divisor Verification / Substring Replication (Simulation)
We observe that if a string `s` of length $N$ is constructed by repeating a substring, the length of that substring `i` must divide the total length $N$ perfectly (`n % i === 0`).
* Since the pattern must repeat at least twice to form the string, the maximum possible pattern length is $N / 2$.
* We iterate `i` from $\lfloor N / 2 \rfloor$ down to $1$. If `i` is a divisor, we take the prefix of length `i` (`s.substring(0, i)`), duplicate it $N / i$ times, and check if it perfectly matches the original string `s`.
* **Pros**: Extremely intuitive to explain; requires no complex string algorithms or formulas.
* **Cons**: Less optimal than other approaches since we repeatedly construct and compare strings in memory.

#### Approach 2: String Concatenation Trick (Highly Elegant)
If a string `s` contains a repeating substring, then we can write $s = P + P + \dots + P$ ($k$ copies of a pattern $P$, where $k \ge 2$).
*   If we double the string: `s + s` = $2k$ copies of $P$.
*   If we strip the first character and the last character from `s + s`, we are removing parts of the first and last patterns. This leaves at least $2k - 2$ complete copies of $P$.
*   Since $k \ge 2$, $2k - 2 \ge k$. This guarantees that the original string `s` ($k$ copies of $P$) **will still be found as a substring** inside the stripped doubled string!
*   If `s` is not repeating, doubling and stripping will destroy the structure, and `s` won't be found.
*   *Algorithm Reference*: Deep-dive explanation at [String Concatenation Trick Algorithm Guide](../ALGORITHMS/kmp-prefix-table.md#part-1-the-string-concatenation-trick).
*   **Pros**: Incredibly elegant, extremely fast to write.
*   **Cons**: Requires allocating memory for the doubled string.

#### Approach 3: KMP Prefix Table (LPS) (Optimal)
We build the Knuth-Morris-Pratt (KMP) prefix lookup table (`lps`), where `lps[i]` represents the length of the longest proper prefix of `s[0...i]` which is also a suffix of `s[0...i]`.
*   Let `n` be the length of the string.
*   If `s` is periodic, the remaining part `n - lps[n - 1]` represents the length of the repeating pattern.
*   If `lps[n - 1] > 0` and `n` is perfectly divisible by `n - lps[n - 1]`, the pattern constructs the string.
*   *Algorithm Reference*: Deep-dive explanation at [KMP Prefix Table Algorithm Guide](../ALGORITHMS/kmp-prefix-table.md#part-2-the-kmp-prefix-table-lps-algorithm).
*   **Pros**: Highly rigorous, optimal $O(N)$ runtime, does not allocate doubled strings.
*   **Cons**: Complex prefix matching index logic.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run **Approach 1 (Divisor Verification)** and **Approach 2 (String Concatenation Trick)** with `s = "abab"` (length `n = 4`).

#### **Dry Run: Approach 1 (Divisor Verification)**
1. **`i = Math.floor(4 / 2) = 2`**:
   * Divisor Check: `4 % 2 === 0`? Yes.
   * `times = 4 / 2 = 2`.
   * `subStr = s.substring(0, 2) = "ab"`.
   * Replicate `subStr` 2 times: `newStr = "ab" + "ab" = "abab"`.
   * Comparison: `newStr === s` (`"abab" === "abab"`)? Yes!
   * Returns `true` immediately.

#### **Dry Run: Approach 2 (String Concatenation Trick)**
1. **Double the String**: Create `doubled = s + s = "abababab"`.
2. **Strip Boundaries**: Remove index 0 and index `2n - 1`: `stripped = "bababa"`.
3. **Search for s**: Does `"bababa"` contain `"abab"`?
   ```text
   stripped: " b   a   b   a   b   a "
                 idx1 idx2 idx3 idx4
   Match:          [ a   b   a   b ]
   ```
   * Match found at index 1! Returns `true` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing all three approaches. Approach 1 (Divisor Verification) and Approach 3 (KMP LPS) are shown in comments to demonstrate your progression of thought!

```typescript
function repeatedSubstringPattern(s: string): boolean {
    // ==========================================
    // 1st Approach: Divisor Verification (O(N * sqrt(N)))
    // ==========================================
    /*
    const n = s.length;
    for (let i = Math.floor(n / 2); i >= 1; i--) {
        if (n % i === 0) {
            let times = Math.floor(n / i);
            let subStr = s.substring(0, i);
            let newStr = "";
            while (times > 0) {
                newStr += subStr;
                times--;
            }
            if (newStr === s) {
                return true;
            }
        }
    }
    return false;
    */

    // ==========================================
    // 2nd Approach: KMP Prefix Table (O(N) Time & Space)
    // ==========================================
    /*
    const n = s.length;
    const lps = new Array(n).fill(0);
    let len = 0;
    let i = 1;

    while (i < n) {
        if (s[i] === s[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }

    const patternLen = n - lps[n - 1];
    return lps[n - 1] > 0 && n % patternLen === 0;
    */

    // ==========================================
    // 3rd Approach: String Concatenation Trick (Optimal)
    // ==========================================
    const doubled = s + s;
    
    // Strip the first and last characters
    const stripped = doubled.substring(1, doubled.length - 1);
    
    // Check if original string exists in stripped doubled string
    return stripped.includes(s);
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Divisor Verification | Approach 2: Concatenation Trick | Approach 3: KMP Prefix Table |
| :--- | :--- | :--- | :--- |
| **Time Complexity** | **$O(N \cdot \sqrt{N})$** — We check at most $O(\sqrt{N})$ divisors, and for each we do $O(N)$ string operations. | **$O(N)$** — Average case string search. | **$O(N)$** — Single pass to build `lps` table. |
| **Space Complexity** | **$O(N)$** — Allocates a repeated string of length $N$. | **$O(N)$** — Allocates doubled and stripped strings. | **$O(N)$** — Allocates index table of size $N$. |

#### Edge Cases Handled:
* **Single Character** (`s = "a"`):
  * *Divisor Verification*: Loops from `i = 0` (exits immediately). Returns `false` (Correct).
  * *Concatenation Trick*: Doubled `aa`, stripped `""`. `includes("a")` is false. Returns `false` (Correct).
* **Full Unique String** (`s = "abc"`): Returns `false` across all approaches (Correct).
* **Highly Composite Length** (`s = "a" * 12`): Safely detects patterns using the largest divisor `i = 6` first, returning `true` with minimum iterations (Correct).
