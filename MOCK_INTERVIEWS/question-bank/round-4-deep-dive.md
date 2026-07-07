# Round 4 — Technical Deep Dive: Questions, Answers & Probe Trees

The highest-weight round for my profile: every question here starts from MY resume. Rule: I must survive **three consecutive "how exactly?" probes** on every bullet.

---

## A. My three signature stories, probe-proofed

### Story 1: Dashboard 15s → 2s

**Opening answer (60s):**
"The dashboard aggregates curriculum progress and completion metrics for curriculum managers. The original implementation queried several Postgres materialized views; as the catalog grew, one page load fired multiple queries with heavy joins over those views, and p95 hit 15 seconds. I moved the aggregation cost off the request path: a scheduled job pre-computes the aggregates into flat, indexed tables shaped exactly like the dashboard's queries, and the API reads those with simple indexed lookups — 2 seconds, most of it network and rendering. The trade-off is freshness: data can be up to one refresh interval old. I took that to the product owner FIRST — for curriculum planning, hourly staleness was explicitly acceptable."

**Probe tree (they will pick 2–3):**
- *"Why not just index the materialized views?"* → The cost wasn't one missing index — it was multiple MVs joined per request plus recompute cost. Indexing helps each scan; it doesn't remove join fan-out on the request path. Pre-aggregation collapses the join into one flat row shape ahead of time.
- *"Why not `REFRESH MATERIALIZED VIEW CONCURRENTLY`?"* → Still recomputes the WHOLE view each refresh (expensive at our sizes), needs a unique index, and the dashboard query itself still joined several views. The cron approach let me compute incremental slices and shape tables per query.
- *"How do readers avoid seeing a half-written refresh?"* → [FILL: my real mechanism — options I must be able to discuss: refresh into a staging table then atomic `ALTER TABLE ... RENAME` / transactional delete+insert / upsert batches so rows are always consistent individually.]
- *"How did you verify the win?"* → [FILL: before/after p95 from Grafana/New Relic, the exact metric I watched.]
- *"What breaks if the cron dies silently?"* → Stale data with no error — which is why the re-architecture added alerting; segue to Story 2.

### Story 2: Cron re-architecture with recursive fault isolation

**Opening answer (75s):**
"The pre-aggregation job had a data-correctness failure mode: one bad record in a batch — say a null in a field a constraint needs — failed the whole batch's transaction, so curriculum managers saw stale or wrong content-plan statuses. Silent partial failure is the worst kind: nothing pages, but the dashboard lies. While migrating our crons into a dedicated NestJS service, I rebuilt the job around recursive fault isolation: process the batch; on failure, split it in half and process each half in its own transaction; keep splitting the failing half until the exact bad record is isolated — that's O(log n) extra passes instead of paying per-record cost on every run. Good halves commit as they're found, the bad record is quarantined, a Slack alert fires with the record id and error, the job re-runs isolated records automatically, and there's a defined escalation path if a record still fails."

**Probe tree:**
- *"Why binary split instead of row-by-row with try/catch?"* → Row-by-row pays n transactions/round-trips on EVERY run, killing bulk-write throughput on the 99% of runs with zero bad records. Binary split keeps the happy path fully batched and pays log cost only on failure. With b bad records it's ~O(b log n) extra work.
- *"What if BOTH halves fail?"* → Recursion handles it mechanically (each failing half splits), but if failures are widespread it's not a bad record — it's systemic (DB down, schema drift, upstream format change). [FILL: did I have a stop condition? The right answer: a failure-ratio threshold that aborts splitting and alerts as systemic instead of spamming.]
- *"Transaction semantics of the halves?"* → Each sub-batch is its own transaction — good halves commit permanently even while the sibling half is still being bisected. Requires the writes to be independent per record: they were upserts keyed by [FILL: real key].
- *"Is the job idempotent? What happens on re-run after a crash mid-split?"* → Upsert semantics make reprocessing safe; re-running a committed half is a no-op. [FILL: verify what actually happens — this WILL be asked.]
- *"Why a quarantine + Slack instead of just logging?"* → Logs are where errors go to be ignored. The alert carries the record id + error; the quarantine table is the replay path — same philosophy as a DLQ: source of truth for failures, with an operational recovery route.
- *"Why migrate crons into a dedicated NestJS service?"* → Isolation: crons on API pods contend with request traffic and get killed by API deploys mid-run. Dedicated service = independent deploy cadence, right-sized resources, one place for scheduling observability. NestJS specifically: DI makes the jobs testable (mock repos/clients), `@nestjs/schedule` declarative crons, consistent module structure across the team's services.

### Story 3: Kafka pipeline, 100 → 10,000 records/min (and the consumer fix)

**Opening answer (75s):**
"Two Kafka chapters. As SDE-1 I built the pipeline behind 'Top 10 Courses' — 160M+ historical records flowing through to per-course, per-manager aggregates. First version did ~100 records/minute; we got it to ~10,000. Three bottlenecks, in order: consumption parallelism, per-record database writes, and event-loop stalls on heavy parsing. As SDE-2, within days of joining the Author Tool team, I fixed a production issue where authors saw wrong viewership data — the consumer choked on upstream events with null fields; I patched the immediate handling, then hardened the consumer with validation at the boundary so malformed events get rejected to a dead-letter path instead of corrupting downstream data."

**Probe tree:**
- *"Be precise: what limited you to 100/min?"* → [FILL: the true first bottleneck — likely per-record processing + per-record DB writes. I must know which change bought which multiple. "I don't remember which change bought which multiple" collapses the 100x claim.]
- *"How does partition count relate to consumer parallelism?"* → A partition is consumed by at most ONE consumer in a group at a time — partitions are the parallelism ceiling. Scaling consumers past partition count parks the extras idle. Ordering is guaranteed only within a partition, so the partition key must match the ordering requirement: key by courseId → per-course order preserved, which is what the aggregates needed.
- *"Batch DB writes — how, exactly?"* → Buffer in memory: flush at N records OR T ms, whichever first; single multi-row `INSERT ... ON CONFLICT DO UPDATE`. Watch connection-pool sizing and transaction duration. Idempotent upserts are what make at-least-once delivery safe.
- *"Delivery semantics — what did you choose and why?"* → At-least-once: commit offsets AFTER successful DB write. Crash between write and commit → reprocess → upsert makes it a no-op. At-most-once (commit first) risks silent data loss — wrong for analytics. Exactly-once across an external DB isn't a Kafka checkbox; it's engineered via idempotent writes or an outbox/transactional pattern.
- *"The null-field incident: why did bad events corrupt data instead of crashing?"* → [FILL: real failure shape — e.g., null propagated into an aggregate as 0/NaN?] The hardening principle: validate at the consumer boundary, treat the topic as untrusted input, route poison messages to a DLQ topic with the error attached, never let one bad event block the partition (skip-and-log vs halt is a per-domain decision — for viewership counts, quarantine-and-continue was right).
- *"What if one course is 100x hotter than the rest?"* → Hot partition: keying by courseId sends all its traffic to one partition → one consumer maxed while others idle. Mitigations: salt the key (courseId#shard 0..3) and merge downstream aggregates; or two-stage aggregation (partial counts → final merge). Know the trade-off: salting sacrifices per-key ordering.
- *"How do you MONITOR this pipeline?"* → Consumer lag (latest offset − committed) per partition with alerting, processing rate, DLQ depth, DB flush latency. Lag is the single most important Kafka health metric — say it unprompted.

---

## B. Node.js internals (asked at every Node shop)

**"Explain the event loop."**
libuv runs phases: **timers** (expired setTimeout/setInterval) → pending callbacks → poll (I/O — where the loop mostly lives) → **check** (setImmediate) → close callbacks. Between callbacks, Node drains the **microtask queues**: `process.nextTick` first, then promise callbacks. Sockets use OS async I/O (epoll/kqueue); fs, dns.lookup, crypto.pbkdf2, zlib run on the **libuv thread pool** (default 4 threads, UV_THREADPOOL_SIZE). So "single-threaded" means single JS thread — I/O is heavily parallel underneath.

**"So how does one thread serve 10k concurrent connections?"**
Because nothing waits: each connection's work is a chain of small callbacks; while one request awaits the DB, the loop runs others. It breaks when a callback does heavy CPU work — everything queues behind it.

**"CPU-heavy work is blocking the loop. Fix it."** *(the old guide's "microtask queue" answer is WRONG here)*
Three real options: (1) **worker_threads** — true parallelism, transfer data via ArrayBuffer/structured clone; right for parsing/crypto/compression; (2) **chunking with `setImmediate`** — slice the work, yield back to the poll phase between slices; cooperative, right for medium batch work in a consumer; (3) **cluster / more pods** — process-level parallelism. NEVER "move it to promises/microtasks": microtasks run BEFORE the loop continues — they starve I/O rather than free it.

**"process.nextTick vs Promise.then vs setImmediate vs setTimeout(0)?"**
nextTick → before other microtasks (dangerous in loops: starves everything); Promise.then → microtask, after nextTick; setImmediate → next check phase (after poll — the honest "yield to I/O"); setTimeout(0) → next timers phase (~1ms clamp). For yielding inside heavy loops: setImmediate.

**"How do you find a memory leak in a Node service?"**
Confirm with metrics (heapUsed trend after full GC, pod RSS). Capture heap snapshots at intervals (`--inspect`, Chrome DevTools / `v8.writeHeapSnapshot`), diff by constructor to find what's growing, trace retainers. Usual suspects: unbounded caches/maps, listeners never removed (`EventEmitter` leak warning), closures in long-lived timers, buffered streams without backpressure. In my pipeline the equivalent lesson was bounding the in-memory batch buffer — unbounded buffering between a fast producer and slow DB IS the memory leak.

**"Streams and backpressure?"**
`write()` returns false when the internal buffer passes highWaterMark → stop and wait for `'drain'`. `pipe`/`pipeline` handle it automatically. Ignoring backpressure = unbounded memory. Same concept in Kafka consumers: pause()/resume() around a full write buffer.

## C. PostgreSQL (asked because it's my primary DB)

**"How do you debug a slow query?"**
`EXPLAIN (ANALYZE, BUFFERS)`: compare estimated vs actual rows (way off → stale stats → `ANALYZE`), look for seq scans on large tables where an index applies, nested-loop joins on big inputs, sorts spilling to disk. Then: right index, rewritten predicate (sargable — no functions over indexed columns), or restructure (pre-aggregation, as in my dashboard).

**Index types I must speak fluently:** B-tree (default; equality + range); composite (leftmost-prefix rule); partial (`WHERE status = 'active'` — small + fast for hot subsets); covering (`INCLUDE` → index-only scans); GIN (jsonb/arrays/full-text). Every index taxes writes — analytics-heavy tables want few, fat, query-shaped indexes.

**"How would you build a job queue in Postgres?"** *(bridges to my cron work — likely)*
`SELECT ... FROM jobs WHERE run_at <= now() AND status = 'pending' ORDER BY run_at FOR UPDATE SKIP LOCKED LIMIT n` — each worker locks rows others skip: work distribution without a broker. Prevent duplicate cron firing across instances: advisory locks (`pg_try_advisory_lock(job_key)`) or that same claimed-row pattern.

**Isolation levels one-liner:** Read Committed (default — each statement sees committed data; two reads can differ), Repeatable Read (snapshot per transaction; write conflicts abort), Serializable (as-if-serial; retry on serialization failure). Long-running transactions hold back vacuum → bloat → the slow creep my materialized views suffered.

**Connection pooling:** every Postgres connection is a backend process — hundreds are expensive. Pool in-app (TypeORM pool size × pod count must stay under max_connections, minus headroom) or PgBouncer in transaction mode.

## D. Redis (on my resume — expect at least one)

- **Cache-aside**: read → miss → load DB → set with TTL. Invalidation: TTL + explicit delete-on-write for hot correctness paths.
- **Stampede protection**: TTL jitter, single-flight (lock per key while one loader refreshes), or serve-stale-while-revalidate.
- **Distributed lock, honestly**: `SET key token NX PX ttl`, release via Lua compare-and-delete (only the owner releases). Redlock across nodes exists but is debated (clock assumptions) — for cron dedup, one Redis + TTL + fencing token, or just Postgres advisory locks: fewer moving parts. Saying "I'd use the DB lock because we already run Postgres" is a SENIOR answer, not a cop-out.

## E. Rapid-fire (one strong sentence each)

- **Why Kafka over RabbitMQ here?** Replayable log + consumer-side offsets + partition-scale fan-out for analytics; Rabbit is a work-dispatch broker — messages leave the queue; Kafka retains history (my 160M backfill NEEDED replay).
- **Consumer rebalancing?** Group membership changes → partitions reassigned; in-flight work may duplicate (at-least-once) — another reason writes must be idempotent; cooperative-sticky rebalancing reduces stop-the-world.
- **TypeORM in one line:** productive for CRUD + migrations; drop to query builder/raw SQL for bulk upserts and anything EXPLAIN-worthy — ORM-generated N+1 and per-row saves were exactly what I removed in the batching fix.
- **CommonJS vs ESM:** require = sync, dynamic; import = static graph, tree-shakeable, async top-level await.
- **Docker/GitLab CI:** multi-stage builds (builder + slim runtime), layer caching for node_modules, run tests in CI against service containers (Postgres/Kafka via testcontainers-style setup).
