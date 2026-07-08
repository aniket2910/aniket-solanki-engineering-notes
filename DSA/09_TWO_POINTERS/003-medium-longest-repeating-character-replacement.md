# 003. Longest Repeating Character Replacement (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon, Microsoft
>
> **Interview Tag**: 🔥 **SLIDING WINDOW WITH MAX FREQUENCY** - Premier sliding window pattern. Links directly to the [Sliding Window Blueprint](../ALGORITHMS/sliding-window.md).

---

### 📝 1. Problem Statement
You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times.

Return *the length of the longest substring containing the same letter you can get after performing the above operations*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "ABAB"`, `k = 2`
* **Output**: `4`
* **Why**: Replace the two 'A's with 'B's or vice versa. The resulting string is "AAAA" or "BBBB", both have length 4.

#### Test Case 2
* **Input**: `s = "AABABBA"`, `k = 1`
* **Output**: `4`
* **Why**: Replace the 'A' in the middle with 'B' to form "AABBBBA". The substring "BBBB" has the longest repeating character of length 4.

---

### 💬 3. What is This Problem Actually Asking?
Find the length of the longest substring where the total number of characters *minus* the frequency of the most frequent character in that substring is less than or equal to `k`.

$$\text{length} - \text{max\_frequency} \le k$$

---

### 🌍 4. Real-Life Example
Imagine you are editing a draft of a manuscript, and you are allowed to correct up to `k` typos in a row. You want to find the longest continuous sequence of words that are exactly identical. You scan the page from left to right, maintaining a sliding window of words, and if the number of words different from the most common word in your window exceeds `k`, you slide the start of your window forward.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Brute Force with Substring Iteration
Check every possible substring `s[i...j]`. For each substring, tally the character counts, find the most frequent character, and check if the remaining characters can be replaced using at most `k` moves (i.e. `(j - i + 1) - maxFreq <= k`).
* **Pros**: Straightforward validation.
* **Cons**: Time complexity is **$O(N^2)$**, causing TLE for long strings.

#### Approach 2: Sliding Window with Max Frequency Tracking (Optimal)
We maintain a sliding window `[left, right]`.
* We count character frequencies inside the window using a map/array of size 26.
* We track `maxFreq` (the frequency of the most common character in the *current or any past* window).
* If the number of characters we need to replace, `(right - left + 1) - maxFreq`, is greater than `k`, the window is invalid. We shrink the window by moving `left` forward and decrementing its frequency.
* Otherwise, we update our maximum window size.
* **Pros**: Optimal **$O(N)$** time complexity, **$O(1)$** space (since alphabet size is constant).
* **Cons**: Intuition behind not updating `maxFreq` downward during shrinkage can be tricky. (Note: `maxFreq` only needs to represent the maximum frequency ever reached. Since we are looking for a window larger than the previous maximum, `maxFreq` only matters when it increases).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with `s = "AABABBA"` and `k = 1`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `left = 0`, `maxFreq = 0`, `counts = {}`, `maxLength = 0`

#### **Step 1: Expand (right = 0, char = 'A')**
* **State check**: `counts['A'] = 1`. `maxFreq = 1`. Window: `[A]`.
* **Verification**: `length - maxFreq = 1 - 1 = 0 <= 1 (k)`. Valid.
* **Updates**: `maxLength = max(0, 1) = 1`.
* **Next**: `right = 1`.

#### **Step 2: Expand (right = 1, char = 'A')**
* **State check**: `counts['A'] = 2`. `maxFreq = 2`. Window: `[A, A]`.
* **Verification**: `length - maxFreq = 2 - 2 = 0 <= 1`. Valid.
* **Updates**: `maxLength = max(1, 2) = 2`.
* **Next**: `right = 2`.

#### **Step 3: Expand (right = 2, char = 'B')**
```text
Window:   [  A,   A,   B,   A,   B,   B,   A  ]
            idx0 idx1 idx2 idx3 idx4 idx5 idx6
Ptrs:        ▲         ▲
            left     right
```
* **State check**: `counts['A'] = 2, counts['B'] = 1`. `maxFreq = 2`. Window: `[A, A, B]`.
* **Verification**: `length - maxFreq = 3 - 2 = 1 <= 1`. Valid.
* **Updates**: `maxLength = max(2, 3) = 3`.
* **Next**: `right = 3`.

#### **Step 4: Expand (right = 3, char = 'A')**
* **State check**: `counts['A'] = 3, counts['B'] = 1`. `maxFreq = 3`. Window: `[A, A, B, A]`.
* **Verification**: `length - maxFreq = 4 - 3 = 1 <= 1`. Valid.
* **Updates**: `maxLength = max(3, 4) = 4`.
* **Next**: `right = 4`.

#### **Step 5: Expand (right = 4, char = 'B')**
```text
Window:   [  A,   A,   B,   A,   B,   B,   A  ]
            idx0 idx1 idx2 idx3 idx4 idx5 idx6
Ptrs:        ▲              ▲
            left          right
```
* **State check**: `counts['A'] = 3, counts['B'] = 2`. `maxFreq = 3`. Window: `[A, A, B, A, B]`.
* **Verification**: `length - maxFreq = 5 - 3 = 2 > 1`. Invalid!
* **Updates**: Shrink `left`. Decrement `counts['A']` to 2. Increment `left` to 1.
* **Next**: `right = 5`.

... [Steps continue, maintaining the max length of 4]

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function characterReplacement(s: string, k: number): number {
    // ==========================================
    // 1st Approach: Brute Force Substrings (O(N^2))
    // ==========================================
    /*
    let maxLen = 0;
    const n = s.length;
    for (let i = 0; i < n; i++) {
        const counts: { [key: string]: number } = {};
        let localMaxFreq = 0;
        for (let j = i; j < n; j++) {
            const char = s[j];
            counts[char] = (counts[char] || 0) + 1;
            localMaxFreq = Math.max(localMaxFreq, counts[char]);
            const length = j - i + 1;
            if (length - localMaxFreq <= k) {
                maxLen = Math.max(maxLen, length);
            } else {
                break; // Moving j further will only increase required replacements
            }
        }
    }
    return maxLen;
    */

    // ==========================================
    // 2nd Approach: Sliding Window Max Frequency (Optimal)
    // ==========================================
    const counts = new Array(26).fill(0);
    let left = 0;
    let maxFreq = 0;
    let maxLen = 0;

    for (let right = 0; right < s.length; right++) {
        const rightCharIdx = s.charCodeAt(right) - 65; // Upper-case letters index 0-25
        counts[rightCharIdx]++;
        maxFreq = Math.max(maxFreq, counts[rightCharIdx]);

        // Window size - maxFreq is the number of edits required
        const currentWindowSize = right - left + 1;
        if (currentWindowSize - maxFreq > k) {
            // Shrink window from the left
            const leftCharIdx = s.charCodeAt(left) - 65;
            counts[leftCharIdx]--;
            left++;
        }

        // The window size is always valid or contracting to its previous valid maximum size
        maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Brute Force | Approach 2: Sliding Window |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N^2)$** — Evaluates all possible substring ranges. | **$O(N)$** — Single pass over the string. |
| **Space Complexity** | **$O(1)$** — Constant space checks. | **$O(1)$** — Constant space ($O(26)$ bucket array). |

#### Edge Cases Handled:
* **All Same Characters** (`"AAAA"`, `k = 2`): Returns `4` immediately without shrinking.
* **$k$ exceeds length**: The outer boundary condition never triggers `left++`, return value equals total string length.
* **No operations allowed** ($k = 0$): Correctly identifies the longest contiguous segment of repeating characters.
