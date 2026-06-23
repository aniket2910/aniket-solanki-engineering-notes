# 019. Clone a Linked List with Random and Next Pointer (Hard)

> [!IMPORTANT]
> **Company Targets**: 🏢 Amazon, Microsoft, Facebook/Meta
>
> **Interview Tag**: 🔥 **IN-PLACE INTERWEAVING** - Hard classic list problem. Tests ability to copy lists with non-linear secondary random pointers in constant space.

---

### 📝 1. Problem Statement
A linked list of length `n` is given such that each node contains an additional random pointer, which could point to any node in the list, or `null`.

Construct a **deep copy** of the list. The deep copy should consist of exactly `n` brand new nodes, where each new node has its value set to the value of its corresponding original node. Both the `next` and `random` pointer of the new nodes should point to new nodes in the copied list.

Return *the head of the copied linked list*.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**: `head = [[7,null],[13,0],[11,4],[10,2],[1,0]]` (node value and index pointed to by random)
* **Output**: Deep copied list with identical values and connections.

---

### 💬 3. What is This Problem Actually Asking?
We need to photocopy a linked list where nodes also have arbitrary "random" pointers. The challenge is copying the random references accurately to the new nodes without mapping them to the original node addresses.

---

### 🌍 4. Real-Life Example
Imagine copying a complex network layout of pages where some pages contain footnotes pointing to other arbitrary pages. If you photocopy the pages one-by-one, the footnotes on the copied pages still point to page numbers of the *original* book. You need a way to redirect copied footnotes to copied pages in the same sequence.

---

### 🛠️ 5. Data Structure & Algorithms Used

We contrast hash map caching with in-place pointer weaves:

#### Approach 1: Hash Map Node Mapping
We traverse the list and record a map of `{ originalNode: clonedNode }`. In the second pass, we assign:
* `clonedNode.next = map.get(originalNode.next)`
* `clonedNode.random = map.get(originalNode.random)`
* **Pros**: Simple, highly intuitive.
* **Cons**: Requires $O(N)$ auxiliary memory space for mapping.

#### Approach 2: In-Place Node Interweaving (Optimal)
We can solve this in **three elegant steps** using zero extra memory:
1.  **Interweave Cloned Nodes**: Create copy nodes and insert them directly next to their originals: `original -> cloned -> original.next -> cloned.next`.
2.  **Map Random Pointers**: Link cloned randoms: `curr.next.random = curr.random ? curr.random.next : null`.
3.  **De-weave Lists**: Separate the interleaved lists to restore the original and extract the cloned list.
* **Pros**: Optimal $O(N)$ runtime, $O(1)$ constant auxiliary space.
* **Cons**: None.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

We dry run Approach 2 with list `[1] -> [2]` where `1.random = 2` and `2.random = null`.

#### **Step 1: Interweave Cloned Nodes**
```text
Original: [ 1 ] --------------> [ 2 ] -> null
Action:   Create clones [1'] and [2'] and insert them next to originals
Weaved:   [ 1 ] -> [ 1' ] -> [ 2 ] -> [ 2' ] -> null
```

#### **Step 2: Map Random Pointers**
* **For curr = 1**: `curr.next (1')` random pointer is set to `curr.random.next (2')`.
* **Weaved**: `1'.random = 2'`.

#### **Step 3: De-weave Lists**
* **Split pointers**:
  * Original: `[1] -> [2] -> null`
  * Clone: `[1'] -> [2'] -> null`
* **Result**: Returns Clone `[1']` (Correct).

---

### 💻 6. Optimal Code (TypeScript)

Here is the clean, human-written codebase showing both approaches. Approach 1 is shown in comments to demonstrate your progression of thought!

```typescript
class RandomListNode {
    val: number;
    next: RandomListNode | null;
    random: RandomListNode | null;
    constructor(val?: number, next?: RandomListNode | null, random?: RandomListNode | null) {
        this.val = (val===undefined ? 0 : val);
        this.next = (next===undefined ? null : next);
        this.random = (random===undefined ? null : random);
    }
}

function copyRandomList(head: RandomListNode | null): RandomListNode | null {
    // ==========================================
    // 1st Approach: Hash Map Node Mapping (O(N) Space)
    // ==========================================
    /*
    if (head === null) return null;
    const map = new Map<RandomListNode, RandomListNode>();
    let curr: RandomListNode | null = head;
    while (curr !== null) {
        map.set(curr, new RandomListNode(curr.val));
        curr = curr.next;
    }
    curr = head;
    while (curr !== null) {
        const clone = map.get(curr)!;
        clone.next = curr.next ? map.get(curr.next)! : null;
        clone.random = curr.random ? map.get(curr.random)! : null;
        curr = curr.next;
    }
    return map.get(head)!;
    */

    // ==========================================
    // 2nd Approach: In-Place Node Interweaving (Optimal)
    // ==========================================
    if (head === null) return null;

    let curr: RandomListNode | null = head;

    // Step 1: Create copy nodes and insert them next to originals
    while (curr !== null) {
        const nextTemp = curr.next;
        const copy = new RandomListNode(curr.val);
        curr.next = copy;
        copy.next = nextTemp;
        curr = nextTemp;
    }

    curr = head;
    // Step 2: Map random pointers for copied nodes
    while (curr !== null) {
        if (curr.random !== null) {
            curr.next!.random = curr.random.next;
        }
        curr = curr.next!.next;
    }

    curr = head;
    const cloneHead = head.next;
    let copyCurr = cloneHead;

    // Step 3: De-weave list to separate original and cloned lists
    while (curr !== null) {
        curr.next = curr.next!.next;
        if (copyCurr!.next !== null) {
            copyCurr!.next = copyCurr!.next.next;
        }
        curr = curr.next;
        copyCurr = copyCurr!.next;
    }

    return cloneHead;
}
```

---

### 📊 7. Complexity & Edge Cases

| Metric | Approach 1: Hash Map | Approach 2: In-Place Weave |
| :--- | :--- | :--- |
| **Time Complexity** | **$O(N)$** — Two linear scans. | **$O(N)$** — Three linear scans. |
| **Space Complexity** | **$O(N)$** — Aux map mapping memory. | **$O(1)$** — Constant variables, fully in-place. |

#### Edge Cases Handled:
* **Head is null**: Returns `null` immediately.
* **All randoms are null**: Checked correctly, cloned randoms remain `null` safely (Correct).
