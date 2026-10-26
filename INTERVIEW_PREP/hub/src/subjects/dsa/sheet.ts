// The Namaste DSA Sheet (https://namastedev.com/namaste-dsa-sheet), in its own order.
//
// Each entry points at the note in DSA/ that teaches it. The reading content always comes
// from that note; this file only adds what a note can't say on its own: which function to
// call, how to build LeetCode's linked-list/tree inputs, and how to compare answers whose
// order doesn't matter. `tests` here replace a note's tests only where the note writes
// them as prose or as a code walkthrough.

import type { JudgeSpec } from "./judge.ts";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type SheetItem = {
  slug: string;
  title: string;
  difficulty: Difficulty;
  link: string;
  /** Path under DSA/. */
  note: string;
  judge: JudgeSpec;
};

export type SheetSection = { num: number; title: string; items: SheetItem[] };

const lc = (slug: string) => `https://leetcode.com/problems/${slug}/`;
const nd = (slug: string) => `https://namastedev.com/practice/${slug}`;

function item(
  slug: string,
  title: string,
  difficulty: Difficulty,
  note: string,
  judge: JudgeSpec,
  link = lc(slug),
): SheetItem {
  return { slug, title, difficulty, link, note, judge };
}

const E = "Easy";
const M = "Medium";
const H = "Hard";

const list = { args: ["list"], returns: "list" } as const;
const tree = { args: ["tree"] } as const;

// Listed twice in the sheet (Linked List, and Two Pointers), so the spec is shared.
const intersection: JudgeSpec = {
  entry: "getIntersectionNode",
  prepare: "intersection",
  returns: "nodeVal",
  tests: [
    { args: [8, [4, 1, 8, 4, 5], [5, 6, 1, 8, 4, 5], 2, 3], expected: 8 },
    { args: [2, [1, 9, 1, 2, 4], [3, 2, 4], 3, 1], expected: 2 },
    { args: [0, [2, 6, 4], [1, 5], 3, 2], expected: null },
  ],
};

export const sheet: SheetSection[] = [
  {
    num: 1,
    title: "Foundation",
    items: [
      item("sum", "Sum", E, "02_MATH/007-easy-sum-of-arguments.md", { entry: "sum", prepare: "spread" }, nd("sum")),
      item("second-largest-digit-in-a-string", "Second Largest", E, "01_STRINGS/001-easy-second-largest-digit.md", { entry: "secondHighest" }),
      item("palindrome-number", "Palindrome Number", E, "02_MATH/001-easy-palindrome-number.md", { entry: "isPalindrome" }),
      item("reverse-integer", "Reverse Integer", M, "02_MATH/002-medium-reverse-integer.md", { entry: "reverse" }),
      item("count-negative", "Count Negative Numbers in an Array", E, "05_ARRAYS/025-easy-count-negative-numbers.md", { entry: "countNegatives" }, nd("count-negative")),
      item("find-smallest-number", "Find Smallest Number in an Array", E, "05_ARRAYS/026-easy-find-smallest-number.md", { entry: "findSmallest" }, nd("find-smallest-number")),
      item("find-largest-number", "Find Largest Number in an Array", E, "05_ARRAYS/027-easy-find-largest-number.md", { entry: "findLargest" }, nd("find-largest-number")),
      item("binary-search", "Binary Search", E, "03_BINARY_SEARCH/001-easy-binary-search.md", { entry: "search" }),
      item("sort-an-array", "Merge Sort", M, "04_SORTING/001-medium-sort-an-array.md", { entry: "sortArray" }),
      item("power-of-two", "Power of Two", E, "02_MATH/003-easy-power-of-two.md", { entry: "isPowerOfTwo" }),
    ],
  },
  {
    num: 2,
    title: "Arrays",
    items: [
      item("remove-duplicates-from-sorted-array", "Remove Duplicates", E, "05_ARRAYS/001-easy-remove-duplicates-from-sorted-array.md", {
        entry: "removeDuplicates",
        returns: { inplacePrefix: 0 },
        tests: [
          { args: [[1, 1, 2]], expected: [2, [1, 2]] },
          { args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: [5, [0, 1, 2, 3, 4]] },
        ],
      }),
      item("remove-element", "Remove Element", E, "05_ARRAYS/002-easy-remove-element.md", {
        entry: "removeElement",
        returns: { inplacePrefix: 0 },
        compare: "unorderedDeep",
        tests: [
          { args: [[3, 2, 2, 3], 3], expected: { k: 2, prefix: [2, 2] } },
          { args: [[0, 1, 2, 2, 3, 0, 4, 2], 2], expected: { k: 5, prefix: [0, 1, 3, 0, 4] } },
        ],
      }),
      item("reverse-string", "Reverse String", E, "01_STRINGS/002-easy-reverse-string.md", { entry: "reverseString", returns: { inplace: 0 } }),
      item("best-time-to-buy-and-sell-stock", "Best Time to Buy and Sell Stocks", E, "05_ARRAYS/003-easy-best-time-to-buy-and-sell-stock.md", { entry: "maxProfit" }),
      item("merge-sorted-array", "Merge Sorted Arrays", E, "05_ARRAYS/004-easy-merge-sorted-array.md", { entry: "merge", returns: { inplace: 0 } }),
      item("move-zeroes", "Move Zeros", E, "05_ARRAYS/005-easy-move-zeroes.md", { entry: "moveZeroes", returns: { inplace: 0 } }),
      item("max-consecutive-ones", "Max Consecutive Ones", E, "05_ARRAYS/006-easy-max-consecutive-ones.md", { entry: "findMaxConsecutiveOnes" }),
      item("missing-number", "Missing Number", E, "02_MATH/004-easy-missing-number.md", { entry: "missingNumber" }),
      item("single-number", "Single Number", E, "02_MATH/005-easy-single-number.md", { entry: "singleNumber" }),
    ],
  },
  {
    num: 3,
    title: "Linked List",
    items: [
      item("design-linked-list", "Design Linked List", M, "06_LINKED_LIST/001-medium-design-linked-list.md", { kind: "class", entry: "MyLinkedList" }),
      item("middle-of-the-linked-list", "Middle of Linked List", E, "06_LINKED_LIST/003-easy-middle-of-linked-list.md", { entry: "middleNode", ...list }),
      item("reverse-linked-list", "Reverse Linked List", E, "06_LINKED_LIST/002-easy-reverse-linked-list.md", { entry: "reverseList", ...list }),
      item("linked-list-cycle", "Linked List Cycle", E, "06_LINKED_LIST/004-easy-linked-list-cycle.md", { entry: "hasCycle", prepare: "cycleList" }),
      item("palindrome-linked-list", "Palindrome Linked List", E, "06_LINKED_LIST/009-easy-palindrome-linked-list.md", { entry: "isPalindrome", args: ["list"] }),
      item("intersection-of-two-linked-lists", "Intersection of two Linked Lists", E, "06_LINKED_LIST/008-easy-intersection-of-two-linked-lists.md", intersection),
      item("remove-linked-list-elements", "Remove Linked List Elements", E, "06_LINKED_LIST/005-easy-remove-linked-list-elements.md", { entry: "removeElements", args: ["list", "value"], returns: "list" }),
      item("remove-nth-node-from-end-of-list", "Remove nth node from end of List", M, "06_LINKED_LIST/010-medium-remove-nth-node-from-end-of-list.md", { entry: "removeNthFromEnd", args: ["list", "value"], returns: "list" }),
      item("remove-duplicates-from-sorted-list", "Remove Duplicates from Sorted List", E, "06_LINKED_LIST/006-easy-remove-duplicates-from-sorted-list.md", { entry: "deleteDuplicates", ...list }),
      item("odd-even-linked-list", "Odd Even Linked List", M, "06_LINKED_LIST/012-medium-odd-even-linked-list.md", { entry: "oddEvenList", ...list }),
      item("add-two-numbers", "Add Two Numbers", M, "06_LINKED_LIST/013-medium-add-two-numbers.md", { entry: "addTwoNumbers", args: ["list", "list"], returns: "list" }),
      item("merge-two-sorted-lists", "Merge Two Sorted Lists", E, "06_LINKED_LIST/007-easy-merge-two-sorted-lists.md", { entry: "mergeTwoLists", args: ["list", "list"], returns: "list" }),
      item("rotate-list", "Rotate List", M, "06_LINKED_LIST/014-medium-rotate-list.md", { entry: "rotateRight", args: ["list", "value"], returns: "list" }),
      item("swap-nodes-in-pairs", "Swap Nodes in Pairs", M, "06_LINKED_LIST/011-medium-swap-nodes-in-pairs.md", { entry: "swapPairs", ...list }),
    ],
  },
  {
    num: 4,
    title: "Strings",
    items: [
      item("length-of-last-word", "Length of Last Word", E, "01_STRINGS/003-easy-length-of-last-word.md", { entry: "lengthOfLastWord" }),
      item("find-words-containing-character", "Find Words Containing Character", E, "01_STRINGS/004-easy-find-words-containing-character.md", { entry: "findWordsContaining" }),
      item("jewels-and-stones", "Jewels and Stones", E, "01_STRINGS/005-easy-jewels-and-stones.md", { entry: "numJewelsInStones" }),
      item("find-most-frequent-vowel-and-consonant", "Find Most Frequent Vowel and Consonant", E, "01_STRINGS/006-easy-find-most-frequent-vowel-and-consonant.md", {
        entry: "findMostFrequent",
        tests: [
          { args: ["Hello World!!!"], expected: { vowel: { char: "o", count: 2 }, consonant: { char: "l", count: 3 } } },
          { args: ["aae e  "], expected: { vowel: { char: "a", count: 2 }, consonant: null } },
        ],
      }),
      item("split-a-string-in-balanced-strings", "Split a String in Balanced Strings", E, "01_STRINGS/007-easy-split-a-string-in-balanced-strings.md", { entry: "balancedStringSplit" }),
      item("reverse-string-ii", "Reverse String II", E, "01_STRINGS/008-easy-reverse-string-ii.md", { entry: "reverseStr" }),
      item("valid-palindrome", "Valid Palindrome", E, "01_STRINGS/009-easy-valid-palindrome.md", { entry: "isPalindrome" }),
      item("largest-odd-number-in-string", "Largest Odd Number in a String", E, "01_STRINGS/010-easy-largest-odd-number-in-a-string.md", { entry: "largestOddNumber" }),
      item("longest-common-prefix", "Longest Common Prefix", E, "01_STRINGS/011-easy-longest-common-prefix.md", { entry: "longestCommonPrefix" }),
      item("valid-anagram", "Valid Anagram", E, "01_STRINGS/012-easy-valid-anagram.md", { entry: "isAnagram" }),
      item("isomorphic-strings", "Isomorphic Strings", E, "01_STRINGS/013-easy-isomorphic-strings.md", { entry: "isIsomorphic" }),
      item("group-anagrams", "Group Anagrams", M, "01_STRINGS/014-medium-group-anagrams.md", { entry: "groupAnagrams", compare: "unorderedDeep" }),
      item("minimum-add-to-make-parentheses-valid", "Minimum Add to Make Parentheses Valid", M, "01_STRINGS/015-medium-minimum-add-to-make-parentheses-valid.md", { entry: "minAddToMakeValid" }),
      item("reverse-words-in-a-string", "Reverse Words in a String", M, "01_STRINGS/016-medium-reverse-words-in-a-string.md", { entry: "reverseWords" }),
      item("sum-of-beauty-of-all-substrings", "Sum of Beauty of All Substrings", M, "01_STRINGS/017-medium-sum-of-beauty-of-all-substrings.md", { entry: "beautySum" }),
      item("decode-string", "Decode String", M, "01_STRINGS/018-medium-decode-string.md", { entry: "decodeString" }),
      item("count-and-say", "Count and Say", M, "01_STRINGS/019-medium-count-and-say.md", { entry: "countAndSay" }),
      item("reorganize-string", "Reorganize String", M, "01_STRINGS/020-medium-reorganize-string.md", { entry: "reorganizeString", compare: "reorganized" }),
      item("repeated-string-match", "Repeated String Match", M, "01_STRINGS/021-medium-repeated-string-match.md", { entry: "repeatedStringMatch" }),
    ],
  },
  {
    num: 5,
    title: "Stack and Queues",
    items: [
      item("implement-stack-using-queues", "Implement Stack", E, "08_STACKS_AND_QUEUES/004-medium-implement-stack-queues.md", {
        kind: "class",
        entry: "MyStack",
        tests: [
          { args: [["MyStack", "push", "push", "top", "pop", "empty"], [[], [1], [2], [], [], []]], expected: [null, null, null, 2, 2, false] },
          { args: [["MyStack", "push", "pop", "empty", "push", "push", "top"], [[], [5], [], [], [7], [9], []]], expected: [null, null, 5, true, null, null, 9] },
        ],
      }),
      item("implement-queue-using-stacks", "Implement Queue using Stacks", E, "08_STACKS_AND_QUEUES/003-medium-implement-queue-stacks.md", {
        kind: "class",
        entry: "MyQueue",
        tests: [
          { args: [["MyQueue", "push", "push", "peek", "pop", "empty"], [[], [1], [2], [], [], []]], expected: [null, null, null, 1, 1, false] },
          { args: [["MyQueue", "push", "push", "pop", "push", "pop", "pop", "empty"], [[], [1], [2], [], [3], [], [], []]], expected: [null, null, null, 1, null, 2, 3, true] },
        ],
      }),
      item("valid-parentheses", "Valid Parentheses", E, "08_STACKS_AND_QUEUES/005-easy-valid-parentheses.md", { entry: "isValid" }),
      item("min-stack", "Min Stack", E, "08_STACKS_AND_QUEUES/007-medium-min-stack.md", {
        kind: "class",
        entry: "MinStack",
        tests: [
          {
            args: [["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"], [[], [-2], [0], [-3], [], [], [], []]],
            expected: [null, null, null, null, -3, null, 0, -2],
          },
          {
            args: [["MinStack", "push", "push", "push", "getMin", "pop", "getMin"], [[], [0], [1], [0], [], [], []]],
            expected: [null, null, null, null, 0, null, 0],
          },
        ],
      }),
      item("remove-outermost-parentheses", "Remove Outermost Parentheses", E, "08_STACKS_AND_QUEUES/006-easy-remove-outermost-parentheses.md", { entry: "removeOuterParentheses" }),
      item("evaluate-reverse-polish-notation", "Evaluate Reverse Polish Notation", M, "08_STACKS_AND_QUEUES/008-medium-evaluate-reverse-polish-notation.md", { entry: "evalRPN" }),
      item("next-greater-element-i", "Next Greater Element", E, "08_STACKS_AND_QUEUES/009-easy-next-greater-element-i.md", { entry: "nextGreaterElement" }),
      item("daily-temperatures", "Daily Temperatures", M, "08_STACKS_AND_QUEUES/012-medium-daily-temperatures.md", { entry: "dailyTemperatures" }),
      item("next-greater-element-ii", "Next Greater Element - II", M, "08_STACKS_AND_QUEUES/010-medium-next-greater-element-ii.md", { entry: "nextGreaterElements" }),
      item("rotting-oranges", "Rotting Oranges", M, "08_STACKS_AND_QUEUES/015-medium-rotting-oranges.md", { entry: "orangesRotting" }),
    ],
  },
  {
    num: 6,
    title: "Binary Search Algorithm",
    items: [
      item("sqrtx", "Square Root of X", E, "03_BINARY_SEARCH/003-easy-sqrtx.md", { entry: "mySqrt" }),
      item("guess-number-higher-or-lower", "Guess Higher or Lower", E, "03_BINARY_SEARCH/004-easy-guess-number-higher-or-lower.md", { entry: "guessNumber", prepare: "guessGame" }),
      item("search-in-rotated-sorted-array", "Search in Rotated Sorted Array", M, "03_BINARY_SEARCH/005-medium-search-in-rotated-sorted-array.md", { entry: "search" }),
      item("first-bad-version", "First Bad Version", E, "03_BINARY_SEARCH/006-easy-first-bad-version.md", { entry: "firstBadVersion", prepare: "badVersion" }),
      item("find-peak-element", "Find Peak Element", M, "03_BINARY_SEARCH/007-medium-find-peak-element.md", {
        entry: "findPeakElement",
        compare: "anyOf",
        // Any peak is accepted, so each expected value lists every valid index.
        tests: [
          { args: [[1, 2, 3, 1]], expected: [2] },
          { args: [[1, 2, 1, 3, 5, 6, 4]], expected: [1, 5] },
          { args: [[1]], expected: [0] },
          { args: [[2, 1]], expected: [0] },
          { args: [[1, 2]], expected: [1] },
        ],
      }),
      item("find-minimum-in-rotated-sorted-array", "Find Minimum in Rotated Sorted Array", M, "03_BINARY_SEARCH/008-medium-find-minimum-in-rotated-sorted-array.md", { entry: "findMin" }),
      item("find-first-and-last-position-of-element-in-sorted-array", "Find First & Last Position in Sorted Array", M, "03_BINARY_SEARCH/009-medium-find-first-and-last-position.md", { entry: "searchRange" }),
      item("peak-index-in-a-mountain-array", "Find Peak in a Mountain Array", E, "03_BINARY_SEARCH/010-medium-peak-index-in-a-mountain-array.md", { entry: "peakIndexInMountainArray" }),
      item("single-element-in-a-sorted-array", "Single Element in a Sorted Array", M, "03_BINARY_SEARCH/011-medium-single-element-in-a-sorted-array.md", { entry: "singleNonDuplicate" }),
      item("find-k-closest-elements", "Find k Closest Elements", M, "03_BINARY_SEARCH/012-medium-find-k-closest-elements.md", { entry: "findClosestElements" }),
    ],
  },
  {
    num: 7,
    title: "Two Pointers & Sliding Window",
    items: [
      item("two-sum", "Two Sum", E, "05_ARRAYS/020a-easy-two-sum-hashmap.md", { entry: "twoSum", compare: "unordered" }),
      item("two-sum-ii-input-array-is-sorted", "Two Sum II", E, "09_TWO_POINTERS/001-medium-two-sum-ii.md", { entry: "twoSum" }),
      item("is-subsequence", "Is Subsequence", E, "09_TWO_POINTERS/005-easy-is-subsequence.md", { entry: "isSubsequence" }),
      item("find-the-index-of-the-first-occurrence-in-a-string", "Find Index of First Occurrence in String", E, "01_STRINGS/026-easy-find-index-first-occurrence.md", { entry: "strStr" }),
      item("intersection-of-two-linked-lists", "Intersection of Two Linked Lists", E, "06_LINKED_LIST/008-easy-intersection-of-two-linked-lists.md", intersection),
      item("container-with-most-water", "Container with Most Water", M, "09_TWO_POINTERS/002-medium-container-with-most-water.md", { entry: "maxArea" }),
      item("3sum", "Three Sum", M, "05_ARRAYS/023-medium-3sum.md", { entry: "threeSum", compare: "unorderedDeep" }),
      item("trapping-rain-water", "Trapping Rain Water", H, "05_ARRAYS/024-hard-trapping-rainwater.md", { entry: "trap" }),
      item("longest-substring-without-repeating-characters", "Longest Substring Without Repeating Characters", M, "01_STRINGS/022-medium-longest-substring-without-repeating-characters.md", { entry: "lengthOfLongestSubstring" }),
      item("longest-repeating-character-replacement", "Longest Repeating Character Replacement", M, "09_TWO_POINTERS/003-medium-longest-repeating-character-replacement.md", { entry: "characterReplacement" }),
      item("permutation-in-string", "Permutation in String", M, "09_TWO_POINTERS/004-medium-permutation-in-string.md", { entry: "checkInclusion" }),
      item("sliding-window-maximum", "Sliding Window Maximum", H, "08_STACKS_AND_QUEUES/020-hard-sliding-window-maximum.md", { entry: "maxSlidingWindow" }),
    ],
  },
  {
    num: 8,
    title: "Binary Tree",
    items: [
      item("binary-tree-preorder-traversal", "Preorder Traversal", E, "10_BINARY_TREE/001-easy-preorder-traversal.md", { entry: "preorderTraversal", ...tree }),
      item("binary-tree-inorder-traversal", "Inorder Traversal", E, "10_BINARY_TREE/002-easy-inorder-traversal.md", { entry: "inorderTraversal", ...tree }),
      item("binary-tree-postorder-traversal", "Postorder Traversal", E, "10_BINARY_TREE/003-easy-postorder-traversal.md", { entry: "postorderTraversal", ...tree }),
      item("binary-tree-level-order-traversal", "Level Order Traversal", M, "10_BINARY_TREE/004-medium-level-order-traversal.md", { entry: "levelOrder", ...tree }),
      item("maximum-depth-of-binary-tree", "Maximum Depth of Binary Tree", E, "10_BINARY_TREE/005-easy-maximum-depth-of-binary-tree.md", { entry: "maxDepth", ...tree }),
      item("path-sum", "Path Sum", E, "10_BINARY_TREE/006-easy-path-sum.md", { entry: "hasPathSum", args: ["tree", "value"] }),
      item("symmetric-tree", "Symmetric Tree", E, "10_BINARY_TREE/007-easy-symmetric-tree.md", { entry: "isSymmetric", ...tree }),
      item("invert-binary-tree", "Invert a Binary Tree", E, "10_BINARY_TREE/008-easy-invert-binary-tree.md", { entry: "invertTree", ...tree, returns: "tree" }),
      item("same-tree", "Same Tree", E, "10_BINARY_TREE/009-easy-same-tree.md", { entry: "isSameTree", args: ["tree", "tree"] }),
      item("balanced-binary-tree", "Balanced Binary Tree", E, "10_BINARY_TREE/010-easy-balanced-binary-tree.md", { entry: "isBalanced", ...tree }),
      item("diameter-of-binary-tree", "Diameter of a Binary Tree", E, "10_BINARY_TREE/011-easy-diameter-of-binary-tree.md", { entry: "diameterOfBinaryTree", ...tree }),
      item("binary-tree-zigzag-level-order-traversal", "Zigzag Level Order Traversal", M, "10_BINARY_TREE/012-medium-zigzag-level-order-traversal.md", { entry: "zigzagLevelOrder", ...tree }),
      item("subtree-of-another-tree", "Subtree of another Tree", E, "10_BINARY_TREE/013-easy-subtree-of-another-tree.md", { entry: "isSubtree", args: ["tree", "tree"] }),
      item("lowest-common-ancestor-of-a-binary-tree", "Lowest Common Ancestor", M, "10_BINARY_TREE/014-medium-lowest-common-ancestor.md", { entry: "lowestCommonAncestor", prepare: "treeNodes", returns: "nodeVal" }),
      item("binary-tree-right-side-view", "Binary Tree Right Side View", M, "10_BINARY_TREE/015-medium-binary-tree-right-side-view.md", { entry: "rightSideView", ...tree }),
      item("count-good-nodes-in-binary-tree", "Count Good Nodes in Binary Tree", M, "10_BINARY_TREE/016-medium-count-good-nodes-in-binary-tree.md", { entry: "goodNodes", ...tree }),
      item("populating-next-right-pointers-in-each-node", "Populating Next Right Pointers in Each Node", M, "10_BINARY_TREE/017-medium-populating-next-right-pointers.md", { entry: "connect", ...tree, returns: "nextPointers" }),
      item("binary-tree-maximum-path-sum", "Binary Tree Maximum Path Sum", H, "10_BINARY_TREE/018-hard-binary-tree-maximum-path-sum.md", { entry: "maxPathSum", ...tree }),
    ],
  },
  {
    num: 9,
    title: "Binary Search Tree",
    items: [
      item("validate-binary-search-tree", "Valid Binary Search Tree", M, "11_BINARY_SEARCH_TREE/001-medium-validate-binary-search-tree.md", { entry: "isValidBST", ...tree }),
      item("search-in-a-binary-search-tree", "Search in a BST", E, "11_BINARY_SEARCH_TREE/002-easy-search-in-a-binary-search-tree.md", { entry: "searchBST", args: ["tree", "value"], returns: "tree" }),
      item("insert-into-a-binary-search-tree", "Insert into a BST", M, "11_BINARY_SEARCH_TREE/003-medium-insert-into-a-binary-search-tree.md", { entry: "insertIntoBST", args: ["tree", "value"], returns: "tree" }),
      item("kth-smallest-element-in-a-bst", "Kth Smallest Element", M, "11_BINARY_SEARCH_TREE/004-medium-kth-smallest-element-in-a-bst.md", { entry: "kthSmallest", args: ["tree", "value"] }),
      item("lowest-common-ancestor-of-a-binary-search-tree", "Lowest Common Ancestor of a BST", M, "11_BINARY_SEARCH_TREE/005-medium-lowest-common-ancestor-of-a-binary-search-tree.md", { entry: "lowestCommonAncestor", prepare: "treeNodes", returns: "nodeVal" }),
    ],
  },
  {
    num: 10,
    title: "Heap",
    items: [
      item("kth-largest-element-in-an-array", "Kth Largest Element in an Array", M, "12_HEAP/003-medium-kth-largest-element-in-an-array.md", { entry: "findKthLargest" }),
      item("kth-largest-element-in-a-stream", "Kth Largest Element in a Stream", M, "12_HEAP/001-easy-kth-largest-element-in-a-stream.md", { kind: "class", entry: "KthLargest" }),
      item("last-stone-weight", "Last Stone Weight", E, "12_HEAP/002-easy-last-stone-weight.md", { entry: "lastStoneWeight" }),
      item("top-k-frequent-elements", "Top K Frequent Elements", M, "12_HEAP/004-medium-top-k-frequent-elements.md", { entry: "topKFrequent", compare: "unordered" }),
      item("kth-smallest-element-in-a-sorted-matrix", "Kth Smallest Element in a Sorted Matrix", M, "12_HEAP/005-medium-kth-smallest-element-in-a-sorted-matrix.md", { entry: "kthSmallest" }),
    ],
  },
  {
    num: 11,
    title: "Backtracking",
    items: [
      item("subsets", "Subsets - The Power Set", M, "07_RECURSION/009-medium-subsets.md", { entry: "subsets", compare: "unorderedDeep" }),
      item("combinations", "Combinations", M, "07_RECURSION/010-medium-combinations.md", { entry: "combine", compare: "unorderedDeep" }),
      item("permutations", "Permutations", M, "07_RECURSION/011-medium-permutations.md", { entry: "permute", compare: "unordered" }),
      item("subsets-ii", "Subset - II", M, "07_RECURSION/001-medium-subsets-ii.md", { entry: "subsetsWithDup", compare: "unorderedDeep" }),
      item("combination-sum", "Combination Sum", M, "07_RECURSION/005-medium-combination-sum.md", { entry: "combinationSum", compare: "unorderedDeep" }),
      item("combination-sum-ii", "Combination Sum - II", M, "07_RECURSION/006-medium-combination-sum-ii.md", { entry: "combinationSum2", compare: "unorderedDeep" }),
      item("combination-sum-iii", "Combination Sum - III", M, "07_RECURSION/012-medium-combination-sum-iii.md", { entry: "combinationSum3", compare: "unorderedDeep" }),
      item("letter-combinations-of-a-phone-number", "Letter Combinations of a Phone Number", M, "07_RECURSION/013-medium-letter-combinations-of-a-phone-number.md", { entry: "letterCombinations", compare: "unordered" }),
      item("permutations-ii", "Permutations - II", M, "07_RECURSION/014-medium-permutations-ii.md", { entry: "permuteUnique", compare: "unordered" }),
      item("palindrome-partitioning", "Palindrome Partitioning", M, "07_RECURSION/007-medium-palindrome-partitioning.md", { entry: "partition", compare: "unordered" }),
      item("word-search", "Word Search", M, "07_RECURSION/015-medium-word-search.md", { entry: "exist" }),
      item("n-queens", "N Queens", H, "07_RECURSION/016-hard-n-queens.md", { entry: "solveNQueens", compare: "unordered" }),
    ],
  },
  {
    num: 12,
    title: "Greedy Algorithm",
    items: [
      item("two-city-scheduling", "Two City Scheduling", M, "13_GREEDY/001-medium-two-city-scheduling.md", { entry: "twoCitySchedCost" }),
      item("assign-cookies", "Assign Cookies", E, "13_GREEDY/002-easy-assign-cookies.md", { entry: "findContentChildren" }),
      item("lemonade-change", "Lemonade Change", E, "13_GREEDY/003-easy-lemonade-change.md", { entry: "lemonadeChange" }),
      item("best-time-to-buy-and-sell-stock-ii", "Best Time to Buy and Sell Stock - II", M, "13_GREEDY/004-medium-best-time-to-buy-and-sell-stock-ii.md", { entry: "maxProfit" }),
      item("insert-interval", "Insert Interval", M, "13_GREEDY/005-medium-insert-interval.md", { entry: "insert" }),
      item("merge-intervals", "Merge Intervals", M, "05_ARRAYS/013-medium-merge-intervals.md", { entry: "merge" }),
      item("partition-labels", "Partition Labels", M, "13_GREEDY/006-medium-partition-labels.md", { entry: "partitionLabels" }),
      item("non-overlapping-intervals", "Non Overlapping Intervals", M, "13_GREEDY/007-medium-non-overlapping-intervals.md", { entry: "eraseOverlapIntervals" }),
      item("task-scheduler", "Task Scheduler", M, "13_GREEDY/008-medium-task-scheduler.md", { entry: "leastInterval" }),
      item("gas-station", "Gas Station", M, "13_GREEDY/009-medium-gas-station.md", { entry: "canCompleteCircuit" }),
      item("car-pooling", "Car Pooling", M, "13_GREEDY/010-medium-car-pooling.md", { entry: "carPooling" }),
      item("candy", "Candy", H, "13_GREEDY/011-hard-candy.md", { entry: "candy" }),
    ],
  },
  {
    num: 13,
    title: "Dynamic Programming",
    items: [
      item("climbing-stairs", "Climbing Stairs", E, "14_DYNAMIC_PROGRAMMING/001-easy-climbing-stairs.md", { entry: "climbStairs" }),
      item("min-cost-climbing-stairs", "Minimum Cost Climbing Stairs", E, "14_DYNAMIC_PROGRAMMING/002-easy-min-cost-climbing-stairs.md", { entry: "minCostClimbingStairs" }),
      item("house-robber", "House Robber", M, "14_DYNAMIC_PROGRAMMING/003-medium-house-robber.md", { entry: "rob" }),
      item("house-robber-ii", "House Robber II", M, "14_DYNAMIC_PROGRAMMING/004-medium-house-robber-ii.md", { entry: "rob" }),
      item("coin-change", "Coin Change", M, "14_DYNAMIC_PROGRAMMING/005-medium-coin-change.md", { entry: "coinChange" }),
      item("palindromic-substrings", "Palindromic Substrings", M, "14_DYNAMIC_PROGRAMMING/006-medium-palindromic-substrings.md", { entry: "countSubstrings" }),
      item("longest-palindromic-substring", "Longest Palindromic Substring", M, "01_STRINGS/023-medium-longest-palindromic-substring.md", {
        entry: "longestPalindrome",
        compare: "anyOf",
        tests: [
          { args: ["babad"], expected: ["bab", "aba"] },
          { args: ["cbbd"], expected: ["bb"] },
          { args: ["a"], expected: ["a"] },
        ],
      }),
      item("decode-ways", "Decode Ways", M, "14_DYNAMIC_PROGRAMMING/007-medium-decode-ways.md", { entry: "numDecodings" }),
      item("maximum-subarray", "Maximum Subarray", E, "05_ARRAYS/010-medium-kadanes-algorithm.md", { entry: "maxSubArray" }),
      item("maximum-product-subarray", "Maximum Product Subarray", M, "14_DYNAMIC_PROGRAMMING/008-medium-maximum-product-subarray.md", { entry: "maxProduct" }),
      item("word-break", "Word Break", M, "14_DYNAMIC_PROGRAMMING/009-medium-word-break.md", { entry: "wordBreak" }),
      item("longest-increasing-subsequence", "Longest Increasing Subsequence", M, "14_DYNAMIC_PROGRAMMING/010-medium-longest-increasing-subsequence.md", { entry: "lengthOfLIS" }),
      item("partition-equal-subset-sum", "Partition Equal Subset Sum", M, "14_DYNAMIC_PROGRAMMING/011-medium-partition-equal-subset-sum.md", { entry: "canPartition" }),
      item("coin-change-2", "Coin Change II", M, "14_DYNAMIC_PROGRAMMING/012-medium-coin-change-ii.md", { entry: "change" }),
      item("unique-paths", "Unique Paths", M, "14_DYNAMIC_PROGRAMMING/013-medium-unique-paths.md", { entry: "uniquePaths" }),
      item("jump-game", "Jump Game", M, "14_DYNAMIC_PROGRAMMING/014-medium-jump-game.md", { entry: "canJump" }),
      item("jump-game-ii", "Jump Game II", M, "14_DYNAMIC_PROGRAMMING/015-medium-jump-game-ii.md", { entry: "jump" }),
      item("minimum-cost-to-cut-a-stick", "Minimum Cost to Cut a Stick", H, "14_DYNAMIC_PROGRAMMING/016-hard-minimum-cost-to-cut-a-stick.md", { entry: "minCost" }),
      item("super-egg-drop", "Super Egg Drop", H, "14_DYNAMIC_PROGRAMMING/017-hard-super-egg-drop.md", { entry: "superEggDrop" }),
    ],
  },
  {
    num: 14,
    title: "Graphs",
    items: [
      item("clone-graph", "Clone Graph", M, "15_GRAPHS/001-medium-clone-graph.md", { entry: "cloneGraph", args: ["graph"], returns: "graph" }),
      item("find-if-path-exists-in-graph", "Find if Path Exists in Graph", E, "15_GRAPHS/002-easy-find-if-path-exists-in-graph.md", { entry: "validPath" }),
      item("all-paths-from-source-to-target", "All Paths From Source to Target", M, "15_GRAPHS/003-medium-all-paths-from-source-to-target.md", { entry: "allPathsSourceTarget", compare: "unordered" }),
      item("reconstruct-itinerary", "Reconstruct Itinerary", H, "15_GRAPHS/004-hard-reconstruct-itinerary.md", { entry: "findItinerary" }),
      item("detect-cycle-in-an-undirected-connected-graph-dfs", "Detect Cycle in Undirected Connected Graph", M, "15_GRAPHS/005-medium-detect-cycle-in-undirected-graph.md", { entry: "hasCycle" }, nd("detect-cycle-in-an-undirected-connected-graph-dfs")),
      item("topological-sort-dfs", "Topological Sort (DFS)", M, "15_GRAPHS/006-medium-topological-sort-dfs.md", { entry: "topologicalSort", compare: "topoOrder" }, nd("topological-sort-dfs")),
      item("number-of-operations-to-make-network-connected", "Number of Operations to Make Network Connected", M, "15_GRAPHS/007-medium-number-of-operations-to-make-network-connected.md", { entry: "makeConnected" }),
      item("cheapest-flights-within-k-stops", "Cheapest Flights Within K Stops", M, "15_GRAPHS/008-medium-cheapest-flights-within-k-stops.md", { entry: "findCheapestPrice" }),
      item("number-of-ways-to-arrive-at-destination", "Number of Ways to Arrive at Destination", M, "15_GRAPHS/009-medium-number-of-ways-to-arrive-at-destination.md", { entry: "countPaths" }),
      item("min-cost-to-connect-all-points", "Min Cost to Connect All Points", M, "15_GRAPHS/010-medium-min-cost-to-connect-all-points.md", { entry: "minCostConnectPoints" }),
    ],
  },
];

/** The sheet repeats one problem (Intersection of Two Linked Lists) in two sections. */
export const sheetItems: (SheetItem & { section: number; key: string })[] = sheet.flatMap((s) =>
  s.items.map((it, i) => ({ ...it, section: s.num, key: `${s.num}-${i + 1}` })),
);
