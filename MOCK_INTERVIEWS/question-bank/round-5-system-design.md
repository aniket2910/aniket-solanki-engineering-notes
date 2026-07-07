# Round 5 — System Design: Framework & Three Worked Designs

For my profile, interviewers pick designs adjacent to my resume — ingestion pipelines, schedulers, rate limiters. Heaps live here (schedulers = "what fires next", top-k = "heap of winners").

---

## The framework (45 min, say the phase names out loud)

1. **Requirements (5 min):** functional + non-functional. ASK: scale (QPS, data size), latency targets, consistency vs availability, exactly-once vs at-least-once. Write the numbers down — every later decision cites them.
2. **Estimates (3 min):** back-of-envelope. events/sec → storage/day → memory for hot set. Round aggressively; the point is order-of-magnitude.
3. **API (3 min):** the 3–5 endpoints/events that matter.
4. **High-level diagram (10 min):** boxes + arrows, THEN pick each component's technology with a one-line why.
5. **Data model (5 min):** tables/keys, partition keys, indexes shaped by the read path.
6. **Deep dives (12 min):** the interviewer steers; otherwise pick the hardest hot path yourself and say why.
7. **Failure modes + observability (5 min):** what breaks, what pages, what's the recovery path. **Ending with observability is a senior signature.**

Trade-off language to use constantly: "X buys us A at the cost of B; at our scale numbers, A matters more because…"

---

## Design 1: High-throughput metrics ingestion ("Top 10 Courses" at planet scale)

**Prompt shape:** "Design a system ingesting course-view events at 50k events/sec; product wants a top-10-courses dashboard (near-real-time) and historical analytics."

**Skeleton:**
- Clients → API gateway/collector (batch + compress at the edge) → **Kafka** (partition by courseId; retention = replay/backfill safety) 
- Two consumers, deliberately split: **real-time path** — windowed counters (per-minute buckets) updating **Redis sorted set** (`ZINCRBY`; top-10 = `ZREVRANGE`, O(log n) updates); **batch path** — bulk upserts to warehouse (Snowflake/Postgres) for history.
- Dashboard API reads Redis (real-time) + warehouse (historical), cached with short TTL.

**Deep dives they'll pick:**
- **Hot key / celebrity course** → one partition saturates: salt the key (`courseId#0..3`), merge partials downstream; trade-off: per-key ordering lost.
- **Top-k exact vs approximate:** exact per-window = count per course (memory O(d)); at extreme cardinality, count-min sketch + **min-heap of size k** — say the heap.
- **Delivery semantics:** at-least-once + idempotent upserts (event-id dedup or additive-with-dedup-window). Exactly-once to an external store is engineered, not configured.
- **Backpressure:** consumer buffer bounds + pause/resume; NEVER unbounded in-memory buffering (that's a memory leak with extra steps).
- **Observability:** consumer lag per partition (the #1 metric), DLQ depth, window completeness.

## Design 2: Distributed rate limiter

**Prompt shape:** "Per-user, per-endpoint rate limiting across N API pods."

**Algorithm menu (recite, then choose):**
| Algorithm | Behavior | Cost | Verdict |
|---|---|---|---|
| Fixed window | 2x burst at window boundary | O(1) | simple; boundary flaw |
| Sliding log | exact | O(requests) memory | too heavy at scale |
| Sliding window counter | smooths boundary via weighted previous window | O(1) | good default |
| **Token bucket** | steady rate + controlled bursts | O(1) — just (tokens, last_refill) | **usual winner; refill computed lazily on access** |

**Skeleton:** middleware at gateway → **Redis** per key `{user}:{endpoint}` → decision + `429` with `Retry-After`.
- **The race** (two pods read-modify-write the same bucket): fix with a **Lua script** — read, refill, decrement, write in one atomic step. Saying "atomic via Lua, because check-then-set is a race" is the round's key sentence.
- **Latency tier:** local in-process limiter (rough, per-pod share) + Redis global check; or local-only with periodic sync when approximate is acceptable — name the consistency trade.
- **Redis down → fail-open or fail-closed?** Availability vs protection: fail-open for user APIs, fail-closed for payment/abuse endpoints. Saying it depends per endpoint = senior.
- Config: limits hot-reloadable per plan tier; return headers (`X-RateLimit-Remaining`).

## Design 3: Distributed job scheduler (my cron story, industrialized)

**Prompt shape:** "Design cron-as-a-service: users register jobs (cron expression + webhook/task), at-least-once execution, 100k jobs, some per-minute."

**Skeleton:**
- **Job store:** Postgres `jobs(id, schedule, next_run_at, status, lease_until, retry_count…)`, index on `(next_run_at) WHERE status='pending'`.
- **Claiming:** poller workers run `SELECT … WHERE next_run_at <= now() FOR UPDATE SKIP LOCKED LIMIT 100` — no duplicate firing without any extra lock service. (This exact sentence connects to my production cron work — use it.)
- **Execution:** claimed jobs → queue (Kafka/SQS) → executor pool, decoupling "due" from "running".
- **In-memory precision:** each poller holds the next few minutes of jobs in a **min-heap keyed by next_run_at** — pop when due; DB poll refills the heap. (The heap, again.)
- **Crash safety:** lease/heartbeat on claimed jobs; expired lease → reclaimed. Executions carry an idempotency key because at-least-once means reruns.
- **Failure handling:** retries with exponential backoff + cap → DLQ/quarantine + alert with the job id and error — my recursive fault-isolation story is the batch-shaped version; SAY THAT.
- **Misfire policy** (worker down over a scheduled tick): run-once-now vs skip vs catch-up-all — per-job configuration; naming misfires unprompted is a strong signal.
- **Observability:** per-job success rate + duration, scheduler lag (now − next_run_at at claim time), dead-man switch on the scheduler itself (the "who watches the watcher" line lands well).

---

## One-liners that raise the score anywhere

- "Partitions are the parallelism ceiling; the partition KEY is the ordering contract."
- "At-least-once plus idempotent writes is how real systems spell exactly-once."
- "The DLQ is the source of truth for failures; alerts are just notifications."
- "Every queue needs a bound; an unbounded buffer is an OOM with a delivery date."
- "Cache invalidation choices: TTL for freshness-tolerant, write-through-delete for correctness paths."
- "I'd end with observability: lag, DLQ depth, and a dead-man switch on the scheduler."
