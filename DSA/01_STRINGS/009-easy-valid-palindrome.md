# 009. Valid Palindrome (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Facebook/Meta, Microsoft, Amazon, Google


---

### 📝 1. Problem Statement
A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "A man, a plan, a canal: Panama"`
* **Output**: `true`
* **Why**: After cleaning and converting to lowercase, the string is `"amanaplanacanalpanama"`, which reads the same forward and backward.

#### Test Case 2
* **Input**: `s = "race a car"`
* **Output**: `false`
* **Why**: After cleaning, the string is `"raceacar"`, which is not a palindrome (the "e" and "a" near the middle do not match).

#### Test Case 3
* **Input**: `s = " "`
* **Output**: `true`
* **Why**: After removing non-alphanumeric characters, it becomes an empty string `""`. An empty string reads the same forward and backward, so it is a valid palindrome.

---

### 💬 3. What is This Problem Actually Asking?
We need to determine if a string reads the same from left-to-right as it does from right-to-left. 
However, before comparing, we must **ignore character casing** (treat 'A' and 'a' as identical) and **completely ignore non-alphanumeric characters** (spaces, commas, punctuation, colons, etc.).

Instead of rebuilding a new cleaned string (which would consume extra memory), we should ideally check it **in-place** to achieve $O(1)$ auxiliary space complexity!

---

### 🌍 4. Real-Life Example
Imagine a row of people holding cards with letters or punctuation on them. You want to see if the message is symmetrical:
* You start two observers: one on the far left, and one on the far right.
* If an observer sees a person holding a punctuation mark or a blank card, that observer simply moves to the next person.
* Once both observers are pointing to actual letters or numbers, they yell out their character (ignoring whether it's capitalized).
* If the characters match, they both take a step closer to the center and repeat.
* If they ever find a mismatch, they stop and declare "Not symmetrical!" If they meet in the middle without any mismatches, it is perfectly symmetrical!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: No extra data structure is needed; we operate directly on the input string `s`.
* **Algorithm**: **In-Place Two-Pointer Scan**.
  - Initialize two pointers: `left = 0` and `right = s.length - 1`.
  - While `left < right`:
    1. If `s[left]` is not alphanumeric, increment `left` and continue.
    2. If `s[right]` is not alphanumeric, decrement `right` and continue.
    3. If both are alphanumeric, convert them to lowercase and compare:
       - If they don't match, return `false`.
       - If they match, increment `left` and decrement `right`.
  - If the loop finishes without returning `false`, return `true`.

We check if a character is alphanumeric using an optimized helper function based on character codes.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function isPalindrome(s: string): boolean {
    let left = 0;
    let right = s.length - 1;

    // Helper function to check if a character is alphanumeric
    const isAlphanumeric = (char: string): boolean => {
        const code = char.charCodeAt(0);
        return (
            (code >= 48 && code <= 57) ||   // '0' - '9'
            (code >= 65 && code <= 90) ||   // 'A' - 'Z'
            (code >= 97 && code <= 122)     // 'a' - 'z'
        );
    };

    while (left < right) {
        // Skip non-alphanumeric characters from the left
        if (!isAlphanumeric(s[left])) {
            left++;
            continue;
        }

        // Skip non-alphanumeric characters from the right
        if (!isAlphanumeric(s[right])) {
            right--;
            continue;
        }

        // Compare characters in a case-insensitive manner
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }

        left++;
        right--;
    }

    return true;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We scan the string of length $N$ at most once. Each character is visited by either the `left` or `right` pointer at most once.
* **Space Complexity**: **$O(1)$** — We do not allocate any new arrays or strings; we only store a few pointer variables.

#### Edge Cases Handled:
* **Empty or Whitespace-only Strings** (`s = "   "`): The pointers will bypass all spaces and meet in the middle. The loop terminates safely, returning `true` (Correct).
* **No Alphanumeric Characters** (`s = ".,;:"`): Handled perfectly; both pointers will cross each other without matching, returning `true` (Correct).
* **String with Numbers and Letters** (`s = "0P"`): Lowercasing `'0'` is `'0'` and lowercasing `'P'` is `'p'`. They don't match, returning `false` (Correct).

---

### 🎬 8. Dry Run
Let's trace `s = "a, b a"` (length 6) with `left = 0`, `right = 5`:

#### **Step 0: Initial State**
```text
Pointers: left = 0, right = 5
String:   " a   ,       b       a "
            0   1   2   3   4   5
Pointers:   ▲                   ▲
          left                right
```
* **Comparison**: `s[left]` ("a") and `s[right]` ("a") are both alphanumeric.
* **Comparison**: `"a".toLowerCase() === "a".toLowerCase()` (Match!).
* **Decision**: Advance both pointers. `left` becomes 1, `right` becomes 4.

#### **Step 1: left = 1, right = 4**
```text
Pointers: left = 1, right = 4
String:   " a   ,       b       a "
            0   1   2   3   4   5
Pointers:       ▲           ▲
              left        right
```
* **Comparison**: `s[left]` (",") is not alphanumeric!
* **Decision**: Skip character from the left. `left` becomes 2.

#### **Step 2: left = 2, right = 4**
```text
Pointers: left = 2, right = 4
String:   " a   ,       b       a "
            0   1   2   3   4   5
Pointers:           ▲       ▲
                  left    right
```
* **Comparison**: `s[left]` (" ") is not alphanumeric!
* **Decision**: Skip character from the left. `left` becomes 3.

#### **Step 3: left = 3, right = 4**
```text
Pointers: left = 3, right = 4
String:   " a   ,       b       a "
            0   1   2   3   4   5
Pointers:               ▲   ▲
                      left right
```
* **Comparison**: `s[left]` (" ") is not alphanumeric!
* **Decision**: Skip character from the left. `left` becomes 4.

#### **Step 4: left = 4, right = 4**
* **Next**: `left` (4) is no longer `< right` (4). Loop terminates.
* **Final Result**: Returns `true`.
