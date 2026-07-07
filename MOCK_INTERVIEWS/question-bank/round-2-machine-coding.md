# Round 2 — Machine Coding: Problems, Checklist & Probe Answers

My full round-2 debrief (bugs, model solution): [../round-2-machine-coding.md](../round-2-machine-coding.md), reference code: [../round-2-code/model-solution.ts](../round-2-code/model-solution.ts).

---

## The problems that actually get asked (Node/TS flavored)

Practice at least 2 end-to-end (75 min, timer on, checklist below):

1. **Rate Limiter library** (per-key token bucket / sliding window; pluggable strategy) — *highest probability for backend roles*
2. **In-memory Task Queue / Scheduler** with retries, timeout, DLQ — *already done; redo it clean from scratch without looking*
3. **LRU / LFU Cache** with TTL (Map + doubly-linked list; O(1) everything)
4. **In-memory Pub-Sub** (topics, consumer groups, replay from offset, at-least-once)
5. **Splitwise / Expense sharing** (OOP modeling, balances simplification)
6. **Parking Lot / Vending Machine** (state machines, strategy for pricing/slot-allocation)
7. **Logger with rate limiting** (message dedup within window)
8. **Snake game / Tic-tac-toe** (board state, move validation, win detection)

## The checklist (run every problem against this)

**Before coding (5–10 min):**
- [ ] Classify: library vs service. A library never knows the caller's business logic.
- [ ] Ask who owns the ids / keys (API boundary question — always scores).
- [ ] List entities and their **explicit lifecycle states** (`queued | running | retry-scheduled | dead`). Implicit state = future bug.
- [ ] Name the pluggable seams out loud: "backoff is a Strategy interface so swapping never touches queue code."
- [ ] State the ambiguous-case decisions (duplicates, replay-during-shutdown) and DEFEND them in one line each.

**While coding:**
- [ ] Separation: one class per concern. Queue ≠ retry policy ≠ attempt runner ≠ DLQ.
- [ ] A concurrency slot is for EXECUTING, never waiting. No `await sleep()` inside a worker.
- [ ] One AbortController per attempt (signals are one-shot, aborted stays aborted).
- [ ] Every detached timer is state shutdown must account for (registry + cancel + dead-letter).
- [ ] Getters return defensive copies, never internal arrays/maps.
- [ ] Generics over `any` where cheap: `Task<P, R>`.

**Before saying "done":**
- [ ] Usage demo at the bottom (submit → fail → retry → DLQ → replay). ALWAYS, asked or not.
- [ ] Say how you'd test the ugly path (timers → fake timers; races → the fairness test).

## Probe questions they WILL ask, with answers

**"What happens if the caller never attaches `.catch()` to your returned promise?"**
Node 15+ crashes the process on unhandled rejections — dealbreaker for a library. Options: (1) result-object pattern — always resolve `{ok, value | error}`; (2) resolve-on-accept + events for completion — but say out loud that the promise's MEANING changed from "completed" to "accepted"; (3) handle object `{id, done}` with an internal no-op catch. Whichever notification style: **the DLQ remains the source of truth for failures; promises and events are just notifications.**

**"How do you test the timeout path?"**
Fake timers (`jest.useFakeTimers`): submit a handler returning `new Promise(() => {})`, advance by `timeoutMs`, assert rejection with TimeoutError and that the abort signal fired. Plus the two regression tests from my own bugs: signal-freshness (assert `signal.aborted === false` at the start of EVERY retry attempt) and fairness (concurrency 1, failing task + instant task — instant must finish first).

**"Your timeout fired but the handler is still running. What now?"**
You can't kill a promise. Timeout means: stop WAITING (the race) + ASK it to stop (abort signal). A handler that ignores the signal is a zombie — guard its late rejection with a no-op catch so it can't crash the process, and document the contract honestly.

**"Two submits with the same id — what's your behavior and why?"**
Reject while the id is queued/running/retry-scheduled: the id is the caller's idempotency key, and silently swallowing a duplicate hides a caller bug. An id in the DLQ may be resubmitted — a DLQ entry is a historical record, not a live task; replay() removes the record first so a live task and its ghost can't coexist.

**"How does your design change if tasks have priorities?"**
Swap the FIFO waiting array for a priority structure — a **min-heap keyed by priority** gives O(log n) insert/extract instead of O(n) sorted-insert. Watch for starvation of low-priority tasks: add aging (priority improves with wait time). The queue's interface doesn't change — that's the payoff of separating the waiting-store from the lifecycle logic.

**"How would you add persistence so tasks survive a restart?"**
Introduce a storage interface (in-memory impl today, Postgres/Redis impl tomorrow) behind the same lifecycle. On boot, recover: `running` tasks from a crashed process are ambiguous — use leases/heartbeats and re-run them, which forces the handler contract to become **idempotent**. Say the word idempotent; it's what they're fishing for.

## Design patterns worth naming out loud (only when actually used)

- **Strategy** — backoff policies, rate-limit algorithms, slot-allocation rules
- **Factory** — constructing strategy from config
- **Observer / EventEmitter** — completion notifications, queue metrics
- **State machine** — task lifecycle, vending machine, parking spot
- Naming a pattern you didn't implement = negative signal. Implementing without naming = missed signal.
