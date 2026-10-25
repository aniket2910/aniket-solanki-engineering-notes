-- 200,000 deterministic rows (same data every run, so query plans are reproducible).
-- user_id spreads over 5,000 users; kind cycles through 4 values; created_at walks
-- forward one minute per row from 2026-01-01.
INSERT INTO events (user_id, kind, created_at, payload)
SELECT
  (i * 7919) % 5000 + 1,
  (ARRAY['page_view', 'click', 'add_to_cart', 'purchase'])[i % 4 + 1],
  timestamptz '2026-01-01 00:00+00' + i * interval '1 minute',
  jsonb_build_object('session', i / 20, 'device', CASE WHEN i % 3 = 0 THEN 'mobile' ELSE 'desktop' END)
FROM generate_series(1, 200000) AS i;

-- Fresh planner statistics, so EXPLAIN shows realistic estimates from the first query.
ANALYZE;
