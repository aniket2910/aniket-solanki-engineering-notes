# KMP Prefix Table (LPS) & String Concatenation Trick

This document provides a highly visual, plain-English breakdown of the **KMP Prefix Table (LPS) Algorithm** and the **String Concatenation Trick** for detecting repeating periodic structures in strings.

---

## PART 1: THE STRING CONCATENATION TRICK

The **String Concatenation Trick** is a beautifully elegant, mathematical shortcut to verify if a string `s` can be constructed by repeating a smaller substring pattern.

### 1. The Core Idea & Mathematical Proof
Imagine a string `s` that is periodic. This means `s` is formed by repeating some pattern $P$ at least 2 times:
$$s = P + P + \dots + P \quad (	ext{at least } k 	ext{ copies of } P, 	ext{ where } k \ge 2)$$

Let's double this string by joining it to itself:
$$s + s = (P + P + \dots + P) + (P + P + \dots + P) \quad (	ext{at least } 2k 	ext{ copies of } P)$$

Now, let's **strip the very first character** and the **very last character** of this doubled string.
* By removing the first character, we damage the very first copy of the pattern $P$ at the start.
* By removing the last character, we damage the very last copy of the pattern $P$ at the end.
* This leaves us with $2k - 2$ complete, undamaged copies of $P$ in the middle.

Since $k \ge 2$, we know that:
$$2k - 2 \ge k$$

This means **there is still at least one complete original string `s` ($k$ copies of $P$) sitting perfectly intact inside the middle of the stripped doubled string!**

### 2. A Visual Demonstration
Let's use `s = "abab"` (where $P = "ab"$, $k = 2$).
1.  **Double the string**: `s + s = "abababab"` (4 copies of `"ab"`).
2.  **Strip the boundaries** (remove index 0 and the last index):
    ```text
    Doubled:  [ a ] [ b a b a b a ] [ b ]
                ▲                 ▲
             Removed           Removed
    ```
    This leaves us with the middle string: `"bababa"`.
3.  **Search for the original `s` ("abab")**:
    ```text
    Stripped:  " b [ a b a b ] a "
                     ▲
                 Match Found!
    ```
    Since `"abab"` exists inside `"bababa"`, we conclude `s` is periodic.

What if $s = "aba"$ (not periodic)?
1.  **Double**: `s + s = "abaaba"`.
2.  **Strip boundaries**: `"baab"`.
3.  **Search**: Does `"baab"` contain `"aba"`? No.

---

## PART 2: THE KMP PREFIX TABLE (LPS) ALGORITHM

The **Knuth-Morris-Pratt (KMP)** algorithm is a legendary string-matching algorithm. To search for a pattern in $O(N)$ time, KMP precomputes an auxiliary table called the **LPS Table** (Longest Proper Prefix which is also a Suffix).

### 1. What is a "Proper Prefix" and a "Suffix"?
*   **Prefix**: Any substring starting from the beginning of the string.
*   **Proper Prefix**: A prefix that is **not** the entire string itself.
    * For `"abc"`, proper prefixes are: `""`, `"a"`, `"ab"`. (Note: `"abc"` is *not* a proper prefix).
*   **Suffix**: Any substring ending at the very end of the string.
    * For `"abc"`, suffixes are: `""`, `"c"`, `"bc"`, `"abc"`.

### 2. The LPS Array Definition
For any string `s`, `lps[i]` stores the length of the **longest proper prefix** of the substring `s[0...i]` that is also a **suffix** of `s[0...i]`.

Let's build `lps` for `s = "ababc"` step-by-step:
*   `i = 0` (`"a"`): Proper prefixes: `[]`, Suffixes: `["a"]`. No match. **`lps[0] = 0`**.
*   `i = 1` (`"ab"`): Proper prefixes: `["a"]`, Suffixes: `["b"]`. No match. **`lps[1] = 0`**.
*   `i = 2` (`"aba"`): Proper prefixes: `["a", "ab"]`, Suffixes: `["a", "ba"]`. Match is `"a"` (length 1). **`lps[2] = 1`**.
*   `i = 3` (`"abab"`): Proper prefixes: `["a", "ab", "aba"]`, Suffixes: `["b", "ab", "bab"]`. Match is `"ab"` (length 2). **`lps[3] = 2`**.
*   `i = 4` (`"ababc"`): Proper prefixes: `["a", "ab", "aba", "abab"]`, Suffixes: `["c", "bc", "abc", "babc"]`. No match. **`lps[4] = 0`**.

### 3. Under the Hood: The LPS Builder Algorithm
To build `lps` in linear $O(N)$ time, we use a two-pointer scan:
*   `i` is our active scanning pointer, moving from `1` to `N - 1`.
*   `len` tracks the length of the current longest matching prefix-suffix. It also points to the index of the next character in the prefix we want to compare!

```text
Pointers: len = 0, i = 1
s:        [  a,   b,   a,   b  ]
            idx0 idx1 idx2 idx3
Ptrs:        ▲    ▲
            len   i
```

#### The Dynamic Traversal Rules:
1.  **If `s[i] === s[len]`**: A match! Increment `len++`, assign `lps[i] = len`, and increment `i++`.
2.  **If `s[i] !== s[len]`**: Mismatch. We must fallback to search for a shorter match.
    *   If `len !== 0`, **we do not reset `len` to 0!** We backtrack `len` to `lps[len - 1]`. This is the crucial step that saves time by reusing previous matches.
    *   If `len === 0`, we have no match at all. Assign `lps[i] = 0`, and increment `i++`.

Let's trace `s = "abab"`:
*   `i = 1, len = 0`: `s[1] ('b') !== s[0] ('a')`. Since `len === 0`, `lps[1] = 0`, `i` becomes 2.
*   `i = 2, len = 0`: `s[2] ('a') === s[0] ('a')`. Match! `len` becomes 1, `lps[2] = 1`, `i` becomes 3.
*   `i = 3, len = 1`: `s[3] ('b') === s[1] ('b')`. Match! `len` becomes 2, `lps[3] = 2`, `i` becomes 4.
*   LPS Array = `[0, 0, 1, 2]`.

### 4. Resolving Repeated Substring Pattern via LPS
If the string is periodic, the longest prefix-suffix matching boundary `lps[n-1]` will span almost the entire string, except for the first repeating block!
*   The length of the potential repeating unit is `patternLen = n - lps[n - 1]`.
*   If `lps[n - 1] > 0` (there is some suffix match) and `n` is perfectly divisible by `patternLen` (`n % patternLen === 0`), then the string is guaranteed to be periodic!
*   For `"abab"` ($n=4$): `lps[3] = 2`. `patternLen = 4 - 2 = 2`. Since `4 % 2 === 0`, returns `true` (Correct).

---

## 📂 Related Problem List
*   [025. Repeated Substring Pattern](../01_STRINGS/025-easy-repeated-substring-pattern.md)
*   [026. Find the Index of the First Occurrence in a String](../01_STRINGS/026-easy-find-index-first-occurrence.md)
