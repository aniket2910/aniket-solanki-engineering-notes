# 005. Single Number (Easy)

---

### 📝 1. Problem Statement
Given a **non-empty** array of integers `nums`, every element appears twice except for one. Find that single one.

You must implement a solution with a linear runtime complexity ($O(N)$) and use only constant extra space ($O(1)$).

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [2, 2, 1]`
* **Output**: `1`

#### Test Case 2
* **Input**: `nums = [4, 1, 2, 1, 2]`
* **Output**: `4`

#### Test Case 3
* **Input**: `nums = [1]`
* **Output**: `1`

---

### 💬 3. What is This Problem Actually Asking?
We are given an array of numbers. Every single number in this array appears exactly twice, except for **one lonely number** that appears only once. We need to find that unique number.

The strict constraints are:
* **Linear Time ($O(N)$)**: We can only scan the array once.
* **Constant Space ($O(1)$)**: We cannot use a Hash Map or Set to store numbers we've seen, nor can we sort the array (sorting takes $O(N \log N)$ time). We must find the answer using only constant extra space.

---

### 🌍 4. Real-Life Example
Think of a **room full of children playing the "matching socks" game**:
* Every child holds a pair of identical socks, except for **one child** who is holding a single, unpaired sock.
* If you throw all the socks into a pile, the identical socks cancel each other out (they form a pair and are removed from the room).
* In the end, the only sock left standing alone in the room is the unpaired one. 

In computer science, we can represent this "pairing and canceling out" behavior perfectly using **Bitwise XOR arithmetic**!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: None (scalar integers).
* **Algorithm**: **Bitwise XOR (`^`) Manipulation**.
  * *Why*: The bitwise XOR operator has three magical mathematical properties:
    1. **Identity**: $a \oplus 0 = a$ (Any number XORed with `0` remains itself).
    2. **Self-Cancellation**: $a \oplus a = 0$ (Any number XORed with itself cancels out to `0`).
    3. **Commutative/Associative**: The order of operations does not matter ($a \oplus b \oplus a = (a \oplus a) \oplus b = 0 \oplus b = b$).
  * If we XOR all the numbers in the array together, every duplicate pair will encounter itself and cancel out to `0`. The only number that has no partner will remain, resulting in the correct single number.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function singleNumber(nums: number[]): number {
    let result: number = 0;

    // XOR all numbers together. Duplicate numbers will cancel each other out.
    for (let i = 0; i < nums.length; i++) {
        result = result ^ nums[i];
    }

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We loop through the array of length $N$ exactly once.
* **Space Complexity**: **$O(1)$** — We use only a single integer variable (`result`) to store the running XOR total.

#### Edge Cases Handled:
* **Single Element Array** (`nums = [1]`): The loop runs once: `result = 0 ^ 1 = 1`. Returns `1` (Correct).
* **Negative Numbers** (`nums = [-2, -2, 5]`): XOR operations operate on the binary bit-representations of numbers and work flawlessly on negative values. Returns `5` (Correct).
