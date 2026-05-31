# 017b. Majority Element I (Visited Hash Map) (Easy)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **HASH MAP TALLYING** - Fundamental frequency counter. Demonstrates basic mapping structures and early termination threshold conditions.

---

### 📝 1. Problem Statement
Given an array `nums` of size `n`, return *the majority element*.

The majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [3,2,3]`
* **Output**: `3`
* **Why**: Size is 3. Threshold limit is 1. `3` appears twice.

---

### 💬 3. What is This Problem Actually Asking?
Build a count tally for all unique numbers and return the first number whose tally exceeds the length threshold.

---

### 🌍 4. Real-Life Example
Imagine you are sorting a stack of ballot papers by hand. You have an organizer grid of pigeonholes, one for each candidate. As you pick a ballot, you place it in the correct candidate's slot. Once any candidate's slot contains more than half the total ballots, you stop and declare them the winner.

---

### 🛠️ 5. Data Structure & Algorithms Used

We contrast hash maps with Boyer-Moore voting:

#### Approach 1: Boyer-Moore Voting
We cancel out elements in a single pass to achieve $O(1)$ space.
* **Pros**: Incredibly space-efficient.
* **Cons**: More complex, only works when a majority element is guaranteed.

#### Approach 2: Hash Map Counter (Optimal for general counts)
We maintain a Hash Map storing key-value pairs of `{ number: frequency }`.
* As we traverse `nums`, we increment the map frequency.
* If a frequency exceeds `Math.floor(n / 2)`, we instantly return it.
* **Pros**: Simple, highly versatile. Does not assume a majority element is guaranteed (we can easily report if no element fits the criteria).
* **Cons**: Requires $O(N)$ space.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `nums = [3, 2, 3]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `counts = Map {}`, `limit = Math.floor(3 / 2) = 1`

#### **Step 1: i = 0 (val = 3)**
* **Updates**: `counts = Map {3 => 1}`. Frequency of 3 is 1 (not > limit 1).
* **Next**: `i` advances to index 1.

#### **Step 2: i = 1 (val = 2)**
* **Updates**: `counts = Map {3 => 1, 2 => 1}`. Frequency of 2 is 1 (not > limit 1).
* **Next**: `i` advances to index 2.

#### **Step 3: i = 2 (val = 3)**
* **Updates**: `counts = Map {3 => 2, 2 => 1}`.
* **State check**: Frequency of 3 is `2`. Since `2 > limit (1)`, match triggered!
* **Result**: Returns `3` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function majorityElement(nums: number[]): number {
    // ==========================================
    // 1st Approach: Boyer-Moore Voting (O(1) Space)
    // ==========================================
    /*
    let candidate = nums[0];
    let count = 0;
    for (let num of nums) {
        if (count === 0) candidate = num;
        if (num === candidate) count++;
        else count--;
    }
    return candidate;
    */

    // ==========================================
    // 2nd Approach: Hash Map Counter (Optimal)
    // ==========================================
    const counts = new Map<number, number>();
    const limit = Math.floor(nums.length / 2);

    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const currentCount = (counts.get(num) || 0) + 1;
        counts.set(num, currentCount);

        if (currentCount > limit) {
            // Early termination once majority is reached
            return num;
        }
    }

    return -1;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Boyer-Moore | Approach 2: Hash Map Counter |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Single pass over array. | **$O(N)$** — Single pass over array. |
| **Space Complexity** | **$O(1)$** — Constant variables. | **$O(	ext{unique})$** — Map size matches unique items. |

#### Edge Cases Handled:
* **Single Element**: Threshold is 0. Returns first element instantly (Correct).
