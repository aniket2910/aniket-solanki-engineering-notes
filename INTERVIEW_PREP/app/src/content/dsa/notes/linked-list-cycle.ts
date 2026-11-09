import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "linked-list-cycle",
  pattern: "Slow and fast pointers (Floyd's cycle detection)",
  topics: ["Linked List", "Two Pointers", "Hash Table"],
  companies: ["Amazon", "Microsoft", "Meta", "Google", "Apple", "Bloomberg", "Goldman Sachs"],
  gist: "Detect whether a list loops back on itself — first with a Set, then in O(1) space with tortoise and hare.",
  statement: `Given \`head\`, the head of a linked list, return \`true\` if the list has a **cycle**: some node can be reached again by following \`next\` pointers. Otherwise return \`false\`.

In the examples, \`pos\` is the index of the node the tail links back to (\`-1\` means no cycle). \`pos\` is **not** passed to your function.`,
  constraints: ["0 ≤ number of nodes ≤ 10⁴", "-10⁵ ≤ Node.val ≤ 10⁵", "pos is -1 or a valid index"],
  examples: [
    { input: "head = [3, 2, 0, -4], pos = 1", output: "true", explain: "The tail (-4) links back to the node at index 1 (2)." },
    { input: "head = [1, 2], pos = 0", output: "true" },
    { input: "head = [1], pos = -1", output: "false" },
  ],
  predict: [
    { input: "head = [], pos = -1", output: "false", why: "No nodes, no cycle." },
    { input: "head = [1], pos = 0", output: "true", why: "A single node pointing to itself is a cycle." },
    { input: "head = [1, 1, 1], pos = -1", output: "false", why: "Equal values are not a cycle; compare nodes, not values." },
  ],
  edgeCases: ["Empty list", "Single node, self-loop", "Cycle back to the head", "Repeated values without a cycle"],
  hints: [
    "If there's no cycle, walking the list eventually hits null. If there is, you walk forever. How do you notice you've been here before?",
    "A Set of visited **nodes** (not values) works in O(n) space. Can you do it with two pointers?",
    "slow moves 1, fast moves 2. If fast reaches null, no cycle. Otherwise fast must eventually land on slow.",
  ],
  approaches: [
    {
      name: "Set of visited nodes",
      idea: "Walk the list and store each node reference in a Set. If you meet a node already in the Set, there's a cycle; if you reach null, there isn't.",
      complexity: { time: "O(n)", space: "O(n)", why: "Each node is visited and stored once." },
      code: `function hasCycle(head: ListNode | null): boolean {
  const seen = new Set<ListNode>();
  for (let cur = head; cur; cur = cur.next) {
    if (seen.has(cur)) return true;
    seen.add(cur);
  }
  return false;
}`,
    },
    {
      name: "Floyd's tortoise and hare",
      idea: "`slow` moves one step, `fast` moves two. Without a cycle, `fast` reaches the end. With a cycle, both end up looping; inside the loop `fast` closes the gap by one node per step, so it must land exactly on `slow`.",
      complexity: { time: "O(n)", space: "O(1)", why: "slow enters the cycle within n steps; fast catches it within one more lap." },
      code: `function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    },
  ],
  complexityTalk: `The Set version is the honest first answer: O(n) time and space. The interviewer then asks "can you do it in O(1) space?" — that's the real question.

Why Floyd's terminates: once both pointers are inside a cycle of length C, the distance from fast to slow drops by 1 each step (fast gains 2, slow gains 1). It can't skip over zero, so they meet within C steps. Total time is still O(n).

Compare **node references** (\`slow === fast\`), never values. Lists with duplicate values break a value comparison.`,
  interview: {
    script: `"First idea: walk the list and keep a Set of nodes I've visited; seeing one again means a cycle. That's O(n) time and space. To get O(1) space I'll use Floyd's algorithm: slow moves one step, fast moves two. If there's no cycle, fast hits null and I return false. If there is a cycle, both pointers end up inside it, and each step fast gets one node closer to slow, so the gap reaches zero and they meet. I compare node references, not values. O(n) time, O(1) space."`,
    keywords: [
      { term: "Floyd's cycle detection", meaning: "Tortoise (1 step) and hare (2 steps)." },
      { term: "Reference equality", meaning: "Compare nodes with ===, not their values." },
      { term: "Gap closes by one", meaning: "Why fast can't jump over slow." },
    ],
    bonus: ["Explain why they must meet (gap shrinks by 1).", "Offer Linked List Cycle II: finding the start of the cycle.", "Mention the same idea finds duplicates in Find the Duplicate Number."],
    mistakes: ["Comparing values instead of nodes", "Checking slow === fast before moving (they start equal)", "Guard `while (fast.next)` — crashes on fast = null", "Marking visited by mutating node values"],
    followUps: [
      { q: "Return the node where the cycle starts?", a: "After they meet, move one pointer back to head; step both by one. They meet at the cycle start. (Distance head→start equals distance meeting point→start, mod cycle length.)" },
      { q: "Length of the cycle?", a: "After they meet, keep one still and walk the other until it returns, counting steps." },
    ],
  },
  starter: `/**
 * class ListNode {
 *   val: number
 *   next: ListNode | null
 * }
 */
function hasCycle(head: ListNode | null): boolean {

}`,
  tests: [
    { args: [[3, 2, 0, -4], 1], expected: true },
    { args: [[1, 2], 0], expected: true },
    { args: [[1], -1], expected: false },
    { args: [[], -1], expected: false, label: "Empty list" },
    { args: [[1], 0], expected: true, label: "Self-loop" },
    { args: [[1, 1, 1], -1], expected: false, label: "Duplicate values" },
  ],
};

export default note;
