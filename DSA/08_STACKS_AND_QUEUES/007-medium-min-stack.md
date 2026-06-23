# 007. Min Stack (Medium)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **MUST SOLVE** - A core system design interview classic. Tests your ability to trade space for time, showing how parallel tracking structures can eliminate linear search bottlenecks.

---

### 📝 1. Problem Statement
Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Implement the `MinStack` class:
* `MinStack()`: Initializes the stack object.
* `push(val)`: Pushes the element `val` onto the stack.
* `pop()`: Removes the element on the top of the stack.
* `top()`: Gets the top element of the stack.
* `getMin()`: Retrieves the minimum element in the stack.

All operations (`push`, `pop`, `top`, `getMin`) must run in **$O(1)$** time.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**:
  ```typescript
  let minStack = new MinStack();
  minStack.push(-2);
  minStack.push(0);
  minStack.push(-3);
  minStack.getMin(); // Returns -3
  minStack.pop();
  minStack.top();    // Returns 0
  minStack.getMin(); // Returns -2
  ```
* **Output**: Correct stack and minimum tracking behavior.

---

### 💬 3. What is This Problem Actually Asking?
Normally, finding the minimum element in a list requires scanning all elements, which takes $O(N)$ time. We need to optimize this search to $O(1)$.
Because elements are inserted and removed in a strict LIFO order, the minimum value changes in a predictable, nested way. We can cache the minimum value at each point in time.

---

### 🌍 4. Real-Life Example
Think of a **stack of shipping cargo containers**:
* As you stack containers on top of each other, each container has a weight tag.
* To quickly know the maximum load-bearing limit, you write down on the side of *each container* the weight of the **heaviest container in the stack from this level down**.
* If you pop a container off the top, the container below it already has the correct maximum weight written on it for the remaining stack, meaning you never need to re-weigh the entire stack.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present the **Auxiliary Stack Approach**, which is highly readable, type-safe, and avoids integer overflow errors:

* Maintain two stacks:
  1. `mainStack`: Stores the actual pushed values.
  2. `minStack`: Stores the running minimum value. The top of this stack is always the minimum value present in the `mainStack`.
* **Push(val)**:
  * Push `val` to `mainStack`.
  * If `minStack` is empty, or `val <= top of minStack`, push `val` to `minStack`. Otherwise, push the current top of `minStack` again (to match the size of `mainStack`).
* **Pop()**:
  * Pop from both `mainStack` and `minStack`.
* **GetMin()**:
  * Return the top element of `minStack` ($O(1)$ time).

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Dry run of operations: `push(5)`, `push(3)`, `push(7)`, `getMin()`, `pop()`, `getMin()`.

#### **Step 1: push(5)**
* `mainStack` = `[ 5 ]`
* `minStack` = `[ 5 ]`

#### **Step 2: push(3)**
* `3` is less than `5` (top of `minStack`).
* `mainStack` = `[ 5, 3 ]`
* `minStack` = `[ 5, 3 ]`

#### **Step 3: push(7)**
* `7` is greater than `3` (top of `minStack`). We push `3` again onto `minStack`.
* `mainStack` = `[ 5, 3, 7 ]`
* `minStack` = `[ 5, 3, 3 ]`

#### **Step 4: getMin()**
* Return top of `minStack` -> `3`.

#### **Step 5: pop()**
* Pop from both stacks:
  * `mainStack` becomes `[ 5, 3 ]`
  * `minStack` becomes `[ 5, 3 ]`

#### **Step 6: getMin()**
* Return top of `minStack` -> `3`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class MinStack {
    private mainStack: number[];
    private minStack: number[];

    constructor() {
        this.mainStack = [];
        this.minStack = [];
    }

    push(val: number): void {
        this.mainStack.push(val);
        
        // If minStack is empty, the current value is the minimum.
        // Otherwise, the new minimum is the lesser of the current value and the top of minStack.
        if (this.minStack.length === 0) {
            this.minStack.push(val);
        } else {
            const currentMin = this.minStack[this.minStack.length - 1];
            this.minStack.push(Math.min(val, currentMin));
        }
    }

    pop(): void {
        if (this.mainStack.length === 0) return;
        this.mainStack.pop();
        this.minStack.pop();
    }

    top(): number {
        return this.mainStack[this.mainStack.length - 1];
    }

    getMin(): number {
        return this.minStack[this.minStack.length - 1];
    }
}
```

---

### 📊 7. Complexity & Edge Cases

| Operation | Time Complexity | Space Complexity |
| :--- | :---: | :---: |
| `push()` | **$O(1)$** | **$O(1)$** |
| `pop()` | **$O(1)$** | **$O(1)$** |
| `top()` | **$O(1)$** | **$O(1)$** |
| `getMin()` | **$O(1)$** | **$O(1)$** |

#### Complexity Note:
* **Space Complexity**: $O(N)$ total space, as we duplicate min-value tracking. This trade-off is optimal to achieve $O(1)$ constant runtime.
