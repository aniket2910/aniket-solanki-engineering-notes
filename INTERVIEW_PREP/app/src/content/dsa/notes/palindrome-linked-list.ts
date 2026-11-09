import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "palindrome-linked-list",
  pattern: "Find middle + reverse second half",
  topics: ["Linked List", "Two Pointers", "Stack", "Recursion"],
  companies: ["Amazon", "Microsoft", "Meta", "Apple", "Google", "Adobe", "Bloomberg"],
  gist: "Check whether a list reads the same both ways in O(1) space — combines slow/fast pointers with in-place reversal.",
  statement: `Given the \`head\` of a singly linked list, return \`true\` if it is a **palindrome** (reads the same forward and backward), otherwise \`false\`.

**Follow-up:** can you do it in O(n) time and O(1) space?`,
  constraints: ["1 ≤ number of nodes ≤ 10⁵", "0 ≤ Node.val ≤ 9"],
  examples: [
    { input: "head = [1, 2, 2, 1]", output: "true" },
    { input: "head = [1, 2]", output: "false" },
  ],
  predict: [
    { input: "head = [1]", output: "true", why: "A single value is a palindrome." },
    { input: "head = [1, 2, 1]", output: "true", why: "Odd length: the middle value is compared with nothing." },
    { input: "head = [1, 2, 3, 1]", output: "false", why: "2 ≠ 3 in the middle pair." },
  ],
  edgeCases: ["Single node", "Odd vs even length", "All equal values", "Mismatch only in the middle"],
  hints: [
    "On an array this is two pointers from both ends. What stops you doing that on a singly linked list?",
    "You can't walk backward — but you could make the second half point backward. How do you find where the second half starts?",
    "Slow/fast to find the middle, reverse from there, then compare the first half with the reversed second half node by node.",
  ],
  approaches: [
    {
      name: "Copy to an array, two pointers",
      idea: "Copy values into an array, then compare from both ends toward the middle. Simple and clear, but O(n) extra space.",
      complexity: { time: "O(n)", space: "O(n)", why: "One pass to copy, half a pass to compare; an array of n values." },
      code: `function isPalindrome(head: ListNode | null): boolean {
  const vals: number[] = [];
  for (let cur = head; cur; cur = cur.next) vals.push(cur.val);
  for (let i = 0, j = vals.length - 1; i < j; i++, j--) {
    if (vals[i] !== vals[j]) return false;
  }
  return true;
}`,
    },
    {
      name: "Middle, reverse, compare",
      idea: "Find the middle with slow/fast pointers. Reverse the list from `slow` onward. Now walk one pointer from the head and one from the reversed tail; any mismatch means not a palindrome. For odd length the middle node ends the second half and is compared with itself — harmless.",
      complexity: { time: "O(n)", space: "O(1)", why: "Three linear passes (middle, reverse, compare); a few pointers." },
      code: `function isPalindrome(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }

  let prev: ListNode | null = null;
  while (slow) {
    const next = slow.next;
    slow.next = prev;
    prev = slow;
    slow = next;
  }

  for (let a = head, b = prev; b; a = a!.next, b = b.next) {
    if (a!.val !== b.val) return false;
  }
  return true;
}`,
    },
  ],
  complexityTalk: `The array version is O(n) space; the follow-up is about getting to O(1). The cost of the O(1) version is that it **mutates the input**. In production that's a side effect the caller didn't ask for, so say you'd reverse the second half back before returning. Interviewers like hearing that.

A recursive version (compare a "front" pointer against nodes as the recursion unwinds) looks clever but still uses O(n) call stack, so it doesn't satisfy the follow-up.`,
  interview: {
    script: `"The easy version copies values into an array and checks with two pointers — O(n) space. For O(1) space: I find the middle with slow and fast pointers, reverse the second half in place, then walk from the head and from the reversed half comparing values. If any pair differs, it's not a palindrome. That's O(n) time, O(1) space. It modifies the list, so if the caller needs it intact I'd reverse the second half again before returning."`,
    keywords: [
      { term: "Composition of patterns", meaning: "Middle (slow/fast) + reverse + two-pointer compare." },
      { term: "Side effect", meaning: "The O(1) version mutates the input; offer to restore it." },
      { term: "Recursion isn't O(1)", meaning: "The call stack counts as space." },
    ],
    bonus: ["Offer to restore the list.", "Explain why odd length needs no special case.", "Explain why the recursive solution doesn't meet O(1) space."],
    mistakes: ["Comparing until `a` is null instead of until the reversed half ends", "Forgetting to save next while reversing", "Calling recursion O(1) space"],
    followUps: [
      { q: "Restore the list afterwards?", a: "Keep a pointer to the reversed half's head (prev) and reverse it again; the node before the middle still points at the original middle, so the list is whole again." },
      { q: "Do it with a stack?", a: "Push the first half's values (found with slow/fast), then pop while walking the second half. O(n/2) space." },
    ],
  },
  starter: `/**
 * class ListNode {
 *   val: number
 *   next: ListNode | null
 * }
 */
function isPalindrome(head: ListNode | null): boolean {

}`,
  tests: [
    { args: [[1, 2, 2, 1]], expected: true },
    { args: [[1, 2]], expected: false },
    { args: [[1]], expected: true, label: "Single node" },
    { args: [[1, 2, 1]], expected: true, label: "Odd length" },
    { args: [[1, 2, 3, 1]], expected: false },
  ],
};

export default note;
