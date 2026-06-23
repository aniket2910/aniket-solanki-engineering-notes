# 012. Daily Temperatures (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon, Meta
>
> **Interview Tag**: 🔥 **MUST SOLVE** - A top-tier interview classic. Demonstrates how to adapt the monotonic stack to track **index spans** instead of raw element values.

---

### 📝 1. Problem Statement
Given an array of integers `temperatures` representing the daily temperatures, return *an array `answer` such that `answer[i]` is the number of days you have to wait after the `ith` day to get a warmer temperature*. 

If there is no future day for which this is possible, keep `answer[i] == 0` instead.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `temperatures = [73, 74, 75, 71, 69, 72, 76, 73]`
* **Output**: `[1, 1, 4, 2, 1, 1, 0, 0]`
* **Why**:
  * For day 0 (temp = 73), day 1 is warmer (74), wait = `1 - 0 = 1`.
  * For day 2 (temp = 75), day 6 is warmer (76), wait = `6 - 2 = 4`.
  * For day 6 (temp = 76), no warmer day in the future, wait = `0`.

#### Test Case 2
* **Input**: `temperatures = [30, 40, 50, 60]`
* **Output**: `[1, 1, 1, 0]`

---

### 💬 3. What is This Problem Actually Asking?
For each index `i` in the array, find the distance `j - i` to the first index `j > i` such that `temperatures[j] > temperatures[i]`.
This is exactly the **Next Greater Element** problem, but instead of caching the values on the stack, we cache the **indices** of the elements so we can compute distance offsets.

---

### 🌍 4. Real-Life Example
Think of **waiting for winter to end**:
* You are keeping a calendar log of temperatures.
* Each day, you write down on your calendar: *"How many days from today did I have to wait to see a day strictly warmer than today?"*
* If you scan the calendar, you only care about future days. A monotonic stack lets you track the days you are still waiting for a warmer temperature.

---

### 🛠️ 5. Data Structure & Algorithms Used

We use a **Monotonic Decreasing Stack** storing element indices:
* We traverse the array from right to left (backwards):
  * For each day `i`:
    * While the stack is not empty and `temperatures[stack[top]] <= temperatures[i]`, we pop the index from the stack (since those days are colder/equal and cannot be the warmer day we are waiting for).
    * If the stack is not empty, the top of the stack is the index of the next warmer day. The wait distance is `stack[top] - i`.
    * If the stack is empty, there is no warmer day in the future. The wait distance is `0`.
    * Push the current index `i` onto the stack.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Dry run with `temperatures = [73, 74, 75, 71, 69, 72, 76, 73]` from index 7 down to 0:

* **i = 7** (temp = 73): Stack is empty. `ans[7] = 0`. Push `7`. Stack = `[7]`.
* **i = 6** (temp = 76): `temp[7]=73 <= 76`. Pop `7`. Stack empty. `ans[6] = 0`. Push `6`. Stack = `[6]`.
* **i = 5** (temp = 72): `temp[6]=76 > 72`. Top of stack is `6`. `ans[5] = 6 - 5 = 1`. Push `5`. Stack = `[6, 5]`.
* **i = 4** (temp = 69): `temp[5]=72 > 69`. Top of stack is `5`. `ans[4] = 5 - 4 = 1`. Push `4`. Stack = `[6, 5, 4]`.
* **i = 3** (temp = 71):
  * `temp[4]=69 <= 71`. Pop `4`.
  * `temp[5]=72 > 71`. Top of stack is `5`. `ans[3] = 5 - 3 = 2`.
  * Push `3`. Stack = `[6, 5, 3]`.
* **i = 2** (temp = 75):
  * `temp[3]=71 <= 75`. Pop `3`.
  * `temp[5]=72 <= 75`. Pop `5`.
  * `temp[6]=76 > 75`. Top of stack is `6`. `ans[2] = 6 - 2 = 4`.
  * Push `2`. Stack = `[6, 2]`.
* **i = 1** (temp = 74): `temp[2]=75 > 74`. Top of stack is `2`. `ans[1] = 2 - 1 = 1`. Push `1`. Stack = `[6, 2, 1]`.
* **i = 0** (temp = 73): `temp[1]=74 > 73`. Top of stack is `1`. `ans[0] = 1 - 0 = 1`. Push `0`. Stack = `[6, 2, 1, 0]`.

Final Result: `[1, 1, 4, 2, 1, 1, 0, 0]`

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function dailyTemperatures(temperatures: number[]): number[] {
    const n = temperatures.length;
    const result = new Array(n).fill(0);
    const stack: number[] = []; // Stores INDICES of temperatures

    for (let i = n - 1; i >= 0; i--) {
        const currentTemp = temperatures[i];

        // Pop indices whose temperatures are colder than or equal to current day's temperature
        while (stack.length > 0 && temperatures[stack[stack.length - 1]] <= currentTemp) {
            stack.pop();
        }

        // If stack is not empty, top index represents the next warmer day
        if (stack.length > 0) {
            result[i] = stack[stack.length - 1] - i;
        }

        // Push current index as a potential warmer day for previous days
        stack.push(i);
    }

    return result;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Complexity | Description |
| :--- | :---: | :--- |
| **Time Complexity** | **$O(N)$** | A single backward pass over the array of size $N$. Each index is pushed and popped at most once. |
| **Space Complexity** | **$O(N)$** | To store the indices in the stack. In the worst-case (decreasing temps), stack stores up to $N$ indices. |

#### Edge Cases Handled:
* **Strictly Increasing Temperatures** (`[30, 40, 50]`): Every day's warmer day is the immediate next day. Returns `[1, 1, 0]`. Correct.
* **Strictly Decreasing Temperatures** (`[90, 80, 70]`): No warmer days in the future. Returns `[0, 0, 0]`. Correct.
