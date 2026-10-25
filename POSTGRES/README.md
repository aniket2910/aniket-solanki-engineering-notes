# 🐘 PostgreSQL — From First Principles

A self-contained textbook for learning PostgreSQL deeply: not just how to write queries, but why
relational databases look the way they do, how Postgres stores and finds your data, and how it keeps
that data correct when many users write at once. Every chapter starts from the history (the problem
someone was facing and how they reasoned about it) and builds down to the mechanism and runnable
code.

Every lesson that has queries comes with a matching file in the shared **query playground**, which
runs real Postgres from `npm install` with no server or Docker needed:
[`INTERVIEW_PREP/POSTGRES/playground/`](../INTERVIEW_PREP/POSTGRES/playground/README.md).

```bash
cd INTERVIEW_PREP/POSTGRES/playground && npm install
```

```bash
npm run q -- relational-model
```

**This track vs the interview notes.** This folder teaches Postgres from scratch, history first, as
a textbook. [`INTERVIEW_PREP/POSTGRES/`](../INTERVIEW_PREP/POSTGRES/README.md) takes a topic you
already understand and sharpens it for the interview room. Both use the same playground.

---

## 🗺️ The Roadmap

Work through the chapters in order. Each one builds on the ones before it.

| # | Chapter | What you'll understand | Status |
|---|---------|------------------------|--------|
| 00 | **[Foundations](./00_FOUNDATIONS/README.md)** | Why databases are relational (Codd, 1970), how Postgres descends from Ingres, and how a Postgres server is built (processes, memory, files) | 🟡 In progress |
| 01 | **SQL Core** | `SELECT` from the inside out: logical evaluation order, joins of every kind, grouping and aggregation, subqueries, CTEs, window functions | ⬜ Planned |
| 02 | **Data Modeling** | Keys and constraints, normalization (1NF → BCNF) and when to denormalize, Postgres data types, `jsonb`, arrays, enums | ⬜ Planned |
| 03 | **Storage Internals** | Pages and the heap, tuple layout, TOAST, the free space map and visibility map: what a row actually looks like on disk | ⬜ Planned |
| 04 | **Indexes** | B-tree from scratch, then Hash, GIN, GiST, BRIN; composite, partial, expression and covering indexes; the cost of an index | ⬜ Planned |
| 05 | **Query Planning** | How the planner turns SQL into a plan: statistics, cost model, scan and join algorithms, reading `EXPLAIN ANALYZE` | ⬜ Planned |
| 06 | **Transactions & MVCC** | ACID, how Postgres keeps multiple versions of a row (`xmin`/`xmax`), snapshots, isolation levels and their anomalies, `VACUUM` | ⬜ Planned |
| 07 | **Concurrency & Locking** | Row and table locks, `SELECT … FOR UPDATE`, `SKIP LOCKED` job queues, deadlocks, advisory locks | ⬜ Planned |
| 08 | **Durability & WAL** | Write-ahead logging, checkpoints, crash recovery, `fsync`, point-in-time recovery | ⬜ Planned |
| 09 | **Scaling Postgres** | Streaming and logical replication, read replicas, partitioning, connection pooling (PgBouncer), when to shard | ⬜ Planned |
| 10 | **Postgres from Node.js** | `node-postgres` and pools, parameterized queries vs SQL injection, transactions in code, migrations, ORMs vs query builders | ⬜ Planned |
| 11 | **Operating Postgres** | Roles and privileges, row-level security, backups, monitoring (`pg_stat_*`), configuration tuning | ⬜ Planned |

---

## 📈 How the chapters connect

- **00 → 02** are the model: what a relational database *is* and how to shape data for it.
- **03 → 05** are one story: how a row is stored, how an index finds it, and how the planner decides
  between them. Read them together, since indexes make little sense without storage, and plans make
  little sense without indexes.
- **06 → 08** are the other story: how Postgres stays correct when many transactions run at once,
  and when the machine crashes.
- **09 → 11** are production: scaling, using Postgres from your Node.js stack, and running it.

## 🎯 Goal of this track

By the end you should be able to predict what Postgres will do with a query before you run it, and
explain *why*: from how the row is stored on disk, to the plan the optimizer picks, to what another
transaction sees while yours is running.
