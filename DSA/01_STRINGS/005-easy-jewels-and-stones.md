# 005. Jewels and Stones (Easy)

---

### 📝 1. Problem Statement
You're given strings `jewels` representing the types of stones that are jewels, and `stones` representing the stones you have. Each character in `stones` is a type of stone you have. You want to know how many of the stones you have are also jewels.

Letters are case sensitive, so `"a"` is considered a different type of stone from `"A"`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `jewels = "aA"`, `stones = "aAAbbbb"`
* **Output**: `3`
* **Why**: The stones `"a"`, `"A"`, and `"A"` are jewels, so we have `3` jewels in total.

#### Test Case 2
* **Input**: `jewels = "z"`, `stones = "ZZ"`
* **Output**: `0`
* **Why**: `"z"` is a jewel, but we only have `"Z"`. Since letters are case sensitive, `"Z"` is not a jewel.

---

### 💬 3. What is This Problem Actually Asking?
We are given two sets of characters:
1. `jewels`: A string representing which characters are considered "precious".
2. `stones`: A bag of characters we actually own.
We need to count how many of the characters in our `stones` bag exist in the `jewels` list.

The optimal constraints are:
* **Linear Time ($O(J + S)$)**: We must find the answer without nested loops ($O(J \cdot S)$) by utilizing a fast lookup container.

---

### 🌍 4. Real-Life Example
Think of a **customs officer checking baggage at the airport**:
* You are given a **banned item list** (`jewels`): `["Apple", "Banana"]`.
* A passenger has a **bag of fruits** (`stones`): `["Apple", "Apple", "Orange", "Grape"]`.
* Instead of reading the banned list from scratch for every single fruit in the bag, the officer memorizes the banned list once (stores it in a Hash Set).
* Now, the officer looks at each fruit in the passenger's bag and instantly checks: *"Is this in my memory?"*
* Count: `Apple` (Yes), `Apple` (Yes), `Orange` (No), `Grape` (No) $\rightarrow$ Total: `2` banned items!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Hash Set (`Set` in JS/TS)**.
  * *Why*: Reading `jewels` and putting them into a Set takes $O(J)$ time. Once stored in a Set, checking if a stone is a jewel takes constant **$O(1)$ time** per stone.
* **Algorithm**: **Hash Set Lookup & Counter Accumulation**.
  * *Why*: This avoids a nested loop ($O(J \cdot S)$), reducing our overall time complexity to linear time ($O(J + S)$).

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function numJewelsInStones(jewels: string, stones: string): number {
    // Step 1: Store all jewels in a Hash Set for O(1) lookup speed
    const jewelSet = new Set<string>();
    for (let i = 0; i < jewels.length; i++) {
        jewelSet.add(jewels[i]);
    }

    let count: number = 0;

    // Step 2: Iterate through our stones and check if they are in the Set
    for (let i = 0; i < stones.length; i++) {
        if (jewelSet.has(stones[i])) {
            count++;
        }
    }

    return count;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(J + S)$** —
  * Creating the Set takes $O(J)$ time (where $J$ is the length of `jewels`).
  * Scanning the stones and performing lookups takes $O(S)$ time (where $S$ is the length of `stones`).
* **Space Complexity**: **$O(J)$** — The Hash Set holds at most $J$ unique characters in memory.

#### Edge Cases Handled:
* **No Stones** (`stones = ""`): The loop doesn't run. Returns `0` (Correct).
* **Case Sensitivity** (`jewels = "a"`, `stones = "A"`): `Set` contains `"a"`. `Set.has("A")` is false. Returns `0` (Correct).
* **No Jewels Match** (`jewels = "x"`, `stones = "abc"`): Returns `0` (Correct).
