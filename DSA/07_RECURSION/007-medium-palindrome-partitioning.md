# 007. Palindrome Partitioning (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **BACKTRACKING & STRING SUBSECTIONS** - Classical partitioning problem. Tests ability to split search problems into prefix validation (palindrome check) and suffix recurrence.

---

### 📝 1. Problem Statement
Given a string `s`, partition `s` such that every substring of the partition is a **palindrome**. Return **all possible** palindrome partitionings of `s`.

A **palindrome** is a string that reads the same backward as forward.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "aab"`
* **Output**: `[["a", "a", "b"], ["aa", "b"]]`
* **Why**: 
  * `"a"`, `"a"`, and `"b"` are all palindromes.
  * `"aa"` and `"b"` are palindromes.
  * `"aab"` is not a palindrome, nor is `"a"` + `"ab"`.

#### Test Case 2
* **Input**: `s = "a"`
* **Output**: `[["a"]]`

---

### 💬 3. What is This Problem Actually Asking?
We want to split a string into contiguous substrings such that every single substring in our split is symmetric (reads the same forward and backward), and we need to find all possible ways to do this.

---

### 🌍 4. Real-Life Example
Imagine you are slicing a long cake decorated with letters `"racecar"` into pieces to distribute to guests. You want each guest to receive a slice that spells out a symmetric word. You can slice it as `["r", "a", "c", "e", "c", "a", "r"]`, or `["r", "aceca", "r"]`, or leave it as `["racecar"]` in one piece.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach: Backtracking with Substring Validation
We use a depth-first search (DFS) backtracking template:
1. **Recursion parameters**: `backtrack(start, path)` where `start` is the current character index we are partitioning, and `path` stores the current list of palindromic substrings.
2. **Base Case**: If `start === s.length`, we have successfully partitioned the entire string. Save the current path configuration.
3. **Partition Scanning**: Loop through all possible split locations `i` from `start` to `s.length - 1`:
   * Extract the prefix substring `s.substring(start, i + 1)`.
   * Check if this prefix is a palindrome.
   * If it is a palindrome, it is a valid slice! Push it to `path` and recurse for the suffix: `backtrack(i + 1, path)`.
   * Pop the slice (backtrack) to explore alternative partition locations.

* **Pros**: Simple, complete search, uses optimal $O(N)$ stack space.
* **Cons**: Checking for palindromes repeatedly takes $O(N)$ time per check. This can be optimized by precomputing a 2D dynamic programming lookup table for palindrome checks, but is often unnecessary for normal interview constraints.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run the partitioning of `s = "aab"`.

```text
                           Root: backtrack(start=0, path=[])
                          /                               \
               (i=0, prefix="a")                   (i=1, prefix="aa")
                    /                                       \
        backtrack(s=1, ["a"])                      backtrack(s=2, ["aa"])
             /                 \                             \
      (i=1, pref="a")      (i=2, pref="ab" X)          (i=2, pref="b")
           /                                                  \
   backtrack(s=2, ["a","a"])                          backtrack(s=3, ["aa","b"])
         /                                                [Base Case] Save!
  (i=2, pref="b")
       /
backtrack(s=3, ["a","a","b"])
[Base Case] Save!
```

#### **Step 1: start = 0**
* `i = 0`: Substring `s[0..0]` is `"a"`. Palindrome! Recurse to `backtrack(1, ["a"])`.
* `i = 1`: Substring `s[0..1]` is `"aa"`. Palindrome! Recurse to `backtrack(2, ["aa"])`.
* `i = 2`: Substring `s[0..2]` is `"aab"`. Not a palindrome.

#### **Step 2: Trace branch `backtrack(1, ["a"])`**
* `i = 1`: Substring `s[1..1]` is `"a"`. Palindrome! Recurse to `backtrack(2, ["a", "a"])`.
* `i = 2`: Substring `s[1..2]` is `"ab"`. Not a palindrome.

#### **Step 3: Trace branch `backtrack(2, ["a", "a"])`**
* `i = 2`: Substring `s[2..2]` is `"b"`. Palindrome! Recurse to `backtrack(3, ["a", "a", "b"])`.
  * `start = 3` (equals `s.length`) $\rightarrow$ Save `["a", "a", "b"]`.

#### **Step 4: Trace branch `backtrack(2, ["aa"])`**
* `i = 2`: Substring `s[2..2]` is `"b"`. Palindrome! Recurse to `backtrack(3, ["aa", "b"])`.
  * `start = 3` (equals `s.length`) $\rightarrow$ Save `["aa", "b"]`.

Result: `[["a", "a", "b"], ["aa", "b"]]` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function partition(s: string): string[][] {
    const result: string[][] = [];
    const currentPath: string[] = [];
    
    // Helper function to check if a substring is a palindrome
    function isPalindrome(str: string, left: number, right: number): boolean {
        while (left < right) {
            if (str[left] !== str[right]) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
    
    function backtrack(start: number): void {
        // Base Case: successfully partitioned the entire string
        if (start === s.length) {
            result.push([...currentPath]);
            return;
        }
        
        for (let i = start; i < s.length; i++) {
            // Check if the current substring s[start...i] is a palindrome
            if (isPalindrome(s, start, i)) {
                // Choose
                currentPath.push(s.substring(start, i + 1));
                
                // Explore the suffix
                backtrack(i + 1);
                
                // Unchoose (Backtrack)
                currentPath.pop();
            }
        }
    }
    
    backtrack(0);
    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | DFS Backtracking |
| :--- | :--- |
| **Time Complexity** | **$O(2^N \cdot N)$** — There are $2^{N-1}$ possible ways to partition a string of length $N$. For each partition, checking if it is a palindrome and extracting substrings takes $O(N)$ time. |
| **Space Complexity** | **$O(N)$** — Aux recursion call stack depth of $O(N)$ and path array storage of $O(N)$. |

#### Edge Cases Handled:
* **All same characters** (`s = "aaa"`): Correctly generates all combinations: `[["a","a","a"], ["a","aa"], ["aa","a"], ["aaa"]]` (Correct).
* **Single Character String** (`s = "a"`): Base cases return `[["a"]]` immediately (Correct).
* **No palindromes possible other than individual characters** (`s = "abc"`): Returns `[["a", "b", "c"]]` (Correct).
