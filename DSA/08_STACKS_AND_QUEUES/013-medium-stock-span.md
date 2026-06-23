# 013. Stock Span Problem (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft, Flipkart
>
> **Interview Tag**: Dynamic Stream Processing - A classic financial interview question. Tests your ability to apply the monotonic stack to a stream of incoming real-time data.

---

### 📝 1. Problem Statement
Design an algorithm that collects daily price quotes for some stock and returns the **span** of that stock's price for the current day.

The **span** of the stock's price in one day is the maximum number of consecutive days (starting from today and going backward) for which the stock price was less than or equal to the price of that day.

* For example, if the prices of the stock in the last four days is `[70, 60, 70, 80]` and the price of the stock today is `75`, then the span of today is `4` because starting from today, the price of the stock was less than or equal to `75` for `4` consecutive days.
* If the prices of the stock in the last four days is `[76, 60, 70, 80]` and the price of the stock today is `75`, then the span of today is `3`.

Implement the `StockSpanner` class:
* `StockSpanner()`: Initializes the object of the class.
* `next(price)`: Returns the **span** of the stock's price given that today's price is `price`.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**:
  ```typescript
  let stockSpanner = new StockSpanner();
  stockSpanner.next(100); // Returns 1
  stockSpanner.next(80);  // Returns 1
  stockSpanner.next(60);  // Returns 1
  stockSpanner.next(70);  // Returns 2 (covers [60, 70])
  stockSpanner.next(60);  // Returns 1
  stockSpanner.next(75);  // Returns 4 (covers [60, 70, 60, 75])
  stockSpanner.next(85);  // Returns 6 (covers [80, 60, 70, 60, 75, 85])
  ```
* **Output**: Correct span evaluation values.

---

### 💬 3. What is This Problem Actually Asking?
For each new day's price, look backward and count how many consecutive days (including today) had prices less than or equal to today's price.
Instead of walking backward through history every single day (which would be $O(N^2)$ time), we want to cache the results so that we can skip groups of smaller prices in constant time.

---

### 🌍 4. Real-Life Example
Think of a **running record sheet** for a weightlifter:
* On day 1, they lift 100 kg. That's a record. Span = 1.
* On day 2, they lift 80 kg. Span = 1.
* On day 3, they lift 60 kg. Span = 1.
* On day 4, they lift 70 kg. They check their log. Since 70 is more than 60, they count day 3, and add day 3's span (1) to their count. Day 2 (80 kg) is still heavier, so they stop. Span = 2.
* On day 7, they lift 85 kg. They pop smaller days from their memory, adding their spans together: day 6 (75 kg), day 4 (70 kg)... until they reach day 1 (100 kg) which is heavier. They count all intermediate days in one step!

---

### 🛠️ 5. Data Structure & Algorithms Used

We use a **Monotonic Stack** of pairs `[price, span]`:
* The stack stores elements in decreasing order of price.
* When `next(price)` is called:
  * Initialize `span = 1` (since today counts as 1 day).
  * While the stack is not empty and the top element's price is less than or equal to the current `price`:
    * We pop the top element from the stack and add its span to our current `span`.
  * Push `[price, span]` onto the stack.
  * Return `span`.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Dry run of operations: `next(100)`, `next(80)`, `next(70)`, `next(75)`.

#### **Step 1: next(100)**
* Stack is empty.
* Push `[100, 1]`.
* Stack = `[ [100, 1] ]`. Returns `1`.

#### **Step 2: next(80)**
* `80` < `100` (top). No popping.
* Push `[80, 1]`.
* Stack = `[ [100, 1], [80, 1] ]`. Returns `1`.

#### **Step 3: next(70)**
* `70` < `80` (top). No popping.
* Push `[70, 1]`.
* Stack = `[ [100, 1], [80, 1], [70, 1] ]`. Returns `1`.

#### **Step 4: next(75)**
* `75` >= `70` (top). Pop `[70, 1]`. `span` becomes `1 + 1 = 2`.
* `75` < `80` (top). Stop popping.
* Push `[75, 2]`.
* Stack = `[ [100, 1], [80, 1], [75, 2] ]`. Returns `2`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
type PriceSpanPair = {
    price: number;
    span: number;
};

class StockSpanner {
    private stack: PriceSpanPair[];

    constructor() {
        this.stack = [];
    }

    next(price: number): number {
        let span = 1;

        // Pop elements from the stack while their prices are less than or equal to current price
        // Accumulate their spans into the current day's span
        while (this.stack.length > 0 && this.stack[this.stack.length - 1].price <= price) {
            const popped = this.stack.pop()!;
            span += popped.span;
        }

        // Push the accumulated price-span pair onto the stack
        this.stack.push({ price, span });

        return span;
    }
}
```

---

### 📊 7. Complexity & Edge Cases

| Operation | Time Complexity (Worst-Case) | Time Complexity (Amortized) | Space Complexity |
| :--- | :---: | :---: | :---: |
| `next()` | **$O(N)$** | **$O(1)$** | **$O(N)$** |

#### Why it is Amortized $O(1)$:
Every single day's price is pushed onto the stack exactly once and popped from the stack at most once. For any series of $N$ calls to `next()`, the total number of stack pop operations cannot exceed $N$.
Thus, the average cost per `next()` call is **$O(1)$**!
