# 026. Find the Index of the First Occurrence in a String (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Apple, Goldman Sachs
>
> **Interview Tag**: 🔥 **KMP SUBSTRING SEARCH** - Standard string matching problem. Ideal for demonstrating optimal two-pointer string matching using precomputed prefix backtracks.

---

### 📝 1. Problem Statement
Given two strings `needle` and `haystack`, return the index of the first occurrence of `needle` in `haystack`, or `-1` if `needle` is not part of `haystack`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `haystack = "sadbutsad"`, `needle = "sad"`
* **Output**: `0`
* **Why**: `"sad"` occurs at index 0 and 6. The first occurrence is at index 0.

#### Test Case 2
* **Input**: `haystack = "leetcode"`, `needle = "leeto"`
* **Output**: `-1`
* **Why**: `"leeto"` does not occur in `"leetcode"`, so we return `-1`.

---

### 💬 3. What is This Problem Actually Asking?
Find the starting index where the string `needle` is completely contained within `haystack` as a contiguous substring. If it does not exist, return `-1`.

---

### 🌍 4. Real-Life Example
Imagine you are scanning a long line of books on a library shelf (`haystack = "historysciencebiographyphysics"`) looking for the first book on physics (`needle = "physics"`). You scan the books from left to right. When you find the first matching section, you record the shelf position where it starts.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing sliding window character matching vs. the optimal Knuth-Morris-Pratt (KMP) linear scan:

#### Approach 1: Sliding Window (Brute Force Simulation)
We slide a window of size `M = needle.length` across `haystack` of size `N = haystack.length`.
* We check every start index `i` from `0` to `N - M`.
* At each position, we compare the substring `haystack.substring(i, i + M)` with `needle`.
* **Pros**: Simple, highly readable, and straightforward to write.
* **Cons**: Slower worst-case runtime of $O((N - M) \cdot M)$ due to repeated back-tracking character checks.

#### Approach 2: Knuth-Morris-Pratt (KMP) Algorithm (Optimal)
We use the KMP algorithm to search in linear time.
* We first build the `lps` (Longest Proper Prefix which is also a Suffix) lookup table for `needle` in $O(M)$ time.
* We then scan `haystack` and `needle` using two pointers `i` and `j`.
* When a mismatch occurs between `haystack[i]` and `needle[j]`, instead of resetting the search pointer in `haystack` back to `i - j + 1`, KMP backtracks the `needle` pointer `j` to `lps[j - 1]`.
* *Algorithm Reference*: Deep-dive explanation at the [KMP Prefix Table Blueprint](../ALGORITHMS/kmp-prefix-table.md).
* **Pros**: Optimal linear $O(N + M)$ runtime. Prevents redundant scans of characters in `haystack`.
* **Cons**: More complex pointer state updates and requires auxiliary $O(M)$ memory for the prefix table.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run the optimal **KMP Algorithm (Approach 2)** with `haystack = "sadbutsad"` and `needle = "sad"`.

#### **Step 0: Build LPS Table for needle ("sad")**
* `needle = "sad"`, `M = 3`.
* No prefix-suffix matches occur. `lps = [0, 0, 0]`.

#### **Step 1: Initial State (Scan start)**
```text
Pointers: i = 0, j = 0
haystack: [ s,  a,  d,  b,  u,  t,  s,  a,  d ]
            idx0 idx1 idx2 idx3 idx4 idx5 idx6 idx7 idx8
Ptrs:       ▲
            i
needle:   [ s,  a,  d ]
            idx0 idx1 idx2
Ptrs:       ▲
            j
```
* **State check**: `haystack[0]` (`'s'`) === `needle[0]` (`'s'`). Match!
* **Updates**: `i++`, `j++` (`i = 1`, `j = 1`).

#### **Step 2: Matching Characters**
```text
Pointers: i = 1, j = 1
haystack: [ s,  a,  d,  b,  u,  t,  s,  a,  d ]
                 ▲
                 i
needle:   [ s,  a,  d ]
                 ▲
                 j
```
* **State check**: `haystack[1]` (`'a'`) === `needle[1]` (`'a'`). Match!
* **Updates**: `i++`, `j++` (`i = 2`, `j = 2`).

#### **Step 3: Matching Third Character**
```text
Pointers: i = 2, j = 2
haystack: [ s,  a,  d,  b,  u,  t,  s,  a,  d ]
                     ▲
                     i
needle:   [ s,  a,  d ]
                     ▲
                     j
```
* **State check**: `haystack[2]` (`'d'`) === `needle[2]` (`'d'`). Match!
* **Updates**: `i++`, `j++` (`i = 3`, `j = 3`).
* **Condition check**: `j === needle.length` (3). We found a complete match!
* **Result**: Return starting index `i - j = 3 - 3 = 0`.

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function strStr(haystack: string, needle: string): number {
    // ==========================================
    // 1st Approach: Sliding Window Search (O(N * M))
    // ==========================================
    /*
    const n = haystack.length;
    const m = needle.length;

    if (m === 0) return 0;
    if (m > n) return -1;

    for (let i = 0; i <= n - m; i++) {
        if (haystack.substring(i, i + m) === needle) {
            return i;
        }
    }
    return -1;
    */

    // ==========================================
    // 2nd Approach: KMP Substring Matcher (Optimal O(N + M))
    // ==========================================
    const n = haystack.length;
    const m = needle.length;

    if (m === 0) return 0;
    if (m > n) return -1;

    // 1. Build the LPS Table
    const lps = new Array(m).fill(0);
    let len = 0;
    let i = 1;

    while (i < m) {
        if (needle[i] === needle[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }

    // 2. Perform Substring Search using LPS Table
    let haystackIdx = 0;
    let needleIdx = 0;

    while (haystackIdx < n) {
        if (haystack[haystackIdx] === needle[needleIdx]) {
            haystackIdx++;
            needleIdx++;

            if (needleIdx === m) {
                // Found match! Return start index
                return haystackIdx - needleIdx;
            }
        } else {
            if (needleIdx !== 0) {
                // Backtrack needle pointer using LPS table
                needleIdx = lps[needleIdx - 1];
            } else {
                haystackIdx++;
            }
        }
    }

    return -1;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Sliding Window | Approach 2: KMP Algorithm |
| :--- | :--- | :--- |
| **Time Complexity** | **$O((N - M + 1) \cdot M)$** — In the worst-case (like `haystack = "aaaaaaab"`, `needle = "aab"`), we scan characters repeatedly. | **$O(N + M)$** — Single pass over `haystack` and a single pass to build the prefix table. |
| **Space Complexity** | **$O(1)$** — Constant variables, or $O(M)$ to allocate substring checks. | **$O(M)$** — Constant search pointers, plus $O(M)$ memory to store the `lps` table. |

#### Edge Cases Handled:
* **Empty needle** (`needle = ""`): Returns `0` immediately per LeetCode requirements (Correct).
* **needle longer than haystack** (`needle = "aaaa"`, `haystack = "a"`): Guard clause catches this immediately and returns `-1` (Correct).
* **Mismatch after partial matches** (`haystack = "mississippi"`, `needle = "issip"`): KMP uses `lps` to gracefully backtrack pointers without missing correct intermediate starting candidates (Correct).
