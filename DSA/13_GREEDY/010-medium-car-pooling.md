# 010. Car Pooling (Medium)

**Sheet**: Namaste DSA · 12. Greedy Algorithm · [LeetCode 1094](https://leetcode.com/problems/car-pooling/)

**Interview Tag**: 🔥 **MUST SOLVE** - The **difference array** (a.k.a. sweep line). Same idea as counting meeting rooms.

---

### 📝 1. Problem Statement
A car with `capacity` seats drives east only. `trips[i] = [numPassengers, from, to]`: that many people get in at kilometre `from` and get out at `to`. Return `true` if the car never carries more than `capacity` people at once.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `trips = [[2,1,5],[3,3,7]]`, `capacity = 4`
* **Output**: `false`
* **Why**: Between km 3 and 5 there are 2 + 3 = 5 people.

#### Test Case 2
* **Input**: `trips = [[2,1,5],[3,3,7]]`, `capacity = 5`
* **Output**: `true`

#### Test Case 3
* **Input**: `trips = [[2,1,5],[3,5,7]]`, `capacity = 3`
* **Output**: `true`
* **Why**: The first group gets out at km 5 just as the second gets in.

---

### 💬 3. What is This Problem Actually Asking?
Turn every trip into two events: `+people` at `from` and `−people` at `to`. Walk the road from west to east adding the events; the running total is the number of people in the car. It must never exceed `capacity`.

---

### 🌍 4. Real-Life Example
A **bus conductor's clicker**: click up when someone boards, click down when someone gets off. The number on the clicker is the load at that moment, and the driver only cares whether it ever passes the seat count.

---

### 🛠️ 5. Data Structure & Algorithms Used
* **Data Structure**: **Difference array** `change[km]` (locations are 0–1000 in this problem).
* **Algorithm**: **Sweep line**:
  * `change[from] += people`, `change[to] -= people`.
  * Prefix-sum `change`; if the running load ever exceeds `capacity`, return `false`.
* Drop-offs at `to` are applied at the same index as pickups at `to`, so people getting out make room for people getting in.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Input: `trips = [[2,1,5],[3,3,7]]`, `capacity = 4`

| km | change | load |
| :---: | :---: | :---: |
| 1 | +2 | 2 |
| 3 | +3 | **5 > 4** → `false` |

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function carPooling(trips: number[][], capacity: number): boolean {
    const change = new Array(1001).fill(0);
    for (const [people, from, to] of trips) {
        change[from] += people; // board
        change[to] -= people;   // get off (same km as later boardings)
    }

    let load = 0;
    for (let km = 0; km <= 1000; km++) {
        load += change[km];
        if (load > capacity) return false;
    }
    return true;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(n + L)$** with `L = 1001` road positions.
* **Space Complexity**: **$O(L)$**.
* For a huge road, sort the `2n` events instead: $O(n \log n)$ time, $O(n)$ space.

#### Edge Cases Handled:
* **Back-to-back trips** at the same km: net change at that km is applied once.
* **One trip bigger than capacity**: fails at its `from`.
