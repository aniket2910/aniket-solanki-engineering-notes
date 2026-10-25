# Indexes in Postgres

## ⚡ In one line

An index is a separate, sorted lookup structure (a B-tree by default) that maps column values to row
locations. Postgres can then jump straight to matching rows instead of reading the whole table. You
pay for that speed with extra disk space and slower writes.

---

## 🔍 What the interviewer is really testing

- **Do you know *when* an index helps, not just *that* it helps?** The senior signal is
  **selectivity**: an index wins when a filter matches a small fraction of rows, and the planner
  rightly ignores it otherwise.
- **Can you design a composite index for a real query?** Column order, the leftmost-prefix rule, and
  "equality first, then range/sort".
- **Do you know the ways an index silently stops being used?** A function on the column, a type
  mismatch, `LIKE '%x'`, the wrong column order.
- **Do you treat indexes as a trade-off?** Write cost, space, lost HOT updates, locking during
  creation (`CONCURRENTLY`), and finding unused indexes. "Index everything" is a red flag.

---

## 🩹 Why it exists (the problem)

A table in Postgres (the **heap**) is stored in no particular order, in 8 KB pages. Without an index,
`WHERE user_id = 42` has exactly one strategy: read every page and test every row. That is a
**sequential scan**, O(n). On 200,000 rows that's about 12 ms. On 200 million it's seconds per query,
on every query. An index turns "read everything" into "look it up", roughly O(log n), and it can also
hand rows back already sorted, so `ORDER BY … LIMIT` needs no sort step.

---

## 🧩 What it is

An index is a **second data structure, stored separately from the table**, that holds:

- the **indexed value(s)**, kept **sorted** (for B-tree), and
- for each value, a pointer to the row: the **TID / `ctid`**, which is (page number, slot on page).

The table never depends on the index. Drop every index and every query still returns the same
answer, just slower. An index is purely an **access path**, and the **planner** decides per query
whether using it is worth it.

**Index types Postgres ships** (B-tree is the default and what you'll use about 90% of the time):

| Type | Good for | Example |
|---|---|---|
| **B-tree** (default) | `=`, `<`, `>`, `BETWEEN`, `IN`, `ORDER BY`, prefix `LIKE 'abc%'`* | `user_id`, `created_at`, `email` |
| **Hash** | `=` only | Rarely chosen over B-tree in practice |
| **GIN** | "Contains" queries over values with many parts | `jsonb @>`, arrays, full-text search, trigram `LIKE '%x%'` (via `pg_trgm`) |
| **GiST / SP-GiST** | Geometric, range and nearest-neighbour searches | PostGIS, range types, exclusion constraints |
| **BRIN** | Huge tables where values follow physical order | Append-only logs ordered by time |

*A B-tree serves `LIKE 'abc%'` only under the `C` collation or with the `text_pattern_ops` operator
class. Under other collations a plain B-tree won't serve it.

---

## 🎈 Real-life analogy: the index at the back of a textbook

- **The table** is the book's pages. **A sequential scan** is reading the whole book to find every
  mention of "MVCC".
- **The index** is the alphabetical index at the back. It's **sorted** (so you find "MVCC" fast) and
  each entry lists **page numbers** (the `ctid` pointing into the heap).
- **Selectivity:** if a word appears on 3 pages, the index is a huge win. If "the" appears on every
  page, flipping to the index and then to each of 400 pages is *slower* than reading the book
  straight through. That's why the planner ignores the index for unselective filters.
- **Composite index** = a phone book sorted by **(last name, first name)**. Finding "Sharma, Priya"
  is instant, and so is "all Sharmas". Finding "everyone named Priya" is not, because first names are
  only sorted *within* each last name. That is the **leftmost-prefix rule**.
- **Covering index** = an index entry that already holds the answer ("MVCC: defined p.212"). You
  never turn to the page at all. That is an **index-only scan**.
- **Cost:** every new edition of the book means updating the index too, and the index adds pages.
  That is the **write and space cost**.

---

## 🔧 How it works (under the hood)

### The B-tree

```
                        [ root:  1700 | 3400 ]
                       /          |           \
          [ 300 | 900 | 1300 ]   ...      [ 3900 | 4500 ]          ← internal pages: signposts
            /     |     \                       ...
   [ 40 41 42 42 42 43 ] ⇄ [ 44 45 ... ] ⇄ ...                     ← leaf pages, linked left↔right
         │   │   │
         ▼   ▼   ▼
   (page 17, slot 3) (page 902, slot 1) (page 1450, slot 7)        ← ctids into the heap
```

- **Balanced:** every leaf is at the same depth. Each page holds hundreds of keys, so the tree is very
  shallow, typically 3–4 levels even for many millions of rows. A lookup reads a handful of pages.
- **Leaves are sorted and linked to their neighbours**, so a range (`BETWEEN`, `>=`) or an
  `ORDER BY` walks sideways along the leaves without going back to the root. That's why one B-tree
  serves equality, ranges and sorting.
- Postgres's B-tree implementation is based on the Lehman & Yao design for high concurrency. It also
  stores duplicate values compactly (deduplication, added in Postgres 13).

### The four ways Postgres reads a table (what you'll see in `EXPLAIN`)

| Plan node | What happens | When the planner picks it |
|---|---|---|
| **Seq Scan** | Read every heap page in order | No usable index, or the filter matches a large share of rows |
| **Index Scan** | Walk the B-tree, then fetch each matching row from the heap | Few rows, or rows needed in index order (`ORDER BY … LIMIT`) |
| **Bitmap Index Scan → Bitmap Heap Scan** | Collect all matching ctids from the index into a bitmap, then read the heap pages **in physical order**, each page once | A moderate number of rows: avoids random back-and-forth heap reads. "Recheck Cond" appears because a bitmap that gets too big becomes lossy (page-level), so rows must be re-tested. |
| **Index Only Scan** | Answer entirely from the index, skipping the heap | Every needed column is in the index **and** the pages are marked all-visible |

### Why the planner sometimes ignores your index

Postgres has a **cost-based planner**. It estimates the cost of each plan from **statistics**
gathered by `ANALYZE` (row counts, most-common values, histograms) and picks the cheapest. Index
lookups cause **random I/O** (jumping around the heap), which the cost model charges more for than
sequential I/O (`random_page_cost = 4.0` vs `seq_page_cost = 1.0` by default). So:

```
matches 40 of 200,000 rows   →  index: ~40 random page reads   ≪  seq: 2,858 pages   → use index
matches 150,000 rows         →  index: ~150k lookups + jumps   ≫  seq: 2,858 pages   → Seq Scan
```

Ignoring the index here is the planner being *right*. If it picks badly, suspect **stale
statistics** (run `ANALYZE`) before blaming the index.

### Why index-only scans need VACUUM

Postgres uses MVCC: a row's visibility (which transactions can see it) is stored **in the heap row,
not in the index**. So even when the index has every column, Postgres normally must check the heap to
see whether the row is visible to *your* transaction. The **visibility map** marks pages where every
row is visible to everyone. For those pages the heap check is skipped. **VACUUM** maintains the
visibility map, so a table that is rarely vacuumed gets "index-only" scans that still hit the heap
(`Heap Fetches: N` in `EXPLAIN ANALYZE`).

### What an index costs on writes

- Every `INSERT` adds an entry to **every** index on the table.
- An `UPDATE` normally writes a new row version, and that new version needs new index entries. The
  exception is a **HOT (Heap-Only Tuple) update**: if no indexed column changed and the page has free
  space, Postgres skips the index updates entirely. **Indexing a frequently updated column disables
  HOT for those updates**, a hidden cost many people miss.
- Plain `CREATE INDEX` blocks writes to the table while it builds. `CREATE INDEX CONCURRENTLY` lets
  writes continue, at the cost of a slower build. It can't run inside a transaction block, and if it
  fails it leaves an `INVALID` index you must drop.

---

## 💻 In code

Everything below runs, with real plans, in the shared playground. `events` has 200,000 rows and
starts with only a primary key:

```bash
cd INTERVIEW_PREP/POSTGRES/playground && npm install
```

```bash
npm run q -- indexes
```

The file is [`playground/queries/interview/001-indexes.sql`](playground/queries/interview/001-indexes.sql).
The plans shown here are real output from that run.

### 1. Before and after: the basic win

```sql
EXPLAIN ANALYZE SELECT * FROM events WHERE user_id = 42;
-- Seq Scan on events  (actual ... rows=40)
--   Filter: (user_id = 42)
--   Rows Removed by Filter: 199960          ← read 200k rows to keep 40
-- Execution Time: 11.7 ms

CREATE INDEX idx_events_user_id ON events (user_id);

EXPLAIN ANALYZE SELECT * FROM events WHERE user_id = 42;
-- Bitmap Heap Scan on events
--   ->  Bitmap Index Scan on idx_events_user_id
--         Index Cond: (user_id = 42)
-- Execution Time: 0.08 ms                   ← ~140× faster
```

### 2. Selectivity: the planner ignores an index on purpose

```sql
CREATE INDEX idx_events_kind ON events (kind);

EXPLAIN SELECT * FROM events WHERE kind IN ('click', 'add_to_cart', 'purchase');  -- 75% of rows
-- Seq Scan on events                        ← index exists, correctly NOT used

EXPLAIN SELECT * FROM events WHERE kind = 'refund';                               -- rare
-- Index Scan using idx_events_kind          ← same index, used
```

### 3. Composite index: equality first, then range/sort

```sql
-- "A user's recent events, newest first": the classic feed / activity query.
CREATE INDEX idx_events_user_created ON events (user_id, created_at);

EXPLAIN SELECT * FROM events
WHERE user_id = 42 AND created_at >= '2026-03-01'
ORDER BY created_at DESC LIMIT 10;
-- Limit
--   ->  Index Scan Backward using idx_events_user_created
--         Index Cond: ((user_id = 42) AND (created_at >= ...))
-- No Sort node: the index already returns rows in order, read backwards for DESC.
```

### 4. The leftmost-prefix rule

```sql
-- (user_id, created_at) serves a filter on user_id alone...
EXPLAIN SELECT * FROM events WHERE user_id = 42;
-- Bitmap Index Scan on idx_events_user_created     ✅

-- ...but not on created_at alone. It is only sorted within each user.
EXPLAIN SELECT * FROM events WHERE created_at >= '2026-03-01' AND created_at < '2026-03-02';
-- Seq Scan on events                               ❌
```

This is also why `idx_events_user_id` became **redundant** once the composite existed: the composite
covers it.

**Version nuance worth mentioning (Postgres 18+).** Postgres 18 added **B-tree skip scan**. When the
leading column has *few* distinct values, the planner can run one small index search per distinct
value and so use `(a, b)` for a filter on `b` alone. Here `user_id` has 5,000 distinct values, so
skip scan doesn't pay off and the plan stays a Seq Scan. The rule of thumb is unchanged: if a
pattern leads with `b`, give it an index that leads with `b`.

### 5. A function on the column hides it from the index

```sql
CREATE INDEX idx_events_created ON events (created_at);

-- ❌ The index stores created_at, not "created_at converted to a date".
EXPLAIN SELECT count(*) FROM events WHERE (created_at AT TIME ZONE 'UTC')::date = '2026-03-01';
-- Seq Scan on events

-- ✅ Fix A (preferred): make it sargable, a range on the bare column.
EXPLAIN SELECT count(*) FROM events
WHERE created_at >= '2026-03-01' AND created_at < '2026-03-02';
-- Index Only Scan using idx_events_created

-- ✅ Fix B: an expression index matching the query's exact expression.
CREATE INDEX idx_events_day ON events (((created_at AT TIME ZONE 'UTC')::date));
```

The same trap in everyday code: `WHERE lower(email) = $1` needs an index on `(lower(email))`.

### 6. Covering, partial, and the bill

```sql
-- Covering: INCLUDE carries extra columns in the leaf so the heap is never touched.
CREATE INDEX idx_events_user_cover ON events (user_id) INCLUDE (kind);
VACUUM events;                                       -- sets the visibility map
EXPLAIN SELECT user_id, kind FROM events WHERE user_id = 42;
-- Index Only Scan using idx_events_user_cover

-- Partial: only index the rows the hot query asks for.
CREATE INDEX idx_events_purchases ON events (created_at) WHERE kind = 'purchase';
-- 1.1 MB vs 6 MB for a full (user_id, created_at) index on the same table

-- The bill: every index is a separate structure that every write maintains.
SELECT indexrelname, pg_size_pretty(pg_relation_size(indexrelid))
FROM pg_stat_user_indexes WHERE relname = 'events';
```

### 7. From your Node.js code

The index is invisible to application code, so the only thing your code controls is whether the
query *can* use it:

```ts
import { Pool } from "pg";

const pool = new Pool();

// Sargable: the bare indexed column is compared to parameters, so the
// (user_id, created_at) index serves both the filter and the ORDER BY.
export async function recentEvents(userId: number, since: Date, limit = 20) {
  const { rows } = await pool.query(
    `SELECT id, kind, created_at
       FROM events
      WHERE user_id = $1 AND created_at >= $2
      ORDER BY created_at DESC
      LIMIT $3`,
    [userId, since, limit],
  );
  return rows;
}
```

---

## 🏗️ Code quality & principles applied

**Decomposition: design the index from the query, not from the table.**
Work it out in three steps, out loud:
1. **What are the hot queries?** Indexes serve access patterns, not columns.
2. **For each one: which columns are equality, which are range, which are sort?**
3. **Build the index in that order** (equality → range/sort), then check whether an existing index
   already covers it as a prefix.

**Principles by name**

- **Data independence** (relational model): an index changes *speed*, never *results*. That's why
  you can add or drop one in production without touching application code.
- **Measure, don't guess:** `EXPLAIN ANALYZE` before and after. An index you can't show in a plan
  is an assumption.
- **YAGNI / KISS:** don't index speculatively. Each index costs writes, space and HOT updates.
  Index the queries you have, and check `pg_stat_user_indexes.idx_scan` for ones nobody uses.
- **DRY at the schema level:** a `(a, b)` index makes a separate `(a)` index redundant. Drop
  duplicates instead of piling them up.
- **Sargable predicates as separation of concerns:** keep the indexed column bare in `WHERE`, and do
  transformations on the *parameter* side (compute the date range in code), not on the column.

**The exact sentences to say**

- "Before adding an index I'd check the plan with `EXPLAIN ANALYZE` to confirm it's a Seq Scan
  filtering out most rows. Then I'd add it and verify the plan changed."
- "For this query I'd use a composite index on `(user_id, created_at)`: equality column first,
  then the range and sort column. That way one index handles the filter *and* the `ORDER BY`, so
  there's no sort node."
- "I'd drop the standalone `user_id` index. The composite covers it through the leftmost prefix."
- "This column is only 4 distinct values, so a B-tree on it won't help. The planner will pick a Seq
  Scan. If one value is rare and queried often, I'd use a partial index on just that value."
- "On a live table I'd build it with `CREATE INDEX CONCURRENTLY` so writes aren't blocked."
- "Postgres doesn't index foreign keys automatically, so I'd index `orders.customer_id`. Otherwise
  joins, and deletes on `customers`, have to scan `orders`."

**What you deliberately did NOT do**

- Didn't index every column "just in case" (YAGNI: each one taxes every write).
- Didn't add an index on a low-cardinality column like `status` or a boolean, except as a partial
  index on the rare value.
- Didn't reach for exotic types (GIN, BRIN) when a B-tree fits the operator being used.

---

## 🗣️ Keywords to say

- **Selectivity / cardinality**: what fraction of rows a filter matches, and how many distinct
  values a column has. High selectivity (few matches) is when an index pays off.
- **Sequential scan vs index scan vs bitmap heap scan vs index-only scan**: the four access paths in
  `EXPLAIN`.
- **Cost-based planner, statistics, `ANALYZE`**: how Postgres decides; stale stats cause bad plans.
- **Random vs sequential I/O (`random_page_cost`)**: why big result sets prefer a Seq Scan.
- **Composite index, leftmost prefix**: column order matters; the index serves any prefix of its
  columns.
- **Sargable**: a predicate that can use an index (bare column vs function of the column).
- **Covering index (`INCLUDE`), index-only scan, visibility map**: answering from the index alone.
- **Partial index, expression index**: index a subset of rows, or a computed value (the function
  must be `IMMUTABLE`).
- **ctid / TID, heap**: the row pointer and the unordered table it points into.
- **HOT updates, write amplification**: the hidden write cost of extra indexes.
- **`CREATE INDEX CONCURRENTLY`**: building without blocking writes.
- **`pg_stat_user_indexes.idx_scan`**: how to find unused indexes to drop.

---

## 🎯 How it's asked in interviews

**Common phrasings, all the same question underneath:**

- "What is an index and how does it work?" / "How does a database find a row fast?"
- "This query is slow. How would you fix it?" (and they show you a query on a big table)
- "Why isn't Postgres using my index?"
- "How would you index a table for this API endpoint?" (a feed, a search, a filtered list)
- "What's the downside of adding indexes?" / "Why not index every column?"
- "Explain B-tree vs hash index." / "When would you use GIN?"
- In system design: "Your users table has 100M rows and login is slow. What do you do?"

**Follow-up ladder (each answer earns the next question):**

1. What's an index? → a sorted structure mapping values to row pointers, B-tree by default.
2. How does a B-tree work? → balanced, shallow, sorted linked leaves, O(log n), serves ranges and
   sorting.
3. Index for `WHERE a = ? AND b > ? ORDER BY b`? → composite `(a, b)`, equality first.
4. Would `(b, a)` work? → no, or poorly: the range on the leading column breaks the use of `a`.
   Explain the leftmost prefix.
5. I added the index and it's still not used. Why? → selectivity, stale stats, a function on the
   column, a type mismatch, `LIKE '%x'`.
6. What does it cost? → write amplification, space, HOT, locks during build → `CONCURRENTLY`.
7. Can you avoid touching the table at all? → covering index plus index-only scan plus visibility
   map / VACUUM.

**Traps & gotchas**

- **"Indexes always make queries faster."** False. Unselective filters, tiny tables and bulk reads
  are faster with a Seq Scan, and every index slows writes.
- **Foreign keys are not auto-indexed in Postgres.** Primary keys and `UNIQUE` constraints create
  indexes. `REFERENCES` does not.
- **`WHERE lower(email) = …`, `WHERE created_at::date = …`, `WHERE id + 0 = …`** all bypass a plain
  index.
- **`LIKE '%term%'`** can't use a B-tree. It needs a trigram GIN index (`pg_trgm`) or full-text
  search.
- **Column order in a composite index** is not cosmetic: `(a, b)` ≠ `(b, a)`. (Postgres 18's skip
  scan softens this only when the leading column has very few distinct values. Don't design around
  it.)
- **Indexing a low-cardinality column** (gender, boolean, status) rarely helps, except as a partial
  index on a rare value (`WHERE status = 'failed'`).
- **Plain `CREATE INDEX` on a busy production table blocks writes** for the whole build.
- **NULLs:** Postgres B-trees *do* store NULLs, so `IS NULL` can use an index (unlike some other
  databases).

**Model answer sketch: "This endpoint is slow: `SELECT * FROM events WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`."**

1. **Measure first:** "I'd run `EXPLAIN ANALYZE`. I expect a Seq Scan with a large *Rows Removed by
   Filter*, plus a Sort node."
2. **Design from the query:** "`user_id` is equality, `created_at` is the sort. So a composite index
   on `(user_id, created_at)`. One index serves the filter *and* returns rows already ordered, so
   the Sort disappears and the `LIMIT` stops after 20 rows."
3. **Ship it safely:** "`CREATE INDEX CONCURRENTLY` so production writes aren't blocked. Then
   re-run `EXPLAIN ANALYZE` to confirm an Index Scan Backward with no Sort."
4. **Tidy and weigh the cost:** "If there's already a standalone `user_id` index, the composite
   makes it redundant, so I'd drop it to save write cost. And if the endpoint only needs two or
   three columns, I could `INCLUDE` them for an index-only scan, though that's a trade-off against a
   bigger index."
5. **Show judgement:** "I wouldn't add anything else speculatively. I'd watch `idx_scan` in
   `pg_stat_user_indexes` to make sure the index is actually used."

---

## 🔗 Linked concepts

- [The Relational Model](../../POSTGRES/00_FOUNDATIONS/001-the-relational-model.md): where *data
  independence* comes from, the reason an index can change speed but never results. It also
  explains why the optimizer is free to choose an access path at all.
- **Query planning & `EXPLAIN`** *(note coming)*: reading plans is the skill behind every index
  answer.
- **MVCC & VACUUM** *(note coming)*: why index-only scans depend on the visibility map, and how HOT
  updates work.

---

## 🧠 Rapid-fire Q&A

**1. What's the default index type in Postgres, and which operators does it support?**
B-tree. It supports `=`, `<`, `<=`, `>`, `>=`, `BETWEEN`, `IN`, `IS NULL`, and it can satisfy
`ORDER BY`. With `C` collation or `text_pattern_ops` it also supports prefix `LIKE 'abc%'`.

**2. Why is a B-tree lookup fast even on millions of rows?**
It's balanced and has very high fan-out (hundreds of keys per 8 KB page), so the tree is typically
only 3–4 levels deep. A lookup reads a few pages instead of thousands.

**3. You added an index but `EXPLAIN` still shows a Seq Scan. List the likely reasons.**
The filter isn't selective (it matches a large share of rows), the table is tiny, statistics are
stale (run `ANALYZE`), the column is wrapped in a function or cast, there's a type mismatch between
the column and the parameter, it's a `LIKE '%…'` pattern, or the query doesn't use the index's
leading column.

**4. Index `(a, b)`: which of these can use it: `WHERE a = 1`, `WHERE b = 2`, `WHERE a = 1 AND b > 5`, `WHERE a > 1 AND b = 2`?**
`a = 1`: yes. `b = 2`: generally not efficiently, since there's no leading column (Postgres 18's skip
scan can help only if `a` has very few distinct values). `a = 1 AND b > 5`: yes, fully (equality then
range). `a > 1 AND b = 2`: only the `a > 1` part narrows the range of the index that gets scanned.
After a range on the leading column, `b` is no longer in one sorted run, so `b = 2` is checked
against each index entry in that range instead of being used to jump to it.

**5. What's the difference between an Index Scan and a Bitmap Heap Scan?**
An Index Scan fetches heap rows one by one in index order, which is good for few rows or when order
matters. A bitmap scan first collects all matching row locations, then reads the heap pages in
physical order, each page once. That's better for a moderate number of rows because it avoids random
back-and-forth I/O.

**6. What is an index-only scan, and why might it still read the heap?**
It answers the query from the index alone because every needed column is in the index. It still
reads the heap for pages not marked all-visible in the visibility map, since MVCC visibility lives in
the heap. Regular VACUUM keeps the visibility map current.

**7. Why not index every column?**
Every index slows every `INSERT`, many `UPDATE`s (it can disable HOT updates) and `DELETE` cleanup.
It also uses disk and memory, and adds planning work. Unused indexes are pure cost.

**8. Does Postgres index foreign keys automatically?**
No. Only primary keys and unique constraints get automatic indexes. Index the referencing column
yourself if you join on it or delete from the parent table.

**9. What happens if you run plain `CREATE INDEX` on a busy production table?**
It takes a lock that blocks inserts, updates and deletes until the build finishes, which can be
minutes on a big table. Use `CREATE INDEX CONCURRENTLY`. It's slower, can't run inside a
transaction, and leaves an `INVALID` index to drop if it fails.

**10. When would you use a partial index?**
When queries consistently target a small, well-defined subset of rows, e.g. `WHERE status =
'pending'` in a jobs table where most rows are done. The index is smaller, cheaper to maintain and
faster to scan.

**11. Design question: why did you put `user_id` before `created_at` in the composite index?**
The query filters `user_id` by equality and filters and sorts by `created_at`. With equality first,
all of one user's rows sit together in the index, already sorted by time. So the index handles the
filter, the range and the `ORDER BY` in one pass. Reversed, the user's rows would be scattered
across the time range.

**12. How do you find indexes you can drop?**
Query `pg_stat_user_indexes` for indexes with `idx_scan = 0` over a representative period (check
replicas too, since stats are per server), and look for indexes that are a leftmost prefix of
another index.

---

## ✅ Cheat lines

- "An index is a sorted map from values to row pointers. It changes speed, never results."
- "Indexes win on **selective** filters. For big result sets a Seq Scan is cheaper, and the planner
  knows it."
- "Composite index: **equality first, then range/sort**. It serves any leftmost prefix."
- "Keep the column bare in `WHERE` (sargable), or build an expression index to match."
- "Every index taxes writes, so measure with `EXPLAIN ANALYZE`, build `CONCURRENTLY`, and drop the
  unused ones."
