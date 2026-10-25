# Interview Prep Hub

A browser reading book for the whole `INTERVIEW_PREP/` notebook. Each subject (Postgres, React, DSA)
is a tab. A problem page puts the statement, the examples, the hints and an editor on one screen,
so you don't need to switch between platforms.

**Nothing is copied.** Every page is rendered from the subject folders' markdown at build time. If
you edit `POSTGRES/LEETCODE_SQL_50/02-basic-joins.md`, the hub hot-reloads it.

## Run it

```bash
cd hub && npm install
```

```bash
npm run dev
```

Then open http://localhost:5180.

## What's in it today

**Postgres → LeetCode SQL 50**, all 50 problems:

- **Problem list** with search, Easy/Medium/Hard and solved/todo filters, a 14-day study-plan
  filter, and a progress meter.
- **Problem page.** The left pane is for reading: the problem, the example, then "what it's really
  testing", "how to relate", the hint ladder (one hint at a time), extra notes and the solution.
  The right pane is a workbench: a SQL editor with Postgres highlighting and table/column
  autocomplete, a **Tables** tab showing the live seed rows, and an **Expected output** tab.
- **Practice / Read toggle.** Practice hides every aid, as an interview would. Read opens
  everything for revision. The toggle is remembered between visits.
- **Real Postgres in the tab.** PGlite (Postgres 18 compiled to WASM) loads the same seed as the
  CLI playground (`POSTGRES/playground/seed/04-leetcode-sql50.sql`). Each run goes inside a
  transaction that is rolled back, so a `DELETE` can't damage the data.
- **Grading.** The **last** result your script returns is compared with the reference solution's
  output. Numbers compare by value (`2` = `2.00`). Row order only matters if you choose to care
  about it: same rows in a different order is accepted, with a note. For DML-only problems (196),
  the table contents after your script are graded.
- **Progress** (solved, hints used, whether you peeked) and **one draft per problem** are saved in
  this browser's localStorage. A private window starts empty.
- **Timer** on every problem, for the day-13 timed drill (it turns red after 10 minutes).
- **Keys:** `⌘/Ctrl + Enter` runs the query. `Alt + ←/→` moves to the previous/next problem.

**React** and **DSA** are placeholder tabs for now.

## Layout

```
hub/
  scripts/check-sql50.ts        parses all 50 problems + runs every reference solution on the seed
  src/
    App.tsx                     shell: subject tabs + hash router
    subjects/registry.tsx       one entry per subject (add a subject here)
    subjects/postgres/
      sql50/parse.ts            markdown → { statement, example, hints, solution, … }
      sql50/data.ts             loads LEETCODE_SQL_50/*.md + README (study plan, guide)
      pglite.ts, db.ts          the in-browser Postgres, seeded once
      runner.ts                 run in a rolled-back transaction, grade against the reference
      ProblemPage.tsx           reading pane + Workbench.tsx (editor, results, tables)
```

## Keeping the notes parseable

The parser cuts each problem at its bold labels, so a new problem needs the same shape as the
others: `## <id> · <title>`, `**Difficulty:** … · **Schema:** \`lc<id>\``, `**Problem.**`,
`**Example.**`, `**What it's really testing:**`, `**How to relate:**`, `**Hint ladder.**` (a
numbered list), and the solution inside `<details>`. After editing a section, run:

```bash
npm run check:sql50
```

It checks that every problem parses, that each reference solution runs on the seed, and that every
alternative solution returns the same rows as the first one.
