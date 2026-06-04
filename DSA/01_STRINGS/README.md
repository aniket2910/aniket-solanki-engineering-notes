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
* **Example**: [001. Second Largest Digit in a String](./001-easy-second-largest-digit.md) (uses variables, but relies on a frequency concept).

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
| `001` | [Second Largest Digit in a String](./001-easy-second-largest-digit.md) | 🟢 Easy | Two-Variable Running Maxima |
| `002` | [Reverse String](./002-easy-reverse-string.md) 🔥 | 🟢 Easy | Two-Pointer (Opposite Direction) |
| `003` | [Length of Last Word](./003-easy-length-of-last-word.md) | 🟢 Easy | Backward Pointer Traversal |
| `004` | [Find Words Containing Character](./004-easy-find-words-containing-character.md) | 🟢 Easy | Basic Iteration Scanning |
| `005` | [Jewels and Stones](./005-easy-jewels-and-stones.md) | 🟢 Easy | Set-Based Fast Lookup Counts |
| `006` | [Find Most Frequent Vowel and Consonant](./006-easy-find-most-frequent-vowel-and-consonant.md) | 🟢 Easy | Frequency Counting & Running Max |
| `007` | [Split a String in Balanced Strings](./007-easy-split-a-string-in-balanced-strings.md) | 🟢 Easy | Greedy State Balancing |
| `008` | [Reverse String II](./008-easy-reverse-string-ii.md) | 🟢 Easy | Chunked Segment Reversing |
| `009` | [Valid Palindrome](./009-easy-valid-palindrome.md) 🔥 | 🟢 Easy | Alphanumeric Filtering & Opposite Two-Pointers |
| `010` | [Largest Odd Number in a String](./010-easy-largest-odd-number-in-a-string.md) | 🟢 Easy | String Math Search from Back |
| `011` | [Longest Common Prefix](./011-easy-longest-common-prefix.md) 🔥 | 🟢 Easy | Vertical/Horizontal Character Scanning |
| `012` | [Valid Anagram](./012-easy-valid-anagram.md) 🔥 | 🟢 Easy | Fixed-Size 26 Frequency Bucket Arrays |
| `013` | [Isomorphic Strings](./013-easy-isomorphic-strings.md) | 🟢 Easy | Dual Character-Mapping Checks |
| `014` | [Group Anagrams](./014-medium-group-anagrams.md) 🔥 | 🟡 Medium | Hash Map with Sorted Character Keys |
| `015` | [Minimum Add to Make Parentheses Valid](./015-medium-minimum-add-to-make-parentheses-valid.md) | 🟡 Medium | Stack Balance Tracking Counters |
| `016` | [Reverse Words in a String](./016-medium-reverse-words-in-a-string.md) 🔥 | 🟡 Medium | Dynamic Word Splitting & Reverse Joining |
| `017` | [Sum of Beauty of All Substrings](./017-medium-sum-of-beauty-of-all-substrings.md) | 🟡 Medium | Substring Sliding Window Frequency Limits |
| `018` | [Decode String](./018-medium-decode-string.md) 🔥 | 🟡 Medium | Dual Stack (Numbers & Letters) Decompression |
| `019` | [Count and Say](./019-medium-count-and-say.md) | 🟡 Medium | Iterative Run-Length Encoding |
| `020` | [Reorganize String](./020-medium-reorganize-string.md) 🔥 | 🟡 Medium | Greedy Character Spacing with Frequency Bucket Arrays |
| `021` | [Repeated String Match](./021-medium-repeated-string-match.md) 🔥 | 🟡 Medium | Modular Replication Matching Limits |
| `022` | [Longest Substring Without Repeating Characters](./022-medium-longest-substring-without-repeating-characters.md) 🔥 | 🟡 Medium | Sliding Window with Map Index Cache |
| `023` | [Longest Palindromic Substring](./023-medium-longest-palindromic-substring.md) 🔥 | 🟡 Medium | Odd/Even Centers Expansion |
| `024` | [Roman to Integer](./024-easy-roman-to-integer.md) 🔥 | 🟢 Easy | Lookahead Subtraction Check |
| `025` | [Repeated Substring Pattern](./025-easy-repeated-substring-pattern.md) 🔥 | 🟢 Easy | Periodic Pattern Concatenation / KMP LPS |
| `026` | [Find the Index of the First Occurrence in a String](./026-easy-find-index-first-occurrence.md) 🔥 | 🟢 Easy | Two-Pointer Sliding Window / KMP Substring Search |
| `027` | [Compare Version Numbers](./027-medium-compare-version-numbers.md) 🔥 | 🟡 Medium | Version Dot-Split & Numeric Comparators |

---

> [!TIP]
> **Revision Checklist**: Before an interview, skim through the **Related Patterns** section of each problem file to quickly connect similar techniques!
