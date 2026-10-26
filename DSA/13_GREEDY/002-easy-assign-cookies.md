# 002. Assign Cookies (Easy)

**Sheet**: Namaste DSA · 12. Greedy Algorithm · [LeetCode 455](https://leetcode.com/problems/assign-cookies/)

**Interview Tag**: The first greedy to learn: **sort both, then match with two pointers**.

---

### 📝 1. Problem Statement
Child `i` is happy with a cookie of size at least `g[i]` (their "greed"). Cookie `j` has size `s[j]`. Each child gets at most one cookie and each cookie goes to at most one child. Return the **maximum number of happy children**.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `g = [1,2,3]`, `s = [1,1]`
* **Output**: `1`
* **Why**: Both cookies are size 1, which only satisfies the child with greed 1.

#### Test Case 2
* **Input**: `g = [1,2]`, `s = [1,2,3]`
* **Output**: `2`

#### Test Case 3
* **Input**: `g = [10,9,8,7]`, `s = [5,6,7,8]`
* **Output**: `2`
* **Why**: Cookie 7 → child 7, cookie 8 → child 8. Cookies 5 and 6 are too small for anyone.

---

### 💬 3. What is This Problem Actually Asking?
Give each child the **smallest cookie that still satisfies them**, starting with the least greedy child. That way big cookies are never wasted on children a small cookie would have satisfied.

---

### 🌍 4. Real-Life Example
**Handing out T-shirts** after a race from a pile of mixed sizes. Sort runners from smallest to largest and the shirts the same way; walk both lines, and give each runner the smallest shirt that fits.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structures**: two sorted arrays.
* **Algorithm**: **Greedy + Two Pointers**.
  * `child` points to the least greedy unsatisfied child, `cookie` to the smallest unused cookie.
  * If `s[cookie] >= g[child]`, they match: move both.
  * Otherwise this cookie is too small for this child **and every greedier child**, so throw it away: move only `cookie`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `g = [7,8,9,10]` (sorted), `s = [5,6,7,8]` (sorted)

| `child` (`g`) | `cookie` (`s`) | fits? | happy |
| :---: | :---: | :---: | :---: |
| 0 (7) | 0 (5) | no → next cookie | 0 |
| 0 (7) | 1 (6) | no → next cookie | 0 |
| 0 (7) | 2 (7) | yes | 1 |
| 1 (8) | 3 (8) | yes | 2 |

Out of cookies. Returns `2`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function findContentChildren(g: number[], s: number[]): number {
    g.sort((a, b) => a - b);
    s.sort((a, b) => a - b);

    let child = 0;
    for (let cookie = 0; cookie < s.length && child < g.length; cookie++) {
        if (s[cookie] >= g[child]) child++; // smallest cookie that satisfies this child
        // else: this cookie is too small for every remaining child, skip it
    }
    return child; // number of children satisfied
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n \log n + m \log m)$** for the two sorts; the matching pass is linear.
* **Space Complexity**: **$O(1)$** extra (sorting in place).

#### Edge Cases Handled:
* **No cookies**: returns `0`.
* **Cookies bigger than every greed**: each child still uses just one cookie.
* **Sorting numbers**: JS `sort()` without a comparator sorts as strings (`[10, 9]` stays `[10, 9]`), so the comparator is required.
