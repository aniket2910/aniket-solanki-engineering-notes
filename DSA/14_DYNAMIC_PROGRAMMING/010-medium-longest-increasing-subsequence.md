# 010. Longest Increasing Subsequence (Medium)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 300](https://leetcode.com/problems/longest-increasing-subsequence/)

**Interview Tag**: 🔥 **MUST SOLVE** - Know both answers: the $O(n^2)$ DP, and the $O(n \log n)$ "patience sorting" with binary search.

---

### 📝 1. Problem Statement
Given an integer array `nums`, return the length of the longest **strictly increasing subsequence** (elements in order, not necessarily adjacent).

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [10,9,2,5,3,7,101,18]`
* **Output**: `4`
* **Why**: e.g. `[2,3,7,101]`.

#### Test Case 2
* **Input**: `nums = [0,1,0,3,2,3]`
* **Output**: `4`
* **Why**: `[0,1,2,3]`.

#### Test Case 3
* **Input**: `nums = [7,7,7,7,7,7,7]`
* **Output**: `1`
* **Why**: Strictly increasing, so equal values can't both be used.

---

### 💬 3. What is This Problem Actually Asking?
**DP view**: `len[i]` = longest increasing subsequence **ending at `i`** = `1 + max(len[j])` for every earlier `j` with `nums[j] < nums[i]`.

**Faster view**: keep `tails[k]` = the **smallest possible last value** of an increasing subsequence of length `k + 1`. Each new number either extends the longest one or replaces a tail to make it smaller (and easier to extend later).

---

### 🌍 4. Real-Life Example
**Patience solitaire**: deal cards one by one onto piles, placing each card on the leftmost pile whose top card is bigger or equal (or starting a new pile on the right). The number of piles at the end equals the longest increasing run you could pick out of the deck.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: $O(n^2)$ DP
Double loop over `i` and `j < i`. Easy to explain, enough for $n \le 2500$.

#### Approach 2: Tails + binary search (optimal)
For each `x`, binary-search the first tail `>= x` (lower bound):
* none → push `x` (a longer subsequence exists now);
* found at `k` → `tails[k] = x` (same length, smaller ending).

The answer is `tails.length`. `tails` itself is not the subsequence, only its length is right.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [10,9,2,5,3,7,101,18]`

| `x` | action | `tails` |
| :---: | :--- | :--- |
| 10 | push | [10] |
| 9 | replace 10 | [9] |
| 2 | replace 9 | [2] |
| 5 | push | [2,5] |
| 3 | replace 5 | [2,3] |
| 7 | push | [2,3,7] |
| 101 | push | [2,3,7,101] |
| 18 | replace 101 | [2,3,7,18] |

Returns `4`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function lengthOfLIS(nums: number[]): number {
    // tails[k] = smallest last value of any increasing subsequence of length k + 1
    const tails: number[] = [];

    for (const x of nums) {
        // Lower bound: first tail >= x
        let low = 0;
        let high = tails.length;
        while (low < high) {
            const mid = Math.floor((low + high) / 2);
            if (tails[mid] < x) low = mid + 1;
            else high = mid;
        }
        if (low === tails.length) tails.push(x); // x extends the longest subsequence
        else tails[low] = x;                     // same length, smaller ending
    }
    return tails.length;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n \log n)$**.
* **Space Complexity**: **$O(n)$** for `tails`.

#### Edge Cases Handled:
* **All equal values**: lower bound (`>=`) replaces instead of pushing, so the answer stays `1` (strictness).
* **Already sorted**: every element is pushed, answer `n`.
* **Single element**: `1`.
