# 006. First Bad Version (Easy)

**Sheet**: Namaste DSA · 6. Binary Search Algorithm · [LeetCode 278](https://leetcode.com/problems/first-bad-version/)

**Interview Tag**: 🔥 **MUST SOLVE** - The template for "find the first `true`" (lower-bound binary search). Reused in dozens of problems.

---

### 📝 1. Problem Statement
Versions `1…n` were released in order. One version is bad, and **every version after a bad one is also bad**. Using the provided API `isBadVersion(version)`, find the **first** bad version with as few API calls as possible.

(On LeetCode the function is wrapped as `solution(isBadVersion)(n)`; here `isBadVersion` is simply available, answering for the test case's `bad`.)

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `n = 5`, `bad = 4`
* **Output**: `4`
* **Why**: `isBadVersion(3)` is `false`, `isBadVersion(4)` is `true`.

#### Test Case 2
* **Input**: `n = 1`, `bad = 1`
* **Output**: `1`

#### Test Case 3
* **Input**: `n = 10`, `bad = 1`
* **Output**: `1`

#### Test Case 4
* **Input**: `n = 2126753390`, `bad = 1702766719`
* **Output**: `1702766719`

---

### 💬 3. What is This Problem Actually Asking?
`isBadVersion` over `1…n` looks like `false false … false true true … true`. Find the boundary: the **first `true`**.

---

### 🌍 4. Real-Life Example
**`git bisect`**. A bug appeared somewhere in the last 1,000 commits. You test the middle commit: broken? The bug came in at or before it. Fine? It came in after. About 10 tests find the exact commit.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: Implicit sorted range `[1, n]`.
* **Algorithm**: **Lower-bound Binary Search** (`low < high` form).
  * If `mid` is bad, the first bad is `mid` **or earlier**: `high = mid` (keep `mid`).
  * If `mid` is good, the first bad is after it: `low = mid + 1`.
  * The loop ends when `low === high`, which is the answer. No "found" check is needed inside the loop.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `n = 5`, `bad = 4`

| `low` | `high` | `mid` | `isBadVersion(mid)` | action |
| :---: | :---: | :---: | :---: | :--- |
| 1 | 5 | 3 | false | `low = 4` |
| 4 | 5 | 4 | true | `high = 4` |

`low === high === 4`, return `4`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
/** Provided by the judge: true for every version >= the first bad one. */
declare function isBadVersion(version: number): boolean;

function firstBadVersion(n: number): number {
    let low = 1;
    let high = n;

    while (low < high) {
        const mid = low + Math.floor((high - low) / 2);
        if (isBadVersion(mid)) {
            high = mid;      // mid might be the first bad one: keep it
        } else {
            low = mid + 1;   // everything up to mid is good
        }
    }
    return low; // low === high: the first bad version
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(\log n)$** API calls.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **Version 1 is bad**: `high` keeps moving down to `1`.
* **Only version `n` is bad**: `low` keeps moving up to `n`.
* **Infinite loop trap**: with `high = mid`, the midpoint must round **down**; rounding up with `low < high` would repeat `mid === high` forever.
