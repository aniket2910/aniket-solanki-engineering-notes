# 00 — Foundations

Before writing serious SQL it helps to know why databases are built the way they are. This chapter
traces that history: from navigational databases, to Codd's relational model, to the research systems
that proved it (System R, Ingres), to Postgres itself. It ends with how a running Postgres server is
put together, so that later chapters on storage, indexes and transactions have something concrete
to attach to.

Queries for each lesson run in the shared playground:
[`INTERVIEW_PREP/POSTGRES/playground/`](../../INTERVIEW_PREP/POSTGRES/playground/README.md).

| ID | Lesson | Key ideas | Playground |
|----|--------|-----------|------------|
| 001 | [The Relational Model](./001-the-relational-model.md) | Navigational databases, Codd 1970, data independence, relations as sets, relational algebra, closure, optimizer freedom, keys, NULL & three-valued logic, where SQL departs from the model | `npm run q -- relational-model` |
| 002 | From Ingres to PostgreSQL *(next)* | Stonebraker's Postgres project, extensibility (user-defined types and functions), POSTQUEL → SQL, Postgres95, the open-source community, what makes Postgres different | — |
| 003 | Anatomy of a Postgres Server *(planned)* | Client/server protocol, the postmaster and one process per connection, shared buffers, WAL, the data directory, your first `psql` session | — |

🎯 **Goal of this chapter:** explain why your data lives in tables and why SQL is declarative, and
describe what happens inside a Postgres server when a query arrives.
