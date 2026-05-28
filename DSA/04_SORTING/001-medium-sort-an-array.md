# 001. Sort an Array (Medium)

---

### 📝 1. Problem Statement
Given an array of integers `nums`, sort the array in ascending order and return it.

You must solve the problem without using any built-in library sorting methods, in **$O(N \log N)$** time complexity, and with the smallest space complexity possible.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums = [5, 2, 3, 1]`
* **Output**: `[1, 2, 3, 5]`

#### Test Case 2
* **Input**: `nums = [5, 1, 1, 2, 0, 0]`
* **Output**: `[0, 0, 1, 1, 2, 5]`

---

### 💬 3. What is This Problem Actually Asking?
We need to sort an array in ascending order without using standard language methods like `Array.prototype.sort()`. 

The core constraint is **$O(N \log N)$ time complexity**. 
This forces us to use efficient divide-and-conquer algorithms like **Merge Sort** or **Quick Sort**. 

#### How Merge Sort works:
1. **Divide**: Split the array exactly in half.
2. **Conquer**: Recursively sort both halves (a single element is naturally sorted).
3. **Combine**: Merge the two sorted halves back together in sorted order.

---

### 🌍 4. Real-Life Example
Imagine you have **two piles of student exam papers**, each already sorted alphabetically:
* Pile A: `[Amy, Dave, Frank]`
* Pile B: `[Bob, Charlie, Grace]`

To merge them into one alphabetical pile, you compare the top paper of both piles:
1. Compare `Amy` and `Bob` $\rightarrow$ `Amy` is smaller. Place `Amy` face down in the new pile.
2. Compare `Dave` and `Bob` $\rightarrow$ `Bob` is smaller. Place `Bob` in the new pile.
3. Compare `Dave` and `Charlie` $\rightarrow$ `Charlie` is smaller. Place `Charlie` in the new pile.
4. Compare `Dave` and `Grace` $\rightarrow$ `Dave` is smaller. Place `Dave` in the new pile.
5. And so on, until both piles are combined alphabetically.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Array** (contiguous memory with instant index lookups).
* **Algorithm**: **Merge Sort (Divide & Conquer)**.
  * *Why*: Merge Sort is a **stable** sorting algorithm (duplicate elements like the two `1`s in Test Case 2 preserve their original relative order). It guarantees a worst-case time complexity of $O(N \log N)$, making it bulletproof against malicious reverse-sorted inputs that might slow down Quick Sort to $O(N^2)$.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function sortArray(nums: number[]): number[] {
    // Allocate a single helper array once in memory to avoid repeated garbage-collection allocations during recursion
    const temp: number[] = new Array(nums.length);
    
    // Helper function to recursively divide and conquer the indices
    function mergeSort(left: number, right: number): void {
        if (left >= right) {
            return; // Base case: segment of size 1 is already sorted
        }
        
        const mid: number = left + Math.floor((right - left) / 2);
        
        mergeSort(left, mid);        // Sort left half
        mergeSort(mid + 1, right);   // Sort right half
        merge(left, mid, right);     // Merge them together
    }
    
    // Helper function to merge two sorted segments: nums[left...mid] and nums[mid+1...right]
    function merge(left: number, mid: number, right: number): void {
        // Copy the target segment into the helper array
        for (let k = left; k <= right; k++) {
            temp[k] = nums[k];
        }
        
        let i: number = left;      // Pointer for the left sorted half
        let j: number = mid + 1;   // Pointer for the right sorted half
        
        // Merge elements back into nums in sorted order
        for (let k = left; k <= right; k++) {
            if (i > mid) {
                // Left half exhausted, copy from right half
                nums[k] = temp[j++];
            } else if (j > right) {
                // Right half exhausted, copy from left half
                nums[k] = temp[i++];
            } else if (temp[i] <= temp[j]) {
                // Left element is smaller or equal (Stable Sort behavior)
                nums[k] = temp[i++];
            } else {
                // Right element is smaller
                nums[k] = temp[j++];
            }
        }
    }
    
    mergeSort(0, nums.length - 1);
    return nums;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N \log N)$** — Dividing the array in half takes $\log N$ steps (height of the recursion tree). At each level of the tree, merging elements takes $O(N)$ operations. This is guaranteed for Best, Worst, and Average cases.
* **Space Complexity**: **$O(N)$** — We allocate a single helper array of size $N$ (`temp`) to store values during the merge phase.

#### Edge Cases Handled:
* **Single Element Array** (`[1]`): `left = 0`, `right = 0`. Since `left >= right` ($0 \ge 0$), the function returns immediately (Correct).
* **Already Sorted Array** (`[1, 2, 3]`): The division still occurs, but the `temp[i] <= temp[j]` comparison ensures elements are copied back in their exact current order, maintaining high performance (Correct).
* **Duplicate Elements** (`[1, 1, 1]`): The use of `<=` during comparison ensures the left pointer is advanced first. This preserves the relative order of identical elements, keeping the sort **stable** (Correct).
