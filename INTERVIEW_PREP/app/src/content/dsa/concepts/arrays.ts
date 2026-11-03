import type { ConceptNote } from "../../types.ts";

const note: ConceptNote = {
  slug: "arrays",
  title: "Arrays & the in-place toolkit",
  why: "All nine Arrays problems are one of four patterns. Recognise the pattern in the first minute and the code writes itself.",
  minutes: 7,
  sections: [
    {
      heading: "What an array costs",
      body: `An array stores its elements **next to each other in memory**. The address of element i is \`start + i × size\`, which is why reading or writing by index is **O(1)**: no searching, just arithmetic.

The same layout makes the middle expensive. Inserting or deleting at index i shifts every element after it by one place.

| Operation | Cost | Why |
| :--- | :--- | :--- |
| \`arr[i]\` read / write | O(1) | address arithmetic |
| \`push\` / \`pop\` (end) | O(1) amortised | nothing shifts |
| \`unshift\` / \`shift\` (front) | O(n) | everything shifts |
| \`splice(i, 1)\` (middle) | O(n) | the tail shifts |
| search unsorted (\`includes\`, \`indexOf\`) | O(n) | must scan |
| search sorted | O(log n) | binary search |

**The trap:** calling \`splice\` inside a loop to delete elements is O(n) per delete, so O(n²) overall. Most problems in this section exist to teach the O(n) way around that.

**JavaScript note:** JS arrays are dynamic. When \`push\` runs out of room, the engine allocates a bigger block (about 1.5–2×) and copies everything. That copy is O(n), but it happens so rarely that each push is **O(1) amortised**.`,
    },
    {
      heading: "Pattern 1 — Read/write pointers (filter in place)",
      body: `One pointer **reads** every element; a second pointer marks where the next **kept** element should be **written**. Elements you keep get copied forward; elements you drop are simply skipped. The write pointer never passes the read pointer, so nothing is overwritten before it's read.

\`\`\`ts
let write = 0;
for (let read = 0; read < nums.length; read++) {
  if (keep(nums[read])) nums[write++] = nums[read];
}
// nums[0..write) is the answer
\`\`\`

O(n) time, O(1) space. Used by **Remove Duplicates**, **Remove Element** and **Move Zeroes**. The only thing that changes between them is the \`keep\` condition.`,
    },
    {
      heading: "Pattern 2 — Two pointers from opposite ends",
      body: `Start one pointer at each end and walk them toward each other, doing work on the pair, until they meet. Each element is touched once: O(n) time, O(1) space.

Used by **Reverse String** (swap the pair). The same shape appears later in Two Sum II, Valid Palindrome and Container With Most Water.

A variant: **fill from the back**. In **Merge Sorted Array**, the free space is at the end of nums1, so merging from the largest values backward never overwrites anything unread.`,
    },
    {
      heading: "Pattern 3 — One pass with running state",
      body: `Scan once, keep a small amount of state that summarises everything seen so far, and update the answer at each step.

- **Best Time to Buy and Sell Stock:** state = cheapest price so far; answer = best \`price − cheapest\`.
- **Max Consecutive Ones:** state = length of the current run of 1s; answer = longest run.

The skill is choosing state that is **enough to answer the question** without looking back. This is the seed of Kadane's algorithm and of dynamic programming.`,
    },
    {
      heading: "Pattern 4 — Math and XOR instead of extra memory",
      body: `When the input has a known structure, arithmetic can replace a hash set.

- **Missing Number:** the numbers 0..n should sum to n(n+1)/2. The difference from the actual sum is the missing one.
- **Single Number:** \`a ^ a = 0\` and \`a ^ 0 = a\`, and XOR is order-independent. XOR everything; every pair cancels and the single one is left.

Both turn an O(n)-space Set into O(1) space. Interviewers often ask for the Set version first, then "can you do it in constant space?"`,
    },
  ],
  keywords: [
    { term: "Contiguous memory", meaning: "Why indexing is O(1) and inserting in the middle is O(n)." },
    { term: "In-place", meaning: "Modify the input with O(1) extra space instead of building a new array." },
    { term: "Read/write (slow/fast) pointers", meaning: "Filter an array in one pass without splice." },
    { term: "Amortised O(1) push", meaning: "Occasional resize copies, cheap on average." },
    { term: "Invariant", meaning: "What's true about nums[0..write) at every step — say it out loud." },
  ],
  bonus: [
    "Spot `splice`/`shift` inside a loop and call it out as hidden O(n²).",
    "State the invariant of your pointers: \"everything before `write` is already the answer\".",
    "Offer the constant-space follow-up (XOR, sum formula, fill from the back) before being asked.",
  ],
  questions: [
    { q: "Why is arr[i] O(1) but inserting at index i O(n)?", a: "Elements sit next to each other, so the address of i is computed directly. Inserting means every later element must shift one slot to make room." },
    { q: "Why is calling splice inside a loop a problem?", a: "Each splice shifts the tail, O(n). Doing it for up to n elements is O(n²). The read/write pointer pattern does the same job in O(n)." },
    { q: "How does the read/write pointer pattern avoid overwriting data it still needs?", a: "write never gets ahead of read, so it only writes into slots that have already been read." },
    { q: "Why merge Merge Sorted Array from the back?", a: "The free space is at the end of nums1. Writing the largest values there first never overwrites an unread value of nums1." },
  ],
  recap: [
    "Index O(1), push/pop O(1) amortised, front or middle insert/delete O(n).",
    "Read/write pointers: Remove Duplicates, Remove Element, Move Zeroes — only the keep condition changes.",
    "Opposite-end pointers: Reverse String; fill from the back: Merge Sorted Array.",
    "One pass + running state: Stock (min so far), Max Consecutive Ones (current run).",
    "Math/XOR beats a Set for space: Missing Number (sum formula), Single Number (XOR).",
  ],
};

export default note;
