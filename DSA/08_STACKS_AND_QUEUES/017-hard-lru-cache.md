# 017. LRU Cache (Hard)

> [!IMPORTANT]
> **Interview Tag**: 🔥 **MUST SOLVE** - The absolute king of caching design questions. Frequently asked by tier-1 tech firms to test real-world systems memory design, object orientation, and low-level pointer management.

---

### 📝 1. Problem Statement
Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the `LRUCache` class:
* `LRUCache(capacity)`: Initialize the LRU cache with positive size `capacity`.
* `get(key)`: Return the value of the `key` if the key exists, otherwise return `-1`.
* `put(key, value)`: Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, **evict the least recently used key**.

The functions `get` and `put` must each run in **$O(1)$** average time complexity.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**:
  ```typescript
  let lru = new LRUCache(2);
  lru.put(1, 1); // Cache is {1=1}
  lru.put(2, 2); // Cache is {1=1, 2=2}
  lru.get(1);    // Returns 1, Cache is {2=2, 1=1} (1 is now most recently used)
  lru.put(3, 3); // Evicts key 2, Cache is {1=1, 3=3}
  lru.get(2);    // Returns -1 (evicted)
  lru.put(4, 4); // Evicts key 1, Cache is {3=3, 4=4}
  lru.get(1);    // Returns -1 (evicted)
  lru.get(3);    // Returns 3
  lru.get(4);    // Returns 4
  ```
* **Output**: Correct cache state and eviction behavior.

---

### 💬 3. What is This Problem Actually Asking?
We need a storage container of a fixed size.
1. When we retrieve or update an element, it becomes "recently used".
2. When we insert an element when the container is full, we must discard the item that has gone the longest without being accessed.
To achieve **$O(1)$** search, we need a **Hash Map**.
To achieve **$O(1)$** order updates (evicting from one end, inserting at the other, or moving elements around), we need a **Doubly Linked List**.
By combining both, we get the best of both worlds!

---

### 🌍 4. Real-Life Example
Think of **tabs in your web browser**:
* You have a screen that can only display 5 tabs at once due to memory limits.
* As you click on different tabs, they move to the active position.
* If you open a 6th tab, the browser automatically closes the tab that you haven't clicked on or looked at for the longest time.

---

### 🛠️ 5. Data Structure & Algorithms Used

We implement a custom **Doubly Linked List** combined with a standard JavaScript **Map**:
* **Doubly Linked List Node (`DLLNode`)**:
  * Fields: `key`, `val`, `prev` (pointer to previous node), `next` (pointer to next node).
* **LRU Cache Properties**:
  * `capacity`: Maximum allowed size.
  * `map`: Hash map storing `key -> DLLNode` for $O(1)$ node lookup.
  * `head` and `tail`: Sentinel dummy nodes bounding the list. `head.next` points to the most recently used (MRU) node, and `tail.prev` points to the least recently used (LRU) node.

#### Core Operations:
* `addNodeToFront(node)`: Insert a node right after the dummy `head`.
* `removeNode(node)`: Unlink a node from its current position in the list.
* `moveToHead(node)`: Combine `removeNode` and `addNodeToFront`.
* `get(key)`:
  * Look up node in map. If not found, return `-1`.
  * Move the node to head (`moveToHead`).
  * Return `node.val`.
* `put(key, value)`:
  * If key exists:
    * Update node value.
    * Move node to head.
  * If key does not exist:
    * If current size is at capacity:
      * Evict the node just before dummy `tail` (`tail.prev`).
      * Delete its key from map.
      * Unlink it from list.
    * Create a new node.
    * Add to front of list and register in map.

---

### 🔄 Step-by-Step Dry Run (Visualizer)

Let's dry run capacity = 2, with operations: `put(1, 10)`, `put(2, 20)`, `get(1)`.

#### **Step 0: Initial State**
* `head` <-> `tail`
* `map` = `{}`

#### **Step 1: put(1, 10)**
* Create node `N1(1, 10)`. Add to front.
* `head` <-> `N1` <-> `tail`
* `map` = `{ 1: N1 }`

#### **Step 2: put(2, 20)**
* Create node `N2(2, 20)`. Add to front.
* `head` <-> `N2` <-> `N1` <-> `tail`
* `map` = `{ 1: N1, 2: N2 }`
* (N2 is MRU, N1 is LRU)

#### **Step 3: get(1)**
* Query map: N1 exists.
* Move N1 to front:
  * Unlink N1: `head` <-> `N2` <-> `tail`.
  * Link N1 to head: `head` <-> `N1` <-> `N2` <-> `tail`.
* Return `10`.
* (N1 is now MRU, N2 is now LRU).

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class DLLNode {
    key: number;
    val: number;
    prev: DLLNode | null;
    next: DLLNode | null;

    constructor(key: number, val: number) {
        this.key = key;
        this.val = val;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    private capacity: number;
    private map: Map<number, DLLNode>;
    private head: DLLNode;
    private tail: DLLNode;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.map = new Map();
        
        // Initialize sentinel dummy head and tail nodes
        this.head = new DLLNode(0, 0);
        this.tail = new DLLNode(0, 0);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    get(key: number): number {
        const node = this.map.get(key);
        if (!node) {
            return -1;
        }
        
        // Move the accessed node to the front (most recently used)
        this.moveToHead(node);
        return node.val;
    }

    put(key: number, value: number): void {
        const existingNode = this.map.get(key);

        if (existingNode) {
            // Update value and move to front
            existingNode.val = value;
            this.moveToHead(existingNode);
        } else {
            // If at capacity, evict the least recently used node (before dummy tail)
            if (this.map.size === this.capacity) {
                const lruNode = this.tail.prev!;
                this.removeNode(lruNode);
                this.map.delete(lruNode.key);
            }

            // Create new node and add to front
            const newNode = new DLLNode(key, value);
            this.addNodeToFront(newNode);
            this.map.set(key, newNode);
        }
    }

    /**
     * Unlinks a node from its current position in the doubly linked list.
     */
    private removeNode(node: DLLNode): void {
        const prevNode = node.prev!;
        const nextNode = node.next!;
        prevNode.next = nextNode;
        nextNode.prev = prevNode;
    }

    /**
     * Inserts a node right after the sentinel dummy head.
     */
    private addNodeToFront(node: DLLNode): void {
        const nextNode = this.head.next!;
        this.head.next = node;
        node.prev = this.head;
        node.next = nextNode;
        nextNode.prev = node;
    }

    /**
     * Helper to refresh a node's position to the head (MRU).
     */
    private moveToHead(node: DLLNode): void {
        this.removeNode(node);
        this.addNodeToFront(node);
    }
}
```

---

### 📊 7. Complexity & Edge Cases

| Operation | Time Complexity | Space Complexity |
| :--- | :---: | :---: |
| `get()` | **$O(1)$** | **$O(1)$** |
| `put()` | **$O(1)$** | **$O(1)$** |

#### Edge Cases Handled:
* **Capacity of 1**: Evicts elements immediately on every `put` of a new key. The Sentinel nodes handle list collapsing without throwing null pointers.
* **Updating Existing Key**: Correctly updates value and moves node to front without incrementing the size of the cache.
* **Eviction verification**: DLL dummy pointers prevent off-by-one errors when modifying list bounds.
