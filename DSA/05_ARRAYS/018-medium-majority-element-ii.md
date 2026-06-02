# 018. Majority Element II (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **EXTENDED BOYER-MOORE VOTING** - Harder array classic. Tests ability to generalize voting cancellation to track two separate candidates with counts in constant space.

---

### 📝 1. Problem Statement
Given an integer array of size `n`, find all elements that appear more than `⌊n / 3⌋` times.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [3,2,3]`
* **Output**: `[3]`
* **Why**: The size is 3. $\lfloor 3 / 3 floor = 1$. `3` appears two times, which is $> 1$.

#### Test Case 2
* **Input**: `nums = [1,2]`
* **Output**: `[1,2]`
* **Why**: The size is 2. $\lfloor 2 / 3 floor = 0$. Both `1` and `2` appear once, which is $> 0$.

---

### 💬 3. What is This Problem Actually Asking?
We need to find all elements that appear more than one-third of the time. Note that at most **two** elements can satisfy this condition (since $3 \cdot (\lfloor n/3 floor + 1) > n$).

---

### 🌍 4. Real-Life Example
Think of a student assembly where students vote for multiple representatives. If a candidate needs more than one-third of the total votes to win, at most two candidates can win. We can track the top two candidates using two counters, and cancel votes when a third candidate appears.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing the power of dual-candidate tracking:

#### Approach 1: Hash Map Counter
We tally frequencies in a Hash Map and collect all keys whose count exceeds `nums.length / 3`.
* **Pros**: Simple, highly intuitive.
* **Cons**: Requires $O(N)$ auxiliary memory space.

#### Approach 2: Extended Boyer-Moore Voting (Optimal)
> [!NOTE]
> For a detailed conceptual breakdown, mathematical proof, and visual explanation of this algorithm, refer to the [Boyer-Moore Voting Blueprint](../ALGORITHMS/boyer-moore-voting.md).

We track two candidates (`candidate1`, `candidate2`) and their respective counts (`count1`, `count2`).
* For each element in `nums`:
  * If it matches `candidate1`, increment `count1++`.
  * If it matches `candidate2`, increment `count2++`.
  * If `count1 === 0`, assign current element to `candidate1`.
  * If `count2 === 0`, assign current element to `candidate2`.
  * Otherwise, both counts are decremented (cancels votes of both candidates).
* **Confirming counts**: Since the algorithm only yields potential candidates, **we must perform a second pass** to verify if their actual counts exceed $\lfloor n/3 \rfloor$.
* **Pros**: Fast, optimal $O(N)$ runtime, constant $O(1)$ space.
* **Cons**: Highly complex logic, requires a strict second-pass check.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `nums = [1, 2, 1, 3]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `cand1 = null`, `count1 = 0`, `cand2 = null`, `count2 = 0`

#### **Step 1: i = 0 (val = 1)**
* **Action**: `count1 === 0`. `cand1 = 1`, `count1 = 1`.

#### **Step 2: i = 1 (val = 2)**
* **Action**: `count2 === 0`. `cand2 = 2`, `count2 = 1`.

#### **Step 3: i = 2 (val = 1)**
* **Action**: Matches `cand1`. `count1 = 2`.

#### **Step 4: i = 3 (val = 3) - Cancellation!**
* **Action**: Does not match `cand1` or `cand2`.
* **Updates**: Decrement both counts: `count1 = 1`, `count2 = 0`.

#### **Step 5: Second Pass (Verify candidates 1 and 2)**
* **Actual Counts**: `1` appears twice, `2` appears once.
* **Checks**: $\lfloor 4 / 3 floor = 1$. Since `2 (for 1) > 1`, return `[1]`.
* **Result**: Returns `[1]` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function majorityElement(nums: number[]): number[] {
    // ==========================================
    // 1st Approach: Hash Map Counter (O(N) Space)
    // ==========================================
    /*
    const counts = new Map<number, number>();
    const limit = Math.floor(nums.length / 3);
    const result: number[] = [];
    for (let num of nums) counts.set(num, (counts.get(num) || 0) + 1);
    for (let [num, count] of counts.entries()) {
        if (count > limit) result.push(num);
    }
    return result;
    */

    // ==========================================
    // 2nd Approach: Extended Boyer-Moore Voting (Optimal)
    // ==========================================
    let candidate1 = 0;
    let candidate2 = 1; // Must be initialized to different values
    let count1 = 0;
    let count2 = 0;

    // First Pass: Find potential candidates
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        if (num === candidate1) {
            count1++;
        } else if (num === candidate2) {
            count2++;
        } else if (count1 === 0) {
            candidate1 = num;
            count1 = 1;
        } else if (count2 === 0) {
            candidate2 = num;
            count2 = 1;
        } else {
            count1--;
            count2--;
        }
    }

    // Second Pass: Verify candidate frequencies
    count1 = 0;
    count2 = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === candidate1) count1++;
        else if (nums[i] === candidate2) count2++;
    }

    const limit = Math.floor(nums.length / 3);
    const result: number[] = [];
    if (count1 > limit) result.push(candidate1);
    if (count2 > limit) result.push(candidate2);

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Hash Map | Approach 2: Extended Boyer-Moore |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Two linear passes. | **$O(N)$** — Two linear passes. |
| **Space Complexity** | **$O(N)$** — Hash Map allocation memory. | **$O(1)$** — Constant variables, zero arrays. |

#### Edge Cases Handled:
* **All elements are unique**: Second pass filters out candidate lists, returning empty `[]` successfully (Correct).
