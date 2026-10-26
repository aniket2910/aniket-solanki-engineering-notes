# 011. Candy (Hard)

**Sheet**: Namaste DSA · 12. Greedy Algorithm · [LeetCode 135](https://leetcode.com/problems/candy/)

**Interview Tag**: 🔥 **MUST SOLVE** - The **two-pass** greedy: satisfy the left neighbour, then the right, and take the max.

---

### 📝 1. Problem Statement
Children stand in a line with ratings `ratings[i]`. Give out candies so that:
* every child gets **at least one**, and
* a child with a **higher rating than a neighbour** gets **more** candies than that neighbour.

Return the minimum total number of candies.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `ratings = [1,0,2]`
* **Output**: `5`
* **Why**: Candies `[2,1,2]`.

#### Test Case 2
* **Input**: `ratings = [1,2,2]`
* **Output**: `4`
* **Why**: Candies `[1,2,1]`. Equal ratings don't need equal candies.

#### Test Case 3
* **Input**: `ratings = [1,3,2,2,1]`
* **Output**: `7`
* **Why**: Candies `[1,2,1,2,1]`.

---

### 💬 3. What is This Problem Actually Asking?
Each child has two constraints, one per neighbour. Handle them separately:
* **Left pass**: if `ratings[i] > ratings[i-1]`, child `i` needs `left[i-1] + 1`.
* **Right pass**: if `ratings[i] > ratings[i+1]`, child `i` needs `right[i+1] + 1`.

Each child gets the larger of the two, which satisfies both sides with nothing extra.

---

### 🌍 4. Real-Life Example
**Ranking salaries on a team** where each person only compares themselves with the desks next to them. HR walks the row once making sure everyone earns more than a lower-rated person on their left, then walks back making the same check on the right, raising pay only where needed.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: one `candies` array.
* **Algorithm**: **Two-pass greedy**:
  1. Fill with `1`.
  2. Left to right: `if r[i] > r[i-1]: c[i] = c[i-1] + 1`.
  3. Right to left: `if r[i] > r[i+1]: c[i] = max(c[i], c[i+1] + 1)`.
* The `max` in pass 3 is the key: it keeps what pass 2 established.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `ratings = [1,3,2,2,1]`

| pass | `c[0]` | `c[1]` | `c[2]` | `c[3]` | `c[4]` |
| :--- | :---: | :---: | :---: | :---: | :---: |
| start | 1 | 1 | 1 | 1 | 1 |
| left → right | 1 | 2 | 1 | 1 | 1 |
| right → left | 1 | 2 | 1 | 2 | 1 |

Sum `7`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function candy(ratings: number[]): number {
    const n = ratings.length;
    const candies = new Array(n).fill(1);

    // Higher than the left neighbour → one more than them
    for (let i = 1; i < n; i++) {
        if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;
    }
    // Higher than the right neighbour → one more than them, without breaking the left rule
    for (let i = n - 2; i >= 0; i--) {
        if (ratings[i] > ratings[i + 1]) candies[i] = Math.max(candies[i], candies[i + 1] + 1);
    }

    return candies.reduce((sum, c) => sum + c, 0);
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n)$**, three passes.
* **Space Complexity**: **$O(n)$** for `candies`. (An $O(1)$-space slope-counting version exists, but it's rarely expected.)

#### Edge Cases Handled:
* **Equal neighbours**: no constraint between them, so either can have fewer.
* **Strictly decreasing**: the right pass builds `n, n-1, …, 1`.
* **Single child**: `1`.
