# 006. Find Most Frequent Vowel and Consonant (Easy)

---

### 📝 1. Problem Statement
Given a string `s`, find the **most frequent vowel** and the **most frequent consonant** that appear in `s`. Return them along with their respective frequencies.

* The input string `s` consists of alphabetical letters, numbers, and spaces.
* We must ignore all numbers, spaces, and punctuation.
* The search should be **case-insensitive** (e.g. `'a'` and `'A'` count as the same character).
* If there is a tie, return the character that appears first alphabetically. If no vowels or consonants are found, return `null` for that character.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `s = "Hello World!!!"`
* **Output**:
  ```typescript
  {
      vowel: { char: "o", count: 2 },
      consonant: { char: "l", count: 3 }
  }
  ```
* **Why**: 
  * Vowels present: `'e'` (x1), `'o'` (x2) $\rightarrow$ Most frequent is `'o'` with count `2`.
  * Consonants present: `'h'` (x1), `'l'` (x3), `'w'` (x1), `'r'` (x1), `'d'` (x1) $\rightarrow$ Most frequent is `'l'` with count `3`.

#### Test Case 2
* **Input**: `s = "aae e  "`
* **Output**:
  ```typescript
  {
      vowel: { char: "a", count: 2 },
      consonant: null
  }
  ```
* **Why**: The string contains only vowels and spaces. No consonants exist, so `consonant` is `null`.

---

### 💬 3. What is This Problem Actually Asking?
We need to categorize all letters in a string into two buckets: **Vowels** (`a, e, i, o, u`) and **Consonants** (all other alphabetical letters).
1. We ignore spaces, numbers, and punctuation.
2. We count how many times each unique letter appears (case-insensitively).
3. We scan our counts to locate the highest occurring vowel and consonant.
4. If there's a tie in count (e.g. `'a'` appears twice and `'e'` appears twice), we select the one that comes first in alphabetical order.

---

### 🌍 4. Real-Life Example
Think of a **linguist analyzing a document**:
* The linguist has a ledger with two tables: **Vowels Ledger** and **Consonants Ledger**.
* As they read the document letter-by-letter:
  * If it's a space or punctuation, they ignore it.
  * If it's a vowel, they increment the count for that vowel in the Vowel Ledger.
  * If it's a consonant, they increment its count in the Consonants Ledger.
* In the end, they check both ledgers to see which character has the highest score.

---

### 🛠️ 5. Data Structure & Algorithm Used
* **Data Structure**: **Hash Map (`Record<string, number>` in TS)**.
  * *Why*: We use two maps: `vowelFreq` and `consonantFreq` to record the occurrences of each unique character in $O(1)$ updates.
* **Algorithm**: **Frequency Mapping & Linear Max Scan**.
  * *Why*: By mapping all character frequencies in a single linear pass of the string ($O(N)$ time), we can then find the maximums by simply scanning the keys of our two small Maps (which have a maximum size of 5 for vowels and 21 for consonants).

---

### 💻 6. Optimal Code (TypeScript)

```typescript
interface CharFreq {
    char: string;
    count: number;
}

interface Result {
    vowel: CharFreq | null;
    consonant: CharFreq | null;
}

function findMostFrequent(s: string): Result {
    const vowels = new Set<string>(['a', 'e', 'i', 'o', 'u']);
    
    const vowelFreq: Record<string, number> = {};
    const consonantFreq: Record<string, number> = {};

    // Step 1: Count character frequencies
    for (let i = 0; i < s.length; i++) {
        const char = s[i].toLowerCase();

        // Process only if it is a lowercase English letter (a-z)
        if (char >= 'a' && char <= 'z') {
            if (vowels.has(char)) {
                vowelFreq[char] = (vowelFreq[char] || 0) + 1;
            } else {
                consonantFreq[char] = (consonantFreq[char] || 0) + 1;
            }
        }
    }

    // Helper: Scan a frequency map to find the most frequent character with alphabetical tie-breaking
    function getMostFrequent(freqMap: Record<string, number>): CharFreq | null {
        let maxChar: string = "";
        let maxCount: number = 0;

        for (const char in freqMap) {
            const count = freqMap[char];
            if (count > maxCount) {
                maxCount = count;
                maxChar = char;
            } else if (count === maxCount) {
                // Alphabetical tie-breaking (e.g. 'a' < 'e')
                if (char < maxChar) {
                    maxChar = char;
                }
            }
        }

        return maxCount > 0 ? { char: maxChar, count: maxCount } : null;
    }

    return {
        vowel: getMostFrequent(vowelFreq),
        consonant: getMostFrequent(consonantFreq)
    };
}
```

---

### 📊 7. Complexity & Edge Cases

* **Time Complexity**: **$O(N)$** — We scan the string of length $N$ once to populate the maps. Scanning the frequency maps takes constant $O(5 + 21) = O(1)$ operations because the English alphabet has a fixed size.
* **Space Complexity**: **$O(1)$** — The frequency maps hold at most $26$ entries, which is a constant memory footprint.

#### Edge Cases Handled:
* **Ties in Count** (`s = "ba"`):
  * `vowelFreq = { a: 1 }`, `consonantFreq = { b: 1 }`.
  * Returns `{ vowel: { char: "a", count: 1 }, consonant: { char: "b", count: 1 } }` (Correct).
* **Multiple ties** (`s = "ea"`):
  * `vowelFreq = { e: 1, a: 1 }`.
  * The alphabetical tie-breaker ensures `'a'` is selected over `'e'` because `'a' < 'e'`. Returns `'a'` (Correct).
* **No Valid Characters** (`s = "123 !!!"`): No letters are processed. Returns `{ vowel: null, consonant: null }` (Correct).
