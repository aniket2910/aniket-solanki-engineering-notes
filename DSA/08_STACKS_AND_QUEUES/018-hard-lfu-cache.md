# 018. LFU Cache (Hard)

> [!IMPORTANT]
> **Company Targets**: 🏢 Google, Amazon, Microsoft, Bloomberg
>
> **Interview Tag**: 🔥 **MUST SOLVE** - The ultimate system data structure design question. Demands precise map manipulation, custom doubly linked list management, and strict maintenance of frequency levels.

---

### 📝 1. Problem Statement
Design and implement a data structure for a **Least Frequently Used (LFU)** cache.

Implement the `LFUCache` class:
* `LFUCache(capacity)`: Initializes the cache with the given `capacity`.
* `get(key)`: Gets the value of the `key` if the `key` exists in the cache. Otherwise, returns `-1`.
* `put(key, value)`: Associates the `key` with `value` if it is not already present, or updates it. If the cache reaches its capacity, it must **evict the least frequently used key** before inserting a new item.
  * If there is a tie (multiple keys have the same lowest frequency), the **least recently used key** among them must be evicted.

The functions `get` and `put` must each run in **$O(1)$** average time complexity.

---

### 🧪 2. Test Cases

#### Test Case 1
* **Input**:
  ```typescript
  let lfu = new LFUCache(2);
  lfu.put(1, 1); // Cache is {1=1 (freq=1)}
  lfu.put(2, 2); // Cache is {1=1 (freq=1), 2=2 (freq=1)}
  lfu.get(1);    // Returns 1, Cache becomes {2=2 (freq=1), 1=1 (freq=2)}
  lfu.put(3, 3); // Evicts key 2 (has lower freq=1 than 1), Cache is {3=3 (freq=1), 1=1 (freq=2)}
  lfu.get(2);    // Returns -1 (evicted)
  lfu.get(3);    // Returns 3, Cache becomes {1=1 (freq=2), 3=3 (freq=2)}
  lfu.put(4, 4); // Evicts key 1 (both 1 and 3 have freq=2, but 1 was least recently accessed), Cache is {4=4 (freq=1), 3=3 (freq=2)}
  ```
* **Output**: Correct cache state and frequency-based eviction.

---

### 💬 3. What is This Problem Actually Asking?
We need a fixed-size storage cache.
1. Each key tracks how many times it was accessed (its **frequency**).
2. If we run out of space, we must evict the key with the **lowest frequency**.
3. If multiple keys share the lowest frequency, we evict the one that was **least recently accessed (LRU)** among them.
To do this in **$O(1)$** time, we need a way to group keys by frequency, and within each frequency group, maintain their access order.

---

### 🌍 4. Real-Life Example
Think of a **library display shelf**:
* The library has a small display table for 10 books.
* Books are grouped into shelves based on their popularity: **"Read 1 time"**, **"Read 2 times"**, **"Read 3 times"**, etc.
* Within each shelf, books are lined up in order of how recently they were returned.
* If a new book needs to go on the table and it's full, you look at the **lowest popularity shelf** and remove the **oldest book** sitting at the end of that shelf.

---

### 🛠️ 5. Data Structure & Algorithms Used

We use two primary mapping systems:
1. `keyMap`: A Hash Map mapping `key -> Node`. This gives $O(1)$ access to any cached element.
2. `freqMap`: A Hash Map mapping `frequency -> DoublyLinkedList`. This maps each frequency level to a list of nodes having that frequency.
3. `minFreq`: A global integer tracking the current lowest frequency level in the cache.

#### Custom Doubly Linked List Node (`LFUNode`):
* Tracks: `key`, `value`, `freq` (frequency), and pointers `prev`, `next`.

#### How it works:
* **`updateFrequency(node)`**:
  * Get the list for the node's current `freq` from `freqMap`.
  * Remove `node` from that list.
  * If that list is now empty and `node.freq === minFreq`, increment `minFreq` (since there are no more nodes at the old minimum frequency).
  * Increment `node.freq` by 1.
  * Fetch/create the list for the new `freq` in `freqMap`, and insert `node` at the front of it.
* **`get(key)`**:
  * Look up node in `keyMap`. If not found, return `-1`.
  * Call `updateFrequency(node)`.
  * Return `node.value`.
* **`put(key, value)`**:
  * If key exists:
    * Update node value.
    * Call `updateFrequency(node)`.
  * If key does not exist:
    * If at capacity:
      * Get the list at `minFreq` from `freqMap`.
      * Evict the least recently used node from the end of that list (`tail.prev`).
      * Delete it from `keyMap` and the list.
    * Create a new node with `freq = 1`.
    * Set `minFreq = 1`.
    * Insert the new node into `keyMap` and the list for frequency `1` in `freqMap`.

---

### 💻 6. Optimal Code (TypeScript)

```typescript
class LFUNode {
    key: number;
    val: number;
    freq: number;
    prev: LFUNode | null;
    next: LFUNode | null;

    constructor(key: number, val: number) {
        this.key = key;
        this.val = val;
        this.freq = 1; // All new nodes start with frequency 1
        this.prev = null;
        this.next = null;
    }
}

class DoublyLinkedList {
    head: LFUNode;
    tail: LFUNode;
    size: number;

    constructor() {
        this.size = 0;
        this.head = new LFUNode(0, 0);
        this.tail = new LFUNode(0, 0);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    addFront(node: LFUNode): void {
        const temp = this.head.next!;
        node.next = temp;
        node.prev = this.head;
        this.head.next = node;
        temp.prev = node;
        this.size++;
    }

    removeNode(node: LFUNode): void {
        const prevNode = node.prev!;
        const nextNode = node.next!;
        prevNode.next = nextNode;
        nextNode.prev = prevNode;
        this.size--;
    }
}

class LFUCache {
    private maxCapacity: number;
    private keyMap: Map<number, LFUNode>;
    private freqMap: Map<number, DoublyLinkedList>;
    private minFreq: number;

    constructor(capacity: number) {
        this.maxCapacity = capacity;
        this.keyMap = new Map();
        this.freqMap = new Map();
        this.minFreq = 0;
    }

    get(key: number): number {
        const node = this.keyMap.get(key);
        if (!node) {
            return -1;
        }
        this.updateFrequency(node);
        return node.val;
    }

    put(key: number, value: number): void {
        if (this.maxCapacity === 0) {
            return;
        }

        const existingNode = this.keyMap.get(key);
        if (existingNode) {
            // Update value and increment frequency
            existingNode.val = value;
            this.updateFrequency(existingNode);
        } else {
            // If cache is full, evict Least Frequently Used (and LRU if tie)
            if (this.keyMap.size === this.maxCapacity) {
                const minFreqList = this.freqMap.get(this.minFreq)!;
                const lruNode = minFreqList.tail.prev!;
                this.keyMap.delete(lruNode.key);
                minFreqList.removeNode(lruNode);
            }

            // Create and insert new node
            const newNode = new LFUNode(key, value);
            this.keyMap.set(key, newNode);
            
            // New items always reset minFreq to 1
            this.minFreq = 1;
            let list = this.freqMap.get(1);
            if (!list) {
                list = new DoublyLinkedList();
                this.freqMap.set(1, list);
            }
            list.addFront(newNode);
        }
    }

    /**
     * Shifts a node to its new frequency level's doubly linked list.
     */
    private updateFrequency(node: LFUNode): void {
        const oldFreq = node.freq;
        const oldList = this.freqMap.get(oldFreq)!;
        
        // Remove from old frequency list
        oldList.removeNode(node);

        // If the old list is empty and was the minFreq, update minFreq
        if (this.minFreq === oldFreq && oldList.size === 0) {
            this.minFreq++;
        }

        // Increment frequency
        node.freq++;

        // Add to the front of the new frequency list
        let newList = this.freqMap.get(node.freq);
        if (!newList) {
            newList = new DoublyLinkedList();
            this.freqMap.set(node.freq, newList);
        }
        newList.addFront(node);
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
* **Capacity of 0**: Instantly returns/blocks inputs. Handled by `if (this.maxCapacity === 0) return;` at start of `put()`.
* **Frequency List Collapsing**: Correctly increments `minFreq` when the list at the old `minFreq` becomes empty due to a key frequency update.
* **Tie Breaking**: In case of multiple keys having the lowest frequency, it selects `minFreqList.tail.prev` (which is the oldest element in that list), correctly implementing the LRU tie-breaker.
