# Postgres Playground

**One** sandbox for every query in the Postgres notebook. It runs real PostgreSQL (via
[PGlite](https://pglite.dev), Postgres compiled to WebAssembly) inside Node, so there is no
server to install, no Docker, and no password. Each run starts from a fresh, seeded database,
so you can `DROP`, `DELETE` or `UPDATE` anything and the next run is clean again.

## Run it

```bash
npm install                    # first time only
npm run list                   # list every query file
npm run q -- indexes           # run the file whose name contains "indexes"
npm run q -- scratch           # run your free-play file, queries/scratch.sql
npm run repl                   # interactive prompt (\dt, \d <table>, \q)
```

`npm run q` prints every statement followed by its result, psql-style. A failing statement prints
its error and the run carries on, because some lessons fail on purpose (a broken constraint, say).

## The database

A tiny online shop, small enough to read every row, plus one big table for performance work.

| Table | Rows | Use it for |
|-------|------|------------|
| `customers` | 8 | Filtering, NULLs (Kabir has no city), LEFT JOIN (Dev never ordered) |
| `products` | 10 | Grouping by category, prices (Green Tea is never ordered) |
| `orders` | 12 | Joins, statuses, dates |
| `order_items` | 18 | Composite primary key, many-to-many, revenue math |
| `events` | 200,000 | Indexes, `EXPLAIN`, query plans (only a primary key at the start) |
| `lc<number>.*` | small | LeetCode SQL 50: one schema per problem (`lc1757`, `lc185` …) with LeetCode's example rows. `SET search_path TO lc185;` then use the plain table names |

The schema and data live in [`seed/`](seed/). The files run in name order on every start.

## Structure

```
playground/
├── package.json, .gitignore
├── seed/                       # schema + data, loaded fresh on every run
│   ├── 01-schema.sql
│   ├── 02-shop-data.sql
│   ├── 03-events.sql
│   └── 04-leetcode-sql50.sql   # one schema per LeetCode SQL 50 problem
├── queries/
│   ├── scratch.sql             # yours: write anything, run `npm run q -- scratch`
│   ├── learn/                  # one file per lesson in the POSTGRES/ textbook track
│   ├── leetcode/               # SQL 50 solutions, one file per section (spoilers)
│   └── interview/              # one file per note in INTERVIEW_PREP/POSTGRES/
└── src/                        # the runner (never needs editing)
    ├── db.js                   # creates + seeds the in-memory database
    ├── run.js                  # runs a .sql file statement by statement
    ├── repl.js                 # interactive prompt
    ├── split.js                # splits SQL into statements (strings/comments/$$ safe)
    └── format.js               # psql-style result tables
```

## Add a query file

1. **Interview note:** `queries/interview/NNN-<slug>.sql`, with the same number and slug as `../NNN-<slug>.md`.
2. **Textbook lesson:** `queries/learn/<chapter>-<lesson>-<slug>.sql`, e.g. `00-001-relational-model.sql`.
3. Start the file with a comment linking back to its note. `npm run list` picks it up automatically.

Need more data for a lesson? Add a new numbered file to `seed/` (e.g. `04-reviews.sql`). Don't
put it in a query file, because every lesson should start from the same database.

## Query files

| File | Note |
|------|------|
| [`interview/001-indexes.sql`](queries/interview/001-indexes.sql) | [001 — Indexes](../001-indexes.md) |
| [`leetcode/01-select.sql`](queries/leetcode/01-select.sql) … [`07-advanced-strings-regex.sql`](queries/leetcode/07-advanced-strings-regex.sql) | [LeetCode SQL 50](../LEETCODE_SQL_50/README.md) |
| [`learn/00-001-relational-model.sql`](queries/learn/00-001-relational-model.sql) | [00·001 — The Relational Model](../../../POSTGRES/00_FOUNDATIONS/001-the-relational-model.md) |

## Want a real server and `psql` instead?

PGlite is real Postgres, but it is single-connection, so it can't demo two sessions fighting over
a lock. For lessons that need that (concurrency, isolation levels), use Docker:

```bash
docker run --rm --name pg-playground -e POSTGRES_PASSWORD=postgres -p 5432:5432 \
  -v "$PWD/seed:/docker-entrypoint-initdb.d" postgres:18
```

```bash
docker exec -it pg-playground psql -U postgres
```

The same `seed/` files load automatically on first start, so the data matches this playground.
