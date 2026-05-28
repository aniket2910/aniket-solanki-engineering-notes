# 001. Remove Duplicates from Sorted Array (Easy)

---

### 📝 1. Problem Statement
Given an integer array `nums` sorted in non-decreasing order, remove the duplicates **in-place** such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in `nums`.

Consider the number of unique elements of `nums` to be `k`, to get accepted, you need to do the following things:
1. Change the array `nums` such that the first `k` elements of `nums` contain the unique elements in the order they were present in `nums` initially. The remaining elements of `nums` are not important as well as the size of `nums`.
2. Return `k`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [1, 1, 2]`
* **Output**: `2`, `nums = [1, 2, _]`
* **Why**: The function returns `2` (the unique count). The first two elements of `nums` are modified to `1` and `2`.

#### Test Case 2
* **Input**: `nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]`
* **Output**: `5`, `nums = [0, 1, 2, 3, 4, _, _, _, _, _]`
* **Why**: The function returns `5`. The first five elements are modified to `0`, `1`, `2`, `3`, and `4`.

---

### 💬 3. What is This Problem Actually Asking?
We need to filter out all duplicates from a sorted array. 

The strict constraints are:
* **No Extra Memory**: We cannot allocate a new array or use a Set. Everything must be done **in-place** inside the input array `nums`.
* **Pack Unique Elements**: All unique elements must be packed tightly at the front of the array in their original sorted order.
* **Return Count**: We return the count of these unique numbers (`k`). The values residing at indexes `k` and beyond do not matter.

---

### 🌍 4. Real-Life Example
Think of a **conveyor belt at a packaging plant** carrying components:
* You want to pack unique items into boxes at the front of the belt. 
* You have an **Inspector** walking downstream (`readPointer`) checking each item, and a **Placer** standing at the front (`writePointer`) ready to position the next unique item.
* Because the belt is sorted, duplicates are grouped together.
* When the Inspector finds an item that is different from the last packed item, the Inspector yells out. The Placer grabs that item, slides it into the next slot at the front of the belt, and steps forward. Duplicate items are left behind.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Array** (allows in-place, constant-time $O(1)$ random writes at index locations).
* **Algorithm**: **Two-Pointer Technique (Read & Write Pointers)**.
  * *Why*: By having one pointer (`readPointer`) scan through every element and a second pointer (`writePointer`) mark the destination for the next discovered unique element, we can overwrite duplicate indices in a single linear pass.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function removeDuplicates(nums: number[]): number {
    if (nums.length === 0) {
        return 0;
    }

    // writePointer tracks where the next unique element should be written.
    // Index 0 is always unique, so we start writing at index 1.
    let writePointer: number = 1;

    for (let readPointer = 1; readPointer < nums.length; readPointer++) {
        // Since the array is sorted, we compare the current element with the 
        // last written unique element (which is always at writePointer - 1).
        if (nums[readPointer] !== nums[writePointer - 1]) {
            // Found a new unique element! Write it to the writePointer slot.
            nums[writePointer] = nums[readPointer];
            writePointer++;
        }
    }

    // writePointer naturally represents the total count of unique elements (k)
    return writePointer;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We scan the array of length $N$ exactly once using the `readPointer`.
* **Space Complexity**: **$O(1)$** — We only allocate two scalar pointer variables, performing all modifications in-place.

#### Edge Cases Handled:
* **Array of Length 1** (`nums = [1]`): The initial `if (nums.length === 0)` check is skipped. The loop doesn't run because `readPointer = 1 < nums.length` ($1 < 1$) is false. Returns `writePointer` (`1`) (Correct).
* **No Duplicates** (`nums = [1, 2, 3]`): Every comparison is unequal. The code writes each element back to its current position (`nums[1] = nums[1]`, etc.). Returns `3` (Correct).
* **All Duplicates** (`nums = [1, 1, 1]`): The condition `nums[readPointer] !== nums[writePointer - 1]` is never met. `writePointer` remains `1`. Returns `1` (Correct).
