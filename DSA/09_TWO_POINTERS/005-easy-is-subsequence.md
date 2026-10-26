# 005. Is Subsequence (Easy)

**Sheet**: Namaste DSA · 7. Two Pointers & Sliding Window · [LeetCode 392](https://leetcode.com/problems/is-subsequence/)

**Interview Tag**: 🔥 **MUST SOLVE** - The cleanest "two pointers moving at different speeds" problem. Expect the follow-up about many `s` strings.

---

### 📝 1. Problem Statement
Given strings `s` and `t`, return `true` if `s` is a **subsequence** of `t`.

A subsequence keeps the original order but may skip characters: `"ace"` is a subsequence of `"abcde"` (take a, skip b, take c, skip d, take e), while `"aec"` is not (the order is wrong).

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "abc"`, `t = "ahbgdc"`
* **Output**: `true`
* **Why**: `a`, `b`, `c` appear in `t` in that order.

#### Test Case 2
* **Input**: `s = "axc"`, `t = "ahbgdc"`
* **Output**: `false`
* **Why**: There is no `x` in `t`.

#### Test Case 3
* **Input**: `s = ""`, `t = "abc"`
* **Output**: `true`
* **Why**: The empty string is a subsequence of every string.

#### Test Case 4
* **Input**: `s = "aaa"`, `t = "aa"`
* **Output**: `false`
* **Why**: `t` has only two `a`s to match three.

---

### 💬 3. What is This Problem Actually Asking?
Walk through `t` once. Every time the current character of `t` equals the **next character you still need** from `s`, tick it off. If you tick off all of `s`, it's a subsequence.

---

### 🌍 4. Real-Life Example
A **shopping list in aisle order**. You walk the supermarket aisles (`t`) from start to end and never walk back. Each time you pass the next item on your list (`s`), you grab it and move your finger down the list. If your finger reaches the end of the list before you reach the exit, you got everything.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: Two strings, read with indexes.
* **Algorithm**: **Two Pointers (different speeds)**.
  * `i` points into `s` and only moves on a match.
  * `j` points into `t` and moves every step.
  * **Greedy is safe**: matching `s[i]` at the *earliest* possible position in `t` never hurts, because it leaves the most of `t` for the rest of `s`.

**Follow-up (many `s` strings, say $10^9$ of them):** preprocess `t` once into a map `char → sorted list of indexes`. For each `s`, binary-search the next index greater than the current position. Each query then costs $O(|s| \log |t|)$ instead of $O(|t|)$.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `s = "abc"`, `t = "ahbgdc"`

| `j` | `t[j]` | need `s[i]` | match? | `i` after |
| :---: | :---: | :---: | :---: | :---: |
| 0 | `a` | `a` | yes | 1 |
| 1 | `h` | `b` | no | 1 |
| 2 | `b` | `b` | yes | 2 |
| 3 | `g` | `c` | no | 2 |
| 4 | `d` | `c` | no | 2 |
| 5 | `c` | `c` | yes | 3 |

`i === s.length`, so return `true`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function isSubsequence(s: string, t: string): boolean {
    let i = 0; // next character of s we still need

    for (let j = 0; j < t.length && i < s.length; j++) {
        if (t[j] === s[i]) i++; // matched: move on to the next needed character
    }

    return i === s.length;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(|t|)$**, one pass over `t` (the loop also stops early once `s` is fully matched).
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **Empty `s`**: `i` is already `0 === s.length`, returns `true`.
* **`s` longer than `t`**: can never finish matching, returns `false`.
* **Repeated letters** (`"aaa"` in `"aa"`): each `t` character is used at most once, so the third `a` is never matched.
