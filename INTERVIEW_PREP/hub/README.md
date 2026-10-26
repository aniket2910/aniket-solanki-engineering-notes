# Interview Prep Hub

A browser reading book for the whole `INTERVIEW_PREP/` notebook. Each subject (Postgres, React, DSA)
is a tab. A problem page puts the statement, the examples, the hints and an editor on one screen,
so you don't need to switch between platforms.

**Nothing is copied.** Every page is rendered from the notes' markdown (`INTERVIEW_PREP/POSTGRES/…` and the
repo-root `DSA/` notebook). If you edit a note, the hub hot-reloads it.

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

**DSA → Namaste DSA Sheet**, all 165 problems in the sheet's order:

- **Every page is one of your `DSA/` notes.** The left pane shows the problem and its test cases, then a
  **help ladder** you climb one rung at a time: what it's really asking, the real-life analogy, the
  approach (data structures & algorithms), the dry run. The solution (code + complexity) stays locked
  until you reveal it, and "Load into editor" drops it into the workbench.
- **TypeScript workbench.** The starter is the solution's signature with the body emptied (class
  problems keep their public method headers only, so field names don't give the approach away). Code runs
  in a **Web Worker** against the note's test cases; an infinite loop is killed after 5s instead of
  freezing the tab. `console.log` output is shown per test case.
- **LeetCode conventions are rebuilt for you:** arrays become `ListNode` lists, level-order arrays become
  `TreeNode` trees, design problems run their `["MinStack","push",…]` operation lists, and the hidden APIs
  (`guess`, `isBadVersion`) exist. Answers whose order doesn't matter (subsets, anagram groups, any valid
  topological order, any valid reorganised string) are compared as such.
- **Topic pages** render each `DSA/<topic>/README.md`, and links between notes open inside the hub.

**React** is a placeholder tab for now.

## How the DSA tab knows what to run

`src/subjects/dsa/sheet.ts` is the sheet manifest: for each of the 165 entries, its note in `DSA/` and a
small judge spec (function name, how to build list/tree inputs, how to compare). A note's own test cases
are used unless the manifest overrides them (only where a note writes tests as prose or a code
walkthrough, e.g. Min Stack). `DSA/NAMASTE_DSA_SHEET.md` is generated from the manifest:

```bash
npm run gen:dsa-sheet
```

```bash
npm run check:dsa
```

`check:dsa` parses every note the way the browser does and runs each note's **own solution** against its
tests, so a broken note (a typo in a test case, code that doesn't compile) is caught before you trip over
it. Pass part of a path to check one topic: `npm run check:dsa -- 13_GREEDY`.

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
    subjects/dsa/
      sheet.ts                  the Namaste sheet: order, note paths, judge specs
      parseNote.ts              DSA note → statement, tests, ladder, solution, starter
      judge.ts                  builds LeetCode inputs, runs, compares (shared with Node)
      runner.worker.ts          runs your code off the main thread
      DsaProblemPage.tsx        reading pane + DsaWorkbench.tsx
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
