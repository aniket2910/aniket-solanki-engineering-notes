# 007. Split a String in Balanced Strings (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon


---

### 📝 1. Problem Statement
**Balanced** strings are those that have an equal quantity of `'L'` and `'R'` characters.

Given a **balanced** string `s`, split it into some number of substrings such that:
* Each substring is balanced.

Return *the maximum number of balanced strings you can obtain*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "RLRRLLRLRL"`
* **Output**: `4`
* **Why**: `s` can be split into `"RL"`, `"RRLL"`, `"RL"`, `"RL"`, each substring contains an equal number of `'L'` and `'R'`.

#### Test Case 2
* **Input**: `s = "RLRRRLLRLL"`
* **Output**: `2`
* **Why**: `s` can be split into `"RL"`, `"RRRLLRLL"`, each substring contains an equal number of `'L'` and `'R'`. Note that we cannot split into `"RL"`, `"RR"`, `"LL"`, `"RL"`, `"L"`, `"L"` because `"RR"` and `"LL"` are not balanced.

#### Test Case 3
* **Input**: `s = "LLLLRRRR"`
* **Output**: `1`
* **Why**: `s` can be split into `"LLLLRRRR"`.

---

### 💬 3. What is This Problem Actually Asking?
We are given a string made up of `'L'` (Left) and `'R'` (Right) characters. The entire string is guaranteed to be balanced (meaning total `'L'`s equal total `'R'`s).

We want to chop/cut this string into as many **balanced** substrings as possible.
* A substring is balanced if its count of `'L'` matches its count of `'R'`.
* E.g., in `"RL"`, count of `'R'` is 1, and `'L'` is 1 $\rightarrow$ Balanced!
* We want to find the **maximum count** of such partitions.

---

### 🌍 4. Real-Life Example
Think of a **tug-of-war match with a rope**:
* `'L'` represents a pull to the left, and `'R'` represents a pull to the right.
* If the teams are perfectly matched, the center marker of the rope stays exactly in the middle.
* You walk down the timeline of the game:
  * Every time a player pulls left (`'L'`), the balance shifts by `-1`.
  * Every time a player pulls right (`'R'`), the balance shifts by `+1`.
  * Every single time the balance **returns exactly to `0`** (the rope center marker settles back to dead-center), it means the segment of play up to that second was perfectly balanced! You write down one completed balanced round and reset your timer.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: None (scalar integers).
* **Algorithm**: **Greedy Balance Counting (Single-Pass)**.
  * *Why*: Because we want the *maximum* number of balanced substrings, we should make a cut **as soon as possible** (greedy choice). We don't need to look ahead. Whenever our balance count hits `0`, we increments our score by `1`, because a larger balanced segment can always be split into smaller balanced segments if they hit zero in between.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function balancedStringSplit(s: string): number {
    let balance: number = 0;
    let count: number = 0;

    for (let i = 0; i < s.length; i++) {
        if (s[i] === 'R') {
            balance++;
        } else {
            balance--;
        }

        // As soon as balance returns to 0, we found a balanced substring!
        if (balance === 0) {
            count++;
        }
    }

    return count;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We scan the string of length $N$ exactly once.
* **Space Complexity**: **$O(1)$** — We use only two constant-sized variables (`balance`, `count`).

#### Edge Cases Handled:
* **Minimal Balanced String** (`s = "RL"`):
  * `i = 0`: `'R'` $\rightarrow$ `balance = 1`.
  * `i = 1`: `'L'` $\rightarrow$ `balance = 0` $\rightarrow$ `count` becomes `1`.
  * Returns `1` (Correct).
* **Deeply Nested Balance** (`s = "LLLRRR"`):
  * `balance` goes: `-1, -2, -3, -2, -1, 0`.
  * Hits `0` only at the very end. Returns `1` (Correct).

---

### 🎬 8. Dry Run
Let's trace `s = "RLRRLL"` with `balance = 0`, `count = 0`:

#### **Step 0: i = 0**
```text
Pointers: i = 0, balance = 0, count = 0
String:   " R   L   R   R   L   L "
            0   1   2   3   4   5
Pointer:    ▲
            i
```
* **Character**: `s[0]` -> `"R"`
* **Decision**: `'R'` increment balance. `balance` becomes `1`.
* **Comparison**: `balance === 0` is `false`.
* **Next**: `i` becomes 1.

#### **Step 1: i = 1**
```text
Pointers: i = 1, balance = 1, count = 0
String:   " R   L   R   R   L   L "
            0   1   2   3   4   5
Pointer:        ▲
                i
```
* **Character**: `s[1]` -> `"L"`
* **Decision**: `'L'` decrement balance. `balance` becomes `0`.
* **Comparison**: `balance === 0` is `true`. Increment `count`.
* **Next**: `count` becomes 1. `i` becomes 2.

#### **Step 2: i = 2**
```text
Pointers: i = 2, balance = 0, count = 1
String:   " R   L   R   R   L   L "
            0   1   2   3   4   5
Pointer:            ▲
                    i
```
* **Character**: `s[2]` -> `"R"`
* **Decision**: `'R'` increment balance. `balance` becomes `1`.
* **Comparison**: `balance === 0` is `false`.
* **Next**: `i` becomes 3.

#### **Step 3: i = 3**
```text
Pointers: i = 3, balance = 1, count = 1
String:   " R   L   R   R   L   L "
            0   1   2   3   4   5
Pointer:                ▲
                        i
```
* **Character**: `s[3]` -> `"R"`
* **Decision**: `'R'` increment balance. `balance` becomes `2`.
* **Comparison**: `balance === 0` is `false`.
* **Next**: `i` becomes 4.

#### **Step 4: i = 4**
```text
Pointers: i = 4, balance = 2, count = 1
String:   " R   L   R   R   L   L "
            0   1   2   3   4   5
Pointer:                    ▲
                            i
```
* **Character**: `s[4]` -> `"L"`
* **Decision**: `'L'` decrement balance. `balance` becomes `1`.
* **Comparison**: `balance === 0` is `false`.
* **Next**: `i` becomes 5.

#### **Step 5: i = 5**
```text
Pointers: i = 5, balance = 1, count = 1
String:   " R   L   R   R   L   L "
            0   1   2   3   4   5
Pointer:                        ▲
                                i
```
* **Character**: `s[5]` -> `"L"`
* **Decision**: `'L'` decrement balance. `balance` becomes `0`.
* **Comparison**: `balance === 0` is `true`. Increment `count`.
* **Next**: Loop terminates. Returns `count = 2`.
