# 003. Length of Last Word (Easy)

---

### 📝 1. Problem Statement
Given a string `s` consisting of words and spaces, return *the length of the last word in the string*.

A **word** is a maximal substring consisting of non-space characters only.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "Hello World"`
* **Output**: `5`
* **Why**: The last word is `"World"` which has length `5`.

#### Test Case 2
* **Input**: `s = "   fly me   to   the moon  "`
* **Output**: `4`
* **Why**: The last word is `"moon"` which has length `4`.

#### Test Case 3
* **Input**: `s = "luffy is still joyboy"`
* **Output**: `6`
* **Why**: The last word is `"joyboy"` which has length `6`.

---

### 💬 3. What is This Problem Actually Asking?
We need to find the length of the very last word in a string.
* A string can have trailing spaces at the end (e.g. `"moon  "`). We must ignore/skip these spaces.
* Once we bypass the trailing spaces, we count how many characters form the last word until we hit another space or reach the beginning of the string.

---

### 🌍 4. Real-Life Example
Think of a **train entering a tunnel backwards**:
* You are standing at the tunnel exit watching the train pull in caboose-first.
* Before the train cars appear, there is a gap of empty air (trailing spaces). You wait and ignore it.
* Once the first physical train car (`last word`) appears, you count the number of windows/sections on this car.
* As soon as you hit the coupling gap (space) between this car and the next one, you stop counting. The count is the length of the last car!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: None (scalar pointer integers).
* **Algorithm**: **Reverse Linear Scan (Backwards Pointer)**.
  * *Why*: Scanning from left-to-right requires parsing the entire string and repeatedly storing word lengths. Scanning **right-to-left (backwards)** allows us to immediately locate the last word in $O(1)$ startup time, making the process highly efficient.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function lengthOfLastWord(s: string): number {
    let p: number = s.length - 1;
    let length: number = 0;

    // Step 1: Skip trailing spaces from the back
    while (p >= 0 && s[p] === ' ') {
        p--;
    }

    // Step 2: Count characters of the last word
    while (p >= 0 && s[p] !== ' ') {
        length++;
        p--;
    }

    return length;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — In the worst case (no spaces), we scan the entire string of length $N$ once. In average cases, we only scan the last word, taking $O(L)$ where $L$ is the length of the last word.
* **Space Complexity**: **$O(1)$** — We use only constant-sized pointer variables (`p`, `length`).

#### Edge Cases Handled:
* **Single Word with No Spaces** (`s = "word"`):
  * No trailing spaces.
  * The second loop counts all characters and returns `4` (Correct).
* **String of Only Spaces** (`s = "    "`):
  * The first loop runs until `p` becomes `-1`.
  * The second loop does not run. Returns `0` (Correct).
