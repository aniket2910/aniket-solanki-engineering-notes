# 016. Celebrity Problem (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft, Google
>
> **Interview Tag**: Candidate Elimination - A clever application of stack-based pruning. Tests your ability to establish relationships and prune possibilities in linear time.

---

### 📝 1. Problem Statement
A celebrity is a person who is known to everyone but does not know anyone at a party. You are given a helper function `knows(A, B)` which returns `true` if `A` knows `B`, and `false` otherwise. 

Your task is to find the celebrity at a party of `N` people (numbered from `0` to `N - 1`). If there is a celebrity, return their index. If there is no celebrity, return `-1`.

You should minimize the number of calls to the helper function `knows`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `N = 3`, `matrix = [[0, 1, 0], [0, 0, 0], [0, 1, 0]]` (where `matrix[i][j] == 1` means `i knows j`)
* **Output**: `1`
* **Why**:
  * Person 0 knows Person 1.
  * Person 2 knows Person 1.
  * Person 1 knows no one (row 1 is all 0).
  * Person 1 is the celebrity.

#### Test Case 2
* **Input**: `N = 3`, `matrix = [[0, 1, 0], [1, 0, 0], [0, 1, 0]]`
* **Output**: `-1`
* **Why**: Person 1 knows Person 0 (`matrix[1][0] == 1`), so Person 1 is not a celebrity (celebrities know no one).

---

### 💬 3. What is This Problem Actually Asking?
We need to find an element in a directed graph that has an in-degree of $N - 1$ (everyone points to it) and an out-degree of $0$ (it points to no one).
Instead of checking all pairs (which takes $O(N^2)$ queries), we want to eliminate candidates dynamically.

---

### 🌍 4. Real-Life Example
Think of a **room full of people, with one famous VIP**:
* If you pick any two people, `A` and `B`, and ask `A`: *"Do you know B?"*
  * If `A` says **Yes**: `A` cannot be the VIP (because the VIP knows no one).
  * If `A` says **No**: `B` cannot be the VIP (because everyone must know the VIP).
* With just one question, you have successfully eliminated one person! You repeat this until only one person is left.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present two approaches:
1. **Stack-Based Pruning** (Classical stack representation):
   * Push all $N$ people onto a stack.
   * While the stack has more than 1 person:
     * Pop the top two people, `A` and `B`.
     * If `knows(A, B)` is `true`:
       * `A` knows `B` $\implies$ `A` is not celebrity. Push `B` back.
     * Else:
       * `A` does not know `B` $\implies$ `B` is not celebrity. Push `A` back.
   * The last remaining person is the `candidate`. We verify them in $O(N)$ time.
2. **Two-Pointer Pruning** (Optimized to $O(1)$ space):
   * Keep a `left` pointer at 0 and a `right` pointer at $N - 1$.
   * While `left < right`:
     * If `knows(left, right)` is `true`, `left++`.
     * Else, `right--`.
   * Verify the candidate at index `left`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Dry run with `N = 3` and stack: `stack = [0, 1, 2]`. Matrix is `[[0, 1, 0], [0, 0, 0], [0, 1, 0]]` (Person 1 is celebrity).

#### **Step 1: Pop top two**
* Pop `A = 2`, `B = 1`.
* Check: Does `knows(2, 1)`? Yes (`matrix[2][1] == 1`).
* Person 2 is eliminated. Push `1` back.
* Stack = `[0, 1]`

#### **Step 2: Pop top two**
* Pop `A = 1`, `B = 0`.
* Check: Does `knows(1, 0)`? No (`matrix[1][0] == 0`).
* Person 0 is eliminated. Push `1` back.
* Stack = `[ 1 ]`.

#### **Step 3: Verification**
* Candidate = `1`.
* Check: Does `1` know anyone? `knows(1, 0)` = false, `knows(1, 2)` = false. (Passes).
* Check: Does everyone know `1`? `knows(0, 1)` = true, `knows(2, 1)` = true. (Passes).
* Output: `1`

---

### 💻 6. Optimal Code (TypeScript)

```typescript
// Mock API helper representing matrix lookups in real interviews
type KnowsAPI = (a: number, b: number) => boolean;

function findCelebrity(n: number, knows: KnowsAPI): number {
    const stack: number[] = [];

    // Step 1: Push all people onto stack
    for (let i = 0; i < n; i++) {
        stack.push(i);
    }

    // Step 2: Eliminate candidates
    while (stack.length > 1) {
        const a = stack.pop()!;
        const b = stack.pop()!;

        if (knows(a, b)) {
            // 'a' knows 'b', so 'a' cannot be celebrity
            stack.push(b);
        } else {
            // 'a' does not know 'b', so 'b' cannot be celebrity
            stack.push(a);
        }
    }

    if (stack.length === 0) return -1;
    const candidate = stack.pop()!;

    // Step 3: Verify the candidate
    for (let i = 0; i < n; i++) {
        if (i !== candidate) {
            // Celebrity must know no one, and everyone must know celebrity
            if (knows(candidate, i) || !knows(i, candidate)) {
                return -1;
            }
        }
    }

    return candidate;
}

/**
 * Alternative O(1) Space Two-Pointer Solution
 */
function findCelebrityTwoPointer(n: number, knows: KnowsAPI): number {
    let left = 0;
    let right = n - 1;

    while (left < right) {
        if (knows(left, right)) {
            left++;
        } else {
            right--;
        }
    }

    const candidate = left;

    // Verify
    for (let i = 0; i < n; i++) {
        if (i !== candidate) {
            if (knows(candidate, i) || !knows(i, candidate)) {
                return -1;
            }
        }
    }

    return candidate;
}
```

---

### 📊 7. Complexity & Edge Cases

| Approach | Time Complexity | Space Complexity |
| :--- | :---: | :---: |
| **Stack-Based** | **$O(N)$** | **$O(N)$** |
| **Two-Pointer** | **$O(N)$** | **$O(1)$** |

#### Edge Cases Handled:
* **No Celebrity Exists**: Prunes down to a candidate, but verification step detects they either know someone or are unknown to someone. Returns `-1`. Correct.
* **Single Person Party** (`N = 1`): Verification loops do not execute, returns `0` (the only person is logically the celebrity). Correct.
