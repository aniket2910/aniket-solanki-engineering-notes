# 015. Jump Game II (Medium)

**Sheet**: Namaste DSA · 13. Dynamic Programming · [LeetCode 45](https://leetcode.com/problems/jump-game-ii/)

**Interview Tag**: 🔥 **MUST SOLVE** - The **minimum** number of jumps, solved as an implicit **BFS by levels** in $O(n)$.

---

### 📝 1. Problem Statement
You start at index `0`; `nums[i]` is the maximum jump length from index `i`. The last index is always reachable. Return the **minimum number of jumps** to reach it.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [2,3,1,1,4]`
* **Output**: `2`
* **Why**: 0 → 1 → 4.

#### Test Case 2
* **Input**: `nums = [2,3,0,1,4]`
* **Output**: `2`

#### Test Case 3
* **Input**: `nums = [0]`
* **Output**: `0`

#### Test Case 4
* **Input**: `nums = [1,1,1,1]`
* **Output**: `3`

---

### 💬 3. What is This Problem Actually Asking?
Think in **levels**: level 0 is index 0; level 1 is every index one jump can reach; level 2 is every index reachable from level 1, and so on. The answer is the level that contains the last index. Because levels are contiguous ranges, you only need two numbers: where the current level **ends**, and the **farthest** reach found while scanning it.

---

### 🌍 4. Real-Life Example
**Hopping between train lines** with as few changes as possible. From the stations you can reach with 1 ride, note the farthest anyone can get with a 2nd ride. When you've considered all 1-ride stations, you've used 2 rides to get as far as that farthest point.

---

### 🛠️ 5. Data Structure & Algorithms Used

#### Approach 1: DP
`minJumps[i] = 1 + min(minJumps[j])` over `j` that can reach `i`. $O(n^2)$.

#### Approach 2: Greedy BFS levels (optimal)
* `farthest = max(farthest, i + nums[i])` while scanning.
* When `i` reaches `currentEnd` (end of this level), take a jump: `jumps++`, `currentEnd = farthest`.
* Scan only to `n - 2`: once the last index is inside a level, no extra jump is needed.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `nums = [2,3,1,1,4]`

| `i` | `i + nums[i]` | `farthest` | `i === currentEnd`? | `jumps` | `currentEnd` |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 0 | 2 | 2 | yes | 1 | 2 |
| 1 | 4 | 4 | no | 1 | 2 |
| 2 | 3 | 4 | yes | 2 | 4 |
| 3 | 4 | 4 | no | 2 | 4 |

Returns `2`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function jump(nums: number[]): number {
    let jumps = 0;
    let currentEnd = 0; // last index reachable with `jumps` jumps
    let farthest = 0;   // farthest index reachable with one more jump

    for (let i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        if (i === currentEnd) {
            // Finished scanning this level: jump to the next one
            jumps++;
            currentEnd = farthest;
        }
    }
    return jumps;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n)$**.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **Single element**: loop doesn't run, `0` jumps.
* **All ones**: every index is its own level, `n - 1` jumps.
* **Scanning to `n - 1`** instead of `n - 2` would add a phantom jump when the last index ends a level.
