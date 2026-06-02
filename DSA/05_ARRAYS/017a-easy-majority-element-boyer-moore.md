# 017a. Majority Element I (Boyer-Moore Voting) (Easy)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **BOYER-MOORE VOTING** - Core linear voting algorithm. Excellent for demonstrating how balance-of-power counts can eliminate secondary variables to achieve constant space.

---

### 📝 1. Problem Statement
Given an array `nums` of size `n`, return *the majority element*.

The majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [3,2,3]`
* **Output**: `3`
* **Why**: The size is 3. $\lfloor 3 / 2 floor = 1$. `3` appears two times, which is $> 1$.

#### Test Case 2
* **Input**: `nums = [2,2,1,1,1,2,2]`
* **Output**: `2`
* **Why**: The size is 7. $\lfloor 7 / 2 floor = 3$. `2` appears four times, which is $> 3$.

---

### 💬 3. What is This Problem Actually Asking?
We need to find the element that occupies more than half of the array slots.

---

### 🌍 4. Real-Life Example
Think of a democratic election with multiple candidates. If one candidate has more votes than all other candidates combined, then even if all other voters gang up to vote against them, the majority candidate will still win. In our code, different numbers "cancel each other out" until only the majority number survives.

---

### 🛠️ 5. Data Structure & Algorithms Used

We contrast voting cancellation with frequency tracking:

#### Approach 1: Hash Map Counter
We tally frequencies in a Hash Map. If any count exceeds `nums.length / 2`, return that element.
* **Pros**: Simple, intuitive.
* **Cons**: Requires $O(N)$ auxiliary space for counts.

#### Approach 2: Boyer-Moore Voting Algorithm (Optimal)
> [!NOTE]
> For a detailed conceptual breakdown, mathematical proof, and visual explanation of this algorithm, refer to the [Boyer-Moore Voting Blueprint](../ALGORITHMS/boyer-moore-voting.md).

We maintain a `candidate` and a `count` initialized to `0`.
* As we scan `nums`:
  * If `count === 0`, we pick the current element as our new `candidate`.
  * If the element matches `candidate`, increment `count++`.
  * Otherwise, decrement `count--` (this simulates different elements canceling each other out).
* **Pros**: Extremely fast $O(N)$ runtime, $O(1)$ constant space.
* **Cons**: Counter-intuitive logic. Works strictly because a majority element is guaranteed to exist.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `nums = [2, 2, 1, 1, 2]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `candidate = null`, `count = 0`

#### **Step 1: i = 0 (val = 2)**
* **State check**: `count === 0`.
* **Updates**: `candidate = 2`, `count = 1`.

#### **Step 2: i = 1 (val = 2)**
* **State check**: Matches candidate `2`.
* **Updates**: `count = 2`.

#### **Step 3: i = 2 (val = 1)**
* **State check**: Does not match candidate `2`.
* **Updates**: `count = 1` (canceled).

#### **Step 4: i = 3 (val = 1)**
* **State check**: Does not match candidate `2`.
* **Updates**: `count = 0` (canceled).

#### **Step 5: i = 4 (val = 2)**
* **State check**: `count === 0`.
* **Updates**: `candidate = 2`, `count = 1`.
* **Result**: Loop terminates. Candidate is `2` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function majorityElement(nums: number[]): number {
    // ==========================================
    // 1st Approach: Hash Map Counter (O(N) Space)
    // ==========================================
    /*
    const counts = new Map<number, number>();
    const limit = Math.floor(nums.length / 2);
    for (let num of nums) {
        counts.set(num, (counts.get(num) || 0) + 1);
        if (counts.get(num)! > limit) return num;
    }
    return -1;
    */

    // ==========================================
    // 2nd Approach: Boyer-Moore Voting (Optimal)
    // ==========================================
    let candidate = nums[0];
    let count = 0;

    for (let i = 0; i < nums.length; i++) {
        if (count === 0) {
            candidate = nums[i];
        }

        if (nums[i] === candidate) {
            count++;
        } else {
            count--;
        }
    }

    return candidate;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Hash Map | Approach 2: Boyer-Moore |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Single pass over array. | **$O(N)$** — Single pass over array. |
| **Space Complexity** | **$O(N)$** — Aux hash map memory allocations. | **$O(1)$** — Constant variables, zero arrays. |

#### Edge Cases Handled:
* **Single Element Array** (`[5]`): Loop executes once, returns `5` (Correct).
