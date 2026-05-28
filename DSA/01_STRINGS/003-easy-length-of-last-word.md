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

---

### 🎬 8. Dry Run
Let's trace `s = "fly me  "` (length 8):

#### **Step 0: Initial State**
```text
Pointers: p = 7, length = 0
String:   " f l y   m e     "
           0 1 2 3 4 5 6 7
Pointer:                 ▲
                         p
```
* **Condition**: `p >= 0 && s[p] === ' '` (s[7] = ' ' is true)
* **Decision**: Trailing space detected. Decrement `p`.
* **Next**: `p` becomes 6.

#### **Step 1: p = 6**
```text
Pointers: p = 6, length = 0
String:   " f l y   m e     "
           0 1 2 3 4 5 6 7
Pointer:               ▲
                       p
```
* **Condition**: `p >= 0 && s[p] === ' '` (s[6] = ' ' is true)
* **Decision**: Trailing space detected. Decrement `p`.
* **Next**: `p` becomes 5.

#### **Step 2: p = 5**
```text
Pointers: p = 5, length = 0
String:   " f l y   m e     "
           0 1 2 3 4 5 6 7
Pointer:             ▲
                     p
```
* **Condition**: `p >= 0 && s[p] === ' '` (s[5] = 'e' is false). Loop 1 terminates!
* **Next**: Move to counting characters of the last word.

#### **Step 3: Counting - p = 5**
```text
Pointers: p = 5, length = 0
String:   " f l y   m e     "
           0 1 2 3 4 5 6 7
Pointer:             ▲
                     p
```
* **Condition**: `p >= 0 && s[p] !== ' '` (s[5] = 'e' is true)
* **Decision**: Word character found. Increment `length` and decrement `p`.
* **Next**: `length` becomes 1, `p` becomes 4.

#### **Step 4: Counting - p = 4**
```text
Pointers: p = 4, length = 1
String:   " f l y   m e     "
           0 1 2 3 4 5 6 7
Pointer:           ▲
                   p
```
* **Condition**: `p >= 0 && s[p] !== ' '` (s[4] = 'm' is true)
* **Decision**: Word character found. Increment `length` and decrement `p`.
* **Next**: `length` becomes 2, `p` becomes 3.

#### **Step 5: Counting - p = 3**
```text
Pointers: p = 3, length = 2
String:   " f l y   m e     "
           0 1 2 3 4 5 6 7
Pointer:         ▲
                 p
```
* **Condition**: `p >= 0 && s[p] !== ' '` (s[3] = ' ' is false). Loop 2 terminates!
* **Result**: Returns `length = 2` (length of last word `"me"`).
