# Interview Prep

Deep-dive notes for technical interviews — organized by subject. Each topic is a first-principles lesson written to be **understood**, not memorized: why it exists, what it is, how it works under the hood, a real-life analogy for how to *think* about it, the keywords to say in the room, how the question actually gets asked, common traps/follow-ups, and links to related topics.

## Subjects

| Folder | Covers |
|--------|--------|
| `JS/` → [`../playground/JS/`](../playground/JS/) | JavaScript — closures, `this`, call/apply/bind, promises, event loop, etc. Notes + runnable code are co-located under the repo-root `playground/JS/`. |
| `REACTJS/` | React — rendering, hooks, reconciliation, performance, patterns (with runnable setups where needed). |
| `NODEJS/` | Node.js — event loop, streams, clustering, modules, async patterns. |
| `POSTGRES/` | PostgreSQL — indexing, transactions, isolation, query planning. |
| `REDIS/` | Redis — data structures, persistence, caching patterns, pub/sub. |
| `DOCKER/` | Containers, images, layers, networking, compose. |
| `KUBERNETES/` | Pods, deployments, services, scheduling, scaling. |
| `TESTING/` | Unit/integration/e2e, mocking, TDD, test strategy. |
| `FRONTEND_FUNDAMENTALS/` | Browser, rendering, network, performance, accessibility. |
| `SYSTEM_DESIGN/` | HLD (scalability, caching, queues) and LLD (OOD, patterns, code). |

> Subject folders are created on demand as topics arrive.

## Conventions

- **One topic = one note file**, named `NNN-topic-slug.md` (e.g. `001-promises.md`), numbered in the order added, sitting at the subject-folder root.
- Each subject folder has its own `README.md` index linking every topic.
- Topics cross-link with relative Markdown links.
- **Code-heavy subjects have ONE shared runnable app** (e.g. `REACTJS/playground/`), not a new setup per problem. Each problem is a component/module under that app's `problems/` folder; the note links into it. Install once, find everything in a predictable place.
- Every note carries the interview craft layer — how it's decomposed, the named principles (DRY/SOLID/etc.), the keywords to say, and how the question is asked — not just a working answer.

## How to use

Give a topic as **Subject + Topic** (e.g. "JS → Promises") and it gets added as a full deep-dive here.
