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
* **Example**: [001. Binary Search (Standard)](file:///Users/aniketsolanki/Desktop/work/aniket-solanki-engineering-notes/DSA/03_BINARY_SEARCH/001-easy-binary-search.md)

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
| `001` | [Binary Search](file:///Users/aniketsolanki/Desktop/work/aniket-solanki-engineering-notes/DSA/03_BINARY_SEARCH/001-easy-binary-search.md) | 🟢 Easy | Two-Pointer Standard Search |

---

> [!TIP]
> **Revision Checklist**: Binary Search isn't just for searching arrays. It can also be used to **Search on Answer Ranges** (e.g., finding the minimum capacity of a ship, or the maximum height of a wood cutting blade). If a problem asks you to find the "minimum maximum" or "maximum minimum" of a value, think Binary Search!
