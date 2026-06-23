# 022. Longest Substring Without Repeating Characters (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Google, Bloomberg, Meta, Microsoft
>
> **Interview Tag**: 🔥 **SLIDING WINDOW CLASSIC** - A fundamental problem for mastering the two-pointer sliding window technique and optimized hash map tracking.

---

### 📝 1. Problem Statement
Given a string `s`, find the length of the **longest substring** without repeating characters. A substring is a contiguous sequence of characters within a string.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "abcabcbb"`
* **Output**: `3`
* **Why**: The answer is `"abc"`, with the length of 3. Other substrings like `"bca"` and `"cab"` also have length 3 but `"abc"` is the first.

#### Test Case 2
* **Input**: `s = "bbbbb"`
* **Output**: `1`
* **Why**: The longest substring without repeating characters is `"b"`, with the length of 1.

---

### 💬 3. What is This Problem Actually Asking?
We need to find the maximum length of a contiguous sequence of characters in a string such that all characters in that sequence are unique.

---

### 🌍 4. Real-Life Example
Imagine walking down a high street scanning store banners to take a single continuous panoramic photo. You want the photo to be as long as possible, but if the same brand logo appears twice in the frame, the photo is ruined. You must shift the starting frame past the first occurrence of the logo to continue scanning.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** to show how hash maps optimize the sliding window strategy:

#### Approach 1: Sliding Window with a Set
We maintain a window `[left, right]`. We expand `right` and add characters to a set. If we hit a duplicate, we shrink the window from the `left` until the duplicate is removed.
* **Pros**: Simple to understand and implement.
* **Cons**: In the worst case (like `"abbbbbbb"`), each character is visited twice (once by `right`, once by `left`), leading to $O(N)$ operations but with higher constant factor.

#### Approach 2: Optimized Sliding Window with Hash Map Index (Optimal)
Instead of shifting `left` step-by-step, we use a Hash Map to record the last seen index of each character. When a duplicate is seen, we instantly jump `left` to `map.get(char) + 1` (if it is within the current window).
* **Pros**: Faster single-pass traversal. `left` pointer jumps directly, minimizing unnecessary steps.
* **Cons**: Requires additional space for the hash map mapping characters to indices.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `s = "abca"` and `left = 0`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `maxLength = 0`, `left = 0`, `charIndexMap = {}`

#### **Step 1: right = 0 (char = 'a')**
```text
Pointers: left = 0, right = 0
String:   [  a,   b,   c,   a  ]
            idx0 idx1 idx2 idx3
Pointers:    ▲
         left/right
```
* **State check**: 'a' not in `charIndexMap`.
* **Updates**: `charIndexMap = {'a': 0}`, `maxLength = max(0, 0 - 0 + 1) = 1`
* **Next**: `right` advances to index 1.

#### **Step 2: right = 1 (char = 'b')**
```text
Pointers: left = 0, right = 1
String:   [  a,   b,   c,   a  ]
            idx0 idx1 idx2 idx3
Pointers:    ▲    ▲
          left  right
```
* **State check**: 'b' not in `charIndexMap`.
* **Updates**: `charIndexMap = {'a': 0, 'b': 1}`, `maxLength = max(1, 1 - 0 + 1) = 2`
* **Next**: `right` advances to index 2.

#### **Step 3: right = 2 (char = 'c')**
```text
Pointers: left = 0, right = 2
String:   [  a,   b,   c,   a  ]
            idx0 idx1 idx2 idx3
Pointers:    ▲         ▲
          left       right
```
* **State check**: 'c' not in `charIndexMap`.
* **Updates**: `charIndexMap = {'a': 0, 'b': 1, 'c': 2}`, `maxLength = max(2, 2 - 0 + 1) = 3`
* **Next**: `right` advances to index 3.

#### **Step 4: right = 3 (char = 'a') - Collision!**
```text
Pointers: left = 0, right = 3
String:   [  a,   b,   c,   a  ]
            idx0 idx1 idx2 idx3
Pointers:    ▲              ▲
          left            right
```
* **State check**: 'a' is in `charIndexMap` at index 0. Since `0 >= left` (0 >= 0), move `left` to `0 + 1 = 1`.
* **Updates**: `left = 1`, `charIndexMap['a'] = 3`, `maxLength = max(3, 3 - 1 + 1) = 3`
* **Next**: Loop terminates. Returns `3`.

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function lengthOfLongestSubstring(s: string): number {
    // ==========================================
    // 1st Approach: Sliding Window with Set (O(N))
    // ==========================================
    /*
    let maxLength = 0;
    let left = 0;
    const charSet = new Set<string>();

    for (let right = 0; right < s.length; right++) {
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    return maxLength;
    */

    // ==========================================
    // 2nd Approach: Optimized Sliding Window with Hash Map (Optimal)
    // ==========================================
    let maxLength = 0;
    let left = 0;
    const charIndexMap = new Map<string, number>();

    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        if (charIndexMap.has(char)) {
            // Jump left pointer past the previous duplicate character
            left = Math.max(left, charIndexMap.get(char)! + 1);
        }
        charIndexMap.set(char, right);
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Sliding Window Set | Approach 2: Optimized Hash Map |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Two pointers traverse the string at most once. | **$O(N)$** — Single pass over the string. |
| **Space Complexity** | **$O(\min(M, N))$** — Aux set for storing unique characters. | **$O(\min(M, N))$** — Aux hash map index mapping. |

#### Edge Cases Handled:
* **Empty String** (`s = ""`): The loop doesn't execute; returns `0` (Correct).
* **All Identical Characters** (`s = "bbbb"`): `left` shifts to `right` index on every step, `maxLength` stays `1` (Correct).
* **String with no duplicates** (`s = "abcdef"`): `left` remains at `0`, returns `6` (Correct).
