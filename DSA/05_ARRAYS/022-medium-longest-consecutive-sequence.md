# 022. Longest Consecutive Sequence (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **HASH SET SEQUENCE STARTING** - Classic set-lookup challenge. Tests understanding of boundary start conditions to avoid quadratic sweeps.

---

### 📝 1. Problem Statement
Given an unsorted array of integers `nums`, return *the length of the longest consecutive elements sequence*.

You must write an algorithm that runs in `O(n)` time.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [100, 4, 200, 1, 3, 2]`
* **Output**: `4`
* **Why**: The longest consecutive elements sequence is `[1, 2, 3, 4]`. Its length is 4.

#### Test Case 2
* **Input**: `nums = [0,3,7,2,5,8,4,6,0,1]`
* **Output**: `9`
* **Why**: The consecutive sequence is `[0, 1, 2, 3, 4, 5, 6, 7, 8]`. Length is 9.

---

### 💬 3. What is This Problem Actually Asking?
We need to find the longest chain of numbers where each number increases by exactly 1 (e.g. `1 -> 2 -> 3 -> 4`). Crucially, we must solve this in **linear $O(N)$ time**, which rules out simple sorting ($O(N \log N)$).

---

### 🌍 4. Real-Life Example
Imagine you are sorting a stack of loose historical documents labeled by year. Instead of sorting all the thousands of documents first, you dump them into a digital filing system. You scan for any document that starts a decade (e.g. `1990`). If `1989` is present, it's not the start, so you ignore it. If it is the start, you query consecutive years (`1991`, `1992`, `1993`) to find the longest chronological chain.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing how Set lookups achieve linear runtime:

#### Approach 1: Sorting first
We sort the array, then iterate through elements to check if current element is `prev + 1`.
* **Pros**: Simple, constant space.
* **Cons**: Sorting requires $O(N \log N)$ time, which violates the strict $O(N)$ problem constraint.

#### Approach 2: Hash Set Lookup (Optimal)
We dump all numbers into a Hash Set.
* For each number `num` in the set:
  * **Identify sequence start**: Check if `num - 1` is in the set.
  * If `num - 1` is NOT present, then `num` is the **start** of a potential sequence!
  * We then use a loop to check if `num + 1`, `num + 2`, etc. are in the set, and update our max streak length.
  * If `num - 1` IS present, we skip it (since it's already counted in an earlier sequence).
* **Pros**: Optimal $O(N)$ runtime. Each number is visited at most twice, resulting in a linear search.
* **Cons**: Requires $O(N)$ auxiliary space for the set.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `nums = [100, 4, 1, 3, 2]`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `numSet = Set {100, 4, 1, 3, 2}`, `longestStreak = 0`

#### **Step 1: Check num = 100**
* **Sequence Start**: Is `100 - 1 = 99` in set? No.
* **Updates**: `100` starts a sequence. Loop checks `101`. Not present. Streak is `1`. `longestStreak = max(0, 1) = 1`.

#### **Step 2: Check num = 4**
* **Sequence Start**: Is `4 - 1 = 3` in set? Yes.
* **Updates**: Skip `4` (not a sequence start).

#### **Step 3: Check num = 1**
* **Sequence Start**: Is `1 - 1 = 0` in set? No.
* **Updates**: `1` starts a sequence!
  * Loop checks `2` (present), `3` (present), `4` (present), `5` (not present).
  * Streak is `4` (sequence `1,2,3,4`).
  * `longestStreak = max(1, 4) = 4`.

#### **Step 4: Check num = 3 & 2**
* **Action**: Both are skipped because `3-1` and `2-1` are in the set.
* **Result**: Loop ends. Returns `longestStreak = 4` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function longestConsecutive(nums: number[]): number {
    // ==========================================
    // 1st Approach: Sorting First (O(N log N) Time)
    // ==========================================
    /*
    if (nums.length === 0) return 0;
    nums.sort((a, b) => a - b);
    let longestStreak = 1;
    let currentStreak = 1;
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] !== nums[i - 1]) {
            if (nums[i] === nums[i - 1] + 1) {
                currentStreak++;
            } else {
                longestStreak = Math.max(longestStreak, currentStreak);
                currentStreak = 1;
            }
        }
    }
    return Math.max(longestStreak, currentStreak);
    */

    // ==========================================
    // 2nd Approach: Hash Set Sequence Start (Optimal)
    // ==========================================
    const numSet = new Set<number>(nums);
    let longestStreak = 0;

    for (const num of numSet) {
        // Only start counting streak if 'num' is the first element of a sequence
        if (!numSet.has(num - 1)) {
            let currentNum = num;
            let currentStreak = 1;

            while (numSet.has(currentNum + 1)) {
                currentNum += 1;
                currentStreak += 1;
            }

            longestStreak = Math.max(longestStreak, currentStreak);
        }
    }

    return longestStreak;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Sorting | Approach 2: Hash Set Lookup |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N \log N)$** — Sorting phase. | **$O(N)$** — Average case linear lookup checks. |
| **Space Complexity** | **$O(1)$** — Constant memory variables. | **$O(N)$** — Aux set containing elements. |

#### Edge Cases Handled:
* **Empty Array** (`nums = []`): Returns `0` (Correct).
