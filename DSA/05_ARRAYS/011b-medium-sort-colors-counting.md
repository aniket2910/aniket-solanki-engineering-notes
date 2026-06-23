# 011b. Sort an Array of 0's, 1's, and 2's (Counting Sort) (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft, Salesforce
>
> **Interview Tag**: 🔥 **FREQUENCY COUNTING** - Fundamental counting sort paradigm. Demonstrates count tracking and multi-pass array overwrites.

---

### 📝 1. Problem Statement
Given an array `nums` with `n` objects colored red, white, or blue, sort them **in-place** so that objects of the same color are adjacent, with the colors in the order red, white, and blue.

We will use the integers `0`, `1`, and `2` to represent the color red, white, and blue, respectively. You must solve this **without** using the library's sort function.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [2, 0, 2, 1, 1, 0]`
* **Output**: `[0, 0, 1, 1, 2, 2]`
* **Why**: Tallying gives: two `0`s, two `1`s, and two `2`s. Rewriting yields `[0, 0, 1, 1, 2, 2]`.

---

### 💬 3. What is This Problem Actually Asking?
Tally the frequencies of each unique number, and then overwrite the original array sequentially based on these counts.

---

### 🌍 4. Real-Life Example
Imagine a school election where students vote for 3 candidate colors. Instead of sorting all voting ballots physically by hands, the teller counts the total tallies on a blackboard, and then prints new lists representing the exact candidate tallies sequentially.

---

### 🛠️ 5. Data Structure & Algorithms Used

We contrast the counting pass with an alternative partition scheme:

#### Approach 1: Dutch National Flag Algorithm (Single-Pass Partition)
We sort the array using three pointers to partition the array in one pass.
* **Pros**: Single pass, zero array writes.
* **Cons**: Slightly complex pointer arithmetic and swaps.

#### Approach 2: Counting Sort (Optimal for distinct keys) (Two-Pass)
We record counts of `0`, `1`, and `2` inside three variables or an array of size 3. Then, we write back `0`s, `1`s, and `2`s into the original array.
* **Pros**: Extremely simple logic, very low constant overhead, works beautifully.
* **Cons**: Requires **two passes** over the array (one pass for counting, one pass for writing).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `nums = [2, 0, 1, 0]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `counts = [0, 0, 0]` (mapping keys `0`, `1`, `2`)

#### **Step 1: First Pass - Counting Frequencies**
* **Scan idx 0 (val = 2)**: `counts = [0, 0, 1]`
* **Scan idx 1 (val = 0)**: `counts = [1, 0, 1]`
* **Scan idx 2 (val = 1)**: `counts = [1, 1, 1]`
* **Scan idx 3 (val = 0)**: `counts = [2, 1, 1]`

#### **Step 2: Second Pass - Overwriting Array**
* **Write 0s**: `counts[0] = 2`. Set `nums[0] = 0`, `nums[1] = 0`.
* **Write 1s**: `counts[1] = 1`. Set `nums[2] = 1`.
* **Write 2s**: `counts[2] = 1`. Set `nums[3] = 2`.
* **Result**: `nums` becomes `[0, 0, 1, 2]` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function sortColors(nums: number[]): void {
    // ==========================================
    // 1st Approach: Dutch National Flag (Single Pass)
    // ==========================================
    /*
    let low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] === 0) {
            swap(nums, low, mid);
            low++; mid++;
        } else if (nums[mid] === 1) {
            mid++;
        } else {
            swap(nums, mid, high);
            high--;
        }
    }
    */

    // ==========================================
    // 2nd Approach: Counting Sort (Two-Pass) (Optimal)
    // ==========================================
    let count0 = 0;
    let count1 = 0;
    let count2 = 0;

    // First Pass: Count the occurrences of each color
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === 0) count0++;
        else if (nums[i] === 1) count1++;
        else count2++;
    }

    // Second Pass: Overwrite original array
    let idx = 0;
    for (let i = 0; i < count0; i++) {
        nums[idx++] = 0;
    }
    for (let i = 0; i < count1; i++) {
        nums[idx++] = 1;
    }
    for (let i = 0; i < count2; i++) {
        nums[idx++] = 2;
    }
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Dutch Flag | Approach 2: Counting Sort |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Single pass over array. | **$O(N)$** — Two linear passes over array. |
| **Space Complexity** | **$O(1)$** — Constant variables. | **$O(1)$** — Fixed frequency storage counters. |

#### Edge Cases Handled:
* **Empty Array**: Length check prevents index boundary errors.
* **Single Color Only** (`[2, 2, 2]`): Tallies correctly and outputs `[2, 2, 2]` (Correct).
