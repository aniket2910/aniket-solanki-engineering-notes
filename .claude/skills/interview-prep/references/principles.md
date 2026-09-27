# Engineering Principles Catalog (for interview notes)

Use this when writing the `🏗️ Code quality & principles applied` and `🗣️ Keywords to say` sections.
The goal is to name the **right** principle for the problem — from a recognized source, not a random
buzzword — and give the reader the crisp sentence to say in the room. Naming the principle *and why
it applies here* is what reads as senior.

Two rules when using this catalog:
1. **Only cite a principle the solution actually demonstrates.** A dropped "SOLID" you can't justify
   hurts more than saying nothing. Tie each to a concrete line of the solution.
2. **Show judgment, not dogma.** The strongest candidates also say what they *didn't* over-engineer
   (KISS/YAGNI). Principles are trade-offs, not commandments.

## Table of contents
- [Universal code-quality principles](#universal-code-quality-principles)
- [SOLID (OOP / LLD)](#solid-oop--lld)
- [React / frontend](#react--frontend)
- [Databases (Postgres, SQL)](#databases-postgres-sql)
- [Backend / distributed systems / Node](#backend--distributed-systems--node)
- [Testing](#testing)
- [Common code smells (Refactoring Guru)](#common-code-smells-refactoring-guru)
- [Quick map: subject → principles to reach for](#quick-map-subject--principles-to-reach-for)

---

## Universal code-quality principles

**DRY — Don't Repeat Yourself.** Every piece of knowledge has one authoritative representation.
*When it applies:* you spot the same logic/value in two places. *Say:* "I'll pull this into one
place so there's a single source of truth — that's DRY." *Caveat:* two lines that merely look alike
aren't duplication; don't abstract prematurely.

**KISS — Keep It Simple.** Prefer the simplest thing that works. *When it applies:* you're tempted by
a clever/generic solution. *Say:* "The simple version covers every requirement, so I'll keep it
simple rather than add machinery we don't need."

**YAGNI — You Aren't Gonna Need It.** Don't build for hypothetical future needs. *When it applies:*
adding config/abstraction for a case nobody asked for. *Say:* "I'll build exactly what's asked; I can
generalize later if a real need shows up — YAGNI."

**Separation of Concerns (SoC).** Keep distinct responsibilities in distinct places. *When it
applies:* logic mixed with presentation or data access. *Say:* "I keep styling in CSS, data-fetching
in a hook/service, and rendering in the component — separation of concerns." (No inline styles is a
direct instance of this.)

**Single Responsibility (unit level).** One function/component/module does one thing. *When it
applies:* a unit grows past ~120 lines or does several jobs. *Say:* "This is doing two things, so I'll
split it — each piece has one responsibility, easier to test and reuse."

**Single Source of Truth.** One canonical place holds a given state; everything else derives from it.
*When it applies:* the same fact stored twice can drift. *Say:* "I compute this rather than store a
second copy — one source of truth avoids inconsistency."

**Composition over Inheritance.** Build behavior by composing small pieces, not deep class trees.
*When it applies:* tempted to subclass; in React, wrapping/among components. *Say:* "I compose small
components/functions instead of inheriting — more flexible, less coupling."

**Law of Demeter (least knowledge).** A unit talks only to its immediate collaborators (`a.b()` not
`a.getX().getY().doZ()`). *When it applies:* long chains reaching through objects. *Say:* "I avoid
reaching through objects; each layer exposes what the caller needs."

**Fail fast / guard clauses.** Validate and return early instead of nesting. *When it applies:* deeply
nested `if`s. *Say:* "Guard clauses up top keep the happy path flat and readable."

---

## SOLID (OOP / LLD)

Reach for these in **LLD / object-oriented design** rounds (design a parking lot, a rate limiter, a
notification service).

- **S — Single Responsibility.** A class has one reason to change. *Say:* "Splitting persistence from
  business logic so each has one reason to change."
- **O — Open/Closed.** Open for extension, closed for modification (add a subclass/strategy, don't
  edit existing code). *Say:* "New payment types plug in via a common interface — open/closed, no
  touching existing code."
- **L — Liskov Substitution.** Subtypes must be usable wherever the base type is, without surprises.
  *Say:* "Every `Shape` subclass honors the same contract, so callers don't special-case."
- **I — Interface Segregation.** Many small interfaces beat one fat one; don't force clients to depend
  on methods they don't use. *Say:* "I split the interface so a read-only client doesn't depend on
  write methods."
- **D — Dependency Inversion.** Depend on abstractions, not concretions; inject dependencies. *Say:*
  "The service depends on a `Repository` interface, not a concrete DB — easy to test and swap."

---

## React / frontend

- **Controlled component / single source of truth.** State owns the value; UI reflects it. *Say:*
  "Controlled input — state is the source of truth, so validation and derived UI are trivial."
- **Lifting state up.** Shared state lives in the closest common parent. *Say:* "Two siblings need
  this, so I lift it to the parent and pass down."
- **Composition & small components (< ~120 lines).** Split big components; compose. *Say:* "This grew
  past one responsibility, so I extract `<OtpBox>` and compose."
- **Keys for lists.** Stable, unique keys — never array index when the list reorders. *Say:* "Stable
  keys so React's reconciliation tracks identity correctly."
- **Separation: presentation vs container/logic.** Keep dumb UI separate from data/logic (hooks or
  container components). *Say:* "Logic in a `useOtpInput` hook, markup stays presentational."
- **Accessibility as a quality bar.** Semantic HTML, `aria-*`, keyboard support. *Say:* "I add
  `aria-label` and keyboard handling — accessibility is part of done."
- **No inline styles.** CSS files/modules. *Say:* "Styling in CSS, not inline — separation of concerns
  and it scales."

---

## Databases (Postgres, SQL)

- **ACID.** Atomicity, Consistency, Isolation, Durability — the guarantees of a transaction. *When it
  applies:* transactions, money transfers, "will this be consistent under failure?" *Say:* "Wrap both
  updates in one transaction so it's atomic — all or nothing."
- **Isolation levels.** Read Uncommitted → Read Committed → Repeatable Read → Serializable, trading
  concurrency for correctness (dirty/non-repeatable/phantom reads). *Say:* "Repeatable Read prevents
  non-repeatable reads but still allows phantoms unless I go Serializable."
- **Normalization (1NF→3NF).** Remove redundancy so each fact lives once; denormalize deliberately for
  read performance. *Say:* "Normalized to 3NF to avoid update anomalies; I'd denormalize only for a
  measured read hotspot."
- **Indexing.** Speed up reads at write/space cost; know B-tree vs hash, covering, composite,
  selectivity. *Say:* "A composite index on `(user_id, created_at)` covers this query and keeps it
  index-only."
- **CAP / PACELC** (distributed data). *Say:* "Under partition I choose availability with eventual
  consistency here, because the data tolerates staleness."

---

## Backend / distributed systems / Node

- **Idempotency.** The same request applied twice has the same effect once. *When it applies:*
  payments, retries, webhooks, `PUT`/`DELETE`. *Say:* "I use an idempotency key so a retried charge
  doesn't double-bill."
- **Statelessness.** Servers hold no per-client session in memory; state goes to a store/token. *When
  it applies:* horizontal scaling. *Say:* "Stateless nodes so any instance can serve any request and
  we scale horizontally."
- **12-Factor App.** Config in env, stateless processes, logs as streams, dev/prod parity. *Say:*
  "Config via env vars per 12-factor, so the same build runs in every environment."
- **Backpressure / streaming.** Don't buffer unbounded data; stream and respect consumer speed. *Say:*
  "I stream the file and let backpressure pace it instead of loading it all into memory."
- **Graceful error handling & timeouts.** Every I/O can fail; bound it. *Say:* "Every external call
  has a timeout and a fallback — no unbounded waits."
- **Separation: controller / service / repository.** Layered responsibilities. *Say:* "Route →
  service → repository, so business logic is testable without HTTP or DB."

---

## Testing

- **AAA — Arrange, Act, Assert.** Structure every test in three clear phases. *Say:* "Arrange the
  fixture, act on the unit, assert one behavior."
- **FIRST — Fast, Independent, Repeatable, Self-validating, Timely.** Qualities of good unit tests.
  *Say:* "Tests are independent and repeatable — no shared state, no order dependence."
- **Test behavior, not implementation.** Assert outputs/effects, not internals. *Say:* "I test what
  the user observes, so refactors don't break the suite."
- **Test pyramid.** Many unit, fewer integration, few e2e. *Say:* "Most coverage in fast unit tests,
  a thin e2e layer for critical flows."

---

## Common code smells (Refactoring Guru)

Name the smell, then the fix — useful in "how would you improve this code?" rounds.

- **Duplicated code** → extract function/component (DRY).
- **Long method / large class / long component** → extract and compose (SRP).
- **Long parameter list** → pass an object / introduce parameter object.
- **Magic numbers/strings** → named constants.
- **Primitive obsession** → wrap related primitives in a small type.
- **Feature envy** (a method more interested in another object's data) → move the method.
- **Shotgun surgery** (one change touches many files) → consolidate responsibility.
- **God object** (one class knows/does everything) → split by responsibility.

---

## Quick map: subject → principles to reach for

| Subject | First principles to name |
|---------|--------------------------|
| React / frontend | SoC (no inline styles), small components < 120 lines / SRP, composition, single source of truth, controlled components, lifting state, keys, accessibility |
| JavaScript | DRY, KISS, pure functions, single responsibility, immutability |
| LLD / OOP design | SOLID (all five), composition over inheritance, DRY, Law of Demeter |
| Node / backend | statelessness, idempotency, 12-factor, layered (controller/service/repo), backpressure, error handling + timeouts |
| Postgres / SQL | ACID, isolation levels, normalization, indexing, transactions |
| Redis / caching | single source of truth vs cache, TTL/eviction, idempotency, cache-aside pattern |
| Docker / Kubernetes | 12-factor, immutability of images, statelessness, single-responsibility containers |
| Testing | AAA, FIRST, test pyramid, behavior-not-implementation |
| System Design (HLD) | separation of concerns, statelessness, idempotency, CAP, single responsibility per service |

**Sources:** these are standard, widely taught definitions (Clean Code / Robert C. Martin for SOLID
and naming; Refactoring Guru for smells and refactorings; The Pragmatic Programmer for DRY;
the 12-Factor App; database texts for ACID/normalization). Keep definitions accurate — if unsure of a
precise definition, state the crisp common version rather than inventing nuance.
