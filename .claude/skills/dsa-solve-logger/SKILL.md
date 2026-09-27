---
name: dsa-solve-logger
description: >-
  Log a DSA problem Aniket just solved into his pattern-organised revision log. Use this skill
  WHENEVER he describes, pastes, or summarises a coding problem he has solved and wants it recorded —
  phrasings like "log this problem", "I just solved X", "add this to my DSA log", "solved a sliding
  window one today", "track this LeetCode question", or he pastes a problem statement + his approach
  and complexities. The skill extracts the problem name, platform, pattern (from the shared taxonomy),
  core data structure, algorithm, his stated time/space complexity, and a one-line key insight, then
  appends a structured entry to the matching per-pattern log file (DSA/SOLVE_LOG/<pattern>.md) and
  updates the master index. It ASKS for any missing field instead of guessing. This is his daily
  solve-tracking habit — reach for it for any "record what I solved" request, even when he doesn't
  name the log. It is NOT a teaching skill: use deep-dive-notes to LEARN a topic; use this to RECORD
  a solved problem as a revision breadcrumb.
---

# DSA Solve Logger

Aniket solves DSA problems daily and wants each one captured the moment he finishes, so that over
weeks the logs become a **pattern-organised revision resource**: open `sliding-window.md` the night
before an interview and re-read every sliding-window problem he's ever cracked, each compressed to
its essence. The value compounds only if entries are consistent and correctly filed — so this skill's
job is disciplined capture, not teaching.

The measure of a good log entry: **months later, reading just that entry, he can recall the problem,
re-derive the approach, and remember the one insight that made it click** — without re-reading the
full problem or his old code.

This is deliberately *not* `deep-dive-notes`. That skill writes a textbook chapter to learn something
new. This one writes a terse, high-signal breadcrumb for something already understood. Terse is the
goal here, not a failure.

## The one rule that makes this skill trustworthy: never guess a field

Every entry has required fields (below). If the user's message doesn't clearly supply one, **ask for
it** — do not infer, approximate, or fill it with a plausible-sounding value. A fabricated complexity
or a wrong pattern label silently corrupts the revision resource, and he'd revise from a false fact.

The two fields most often missing are **time/space complexity** and the **key insight** — people
paste a problem and approach but skip these. Always check for them explicitly. Batch all missing
fields into a single question so he answers once, not five times.

The one field you may *propose* (still confirming) is the **pattern**: you can classify it from the
shared taxonomy and say "filing this under Sliding Window — correct?", because pattern recognition is
mechanical and he can veto in a word. Everything else he must supply.

## The shared pattern taxonomy (read it every time)

The pattern label is not free text. Read **`../shared/pattern-taxonomy.md`** and pick the `slug` +
`Pattern` from that table. The `slug` is the log filename (`DSA/SOLVE_LOG/<slug>.md`), so using the
canonical slug is what keeps every sliding-window problem in one file instead of scattered across
"window", "sliding", "two-pointer-window". If nothing fits, follow that file's overlap/new-pattern
guidance — surface it and ask; don't invent a label here.

The `company-interview-drill` skill reads the same file, so a label you use here is the same label a
drill will tag a company question with. Consistency across the two skills is the whole reason the
taxonomy is a separate shared file.

## Fields to extract

Pull these from what he gives you; ask for whatever's missing.

| Field | What it is | If missing… |
| :--- | :--- | :--- |
| **Problem name** | The canonical title (e.g. "Longest Substring Without Repeating Characters") | Ask. If he gave a URL/number only, ask for the title or confirm the one you look up |
| **Platform** | LeetCode / NeetCode / HackerRank / Codeforces / GfG / book / interview / other | Ask (or infer only from an unambiguous URL, then confirm) |
| **Difficulty** | Easy / Medium / Hard | Ask if not stated |
| **Pattern** | The taxonomy label (see above) | Propose from the taxonomy, confirm |
| **Core data structure** | What actually carried the solution (hash map, heap, monotonic stack…) | Default to the taxonomy's typical structure but confirm; ask if unclear |
| **Algorithm / approach** | One-to-three sentence summary of *how* he solved it | Ask — this is the spine of the entry |
| **Time complexity** | His stated Big-O, e.g. `O(n)` | **Ask — never guess** |
| **Space complexity** | His stated Big-O, e.g. `O(k)` | **Ask — never guess** |
| **Key insight** | The single realization that unlocked it — the thing to remember | **Ask — never guess.** This is the most valuable line in the entry |
| **Date** | Solve date | Default to today unless he says otherwise |
| **Link** | Problem URL | Optional; include if given |

Optional extras, only if he offers them: a gotcha/edge case he missed, a brute-force→optimal note,
or a short code snippet. Keep the entry lean — this is a breadcrumb, not a solution dump.

## Where things live

```
DSA/SOLVE_LOG/
  README.md            # master index — every problem, newest first, linking to its pattern file
  sliding-window.md    # one file per pattern (filename = taxonomy slug)
  two-pointers.md
  binary-search.md
  ...                  # created on demand the first time a pattern is logged
```

Keep this separate from the curated `DSA/NN_TOPIC/` notebook — that's polished teaching material;
this is a raw personal solve journal. Both are useful; don't mix them.

## The entry format (append to the pattern file)

Append each new entry to the **top** of the pattern's problem list (newest first, so recent solves
are what he sees when he opens the file). Use this exact shape. Note the **no `>` blockquotes** rule —
his Markdown viewer renders them as unreadable panels; use bold labels and plain lines.

```markdown
### <Problem name> — <Difficulty>

- **Platform:** <platform> · **Date:** <YYYY-MM-DD> · [link](<url>)   ← omit link if none
- **Data structure:** <core structure>
- **Approach:** <1–3 sentence summary of how it was solved>
- **Complexity:** Time `O(...)` · Space `O(...)`
- **💡 Key insight:** <the one line to remember>
- **⚠️ Watch out:** <gotcha, only if he mentioned one>
```

If the pattern file doesn't exist yet, create it with this header first, then add the entry:

```markdown
# <Pattern> — Solve Log

Problems solved using the **<Pattern>** pattern, newest first. Pattern definition and when to
recognize it: see [pattern taxonomy](../../.claude/skills/shared/pattern-taxonomy.md).

Revise this file by reading top to bottom — every entry is one problem compressed to its essence.

---
```

(Adjust the relative link depth so it resolves from `DSA/SOLVE_LOG/` to the taxonomy file.)

## The master index (`DSA/SOLVE_LOG/README.md`)

After appending the entry, update the index so it's a single-glance map of everything solved. Keep a
running count and one table, newest first:

```markdown
# DSA Solve Log

A running journal of every DSA problem solved, filed by pattern. Open a pattern file to revise all
problems of that shape together. Patterns come from the [shared taxonomy](../../.claude/skills/shared/pattern-taxonomy.md).

**Total solved: <N>**

| Date | Problem | Pattern | Difficulty | Platform |
| :--- | :--- | :--- | :--- | :--- |
| 2026-09-04 | [Two Sum](two-pointers.md) | Two Pointers | Easy | LeetCode |
```

Link the problem name to its pattern file. Increment the total. If the index doesn't exist yet,
create it with this header. Keep the table newest-first.

## Workflow

1. **Read the shared taxonomy** so your pattern classification is valid.
2. **Extract** every field you can from his message.
3. **Classify the pattern** and note the primary vs any secondary (per the taxonomy's overlap rule).
4. **Ask once** for all missing required fields — especially time/space complexity and the key
   insight — and confirm the proposed pattern in the same message. Don't proceed until he answers.
5. **Write**: append the entry to the top of `DSA/SOLVE_LOG/<slug>.md` (creating the file if new),
   then update `DSA/SOLVE_LOG/README.md` (creating it if new, incrementing the total).
6. **Confirm briefly**: tell him what was logged, under which pattern, and the running total. Link
   the pattern file. Offer to log another. Don't commit to git unless he asks.

## Handling batches and edge cases

- **Multiple problems in one message** ("here are the 3 I did today"): log each as its own entry,
  ask for all missing fields across all of them in one grouped question, then write them all.
- **A problem he's logged before** (re-solve): don't duplicate — add a short "re-solved
  <date>" note to the existing entry, or a fresh entry only if his approach/insight changed
  meaningfully. Check the pattern file before appending.
- **He's unsure of complexity himself**: that's fine and worth capturing — record what he believes
  and mark it, e.g. `Time O(n) (unverified)`. Don't silently "correct" it to what you think; if you
  suspect it's wrong, say so and let him decide. The log records *his* understanding.
- **No pattern fits**: follow the taxonomy's new-pattern guidance — propose adding a row to the
  shared file, get his OK, add it there first, then log.
