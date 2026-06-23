# 015. Minimum Add to Make Parentheses Valid (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Facebook/Meta, Amazon, Google


---

### 📝 1. Problem Statement
A parentheses string is valid if and only if:
1. It is the empty string,
2. It can be written as `AB` (`A` concatenated with `B`), where `A` and `B` are valid strings, or
3. It can be written as `(A)`, where `A` is a valid string.

You are given a parentheses string `s`. In one move, you can insert a parenthesis at any position of the string.
* For example, if `s = "())"`, you can insert an opening parenthesis to be `"(学会)))"` or a closing parenthesis to be `"学会)))"`.

Return the *minimum number of moves* required to make `s` valid.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "()"`
* **Output**: `1`
* **Why**: We need to add one opening parenthesis `(` at the start to make it valid: `"(())"`.

#### Test Case 2
* **Input**: `s = "((("`
* **Output**: `3`
* **Why**: We need to add three closing parentheses `)` at the end to make it valid: `"((()))"`.

#### Test Case 3
* **Input**: `s = "()"`
* **Output**: `0`
* **Why**: The string is already perfectly balanced; no additions are required.

---

### 💬 3. What is This Problem Actually Asking?
We need to count how many parentheses are **unmatched** in the entire string.
* Every opening parenthesis `(` wants a matching closing parenthesis `)` to its right.
* Every closing parenthesis `)` wants a matching opening parenthesis `(` to its left.

If a closing parenthesis appears when there is no unmatched opening parenthesis before it, it can never be paired. We must insert a new opening parenthesis to match it.
At the end of the string, if there are leftover opening parentheses that were never paired, we must insert closing parentheses to match them.

By keeping track of these unmatched states, we can solve this in a single pass with **$O(1)$ auxiliary space**!

---

### 🌍 4. Real-Life Example
Think of a **couples dance party**:
* An opening parenthesis `(` represents a **Leader** arriving.
* A closing parenthesis `)` represents a **Follower** arriving.
* When a **Leader** `(` arrives, they wait in line for a partner (`closeNeeded++`).
* When a **Follower** `)` arrives:
  * If a Leader is waiting, they pair up and start dancing (`closeNeeded--`).
  * If no Leader is waiting, this Follower is unmatched. We must call and invite a new Leader from outside to partner with them (`openNeeded++`).
* At the end of the night:
  * The number of Followers who danced alone and needed a Leader is `openNeeded`.
  * The number of Leaders left waiting alone with no partner is `closeNeeded`.
* The total number of external dancers we need to invite to make sure everyone has a partner is `openNeeded + closeNeeded`!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: None (Pure variables instead of a Stack).
  - *Why*: We don't need to reconstruct the string or store character positions; we only need to count unmatched quantities. Simple counters save $O(N)$ stack memory overhead.
* **Algorithm**: **Unmatched Counters Tracking (Greedy)**.
  - Maintain two counters:
    - `openNeeded`: Number of opening parentheses `(` we must add.
    - `closeNeeded`: Number of closing parentheses `)` we must add (representing current unmatched opening parentheses waiting).
  - Loop through each character `char` in string `s`:
    - If `char === '('`:
      - We have a new unmatched opening parenthesis, so it will need a closing parenthesis: `closeNeeded++`.
    - If `char === ')'`:
      - If we have an opening parenthesis waiting (`closeNeeded > 0`), they pair up: `closeNeeded--`.
      - If no opening parenthesis is waiting, this `)` is unmatched, so we must add an opening parenthesis: `openNeeded++`.
  - Return `openNeeded + closeNeeded`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function minAddToMakeValid(s: string): number {
    let openNeeded = 0;   // Count of '(' we need to insert
    let closeNeeded = 0;  // Count of ')' we need to insert (unmatched open parentheses)

    for (let i = 0; i < s.length; i++) {
        const char = s[i];

        if (char === '(') {
            // This '(' needs a matching ')'
            closeNeeded++;
        } else {
            // We encountered a ')'
            if (closeNeeded > 0) {
                // Pair it with an unmatched '('
                closeNeeded--;
            } else {
                // No '(' is available to pair; we must insert a '('
                openNeeded++;
            }
        }
    }

    // The total additions is the sum of unmatched '(' and unmatched ')'
    return openNeeded + closeNeeded;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We scan the string of length $N$ exactly once.
* **Space Complexity**: **$O(1)$** — We only store two integer counters in memory.

#### Edge Cases Handled:
* **Empty String** (`s = ""`): The loop doesn't execute, returns `0` (Correct).
* **Only Opening Parentheses** (`s = "((("`): `closeNeeded` becomes 3, `openNeeded` is 0. Returns `3` (Correct).
* **Only Closing Parentheses** (`s = ")))"`): `openNeeded` becomes 3, `closeNeeded` is 0. Returns `3` (Correct).
* **Interleaved Unmatched Parentheses** (`s = ")( 学会"`): 
  * `)` at index 0: `openNeeded = 1`.
  * `(` at index 1: `closeNeeded = 1`.
  * Returns `1 + 1 = 2` (Correct).

---

### 🎬 8. Dry Run
Let's trace `s = "())("` with `openNeeded = 0`, `closeNeeded = 0`:

#### **Step 0: i = 0**
```text
Pointers: i = 0, openNeeded = 0, closeNeeded = 0
String:   " (   )   )   ( "
            0   1   2   3
Pointer:    ▲
            i
```
* **Character**: `s[0]` -> `"("`
* **Decision**: Opening parenthesis found. Needs a matching closing partner. Increment `closeNeeded`.
* **Next**: `closeNeeded` becomes 1. `i` becomes 1.

#### **Step 1: i = 1**
```text
Pointers: i = 1, openNeeded = 0, closeNeeded = 1
String:   " (   )   )   ( "
            0   1   2   3
Pointer:        ▲
                i
```
* **Character**: `s[1]` -> `")"`
* **Decision**: Closing parenthesis found. We have a waiting `'('` (`closeNeeded = 1 > 0`). They pair up. Decrement `closeNeeded`.
* **Next**: `closeNeeded` becomes 0. `i` becomes 2.

#### **Step 2: i = 2**
```text
Pointers: i = 2, openNeeded = 0, closeNeeded = 0
String:   " (   )   )   ( "
            0   1   2   3
Pointer:            ▲
                    i
```
* **Character**: `s[2]` -> `")"`
* **Decision**: Closing parenthesis found, but no `'('` is waiting (`closeNeeded = 0`). This Follower is unmatched. Increment `openNeeded` (we must insert an opening parenthesis).
* **Next**: `openNeeded` becomes 1. `i` becomes 3.

#### **Step 3: i = 3**
```text
Pointers: i = 3, openNeeded = 1, closeNeeded = 0
String:   " (   )   )   ( "
            0   1   2   3
Pointer:                ▲
                        i
```
* **Character**: `s[3]` -> `"("`
* **Decision**: Opening parenthesis found. Needs a matching closing partner. Increment `closeNeeded`.
* **Next**: Loop terminates. `closeNeeded` becomes 1.
* **Final Result**: Returns `openNeeded + closeNeeded` -> `1 + 1 = 2`.
