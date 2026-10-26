# 003. Lemonade Change (Easy)

**Sheet**: Namaste DSA · 12. Greedy Algorithm · [LeetCode 860](https://leetcode.com/problems/lemonade-change/)

**Interview Tag**: Greedy as a **simulation**. The one decision that matters: when giving 15 change, prefer a 10.

---

### 📝 1. Problem Statement
Lemonade costs $5. Customers queue up and each pays with a single $5, $10 or $20 bill (`bills[i]`). You start with **no change**. Return `true` if you can give every customer correct change, in order.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `bills = [5,5,5,10,20]`
* **Output**: `true`

#### Test Case 2
* **Input**: `bills = [5,5,10,10,20]`
* **Output**: `false`
* **Why**: After the two 10s you hold one 10 and no 5s, and the 20 needs $15 back.

#### Test Case 3
* **Input**: `bills = [10,10]`
* **Output**: `false`
* **Why**: The very first customer needs $5 change and you have none.

#### Test Case 4
* **Input**: `bills = [5,5,10]`
* **Output**: `true`

---

### 💬 3. What is This Problem Actually Asking?
Track how many $5 and $10 bills are in the drawer. For $15 change there are two options, `10 + 5` or `5 + 5 + 5`. Use the **10 first**, because 5s are useful for every kind of change and 10s are only useful here.

---

### 🌍 4. Real-Life Example
A **cash register** at a street stall. A smart vendor hands out the larger notes as change whenever they can and keeps the small notes, since small notes are what you run out of first.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: two counters, `fives` and `tens` (20s are never given back as change, so no counter).
* **Algorithm**: **Greedy simulation**:
  * $5 → `fives++`.
  * $10 → need one 5.
  * $20 → `10 + 5` if possible, else `5 + 5 + 5`, else fail.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `bills = [5,5,10,10,20]`

| bill | change due | action | `fives` | `tens` |
| :---: | :---: | :--- | :---: | :---: |
| 5 | 0 | keep | 1 | 0 |
| 5 | 0 | keep | 2 | 0 |
| 10 | 5 | give a 5 | 1 | 1 |
| 10 | 5 | give a 5 | 0 | 2 |
| 20 | 15 | need 10 + 5, have no 5 | — | — |

Returns `false`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function lemonadeChange(bills: number[]): boolean {
    let fives = 0;
    let tens = 0;

    for (const bill of bills) {
        if (bill === 5) {
            fives++;
        } else if (bill === 10) {
            if (fives === 0) return false;
            fives--;
            tens++;
        } else {
            // $20: give 10 + 5 when possible, keeping 5s for later customers
            if (tens > 0 && fives > 0) {
                tens--;
                fives--;
            } else if (fives >= 3) {
                fives -= 3;
            } else {
                return false;
            }
        }
    }
    return true;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n)$**.
* **Space Complexity**: **$O(1)$**.

#### Edge Cases Handled:
* **First customer pays with 10 or 20**: no change in the drawer, `false`.
* **Choosing 5+5+5 first** would fail on `[5,5,5,10,20]`-style inputs where a later 10 needs a 5.
