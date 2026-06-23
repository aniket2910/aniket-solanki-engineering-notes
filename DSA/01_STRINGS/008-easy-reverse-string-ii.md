# 008. Reverse String II (Easy)

> [!IMPORTANT]
> **Company Targets**: 🏢 Adobe, Amazon, Google


---

### 📝 1. Problem Statement
Given a string `s` and an integer `k`, reverse the first `k` characters for every `2k` characters counting from the start of the string.

If there are fewer than `k` characters remaining, reverse all of them. If there are less than `2k` but greater than or equal to `k` characters, then reverse the first `k` characters and leave the other as original.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "abcdefg"`, `k = 2`
* **Output**: `"bacdfeg"`
* **Why**:
  * First 2k block (`abcd`): reverse first k (`ab` $\rightarrow$ `ba`), leave `cd` alone. Result: `bacd`.
  * Remaining part (`efg`): length is $3$, which is $\ge k$ ($2$) and $< 2k$ ($4$). Reverse first k (`ef` $\rightarrow$ `fe`), leave `g` alone. Result: `feg`.
  * Combined: `bacdfeg`.

#### Test Case 2
* **Input**: `s = "abcd"`, `k = 2`
* **Output**: `"bacd"`

---

### 💬 3. What is This Problem Actually Asking?
We need to process the string in blocks of size `2k`.
* Inside each `2k` block, we must **reverse only the first half** (which is `k` characters) and **leave the second half alone** (which is also `k` characters).
* **Boundary Rules**: At the very end of the string, if we run out of characters:
  * If the remaining segment has fewer than `k` characters, reverse the entire remaining segment.
  * If the remaining segment has between `k` and `2k` characters, reverse the first `k` characters and leave the rest alone.

Because strings are immutable in TypeScript, we should convert the string to a character array, modify the array in-place, and join it back at the end!

---

### 🌍 4. Real-Life Example
Think of a **gift-wrapping conveyor belt**:
* You are wrapping boxes in blocks of 4 (`2k` where `k = 2`).
* For every group of 4 boxes:
  * You flip the first 2 boxes upside down (reverse).
  * You leave the next 2 boxes upright (no change).
* If you reach the end of the day and only have 1 box left (less than `k`), you flip it upside down.
* If you have 3 boxes left (between `k` and `2k`), you flip the first 2 boxes and leave the 3rd one upright.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Character Array (`string[]`)**.
  * *Why*: Strings are immutable in TypeScript. Modifying character pointers directly in a character array takes $O(1)$ writes and prevents massive $O(N^2)$ string allocation overhead.
* **Algorithm**: **Chunked Jump Two-Pointer Swap**.
  * *Why*: We loop through the array, jumping our pointer `i` forward by exactly `2k` in each step (`i += 2 * k`).
    * For each starting position `i`, we define our reverse range: `left = i`, and `right = Math.min(i + k - 1, s.length - 1)` (handling end-of-string boundaries).
    * We swap elements between `left` and `right` using opposite direction two-pointers.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function reverseStr(s: string, k: number): string {
    // Convert string to mutable character array
    const arr: string[] = s.split('');

    // Jump by 2k in each step
    for (let i = 0; i < arr.length; i += 2 * k) {
        let left: number = i;
        // The right pointer is either i + k - 1 (end of k-segment) 
        // or the very end of the array (in case we have fewer than k elements remaining)
        let right: number = Math.min(i + k - 1, arr.length - 1);

        // Standard in-place two-pointer swap
        while (left < right) {
            const temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }

    return arr.join('');
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We visit each character in the string of length $N$ at most twice (once during array splitting/joining, and at most once during swapping).
* **Space Complexity**: **$O(N)$** — Required to hold the mutable character array of length $N$ in memory.

#### Edge Cases Handled:
* **Fewer than $k$ Characters at the End** (`s = "abcdefg"`, `k = 8`):
  * `i = 0`, `left = 0`. `right = Math.min(7, 6) = 6` (end of array).
  * The entire string is reversed. Returns `"gfedcba"` (Correct).
* **$k$ is Larger than String Length**: Handled perfectly by the `Math.min` boundary check. Reverses the entire string (Correct).
* **$k = 1$**: `right = i`. Loop `left < right` doesn't run. The string remains unchanged (Correct).

---

### 🎬 8. Dry Run
Let's trace `s = "abcdefg"`, `k = 2` with `arr = ["a", "b", "c", "d", "e", "f", "g"]`:

#### **First Block: i = 0**
```text
Pointers: i = 0, left = 0, right = 1
Array:    [ "a", "b", "c", "d", "e", "f", "g" ]
            idx0 idx1 idx2 idx3 idx4 idx5 idx6
Pointers:    ▲    ▲
            left right
```
* **Step 1 (left < right)**: Swap `arr[left]` ("a") and `arr[right]` ("b").
* **Updated Array**:
```text
Array:    [ "b", "a", "c", "d", "e", "f", "g" ]
                 ▲    ▲
               right left
```
* **Next**: `left` (1) is no longer `< right` (0). Swap terminates. `i` advances by `2*k = 4` to become `4`.

#### **Second Block: i = 4**
```text
Pointers: i = 4, left = 4, right = 5
Array:    [ "b", "a", "c", "d", "e", "f", "g" ]
            idx0 idx1 idx2 idx3 idx4 idx5 idx6
Pointers:                        ▲    ▲
                               left right
```
* **Step 1 (left < right)**: Swap `arr[left]` ("e") and `arr[right]` ("f").
* **Updated Array**:
```text
Array:    [ "b", "a", "c", "d", "f", "e", "g" ]
                                   ▲    ▲
                                 right left
```
* **Next**: `left` (5) is no longer `< right` (4). Swap terminates. `i` advances to `8`.
* **Exit**: `i` (8) is $\ge$ array length (7). Loop terminates.
* **Final Result**: `"bacdfeg"`.
