# 🔢 Topic 02: Math & Numerical Algorithms

Welcome to the **Math & Numerical Algorithms Revision Hub**. This page is your high-speed reference for the core mathematical principles, digit manipulation patterns, and solved problem catalogs.

---

## 📌 1. Core Mathematical Theory (Quick Recall)
Before starting any numerical problem, keep these fundamental arithmetic behaviors in mind:

* **Integer Division in JS/TS**: Unlike Java or C++, division in JavaScript/TypeScript using the `/` operator returns a floating-point decimal (e.g., `5 / 2 = 2.5`). 
  * *Revision Tip*: To perform integer division (discarding the decimal), you must explicitly use `Math.floor()` for positive numbers, or `Math.trunc()` to chop off the decimal part: 
    `const quotient = Math.floor(x / 10);`
* **Digit Extraction**: You can peel digits off any integer `x` from right to left using simple base-10 arithmetic:
  * Get the last digit: `const lastDigit = x % 10;`
  * Remove the last digit: `x = Math.floor(x / 10);`
* **Reconstruction**: To build a number by appending a digit to the end, multiply the current number by `10` and add the new digit:
  * `revertedNumber = (revertedNumber * 10) + digit;`

---

## 💡 2. Major Math & Numerical Patterns

When you see a numerical/math problem, it almost always falls into one of these core patterns:

### A. Digit Manipulation
* **What**: Iteratively stripping and reconstructing digits of a number using `% 10` and `/ 10` in a loop.
* **Why**: Perfect for reversing numbers, checking symmetry, or summing digits (e.g., Happy Number, Palindrome Number).
* **Example**: [001. Palindrome Number](./001-easy-palindrome-number.md)

### B. Primality & Divisors
* **What**: Efficiently searching for divisors or checking if a number is prime.
* **Why**: Optimization techniques like checking divisors only up to $\sqrt{N}$ or using the **Sieve of Eratosthenes** for finding primes up to $N$.

### C. Greatest Common Divisor (GCD) / Euclidean Algorithm
* **What**: Finding the largest positive integer that divides two numbers without a remainder.
* **Why**: Solved in $O(\log(\min(a,b)))$ using the Euclidean division theorem: `gcd(a, b) = gcd(b, a % b)`.

---

## 📂 3. Problem Catalog

Use this list to track your progress and quickly open specific problem write-ups.

| Index | Problem Name | Difficulty | Core Pattern / Concept |
| :---: | :--- | :---: | :--- |
| `001` | [Palindrome Number](./001-easy-palindrome-number.md) | 🟢 Easy | Digit Manipulation & Reversal |
| `002` | [Reverse Integer](./002-medium-reverse-integer.md) | 🟡 Medium | Digit Manipulation & Overflow Protection |
| `003` | [Power of Two](./003-easy-power-of-two.md) | 🟢 Easy | Bit Manipulation & Bit Clearing |
| `004` | [Missing Number](./004-easy-missing-number.md) | 🟢 Easy | Gauss Sum Formula / XOR |
| `005` | [Single Number](./005-easy-single-number.md) | 🟢 Easy | Bit Manipulation (XOR Self-Cancellation) |

---

> [!TIP]
> **Revision Checklist**: When working with numbers, always watch out for **integer overflows** (e.g., exceeding $2^{31}-1$). Reversing only *half* of a number (like we do in Palindrome Number) is a classic trick to avoid overflows!
