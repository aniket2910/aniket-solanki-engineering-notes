# Sliding Window Algorithm Blueprint

This document provides a highly visual, plain-English breakdown of the **Sliding Window** technique for finding subarray or substring matches that optimize a specific boundary condition in linear time.

---

## 📌 1. The Core Idea

The **Sliding Window** technique is a variation of the Two-Pointer technique. It is used to perform operations on a contiguous block of elements (the "window") within an array or string.

Instead of recalculating the entire window state from scratch for each starting position ($O(N^2)$ or $O(N \cdot K)$), we "slide" the window by:
1.  **Expanding** the right boundary to include new elements (updating window metrics).
2.  **Shrinking** the left boundary from the back when the window violates a specific invariant (discarding outgoing elements).

This keeps the overall time complexity to $O(N)$ because both the left and right pointers traverse the collection exactly once.

---

## 🔄 2. The Algorithmic Mechanics

### Fixed-Size Sliding Window
Used when the window size $K$ is constant.
```typescript
let windowSum = 0;
// 1. Initialize first window
for (let i = 0; i < K; i++) {
    windowSum += arr[i];
}
let maxSum = windowSum;

// 2. Slide the window
for (let i = K; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - K]; // Add new, remove old
    maxSum = Math.max(maxSum, windowSum);
}
```

### Variable-Size (Dynamic) Sliding Window
Used when we need to find the longest/shortest subarray satisfying a condition.
```typescript
let left = 0;
let maxLength = 0;
const freqMap = new Map<string, number>();

for (let right = 0; right < arr.length; right++) {
    // 1. Expand: Include right character/element
    const char = arr[right];
    freqMap.set(char, (freqMap.get(char) || 0) + 1);

    // 2. Shrink: While window condition is violated
    while (isConditionViolated(freqMap)) {
        const leftChar = arr[left];
        freqMap.set(leftChar, freqMap.get(leftChar) - 1);
        if (freqMap.get(leftChar) === 0) freqMap.delete(leftChar);
        left++; // Shrink window
    }

    // 3. Update result
    maxLength = Math.max(maxLength, right - left + 1);
}
```

---

## 🔄 3. Visual Example

### Variable-Size Window Trace
Let's find the longest substring without repeating characters in `s = "abcabcbb"`:
*   `right = 0 (a)`: Window: `[a]`. Valid. Max = 1.
*   `right = 1 (b)`: Window: `[a, b]`. Valid. Max = 2.
*   `right = 2 (c)`: Window: `[a, b, c]`. Valid. Max = 3.
*   `right = 3 (a)`: Window: `[a, b, c, a]`. Mismatch (duplicate `'a'`). Shrink `left` to 1. New Window: `[b, c, a]`. Valid. Max = 3.

```text
Pointers: left = 0, right = 2
Window:   [  a,   b,   c,   a,   b,   c,   b,   b  ]
            idx0 idx1 idx2 idx3 idx4 idx5 idx6 idx7
Ptrs:        ▲         ▲
            left     right
```

---

## 📂 Related Problem List
*   [026. Find the Index of the First Occurrence in a String](../01_STRINGS/026-easy-find-index-first-occurrence.md)
*   [022. Longest Substring Without Repeating Characters](../01_STRINGS/022-medium-longest-substring-without-repeating-characters.md)
*   [003. Longest Repeating Character Replacement](../09_TWO_POINTERS/003-medium-longest-repeating-character-replacement.md)
*   [004. Permutation in String](../09_TWO_POINTERS/004-medium-permutation-in-string.md)
*   [020. Sliding Window Maximum](../08_STACKS_AND_QUEUES/020-hard-sliding-window-maximum.md)
