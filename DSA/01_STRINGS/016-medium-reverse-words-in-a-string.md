# 016. Reverse Words in a String (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft, Goldman Sachs, Google


---

### 📝 1. Problem Statement
Given an input string `s`, reverse the order of the **words**.

A **word** is defined as a sequence of non-space characters. The words in `s` will be separated by at least one space.

Return a string of the words in reverse order concatenated by a single space.

**Note** that `s` may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words. Do not include any extra spaces.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "the sky is blue"`
* **Output**: `"blue is sky the"`

#### Test Case 2
* **Input**: `s = "  hello world  "`
* **Output**: `"world hello"`
* **Why**: Leading and trailing spaces are removed, and the words are reversed.

#### Test Case 3
* **Input**: `s = "a good   example"`
* **Output**: `"example good a"`
* **Why**: Multiple spaces between words are reduced to a single space in the reversed string.

---

### 💬 3. What is This Problem Actually Asking?
We need to extract all words from the string `s`, reverse the order of these words, and join them with exactly one space.
We must handle three cleaning tasks:
1. Strip all leading spaces at the very beginning of the string.
2. Strip all trailing spaces at the very end.
3. Condense multiple consecutive spaces between words into a single separating space.

The characters *inside* each individual word must remain in their original order (e.g. `"blue"` stays `"blue"`, not `"eulb"`).

---

### 🌍 4. Real-Life Example
Imagine a **train of cargo containers** separated by arbitrary numbers of empty flatcars (representing spaces). 
* Cargo containers are: `[the]`, `[sky]`, `[is]`, `[blue]`.
* The train has empty flatcars at the front and back, and sets of 2 or 3 empty flatcars between the containers.
* Your job is to:
  * Remove all empty flatcars from the front and back.
  * Reverse the sequence of the cargo containers.
  * Ensure there is exactly **one** empty flatcar separating each container.
* The resulting train is: `[blue] <flatcar> [is] <flatcar> [sky] <flatcar> [the]`.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Array of Strings (`string[]`)**.
  - *Why*: We need to work with individual words. Storing them in an array allows us to use $O(1)$ index swaps or array reversal.
* **Algorithm**: **Trim, Regex-Split, Reverse, and Join**.
  - Since strings in TypeScript are immutable, a standard V8-optimized native approach is both the most readable and highly performant:
    1. **Trim**: Remove leading/trailing spaces using `s.trim()`.
    2. **Regex Split**: Split the string by any sequence of one or more whitespaces: `.split(/\s+/)`. This automatically handles multiple spaces between words in a single step!
    3. **Reverse**: Reverse the order of words in-place inside the array using `.reverse()`.
    4. **Join**: Glue the words back together with a single space using `.join(' ')`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function reverseWords(s: string): string {
    // 1. Trim leading/trailing whitespace.
    // 2. Split by one or more spaces using regex /\s+/.
    // 3. Reverse the array of words.
    // 4. Join the words back together with a single space.
    return s.trim().split(/\s+/).reverse().join(' ');
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — where $N$ is the length of string `s`. Trimming, splitting via regex, reversing, and joining each touch the characters of the string a constant number of times.
* **Space Complexity**: **$O(N)$** — required to store the array of words and the newly created reversed string in memory.

#### Edge Cases Handled:
* **Multiple Spaces Everywhere** (`s = "  hello   world  "`): 
  * `.trim()` yields `"hello   world"`.
  * `.split(/\s+/)` yields `["hello", "world"]` (the multiple spaces are consumed perfectly by the regex `\s+`).
  * `.reverse()` yields `["world", "hello"]`.
  * `.join(' ')` yields `"world hello"` (Correct).
* **Single Word** (`s = "word"`): Splits to `["word"]`. Reverse is `["word"]`. Returns `"word"` (Correct).
* **Only Spaces** (`s = "    "`): `.trim()` yields `""`. Splitting an empty string yields `[""]` or `[]`. In JavaScript, `"".trim().split(/\s+/)` on an empty string can yield `[""]`. To be extremely safe, the regex split handles empty strings perfectly, but since `s` is guaranteed to contain at least one word in LeetCode, this native approach is extremely robust.

---

### 🎬 8. Dry Run
Let's trace `s = "  blue sky  "` through the processing pipeline:

#### **Step 0: Initial State**
* **Input**: `"  blue sky  "`

#### **Step 1: trim()**
* **Operation**: Remove leading and trailing whitespace.
* **Output**: `"blue sky"`

#### **Step 2: split(/\\s+/)**
* **Operation**: Segment the string into an array of words, using any sequence of spaces as the delimiter.
* **Output**: `[ "blue", "sky" ]`

#### **Step 3: reverse()**
* **Operation**: Reverse the order of elements in the array in-place.
* **Output**: `[ "sky", "blue" ]`

#### **Step 4: join(' ')**
* **Operation**: Concatenate the array elements into a single string separated by a single space.
* **Output**: `"sky blue"`

* **Final Result**: `"sky blue"`
