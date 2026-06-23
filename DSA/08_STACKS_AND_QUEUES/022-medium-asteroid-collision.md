# 022. Asteroid Collision (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Zeta, Netflix, Google, Amazon
>
> **Interview Tag**: 🔥 **MUST SOLVE** - A top-tier interview classic. Excellent for testing directional flow, collision simulation logic, and stack-based elimination edge cases.

---

### 📝 1. Problem Statement
We are given an array `asteroids` of integers representing asteroids in a row.

For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.

Find out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `asteroids = [5, 10, -5]`
* **Output**: `[5, 10]`
* **Why**: The `10` and `-5` collide resulting in `10`. The `5` and `10` never collide because they are both moving right.

#### Test Case 2
* **Input**: `asteroids = [8, -8]`
* **Output**: `[]`
* **Why**: The `8` and `-8` collide and destroy each other.

#### Test Case 3
* **Input**: `asteroids = [10, 2, -5]`
* **Output**: `[10]`
* **Why**: The `2` and `-5` collide resulting in `-5`. The `10` and `-5` collide resulting in `10`.

#### Test Case 4
* **Input**: `asteroids = [-2, -1, 1, 2]`
* **Output**: `[-2, -1, 1, 2]`
* **Why**: The left-moving ones are at the start, and the right-moving ones are at the end, so they move away from each other and never collide.

---

### 💬 3. What is This Problem Actually Asking?
We need to model collisions in a 1D space. 
Collisions can only happen when a **right-moving asteroid (positive)** is followed by a **left-moving asteroid (negative)**.
Since one left-moving asteroid can collide with and destroy multiple right-moving asteroids to its left (like a domino effect), a Stack is the ideal structure to track our current active, surviving asteroids.

---

### 🌍 4. Real-Life Example
Think of **opposing bumper cars on a narrow track**:
* Cars moving right (`+`) enter the track and queue up.
* A car moving left (`-`) enters from the opposite side.
* It will crash into the first car it meets. Whichever car is smaller gets knocked off the track.
* If the left-moving car wins, it continues down the track and crashes into the next right-moving car in line, until it either hits a car that is larger than itself or clears the track.

---

### 🛠️ 5. Data Structure & Algorithms Used

We use a **Stack** to store surviving asteroids:
* Iterate through `asteroids` from left to right:
  * If the asteroid `ast` is positive (`ast > 0`), it is moving right. It can never collide with any asteroid currently in the stack (since they are already to its left). We **push** it onto the stack.
  * If the asteroid `ast` is negative (`ast < 0`), it is moving left. A collision will occur if the top of the stack is moving right (positive):
    * While the stack is not empty, the top of the stack is positive, and the top asteroid is smaller than the current left-moving asteroid (`stack[top] < abs(ast)`):
      * The top asteroid explodes. We **pop** it from the stack.
    * If the top asteroid is equal in size to the current left-moving asteroid (`stack[top] === abs(ast)`):
      * Both destroy each other. We **pop** the top asteroid, and flag the current asteroid as destroyed.
    * If the top asteroid is larger (`stack[top] > abs(ast)`):
      * The current left-moving asteroid is destroyed. We do NOT push it.
    * If the stack becomes empty or the top of the stack is moving left (negative), no further collision is possible. We **push** the current left-moving asteroid onto the stack.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Dry run with `asteroids = [10, 2, -5]`:

* **i = 0** (val = 10): Right-moving. Push `10`.
  * Stack = `[ 10 ]`.
* **i = 1** (val = 2): Right-moving. Push `2`.
  * Stack = `[ 10, 2 ]`.
* **i = 2** (val = -5): Left-moving.
  * Stack top is `2` (positive). `2 < abs(-5) (5)`. Pop `2`. Stack becomes `[ 10 ]`.
  * Stack top is `10` (positive). `10 > abs(-5) (5)`. The `-5` is destroyed. Stop.
  * Stack = `[ 10 ]`.

Final Result: `[10]`

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function asteroidCollision(asteroids: number[]): number[] {
    const stack: number[] = [];

    for (let i = 0; i < asteroids.length; i++) {
        const ast = asteroids[i];

        if (ast > 0) {
            // Right-moving asteroid can be pushed directly
            stack.push(ast);
        } else {
            // Left-moving asteroid. Process collisions with right-moving ones on stack.
            let destroyed = false;

            while (stack.length > 0 && stack[stack.length - 1] > 0) {
                const top = stack[stack.length - 1];

                if (top < Math.abs(ast)) {
                    // Top asteroid is smaller and explodes
                    stack.pop();
                    continue; // Check the next asteroid in stack
                } else if (top === Math.abs(ast)) {
                    // Both are same size and destroy each other
                    stack.pop();
                    destroyed = true;
                    break;
                } else {
                    // Top asteroid is larger, current asteroid explodes
                    destroyed = true;
                    break;
                }
            }

            // If the current left-moving asteroid survived all collisions, push it
            if (!destroyed) {
                stack.push(ast);
            }
        }
    }

    return stack;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Complexity | Description |
| :--- | :---: | :--- |
| **Time Complexity** | **$O(N)$** | Each asteroid is pushed onto the stack once and popped at most once. |
| **Space Complexity** | **$O(N)$** | To store the surviving asteroids in the stack. |

#### Edge Cases Handled:
* **No Collisions** (`[-2, -1, 1, 2]`): Since left-moving ones are pushed first, they never face right-moving ones behind them. Stack processes cleanly, returning `[-2, -1, 1, 2]`. Correct.
* **Mutual Destruction** (`[8, -8]`): The equal size case triggers popping `8` and breaking, leaving the stack empty. Returns `[]`. Correct.
