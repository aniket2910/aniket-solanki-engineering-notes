# Playground

A single place to **read the concept and run the code** for interview prep. Everything is organized
by subject, then by topic, and each topic is one self-contained folder:

```
playground/
  run.js                       # tiny runner to list + switch topics
  JS/
    README.md                  # index of JS topics
    closures/
      notes.md                 # the written note (read this)
      demo.js                  # plain runnable examples (run this)
    this-keyword/
      notes.md
      demo.js
    ...
  (later: SQL/, NODEJS/, ... same pattern)
```

## Running a topic

No install, no build — plain Node.

```bash
node playground/run.js                 # list subjects
node playground/run.js JS              # list JS topics
node playground/run.js JS closures     # run the closures demo
```

Or run a file directly:

```bash
node playground/JS/closures/demo.js
```

## Adding a topic

1. Make a folder `playground/<SUBJECT>/<topic>/`.
2. Add `notes.md` (the explanation) and `demo.js` (runnable examples).
3. That's it — `run.js` finds it automatically. Update the subject's `README.md` table so it's listed.

Code here is deliberately kept **plain and clear** — the point is understanding the concept, not
showing off syntax.
