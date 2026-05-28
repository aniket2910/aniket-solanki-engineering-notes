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
* **Why**: The letters `"f"` and `"l"` are common prefixes to all three strings.

#### Test Case 2
* **Input**: `strs = ["dog","racecar","car"]`
* **Output**: `""`
* **Why**: There is no common prefix among the input strings.

---

### 💬 3. What is This Problem Actually Asking?
We need to find the longest starting substring that is shared by **every single string** in the input array.
* E.g., for `["flow", "flower"]`, the longest common prefix is `"flow"`.
* E.g., for `["apple", "banana"]`, the first characters `'a'` and `'b'` do not match, so the common prefix is `""`.

To find this efficiently:
* We can compare the strings **character-by-character** (vertical scanning). We examine the first character of all strings, then the second character of all strings, and so on. As soon as we find a mismatch or reach the end of any string, we stop and return the common prefix up to that point!

---

### 🌍 4. Real-Life Example
Imagine a group of **family members spelling out their last names**:
* Person 1: `[S, M, I, T, H, E]`
* Person 2: `[S, M, I, T, H]`
* Person 3: `[S, M, I, T, T, Y]`
* You compare them column by column:
  * Column 0: All have `'S'` (Match!).
  * Column 1: All have `'M'` (Match!).
  * Column 2: All have `'I'` (Match!).
  * Column 3: All have `'T'` (Match!).
  * Column 4: Person 1 has `'H'`, Person 2 has `'H'`, but Person 3 has `'T'`. Mismatch!
* You stop immediately. The longest common prefix is `"SMIT"`.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: None (we traverse the input string array directly).
* **Algorithm**: **Vertical Scanning (Character-by-Character Comparison)**.
  * *Why*: Vertical scanning is highly optimal when the common prefix is short or when some strings are very short, because it avoids reading characters of long strings that lie beyond the prefix length.
  * Steps:
    1. If the input array is empty, return `""`.
    2. Pick the first string as our `reference` string.
    3. Loop `i` through the characters of `reference`:
       - Get `char = reference[i]`.
       - Loop `j` from `1` to the end of the `strs` array:
         - If `i` reaches the length of `strs[j]` (out of bounds) OR `strs[j][i] !== char` (mismatch):
           - Return the prefix up to index `i`: `reference.substring(0, i)`.
    4. If the loop completes successfully, it means the entire first string is the common prefix. Return `reference`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function longestCommonPrefix(strs: string[]): string {
    // If input is empty, no prefix exists
    if (strs.length === 0) {
        return "";
    }

    const reference = strs[0];

    // Iterate character-by-character vertically
    for (let i = 0; i < reference.length; i++) {
        const char = reference[i];

        // Compare this character with the character at the same index in all other strings
        for (let j = 1; j < strs.length; j++) {
            // If i is out of bounds for strs[j] OR characters don't match
            if (i === strs[j].length || strs[j][i] !== char) {
                return reference.substring(0, i);
            }
        }
    }

    return reference;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(S)$** — where $S$ is the sum of all characters in all strings. In the worst case (all strings are identical), we compare all characters, which takes $O(N \cdot L)$ time, where $N$ is the number of strings and $L$ is the length of the shortest string. In average cases, we exit extremely early.
* **Space Complexity**: **$O(1)$** auxiliary space — We only use integer indexes and constant-sized character variables.

#### Edge Cases Handled:
* **Empty Input Array** (`strs = []`): Handled at the beginning, returns `""` (Correct).
* **Single String in Array** (`strs = ["a"]`): Inner loop doesn't run. Outer loop finishes and returns `"a"` (Correct).
* **No Common Prefix** (`strs = ["a", "b"]`): `i = 0`, `reference[0] = 'a'`, `strs[1][0] = 'b'` (mismatch). Returns `reference.substring(0, 0)` which is `""` (Correct).

---

### 🎬 8. Dry Run
Let's trace `strs = ["flower", "flow"]` with reference string `"flower"` (length 6):

#### **Step 0: i = 0**
```text
Pointers: i = 0, char = 'f'
Strings:
  idx0: " f l o w e r "
          ▲
          i (reference)
  idx1: " f l o w "
          ▲
          i
```
* **Comparison**: `strs[1][0]` ("f") === `char` ("f").
* **Decision**: All strings match at position 0. Advance `i`.
* **Next**: `i` becomes 1.

#### **Step 1: i = 1**
```text
Pointers: i = 1, char = 'l'
Strings:
  idx0: " f l o w e r "
            ▲
            i (reference)
  idx1: " f l o w "
            ▲
            i
```
* **Comparison**: `strs[1][1]` ("l") === `char` ("l").
* **Decision**: All strings match at position 1. Advance `i`.
* **Next**: `i` becomes 2.

#### **Step 2: i = 2**
```text
Pointers: i = 2, char = 'o'
Strings:
  idx0: " f l o w e r "
              ▲
              i (reference)
  idx1: " f l o w "
              ▲
              i
```
* **Comparison**: `strs[1][2]` ("o") === `char` ("o").
* **Decision**: All strings match at position 2. Advance `i`.
* **Next**: `i` becomes 3.

#### **Step 3: i = 3**
```text
Pointers: i = 3, char = 'w'
Strings:
  idx0: " f l o w e r "
                ▲
                i (reference)
  idx1: " f l o w "
                ▲
                i
```
* **Comparison**: `strs[1][3]` ("w") === `char` ("w").
* **Decision**: All strings match at position 3. Advance `i`.
* **Next**: `i` becomes 4.

#### **Step 4: i = 4**
```text
Pointers: i = 4, char = 'e'
Strings:
  idx0: " f l o w e r "
                  ▲
                  i (reference)
  idx1: " f l o w "  (length 4)
                  ▲
                  i (Out of bounds!)
```
* **Comparison**: `i` (4) is equal to `strs[1].length` (4) $\rightarrow$ Out of bounds!
* **Decision**: Boundary reached. Return common prefix up to index 4.
* **Slice**: `reference.substring(0, 4)` $\rightarrow$ `"flow"`
* **Final Result**: `"flow"`.
