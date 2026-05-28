# 013. Isomorphic Strings (Easy)

---

### 📝 1. Problem Statement
Given two strings `s` and `t`, determine if they are **isomorphic**.

Two strings `s` and `t` are isomorphic if the characters in `s` can be replaced to get `t`.

All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "egg"`, `t = "add"`
* **Output**: `true`
* **Why**: We can create a one-to-one mapping:
  * `'e' -> 'a'`
  * `'g' -> 'd'`
  * Substituting these characters in `"egg"` results in `"add"`.

#### Test Case 2
* **Input**: `s = "foo"`, `t = "bar"`
* **Output**: `false`
* **Why**: The character `'o'` in `s` would have to map to both `'a'` and `'r'` in `t` at the same time, which is invalid.

#### Test Case 3
* **Input**: `s = "paper"`, `t = "title"`
* **Output**: `true`
* **Why**: We can map:
  * `'p' -> 't'`
  * `'a' -> 'i'`
  * `'e' -> 'l'`
  * `'r' -> 'e'`
  * Replacing `'paper'` character-by-character yields `'title'`.

---

### 💬 3. What is This Problem Actually Asking?
We need to verify if there exists a **perfect one-to-one mapping (bijection)** between the characters of `s` and the characters of `t`.
This means:
1. Every character in `s` must map to exactly one character in `t`.
2. No two different characters in `s` can map to the exact same character in `t`.
3. The original order of characters must be preserved.

If a collision is found in either mapping direction, the strings are not isomorphic.

---

### 🌍 4. Real-Life Example
Imagine a **secret cipher system** used to send messages:
* If your cipher key says:
  * Translate letter `'E'` to `'A'`
  * Translate letter `'G'` to `'D'`
* The word `"EGG"` becomes `"ADD"`. This is isomorphic because the recipient can decode `"ADD"` back to `"EGG"` without any ambiguity!
* However, if you mapped **both** `'F'` and `'O'` to `'X'`, then `"FOO"` would become `"XXX"`. When the recipient tries to decode `"XXX"`, they won't know if the first letter is an `'F'` or an `'O'`. This is a mapping collision, which is invalid in isomorphic strings!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Two Hash Maps / Object Dictionaries**.
  - *Why*: We need to track the mapping from `s -> t` AND `t -> s` simultaneously to enforce the one-to-one bijection.
* **Algorithm**: **Bijective Mapping Scan**.
  - If the lengths of `s` and `t` are different, return `false` immediately.
  - Initialize `mapS` (for `s -> t` relationships) and `mapT` (for `t -> s` relationships).
  - Iterate through characters at index `i` of both strings:
    - Get `charS = s[i]` and `charT = t[i]`.
    - If `charS` is already mapped in `mapS`:
      - If it maps to a character other than `charT`, return `false`.
    - If `charT` is already mapped in `mapT`:
      - If it maps to a character other than `charS`, return `false`.
    - Otherwise, register the mappings in both maps:
      - `mapS[charS] = charT`
      - `mapT[charT] = charS`
  - If we finish the entire loop without any conflicts, return `true`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function isIsomorphic(s: string, t: string): boolean {
    // If lengths differ, they cannot be isomorphic
    if (s.length !== t.length) {
        return false;
    }

    // Maps to track s -> t and t -> s character relations
    const mapS = new Map<string, string>();
    const mapT = new Map<string, string>();

    for (let i = 0; i < s.length; i++) {
        const charS = s[i];
        const charT = t[i];

        // Check s -> t mapping consistency
        if (mapS.has(charS)) {
            if (mapS.get(charS) !== charT) {
                return false;
            }
        } else {
            mapS.set(charS, charT);
        }

        // Check t -> s mapping consistency
        if (mapT.has(charT)) {
            if (mapT.get(charT) !== charS) {
                return false;
            }
        } else {
            mapT.set(charT, charS);
        }
    }

    return true;
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We iterate through the string of length $N$ exactly once. Hash map insertion and lookup are $O(1)$ on average.
* **Space Complexity**: **$O(K)$** — where $K$ is the number of unique characters in the strings (bounded by the alphabet size, which is at most 256 for standard ASCII characters). This is effectively $O(1)$ auxiliary space.

#### Edge Cases Handled:
* **Character Maps to Itself** (`s = "a"`, `t = "a"`): Handled perfectly; `mapS` maps `'a' -> 'a'` and `mapT` maps `'a' -> 'a'`, returning `true` (Correct).
* **Two Different Characters Map to One** (`s = "ab"`, `t = "aa"`):
  * `i = 0`: `'a' -> 'a'` mapped.
  * `i = 1`: `charS = 'b'`, `charT = 'a'`. `mapT` already contains `'a'` mapping to `'a'`, which is not `'b'`. The function returns `false` (Correct).
* **Strings of Different Lengths** (`s = "abc"`, `t = "ab"`): Returns `false` immediately at the length check (Correct).

---

### 🎬 8. Dry Run
Let's trace `s = "egg"`, `t = "add"` step-by-step:

#### **Step 0: i = 0**
```text
Pointers: i = 0
s: " e g g "
     ▲
     i
t: " a d d "
     ▲
     i
Maps: mapS = {}, mapT = {}
```
* **Characters**: `charS = 'e'`, `charT = 'a'`
* **Decision**: Neither character is mapped yet. Register both.
  - `mapS` adds `'e' -> 'a'`
  - `mapT` adds `'a' -> 'e'`
* **Next**: `i` becomes 1.

#### **Step 1: i = 1**
```text
Pointers: i = 1
s: " e g g "
       ▲
       i
t: " a d d "
       ▲
       i
Maps: mapS = { 'e' -> 'a' }, mapT = { 'a' -> 'e' }
```
* **Characters**: `charS = 'g'`, `charT = 'd'`
* **Decision**: Neither character is mapped yet. Register both.
  - `mapS` adds `'g' -> 'd'`
  - `mapT` adds `'d' -> 'g'`
* **Next**: `i` becomes 2.

#### **Step 2: i = 2**
```text
Pointers: i = 2
s: " e g g "
         ▲
         i
t: " a d d "
         ▲
         i
Maps: mapS = { 'e' -> 'a', 'g' -> 'd' }, mapT = { 'a' -> 'e', 'd' -> 'g' }
```
* **Characters**: `charS = 'g'`, `charT = 'd'`
* **Comparison**:
  - `mapS` already contains `'g'`. Checked mapping: `mapS.get('g')` is `'d'` (Match!).
  - `mapT` already contains `'d'`. Checked mapping: `mapT.get('d')` is `'g'` (Match!).
* **Decision**: No conflicts. Loop terminates. Returns `true`.
