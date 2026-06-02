# Binary Exponentiation (Divide & Conquer)

This document provides a highly visual, plain-English breakdown of **Binary Exponentiation** for calculating powers in logarithmic time.

---

## 📌 1. The Core Idea

To calculate $2^{10}$, the standard way is to multiply 2 ten times:
$$2 	imes 2 	imes 2 	imes \dots 	imes 2 = 1024 \quad (10 	ext{ operations})$$

This is linear $O(N)$ scaling. If the exponent is $2 \cdot 10^9$, this will crash the system.

Instead, we can use the **doubling trick**:
*   $2^{10} = (2^2)^5 = 4^5$
*   Since the exponent 5 is odd: $4^5 = 4 	imes 4^4 = 4 	imes (4^2)^2 = 4 	imes 16^2 = 4 	imes 256 = 1024$.

By squaring the base and halving the exponent at each step, we complete the calculation in only **4 operations** instead of 10!

---

## 🔄 2. The Algorithmic Mechanics

*   If the exponent `n` is even: square the base (`x = x * x`) and halve `n = n / 2`.
*   If the exponent `n` is odd: multiply the result by the current base (`result = result * x`), then square the base and halve `n`.

This reduces time complexity to **$O(\log N)$** logarithmic steps!

---

## 📂 Related Problem List
*   [006. Pow(x, n)](../02_MATH/006-medium-powx-n.md)
