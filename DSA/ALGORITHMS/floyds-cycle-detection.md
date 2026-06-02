# Floyd's Cycle Detection (Tortoise & Hare)

This document provides a highly visual, plain-English breakdown of **Floyd's Cycle Detection Algorithm** for detecting and finding the entry point of loops in linked lists or index pointer paths.

---

## 📌 1. The Core Idea

Imagine two runners on a running track:
1.  **Tortoise (Slow Pointer)**: Runs at speed 1 (moves 1 node per step).
2.  **Hare (Fast Pointer)**: Runs at speed 2 (moves 2 nodes per step).

If the track is a straight line, the Hare will reach the end of the track and exit, while the Tortoise is still in the middle. 

However, if the track has a **loop (cycle)**, both runners will enter the loop and run in circles forever. Because the Hare is moving faster, it will eventually lap the Tortoise and **collide (meet) with it** inside the loop!

---

## 🧪 2. The Meeting Point Mathematical Proof (Phase 1)

Let's prove why they are guaranteed to meet if a cycle exists:
*   On every step, the distance between the Hare and the Tortoise decreases by exactly `1` node (since the Hare closes the gap by 2 and the Tortoise moves away by 1).
*   If the loop has length $C$, the maximum distance between them is $C - 1$.
*   Since the gap decreases by 1 on every step, they are mathematically guaranteed to meet in at most $C$ steps!

---

## 🔑 3. Finding the Start of the Cycle (Phase 2)

Once they meet, how do we find the exact node where the loop begins?

Let's define the distances:
*   $L_1$: The distance from the **Head** of the list to the **Start Node** of the cycle.
*   $L_2$: The distance from the **Start Node** of the cycle to the **Meeting Point** inside the loop.
*   $C$: The total length of the cycle.

```text
    Head ----------> Start Node ----------> Meeting Point
          (L1)                  (L2)              |
                       ▲                          |
                       |                          |
                       +--------------------------+
                               (C - L2)
```

When they meet at the Meeting Point:
*   Distance traveled by Tortoise: $D_{	ext{slow}} = L_1 + L_2$
*   Distance traveled by Hare: $D_{	ext{fast}} = L_1 + L_2 + n \cdot C$ (where $n$ is the number of loops completed by the Hare).

Since the Hare travels exactly twice as fast as the Tortoise:
$$D_{	ext{fast}} = 2 \cdot D_{	ext{slow}}$$
$$L_1 + L_2 + n \cdot C = 2 \cdot (L_1 + L_2)$$
$$L_1 + L_2 + n \cdot C = 2L_1 + 2L_2$$
$$L_1 = n \cdot C - L_2$$

This equation is the magic! It tells us that the distance from the **Head** of the list to the **Start Node** ($L_1$) is equal to the distance from the **Meeting Point** to the **Start Node** ($C - L_2$) plus some number of full loops ($n \cdot C$).

#### The Operation:
1.  Leave the `hare` at the Meeting Point.
2.  Reset the `tortoise` to the `head` of the list.
3.  Move **both** pointers exactly **1 step at a time**.
4.  The node where they collide is **guaranteed** to be the Start Node of the cycle!

---

## 📂 Related Problem List
*   [004. Linked List Cycle](../06_LINKED_LIST/004-easy-linked-list-cycle.md)
*   [015a. Find the Duplicate Number (Floyd's)](../05_ARRAYS/015a-medium-duplicate-tortoise-hare.md)
*   [017. Find the Starting Point of Loop](../06_LINKED_LIST/017-medium-linked-list-cycle-ii.md)
