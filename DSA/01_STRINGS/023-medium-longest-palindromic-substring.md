# 023. Longest Palindromic Substring (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **CENTERS EXPANSION** - Classical string problem. Tests understanding of palindromic symmetry, odd vs. even center cases, and boundary tracking.

---

### 📝 1. Problem Statement
Given a string `s`, return *the longest palindromic substring* in `s`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "babad"`
* **Output**: `"bab"`
* **Why**: `"aba"` is also a valid answer. Both have length 3.

#### Test Case 2
* **Input**: `s = "cbbd"`
* **Output**: `"bb"`
* **Why**: `"bb"` is the longest palindromic substring.

---

### 💬 3. What is This Problem Actually Asking?
We need to find the longest contiguous slice of the string that reads the same backward as forward.

---

### 🌍 4. Real-Life Example
Imagine scanning a text banner to find mirror-writing symmetrical words (e.g. `"RADAR"`). You don't test all combinations of slices. You spot a letter (or pair of letters) that looks like a reflection mirror-plane, and expand your focus outward in both directions as long as the letters on both sides match.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing search optimization:

#### Approach 1: Brute Force Substring Check
We check every possible substring pair `(i, j)` and test if it is a palindrome. We keep track of the longest one.
* **Pros**: Simple conceptual model.
* **Cons**: Incredibly slow ($O(N^3)$), causing TLE on strings of size over 500.

#### Approach 2: Expand Around Centers (Optimal)
A palindrome is symmetrical around its center:
* For a string of length $N$, there are $2N - 1$ potential centers:
  * **Odd Palindromes** have a center at a single character: index `i`.
  * **Even Palindromes** have a center between two characters: index `i` and `i + 1`.
* For each center, we expand outward using two pointers as long as the letters are identical and index bounds are valid.
* **Pros**: Fast, optimal $O(N^2)$ runtime, constant $O(1)$ space.
* **Cons**: None.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `s = "aba"`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `start = 0`, `end = 0` (maxLength = 1)

#### **Step 1: i = 0 (char = 'a')**
* **Odd Center (0, 0)**: Cannot expand. Length = 1.
* **Even Center (0, 1)**: `s[0] (a) !== s[1] (b)`. Length = 0.

#### **Step 2: i = 1 (char = 'b')**
* **Odd Center (1, 1)**: Expand outward: `s[0] (a) === s[2] (a)`.
  * Boundaries: `left = 0`, `right = 2`. Length = 3.
* **Updates**: `start = 0`, `end = 2`. `longest = "aba"`.

#### **Step 3: i = 2 (char = 'a')**
* **Odd Center (2, 2)**: Cannot expand. Length = 1.
* **Result**: Loop terminates. Returns substring `"aba"` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function longestPalindrome(s: string): string {
    // ==========================================
    // 1st Approach: Brute Force Palindromes (O(N^3))
    // ==========================================
    /*
    if (s.length <= 1) return s;
    let longest = "";
    for (let i = 0; i < s.length; i++) {
        for (let j = i; j < s.length; j++) {
            const sub = s.substring(i, j + 1);
            if (sub.length > longest.length && isPalindrome(sub)) {
                longest = sub;
            }
        }
    }
    return longest;
    function isPalindrome(str: string): boolean {
        let l = 0, r = str.length - 1;
        while (l < r) {
            if (str[l] !== str[r]) return false;
            l++; r--;
        }
        return true;
    }
    */

    // ==========================================
    // 2nd Approach: Expand Around Centers (Optimal)
    // ==========================================
    if (s.length <= 1) return s;

    let start = 0;
    let end = 0;

    for (let i = 0; i < s.length; i++) {
        // 1. Expand around odd center (single character, e.g. "aba")
        const len1 = expandAroundCenter(s, i, i);
        // 2. Expand around even center (between characters, e.g. "abba")
        const len2 = expandAroundCenter(s, i, i + 1);

        const len = Math.max(len1, len2);

        if (len > end - start + 1) {
            // Update the boundaries of the longest palindromic substring
            start = i - Math.floor((len - 1) / 2);
            end = i + Math.floor(len / 2);
        }
    }

    return s.substring(start, end + 1);
}

function expandAroundCenter(s: string, left: number, right: number): number {
    let l = left;
    let r = right;

    while (l >= 0 && r < s.length && s[l] === s[r]) {
        l--;
        r++;
    }

    // Length of the palindromic substring is (r - 1) - (l + 1) + 1 = r - l - 1
    return r - l - 1;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Brute Force | Approach 2: Centers Expansion |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N^3)$** — Nested iteration with inner palindromic check. | **$O(N^2)$** — Linear centers with linear expansions. |
| **Space Complexity** | **$O(1)$** — Constant variables. | **$O(1)$** — Constant variables, fully in-place. |

#### Edge Cases Handled:
* **All Identical Letters** (`"bbbb"`): Correctly resolves odd/even centers to return `"bbbb"` (Correct).
