
```markdown
# Round 3: Problem Solving / DSA

**Question 1:** _“You have a large array of course IDs representing course completions (e.g. `[5,2,5,3,2,5, …]`). Describe how to find the top 10 most frequent courses. Provide code (in JavaScript/TypeScript or pseudocode) and discuss time/space complexity.”_  

**Candidate’s Response (example):**  
“To find the top 10 courses, I’d first count frequencies using a hash map (object or `Map`). That’s O(n) time and space for n records. Then I need to select the 10 highest counts. 

One approach (O(n log n)): transform the map into an array of `[course, freq]` and sort descending by `freq`, then take first 10. But with a large n, a better way is a min-heap (priority queue) of size 10. 

Pseudocode using a min-heap:
```js
const freqMap = new Map();
for (const id of courses) {
  freqMap.set(id, (freqMap.get(id) || 0) + 1);
}
// Use a min-heap keyed by frequency:
const heap = new MinHeap((a,b) => a.freq - b.freq);
for (const [course, freq] of freqMap) {
  heap.push({course, freq});
  if (heap.size() > 10) {
    heap.pop(); // remove smallest freq
  }
}
// Now heap contains the top 10 courses (not sorted). Extract:
const top10 = [];
while (!heap.empty()) {
  top10.push(heap.pop().course);
}

// This is overall O(n + m log 10), where m = number of unique courses (m ≤ n). Since log10 is constant, it’s essentially O(n). The heap operations (insert/pop) are O(log k) with k=10, so practically constant.

// If the data is extremely large (e.g. doesn’t fit in memory), we could stream it: count frequencies in chunks or use an external sort (like “TopK by streaming”) but conceptually the same: maintain a running top-10.

// Complexity: Counting is O(n). Heap operations are O(m log 10) ≈ O(m). So time ≈ O(n + m). Space is O(m) for the map, plus O(10) for heap.

// I could also mention a bucket-sort approach: if frequencies aren’t too large, we could bucket by frequency to get true O(n) without logs, but the heap is simpler and works well for k=10. [37†L136-L142][37†L188-L195]”

// Interviewer Feedback:
// Good solution. You correctly used a hashmap plus a min-heap to efficiently get the top frequencies, and you explained the complexity clearly. The reference to a “bucket sort” (from [37]) was insightful, though not necessary. One thing to probe: edge cases and scaling. For example, what if courses array is huge (160M)? Your memory usage (O(m)) might still be large. We might discuss sampling or approximate counts (like a Count-Min Sketch) if needed. Also, ensure to handle ties and ordering if asked. But overall, your DSA approach and code logic are correct and well-justified for an interview.

// Next Question: “What if you only have a stream of data (you can’t store all counts in a map)? How would you approximate the top courses with fixed memory?” (Follow-up probing large-scale data)