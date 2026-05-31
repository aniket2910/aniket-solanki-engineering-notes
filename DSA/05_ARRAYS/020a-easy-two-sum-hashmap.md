# 020a. Two Sum (Visited Hash Map) (Easy)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **COMPLEMENT LOOKUP** - The single most famous coding problem. Perfect for demonstrating how hash map index caches resolve nested loops instantly.

---

### 📝 1. Problem Statement
Given an array of integers `nums` and an integer `target`, return *indices of the two numbers such that they add up to `target`*.

You may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice. You can return the answer in any order.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [2,7,11,15]`, `target = 9`
* **Output**: `[0,1]`
* **Why**: Because `nums[0] + nums[1] == 2 + 7 == 9`, we return `[0, 1]`.

#### Test Case 2
* **Input**: `nums = [3,2,4]`, `target = 6`
* **Output**: `[1,2]`
* **Why**: Because `nums[1] + nums[2] == 2 + 4 == 6`, we return `[1, 2]`.

---

### 💬 3. What is This Problem Actually Asking?
We need to find two indices `i` and `j` in the array such that `nums[i] + nums[j] === target` where `i !== j`.

---

### 🌍 4. Real-Life Example
Think of checking bags at a theater coat check. You hold a ticket labeled `9` (target). The check room is filled with coats. As you walk past coats, you check the label of each coat (e.g. `2`). You calculate: *"I need a coat labeled `7` to complete this pair."* If you've already seen coat `7` in the past, you instantly pull it out.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing complement lookup:

#### Approach 1: Brute Force (Nested Loops)
We compare every possible pair of numbers and check if their sum equals the target.
* **Pros**: Simple, constant space.
* **Cons**: Slow ($O(N^2)$).

#### Approach 2: Complement Hash Map Lookup (Optimal)
We maintain a Hash Map storing key-value pairs of `{ number: index }`.
* As we traverse `nums`, we calculate the required complement: `complement = target - nums[i]`.
* If `map.has(complement)`, we instantly return `[map.get(complement), i]`.
* Otherwise, we store `map.set(nums[i], i)`.
* **Pros**: Incredibly fast, optimal $O(N)$ runtime, single pass.
* **Cons**: Requires $O(N)$ auxiliary space.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with `nums = [3, 2, 4]`, `target = 6`.

#### **Step 0: Initial State (Before loop)**
* **Variables**: `numMap = Map {}`

#### **Step 1: i = 0 (val = 3)**
* **State check**: `complement = 6 - 3 = 3`. `numMap.has(3)`? No.
* **Updates**: `numMap.set(3, 0)`. `numMap = Map {3 => 0}`.
* **Next**: `i` advances to index 1.

#### **Step 2: i = 1 (val = 2)**
* **State check**: `complement = 6 - 2 = 4`. `numMap.has(4)`? No.
* **Updates**: `numMap.set(2, 1)`. `numMap = Map {3 => 0, 2 => 1}`.
* **Next**: `i` advances to index 2.

#### **Step 3: i = 2 (val = 4) - Match!**
* **State check**: `complement = 6 - 4 = 2`. `numMap.has(2)`? Yes!
* **Result**: Match found. Returns `[numMap.get(2), 2] = [1, 2]` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
function twoSum(nums: number[], target: number): number[] {
    // ==========================================
    // 1st Approach: Brute Force Nested Loops (O(N^2))
    // ==========================================
    /*
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
    */

    // ==========================================
    // 2nd Approach: Complement Hash Map Lookup (Optimal)
    // ==========================================
    const numMap = new Map<number, number>();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        if (numMap.has(complement)) {
            // Found the matching index complement pair!
            return [numMap.get(complement)!, i];
        }

        // Cache current number and index
        numMap.set(nums[i], i);
    }

    return [];
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Brute Force | Approach 2: Hash Map Lookup |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N^2)$** — Double nested iteration. | **$O(N)$** — Single pass over array. |
| **Space Complexity** | **$O(1)$** — Constant variables. | **$O(N)$** — Aux map matching array size. |

#### Edge Cases Handled:
* **Duplicates Present** (`nums = [3, 3], target = 6`): Loop stores first `3` at index 0. Second `3` complement is `3` (which is in map). Correctly returns `[0, 1]` (Correct).
