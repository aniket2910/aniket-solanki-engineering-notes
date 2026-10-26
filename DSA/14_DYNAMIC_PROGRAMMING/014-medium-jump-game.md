# 014. Jump Game (Medium)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 55](https://leetcode.com/problems/jump-game/)

**Interview Tag**: 🔥 **MUST SOLVE** - Listed under DP, best solved **greedily**. Say both: the DP is $O(n^2)$, the farthest-reach greedy is $O(n)$.

---

### 📝 1. Problem Statement
You start at index `0` of `nums`. `nums[i]` is the **maximum** jump length from index `i`. Return `true` if you can reach the last index.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [2,3,1,1,4]`
* **Output**: `true`
* **Why**: 0 → 1 → 4.

#### Test Case 2
* **Input**: `nums = [3,2,1,0,4]`
* **Output**: `false`
* **Why**: Every path lands on index 3, whose jump length is 0.

#### Test Case 3
* **Input**: `nums = [0]`
* **Output**: `true`
* **Why**: You start on the last index.

---

### 💬 3. What is This Problem Actually Asking?
Track the **farthest index reachable** so far. Walk left to right; if you ever stand on an index beyond that reach, you're stuck. Otherwise extend the reach with `i + nums[i]`.

---

### 🌍 4. Real-Life Example
**Crossing a river on stepping stones** where each stone says how far you can leap from it. You don't plan exact jumps; you just keep track of the farthest stone you could possibly get to. If that reach ever stops short of the next stone, you can't cross.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: DP
`canReach[i]` is true if some earlier reachable `j` has `j + nums[j] >= i`. $O(n^2)$.

#### Approach 2: Greedy farthest reach (optimal)
`reach = max(reach, i + nums[i])` while `i <= reach`. If `reach >= n - 1`, return `true`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [3,2,1,0,4]`

| `i` | `i ≤ reach`? | `i + nums[i]` | `reach` |
| :---: | :---: | :---: | :---: |
| 0 | yes | 3 | 3 |
| 1 | yes | 3 | 3 |
| 2 | yes | 3 | 3 |
| 3 | yes | 3 | 3 |
| 4 | **no** (4 > 3) | — | stuck |

Returns `false`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function canJump(nums: number[]): boolean {
    let reach = 0; // farthest index we can get to so far

    for (let i = 0; i < nums.length; i++) {
        if (i > reach) return false;             // this index can't be reached
        reach = Math.max(reach, i + nums[i]);
        if (reach >= nums.length - 1) return true;
    }
    return true;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n)$**.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **Single element**: already at the end.
* **A zero you can jump over** (`[2,0,0]`): reach from index 0 is 2, enough.
* **A zero you must land on** (`[3,2,1,0,4]`): reach stalls at 3.
