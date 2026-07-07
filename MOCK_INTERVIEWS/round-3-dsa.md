# Round 3 — Problem Solving / DSA

**Date:** 2026-07-03
**Interviewer persona:** Senior Engineer (45-min algorithms round)
**Problem:** Top K Frequent Elements — `nums.length ≤ 10^6`, negatives allowed, k always valid, any order.
**Round structure:** Phase 1 = all approaches with complexities (no code) → Phase 2 = pick one and justify → Phase 3 = code it.

---

## Phase 0 — Clarifying Question

Asked: *"Is the array sorted?"* — ✅ right instinct (input properties before approaches). Answer: no.
Interviewer's counter-question: *"If it WERE sorted, what would you gain?"* — **skipped in my answer. Never leave an interviewer's question on the floor.** (Model answer below.)

## Phase 1 — My Approaches (as given)

1. "Brute force": object/hashmap of frequencies, then "loop through the object and return the top frequency elements" — claimed **O(n)**.
2. Bucket sort: frequency map → `bucket[freq] = [elements]` with array length n+1 → scan right-to-left, collect until k. *(Complexity not stated in discussion, but correct in code comments.)*

Then jumped straight to code (Phase 2 justification skipped).

## Code Review — [round-3-code/solution.ts](round-3-code/solution.ts)

### What Was Good

- **The code is correct.** Verified by live run: both given examples, negatives (`[-1,-1,-2]`), single element, `k = distinct count` — all pass.
- **Bucket sort is the right pick for n = 10⁶**, and the implementation is clean: `Map` (handles negatives properly), right-to-left scan, early return at exactly k, correct n+1 sizing with a comment explaining why.
- **Complexity comments in the code are accurate**: O(N) time, O(N) space.
- Early-exit mid-bucket (returns as soon as `result.length === k`) — small thing, done right.

### What Was Missing

**1. Phase 1 breadth: gave 2 approaches, the round asked for 4+.** The two missing ones — min-heap and quickselect — are the *most commonly expected* answers at product companies, and the heap is the bridge to every streaming/big-data follow-up. Missing them costs the "complexity trade-offs" signal the round is named after.

**2. The "brute force" complexity claim was wrong — and it's the exact trap I was warned about.** "Loop through the object and return the top frequency elements" is not a selection algorithm. Looping once finds *the* max, not the top k. Real options and their real costs, after the O(n) count:
- k repeated max-scans: **O(k·d)** where d = distinct count
- sort entries by frequency: **O(d log d)**

Claiming O(n) for an underspecified selection step = instant "why?" grilling.

**3. No space complexities stated in discussion.** Phase 1 explicitly asked for time *and* space.

**4. Skipped the interviewer's warm-up question** (sorted array) and **skipped Phase 2** (justify the pick against constraints). Jumping to code reads as pattern-matching, not reasoning — even when the pick is right.

**5. The memory probe (found by running the code):** `Array.from({ length: nums.length + 1 }, () => [])` eagerly allocates **a million empty arrays** even when there are only ~1,000 distinct values. Measured at n = 10⁶, 1,000 distinct:

```
eager (submitted): 74.5ms, ~38.5MB heap delta
lazy  (fix):       27.3ms, ~14.7MB heap delta
```

The one-character-class fix — allocate buckets on demand:
```ts
const buckets: number[][] = new Array(nums.length + 1);
for (const [num, freq] of freqMap.entries()) (buckets[freq] ??= []).push(num);
```
This allocates d arrays instead of n+1. For someone whose resume says "right-sized memory to eliminate OpsGenie memory alerts," this is the probe an interviewer will *definitely* run.

---

## What I Need to Improve

- [ ] **Memorize the approach ladder for top-k problems** (below) — all four, with time AND space, recitable in 90 seconds.
- [ ] **Never state a complexity for an underspecified step.** If the selection method isn't decided, the complexity isn't known. Say the step, then its cost.
- [ ] **Answer every question the interviewer asks** — a skipped question is scored as a miss, not as neutral.
- [ ] **Do Phase 2 out loud even when unasked**: "Given n = 10⁶ and no range limit on k, I'll take bucket sort: O(n) beats O(n log k), and O(n) space is acceptable here." Two sentences, big signal.
- [ ] **In JavaScript, eager allocation is a real cost** — `Array.from({length: 10^6}, () => [])` is 10⁶ object allocations. Default to lazy `??=` for sparse buckets.

---

## Model Answer

### The warm-up: "What would sortedness buy you?"

"Sortedness makes equal elements adjacent, so I could count by scanning runs — that removes the hash map, taking the counting phase to O(1) auxiliary space. But it does nothing for the *selection* half: I still need to pick the top k among d distinct counts, so I'd pair the run-scan with a min-heap of size k for O(n + d log k) time and O(k) space. So: sorted input improves the counting phase's space, not the selection phase's time."

### The approach ladder (Phase 1 as it should sound)

| # | Approach | Time | Space | When it wins |
|---|----------|------|-------|--------------|
| 1 | Count + sort entries by frequency | O(n + d log d) | O(d) | Simple; fine when d is small; also yields a full ranking |
| 2 | Count + k max-scans ("true" brute force) | O(n + k·d) | O(d) | Only when k is tiny (k=1,2); worth naming just to price it |
| 3 | Count + **min-heap of size k** | O(n + d log k) | O(d + k) | k ≪ d; **the only one that extends to streaming** |
| 4 | Count + **bucket sort** on frequency | **O(n)** | O(n + d) | This problem: one-shot, in-memory, n = 10⁶ — optimal time |
| 5 | Count + **quickselect** on entries | O(n + d) avg, O(d²) worst | O(d) | When you want O(d) space AND linear expected time; needs random pivot |

**Phase 2 justification, spoken:** "For a one-shot, in-memory query at n = 10⁶, bucket sort: guaranteed O(n) with no log factor and no quickselect worst-case. I'll allocate buckets lazily so space is O(d) in practice. If this were a *stream* or k were small relative to memory, I'd switch to the heap — that's the approach that survives when the data outgrows RAM."

That last sentence is the 40-LPA sentence: it shows you know which tool survives the scale-up *before* being asked.

### Reference implementations

The submitted bucket sort is correct — keep it, with the lazy-allocation fix. Heap version for the streaming follow-up: maintain `MinHeap<[count, element]>` of size k; for each new count, if heap not full push; else if count > heap.top's count, replace-top. O(log k) per update, O(k) space.

---

## Phase 4 — The Probes: "Honestly, I don't know"

**My answer to both probes (min-heap mechanics/trade-offs; pricing the brute force):** honestly admitted I don't know. Also disclosed that the resume line "right-sized memory and database capacity to eliminate OpsGenie alerts" was really about increasing Postgres size and pod memory, **where I was an observer**, not the owner.

### What Was Good

- **Honesty over bluffing — always.** A candidate caught inventing an answer is done; a candidate who says "I don't know" cleanly survives. Real credit.
- Curiosity framing ("if this comes again I want to know how it works") is genuine and worth keeping — but it belongs *after* a partial attempt, not instead of one.

### What Was Missing

**1. "I don't know" should never arrive naked.** The scoring difference between zero and partial credit is one sentence of reasoning toward the answer. The recovery pattern:
"I haven't worked with heaps enough to give you the mechanics confidently. But reasoning about it: keeping the top k means I need cheap access to the *weakest of my current winners* — that's who gets evicted when someone better arrives. So I'd want a structure with the minimum on top… which I believe is what the min-heap gives."
That sentence chain earns partial credit and shows *how you think when you don't know* — which is the actual thing senior interviewers are probing.

**2. The resume-integrity problem (the biggest finding of this whole session so far).**
The bullet says "right-sized memory and database capacity to eliminate the recurring OpsGenie memory alerts." The truth: platform/DBA increased Postgres and pod memory; I observed. **Every resume bullet must survive three consecutive "how exactly?" probes — interviewers are trained to find the one that doesn't.** One collapsed bullet contaminates trust in every other bullet, including the true ones. Two legal fixes:
- **Own the understanding retroactively:** go learn exactly what happened — what was OOMing (Node heap? pod cgroup limit? Postgres work_mem/connections?), what the numbers were before/after, why "add memory" was chosen over "find the leak," what the alternatives were. Then the bullet is defensible as "I diagnosed/participated and can explain every layer."
- **Reword to what I owned:** e.g., *"Tuned consumer throughput 100 → 10,000 records/min; partnered with the platform team on the memory and DB capacity fixes that eliminated recurring OpsGenie alerts."* "Partnered" is honest and still strong.
Never let "right-sized" stand if someone else did the sizing. Interviewers don't reject SDE-1s for having been observers; they reject them for claiming otherwise.

### The Answers I Didn't Have (learn these cold)

**Probe 1 — Min-heap of size k, in plain language:**
A min-heap is a complete binary tree where every parent ≤ its children, so the smallest element is always on top; insert and remove-top both cost O(log size). For top-k: keep a heap of **size k** holding the current k winners, keyed by count. The root is the *weakest winner* — the gatekeeper. For each candidate: heap not full → push; candidate beats the root → pop root, push candidate; otherwise discard. After one pass, the heap IS the top k. Cost: O(n) counting + O(d log k) selection, O(k) heap space. It's a **min**-heap (not max) because the only element you ever need instantly is the weakest current winner.

**When heap beats bucket sort (the situations that matter):**
1. **Streaming data — the "only option" case.** Bucket sort needs the whole dataset finished before it starts (bucket array is sized by max frequency, unknowable mid-stream). A heap maintains the top-k answer *continuously* as events arrive. "Top 10 Courses" over 160M Kafka events with k=10: a 10-element heap, updated per event. **The production pipeline on my resume is the heap use case.**
2. **k ≪ d with memory pressure:** selection structure is O(k), not O(n + d) buckets.
3. **"Top k so far" queries at any moment** — heap has the answer standing; bucket sort recomputes from scratch.

**Probe 2 — Pricing the brute force honestly (after the O(n) count):**
- Sort entries by count: **O(d log d)**
- k repeated max-scans: **O(k · d)**
- Repeated scans win when k·d < d log d → **k < log₂(d)**. Concrete: a million distinct values → log₂ ≈ 20 → scanning wins only for k below ~20. One inequality, memorized, ends the discussion.

---

## Updated Improvement Plan

- [ ] **Heap study sprint (blocking gap for every remaining round):** implement a min-heap from scratch in TypeScript (insert, extract-min, sift-up/down), then solve: Kth Largest Element, Top K Frequent (heap variant), Merge K Sorted Lists, Find Median from Data Stream. Heaps power rate limiters, schedulers, and top-k — this WILL return in the system design round.
- [ ] **The "I don't know" protocol:** never naked — always attach one sentence of reasoning toward the answer, then the honest admission, then curiosity.
- [ ] **Resume audit:** re-read every bullet asking "can I survive three 'how exactly?' probes on this?" Fix or reword every observer-level claim (starting with the OpsGenie/memory bullet).
- [ ] Everything from the Phase 1–3 list above.

## Verdict (final)

**Coding: hire signal.** Correct, clean, optimal choice, verified.
**Round overall: no-hire at the 40+ LPA bar as of today** — the heap gap is a fundamentals gap, and the resume bullet that collapsed under one probe is a trust problem that would follow into every later round. **Both are fixable in days, not months** — the heap needs one focused study sprint; the resume needs one honest rewrite (or one deep retroactive learning session). The honesty shown in this round is the raw material of a strong senior engineer; the job now is making sure "I don't know" gets rarer and never arrives naked.
