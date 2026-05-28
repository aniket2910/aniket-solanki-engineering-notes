# 004. Missing Number (Easy)

---

### 📝 1. Problem Statement
Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [3, 0, 1]`
* **Output**: `8` (Wait, let's verify LeetCode 268 logic: array has length $3$, so numbers are in range `[0, 3]`. The numbers present are `0`, `1`, `3`. The missing number is `2`. Output is `2`.)
* **Corrected Test Case 1**:
  * **Input**: `nums = [3, 0, 1]`
  * **Output**: `2`
  * **Why**: $n = 3$ since there are $3$ numbers, so all numbers are in the range `[0,3]`. `2` is the missing number in the range since it does not appear in `nums`.

#### Test Case 2
* **Input**: `nums = [0, 1]`
* **Output**: `2`
* **Why**: $n = 2$ since there are $2$ numbers, so all numbers are in the range `[0,2]`. `2` is the missing number since it does not appear in `nums`.

#### Test Case 3
* **Input**: `nums = [9,6,4,2,3,5,7,0,1]`
* **Output**: `8`
* **Why**: $n = 9$ since there are $9$ numbers, so all numbers are in the range `[0,9]`. `8` is the missing number since it does not appear in `nums`.

---

### 💬 3. What is This Problem Actually Asking?
We are given an array of size `n` filled with unique numbers from `0` to `n`. 
Since there are `n + 1` possible numbers in that range, but the array only has space for `n` elements, exactly **one** number must be missing. We need to find that missing number.

The optimal constraints are:
* **Linear Time**: We must find the missing number in $O(N)$ time.
* **Constant Space**: We must use only $O(1)$ extra space. (We cannot use a Hash Set or sort the array, as those would take extra memory or $O(N \log N)$ sorting time).

---

### 🌍 4. Real-Life Example
Think of a **numbered deck of cards** from `0` to `n`:
* If you have a deck of cards numbered `0` to `10`, you expect the sum of all cards to be exactly $55$ (which is $0 + 1 + 2 + \dots + 10$).
* If someone steals one card and hands you the remaining 10 cards, you don't need to lay them out and search for the gap. 
* You simply **sum up all the cards in your hand** (e.g., you get $47$).
* The difference ($55 - 47 = 8$) tells you instantly that card number `8` is missing!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: None (scalar integers).
* **Algorithm**: **Gauss's Sum Formula (Summation Math)**.
  * *Why*: The sum of all integers from `0` to `n` is given by the formula:
    $$\text{Expected Sum} = \frac{n \cdot (n + 1)}{2}$$
  * By calculating this expected sum and subtracting the actual sum of all numbers in the array, the remainder is guaranteed to be the missing element.
  * *Alternative Algorithm*: **Bitwise XOR (`^`)**. Since $a \oplus a = 0$, if we XOR all numbers from `0` to `n` and all elements in `nums`, all duplicates cancel out, leaving exactly the missing number. (We implement the Sum Formula because it is the most intuitive and clean).

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function missingNumber(nums: number[]): number {
    const n = nums.length;
    
    // Calculate expected sum of 0 to n using Gauss's Formula
    const expectedSum = (n * (n + 1)) / 2;
    
    // Calculate the actual sum of elements in the array
    let actualSum = 0;
    for (let i = 0; i < nums.length; i++) {
        actualSum += nums[i];
    }
    
    // The difference is the missing number
    return expectedSum - actualSum;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We traverse the array exactly once to calculate the sum of its elements.
* **Space Complexity**: **$O(1)$** — We only allocate a few scalar variables (`expectedSum`, `actualSum`).

#### Edge Cases Handled:
* **Missing Zero** (`nums = [1, 2]`, $n = 2$):
  * `expectedSum = (2 * 3) / 2 = 3`.
  * `actualSum = 1 + 2 = 3`.
  * Returns `3 - 3 = 0` (Correct).
* **Missing $n$** (`nums = [0, 1]`, $n = 2$):
  * `expectedSum = 3`.
  * `actualSum = 1`.
  * Returns `3 - 1 = 2` (Correct).
