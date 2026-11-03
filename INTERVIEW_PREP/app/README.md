# Revise — interview revision notes

A web app for revising before technical interviews. Every problem and concept gets one page with
what the interview needs and nothing extra: what the question is really testing, cases to predict, three
hints, the answer behind a reveal, why the complexity is what it is, and the words to say out loud.

## Run it

With Docker (serves the production build on http://localhost:8080):

```bash
docker compose up -d --build
```

For editing notes, with hot reload on http://localhost:5190:

```bash
npm install && npm run dev
```

After adding or editing a problem page, run every reference answer against its tests:

```bash
npm run check
```

## What's on a problem page

1. **Understand**: the statement, constraints and examples, plus the problem's pattern, topics, the companies reported to ask it, and a LeetCode/NamasteDev link.
2. **Predict the output**: tricky cases with the answer hidden until you tap.
3. **Hints**: three, one at a time.
4. **Solution**: brute force first, optimal last, each with time/space and the reason for them. Locked in Practice mode.
5. **Complexity**: why it matters for this problem, what breaks at scale.
6. **Interview**: a 60-second spoken answer, the keywords interviewers listen for, bonus points, common mistakes, follow-up questions.
7. **Editor**: TypeScript, runs against the tests in a Web Worker. "Reveal answer" shows the reference solution next to yours.

**Practice / Revise** (top bar): Practice hides the solution until you reveal it. Revise opens everything for fast reading.

**How well did you know it?** at the end of each page schedules its next revision (spaced repetition).
Due pages show on the home page, next to a contribution-style heatmap and your streak. Progress lives in
the browser's localStorage; export/import a backup from the home page.

## Adding content

- **A problem**: add `src/content/dsa/notes/<slug>.ts` exporting a `ProblemNote` (see `src/content/types.ts`).
  The slug must match an entry in `src/content/dsa/sheet.ts`, which also tells the runner the function name and
  how to build inputs. The page goes live as soon as the file exists.
- **A concept page**: add `src/content/dsa/concepts/<slug>.ts` and list it in `sectionConcepts` in `src/content/dsa/index.ts`.
- **A new track** (JS, React, Node, System Design…): listed in `src/content/tracks.ts`; flip `live` once it has pages.

## Layout

```
src/
  content/       notes as typed data (markdown strings), one file per page
    dsa/sheet.ts   the Namaste DSA Sheet: 165 problems, order, links, runner specs
  runner/        TypeScript → JS (sucrase), sandboxed run in a Web Worker, LeetCode-style judging
  lib/           progress + spaced repetition, routing, theme, practice/revise mode
  components/    editor, heatmap, rating bar, shared bits
  pages/         home, DSA list, problem, concept, cheat sheet
```

Hash routing and a relative base mean `dist/` works on any static host (GitHub Pages, Netlify, Vercel) as-is.
