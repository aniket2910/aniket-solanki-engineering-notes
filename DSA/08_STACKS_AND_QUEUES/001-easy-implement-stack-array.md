# 001. Implement Stack using Array (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Core CS Fundamentals, Microsoft
>
> **Interview Tag**: Core Fundamentals - Essential for understanding memory limits, stack pointer management, and how high-level language stack structures work under the hood.

---

### 📝 1. Problem Statement
Implement a Stack data structure using a fixed-size or dynamic array. The stack must support the following standard operations:
* `push(x)`: Adds an element `x` to the top of the stack.
* `pop()`: Removes and returns the element from the top of the stack. If the stack is empty, return an appropriate value (e.g., `-1` or throw an error).
* `top()` / `peek()`: Returns the element at the top of the stack without removing it.
* `size()`: Returns the number of elements in the stack.
* `isEmpty()`: Returns `true` if the stack contains no elements, otherwise `false`.

To demonstrate a low-level array implementation, avoid using built-in high-level array methods like JavaScript's native `.push()` or `.pop()`. Instead, manage an array index pointer manually.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**:
  ```typescript
  let stack = new ArrayStack(5);
  stack.push(10);
  stack.push(20);
  stack.top(); // Returns 20
  stack.pop(); // Returns 20
  stack.size(); // Returns 1
  stack.isEmpty(); // Returns false
  ```
* **Output**: Correct stack behavior.

---

### 💬 3. What is This Problem Actually Asking?
We need to simulate a **Last-In, First-Out (LIFO)** data container. The key restriction is that we can only insert and remove elements from one end (the top). We must use a raw array container and a helper index pointer (often called the `topPointer` or `topIdx`) to track where the top element is.

---

### 🌍 4. Real-Life Example
Think of a **spring-loaded cafeteria plate dispenser**:
* When a clean plate is washed, it is placed on top of the dispenser, pushing the stack down (`push`).
* When a customer needs a plate, they take the top plate (`pop`).
* You cannot retrieve a plate from the bottom or middle without taking all the plates on top off first.

---

### 🛠️ 5. Data Structure & Algorithms Used
We maintain:
1. `arr`: A storage array.
2. `topIdx`: An integer pointer representing the index of the top element. It is initialized to `-1` (meaning the stack is empty).

* **Push**: Increment `topIdx` and place the element at `arr[topIdx]`.
* **Pop**: Retrieve the element at `arr[topIdx]`, decrement `topIdx`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We will dry run a stack of capacity 3:

#### **Step 0: Initial State**
* `topIdx` = `-1`
* `arr` = `[ null, null, null ]`

#### **Step 1: push(10)**
* `topIdx` increments to `0`.
* `arr[0] = 10`.
* `arr` = `[ 10, null, null ]`, `topIdx` = `0`

#### **Step 2: push(20)**
* `topIdx` increments to `1`.
* `arr[1] = 20`.
* `arr` = `[ 10, 20, null ]`, `topIdx` = `1`

#### **Step 3: pop()**
* Value at `arr[topIdx]` (which is `arr[1] = 20`) is saved.
* `topIdx` decrements to `0`.
* Returns `20`.
* `arr` = `[ 10, 20, null ]` (the slot at index 1 is now logically out of bounds), `topIdx` = `0`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class ArrayStack {
    private arr: number[];
    private topIdx: number;
    private capacity: number;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.arr = new Array(capacity);
        this.topIdx = -1; // -1 indicates stack is empty
    }

    push(x: number): void {
        if (this.topIdx >= this.capacity - 1) {
            throw new Error("Stack Overflow: Cannot push to a full stack");
        }
        this.topIdx++;
        this.arr[this.topIdx] = x;
    }

    pop(): number {
        if (this.isEmpty()) {
            return -1; // Standard indicator or throw Error
        }
        const val = this.arr[this.topIdx];
        this.topIdx--;
        return val;
    }

    top(): number {
        if (this.isEmpty()) {
            return -1;
        }
        return this.arr[this.topIdx];
    }

    size(): number {
        return this.topIdx + 1;
    }

    isEmpty(): boolean {
        return this.topIdx === -1;
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
| `isEmpty()` | **$O(1)$** | **$O(1)$** |

#### Edge Cases Handled:
* **Stack Overflow**: Attempting to push when `topIdx === capacity - 1`. Handled by throwing an error.
* **Stack Underflow**: Attempting to pop or top when `topIdx === -1`. Handled by returning `-1`.
