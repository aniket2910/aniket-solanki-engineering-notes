# 013. Letter Combinations of a Phone Number (Medium)

**Sheet**: Namaste DSA · 11. Backtracking · [LeetCode 17](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)

**Interview Tag**: 🔥 **MUST SOLVE** - Backtracking where **each level has its own choices** (the letters of that digit).

---

### 📝 1. Problem Statement
Each digit `2`–`9` on an old phone keypad maps to letters (`2 → abc`, `3 → def`, `4 → ghi`, `5 → jkl`, `6 → mno`, `7 → pqrs`, `8 → tuv`, `9 → wxyz`). Given a string of such digits, return every letter string it could spell, in any order. An empty input returns `[]`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `digits = "23"`
* **Output**: `["ad","ae","af","bd","be","bf","cd","ce","cf"]`

#### Test Case 2
* **Input**: `digits = ""`
* **Output**: `[]`
* **Why**: No digits, no words (not `[""]`).

#### Test Case 3
* **Input**: `digits = "2"`
* **Output**: `["a","b","c"]`

---

### 💬 3. What is This Problem Actually Asking?
Position `i` of the answer must be one of the letters of `digits[i]`. Pick one letter per position, left to right, and every full pick is a word.

---

### 🌍 4. Real-Life Example
**T9 texting** on a keypad phone: pressing `2` then `3` could mean "ad", "be", "cf" and so on. The phone builds every candidate by trying each letter of the first key with each letter of the second.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: a lookup table `digit → letters` (array indexed by digit).
* **Algorithm**: **Backtracking / DFS**. `build(index, current)`:
  * if `index === digits.length`, record `current`;
  * else, for each letter of `digits[index]`, recurse with `current + letter`.
* Strings are immutable, so `current + letter` makes a new string and no explicit "pop" is needed.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `digits = "23"`

```text
""
├─ a ─┬─ ad ✔ ─ ae ✔ ─ af ✔
├─ b ─┬─ bd ✔ ─ be ✔ ─ bf ✔
└─ c ─┬─ cd ✔ ─ ce ✔ ─ cf ✔
```

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function letterCombinations(digits: string): string[] {
    if (digits.length === 0) return [];

    const keypad = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
    const result: string[] = [];

    function build(index: number, current: string): void {
        if (index === digits.length) {
            result.push(current);
            return;
        }
        for (const letter of keypad[Number(digits[index])]) {
            build(index + 1, current + letter);
        }
    }

    build(0, "");
    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(4^n \cdot n)$**: up to 4 letters per digit (`7` and `9`), and each word costs $O(n)$ to build.
* **Space Complexity**: **$O(n)$** recursion depth (output aside).

#### Edge Cases Handled:
* **Empty input**: returns `[]`, checked before the recursion (otherwise it would return `[""]`).
* **Digits with 4 letters** (`7`, `9`): handled by the table, no special case.
