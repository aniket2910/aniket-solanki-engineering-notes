# Two-Pointer Algorithm Blueprint

This document provides a highly visual, plain-English breakdown of the **Two-Pointer** technique for searching, partitioning, and analyzing contiguous collections (arrays, strings, and linked lists) in linear time and constant space.

---

## 📌 1. The Core Idea

The **Two-Pointer** technique is an optimization pattern where we maintain two integer variables (pointers) referencing indices of a collection. Instead of using nested loops ($O(N^2)$), we coordinate the movement of these two pointers in a single pass ($O(N)$) based on logic properties, typically sorting, structure invariants, or linear distance.

There are three primary categories of two-pointer setups:
1.  **Opposite Ends (Squeeze/Clamp)**: Pointers start at the extremes (`left = 0`, `right = length - 1`) and move toward each other.
2.  **Fast & Slow (Tortoise & Hare)**: Both pointers start at the same side but move at different speeds (e.g., speed-1 vs speed-2) or with different step conditions.
3.  **Read & Write (In-place Partitioning)**: Both pointers start at the same side; one scans forward to read data, while the other updates the array in-place.

---

## 🔄 2. The Algorithmic Mechanics

### Opposite Ends Squeeze
Used on sorted arrays/sequences to find pairs or boundaries.
```typescript
let left = 0;
let right = arr.length - 1;

while (left < right) {
    const currentVal = arr[left] + arr[right];
    if (currentVal === target) {
        return [left, right]; // Found target
    } else if (currentVal < target) {
        left++; // Shift left to increase value (since sorted)
    } else {
        right--; // Shift right to decrease value (since sorted)
    }
}
```

### Fast & Slow
Used for cycle detection in linked structures or finding midpoints.
```typescript
let slow = head;
let fast = head;

while (fast !== null && fast.next !== null) {
    slow = slow.next;       // Moves 1 node
    fast = fast.next.next;  // Moves 2 nodes
    if (slow === fast) {
        return true; // Cycle detected
    }
}
```

### Read & Write
Used for filtering or modifying arrays in-place without auxiliary space.
```typescript
let write = 0;
for (let read = 0; read < arr.length; read++) {
    if (arr[read] !== valToRemove) {
        arr[write] = arr[read];
        write++;
    }
}
```

---

## 🔄 3. Visual Examples

### Opposite Ends Squeeze Trace
Let's find if a pair sums to `9` in sorted `nums = [2, 7, 11, 15]`:
*   `i = 0 (2)`, `j = 3 (15)`: `sum = 17 > 9` $\rightarrow$ Decrement `j`.
*   `i = 0 (2)`, `j = 2 (11)`: `sum = 13 > 9` $\rightarrow$ Decrement `j`.
*   `i = 0 (2)`, `j = 1 (7)`: `sum = 9 === 9` $\rightarrow$ Match found!

```text
Pointers: left = 0, right = 3
Array:    [  2,   7,  11,  15  ]
           idx0 idx1 idx2 idx3
Ptrs:        ▲              ▲
           left           right
```

---

## 📂 Related Problem List
*   [020b. Two Sum (Two-Pointer)](../05_ARRAYS/020b-easy-two-sum-twopointer.md)
*   [001. Two Sum II - Input Array Is Sorted](../09_TWO_POINTERS/001-medium-two-sum-ii.md)
*   [026. Find the Index of the First Occurrence in a String](../01_STRINGS/026-easy-find-index-first-occurrence.md)
*   [008. Intersection of Two Linked Lists](../06_LINKED_LIST/008-easy-intersection-of-two-linked-lists.md)
*   [002. Container with Most Water](../09_TWO_POINTERS/002-medium-container-with-most-water.md)
*   [023. 3Sum](../05_ARRAYS/023-medium-3sum.md)
*   [024. Trapping Rainwater](../05_ARRAYS/024-hard-trapping-rainwater.md)
