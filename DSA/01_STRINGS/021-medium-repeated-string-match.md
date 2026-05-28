# 021. Repeated String Match (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **MUST SOLVE** - Highly popular in interviews for testing string replication boundaries and advanced string search algorithms like **Rabin-Karp**.

---

### 📝 1. Problem Statement
Given two strings `a` and `b`, return the *minimum number of times you should repeat string `a` so that string `b` is a substring of it*. If it is impossible for `b` to be a substring of `a` after repeating it, return `-1`.

**Notice**: string `"abc"` repeated 0 times is `""`, repeated 1 time is `"abc"`, repeated 2 times is `"abcabc"`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `a = "abcd"`, `b = "cdabcdab"`
* **Output**: `3`
* **Why**: After repeating `a` three times, we get `"abcdabcdabcd"`. `b` is fully contained inside it (starting at index 2).

#### Test Case 2
* **Input**: `a = "a"`, `b = "aa"`
* **Output**: `2`

#### Test Case 3
* **Input**: `a = "abc"`, `b = "wxyz"`
* **Output**: `-1`

---

### 💬 3. What is This Problem Actually Asking?
We want to find the minimum repetitions of `a` such that `b` exists somewhere inside the concatenated result.

Let's think about the length requirements:
1. To contain `b` as a substring, the repeated version of `a` must have a length of **at least** `b.length`.
2. Let's repeat `a` just enough times so that the resulting string is at least as long as `b`. Let's call this count $C$.
3. Because the substring `b` might be offset (e.g., starting near the end of one copy of `a` and ending inside a later copy of `a`), it might not fit inside $C$ repetitions.
4. However, we would only ever need at most **one more copy** of `a` (making it $C + 1$ repetitions) to handle any possible start offset! 
   * If it doesn't fit in $C$ or $C + 1$ repetitions, then it is mathematically impossible, and we return `-1`.

---

### 🌍 4. Real-Life Example
Imagine wrapping a **cylindrical tube with repeating patterned wallpaper**:
* Your wallpaper pattern is `a = "abcd"` (length 4).
* You want to cover a specific target text `b = "cdabcdab"` (length 8).
* First, you roll out enough wallpaper so that its length is at least the length of the target text. This takes exactly 2 patterns: `"abcdabcd"` (length 8).
* You try to overlay it, but due to the starting offset, the target `"cdabcdab"` doesn't fit in 2 copies (it overflows the end).
* You pull out **exactly one more pattern** (making it 3 patterns total: `"abcdabcdabcd"`). Now you slide it, and it fits perfectly!
* If it still didn't fit after adding that one extra pattern, the wallpaper pattern is completely incompatible, and you return `-1`.

---

### 🛠️ 5. Data Structure & Algorithms Used

To present a highly intuitive, human-written coding progression to an interviewer, we demonstrate two different approaches to solve the substring search part:

#### Approach 1: Simulation via Standard String API (Intuitive)
We build the minimum length repeated string, and then use the language's native highly-optimized `.includes()` method to check for `b`.
* **Pros**: Clean, simple, easy to write in 5 minutes under pressure.
* **Cons**: Relies on built-in API functions (the interviewer might ask you to implement the search yourself).

#### Approach 2: Rabin-Karp Rolling Hash Algorithm (Highly Recommended)
We implement the **Rabin-Karp pattern searching algorithm**.
* **What**: It calculates a hash value of the pattern `b`, and then slides a window of size `b.length` across our repeated string, computing a **rolling hash** in $O(1)$ time at each step.
* **Why**: By choosing a `base` of `26` (since only lowercase English letters are used) and a prime modulus `1e9 + 7`, we slide the window seamlessly, performing a double-check when hashes match to prevent collisions. Excellent for proving you understand the underlying mathematics of string searching!

---

### 💻 6. Optimal Codes (TypeScript)

Here is a human-written solution showing both approaches. Approach 1 is shown in comments to show a clear progression of thought!

```typescript
// ==========================================
// 1st Approach: Simple Simulation & Native Search
// ==========================================
/*
function repeatedStringMatch(a: string, b: string): number {
    let count = 1;
    let repeatedStr = a;

    while (repeatedStr.length < b.length) {
        repeatedStr += a;
        count++;
    }

    if (repeatedStr.includes(b)) {
        return count;
    }

    if ((repeatedStr + a).includes(b)) {
        return count + 1;
    }

    return -1;
}
*/

// ==========================================
// 2nd Approach: Rabin-Karp Rolling Hash Parser
// ==========================================
function repeatedStringMatch(a: string, b: string): number {
    let count = 1;
    let text = a;

    // 1. Repeat string 'a' until it is at least as long as 'b'
    while (text.length < b.length) {
        text += a;
        count++;
    }

    // Check if 'b' is a substring of current repeated text
    if (rabinKarp(text, b)) {
        return count;
    }

    // Replicate one more time to handle offset shifts
    text += a;
    count++;

    if (rabinKarp(text, b)) {
        return count;
    }
    
    return -1;
}

function rabinKarp(text: string, pattern: string): boolean {
    let n = text.length;
    let m = pattern.length;
    let base = 26; // Because only lowercase English letters are used
    let mod = 1e9 + 7;
    if (m === 0) return true;
    if (m > n) return false;

    let windowHash = 0;
    let patternHash = 0;

    // Compute initial hashes for pattern and first window
    for (let i = 0; i < m; i++) {
        windowHash = (windowHash * base + text.charCodeAt(i)) % mod;
        patternHash = (patternHash * base + pattern.charCodeAt(i)) % mod;
    }

    let power = 1;
    for (let i = 0; i < m - 1; i++) {
        power = (power * base) % mod;
    }
    
    // Algorithm:- Sliding window
    for (let i = 0; i <= (n - m); i++) {
        if ((patternHash === windowHash) && (pattern === text.substring(i, i + m))) {
            return true;
        }
        if (i < n - m) {
            windowHash = (windowHash - (power * text.charCodeAt(i)) % mod + mod) % mod;
            windowHash = (windowHash * base + text.charCodeAt(i + m)) % mod;
        }
    }
    
    return false;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**:
  - **Approach 1 (Native Search)**: **$O(N + M)$** average.
  - **Approach 2 (Rabin-Karp)**: **$O(N + M)$** average, where $N$ is the length of the repeated text and $M$ is the length of the pattern.
* **Space Complexity**:
  - **Approach 1 (Native Search)**: **$O(N + M)$** to hold the repeated string in memory.
  - **Approach 2 (Rabin-Karp)**: **$O(N + M)$** to hold the repeated string, with only $O(1)$ auxiliary memory.

#### Edge Cases Handled:
* **`b` is smaller than `a`** (`a = "abcd"`, `b = "bc"`):
  - The `while` loop doesn't run. `text` has length 4, which is $\ge$ `b.length` (2).
  - Returns `1` after checking index match (Correct).
* **No Match Possible** (`a = "abc"`, `b = "xyz"`): Returns `-1` after trying both replication bounds (Correct).

---

### 🎬 8. Dry Run
Let's trace `repeatedStringMatch(a = "abcd", b = "cdabcdab")` step-by-step:

#### **Phase 1: Replicating to Minimum Boundary**
* **Initial State**: `text = "abcd"` (length 4), `count = 1`.
* **Condition Check**: `text.length` (4) is less than `b.length` (8).
* **Action**: Append `a` to `text`. `text` becomes `"abcdabcd"` (length 8), `count` becomes `2`.
* **Condition Check**: `text.length` (8) is no longer less than `b.length` (8). Exit loop.

#### **Phase 2: Checking Substring Match (Repetition Count = 2)**
* We invoke `rabinKarp(text = "abcdabcd", pattern = "cdabcdab")`:
  - Since `text` and `pattern` are identical in length but represent different sequences (`"abcdabcd"` !== `"cdabcdab"`), this returns `false`.

#### **Phase 3: Handling Offset Shifts (Repetition Count = 3)**
* **Action**: Append `a` one more time. `text` becomes `"abcdabcdabcd"` (length 12), `count` becomes `3`.
* We invoke `rabinKarp(text = "abcdabcdabcd", pattern = "cdabcdab")`:
  - The pattern `"cdabcdab"` (length 8) is matched starting at index 2 of `text`.
```text
text:    " a b c d a b c d a b c d "
           0 1 2 3 4 5 6 7 8 9 10 11
b:           " c d a b c d a b "
               ▲             ▲
             start          end
```
  - `rabinKarp` returns `true`.
* **Final Result**: Returns `count = 3`.
