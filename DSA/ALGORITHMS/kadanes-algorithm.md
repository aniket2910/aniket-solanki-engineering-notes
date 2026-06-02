# Kadane's Algorithm

This document provides a highly visual, plain-English breakdown of **Kadane's Algorithm** for finding the maximum contiguous subarray sum in linear time.

---

## 📌 1. The Core Idea

Imagine you are looking at a history of monthly profits and losses of a business. You want to find the most successful consecutive streak.

As you calculate the running sum month-by-month:
*   If your running sum drops **below 0**, it means this entire streak is now a **net liability**. 
*   Instead of carrying this negative value forward (which will only reduce the sum of any future successful months), **you should discard the current streak entirely**, reset your running sum to 0, and start a fresh streak beginning with the next month!

This is the essence of **greedy tracking**: at each step, you decide whether to extend the current streak or start a brand new one.

---

## 🔄 2. The Algorithmic Mechanics

We maintain two variables:
1.  `maxSum`: The highest streak sum we've seen so far.
2.  `currentSum`: The running sum of our active streak.

We traverse the array:
*   Add the current element to `currentSum`.
*   Update `maxSum` if `currentSum` is higher.
*   If `currentSum` becomes negative (`< 0`), we greedy-reset `currentSum = 0`.

---

## 📂 Related Problem List
*   [010. Kadane's Algorithm](../05_ARRAYS/010-medium-kadanes-algorithm.md)
