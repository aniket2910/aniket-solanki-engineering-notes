# DBS — Frontend HackerEarth Test Prep

A focused practice pack for the **DBS Bank frontend developer HackerEarth online assessment**. Read all of it before the test. Everything here is problems + worked solutions + **expected output**, so you can self-quiz: cover the answer, predict, then check.

## What the test actually is (researched)

DBS's frontend HackerEarth screen (the "Hacktron"-style hiring challenge) is a **timed MCQ-heavy round**, historically ~1 hour, with **~20–40 questions weighted hard toward JavaScript**, plus a smaller slice of React / HTML / CSS / web platform, and sometimes **1–2 short coding problems**.

The signature of this test is **output-prediction "trick" questions** — a snippet is shown, you pick what it prints. They lean on:

- **JavaScript core:** closures, `this` binding, hoisting/TDZ, `var` vs `let`, type coercion (`==`, `+`, truthiness), prototypes & prototype chain, `splice`/`slice` and other array methods.
- **Async:** event loop, microtask vs macrotask ordering (`setTimeout` vs `Promise.then`), promise chaining, `async/await`.
- **React:** Virtual DOM & reconciliation, keys, lifecycle vs hooks, `useState`/`useEffect` behavior, controlled inputs, React vs Angular.
- **HTML/Web:** `DOCTYPE`, `async` vs `defer`, Shadow DOM, SPA render flow, `localStorage` vs `sessionStorage` vs cookies, HTTP headers/status.
- **CSS:** specificity, box model, flexbox, position.
- **Coding:** small JS algorithmic problems (string/array manipulation), occasionally a machine-coding component in longer variants (e.g. build a cart/table/calculator).

## How to use this pack

1. Read `01` → `06` in order. For every output question, **predict before reading the answer**.
2. Time yourself: the real test gives you roughly **60–90 seconds per MCQ**. If you can't answer in that window, it's a gap to close.
3. The "Why" under each answer is the part that transfers — trick questions recycle the same 10–12 mechanics.

## Two possible test shapes — prepare for both

1. **MCQ-heavy screen** (the classic Hacktron form): output-prediction + concept MCQs → files `01`–`05`.
2. **Machine-coding round** (what the WD88450 JD points to: React 17/18/19, TS, Jest/RTL, a11y): you build a component or utility until a Jest/RTL spec passes, graded on tests **and** SonarQube quality → files `06`–`08`.

The frozen JD and the command-center DBS hub lean toward **#2**, so the component builds in `07` are the highest-value practice. Do not skip them.

## Index

| File | Covers | Count |
|------|--------|-------|
| [`01-javascript-output-mcqs.md`](01-javascript-output-mcqs.md) | The signature "what prints?" trick questions | 25 |
| [`02-javascript-concepts-mcqs.md`](02-javascript-concepts-mcqs.md) | Closures, `this`, prototypes, coercion, array methods | 20 |
| [`03-async-event-loop-mcqs.md`](03-async-event-loop-mcqs.md) | Event loop, promises, `async/await`, `setTimeout` ordering | 15 |
| [`04-react-mcqs.md`](04-react-mcqs.md) | Virtual DOM, hooks, keys, lifecycle, React vs Angular | 18 |
| [`05-html-css-web-mcqs.md`](05-html-css-web-mcqs.md) | DOCTYPE, async/defer, storage, Shadow DOM, specificity, flexbox | 20 |
| [`06-coding-problems.md`](06-coding-problems.md) | Short JS coding problems with solution + expected output | 8 |
| [`07-react-component-builds.md`](07-react-component-builds.md) | **Machine-coding React builds** (tabs, accordion, autocomplete, table, modal, star rating, todo, carousel, infinite scroll, form, stopwatch) — full accessible solutions | 11 |
| [`08-vanilla-js-builds.md`](08-vanilla-js-builds.md) | throttle, deepClone, isEqual, Promise.all polyfill, fetchWithRetry, event emitter, curry, groupBy, pure-JS table | 9 |

> The component builds mirror the task list in the command-center hub: `interviews/2026/SDE2/strong-fit/DBS/hackerearth-jd-questions-and-code-checklist.md`. Pair `07`/`08` with that file's **Tier 0–7 code-care checklist** — clean, edge-safe, accessible code is what earns the offer after the tests go green.

## Test-day strategy

- **Flag and move.** MCQ tests reward finished questions, not stuck ones. Never burn 3+ minutes on one trick.
- **Read the whole snippet first.** The trap is usually one line: a stray `var`, a missing `return`, a `==` vs `===`, a hoisted function, a `this` inside a callback.
- **For "what prints" questions, trace the event loop explicitly:** sync code first → microtasks (promises) → macrotasks (`setTimeout`).
- **Coercion questions:** memorize the small table in `02`. That single table answers a disproportionate number of questions.
- **Don't overthink React questions** — they're mostly conceptual (Virtual DOM, why keys, why not mutate state), not deep.
