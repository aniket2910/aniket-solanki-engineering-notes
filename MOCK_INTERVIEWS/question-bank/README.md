# SDE-2 Interview Question Bank — Aniket Solanki

Built 2026-07-03, after mock rounds 1–3. Personalized to my resume, my stories, and the gaps the mock loop found. Next mock loop: ~July 13–15, 2026.

## Files

| Round | File | Priority |
|---|---|---|
| 1. HR Screener | [round-1-hr.md](round-1-hr.md) | Memorize scripts word-for-word |
| 2. Machine Coding | [round-2-machine-coding.md](round-2-machine-coding.md) | Practice 2 problems end-to-end |
| 3. DSA | [round-3-dsa.md](round-3-dsa.md) | **Heap sprint is blocking** |
| 4. Technical Deep Dive | [round-4-deep-dive.md](round-4-deep-dive.md) | **Highest-weight round for my profile** |
| 5. System Design | [round-5-system-design.md](round-5-system-design.md) | Framework + 3 worked designs |
| 6. Behavioral | [round-6-behavioral.md](round-6-behavioral.md) | Fill in the [FILL] markers with real details |
| 7. Negotiation | [round-7-negotiation.md](round-7-negotiation.md) | Read the night before any offer call |

## ⚠️ Correction to the old guide (sde2_interview_prep_guide.md)

The old guide's Kafka scaling answer says: *"I offloaded JSON schema validation and mapping to a microtask queue, ensuring the consumer loop remained free."* **This is technically wrong — do not say it.** Microtasks (promise callbacks) run *before* the event loop proceeds; moving CPU work into microtasks still blocks I/O — microtasks actually *starve* the event loop. The correct answers for CPU-heavy work in Node: **worker threads** (true parallelism), **chunking with `setImmediate`** (yields to the poll phase between chunks — macrotask, not microtask), or **cluster/child processes**. An interviewer who hears "microtask queue" as a concurrency fix will dig, and the answer collapses. Details in round-4 file.

## The 12-Day Plan

| Day | Focus |
|---|---|
| 1–2 | **Heap sprint**: implement min-heap from scratch (insert, extract-min, sift-up/down). Solve: Kth Largest, Top K Frequent (heap variant), Merge K Sorted Lists, Median from Data Stream. |
| 3–4 | DSA patterns: sliding window, two pointers, intervals, BFS/DFS, binary search. 3–4 problems/day, using the round-3 talking protocol *out loud*. |
| 5 | Machine coding: 1 problem end-to-end with the round-2 checklist (state machine, tests, demo). Suggested: Rate Limiter or LRU Cache. |
| 6–7 | Deep dive: own my three signature stories to three-probe depth (round-4 probe trees). Study Node event loop, Kafka semantics, Postgres locking/EXPLAIN. |
| 8 | System design: framework + distributed scheduler + rate limiter designs, spoken out loud against a timer (45 min each). |
| 9 | Behavioral: fill every [FILL] marker in round-6 with real names/numbers/dates. Record the pitch; listen; re-record. |
| 10 | **Resume audit** (run the pending task chip): every bullet must survive three "how exactly?" probes. Fix HR + negotiation scripts; say them out loud. |
| 11 | Second machine coding problem + system design #3 (metrics ingestion). |
| 12 | Full self-mock across all rounds, then return for mock loop #2. |

## The 8 Rules the Mock Loop Taught Me

1. **Metrics in every pitch, unprompted.** 15s→2s. 160M+. 100→10,000/min. 4 sprints, 3 engineers. If they weren't said, they don't exist.
2. **Never say "poor English", "just", "only", "I am talented".** State facts; let numbers make claims.
3. **"I don't know" never arrives naked** — one sentence of reasoning toward the answer first, then the honest admission.
4. **Engage every stated objection directly.** An unanswered objection stands as agreed.
5. **Every resume bullet must survive three consecutive "how exactly?" probes.** One collapsed bullet poisons all the true ones.
6. **Model lifecycles as explicit states** (`queued | running | retry-scheduled | dead`). Implicit states are where my bugs live.
7. **A concurrency slot is for executing, never for waiting.** And every detached timer is state that shutdown must account for.
8. **Answer what was asked, all of it.** A skipped question is scored as a miss, not as neutral.
