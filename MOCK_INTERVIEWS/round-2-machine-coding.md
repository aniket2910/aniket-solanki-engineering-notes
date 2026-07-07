# Round 2 — Machine Coding (LLD, OOP, Concurrency, Fault Handling)

**Date:** 2026-07-03
**Interviewer persona:** Staff Engineer (75-min machine coding round)
**Problem:** In-memory Task Queue library in TypeScript — `submit()`, bounded concurrency N, pluggable retry backoff, task timeout T, DLQ with failure history + replay, graceful shutdown. Full spec is at the top of [round-2-code/index.ts](round-2-code/index.ts).

---

## Phase 1 — Clarifying Questions (evaluated!)

**What I asked and how it landed:**

| My question | Verdict |
|---|---|
| "Data can break at DB insert or business logic — how to handle processing?" | ❌ Revealed service-builder thinking. A *library* never knows what the handler does. Failure = rejection or timeout. Period. |
| Restated the problem back | ⚠️ Mostly right, but said "implement one by one" (wrong — bounded concurrency N, serial is just N=1) and fused backpressure with shutdown (unrelated concepts). |
| "Who owns the task ids?" | ✅ Genuinely good API-boundary question. The caller owns ids; the library treats them as opaque idempotency keys. **Keep asking this type.** |
| "One class or proper implementation with DB?" | ❌ False binary. Answer was: no DB, in-memory, but multiple collaborating classes. |

**Lesson:** Before clarifying, first classify the problem — *library vs. service* — because every subsequent question flows from that. A library orchestrates; the caller owns business logic.

---

## Phase 2 — My Submission

Code: [round-2-code/index.ts](round-2-code/index.ts)

### What Was Good (real credit, not consolation)

- **The concurrency pool core is correct.** `activeCount` + `processNext()` with release-in-`finally` is the right shape, and there's no slot leak on the happy path.
- **`AbortSignal` in the handler contract** — most candidates never think about how a library *asks* a task to stop. Above-average instinct.
- **`timeoutPromise.catch(() => {})`** — knowing that an unraced rejected promise triggers `unhandledRejection` is a real Node.js maturity signal.
- **A dedup decision was made** (reject duplicates) and **replay-during-shutdown was handled** — both probe-bait, both covered.
- **Retry arithmetic is correct**: 1 initial + R retries = R+1 total attempts. Verified by live run.
- `concurrency <= 0` guard, promise-per-submit API — solid.

### Bug 1 (CONFIRMED by live run): `AbortController` created per task, not per attempt

`index.ts:70` — the controller is created once, outside the retry loop. An aborted signal can never be un-aborted. After the first timeout aborts it, **every subsequent retry receives a pre-aborted signal**. A well-behaved handler that honors the signal will instantly fail all remaining retries — the retry mechanism is dead on arrival for exactly the tasks that need it most (timeouts).

Live output against my code:
```
attempt 1: signal.aborted at handler start = false
attempt 2: signal.aborted at handler start = true   <-- poisoned
attempt 3: signal.aborted at handler start = true
attempt 4: signal.aborted at handler start = true
```
**Fix:** fresh `AbortController` per attempt (move it inside the loop / into an AttemptRunner).

### Bug 2 (CONFIRMED by live run): backoff sleep holds the concurrency slot

`index.ts:101` — `await sleep(delay)` runs *inside* the worker slot. A task in a 30s exponential backoff occupies one of N slots doing nothing. A few failing tasks starve every healthy task behind them.

Live output (concurrency=1, one failing task with 2×500ms backoffs, one instant task):
```
'failing' exhausted retries at ~1004ms
'quick' (instant task) finished at ~1005ms   <-- should be ~0ms
```
**Fix:** on failure, release the slot immediately and schedule a `setTimeout` that *re-enqueues* the task when the backoff expires. Retrying tasks re-enter the queue and compete fairly.

### Bug 3: zombie handler double-execution

On timeout, the handler's promise never settles but keeps *running*. The retry then invokes the handler **again, concurrently with the still-running previous attempt** — same task executing twice while `activeCount` counts it once. Can't fully prevent it (promises can't be killed), but the design must acknowledge it: fresh signal per attempt + document that timeout means "stop waiting + request stop", not "terminate".

### Requirement Misses

1. **Separation of concerns — the stated #1 expectation.** One `TaskQueue` class owns queueing, retry orchestration, timeout mechanics, DLQ, lifecycle. Backoff-as-injected-function is partial credit for the pluggable seam, but a `BackoffStrategy` interface + an attempt-runner + a DLQ boundary were expected.
2. **DLQ stores only the final error** — spec said failure *history* (plural errors with timestamps). One reproducing error at attempt 4 tells an operator nothing about attempts 1–3.
3. **`getDLQ()` returns the internal array by reference** — callers can mutate internal state and corrupt `replay()`.
4. **No usage example / demo** despite being asked for one.
5. **Decisions were implemented but never documented or defended** (duplicate policy, shutdown-converts-retryable-failures-to-DLQ at `index.ts:98` — that one is defensible, but it was an *accident of the `willRetry` condition*, not a stated choice).
6. Minor: `payload: any` (generics would elevate), shutdown-during-backoff still performs one extra retry (the `isShuttingDown` check happens *before* the sleep, not after).

---

## What I Need to Improve

- [ ] **State machine thinking**: every task is in exactly one state — `queued | running | retry-scheduled | dead`. Model the states explicitly; both confirmed bugs come from states being implicit (backoff hiding inside "running", abort hiding inside "the task").
- [ ] **Slot discipline**: a concurrency slot is for *executing*, never for *waiting*. Any `await sleep()` inside a worker is a red flag.
- [ ] **AbortSignal lifecycle**: signals are one-shot. One controller per cancellable unit of work (= per attempt).
- [ ] **Interfaces over parameters** for pluggable behavior: `BackoffStrategy` interface, not a bare function param — it names the seam and gives fixed/exponential a home.
- [ ] **Defensive copies** on every getter that exposes internal collections.
- [ ] **Say decisions out loud / in comments.** "I reject duplicates because the id is the caller's idempotency key" scores; silent behavior doesn't.
- [ ] **Always ship the demo** when asked. Working demo > extra feature.

## Model Answer

Full implementation: [round-2-code/model-solution.ts](round-2-code/model-solution.ts) — run it with `RUN_DEMO=1 npx tsx model-solution.ts`. Verified output shows: instant task NOT starved during a failing task's backoff, `signal.aborted=false` on every retry attempt, full failure history in DLQ, replay with fresh budget, clean drain.

### How to present the design out loud (the 60-second architecture pitch)

"I'll structure this as four pieces. A **TaskQueue** that owns intake, the waiting queue, and lifecycle — it's the only public surface. An **AttemptRunner** that owns exactly one attempt: one timeout, one fresh AbortController, one race. A **BackoffStrategy** interface with fixed and exponential implementations — that's my pluggable seam. And a **DLQ** map keyed by task id storing the full failure history.

Two decisions I want to flag. First, when a task fails, I release its concurrency slot immediately and schedule the retry on a timer — the task re-enters the queue when the timer fires. Slots are for executing, not waiting; otherwise failing tasks starve healthy ones. Second, on duplicate ids I reject rather than dedup silently — the id is the caller's idempotency key, and swallowing a duplicate hides a caller bug. An id in the DLQ can be resubmitted though, because a DLQ entry is a historical record, not a live task.

One honest limitation: I can't kill a running promise. Timeout means I stop waiting and I signal the handler to stop — a handler that ignores the signal becomes a zombie. I guard its late rejection so it can't crash the process, and I document the contract."

### Testing the timeout path (they always ask)

1. Fake timers (`jest.useFakeTimers`): submit `new Promise(() => {})`, advance by `timeoutMs`, expect `TimeoutError` + abort event fired.
2. **Signal freshness test**: hang on attempt 1, record `signal.aborted` at start of each attempt, assert always `false` — this exact test catches Bug 1.
3. **Fairness test**: concurrency 1, failing task + instant task, assert instant finishes first — this exact test catches Bug 2.
4. Zombie safety: handler rejects after losing the race — assert no `unhandledRejection`.

---

## Phase 3 — Follow-up Probes (verbal)

### Probe 1: "Walk me through the fix for the backoff-holds-slot bug."

**My answer (summary):** Release the slot immediately on failure — decrement active count, call `processNext()` so waiting tasks start. Spin up a background `setTimeout` for the backoff; the task is completely out of the execution pool while waiting. When the timer fires, push the task to the end of the pending queue and call `processNext()` again.

**Verdict: ✅ Correct mechanism, clearly explained.** Slot release, background timer, re-enqueue at tail (fair competition with new work) — all three parts right.

**What was missing (the staff-level layer):** the *shutdown interaction*. Once retries live on detached timers, `shutdown()` has a new problem: a task sleeping on a retry timer is invisible to `activeCount` and the queue — so a naive drain either **resolves early and silently loses the task**, or **hangs waiting out a 30s backoff**. The fix needs a `pendingRetries` registry that (a) counts toward "not yet drained", and (b) lets shutdown cancel the timers and dead-letter those tasks. Every time you move work onto a timer, ask: *who knows about this timer during shutdown?* See `pendingRetries` handling in [model-solution.ts](round-2-code/model-solution.ts).

### Probe 2: "submit() rejects on dead-letter — what about callers who never attach .catch()?"

**My answer (summary):** That's a landmine — modern Node crashes the process on unhandled rejections, dealbreaker for a library. Two design alternatives: (1) Result-object pattern — `submit()` always resolves with `{ success, data | error }`, forcing explicit outcome checks; (2) event-emitter pattern — `submit()` resolves once the task is safely *enqueued*, failures surface via `queue.on('failure', ...)` or configured callbacks.

**Verdict: ✅ Correct diagnosis (Node ≥15 does crash by default) and two legitimate designs.**

**Sharpening for next time — name the semantic shift and the trade-offs:**
- In option 2, the returned promise changes *meaning*: from "task completed" to "task accepted". That must be screamed in the API docs, and you now need a completion surface (events/handle) — this is what BullMQ-style libraries do.
- Option 1 keeps per-task ergonomics but loses `try/catch` and `Promise.all` short-circuit composability.
- A hybrid worth mentioning: `submit()` returns a handle `{ id, done: Promise }` where `done` is lazily awaited — plus an internally-attached no-op catch so ignoring it is safe.
- Whichever notification style: **the DLQ remains the source of truth for failures**; promises/events are just notifications. Saying that sentence in an interview is worth a lot.

---

## Verdict

**Initial submission: "lean no" at the 40+ LPA bar. After the verbal debrief: borderline / lean-hire.** The core pool works and the instincts (AbortSignal, unhandled-rejection guard) are real; both follow-up probes were answered correctly and calmly under critical feedback — panels weigh that recovery heavily. What kept the round from a clean hire: the stated #1 expectation (separation of concerns) was missed in code, and both confirmed bugs were *concurrency* bugs in a round titled concurrency. The 25→40 LPA jump here is not more syntax — it's modeling the task lifecycle as explicit states (`queued | running | retry-scheduled | dead`) so implicit-state bugs become impossible to write, and asking "who owns this timer during shutdown?" for every piece of detached work.
