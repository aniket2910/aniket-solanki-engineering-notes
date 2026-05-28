# 002. Remove Element (Easy)

---

### 📝 1. Problem Statement
Given an integer array `nums` and an integer `val`, remove all occurrences of `val` in `nums` **in-place**. The order of the elements may be changed. Then return the number of elements in `nums` which are not equal to `val`.

Consider the number of elements in `nums` which are not equal to `val` be `k`, to get accepted, you need to do the following things:
1. Change the array `nums` such that the first `k` elements of `nums` contain the elements which are not equal to `val`. The remaining elements of `nums` are not important as well as the size of `nums`.
2. Return `k`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [3, 2, 2, 3]`, `val = 3`
* **Output**: `2`, `nums = [2, 2, _, _]`
* **Why**: The function returns `2` (the count of non-`val` elements). The first two elements of `nums` are modified to contain `2`.

#### Test Case 2
* **Input**: `nums = [0, 1, 2, 2, 3, 0, 4, 2]`, `val = 2`
* **Output**: `5`, `nums = [0, 1, 3, 0, 4, _, _, _]`
* **Why**: The function returns `5`. The first five elements are modified to contain non-`2` values (e.g. `0, 1, 3, 0, 4` in any order).

---

### 💬 3. What is This Problem Actually Asking?
We are asked to strip out all occurrences of a specific number (`val`) from an array.

The strict constraints are:
* **No Extra Memory**: We cannot allocate a new array. All swaps/overwrites must be performed **in-place** within `nums`.
* **Pack Target Elements**: All elements that are **not** equal to `val` must be packed tightly at the front of the array.
* **Return Count**: We return the count of these non-`val` elements (`k`). The values residing at indexes `k` and beyond do not matter.

---

### 🌍 4. Real-Life Example
Imagine a **conveyor belt carrying sorted apples and rotten fruits (`val`)**:
* You want to sort out and discard all the rotten fruits.
* You have a **Packer** standing at the front (`writePointer`) and a **Scanner** looking downstream (`readPointer`).
* The Scanner examines each fruit:
  * If it's a good apple (not equal to `val`), the Packer puts it in the next slot at the front of the belt and steps forward.
  * If it's a rotten fruit, we ignore it and let it slide by.
* In the end, all good apples are packed tightly at the front, and the Packer knows exactly how many good apples we collected.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Array** (allows in-place, constant-time $O(1)$ random writes at index locations).
* **Algorithm**: **Two-Pointer Technique (Read & Write Pointers)**.
  * *Why*: By having one pointer (`readPointer`) scan through every element and a second pointer (`writePointer`) track where the next non-`val` element should be written, we can overwrite instances of `val` in a single linear pass.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function removeElement(nums: number[], val: number): number {
    // writePointer tracks the next index where a non-val element should be written.
    let writePointer: number = 0;

    for (let readPointer = 0; readPointer < nums.length; readPointer++) {
        // If the current element is NOT the value we want to remove
        if (nums[readPointer] !== val) {
            // Write it to the writePointer slot and step writePointer forward
            nums[writePointer] = nums[readPointer];
            writePointer++;
        }
    }

    // writePointer naturally represents the count of non-val elements (k)
    return writePointer;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We scan the array of length $N$ exactly once using the `readPointer`.
* **Space Complexity**: **$O(1)$** — We only allocate two scalar pointer variables, performing all modifications in-place.

#### Edge Cases Handled:
* **Empty Array** (`nums = []`): The loop doesn't run. Returns `writePointer` (`0`) (Correct).
* **All Elements are Val** (`nums = [2, 2]`, `val = 2`): The condition `nums[readPointer] !== val` is never met. `writePointer` remains `0`. Returns `0` (Correct).
* **No Elements are Val** (`nums = [1, 2, 3]`, `val = 9`): The condition is always met. Every element is written back to its own index. Returns `3` (Correct).
