import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "add-two-numbers",
  pattern: "Build with a tail pointer + carry",
  topics: ["Linked List", "Math", "Recursion"],
  companies: ["Amazon", "Microsoft", "Meta", "Google", "Apple", "Bloomberg", "Adobe", "Uber"],
  gist: "Add two numbers stored as reversed digit lists — grade-school addition, one node at a time, without converting to a number.",
  statement: `You're given two non-empty linked lists representing two non-negative integers. The digits are stored in **reverse order** (the head is the ones digit), one digit per node. Add the two numbers and return the sum as a linked list in the same format.

Neither number has leading zeros, except the number 0 itself.`,
  constraints: ["1 ≤ nodes in each list ≤ 100", "0 ≤ Node.val ≤ 9", "No leading zeros"],
  examples: [
    { input: "l1 = [2, 4, 3], l2 = [5, 6, 4]", output: "[7, 0, 8]", explain: "342 + 465 = 807." },
    { input: "l1 = [0], l2 = [0]", output: "[0]" },
    { input: "l1 = [9, 9, 9, 9, 9, 9, 9], l2 = [9, 9, 9, 9]", output: "[8, 9, 9, 9, 0, 0, 0, 1]" },
  ],
  predict: [
    { input: "l1 = [5], l2 = [5]", output: "[0, 1]", why: "5 + 5 = 10: the final carry becomes a new node." },
    { input: "l1 = [1, 8], l2 = [0]", output: "[1, 8]", why: "Different lengths: treat the missing digits as 0." },
    { input: "l1 = [9, 9], l2 = [1]", output: "[0, 0, 1]", why: "The carry ripples through the 9s and out the end." },
  ],
  edgeCases: ["Different lengths", "Final carry (e.g. 5 + 5)", "Carry rippling through 9s", "Both zero"],
  hints: [
    "The digits are already ones-first — the order you add by hand. What do you keep between columns?",
    "Converting to a number fails: 100 digits overflows even a 64-bit integer. Work digit by digit.",
    "Loop while l1, l2 or carry remain: sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry; append sum % 10; carry = floor(sum / 10). Build from a dummy with a tail pointer.",
  ],
  approaches: [
    {
      name: "Convert to BigInt and back",
      idea: "Read each list into a BigInt (digits reversed), add, and write the result back as a list. It works in JS because BigInt is arbitrary-precision, but it dodges what the question is testing, and in most languages it would overflow.",
      complexity: { time: "O(m + n)", space: "O(m + n)", why: "Builds digit strings and the output list." },
      code: `function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const read = (h: ListNode | null) => {
    let s = "";
    for (; h; h = h.next) s = h.val + s;
    return BigInt(s);
  };
  const digits = (read(l1) + read(l2)).toString();
  const dummy = new ListNode();
  let tail = dummy;
  for (let i = digits.length - 1; i >= 0; i--) tail = tail.next = new ListNode(Number(digits[i]));
  return dummy.next;
}`,
    },
    {
      name: "Digit by digit with carry",
      idea: "Walk both lists together like column addition. At each step add the two digits (0 if a list has ended) plus the carry, append `sum % 10` to the result, and keep `floor(sum / 10)` as the new carry. Continue while either list has digits **or** a carry is left.",
      complexity: { time: "O(max(m, n))", space: "O(max(m, n))", why: "One step per digit; the output list has max(m, n) + 1 nodes at most (extra space beyond output is O(1))." },
      code: `function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode();
  let tail = dummy;
  let carry = 0;
  while (l1 || l2 || carry) {
    const sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry;
    tail = tail.next = new ListNode(sum % 10);
    carry = Math.floor(sum / 10);
    l1 = l1?.next ?? null;
    l2 = l2?.next ?? null;
  }
  return dummy.next;
}`,
    },
  ],
  complexityTalk: `O(max(m, n)) time. The output itself is max(m, n) + 1 nodes; beyond that the extra space is O(1). Say "O(1) extra, not counting the output".

The real point is **why you can't convert to a number**: 100 digits is far past 2⁵³ (JS \`number\` loses precision after about 16 digits). An interviewer will ask that if you reach for \`Number\` or \`parseInt\`.

Putting \`carry\` in the loop condition handles the final carry with no extra code after the loop.`,
  interview: {
    script: `"The digits are stored ones-first, which is exactly how column addition goes, so I add digit by digit. I build the answer from a dummy node with a tail pointer. Each step I take the digit from each list, using 0 if that list has ended, add the carry, append sum mod 10, and set carry to sum divided by 10, rounded down. I loop while either list has nodes or carry is non-zero, so a final carry like 5 + 5 creates the extra node. O(max(m, n)) time. I don't convert to a number, because 100 digits would overflow."`,
    keywords: [
      { term: "Carry", meaning: "floor(sum / 10), passed to the next digit." },
      { term: "Dummy + tail", meaning: "Append nodes without a first-node special case." },
      { term: "Overflow", meaning: "Why converting to a number is wrong." },
    ],
    bonus: ["Put carry in the loop condition.", "Explain overflow without being asked.", "Mention the forward-order follow-up (Add Two Numbers II)."],
    mistakes: ["Dropping the final carry", "Stopping when the shorter list ends", "Converting with Number() — loses precision past ~16 digits"],
    followUps: [
      { q: "What if the digits are stored most-significant first?", a: "Add Two Numbers II: reverse both lists and reuse this, then reverse the result — or push digits onto two stacks and pop to add, building the answer by inserting at the head." },
      { q: "Subtract or multiply instead?", a: "Subtract: same walk with a borrow, then strip leading zeros. Multiply: grade-school multiplication into an array of digit sums, then normalise carries." },
    ],
  },
  starter: `/**
 * class ListNode {
 *   val: number
 *   next: ListNode | null
 * }
 */
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {

}`,
  tests: [
    { args: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8] },
    { args: [[0], [0]], expected: [0] },
    { args: [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]], expected: [8, 9, 9, 9, 0, 0, 0, 1] },
    { args: [[5], [5]], expected: [0, 1], label: "Final carry" },
    { args: [[1, 8], [0]], expected: [1, 8], label: "Different lengths" },
  ],
};

export default note;
