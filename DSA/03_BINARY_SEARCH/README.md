# 🔍 Topic 03: Binary Search

Welcome to the **Binary Search Revision Hub**. This page is your high-speed reference for the core search paradigms, template variations, and sorted problem catalogs.

---

## 📌 1. Core Binary Search Theory (Quick Recall)
Before starting any search problem, keep these fundamental behaviors in mind:

* **Prerequisite**: The search space **must be sorted** or exhibit a monotonic property (e.g., `false, false, false, true, true, true`). If it isn't sorted, Binary Search cannot be used directly.
* **Overflow Prevention**: Always calculate the midpoint using subtraction to prevent integer overflow when adding two large numbers:
  * ❌ *Avoid*: `const mid = Math.floor((left + right) / 2);`
  * ✔️ *Use*: `const mid = left + Math.floor((right - left) / 2);`
* **Shrinking the Range**: 
  * If `target > nums[mid]`, the target is in the right half. Shrink the search window from the left: `left = mid + 1`.
  * If `target < nums[mid]`, the target is in the left half. Shrink the search window from the right: `right = mid - 1`.

---

## 💡 2. The Two Core Templates

When writing Binary Search, the loop condition depends on what you are trying to find:

### Template A: Finding an Exact Match (Standard Search)
* **Loop Condition**: `while (left <= right)`
* **Pointers**: `left = mid + 1` and `right = mid - 1`
* **Exit State**: `left > right` (target not found).
* **Usage**: Standard search where the target either exists in the array or it doesn't.
* **Example**: [001. Binary Search (Standard)](./001-easy-binary-search.md)

### Template B: Finding Boundaries (Lower/Upper Bound or First/Last Match)
* **Loop Condition**: `while (left < right)`
* **Pointers**: `left = mid + 1` and `right = mid` (or `right = mid - 1` with special mid adjustment)
* **Exit State**: `left === right`.
* **Usage**: Finding the first element $\ge$ target, or the boundary where a condition changes from `false` to `true`.

---

## 📂 3. Problem Catalog

Use this list to track your progress and quickly open specific problem write-ups.

| Index | Problem Name | Difficulty | Core Pattern / Concept |
| :---: | :--- | :---: | :--- |
| `001` | [Binary Search](./001-easy-binary-search.md) 🔥 | 🟢 Easy | Two-Pointer Standard Search |
| `002` | [Search in a 2D Matrix](./002-medium-search-2d-matrix.md) 🔥 | 🟡 Medium | Coordinate Mapping & Flat Binary Search |
| `003` | [Sqrt(x)](./003-easy-sqrtx.md) 🔥 | 🟢 Easy | Binary Search on the Answer |
| `004` | [Guess Number Higher or Lower](./004-easy-guess-number-higher-or-lower.md) | 🟢 Easy | Binary Search through an API |
| `005` | [Search in Rotated Sorted Array](./005-medium-search-in-rotated-sorted-array.md) 🔥 | 🟡 Medium | One Half Is Always Sorted |
| `006` | [First Bad Version](./006-easy-first-bad-version.md) 🔥 | 🟢 Easy | Lower Bound (First `true`) |
| `007` | [Find Peak Element](./007-medium-find-peak-element.md) 🔥 | 🟡 Medium | Binary Search on the Slope |
| `008` | [Find Minimum in Rotated Sorted Array](./008-medium-find-minimum-in-rotated-sorted-array.md) 🔥 | 🟡 Medium | Compare Against the Right End |
| `009` | [Find First and Last Position of Element](./009-medium-find-first-and-last-position.md) 🔥 | 🟡 Medium | Lower + Upper Bound |
| `010` | [Peak Index in a Mountain Array](./010-medium-peak-index-in-a-mountain-array.md) | 🟡 Medium | First Descending Index |
| `011` | [Single Element in a Sorted Array](./011-medium-single-element-in-a-sorted-array.md) 🔥 | 🟡 Medium | Binary Search on Index Parity |
| `012` | [Find K Closest Elements](./012-medium-find-k-closest-elements.md) 🔥 | 🟡 Medium | Binary Search on the Window Start |

---

> [!TIP]
> **Revision Checklist**: Binary Search isn't just for searching arrays. It can also be used to **Search on Answer Ranges** (e.g., finding the minimum capacity of a ship, or the maximum height of a wood cutting blade). If a problem asks you to find the "minimum maximum" or "maximum minimum" of a value, think Binary Search!
