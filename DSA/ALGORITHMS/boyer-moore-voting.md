# Boyer-Moore Voting Algorithm

This document provides a highly visual, plain-English breakdown of the **Boyer-Moore Voting Algorithm** for finding the majority element in an array in linear time and constant space.

---

## 📌 1. The Core Idea

The **Boyer-Moore Voting Algorithm** is based on a simple, powerful concept of **balanced cancellation**. 

If we have a majority candidate in an election who has **more than 50% of the total votes**, then even if all other voters combine their votes to cancel out the majority candidate's votes in a 1-to-1 matchup, the majority candidate will still have at least 1 vote remaining at the end!

---

## 🔄 2. The Algorithmic Mechanics

We maintain two variables:
1.  `candidate`: The active number we are backing.
2.  `count`: The balance of votes for this candidate.

We iterate through the array:
*   If `count === 0`, we declare the current element as our new `candidate`.
*   If the current element matches `candidate`, we increment `count++`.
*   Otherwise, we decrement `count--` (simulating a vote cancellation).

Because the majority element appears more than $\lfloor N/2 floor$ times, its votes can never be completely canceled out by all other elements combined. It is guaranteed to survive as the final `candidate`!

---

## 🔄 3. A Visual Example
Let's trace `nums = [2, 2, 1, 1, 2]`:
*   `i = 0 (2)`: `count = 0` $ightarrow$ `candidate = 2`, `count = 1`.
*   `i = 1 (2)`: Matches `candidate` $ightarrow$ `count = 2`.
*   `i = 2 (1)`: Mismatch $ightarrow$ `count = 1` (canceled).
*   `i = 3 (1)`: Mismatch $ightarrow$ `count = 0` (canceled).
*   `i = 4 (2)`: `count = 0` $ightarrow$ `candidate = 2`, `count = 1`.
*   **Result**: Candidate `2` wins.

---

## 📂 Related Problem List
*   [017a. Majority Element I (Boyer-Moore)](../05_ARRAYS/017a-easy-majority-element-boyer-moore.md)
*   [018. Majority Element II (Two Candidates)](../05_ARRAYS/018-medium-majority-element-ii.md)
