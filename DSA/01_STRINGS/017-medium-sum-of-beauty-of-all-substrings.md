# 017. Sum of Beauty of All Substrings (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon


---

### 📝 1. Problem Statement
The **beauty** of a string is the difference in frequency between the most frequent and least frequent characters.
* For example, the beauty of `"abaacc"` is $3 - 1 = 2$ because `'a'` occurs 3 times, while `'b'` occurs 1 time.

Given a string `s`, return *the sum of beauty of all its substrings*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "aabcb"`
* **Output**: `5`
* **Why**: The substrings with a beauty greater than 0 are:
  * `"aab"` $\rightarrow$ beauty = $2 - 1 = 1$ (freq of `'a'` is 2, `'b'` is 1)
  * `"aabc"` $\rightarrow$ beauty = $2 - 1 = 1$ (freq of `'a'` is 2, `'b'` and `'c'` are 1)
  * `"aabcb"` $\rightarrow$ beauty = $3 - 1 = 2$ (freq of `'a'` is 2, `'b'` is 3, `'c'` is 1)
  * `"abcb"` $\rightarrow$ beauty = $2 - 1 = 1$ (freq of `'b'` is 2, `'a'` and `'c'` are 1)
  * Sum of beauties = $1 + 1 + 2 + 1 = 5$.

#### Test Case 2
* **Input**: `s = "aabcba"`
* **Output**: `17`

---

### 💬 3. What is This Problem Actually Asking?
We need to generate every possible contiguous substring of `s`, determine the frequency of all characters present in that substring, find the difference between the highest and lowest non-zero frequency, and sum these differences up.

For a string of length $N$:
* There are $O(N^2)$ possible substrings.
* If we count frequencies from scratch for each substring, it would take $O(N^3)$ time, which is too slow.
* **Optimization**: We can expand substrings incrementally! If we have the character counts for substring `s[i...j]`, we can get the counts for `s[i...j+1]` in $O(1)$ time by simply adding one to the count of character `s[j+1]`.

---

### 🌍 4. Real-Life Example
Imagine you are a **mineral gem inspector studying core samples**:
* You have a cylindrical rock sample containing embedded gems: `[a, a, b, c, b]`.
* You want to evaluate the quality of every possible contiguous slice of this rock.
* For each slice, you count the gems. The "beauty score" is the count of the most common gem minus the count of the rarest gem (ignoring gems that aren't in the slice at all).
* You slice the rock in all possible ways, calculate the beauty score of each slice, and add them up to find the total value of the rock!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Fixed-Size Frequency Array (size 26)**.
  - *Why*: Bounded by the 26 lowercase English letters. It takes $O(1)$ space and allows $O(1)$ frequency updates.
* **Algorithm**: **Nested Substring Expansion & Running Min/Max Scan**.
  - Initialize `totalBeauty = 0`.
  - Loop `i` from `0` to `s.length - 1` (starting position of substring):
    - Initialize a fresh `freq` array of size 26 filled with `0`s.
    - Loop `j` from `i` to `s.length - 1` (ending position of substring):
      - Increment the count of the character `s[j]`: `freq[s.charCodeAt(j) - 97]++`.
      - Calculate the beauty of `s[i...j]`:
        - Loop through `freq` array (size 26):
          - Find `max` frequency.
          - Find `min` frequency (only among indices where `freq[k] > 0` to ignore characters that are not in the current substring).
        - Add `(max - min)` to `totalBeauty`.
  - Return `totalBeauty`.

This runs in $O(26 \cdot N^2) = O(N^2)$ time, which is optimal and runs well within LeetCode's time limits for $N \le 500$.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function beautySum(s: string): boolean | number {
    let totalBeauty = 0;

    for (let i = 0; i < s.length; i++) {
        // Frequency array for lowercase English letters
        const freq = new Int32Array(26);

        for (let j = i; j < s.length; j++) {
            // Increment count for the current character s[j]
            freq[s.charCodeAt(j) - 97]++;

            // Find min and max frequencies in O(26) time
            let maxVal = 0;
            let minVal = Infinity;

            for (let k = 0; k < 26; k++) {
                const count = freq[k];
                if (count > 0) {
                    if (count > maxVal) {
                        maxVal = count;
                    }
                    if (count < minVal) {
                        minVal = count;
                    }
                }
            }

            // Sum up the beauty if we have a valid slice
            if (maxVal > minVal) {
                totalBeauty += (maxVal - minVal);
            }
        }
    }

    return totalBeauty;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N^2)$** — We have nested loops generating $O(N^2)$ substrings. Inside the inner loop, we scan the fixed-size 26 array, which takes a constant $O(26) = O(1)$ operations.
* **Space Complexity**: **$O(1)$** auxiliary space — The frequency array is fixed at size 26 and is re-used in each outer iteration.

#### Edge Cases Handled:
* **All Same Characters** (`s = "aaaa"`): Every substring contains only `'a'`s. The `minVal` and `maxVal` will always be equal. `maxVal > minVal` is never true, beauty is `0`. Returns `0` (Correct).
* **Length Less Than 3** (`s = "ab"`): Substrings are `"a"`, `"b"`, `"ab"`. None have a beauty > 0. Returns `0` (Correct).
* **Short Strings**: The loops terminate naturally and handle small inputs without indexing issues.

---

### 🎬 8. Dry Run
Let's trace `s = "aab"` (length 3) with `totalBeauty = 0`:

#### **Outer Loop: i = 0 (Substrings starting with s[0] = 'a')**
* **`j = 0` (`s[0...0]` = "a")**:
  - `freq['a']` becomes `1`.
  - Non-zero frequencies: `{'a': 1}` $\rightarrow$ `maxVal = 1`, `minVal = 1`.
  - `maxVal > minVal` is false. `totalBeauty` remains `0`.
* **`j = 1` (`s[0...1]` = "aa")**:
  - `freq['a']` becomes `2`.
  - Non-zero frequencies: `{'a': 2}` $\rightarrow$ `maxVal = 2`, `minVal = 2`.
  - `maxVal > minVal` is false. `totalBeauty` remains `0`.
* **`j = 2` (`s[0...2]` = "aab")**:
  - `freq['b']` becomes `1`.
  - Non-zero frequencies: `{'a': 2, 'b': 1}` $\rightarrow$ `maxVal = 2`, `minVal = 1`.
  - `maxVal > minVal` is true! `totalBeauty += (2 - 1)` $\rightarrow$ `totalBeauty` becomes `1`.

#### **Outer Loop: i = 1 (Substrings starting with s[1] = 'a')**
* **`j = 1` (`s[1...1]` = "a")**:
  - `freq['a']` becomes `1`.
  - Non-zero frequencies: `{'a': 1}` $\rightarrow$ `maxVal = 1`, `minVal = 1`.
  - `totalBeauty` remains `1`.
* **`j = 2` (`s[1...2]` = "ab")**:
  - `freq['b']` becomes `1`.
  - Non-zero frequencies: `{'a': 1, 'b': 1}` $\rightarrow$ `maxVal = 1`, `minVal = 1`.
  - `totalBeauty` remains `1`.

#### **Outer Loop: i = 2 (Substrings starting with s[2] = 'b')**
* **`j = 2` (`s[2...2]` = "b")**:
  - `freq['b']` becomes `1`.
  - Non-zero frequencies: `{'b': 1}` $\rightarrow$ `maxVal = 1`, `minVal = 1`.
  - `totalBeauty` remains `1`.

* **Final Result**: Returns `totalBeauty = 1`.
