---
name: interview-prep
description: >-
  Write interview-ready deep-dive notes for a technical topic in Aniket's INTERVIEW_PREP notebook —
  a single self-contained file per topic that explains a concept he ALREADY broadly knows, in simple
  human language, framed for the interview room: crisp core, a real-life analogy for how to THINK
  about it, keywords to say to sound senior, how the question actually gets asked (with follow-ups
  and traps), cross-links to related topics, and a rapid-fire Q&A. Use this skill WHENEVER Aniket
  gives a "Subject + Topic" for interview prep (e.g. "JS → Promises", "React → reconciliation",
  "Node → event loop", "Postgres → indexes", "System Design → rate limiter LLD"), or asks to "add",
  "create", or "prep" a topic under INTERVIEW_PREP / for interviews across JS, React, Node, Postgres,
  Redis, Docker, Kubernetes, Testing, Frontend Fundamentals, or System Design (HLD/LLD). This is his
  interview-consolidation pattern — reach for it for any "prep me on this topic for interviews"
  request, even when he doesn't name the folder. It is NOT deep-dive-notes: that skill teaches a NEW
  topic from historical first principles as a textbook; this one consolidates a KNOWN topic for
  interview recall and answering. Use deep-dive-notes for "teach me X from scratch / from history";
  use this for "prep X for my interview / put X in one place the way I'd explain it in an interview."
---

# Interview Prep Notes

Aniket is a full-stack SDE-2 prepping for technical interviews across his whole resume (JavaScript,
React, Node, Postgres, Redis, Docker, Kubernetes, testing, frontend fundamentals, system design).
For this notebook he is **not learning a topic from zero** — he already broadly knows it. What he
wants is *one place per topic* where the concept is explained cleanly, in plain language, and framed
the way he'll actually need it **in an interview**: something he can revise the night before, and
that hands him the exact words, analogies, and answers to reach for when an interviewer probes.

The measure of a finished note is: **after reading it, could he walk into an interview, get asked
about this topic from any angle, and answer confidently — with a good analogy, the right vocabulary,
and awareness of the follow-up traps?** If yes, it's done.

This is a different job from `deep-dive-notes`. That skill is a from-scratch, history-first textbook
for learning something new. This one assumes the knowledge is mostly there and **sharpens it for the
room**: crisp where the idea is simple, deep only where an interviewer would push. Skip the long
"origin story / who invented it" lineage unless a specific bit of history is itself a likely
interview talking point. Favour clarity and recall over completeness.

## The real deliverable: HOW you solve it, not THAT you solved it

This is the guiding idea of the whole skill, and it changes what every note is for. In a real
interview, ten strong candidates will all get the problem working. The offer goes to the one whose
**solution reads like production code and who can narrate the engineering behind it.** So a note here
is never just "the correct answer" — it must also teach the *craft layer* around the answer:

- **How to break the problem into smaller pieces** — the decomposition. What are the units, why those
  boundaries, what each one owns. (In React: small composable components. In backend/LLD: small
  single-responsibility functions/classes. In DB: normalized tables. Same instinct everywhere.)
- **Which engineering principles the solution embodies, by name** — DRY, SOLID (esp. Single
  Responsibility), KISS, YAGNI, separation of concerns, composition over inheritance; ACID and
  normalization for databases; idempotency and statelessness for backend; and so on. Naming the
  principle you're applying, *and why it applies here*, is exactly what makes a candidate sound
  senior. The catalog of which principle maps to which topic/question is in
  `references/principles.md` — consult it when writing the quality sections.
- **The exact words to say while coding** — a candidate who says "I'll pull this out into its own
  component to keep it under one responsibility — that's SRP, and it keeps this file readable" scores
  far above one who silently writes the same code.
- **Code quality as a first-class output** — readable names, small units, comments that explain the
  *pattern and the why* (not restate the line), no shortcuts a reviewer would flag.

Every note must make these visible: the `🔍 What the interviewer is really testing`,
`🏗️ Code quality & principles applied`, and `🗣️ Keywords to say` sections carry this weight. The
question behind every note is not only "what's the answer?" but **"what is this problem actually
probing, and how does a candidate demonstrate senior judgment while solving it?"**

## Calibrate depth to what the problem is testing

Depth is a scalpel, not a firehose. Read the problem and ask: *what is the interviewer really
testing with this?* Go deep on exactly that, and stay light on everything else.

- **Don't document the basics he already knows.** If a task says "build component X" and it happens to
  use `useState`/`useEffect`, do NOT write a note on hooks — he knows hooks; that's assumed. Spending
  the note on fundamentals insults the reader and buries the real signal. The same holds for every
  subject: don't explain `for` loops, basic SQL `SELECT`, or what a Promise is unless that IS the
  topic.
- **Go deep only where the problem's difficulty actually lives.** Some problems are secretly a test
  of one hard concept — an OTP box is really a test of refs + focus management; a debounced search is
  really a test of closures + cleanup; an infinite scroll is really `IntersectionObserver` + stale
  closures. When the problem is fundamentally *about* a deeper topic, explain that topic in depth in
  this note and spell out **the exact thing to say to stand out** on it.
- **This governs linked notes too.** Only spin off a separate `🔗 Linked concepts` note when the
  linked topic is a substantive interview subject in its own right AND relevant here — not for
  fundamentals he already has. When in doubt, explain it inline in this note rather than manufacturing
  a doc for something basic.
- **If he explicitly names a sub-topic** ("build X and go deep on the hook you use"), then treat that
  sub-topic as a first-class thing to teach, regardless of the above.

## Where notes live (filing convention)

Everything goes under `INTERVIEW_PREP/<SUBJECT>/`. Subjects (create the folder on demand):
`JS/`, `REACTJS/`, `NODEJS/`, `POSTGRES/`, `REDIS/`, `DOCKER/`, `KUBERNETES/`, `TESTING/`,
`FRONTEND_FUNDAMENTALS/`, `SYSTEM_DESIGN/` (HLD + LLD). Match a subject he names to the closest
existing folder; only invent a new one if none fits.

- **One topic = one file**, named `NNN-topic-slug.md`, numbered in the order added to that subject
  (`001-promises.md`, `002-event-loop.md`, …). Check the folder for the next number before writing.
- Each subject folder has a **`README.md` index** — a one-line intro plus a table
  (`ID | Topic | One-line hook`) listing every note. Create it when you add the first topic to a
  subject; update it every time you add a topic.
- Keep the top-level `INTERVIEW_PREP/README.md` subject table accurate if you add a new subject.

### Code-heavy topics: ONE shared runnable app per subject

Some topics aren't real unless he can run them — a React component question, a Node server/streams
question, an LLD design he'd code out. **Never spin up a new project per problem.** Each code-subject
has exactly **one shared runnable app** that hosts every problem, so a visitor installs once and finds
everything in a predictable place.

The convention (React shown; mirror it for other subjects):

```
INTERVIEW_PREP/REACTJS/
  README.md                     # subject index (+ how to run the app, how to add a problem)
  001-otp-input-box.md          # the WRITTEN note stays a flat file at the subject root
  002-....md
  playground/                   # the ONE shared app (Vite+TS for React) — set up once
    package.json, index.html, vite.config.ts, tsconfig.json, .gitignore
    README.md                   # how to run + how to add a problem
    src/
      main.tsx, App.tsx, app.css   # a thin shell/menu that never needs editing
      problems/
        registry.tsx            # the list of problems — add one line to register
        <slug>/                 # ONE folder per problem (slug matches the note file)
          index.tsx             # default export = the demo shown in the app
          *.tsx                 # the components (each < ~120 lines; split & compose)
          *.css                 # styles — never inline
```

So a new code problem means: (1) create `playground/src/problems/<slug>/`, (2) register it in
`registry.tsx`, (3) write the flat note `NNN-<slug>.md` at the subject root that links into that code
folder. If the subject's shared app doesn't exist yet, scaffold it once (smallest thing that runs — a
tiny shell + a registry), install, and verify it builds. Analogues: Node → a `playground/` with an
npm script that runs a chosen problem; LLD → a `playground/` of TS classes with a runner. Give the
note the exact run command.

This shared code is a **portfolio of your standards**, so hold every problem to production quality —
see `## Code quality standards` below. Running is the floor; it must read like code a senior engineer
would approve in review.

Text-only topics (most of JS, Postgres theory, HLD concepts) stay as a single flat `.md` file — no app.

### Keep the repo navigable for a stranger

This repo is a **public interview-prep sanctuary** (read the root `README.md` for the author's intent:
clean, minimal, human, TypeScript, anyone can walk in and revise efficiently, contributions via PR).
So structure is a feature: keep every subject folder consistent with the pattern above, keep indexes
(`README.md` tables) current, name things predictably, and make sure someone landing cold can find the
note, run the code, and prepare — without you there to explain it.

## Code quality standards (every subject, non-negotiable)

The runnable code and every snippet must model the craft, because the code itself is a signal in the
interview. Apply these, and — crucially — **make the note explain *why* each choice was made**, so he
can say it out loud:

- **Follow the industry-standard practices for the subject.** Idiomatic React (composition, hooks
  rules, keys), idiomatic SQL (set-based, indexed), idiomatic Node (async/await, error handling,
  streams), etc. If there is a widely accepted "right way," use it and name it.
- **Comments explain the pattern and the *why*, not the *what*.** A comment restating the line
  (`// increment i`) is noise. A good comment explains the reasoning, the pattern, or the principle:
  `// callback ref collects one DOM node per box — this is the standard "array of refs" pattern`.
  Every non-obvious decision gets a because.
- **No inline styles.** In React, put styling in a CSS file or CSS module, never a `style={{...}}`
  prop for anything real — inline styles mix concerns and don't scale. This is one instance of the
  broader rule: **keep concerns separated** (presentation vs logic vs data).
- **Small units, single responsibility.** A React component should stay **under ~120 lines**; if it
  grows past that, split it — extract the smaller pieces into their own components and compose them.
  The same instinct applies everywhere: small focused functions, one class = one responsibility. A
  200-line component or a function doing five things is a red flag an interviewer will note.
- **DRY, but not prematurely.** Remove real duplication; don't over-abstract two lines that merely
  look similar (that's a KISS/YAGNI violation in the other direction). Explain the judgment call.
- **Meaningful names, no magic numbers, handle the edge cases** (empty, error, loading, boundary).
  These are the cheap things that separate a "works" solution from a "clean" one.

The principle catalog — which named principle (DRY, SOLID, ACID, KISS, YAGNI, SoC, composition,
idempotency, normalization, 12-factor, etc.) is relevant to which kind of problem, and the crisp
line to say about each — lives in `references/principles.md`. Read it when writing the
`🏗️ Code quality & principles applied` and `🗣️ Keywords to say` sections so you name the *right*
principle for the topic, from a verified source rather than sprinkling buzzwords.

## The note structure (use these sections, in this order)

Be **crisp by default, deep on demand**. A simple concept can be a tight page; a topic interviewers
grill on (event loop, closures, isolation levels, reconciliation) earns real depth in "How it works"
and "How it's asked." Cut filler, never cut a real explanation.

1. **Title** — a clear `# ` heading naming the concept.
2. **⚡ In one line** — the single sentence he'd say if an interviewer asked "what is X?". This is
   the elevator answer; everything below expands it.
3. **🔍 What the interviewer is really testing** — 2–4 bullets naming the actual signal behind the
   question. Rarely is it "can you produce output"; it's "do you understand refs", "do you reach for
   the right data structure", "do you think about edge cases and cleanup", "can you decompose this
   cleanly". This section calibrates everything below — it says where to go deep and what to
   emphasize while solving. Name it explicitly so he walks in knowing what's being scored.
4. **Why it exists (the problem)** — the specific pain the concept removes, in 2–4 sentences. What
   breaks or hurts without it. Interviewers love "why would you use this?" — this is that answer.
5. **What it is** — a precise but plain-language definition and a crisp **mental model**. No jargon
   he'd have to look up without defining it inline.
6. **🎈 Real-life analogy (how to think about it)** — an everyday physical analogy (restaurant,
   queue at a counter, mailboxes, a whiteboard, LEGO) that actually maps onto the mechanism, framed
   as *how to picture it under pressure*. This is the thing he'll recall mid-interview. Make it
   genuinely map — call out what each part of the analogy corresponds to.
7. **🔧 How it works (under the hood)** — the mechanism, step by step, as deep as an interviewer
   would push. Use small fenced diagrams / step traces where they clarify. Go deep here on the
   topics that get grilled; stay tight on the ones that don't.
8. **💻 In code** — runnable **TypeScript / JavaScript** showing the concept concretely, built up
   with short commentary, not one dumped blob. The code must meet `## Code quality standards`:
   idiomatic, small units, no inline styles, comments that explain the pattern/why. Show the
   naive/wrong version first when the contrast is itself a common interview point. For code-heavy
   topics, point to the runnable setup folder and give the run command.
9. **🏗️ Code quality & principles applied** — the "how you'd be judged" section, and a signature of
   this skill. Make the craft explicit:
   - **Decomposition** — how the problem was split into smaller pieces and *why those boundaries*
     (which component/function/table owns what). This is how you show you can break a problem down.
   - **Principles by name** — which named principles the solution follows and where: e.g. "extracted
     `<OtpBox>` → Single Responsibility", "one `values` array → single source of truth / DRY",
     "styling in CSS, not inline → separation of concerns". Pull the right principle for the subject
     from `references/principles.md`; for concept-only topics (e.g. Postgres isolation) this becomes
     "which principle the concept embodies" (ACID, normalization) rather than code decomposition.
   - **The exact sentences to say** while coding that demonstrate this judgment — the lines that make
     an interviewer mark "senior". This is where quality becomes *visible*, which is the whole point.
   - **What you deliberately did NOT do** — the premature abstraction you avoided (KISS/YAGNI), so the
     quality reads as judgment, not dogma.
10. **🗣️ Keywords to say** — a tight list of the precise terms/phrases that signal seniority when he
    drops them (e.g. for Promises: *microtask queue, event loop, thenable, unhandled rejection,
    `Promise.all` vs `allSettled`, error propagation*), **plus the principle vocabulary** relevant to
    this problem (SRP, DRY, separation of concerns, idempotency…). One line each on what they mean so
    he uses them correctly, not as buzzwords.
11. **🎯 How it's asked in interviews** — the heart of this skill. Cover:
    - The **actual question phrasings**, and **the different ways the same question is disguised**
      ("build an OTP box" = "build a PIN entry" = "segmented code input" — same problem, different
      wording; help him recognize the pattern under the phrasing).
    - The **follow-up ladder** — how they go deeper when he answers well.
    - **Traps & gotchas** — the mistakes that sink candidates, "what happens if…" curveballs, and the
      subtle distinctions they probe.
    - A **model answer sketch** for the flagship question — how a strong candidate structures the
      reply, *including narrating the quality decisions*, not a wall of code.
12. **🔗 Linked concepts** — the related topics this one connects to, as **relative Markdown links**
    to their note files (e.g. `[Event loop](../JS/002-event-loop.md)`). Only create a linked note
    when the topic is a substantive interview subject in its own right AND relevant (see *Calibrate
    depth* above) — do NOT manufacture docs for fundamentals he already knows; explain those inline
    instead. When you do create one, add it to that subject's README so the link is never dead.
    Explain in one line *why* each is linked, since interviewers pull on these threads.
13. **🧠 Rapid-fire Q&A** — 6–12 active-recall questions, basic → deep, in real interview style, each
    with a crisp complete answer. Include a couple of "why" and "what happens if…" questions, and at
    least one on a **code-quality/design choice** ("why did you split this out?"). Night-before layer.
14. **✅ Cheat lines** — 3–5 compressed one-liners he can memorize as anchors for the whole topic.

## Voice and formatting rules (Aniket's standing preferences)

- **Simple, human language — not overcomplicated.** Explain like a sharp colleague at a whiteboard,
  not a spec. If a sentence needs re-reading, rewrite it. This is the top priority of this skill.
- **No `>` blockquotes.** His Markdown viewer renders them as unreadable low-contrast panels. Use
  **bold labels** + plain paragraphs. This includes GitHub callouts (`> [!TIP]`) — never use them.
- **No "we", no instructor/course attribution.** Write directly to him ("you", imperative) or in
  neutral third person.
- **Code is TypeScript / JavaScript** by default (his stack), unless the topic is inherently another
  language (SQL for Postgres, YAML for Kubernetes, Dockerfile syntax, etc.).
- **Analogies must actually map** onto the mechanism, using everyday physical objects — not flavor.
- **Accuracy is non-negotiable.** Never state anything false — a wrong fact here becomes a wrong
  thing he says in an interview. If unsure of a detail, hedge or leave it out rather than invent it.
  Be especially careful with version-specific behavior, spec details, and "gotcha" edge cases, since
  those are exactly what interviewers test.
- **Crisp beats complete, but never omit a real explanation.** Trim marketing language, hedging, and
  repetition; keep every sentence that does teaching or answering work.
- **Self-contained per file, but link liberally within the notebook.** He should understand the
  topic from its own file, and follow `🔗 Linked concepts` to related notes in the same repo. Don't
  send him to external blogs/videos to actually understand something — write the understanding here.

## After writing

Tell him briefly what you produced and where (link the file), note any linked stub files you created,
and update the subject `README.md` index. Offer the natural next step — the next topic, a deeper pass
on "How it's asked," or turning a text topic into a runnable setup. Do not commit to git unless he
asks.
