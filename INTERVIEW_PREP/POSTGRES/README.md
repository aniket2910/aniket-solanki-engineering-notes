# PostgreSQL — Interview Prep

Interview-ready notes for Postgres: indexes, query plans, transactions, isolation, locking, and the
other topics interviewers dig into. Each note is self-contained and written for the interview room,
with an analogy, the keywords to say, the principles involved, how the question gets asked, and a
rapid-fire Q&A.

All runnable SQL lives in **one shared playground**, [`playground/`](playground/README.md). It runs
real Postgres 18 via PGlite: `npm install` and go, no server or Docker. Each note has a matching file
at `playground/queries/interview/NNN-<slug>.sql`.

Learning Postgres from scratch, history first? See the textbook track in
[`POSTGRES/`](../../POSTGRES/README.md). It uses the same playground.

## Run the playground

```bash
cd playground && npm install
```

```bash
npm run q -- indexes
```

`npm run list` shows every query file, `npm run repl` opens an interactive prompt, and
`queries/scratch.sql` is yours to play in.

## Notes

| ID | Topic | One-line hook | Runnable |
|----|-------|---------------|----------|
| 001 | [Indexes](001-indexes.md) | Sorted map from values to row pointers. Wins only on selective filters; composite = equality first, then range/sort; every index taxes writes. | [`npm run q -- indexes`](playground/queries/interview/001-indexes.sql) |

## Problem sets

| Set | What it is | Runnable |
|-----|------------|----------|
| [LeetCode SQL 50](LEETCODE_SQL_50/README.md) | All 50 problems of LeetCode's SQL study plan, in Postgres: problem + example, what it's really testing, signal words → concept, a 3-step hint ladder, hidden solution. Includes a 14-day study plan. | [`npm run q -- leetcode/01`](playground/queries/leetcode/) … `07` |

🎯 **Goal:** explain what Postgres will do with a query and why, design the schema and indexes for a
real endpoint, and talk through the trade-offs the way a senior engineer would.
