# 002. Reverse String (Easy)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **MUST SOLVE** - The absolute fundamental training wheels for **Two-Pointer** pointer convergence and swapping.

---

### 📝 1. Problem Statement
Write a function that reverses a string. The input string is given as an array of characters `s`.

You must do this by modifying the input array **in-place** with $O(1)$ extra memory.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = ["h","e","l","l","o"]`
* **Output**: `["o","l","l","e","h"]`

#### Test Case 2
* **Input**: `s = ["H","a","n","n","a","h"]`
* **Output**: `["h","a","n","n","a","H"]`

---

### 💬 3. What is This Problem Actually Asking?
We need to reverse the characters of a string represented directly as a mutable array of individual characters (`s: string[]`).

The strict constraints are:
* **In-Place Modification**: We are not allowed to create a new array or allocate extra memory buffers ($O(1)$ auxiliary space).

---

### 🌍 4. Real-Life Example
Imagine a **line of people standing in a narrow hallway**:
* You want them to reverse their order.
* Because the hallway is extremely narrow, no one can leave the hallway or stand in a side room (no extra space).
* To achieve this, the first person swaps places with the last person. 
* Then the second person swaps places with the second-to-last person.
* They keep swapping inward toward the center until everyone has swapped.

---

### 🛠️ 5. Data Structure & Algorithms Used

We present **two approaches** to show how you can solve swapping iteratively or recursively:

#### Approach 1: Iterative Two-Pointer Swap (Optimal)
We place one pointer at the beginning (`left`) and one at the end (`right`), swap their values in-place, and move them toward each other until they meet.
* **Pros**: Highly efficient, uses $O(1)$ constant memory.

#### Approach 2: Recursive Divide & Conquer Swap
We define a helper function `helper(left, right)` that swaps elements at the boundaries, and then recursively calls itself with `helper(left + 1, right - 1)` until the pointers meet.
* **Pros**: Incredibly elegant and demonstrates clear mastery of recursive stacks.
* **Cons**: Consumes $O(N)$ call stack memory, making it less optimal than iterative, but great to show to an interviewer as a second approach!

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Let's trace the optimal iterative Two-Pointer swap algorithm using **Test Case 1**:
`s = ["h", "e", "l", "l", "o"]`

We initialize `left = 0` and `right = 4`.

---

#### **Step 0: Initial State**
```text
Array:    [ "h",  "e",  "l",  "l",  "o" ]
            idx0  idx1  idx2  idx3  idx4
Pointers:    ▲                     ▲
           left                  right
```
* **Pointers**: `left = 0`, `right = 4`.
* **Comparison**: `left < right` (`0 < 4` is True).
* **Action**: 
  1. Swap elements at `left` and `right` indices (`s[0]` and `s[4]`).
  2. Advance pointers: `left++` (becomes 1), `right--` (becomes 3).
* **Updated Array**:
```text
Array:    [ "o",  "e",  "l",  "l",  "h" ]
                  ▲           ▲
                left        right
```

---

#### **Step 1: Pointers Inward**
```text
Array:    [ "o",  "e",  "l",  "l",  "h" ]
            idx0  idx1  idx2  idx3  idx4
Pointers:          ▲           ▲
                 left        right
```
* **Pointers**: `left = 1`, `right = 3`.
* **Comparison**: `left < right` (`1 < 3` is True).
* **Action**: 
  1. Swap elements at `left` and `right` indices (`s[1]` and `s[3]`).
  2. Advance pointers: `left++` (becomes 2), `right--` (becomes 2).
* **Updated Array**:
```text
Array:    [ "o",  "l",  "l",  "e",  "h" ]
                        ▲
                    left / right
```

---

#### **Step 2: Pointers Meet**
```text
Array:    [ "o",  "l",  "l",  "e",  "h" ]
            idx0  idx1  idx2  idx3  idx4
Pointers:               ▲
                    left / right
```
* **Pointers**: `left = 2`, `right = 2`.
* **Comparison**: `left < right` (`2 < 2` is False).
* **Action**: Pointers have met. Loop terminates cleanly.

---

#### **Final Result**
* The array is reversed in-place to `["o", "l", "l", "e", "h"]`!

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 2 is shown in comments to show a clear progression of thought!

```typescript
function reverseString(s: string[]): void {
    // ==========================================
    // 1st Approach: Iterative Two-Pointer Swap (Optimal)
    // ==========================================
    let left = 0;
    let right = s.length - 1;

    while (left < right) {
        let temp = s[left];
        s[left] = s[right];
        s[right] = temp;
        
        left++;
        right--;
    }

    // ==========================================
    // 2nd Approach: Recursive Swaps
    // ==========================================
    /*
    const helper = (left: number, right: number): void => {
        if (left >= right) return;
        
        let temp = s[left];
        s[left] = s[right];
        s[right] = temp;
        
        helper(left + 1, right - 1);
    };
    
    helper(0, s.length - 1);
    */
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Iterative | Approach 2: Recursive |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Swaps $N/2$ pairs. | **$O(N)$** — Makes $N/2$ function calls. |
| **Space Complexity** | **$O(1)$** — Constant variables. | **$O(N)$** — Call stack depth of $N/2$. |

#### Edge Cases Handled:
* **Single Character Array** (`s = ["a"]`): Handled perfectly; bounds are equal so no swaps are executed (Correct).
* **Even vs Odd Lengths**: Both meet and terminate cleanly when `left >= right` (Correct).
