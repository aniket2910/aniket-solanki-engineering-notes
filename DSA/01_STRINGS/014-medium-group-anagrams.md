# 014. Group Anagrams (Medium)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Google, Facebook/Meta, Microsoft, Salesforce


---

### 📝 1. Problem Statement
Given an array of strings `strs`, group the **anagrams** together. You can return the answer in **any order**.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `strs = ["eat","tea","tan","ate","nat","bat"]`
* **Output**: `[["bat"],["nat","tan"],["ate","eat","tea"]]`
* **Why**:
  * `"bat"` has no other anagrams in the list.
  * `"nat"` and `"tan"` both contain `'a'`, `'n'`, and `'t'`.
  * `"ate"`, `"eat"`, and `"tea"` all contain `'a'`, `'e'`, and `'t'`.

#### Test Case 2
* **Input**: `strs = [""]`
* **Output**: `[[""]]`

#### Test Case 3
* **Input**: `strs = ["a"]`
* **Output**: `[["a"]]`

---

### 💬 3. What is This Problem Actually Asking?
We are given a list of words and need to gather all words that are anagrams of one another into their own sub-lists.

Remember: **Anagrams have the exact same characters in the exact same frequencies**. 
This implies that if we **sort** the characters of any two anagrams alphabetically, they will produce the **exact same sorted string**.
For example:
* `"eat"` sorted alphabetically $\rightarrow$ `"aet"`
* `"tea"` sorted alphabetically $\rightarrow$ `"aet"`
* `"ate"` sorted alphabetically $\rightarrow$ `"aet"`

We can use this sorted string as a **shared key (signature)** in a Hash Map to group all matching original strings together!

---

### 🌍 4. Real-Life Example
Imagine a **mail sorting room** with envelopes containing scrambled letters.
* You receive envelopes: `"eat"`, `"tea"`, `"tan"`, `"ate"`, `"nat"`, `"bat"`.
* To organize them, you sort the letters inside each envelope alphabetically and drop the envelope into a filing cabinet drawer labeled with that sorted signature:
  * `"eat"` goes into drawer `aet`.
  * `"tea"` goes into drawer `aet`.
  * `"tan"` goes into drawer `ant`.
  * `"ate"` goes into drawer `aet`.
  * `"nat"` goes into drawer `ant`.
  * `"bat"` goes into drawer `abt`.
* When done, you open each drawer and pull out the groups of words. You have successfully sorted them!

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Hash Map (`Map<string, string[]>`)**.
  - *Why*: Allows us to map a unique string signature (the sorted word) to a list of original words in $O(1)$ average time.
* **Algorithm**: **Sorted Signature Grouping**.
  - Initialize a Hash Map `map = new Map<string, string[]>()`.
  - Iterate through each word `str` in the array `strs`:
    - Generate its signature by converting it to a character array, sorting it, and joining it back: `const signature = str.split('').sort().join('')`.
    - If `map` does not have the `signature`, initialize it with an empty array.
    - Append the original `str` to the array corresponding to `signature`.
  - Return all the grouped values from the map: `Array.from(map.values())`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
function groupAnagrams(strs: string[]): string[][] {
    const map = new Map<string, string[]>();

    for (const str of strs) {
        // Generate the sorted signature
        // e.g., "eat" -> ["e", "a", "t"] -> ["a", "e", "t"] -> "aet"
        const signature = str.split('').sort().join('');

        // Get the existing group or initialize a new array
        let group = map.get(signature);
        if (!group) {
            group = [];
            map.set(signature, group);
        }
        
        // Push the original string into its anagram group
        group.push(str);
    }

    // Convert map values to a 2D array
    return Array.from(map.values());
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N \cdot K \log K)$** — where $N$ is the number of strings in `strs`, and $K$ is the maximum length of a string in `strs`. For each word, sorting it takes $O(K \log K)$ time, and we do this $N$ times.
* **Space Complexity**: **$O(N \cdot K)$** — to store all the strings and their corresponding groups inside the Hash Map.

#### Edge Cases Handled:
* **Empty Strings** (`strs = ["", ""]`): Both words sort to `""`. They are correctly grouped together into `[["", ""]]` (Correct).
* **No Anagrams** (`strs = ["a", "b", "c"]`): Each word generates a unique key (`"a"`, `"b"`, `"c"`), resulting in three individual groups `[["a"], ["b"], ["c"]]` (Correct).
* **Single Element Array** (`strs = ["a"]`): Returns `[["a"]]` immediately (Correct).

---

### 🎬 8. Dry Run
Let's trace `strs = ["eat", "tea", "tan"]` step-by-step:

#### **Step 0: Initial State**
* `map` is empty: `{}`

#### **Step 1: str = "eat"**
* **Signature**: `"eat"` $\rightarrow$ split $\rightarrow$ `['e', 'a', 't']` $\rightarrow$ sort $\rightarrow$ `['a', 'e', 't']` $\rightarrow$ join $\rightarrow$ `"aet"`.
* **Hash Map Lookup**: `"aet"` not found in `map`. Create a new group.
* **Update Map**:
```text
map = {
  "aet" ──► [ "eat" ]
}
```

#### **Step 2: str = "tea"**
* **Signature**: `"tea"` $\rightarrow$ split, sort, join $\rightarrow$ `"aet"`.
* **Hash Map Lookup**: `"aet"` found!
* **Update Map**:
```text
map = {
  "aet" ──► [ "eat", "tea" ]
}
```

#### **Step 3: str = "tan"**
* **Signature**: `"tan"` $\rightarrow$ split $\rightarrow$ `['t', 'a', 'n']` $\rightarrow$ sort $\rightarrow$ `['a', 'n', 't']` $\rightarrow$ join $\rightarrow$ `"ant"`.
* **Hash Map Lookup**: `"ant"` not found in `map`. Create a new group.
* **Update Map**:
```text
map = {
  "aet" ──► [ "eat", "tea" ],
  "ant" ──► [ "tan" ]
}
```

#### **Final Output**
* Extracting values from `map`: `[["eat", "tea"], ["tan"]]`.
