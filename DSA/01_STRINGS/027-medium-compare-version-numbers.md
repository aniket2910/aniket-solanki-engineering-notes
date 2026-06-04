# 027. Compare Version Numbers (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **STRING PARSING & TWO-POINTERS** - Core software engineering problem. Evaluates string tokenization, type conversions, and boundary checks for uneven lists of revisions.

---

### 📝 1. Problem Statement
Given two version strings, `version1` and `version2`, compare them.

A version string consists of one or more revisions joined by a dot `'.'`. Each revision consists of **digits** and may contain leading zeroes. Every revision contains at least one character. Revisions are **0-indexed from left to right**, with the leftmost revision being revision 0, the next revision being revision 1, and so on. For example, version `2.5.33` has revisions `2`, `5`, and `33`.

To compare version strings, compare their revisions in 0-indexed order from left to right. Revisions are compared using their **integer value** after ignoring any leading zeroes.

If a version string does not specify a revision at an index, then **treat the revision as `0`**. For example, version `1.0` is less than version `1.1` because their revision 0s are the same (`1`), but their revision 1s are `0` and `1` respectively, and `0 < 1`.

Return:
* If `version1 < version2`, return `-1`.
* If `version1 > version2`, return `1`.
* Otherwise, return `0`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `version1 = "1.2"`, `version2 = "1.10"`
* **Output**: `-1`
* **Why**: Revision 0 is `"1"` in both. Revision 1 is `"2"` in `version1` and `"10"` in `version2`. Comparing their integer values, `2 < 10`, so `version1 < version2`.

#### Test Case 2
* **Input**: `version1 = "1.01"`, `version2 = "1.001"`
* **Output**: `0`
* **Why**: Leading zeroes are ignored. Both `"01"` and `"001"` parse as the integer `1`.

#### Test Case 3
* **Input**: `version1 = "1.0"`, `version2 = "1.0.0.0"`
* **Output**: `0`
* **Why**: `version1` does not specify revision 2 or 3. These missing revisions are treated as `0`. Since all specified revisions match, and the extra ones are `0`, the version numbers are equal.

---

### 💬 3. What is This Problem Actually Asking?
We need to compare two dot-separated lists of numbers from left to right. If one list is shorter, we mentally pad it with zeroes. We return which list is larger or if they represent the same version.

---

### 🌍 4. Real-Life Example
Think of dependency management in Node.js (`package.json`) or Maven. When upgrading a package, the package manager checks if a candidate version is newer than the currently installed one. If you have version `1.2.0` and the server has `1.2.3`, it sees `3 > 0` and performs the upgrade. If the server has `1.2` and you have `1.2.0`, it treats them as equivalent and does nothing.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** to solve this:

#### Approach 1: String Splitting (Array Parsing)
We split both strings by `.` to get arrays of revisions.
1. Pad or iterate up to the maximum length of both arrays.
2. Parse each chunk to an integer (using `parseInt()` or unary `+`). If an array index is out of bounds, use `0`.
3. Compare revisions at each index. If a difference is found, return `-1` or `1` immediately.
4. If the loop completes with all values equal, return `0`.
* **Pros**: Extremely clean, simple to implement, and easy to read.
* **Cons**: Allocates extra memory for arrays of strings from splitting.

#### Approach 2: Two-Pointer Character Scan (Optimal $O(1)$ Space)
Instead of splitting the strings beforehand, we scan both strings character-by-character using two pointers `i` and `j`.
1. Run a loop while `i < version1.length` or `j < version2.length`.
2. Extract the numeric value of the next chunk of `version1` up to the next `.` by scanning characters and converting on the fly (`val1 = val1 * 10 + digit`).
3. Do the same for `version2`.
4. Compare `val1` and `val2`. If different, return comparison results.
5. Increment pointer positions past the `.` delimiters.
* **Pros**: Optimal space complexity of $O(1)$ since no arrays are created.
* **Cons**: Marginally more complex pointer increment logic.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 1 with `version1 = "1.2"`, `version2 = "1.10"`.

#### **Step 0: Split Strings**
* `v1_parts = ["1", "2"]`
* `v2_parts = ["1", "10"]`
* `max_len = Math.max(2, 2) = 2`

#### **Step 1: Compare index 0**
* `val1 = parseInt("1") = 1`
* `val2 = parseInt("1") = 1`
* `1 === 1` $\rightarrow$ Continue loop.

#### **Step 2: Compare index 1**
* `val1 = parseInt("2") = 2`
* `val2 = parseInt("10") = 10`
* `2 < 10` $\rightarrow$ Return `-1` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean implementation showing the split-based parsing approach, which balances excellent code readability with standard runtime efficiency.

```typescript
function compareVersion(version1: string, version2: string): number {
    // 1. Split both version strings by the dot character
    const v1Parts = version1.split('.');
    const v2Parts = version2.split('.');
    
    const maxLength = Math.max(v1Parts.length, v2Parts.length);
    
    for (let i = 0; i < maxLength; i++) {
        // 2. Extract integer values at index i, defaulting to 0 if out of bounds
        const val1 = i < v1Parts.length ? parseInt(v1Parts[i], 10) : 0;
        const val2 = i < v2Parts.length ? parseInt(v2Parts[i], 10) : 0;
        
        // 3. Compare values
        if (val1 < val2) {
            return -1;
        }
        if (val1 > val2) {
            return 1;
        }
    }
    
    // 4. All revisions compared equal
    return 0;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: String Splitting | Approach 2: Character Scan |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N + M)$** — Where $N$ and $M$ are lengths of the strings. Splitting takes linear time, and the comparison loop runs at most $\max(L1, L2)$ times. | **$O(N + M)$** — One pass over both strings using two pointers. |
| **Space Complexity** | **$O(N + M)$** — To store the split arrays of substrings. | **$O(1)$** — Constant variables only. |

#### Edge Cases Handled:
* **Unequal Lengths with Zeroes** (`version1 = "1.0.0"`, `version2 = "1"`): Out-of-bound indexes default to `0`, successfully matching the values and returning `0` (Correct).
* **Very Long Integers**: JS/TS `parseInt` correctly parses large integers up to safety bounds, and ignores leading zeroes like `000005` $\rightarrow$ `5` (Correct).
* **Multi-Digit Delimited Strings** (`version1 = "7.5.2.4"`, `version2 = "7.5.3"`): Successfully returns `-1` on comparing index 2 (`2 < 3`) (Correct).
