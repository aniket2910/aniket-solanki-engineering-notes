# 020. Reorganize String (Medium)

---

### 📝 1. Problem Statement
Given a string `s`, rearrange the characters of `s` so that any two adjacent characters are not the same.

Return *any possible rearrangement of `s` or return `""` if not possible*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "aab"`
* **Output**: `"aba"`
* **Why**: The original string has two adjacent `'a'`s. Rearranging it to `"aba"` ensures no two identical letters are adjacent.

#### Test Case 2
* **Input**: `s = "aaab"`
* **Output**: `""`
* **Why**: The length is 4 and `'a'` appears 3 times. It is mathematically impossible to place three `'a'`s in a string of length 4 without at least two of them being adjacent (e.g., `"aaba"`, `"abaa"`).

---

### 💬 3. What is This Problem Actually Asking?
We want to shuffle the characters of a string so that identical characters are never sitting next to each other.
* **Possibility Rule**: Let $N$ be the length of the string. The maximum possible occurrences of any single character cannot exceed $\lfloor(N + 1) / 2\rfloor$. If any character appears more times than this limit, we can never space them out. In this case, we must return `""`.
* **Arrangement Strategy**: To ensure no two identical characters touch, we can place them into **alternate indices** (e.g., index `0, 2, 4, 6...` then `1, 3, 5, 7...`). 
  * If we place the most frequent character first, we can easily distribute the rest in the remaining alternate slots!

---

### 🌍 4. Real-Life Example
Imagine **seating guests at a dinner table**:
* You have a group of guests: 3 wearing red shirts (`a`) and 2 wearing blue shirts (`b`).
* Red-shirt wearers refuse to sit next to other red-shirt wearers.
* To seat them successfully:
  1. You find the largest group (red shirts, count = 3).
  2. You seat them in every alternate chair starting at chair 0: **[Red, Empty, Red, Empty, Red]**.
  3. You then seat the blue shirts in the remaining empty chairs: **[Red, Blue, Red, Blue, Red]**.
* Now, no two red-shirt wearers are adjacent!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Fixed Frequency Array (size 26)** and a **Character Array** of size $N$ for building the output.
  - *Why*: The frequency counts are bounded by 26 lowercase English letters ($O(1)$ space). Building the result in a mutable character array takes $O(N)$ time.
* **Algorithm**: **Greedy Alternating Placement**.
  1. Count the frequencies of all characters and store them in a 26-element array.
  2. Find the character with the **maximum frequency**.
  3. Check if its count exceeds `(s.length + 1) / 2`. If it does, return `""` immediately.
  4. Create an output character array `res` of length `s.length`.
  5. Place the most frequent character in alternate positions starting at index `0` (`0, 2, 4, ...`), decrementing its count in each step.
  6. Place the remaining characters in the remaining alternate positions. 
     * If our index pointer exceeds the end of the array, we reset it to `1` (the odd indices: `1, 3, 5, ...`).
  7. Convert the character array back to a string and return it.

This greedy algorithm is highly optimal, running in $O(N)$ time and $O(1)$ auxiliary space.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function reorganizeString(s: string): string {
    const counts = new Int32Array(26);
    
    // 1. Count frequencies of each character
    for (let i = 0; i < s.length; i++) {
        counts[s.charCodeAt(i) - 97]++;
    }

    // 2. Find the character with the highest frequency
    let maxFreq = 0;
    let maxCharVal = 0;
    for (let i = 0; i < 26; i++) {
        if (counts[i] > maxFreq) {
            maxFreq = counts[i];
            maxCharVal = i;
        }
    }

    // 3. If the most frequent character exceeds the limit, it's impossible
    if (maxFreq > Math.floor((s.length + 1) / 2)) {
        return "";
    }

    const res = new Array<string>(s.length);
    let index = 0;

    // 4. Place the most frequent character in alternate slots starting at index 0
    const mostFreqChar = String.fromCharCode(maxCharVal + 97);
    while (counts[maxCharVal] > 0) {
        res[index] = mostFreqChar;
        index += 2;
        counts[maxCharVal]--;
    }

    // 5. Place the remaining characters in the remaining alternate slots
    for (let i = 0; i < 26; i++) {
        while (counts[i] > 0) {
            // If we run out of even indices, reset to index 1 (odd indices)
            if (index >= s.length) {
                index = 1;
            }
            res[index] = String.fromCharCode(i + 97);
            index += 2;
            counts[i]--;
        }
    }

    return res.join('');
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We scan the string of length $N$ to build counts, then we perform $N$ array writes to place characters in alternate indices.
* **Space Complexity**: **$O(N)$** — Required to hold the final character array of length $N$. The auxiliary space is $O(1)$ since the frequency array is of fixed size 26.

#### Edge Cases Handled:
* **Max frequency exactly equals limit** (`s = "aba"`, length = 3): Max frequency is 2. Limit is `(3 + 1) / 2 = 2`. Max frequency does not exceed limit. Placed at index `0` and `2`, leaving index `1` for `'b'`. Yields `"aba"` (Correct).
* **Impossible layout** (`s = "aaaaab"`): Max frequency is 5. Limit is `(6 + 1) / 2 = 3`. 5 > 3, returns `""` immediately (Correct).
* **Single character string** (`s = "a"`): Length is 1. Max frequency is 1. Limit is `(1+1)/2 = 1`. Placed at index 0. Returns `"a"` (Correct).

---

### 🎬 8. Dry Run
Let's trace `s = "aab"` (length 3) with `counts = { 'a': 2, 'b': 1 }`:

#### **Phase 1: Max Frequency Detection**
* Max frequency: `2` (character `'a'`).
* Limit check: `2 > Math.floor((3 + 1) / 2)` $\rightarrow$ `2 > 2` (False). It is possible to rearrange!

#### **Phase 2: Alternating Placement**

#### **Step 0: Placing Most Frequent Character ('a')**
```text
State: res = [ _, _, _ ], index = 0, counts['a'] = 2
Array:       [ _, _, _ ]
               idx0 idx1 idx2
Pointer:       ▲
             index
```
* **Action**: Place `'a'` at `res[0]`. `index` advances by 2. `counts['a']` becomes 1.

#### **Step 1: Placing 'a' (Continued)**
```text
State: res = [ "a", _, _ ], index = 2, counts['a'] = 1
Array:       [ "a", _, _ ]
               idx0 idx1 idx2
Pointer:                 ▲
                       index
```
* **Action**: Place `'a'` at `res[2]`. `index` advances by 2 to become 4. `counts['a']` becomes 0.

#### **Step 2: Placing Remaining Character ('b')**
```text
State: res = [ "a", _, "a" ], index = 4 (Out of bounds), counts['b'] = 1
```
* **Action**: `index` (4) is $\ge$ array length (3). Reset `index` to `1` (odd slots).
```text
State: index = 1
Array:       [ "a", _, "a" ]
               idx0 idx1 idx2
Pointer:            ▲
                  index
```
* **Action**: Place `'b'` at `res[1]`. `index` advances by 2 to become 3. `counts['b']` becomes 0.
* **Exit**: Loop completes. All character frequencies are now 0.
* **Final Output**: `res.join('')` $\rightarrow$ `"aba"`.
