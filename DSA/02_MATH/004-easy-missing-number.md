# 004. Missing Number (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft, Google
>
> **Interview Tag**: 🔥 **MUST SOLVE** - A staple of bitwise operations and mathematical induction. Teaches you two completely different ways of thinking about numerical arrays.

---

### 📝 1. Problem Statement
Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [3, 0, 1]`
* **Output**: `2`
* **Why**: $n = 3$ since there are $3$ numbers, so all numbers are in the range `[0, 3]`. `2` is the missing number in the range since it does not appear in `nums`.

#### Test Case 2
* **Input**: `nums = [0, 1]`
* **Output**: `2`
* **Why**: $n = 2$ since there are $2$ numbers, so all numbers are in the range `[0, 2]`. `2` is the missing number since it does not appear in `nums`.

#### Test Case 3
* **Input**: `nums = [9,6,4,2,3,5,7,0,1]`
* **Output**: `8`

---

### 💬 3. What is This Problem Actually Asking?
We are given an array of size `n` filled with unique numbers from `0` to `n`. 
Since there are `n + 1` possible numbers in that range, but the array only has space for `n` elements, exactly **one** number must be missing. We need to find that missing number.

---

### 🌍 4. Real-Life Example
Think of a **numbered deck of cards** from `0` to `n`:
* If you have a deck of cards numbered `0` to `10`, you expect the sum of all cards to be exactly $55$ (which is $0 + 1 + 2 + \dots + 10$).
* If someone steals one card and hands you the remaining 10 cards, you don't need to lay them out and search for the gap. 
* You simply **sum up all the cards in your hand** (e.g., you get $47$).
* The difference ($55 - 47 = 8$) tells you instantly that card number `8` is missing!

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two highly optimal, constant-space approaches** that demonstrate strong mathematical and bitwise intuition:

#### Approach 1: Gauss's Sum Formula (Summation Math)
The sum of all integers from `0` to `n` is given by:
$$\text{Expected Sum} = \frac{n \cdot (n + 1)}{2}$$
By calculating this expected sum and subtracting the actual sum of all numbers in the array, the remainder is guaranteed to be the missing element.
* **Pros**: Incredibly intuitive and clean.
* **Cons**: Intermediate sum of $n \cdot (n+1)$ can overflow in languages with bounded integers if $n$ is extremely large (though not a problem in JS/TS double-precision floats).

#### Approach 2: Bitwise XOR (`^`)
We use the fundamental XOR identity: $x \oplus x = 0$ and $x \oplus 0 = x$.
If we XOR all index positions from `0` to `n` and all values inside `nums`, every number present will appear twice (once as an index, once as a value) and cancel out to `0`. The only number that appears once (only as an index) is the missing number!
* **Pros**: Prevents any potential integer overflow entirely! Highly appreciated by low-level systems interviewers.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace the bitwise XOR self-cancellation step-by-step. By XORing every index and value together, matching numbers cancel out to `0`, leaving only the single missing number.

We use the input: `nums = [3, 0, 1]` (length $n = 3$, indices `0, 1, 2`).

#### **Step 0: Initial State**
```text
n = 3
ans = 3 (Initialized to n)
```

#### **Step 1: Index i = 0**
* **Current Element**: `nums[0] = 3`
* **XOR Calculation**:
  ```text
  ans = ans ^ i ^ nums[i]
      = 3 ^ 0 ^ 3
      = (3 ^ 3) ^ 0   (Self-cancellation)
      = 0 ^ 0
      = 0
  ```
* **Result**: `ans = 0`.

#### **Step 2: Index i = 1**
* **Current Element**: `nums[1] = 0`
* **XOR Calculation**:
  ```text
  ans = ans ^ i ^ nums[i]
      = 0 ^ 1 ^ 0
      = (0 ^ 0) ^ 1   (Identity)
      = 0 ^ 1
      = 1
  ```
* **Result**: `ans = 1`.

#### **Step 3: Index i = 2**
* **Current Element**: `nums[2] = 1`
* **XOR Calculation**:
  ```text
  ans = ans ^ i ^ nums[i]
      = 1 ^ 2 ^ 1
      = (1 ^ 1) ^ 2   (Self-cancellation)
      = 0 ^ 2
      = 2
  ```
* **Result**: `ans = 2`.

#### **Step 4: Loop Termination**
* Loop exits because `i` reaches `n` (3).
* Returns `ans` (**`2`**), which is indeed the missing number!

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to show a clear progression of thought!

```typescript
function missingNumber(nums: number[]): number {
    // ==========================================
    // 1st Approach: Gauss Sum Formula (Summation Math)
    // ==========================================
    /*
    let n = nums.length;
    let expectedSum = (n * (n + 1)) / 2;
    let actualSum = 0;
    for (let i = 0; i < nums.length; i++) {
        actualSum += nums[i];
    }
    return expectedSum - actualSum;
    */

    // ==========================================
    // 2nd Approach: Bitwise XOR (Self-Cancellation)
    // ==========================================
    let n = nums.length;
    let ans = n; // Start with n because indices only go from 0 to n-1 in the loop

    for (let i = 0; i < n; i++) {
        ans = ans ^ i ^ nums[i];
    }

    return ans;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Gauss Sum | Approach 2: Bitwise XOR |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Single pass over array. | **$O(N)$** — Single pass over array. |
| **Space Complexity** | **$O(1)$** — Constant variables. | **$O(1)$** — Constant variables. |

#### Edge Cases Handled:
* **Missing Zero** (`nums = [1, 2]`, $n = 2$): Returns `0` (Correct).
* **Missing $n$** (`nums = [0, 1]`, $n = 2$): Returns `2` (Correct).
