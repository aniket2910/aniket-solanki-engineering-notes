# 005. Move Zeroes (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Facebook/Meta, Amazon, Bloomberg


---

### 📝 1. Problem Statement
Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non-zero elements.

Note that you must do this **in-place** without making a copy of the array.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [0, 1, 0, 3, 12]`
* **Output**: `[1, 3, 12, 0, 0]`

#### Test Case 2
* **Input**: `nums = [0]`
* **Output**: `[0]`

---

### 💬 3. What is This Problem Actually Asking?
We want to shift all zero elements in an array to the very back, while keeping all the non-zero numbers at the front in their original relative order.

The strict constraints are:
* **In-Place Modification**: We are not allowed to allocate a new array. Everything must happen inside the input array `nums`.
* **Stability**: The relative order of non-zero elements must remain unchanged (e.g. if `1` appears before `3`, it must still appear before `3` after shifting).

---

### 🌍 4. Real-Life Example
Think of a **conveyor belt containing valuable boxes and empty spacer gaps (zeroes)**:
* You want to push all the gaps to the end of the line so that all the valuable boxes are grouped tightly at the front.
* You stand at the beginning of the belt (`writePointer`). 
* You have an assistant walking forward checking items (`readPointer`).
* When the assistant spots a valuable box, they immediately slide/swap it forward to your position (`writePointer`), and you step forward one slot. 
* This naturally pushes the empty gaps to the back without changing the sequence of the boxes.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Array** (allows in-place, constant-time $O(1)$ random index swaps).
* **Algorithm**: **Two-Pointer Technique (Read & Write Pointers with Swap)**.
  * *Why*: By having one pointer (`readPointer`) scan the elements and another (`writePointer`) track where the next non-zero element should go, we can swap elements in-place. Swapping is elegant because it automatically pushes the zero to the `readPointer`'s current location, eliminating any need to fill the back of the array with `0`s in a separate loop.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We will dry run the optimal code with the input `nums = [0, 1, 0, 3, 12]`.

#### **Step 0: Initial State**
```text
Pointers: writePointer = 0, readPointer = 0
Array:    [ 0,   1,   0,   3,  12 ]
           idx0 idx1 idx2 idx3 idx4
Pointers:    ▲
           writePointer
           readPointer
```
* **Comparison**: `nums[readPointer]` (nums[0] = 0) === 0
* **Decision**: Element is zero. Skip swap!
* **Next**: `readPointer` advances to index 1.

#### **Step 1: readPointer = 1**
```text
Pointers: writePointer = 0, readPointer = 1
Array:    [ 0,   1,   0,   3,  12 ]
           idx0 idx1 idx2 idx3 idx4
Pointers:    ▲    ▲
           write read
```
* **Comparison**: `nums[readPointer]` (nums[1] = 1) !== 0
* **Decision**: Non-zero element found! Swap `nums[readPointer]` with `nums[writePointer]`.
  1. Swap: `nums[0]` (0) <──► `nums[1]` (1).
  2. Advance: `writePointer++` (becomes 1).
* **Updated State**:
```text
Array:    [ 1,   0,   0,   3,  12 ]
                 ▲    ▲
               write read
```
* **Next**: `readPointer` advances to index 2.

#### **Step 2: readPointer = 2**
```text
Pointers: writePointer = 1, readPointer = 2
Array:    [ 1,   0,   0,   3,  12 ]
           idx0 idx1 idx2 idx3 idx4
Pointers:         ▲    ▲
                write read
```
* **Comparison**: `nums[readPointer]` (nums[2] = 0) === 0
* **Decision**: Element is zero. Skip swap!
* **Next**: `readPointer` advances to index 3.

#### **Step 3: readPointer = 3**
```text
Pointers: writePointer = 1, readPointer = 3
Array:    [ 1,   0,   0,   3,  12 ]
           idx0 idx1 idx2 idx3 idx4
Pointers:         ▲         ▲
                write      read
```
* **Comparison**: `nums[readPointer]` (nums[3] = 3) !== 0
* **Decision**: Non-zero element found! Swap `nums[readPointer]` with `nums[writePointer]`.
  1. Swap: `nums[1]` (0) <──► `nums[3]` (3).
  2. Advance: `writePointer++` (becomes 2).
* **Updated State**:
```text
Array:    [ 1,   3,   0,   0,  12 ]
                      ▲     ▲
                    write  read
```
* **Next**: `readPointer` advances to index 4.

#### **Step 4: readPointer = 4**
```text
Pointers: writePointer = 2, readPointer = 4
Array:    [ 1,   3,   0,   0,  12 ]
           idx0 idx1 idx2 idx3 idx4
Pointers:              ▲        ▲
                     write     read
```
* **Comparison**: `nums[readPointer]` (nums[4] = 12) !== 0
* **Decision**: Non-zero element found! Swap `nums[readPointer]` with `nums[writePointer]`.
  1. Swap: `nums[2]` (0) <──► `nums[4]` (12).
  2. Advance: `writePointer++` (becomes 3).
* **Updated State**:
```text
Array:    [ 1,   3,  12,   0,   0 ]
                           ▲    ▲
                         write read
```
* **Next**: Loop terminates. All zeroes have bubbled to the end!

---

### 💻 6. Optimal Code (TypeScript)

```typescript
/**
 Do not return anything, modify nums in-place instead.
 */
function moveZeroes(nums: number[]): void {
    // writePointer tracks the index where the next non-zero element should be placed.
    let writePointer: number = 0;

    for (let readPointer = 0; readPointer < nums.length; readPointer++) {
        if (nums[readPointer] !== 0) {
            // Swap non-zero element at readPointer with writePointer
            const temp = nums[writePointer];
            nums[writePointer] = nums[readPointer];
            nums[readPointer] = temp;
            
            // Advance writePointer for the next non-zero element
            writePointer++;
        }
    }
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We scan the array of length $N$ exactly once using the `readPointer`.
* **Space Complexity**: **$O(1)$** — We only allocate a single constant variable (`temp`) for swapping, keeping the space constant.

#### Edge Cases Handled:
* **No Zeroes** (`nums = [1, 2, 3]`): Every comparison is unequal. The code swaps each element with itself (`nums[0]` with `nums[0]`, etc.). The array remains identical (Correct).
* **All Zeroes** (`nums = [0, 0]`): The condition `nums[readPointer] !== 0` is never met. No swaps occur. The array remains identical (Correct).
* **Zeroes at the End** (`nums = [1, 2, 0]`): Pointers move together for `1` and `2` (swapping with themselves). For `0`, `readPointer` skips, and the loop exits cleanly (Correct).
