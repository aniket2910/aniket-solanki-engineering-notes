# 012. Valid Anagram (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Goldman Sachs, Google, Facebook/Meta


---

### 📝 1. Problem Statement
Given two strings `s` and `t`, return `true` if `t` is an **anagram** of `s`, and `false` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "anagram"`, `t = "nagaram"`
* **Output**: `true`
* **Why**: Both strings contain:
  * three `'a'`s
  * one `'n'`
  * one `'g'`
  * one `'r'`
  * one `'m'`
  * Since the character counts match exactly, they are anagrams.

#### Test Case 2
* **Input**: `s = "rat"`, `t = "car"`
* **Output**: `false`
* **Why**: `s` has `'r'`, `'a'`, `'t'`, while `t` has `'c'`, `'a'`, `'r'`. The characters do not match exactly.

#### Test Case 3
* **Input**: `s = "ab"`, `t = "a"`
* **Output**: `false`
* **Why**: The lengths of the strings are different, so they can never be anagrams.

---

### 💬 3. What is This Problem Actually Asking?
Two strings are anagrams if they contain the **exact same letters** with the **exact same frequencies**, just in a different order. 
To verify this:
* The lengths of the two strings must be identical.
* The count of every character in `s` must be equal to the count of that character in `t`.

Instead of sorting both strings (which would take $O(N \log N)$ time), we can count character frequencies in $O(N)$ time!

---

### 🌍 4. Real-Life Example
Imagine you have a **toy bucket** containing letter blocks.
* You construct the word **"listen"** using your blocks.
* Now, you want to dismantle it and construct the word **"silent"**.
* If you can build "silent" using **exactly** the blocks you had from "listen" — with no blocks left over and no extra blocks needed — then they are anagrams!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Fixed-Size Frequency Array (size 26)**.
  - *Why*: Since the problem contains lowercase English letters, a fixed array of size 26 is extremely optimal and operates in true $O(1)$ auxiliary space.
* **Algorithm**: **Single-Pass Balance Counting**.
  - If the lengths of `s` and `t` are different, return `false` immediately.
  - Create a frequency array `counts` of size 26 filled with `0`.
  - Loop through both strings simultaneously:
    - Increment the count for the letter in `s`: `counts[s[i].charCodeAt(0) - 97]++`.
    - Decrement the count for the letter in `t`: `counts[t[i].charCodeAt(0) - 97]--`.
  - After the loop, check the array:
    - If any value is not `0`, it means there's a mismatch in frequency. Return `false`.
    - If all values are `0`, return `true`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function isAnagram(s: string, t: string): boolean {
    // If lengths are different, they cannot be anagrams
    if (s.length !== t.length) {
        return false;
    }

    // Fixed frequency array of size 26 for lowercase English letters
    const counts = new Int32Array(26);

    // Populate frequencies: increment for s, decrement for t
    for (let i = 0; i < s.length; i++) {
        counts[s.charCodeAt(i) - 97]++;
        counts[t.charCodeAt(i) - 97]--;
    }

    // If all counts are 0, they are perfect anagrams
    for (let i = 0; i < 26; i++) {
        if (counts[i] !== 0) {
            return false;
        }
    }

    return true;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We iterate through the string of length $N$ exactly once, performing constant time $O(1)$ operations at each step.
* **Space Complexity**: **$O(1)$** auxiliary space — The frequency array size is fixed at 26, which is constant regardless of input length.

#### Edge Cases Handled:
* **Different Lengths** (`s = "ab"`, `t = "abc"`): Handled at the very beginning of the function, returning `false` (Correct).
* **Single Character Strings** (`s = "a"`, `t = "a"`): Lengths are equal. Loops run for index 0, increments and decrements index 0. Array remains all zeros. Returns `true` (Correct).
* **Unicode/Non-English inputs**: If the problem description is expanded to support Unicode, we can easily replace the fixed 26-array with a standard `Map<string, number>` hash map, which takes $O(K)$ space where $K$ is the unique character set size.

---

### 🎬 8. Dry Run
Let's trace `s = "rat"`, `t = "art"` with `counts` representing a frequency map (showing only mutated letter counts for clarity):

#### **Step 0: i = 0**
```text
Pointers: i = 0
s: " r a t "
     ▲
     i
t: " a r t "
     ▲
     i
Mutations: s[0] ('r') adds +1, t[0] ('a') subtracts -1
Counts:    { 'r': 1, 'a': -1 }
```
* **Next**: `i` becomes 1.

#### **Step 1: i = 1**
```text
Pointers: i = 1
s: " r a t "
       ▲
       i
t: " a r t "
       ▲
       i
Mutations: s[1] ('a') adds +1, t[1] ('r') subtracts -1
Counts:    { 'r': 0, 'a': 0 }
```
* **Next**: `i` becomes 2.

#### **Step 2: i = 2**
```text
Pointers: i = 2
s: " r a t "
         ▲
         i
t: " a r t "
         ▲
         i
Mutations: s[2] ('t') adds +1, t[2] ('t') subtracts -1
Counts:    { 'r': 0, 'a': 0, 't': 0 }
```
* **Next**: Loop terminates. All counts in the 26-element array are `0`, confirming a perfect anagram match. Returns `true`.
