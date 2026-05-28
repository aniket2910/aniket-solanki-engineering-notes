# 011. Longest Common Prefix (Easy)

---

### 📝 1. Problem Statement
Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string `""`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `strs = ["flower","flow","flight"]`
* **Output**: `"fl"`
* **Why**: The letters `'f'` and `'l'` are common at the start of all three words. The third characters are `'o'`, `'o'`, and `'i'`, which do not match.

#### Test Case 2
* **Input**: `strs = ["dog","racecar","car"]`
* **Output**: `""`
* **Why**: There is no common prefix at all; the words start with `'d'`, `'r'`, and `'c'`.

#### Test Case 3
* **Input**: `strs = ["apple"]`
* **Output**: `"apple"`
* **Why**: There is only one string in the array, so the longest common prefix is the string itself.

---

### 💬 3. What is This Problem Actually Asking?
We need to find the longest substring that is at the **very beginning** of every single string in the given array. 

For example, a character at index `i` must be identical in all strings. The moment there is a mismatch at index `i` in any of the strings, or if one of the strings ends, the common prefix ends immediately, and we return the prefix accumulated up to that point.

---

### 🌍 4. Real-Life Example
Imagine a group of students named:
1. **Alex**ander
2. **Alex**andria
3. **Alex**ius

You want to write down their longest shared prefix nickname:
* Letter 1: All start with `'A'` $\rightarrow$ Keep going.
* Letter 2: All have `'l'` $\rightarrow$ Keep going.
* Letter 3: All have `'e'` $\rightarrow$ Keep going.
* Letter 4: All have `'x'` $\rightarrow$ Keep going.
* Letter 5: The names have `'a'`, `'a'`, and `'i'`. Since `'i'` is different, you must stop immediately.
* The longest shared prefix is **"Alex"**.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: Array of strings.
* **Algorithm**: **Vertical Character Scanning**.
  - We use the first string in the array (`strs[0]`) as our **reference string**.
  - We loop through each character position `i` of this reference string:
    - We retrieve the character `c = strs[0][i]`.
    - We then loop through all other strings in the array (from index `1` to `strs.length - 1`):
      - If `i` is equal to the length of the current string (meaning we've reached its end), or if the character at index `i` of the current string does not equal `c`, we stop!
      - We return the reference string sliced from index `0` up to `i` (exclusive): `strs[0].substring(0, i)`.
  - If we finish the entire loop without finding any mismatch, the reference string `strs[0]` itself is the common prefix. Return `strs[0]`.

This vertical scanning approach is highly optimal because it stops at the earliest possible mismatch, avoiding unnecessary work on long strings.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function longestCommonPrefix(strs: string[]): string {
    // If the array is empty, return an empty string
    if (strs.length === 0) return "";

    const reference = strs[0];

    // Scan each character position vertically
    for (let i = 0; i < reference.length; i++) {
        const char = reference[i];

        // Check this position in all other strings
        for (let j = 1; j < strs.length; j++) {
            const currentStr = strs[j];

            // If the current string ends or contains a mismatching character
            if (i === currentStr.length || currentStr[i] !== char) {
                // Return prefix up to index i
                return reference.substring(0, i);
            }
        }
    }

    // If we scanned the entire reference string successfully
    return reference;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(S)$** — where $S$ is the sum of all characters in all strings in the array. In the worst case (all strings are identical), the algorithm compares all characters. In the best case, it terminates very early in $O(M)$ time where $M$ is the number of strings.
* **Space Complexity**: **$O(1)$** auxiliary space — We only store index pointers and perform slicing for the return string. No auxiliary hash tables or structures are created.

#### Edge Cases Handled:
* **Empty Array** (`strs = []`): Returns `""` immediately (Correct).
* **Single String** (`strs = ["alone"]`): The outer loop runs, but the inner loop never executes. It completes and returns `"alone"` (Correct).
* **Empty String in Array** (`strs = ["", "b"]`): `i = 0` on reference `""` doesn't run because `i < reference.length` (0 < 0) is false. Returns `""` (Correct).
* **No Common Prefix** (`strs = ["dog", "cat"]`): The first character comparison `'d'` vs `'c'` fails instantly. Returns `""` (Correct).
