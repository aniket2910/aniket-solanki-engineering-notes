# Dutch National Flag Algorithm

This document provides a highly visual, plain-English breakdown of the **Dutch National Flag Algorithm** for three-pointer partitioning in a single pass.

---

## 📌 1. The Core Idea

Imagine you have a bucket of red (`0`), white (`1`), and blue (`2`) marbles. You want to sort them in-place.

We place three markers along the array:
*   `low`: The boundary index where the next `0` (red) should go.
*   `mid`: Our active scanning cursor.
*   `high`: The boundary index where the next `2` (blue) should go.

Everything to the left of `low` will be `0`s, and everything to the right of `high` will be `2`s. The `1`s (white) will naturally settle in the middle!

---

## 🔄 2. The Algorithmic Mechanics

We initialize `low = 0`, `mid = 0`, and `high = nums.length - 1`. While `mid <= high`:
*   **If `nums[mid] === 0`**: Swap `nums[low]` and `nums[mid]`. Since the swapped element is guaranteed to be a `1`, we increment both `low++` and `mid++`.
*   **If `nums[mid] === 1`**: It's already in the correct middle position. Simply increment `mid++`.
*   **If `nums[mid] === 2`**: Swap `nums[mid]` and `nums[high]`. Decrement `high--`. **Do not increment `mid`** yet, because the element swapped from the back is uninspected and must be checked on the next loop!

---

## 📂 Related Problem List
*   [011a. Sort Colors (Dutch National Flag)](../05_ARRAYS/011a-medium-sort-colors-dutch-flag.md)
