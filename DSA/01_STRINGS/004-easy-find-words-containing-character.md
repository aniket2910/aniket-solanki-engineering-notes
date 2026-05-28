# 004. Find Words Containing Character (Easy)

---

### 📝 1. Problem Statement
You are given a **0-indexed** array of strings `words` and a character `x`.

Return *an array of indices representing the words that contain the character `x`*.

Note that the returned array may be in **any order**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `words = ["leet","code"]`, `x = "e"`
* **Output**: `[0,1]`
* **Why**: `"e"` occurs in `"leet"` (index 0) and `"code"` (index 1).

#### Test Case 2
* **Input**: `words = ["abc","bcd","aaaa","cbc"]`, `x = "z"`
* **Output**: `[]`
* **Why**: `"z"` does not occur in any of the words.

---

### 💬 3. What is This Problem Actually Asking?
We have an array of words. We need to check each word one-by-one:
* If the word contains the target character `x` at least once, we write down the index of that word in our results.
* If it doesn't, we skip it.

---

### 🌍 4. Real-Life Example
Imagine a **post officer sorting letters by destination**:
* You are given a box of letters addressed to different cities: `["Seattle", "Portland", "Chicago"]`.
* You are told to find all cities whose names contain the letter `"e"`.
* You examine each envelope sequentially:
  * "Seattle": Contains "e" $\rightarrow$ write down its box index `0`.
  * "Portland": Does not contain "e" $\rightarrow$ skip.
  * "Chicago": Does not contain "e" $\rightarrow$ skip.
* You return `[0]`.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Array** (input list of strings and output index array).
* **Algorithm**: **Linear Array Scanning & String Search**.
  * *Why*: We iterate through each string in the array. For each string, we check if character `x` is present. We can do this efficiently using the built-in `.indexOf()` or `.includes()` methods in TypeScript, which runs in linear time relative to the word length.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function findWordsContaining(words: string[], x: string): number[] {
    const result: number[] = [];

    for (let i = 0; i < words.length; i++) {
        // .indexOf() returns -1 if the character is not found
        if (words[i].indexOf(x) !== -1) {
            result.push(i);
        }
    }

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N \cdot L)$** — We iterate through all $N$ words. For each word, we search for character `x` which takes at most $O(L)$ time, where $L$ is the maximum length of a word.
* **Space Complexity**: **$O(1)$** — If we exclude the memory used to store the output `result` array, the algorithm requires no auxiliary space.

#### Edge Cases Handled:
* **No Words Match** (`words = ["abc"]`, `x = "z"`): The `.indexOf("z")` returns `-1`. The loop finishes, returning `[]` (Correct).
* **All Words Match** (`words = ["a", "a"]`, `x = "a"`): Loop finds `"a"` in all elements. Returns `[0, 1]` (Correct).
