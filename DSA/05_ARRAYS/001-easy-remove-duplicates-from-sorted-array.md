# 001. Remove Duplicates from Sorted Array (Easy)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **MUST SOLVE** - The absolute golden standard for in-place array manipulation. Teaches you the highly popular **Read/Write Two-Pointer** pattern.

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

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** showing how to optimize memory from a naive lookup to an optimal in-place compaction:

#### Approach 1: Auxiliary Set Tracking (Out-of-Place)
We scan the array, insert elements into a Hash Set to find unique values, and copy them into a temporary list before putting them back into `nums`.
* **Pros**: Incredibly easy to understand and write.
* **Cons**: Fails the in-place constraint because it allocates $O(N)$ extra memory.

#### Approach 2: In-Place Two-Pointer (Read/Write) - Optimal
Since the array is already sorted, duplicates are guaranteed to be adjacent. We can maintain a `writePointer` that marks where the next unique element should go, and a `readPointer` that scans forward.
* Every time `nums[readPointer]` is different from `nums[writePointer - 1]`, we write the new unique element at `writePointer` and increment it.
* **Pros**: Runs in-place in $O(1)$ auxiliary space and $O(N)$ time.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We will dry run the optimal code with the input `nums = [1, 1, 2]`.

#### **Step 0: Initial State**
```text
Pointers: write = 1, read = 1
Array:    [ 1,   1,   2 ]
           idx0 idx1 idx2
Pointers:    ▲    ▲
           write read
```
* **Comparison**: `nums[read]` (1) === `nums[write - 1]` (nums[0] = 1)
* **Decision**: Duplicate detected! Skip.
* **Next**: `read` advances to index 2.

#### **Step 1: read = 2**
```text
Pointers: write = 1, read = 2
Array:    [ 1,   1,   2 ]
           idx0 idx1 idx2
Pointers:    ▲        ▲
           write     read
```
* **Comparison**: `nums[read]` (2) !== `nums[write - 1]` (nums[0] = 1)
* **Decision**: Unique value found! 
  1. Overwrite: `nums[write] = nums[read]` (nums[1] = 2).
  2. Advance: `write++` (becomes 2).
* **Updated Array State**:
```text
Array:    [ 1,   2,   2 ]
                ▲    ▲
              write read
```
* **Next**: Loop terminates. Returns `write = 2`.

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate a clear progression of thought!

```typescript
function removeDuplicates(nums: number[]): number {
    // ==========================================
    // 1st Approach: Auxiliary Set Tracking (Out-of-Place)
    // ==========================================
    /*
    if (nums.length === 0) return 0;
    
    let unique = new Set<number>();
    for (let num of nums) {
        unique.add(num);
    }
    
    let arr = Array.from(unique);
    for (let i = 0; i < arr.length; i++) {
        nums[i] = arr[i];
    }
    return arr.length;
    */

    // ==========================================
    // 2nd Approach: In-Place Two-Pointer (Optimal)
    // ==========================================
    if (nums.length === 0) return 0;

    // write pointer marks where the next unique element goes
    let write = 1;

    for (let read = 1; read < nums.length; read++) {
        // Since array is sorted, check if current is different from last unique
        if (nums[read] !== nums[write - 1]) {
            nums[write] = nums[read];
            write++;
        }
    }

    return write;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Auxiliary Set | Approach 2: Two-Pointer |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Scans and copies elements. | **$O(N)$** — Scans the array once. |
| **Space Complexity** | **$O(N)$** — Allocates set and array lists. | **$O(1)$** — Pure in-place operations. |

#### Edge Cases Handled:
* **Array of Length 1** (`nums = [1]`): Skips the loop and safely returns `1` (Correct).
* **All Duplicates** (`nums = [1, 1, 1]`): Loop runs, matches nothing, and returns `1` with array updated to `[1, 1, 1]` (Correct).
