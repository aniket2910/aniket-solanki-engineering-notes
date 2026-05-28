# 🔠 Topic 01: Strings

Welcome to the **Strings Revision Hub**. This page is your high-speed reference for the core concepts, common patterns, and problem catalog related to String manipulation.

---

## 📌 1. Core String Theory (Quick Recall)
Before starting any string problem, keep these fundamental behaviors in mind:

* **Immutability**: In JavaScript, TypeScript, and Java, strings are **immutable**. Any modification (like concatenation or replacement) creates a brand-new string in memory. 
  * *Revision Tip*: If you are performing $O(N)$ string concatenations in a loop, it actually takes $O(N^2)$ time. Instead, convert the string to an array of characters, modify the array, and `.join('')` them at the end.
* **ASCII & Unicode (Character Codes)**:
  * Lowercase letters `'a'` to `'z'` are character codes `97` to `122`.
  * Uppercase letters `'A'` to `'Z'` are character codes `65` to `90`.
  * Numerical digits `'0'` to `'9'` are character codes `48` to `57`.
  * *Revision Tip*: To convert a character digit into its actual number value, subtract the code of `'0'`: 
    `const digit = char.charCodeAt(0) - 48;` (or `- '0'.charCodeAt(0)`)

---

## 💡 2. Major String Patterns & Algorithms

When you see a string problem, it almost always falls into one of these core patterns:

### A. Frequency Buckets / Hash Maps
* **What**: Using an array of size 26 (for lowercase English letters) or a Hash Map to record occurrences of characters.
* **Why**: Perfect for checking anagrams, finding first unique characters, or checking if we can form a specific set of words.
* **Example**: [001. Second Largest Digit in a String](file:///Users/aniketsolanki/Desktop/work/aniket-solanki-engineering-notes/DSA/01_STRINGS/001-easy-second-largest-digit.md) (uses variables, but relies on a frequency concept).

### B. Two-Pointer (Opposite Direction & Fast/Slow)
* **What**: Placing pointers at the beginning and end of a string and moving them toward the center (or at different speeds).
* **Why**: The absolute best approach for finding palindromes, reversing strings, or swapping specific characters in-place.

### C. Sliding Window
* **What**: Maintaining a contiguous subarray/substring window that dynamically expands or shrinks as you iterate.
* **Why**: Crucial for finding the "longest" or "shortest" substring matching a specific condition (e.g., longest substring without repeating characters).

### D. Advanced Search (KMP / Rabin-Karp)
* **What**: Algorithms that look for a pattern string inside a text string in linear time.
* **Why**: Used for advanced substring search problems where nested loops ($O(N \cdot M)$) would time out.

---

## 📂 3. Problem Catalog

Use this list to track your progress and quickly open specific problem write-ups.

| Index | Problem Name | Difficulty | Core Pattern / Concept |
| :---: | :--- | :---: | :--- |
| `001` | [Second Largest Digit in a String](file:///Users/aniketsolanki/Desktop/work/aniket-solanki-engineering-notes/DSA/01_STRINGS/001-easy-second-largest-digit.md) | 🟢 Easy | Two-Variable Running Maxima |

---

> [!TIP]
> **Revision Checklist**: Before an interview, skim through the **Related Patterns** section of each problem file to quickly connect similar techniques!
