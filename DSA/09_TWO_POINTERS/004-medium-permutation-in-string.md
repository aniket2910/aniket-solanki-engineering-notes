# 004. Permutation in String (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon, Microsoft, Facebook/Meta
>
> **Interview Tag**: 🔥 **FIXED SLIDING WINDOW FREQUENCY MATCH** - Classical fixed-size window implementation. Links directly to the [Sliding Window Blueprint](../ALGORITHMS/sliding-window.md).

---

### 📝 1. Problem Statement
Given two strings `s1` and `s2`, return `true` *if* `s2` *contains a permutation of* `s1`*, or* `false` *otherwise*.

In other words, return `true` if one of `s1`'s permutations is the substring of `s2`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s1 = "ab"`, `s2 = "eidbaooo"`
* **Output**: `true`
* **Why**: `s2` contains one permutation of `s1` ("ba") at index 3.

#### Test Case 2
* **Input**: `s1 = "ab"`, `s2 = "eidboaoo"`
* **Output**: `false`
* **Why**: No permutation of "ab" exists as a contiguous substring in `s2`.

---

### 💬 3. What is This Problem Actually Asking?
Determine if there exists a contiguous substring of `s2` that has the exact same length and same character frequencies as `s1`.

---

### 🌍 4. Real-Life Example
Imagine you are checking if a list of ingredients (`s1`) matches a subset of foods in a continuous conveyor belt (`s2`). Since the order on the belt doesn't matter (any permutation is fine), you look at a window of food items equal in length to your ingredient list. As the belt moves, you slide your window, adding the new food item and removing the old one, checking if the item frequencies match your list.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: Sorting and Substring Matching
Iterate through all substrings of `s2` of length equal to `s1.length`. For each substring, sort its characters and compare it with the sorted version of `s1`.
* **Pros**: Simple logic.
* **Cons**: Time complexity is **$O((N - M) \cdot M \log M)$** (where $M = \text{s1.length}$, $N = \text{s2.length}$), which is highly sub-optimal.

#### Approach 2: Fixed-Size Sliding Window with Character Frequency Arrays (Optimal)
We maintain a window of size `s1.length` in `s2`.
* We count character frequencies of `s1` in an array of size 26 (`s1Count`).
* We count character frequencies of the first window of `s2` in another array of size 26 (`s2Count`).
* We slide the window from left to right:
  * At each step, we check if the frequency arrays are identical (we can do this in $O(1)$ since there are only 26 letters).
  * If they match, return `true`.
  * If they don't, we slide the window by adding the new character on the right and removing the old character on the left.
* **Pros**: Optimal **$O(N)$** time complexity, **$O(1)$** auxiliary space.
* **Cons**: None.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace Approach 2 with `s1 = "ab"` and `s2 = "eidbaooo"`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `s1Count` for "ab": `[a: 1, b: 1, ... others: 0]`
* First window in `s2` of length 2 ("ei"): `s2Count`: `[e: 1, i: 1, ... others: 0]`

#### **Step 1: Check Match (i = 0)**
* **State check**: Does `s1Count` match `s2Count`? No (`[1, 1]` vs `[0, 0]`).
* **Updates**: Slide window to "id". Add 'd', remove 'e'.
  * `s2Count`: `[e: 0, i: 1, d: 1]`.

#### **Step 2: Check Match (i = 1)**
* **State check**: Does `s1Count` match `s2Count`? No.
* **Updates**: Slide window to "db". Add 'b', remove 'i'.
  * `s2Count`: `[i: 0, d: 1, b: 1]`.

#### **Step 3: Check Match (i = 2)**
* **State check**: Does `s1Count` match `s2Count`? No.
* **Updates**: Slide window to "ba". Add 'a', remove 'd'.
  * `s2Count`: `[d: 0, b: 1, a: 1]`.

#### **Step 4: Check Match (i = 3)**
```text
Window:   [  e,   i,   d,   b,   a,   o,   o,   o  ]
            idx0 idx1 idx2 idx3 idx4 idx5 idx6 idx7
Window:                  [  b,   a  ]
Ptrs:                       ▲    ▲
                          left right
```
* **State check**: Does `s1Count` match `s2Count`? Yes (`[a: 1, b: 1]` matches `[a: 1, b: 1]`).
* **Updates**: Return `true`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function checkInclusion(s1: string, s2: string): boolean {
    // ==========================================
    // 1st Approach: Sorting Substrings (O(N * M log M))
    // ==========================================
    /*
    if (s1.length > s2.length) return false;
    const sortedS1 = s1.split('').sort().join('');
    const m = s1.length;
    const n = s2.length;
    for (let i = 0; i <= n - m; i++) {
        const sortedSub = s2.substring(i, i + m).split('').sort().join('');
        if (sortedS1 === sortedSub) {
            return true;
        }
    }
    return false;
    */

    // ==========================================
    // 2nd Approach: Fixed Sliding Window Frequency Arrays (Optimal)
    // ==========================================
    if (s1.length > s2.length) return false;

    const s1Count = new Array(26).fill(0);
    const s2Count = new Array(26).fill(0);

    // Build the initial counts for s1 and the first window of s2
    for (let i = 0; i < s1.length; i++) {
        s1Count[s1.charCodeAt(i) - 97]++;
        s2Count[s2.charCodeAt(i) - 97]++;
    }

    const matches = (c1: number[], c2: number[]): boolean => {
        for (let i = 0; i < 26; i++) {
            if (c1[i] !== c2[i]) return false;
        }
        return true;
    };

    // Slide window across s2
    for (let i = 0; i < s2.length - s1.length; i++) {
        if (matches(s1Count, s2Count)) return true;

        // Slide the window: remove character at 'i', add character at 'i + s1.length'
        const removeIdx = s2.charCodeAt(i) - 97;
        const addIdx = s2.charCodeAt(i + s1.length) - 97;

        s2Count[removeIdx]--;
        s2Count[addIdx]++;
    }

    // Check the last window match
    return matches(s1Count, s2Count);
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Sorting Substrings | Approach 2: Fixed Sliding Window |
| :--- | :--- | :--- |
| **Time Complexity** | **$O((N - M) \cdot M \log M)$** — Sorts every candidate substring. | **$O(N)$** — Passes through `s2` once. |
| **Space Complexity** | **$O(M)$** — Stores sorted strings. | **$O(1)$** — Constant auxiliary array storage ($O(26)$ size). |

#### Edge Cases Handled:
* **`s1` is longer than `s2`**: Returns `false` immediately at the start of the function.
* **Exact match** (`s1 = "abc"`, `s2 = "abc"`): Triggers initial check or loop boundary check and returns `true`.
* **Single character search** (`s1 = "a"`, `s2 = "b"`): Correctly sliding window check matches indices and yields false.
