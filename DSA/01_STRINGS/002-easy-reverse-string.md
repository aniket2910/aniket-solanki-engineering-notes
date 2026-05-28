# 002. Reverse String (Easy)

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
We need to reverse the characters of a string. 

The strict constraints are:
* **In-Place Modification**: We are not allowed to create a new array or allocate extra memory buffers ($O(1)$ auxiliary space).
* **Array of Characters**: The string is represented directly as an array of individual character strings (`s: string[]`).

---

### 🌍 4. Real-Life Example
Imagine a **line of people standing in a narrow hallway**:
* You want them to reverse their order.
* Because the hallway is extremely narrow, no one can leave the hallway or stand in a side room (no extra space).
* To achieve this, the first person swaps places with the last person. 
* Then the second person swaps places with the second-to-last person.
* They keep swapping inward toward the center until everyone has swapped.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Array** (specifically a character array that supports constant-time $O(1)$ index swaps).
* **Algorithm**: **Two-Pointer Technique (Opposite Directions)**.
  * *Why*: By placing a pointer at the beginning (`left`) and one at the end (`right`), we can swap their values and move them toward each other. Since we swap in-place, the memory footprint remains exactly $O(1)$.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
/**
 Do not return anything, modify s in-place instead.
 */
function reverseString(s: string[]): void {
    let left: number = 0;
    let right: number = s.length - 1;

    while (left < right) {
        // Swap characters in-place
        const temp: string = s[left];
        s[left] = s[right];
        s[right] = temp;

        // Move pointers toward the center
        left++;
        right--;
    }
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We swap $N/2$ pairs of characters, which runs in linear time relative to the length of the array $N$.
* **Space Complexity**: **$O(1)$** — We only use a single character variable (`temp`) for swapping, keeping the space constant.

#### Edge Cases Handled:
* **Single Character Array** (`s = ["a"]`): `left = 0`, `right = 0`. The loop does not run because `left < right` ($0 < 0$) is false. The array remains correctly unchanged (Correct).
* **Even Length Array** (`s = ["a", "b"]`): `left = 0`, `right = 1`. One swap occurs, converting to `["b", "a"]`. Loop terminates as `left` becomes `1` and `right` becomes `0` (Correct).
* **Odd Length Array** (`s = ["a", "b", "c"]`): Pointers meet exactly at index `1` (`"b"`). The center element does not need to be swapped with itself, and the loop exits cleanly (Correct).
