# 009. Word Break (Medium)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 139](https://leetcode.com/problems/word-break/)

**Interview Tag**: 🔥 **MUST SOLVE** - DP over **prefixes** of a string. A favourite at product companies.

---

### 📝 1. Problem Statement
Given a string `s` and a list of words `wordDict`, return `true` if `s` can be split into a sequence of one or more dictionary words. Words may be reused.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "leetcode"`, `wordDict = ["leet","code"]`
* **Output**: `true`

#### Test Case 2
* **Input**: `s = "applepenapple"`, `wordDict = ["apple","pen"]`
* **Output**: `true`
* **Why**: `"apple"` is reused.

#### Test Case 3
* **Input**: `s = "catsandog"`, `wordDict = ["cats","dog","sand","and","cat"]`
* **Output**: `false`
* **Why**: Every split leaves `"og"` or `"andog"`-style leftovers.

---

### 💬 3. What is This Problem Actually Asking?
`ok[i]` = "the first `i` characters can be split into words". The prefix `s[0..i)` is OK if there's a split point `j` where `s[0..j)` is OK **and** `s[j..i)` is a dictionary word.

---

### 🌍 4. Real-Life Example
Reading a **hashtag without spaces**, like `#throwbackthursday`. You check: is "throw" a word, and can the rest be read? Is "throwback" a word, and can "thursday" be read? Remembering which prefixes already worked stops you from re-reading them.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structures**: a `Set` of words for $O(1)$ lookup; a boolean array `ok` of length `n + 1` with `ok[0] = true`.
* **Algorithm**: **Bottom-up DP over prefixes**. For each `i`, try split points `j < i` (only up to the longest word length back) and stop at the first that works.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `s = "leetcode"`, words `{leet, code}`

| `i` | prefix | found split | `ok[i]` |
| :---: | :--- | :--- | :---: |
| 0 | "" | base | true |
| 4 | "leet" | `ok[0]` + "leet" | true |
| 8 | "leetcode" | `ok[4]` + "code" | true |

(Every other `i` stays `false`.) Returns `ok[8] = true`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function wordBreak(s: string, wordDict: string[]): boolean {
    const words = new Set(wordDict);
    const maxLen = Math.max(...wordDict.map((w) => w.length));
    const ok: boolean[] = new Array(s.length + 1).fill(false);
    ok[0] = true; // the empty prefix is trivially split

    for (let i = 1; i <= s.length; i++) {
        // Only look back as far as the longest word
        for (let j = Math.max(0, i - maxLen); j < i; j++) {
            if (ok[j] && words.has(s.slice(j, i))) {
                ok[i] = true;
                break;
            }
        }
    }
    return ok[s.length];
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n \cdot L \cdot L)$** where $L$ is the longest word: `n` ends, up to `L` starts, and an $O(L)$ slice each.
* **Space Complexity**: **$O(n + \text{dictionary size})$**.

#### Edge Cases Handled:
* **Reused words**: `ok` doesn't care how often a word was used.
* **Dead ends** (`"catsandog"`): some prefixes work, but `ok[n]` is never reached.
* **Plain recursion without memo** would be exponential on inputs like `"aaaa…ab"` with words `"a"`, `"aa"`, `"aaa"`.
