# 006. Partition Labels (Medium)

**Sheet**: Namaste DSA · 12. Greedy Algorithm · [LeetCode 763](https://leetcode.com/problems/partition-labels/)

**Interview Tag**: 🔥 **MUST SOLVE** - "Last occurrence" table + a stretching window. Shows up in many greedy questions.

---

### 📝 1. Problem Statement
Split the string `s` into as **many parts as possible** so that each letter appears in **at most one** part. Return the sizes of the parts, in order.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "ababcbacadefegdehijhklij"`
* **Output**: `[9,7,8]`
* **Why**: `"ababcbaca"`, `"defegde"`, `"hijhklij"`. No letter crosses a boundary.

#### Test Case 2
* **Input**: `s = "eccbbbbdec"`
* **Output**: `[10]`
* **Why**: The first `e` and last `e` force everything into one part.

#### Test Case 3
* **Input**: `s = "abc"`
* **Output**: `[1,1,1]`

---

### 💬 3. What is This Problem Actually Asking?
Once a part contains a letter, it must stretch at least to that letter's **last occurrence**. So walk the string, keep `end = max(last[letter])` over the letters seen in the current part, and cut as soon as your index reaches `end`.

---

### 🌍 4. Real-Life Example
Splitting a **TV series into box sets** so no character's storyline is split across two boxes. As you add episodes, every new character pushes the box's end to their final episode; when you reach that end with no one pushing further, close the box.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: `last[letter]`, the last index of each letter (one pass).
* **Algorithm**: **Greedy window**:
  * `end = max(end, last[s[i]])`.
  * If `i === end`, the current part can close: record `end - start + 1` and start a new part at `i + 1`.
* Cutting at the earliest possible point is what gives the **most** parts.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `s = "eccbbbbdec"` (`last`: e→8, c→9, b→6, d→7)

| `i` | char | `end` | `i === end`? |
| :---: | :---: | :---: | :---: |
| 0 | e | 8 | no |
| 1 | c | 9 | no |
| 2–8 | … | 9 | no |
| 9 | c | 9 | yes → part of size 10 |

Returns `[10]`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function partitionLabels(s: string): number[] {
    const last: Record<string, number> = {};
    for (let i = 0; i < s.length; i++) last[s[i]] = i;

    const sizes: number[] = [];
    let start = 0;
    let end = 0;

    for (let i = 0; i < s.length; i++) {
        end = Math.max(end, last[s[i]]); // this part must reach this letter's last use
        if (i === end) {
            sizes.push(end - start + 1);  // nothing inside reaches further: cut here
            start = i + 1;
        }
    }
    return sizes;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n)$**, two passes.
* **Space Complexity**: **$O(1)$**: at most 26 entries in `last`.

#### Edge Cases Handled:
* **All distinct letters**: every index closes a part, `[1,1,…]`.
* **One letter at both ends**: a single part of the full length.
