-- Interview note: ../../../001-indexes.md
-- Run:  npm run q -- indexes
--
-- events has 200,000 rows and only a primary-key index. Watch each plan change
-- as indexes are added. Read EXPLAIN bottom-up: the innermost node runs first.

-- 1) No index on user_id: Postgres must read every row (Seq Scan) and throw most away.
EXPLAIN ANALYZE
SELECT * FROM events WHERE user_id = 42;

-- 2) Add a B-tree index on the filtered column.
CREATE INDEX idx_events_user_id ON events (user_id);

-- Same query: now an index lookup (Bitmap or Index Scan) touches ~40 rows, not 200,000.
EXPLAIN ANALYZE
SELECT * FROM events WHERE user_id = 42;

-- 3) Low selectivity: three of the four kinds = 75% of the table. Using the index would
--    mean 150,000 random jumps into the table; one sequential pass is cheaper, so the
--    planner IGNORES the index here — on purpose. An index helps only selective filters.
CREATE INDEX idx_events_kind ON events (kind);
EXPLAIN
SELECT * FROM events WHERE kind IN ('click', 'add_to_cart', 'purchase');

--    Compare: a value the statistics say is rare (here: no rows at all) -> index used.
EXPLAIN
SELECT * FROM events WHERE kind = 'refund';

-- 4) Composite index (user_id, created_at): one index answers "this user's events,
--    newest first" — equality on the first column, range/sort on the second.
CREATE INDEX idx_events_user_created ON events (user_id, created_at);
EXPLAIN
SELECT * FROM events
WHERE user_id = 42 AND created_at >= '2026-03-01'
ORDER BY created_at DESC
LIMIT 10;

-- 5) Leftmost-prefix rule. The composite B-tree is sorted by user_id first, then by
--    created_at inside each user. So it serves a filter on user_id alone...
DROP INDEX idx_events_user_id;
EXPLAIN
SELECT * FROM events WHERE user_id = 42;

--    ...but NOT a filter on created_at alone (that column is only sorted within each
--    user, not globally), so this falls back to a Seq Scan.
EXPLAIN
SELECT * FROM events WHERE created_at >= '2026-03-01' AND created_at < '2026-03-02';

--    A query pattern that leads with created_at needs its own index.
CREATE INDEX idx_events_created ON events (created_at);
EXPLAIN
SELECT * FROM events WHERE created_at >= '2026-03-01' AND created_at < '2026-03-02';

-- 6) Wrapping the column in a function hides it from the index: the index stores
--    created_at values, not "created_at converted to a date". Seq Scan again.
EXPLAIN
SELECT count(*) FROM events WHERE (created_at AT TIME ZONE 'UTC')::date = '2026-03-01';

--    Fix A (preferred): rewrite as a range on the bare column ("sargable"). Same answer,
--    and the existing idx_events_created serves it.
EXPLAIN
SELECT count(*) FROM events WHERE created_at >= '2026-03-01' AND created_at < '2026-03-02';

--    Fix B: an expression index on exactly the expression the query uses.
--    (Extra parentheses are required around an expression in CREATE INDEX.)
CREATE INDEX idx_events_day ON events (((created_at AT TIME ZONE 'UTC')::date));
EXPLAIN
SELECT count(*) FROM events WHERE (created_at AT TIME ZONE 'UTC')::date = '2026-03-01';

-- 7) Covering index + index-only scan: every column the query needs is in the index,
--    so the table (heap) is never visited. VACUUM updates the visibility map that
--    makes this possible.
CREATE INDEX idx_events_user_cover ON events (user_id) INCLUDE (kind);
VACUUM events;
EXPLAIN
SELECT user_id, kind FROM events WHERE user_id = 42;

-- 8) Partial index: index only the rows you query. Purchases are 25% of rows, so
--    this index is about a quarter of the size of a full one.
CREATE INDEX idx_events_purchases ON events (created_at) WHERE kind = 'purchase';
EXPLAIN
SELECT * FROM events WHERE kind = 'purchase' AND created_at >= '2026-04-01' AND created_at < '2026-04-02';

-- 9) Indexes are not free: each one is a separate structure on disk that every
--    INSERT/UPDATE must also maintain.
SELECT indexrelname AS index_name, pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE relname = 'events'
ORDER BY pg_relation_size(indexrelid) DESC;

SELECT pg_size_pretty(pg_relation_size('events')) AS table_size;
