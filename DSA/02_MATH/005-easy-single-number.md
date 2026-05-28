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

### 🔄 Step-by-Step Dry Run (Visualizer)

We trace the cumulative bitwise XOR operations showing how duplicate pairs cancel each other out to `0`, leaving only the unique single number:

Using input: `nums = [4, 1, 2, 1, 2]`

#### **Step 0: Initial State**
```text
result = 0
```

#### **Step 1: Index i = 0**
* **Value**: `nums[0] = 4`
* **XOR Operation**:
  ```text
  result = 0 ^ 4 = 4
  ```

#### **Step 2: Index i = 1**
* **Value**: `nums[1] = 1`
* **XOR Operation**:
  ```text
  result = 4 ^ 1
  ```
* **Binary Alignment**:
  ```text
    4:  0 1 0 0
    1:  0 0 0 1
    -----------
    XOR:0 1 0 1  (5)
  ```
* **Result**: `result = 5`.

#### **Step 3: Index i = 2**
* **Value**: `nums[2] = 2`
* **XOR Operation**:
  ```text
  result = 5 ^ 2
  ```
* **Binary Alignment**:
  ```text
    5:  0 1 0 1
    2:  0 0 1 0
    -----------
    XOR:0 1 1 1  (7)
  ```
* **Result**: `result = 7`.

#### **Step 4: Index i = 3**
* **Value**: `nums[3] = 1`
* **XOR Operation**:
  ```text
  result = 7 ^ 1
  ```
* **Binary Alignment**:
  ```text
    7:  0 1 1 1
    1:  0 0 0 1
    -----------
    XOR:0 1 1 0  (6)   <-- Note: The digit '1' XORed again cancels out!
  ```
* **Result**: `result = 6`.

#### **Step 5: Index i = 4**
* **Value**: `nums[4] = 2`
* **XOR Operation**:
  ```text
  result = 6 ^ 2
  ```
* **Binary Alignment**:
  ```text
    6:  0 1 1 0
    2:  0 0 1 0
    -----------
    XOR:0 1 0 0  (4)   <-- Note: The digit '2' XORed again cancels out!
  ```
* **Result**: `result = 4`.

#### **Step 6: Loop Termination**
* Loop terminates. Returns `result` (**`4`**).

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
