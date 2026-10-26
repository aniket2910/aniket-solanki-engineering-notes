# 006. Palindromic Substrings (Medium)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 647](https://leetcode.com/problems/palindromic-substrings/)

**Interview Tag**: 🔥 **MUST SOLVE** - Sibling of [Longest Palindromic Substring](../01_STRINGS/023-medium-longest-palindromic-substring.md). Same **expand-around-centre** idea, but you count instead of tracking the longest.

---

### 📝 1. Problem Statement
Return how many substrings of `s` are palindromes. Substrings at different positions count separately even if they're the same text.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "abc"`
* **Output**: `3`
* **Why**: `"a"`, `"b"`, `"c"`.

#### Test Case 2
* **Input**: `s = "aaa"`
* **Output**: `6`
* **Why**: three `"a"`, two `"aa"`, one `"aaa"`.

#### Test Case 3
* **Input**: `s = "abba"`
* **Output**: `6`
* **Why**: `"a"`, `"b"`, `"b"`, `"a"`, `"bb"`, `"abba"`.

---

### 💬 3. What is This Problem Actually Asking?
Every palindrome has a **centre**: a single character (odd length) or the gap between two characters (even length). There are `2n - 1` centres. From each centre, grow outward while both ends match; every successful step is one more palindrome.

---

### 🌍 4. Real-Life Example
Looking for **symmetric patterns in a row of tiles**. Stand on a tile (or between two tiles) and spread your arms outwards one tile at a time; as long as the tiles under both hands match, you've found another symmetric stretch.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: DP table
`isPal[i][j] = s[i] === s[j] && (j - i < 2 || isPal[i+1][j-1])`. Count the `true` cells. $O(n^2)$ time **and** space.

#### Approach 2: Expand around centres (optimal)
For each centre, expand while `s[l] === s[r]`, counting each step. $O(n^2)$ time, **$O(1)$** space.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `s = "aaa"`

| centre | expansions found | count |
| :--- | :--- | :---: |
| `a` (0) | "a" | 1 |
| gap 0–1 | "aa" | 2 |
| `a` (1) | "a", "aaa" | 4 |
| gap 1–2 | "aa" | 5 |
| `a` (2) | "a" | 6 |

Returns `6`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function countSubstrings(s: string): number {
    let count = 0;

    function expand(left: number, right: number): void {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            count++;   // s[left..right] is a palindrome
            left--;
            right++;
        }
    }

    for (let i = 0; i < s.length; i++) {
        expand(i, i);     // odd length, centred on s[i]
        expand(i, i + 1); // even length, centred between s[i] and s[i + 1]
    }
    return count;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n^2)$**: `2n - 1` centres, each expanding up to $O(n)$.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **All different letters**: only the `n` single characters count.
* **All same letters**: every substring counts, `n(n+1)/2`.
* **Even-length palindromes**: handled by the gap centres; forgetting them is the classic bug.
