# 009. Next Greater Element I (Easy)

> [!IMPORTANT]
> **Interview Tag**: Monotonic Stack Foundations - The gateway problem for learning the monotonic stack pattern. Master this to unlock a wide range of harder linear scan problems.

---

### 📝 1. Problem Statement
The **next greater element** of some element `x` in an array is the **first greater element** that is to the right of `x` in the same array.

You are given two distinct 0-indexed integer arrays `nums1` and `nums2`, where `nums1` is a subset of `nums2`.

For each `0 <= i < nums1.length`, find the index `j` such that `nums1[i] == nums2[j]` and determine the next greater element of `nums2[j]` in `nums2`. If there is no next greater element, the answer for this query is `-1`.

Return *an array `ans` of length `nums1.length` such that `ans[i]` is the next greater element as described above*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `nums1 = [4, 1, 2]`, `nums2 = [1, 3, 4, 2]`
* **Output**: `[-1, 3, -1]`
* **Why**:
  * For `4`: `4` is at index 2 in `nums2`. There are no elements to its right greater than `4`. Return `-1`.
  * For `1`: `1` is at index 0 in `nums2`. The first greater element to its right is `3`. Return `3`.
  * For `2`: `2` is at index 3 in `nums2`. There are no elements to its right. Return `-1`.

#### Test Case 2
* **Input**: `nums1 = [2, 4]`, `nums2 = [1, 2, 3, 4]`
* **Output**: `[3, -1]`
* **Why**:
  * For `2`: Next greater in `nums2` is `3`.
  * For `4`: No greater element to its right. Return `-1`.

---

### 💬 3. What is This Problem Actually Asking?
For every number in `nums1`, we find where it sits in `nums2`, and then look rightward in `nums2` to find the very first number that is strictly larger than it.
A brute force approach would search `nums2` for each query, resulting in $O(N \times M)$ time. We want to do it in linear $O(N + M)$ time.

---

### 🌍 4. Real-Life Example
Think of a **queue of passengers boarding a flight**:
* You are standing in line. You want to see the first person ahead of you (to your right) who is **taller than you** so you can ask them to help load your bag.
* Instead of scanning everyone ahead of you individually, as passengers walk past a height scanner, they are checked against a stack of "waiting passengers".
* If a passenger is taller than the person at the top of the stack, they are the "Next Taller Person" for that stack person, who can now step out of line.

---

### 🛠️ 5. Data Structure & Algorithms Used

We use a **Monotonic Decreasing Stack** on the array `nums2`:
* We maintain a stack where elements are kept in strictly decreasing order.
* We iterate through `nums2` from left to right:
  * While the stack is not empty and the current element `num` is greater than the top of the stack (`stack[top]`):
    * The current element `num` is the **Next Greater Element** for the element at the top of the stack.
    * We pop the top element and record the mapping: `topElement -> num` in a Hash Map.
  * Push the current element `num` onto the stack.
* For any elements remaining on the stack at the end of the loop, their next greater element is `-1`.
* Finally, we construct the answer for `nums1` by simply querying our Hash Map.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Dry run with `nums2 = [1, 3, 4, 2]`:

#### **Step 1: num = 1**
* Stack is empty. Push `1`.
* Stack = `[ 1 ]`

#### **Step 2: num = 3**
* `3 > 1` (top of stack).
* Pop `1` from stack. Map: `1 -> 3`.
* Stack is empty. Push `3`.
* Stack = `[ 3 ]`

#### **Step 3: num = 4**
* `4 > 3` (top of stack).
* Pop `3` from stack. Map: `3 -> 4`.
* Stack is empty. Push `4`.
* Stack = `[ 4 ]`

#### **Step 4: num = 2**
* `2 < 4` (top of stack).
* Push `2`.
* Stack = `[ 4, 2 ]`

#### **Step 5: End of loop**
* Remaining elements on stack: `4` and `2`. They have no next greater element (Map retains default `-1`).
* Querying map for `nums1 = [4, 1, 2]` gives:
  * `4` -> `-1`
  * `1` -> `3`
  * `2` -> `-1`
  * Result = `[-1, 3, -1]`

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
    const nextGreaterMap = new Map<number, number>();
    const stack: number[] = [];

    // Traverse nums2 to find the Next Greater Element for all numbers
    for (let i = 0; i < nums2.length; i++) {
        const num = nums2[i];

        // While stack has elements and the current element is greater than the top
        while (stack.length > 0 && num > stack[stack.length - 1]) {
            const popped = stack.pop()!;
            nextGreaterMap.set(popped, num);
        }

        stack.push(num);
    }

    // Map remaining stack elements to -1
    while (stack.length > 0) {
        const popped = stack.pop()!;
        nextGreaterMap.set(popped, -1);
    }

    // Build the result array for nums1 using the map
    return nums1.map(num => nextGreaterMap.get(num) ?? -1);
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Complexity | Description |
| :--- | :---: | :--- |
| **Time Complexity** | **$O(N + M)$** | $N$ is size of `nums2`, $M$ is size of `nums1`. Each element in `nums2` is pushed and popped from the stack at most once. |
| **Space Complexity** | **$O(N)$** | We store the elements of `nums2` in the stack and the map. |

#### Edge Cases Handled:
* **Decreasing array** (`nums2 = [4, 3, 2, 1]`): Stack grows to `[4, 3, 2, 1]`. Map maps all to `-1`. Correct.
* **Increasing array** (`nums2 = [1, 2, 3, 4]`): Elements are immediately popped. Map maps `1->2`, `2->3`, `3->4`, `4->-1`. Correct.
