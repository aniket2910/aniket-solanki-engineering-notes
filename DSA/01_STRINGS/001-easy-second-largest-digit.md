# 001. Second Largest Digit in a String (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Adobe


---

### 📝 1. Problem Statement
Given an alphanumeric string `s`, return the **second largest** numerical digit that appears in `s`, or `-1` if it does not exist.

An **alphanumeric string** consists of lowercase English letters and digits.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "dfa12321afd"`
* **Output**: `2`
* **Why**: The digits present in the string are `1`, `2`, and `3`. The largest digit is `3`, and the second largest is `2`.

#### Test Case 2
* **Input**: `s = "abc1111"`
* **Output**: `-1`
* **Why**: The only digit present is `1`. There is no second unique largest digit, so we return `-1`.

---

### 💬 3. What is This Problem Actually Asking?
We are given a string containing both letters and numbers. We need to:
1. Ignore all the letters.
2. Look at only the unique numerical digits (0 to 9) that appear in the string.
3. Find the second highest number among them.
4. If there are no numbers at all, or if all the numbers are the same (meaning no runner-up exists), we return `-1`.

---

### 🌍 4. Real-Life Example
Think of a **live auction (like eBay)**. As bids come in one by one:
* If a new bid is higher than the current highest bid, the old highest bid drops down to become the runner-up.
* If a new bid is lower than the highest bid but higher than the current runner-up, it becomes the new runner-up.
* If a new bid is equal to the highest bid or lower than the runner-up, we ignore it.

This process lets us know the top two unique bids at any moment without having to sort the entire history of bids.

---

### 🛠️ 5. Data Structure & Algorithm Used
No complex data structures (like Stacks, Trees, or Heaps) are required here. We solve this using a **single-pass linear scan** with two tracking variables (`firstMax` and `secondMax`).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Let's trace the execution of the `secondHighest` function using **Test Case 1**:
`s = "dfa12321afd"`

We start with `firstMax = -1` and `secondMax = -1`.

---

#### **Step 0: Initial State**
```text
String:    d   f   a   1   2   3   2   1   a   f   d
Index:     0   1   2   3   4   5   6   7   8   9   10
Pointers:  ▲
           i
firstMax: -1, secondMax: -1
```
* **Character**: `'d'` is not a digit. Skip it.
* **Next**: `i` advances to index 1.

---

#### **Step 1: Processing letters (Indices 1 to 2)**
* Characters `'f'` (Index 1) and `'a'` (Index 2) are not digits. Skip.

---

#### **Step 2: Index 3**
```text
String:    d   f   a   1   2   3   2   1   a   f   d
Index:     0   1   2   3   4   5   6   7   8   9   10
Pointers:              ▲
                       i
firstMax: -1, secondMax: -1
```
* **Digit**: `1`
* **Comparison**: `1 > firstMax` (`1 > -1` is True).
* **Action**:
  1. `secondMax = firstMax` (`secondMax` becomes `-1`).
  2. `firstMax = digit` (`firstMax` becomes `1`).
* **Current State**: `firstMax = 1`, `secondMax = -1`.

---

#### **Step 3: Index 4**
```text
String:    d   f   a   1   2   3   2   1   a   f   d
Index:     0   1   2   3   4   5   6   7   8   9   10
Pointers:                  ▲
                           i
firstMax: 1, secondMax: -1
```
* **Digit**: `2`
* **Comparison**: `2 > firstMax` (`2 > 1` is True).
* **Action**:
  1. `secondMax = firstMax` (`secondMax` becomes `1`).
  2. `firstMax = digit` (`firstMax` becomes `2`).
* **Current State**: `firstMax = 2`, `secondMax = 1`.

---

#### **Step 4: Index 5**
```text
String:    d   f   a   1   2   3   2   1   a   f   d
Index:     0   1   2   3   4   5   6   7   8   9   10
Pointers:                      ▲
                               i
firstMax: 2, secondMax: 1
```
* **Digit**: `3`
* **Comparison**: `3 > firstMax` (`3 > 2` is True).
* **Action**:
  1. `secondMax = firstMax` (`secondMax` becomes `2`).
  2. `firstMax = digit` (`firstMax` becomes `3`).
* **Current State**: `firstMax = 3`, `secondMax = 2`.

---

#### **Step 5: Index 6**
```text
String:    d   f   a   1   2   3   2   1   a   f   d
Index:     0   1   2   3   4   5   6   7   8   9   10
Pointers:                          ▲
                                   i
firstMax: 3, secondMax: 2
```
* **Digit**: `2`
* **Comparison**: `2 < firstMax` (`2 < 3` is True), but `2 > secondMax` (`2 > 2` is False).
* **Action**: Duplicate/smaller value. Ignore.
* **Current State**: `firstMax = 3`, `secondMax = 2`.

---

#### **Step 6: Index 7**
```text
String:    d   f   a   1   2   3   2   1   a   f   d
Index:     0   1   2   3   4   5   6   7   8   9   10
Pointers:                              ▲
                                       i
firstMax: 3, secondMax: 2
```
* **Digit**: `1`
* **Comparison**: `1 < firstMax` (`1 < 3` is True), but `1 > secondMax` (`1 > 2` is False).
* **Action**: Smaller value. Ignore.

---

#### **Step 7: Processing letters (Indices 8 to 10)**
* Characters `'a'`, `'f'`, and `'d'` are skipped.
* Loop terminates.

---

#### **Final Result**
* The second highest unique digit is `secondMax = 2`!

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function secondHighest(s: string): number {
    let firstMax: number = -1;
    let secondMax: number = -1;

    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        
        // Process only if the character is a digit
        if (char >= '0' && char <= '9') {
            const digit = char.charCodeAt(0) - '0'.charCodeAt(0);

            if (digit > firstMax) {
                // The old highest now becomes the second highest
                secondMax = firstMax;
                firstMax = digit;
            } else if (digit < firstMax && digit > secondMax) {
                // Update the second highest only if the digit is unique
                secondMax = digit;
            }
        }
    }

    return secondMax;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We traverse the string of length $N$ exactly once.
* **Space Complexity**: **$O(1)$** — We only use two integer variables to store the top two digits.

#### Edge Cases to Watch:
* **All Duplicate Digits** (`"abc1111"`): The code compares the second `1` with `firstMax` (which is already `1`). Since `1` is not greater than `firstMax` and not less than `firstMax`, it is ignored. `secondMax` remains `-1` (Correct).
* **No Digits** (`"xyz"`): The loop runs but never finds a digit. Returns `-1` (Correct).
* **Only One Digit** (`"a7b"`): `firstMax` becomes `7`, but `secondMax` remains `-1`. Returns `-1` (Correct).
