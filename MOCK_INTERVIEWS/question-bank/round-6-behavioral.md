# Round 6 — Behavioral / Leadership: Story Bank & STAR Answers

Format: **STAR-L** (Situation, Task, Action, Result, Learning). Rules: "I" for what I owned, "we" only for the team's shared outcome; a NUMBER in every Result; 90 seconds max per story; never badmouth Pluralsight or any colleague. Fill every **[FILL]** with a real name/number/date before the next mock.

---

## My six stories (know them cold; every question maps to one)

| # | Story | Proof point |
|---|---|---|
| S1 | Acting tech lead, 3 engineers, 4 sprints | Spot Bonus Q3 2025 |
| S2 | Intern mentorship, Figma → shipped tool | Spot Bonus Q3 2024, FT conversion |
| S3 | Kafka production fix days after joining Author Tool | Fixed + hardened consumer |
| S4 | Dashboard 15s → 2s | 87% latency cut |
| S5 | Cron re-architecture / fault isolation | Wrong statuses → self-healing pipeline |
| S6 | My MR broke production (early SDE-1) | The failure story — see Q4 |

## Question → story map

Biggest achievement → S5 (or S4) · Leadership → S1 · Mentoring → S2 · Pressure/ambiguity → S3 · Failure → S6 · Conflict/disagreement → S1 or S5 variants below · Initiative → S4 · Tight deadline → S1 · Learning something fast → S3

---

## Q1. "Tell me about a time you led a team." (S1)

**S:** "Our tech lead [FILL: left/went on leave] mid-quarter, and my manager asked me to cover for a 3-engineer team while still carrying my own sprint work.
**T:** Keep four sprints on schedule — we had [FILL: the actual deliverable] committed to stakeholders — without me becoming the bottleneck.
**A:** Three deliberate changes. I time-boxed lead work: first 45 minutes daily for standup, board, and blockers, and protected an afternoon no-meeting block for my own coding. I matched tasks to people instead of taking the hard ones myself — high-context architectural pieces stayed with me, well-bounded work went to the other two with written acceptance criteria. And when blockers hit, I paired instead of taking over: our junior hit a GitLab CI failure, and I spent twenty minutes teaching him to read runner logs and fix the Docker cache rather than five minutes doing it myself.
**R:** All four sprints delivered on schedule, P1/P2 blockers cleared without escalation, and leadership recognized it with a spot bonus in Q3 2025.
**L:** Leading isn't doing everyone's work — it's making sure nobody is stuck for long. And delegation needs written clarity, not verbal hope."

**Probes to survive:** "What did you delegate that you shouldn't have / vice versa?" · "How did you handle the team member who was behind?" [FILL: real example] · "What would you do differently?"

## Q2. "Tell me about mentoring someone." (S2)

**S:** "We took an intern who had to go from a Figma prototype to a production internal tool.
**T:** My job was getting him shipping safely — and honestly, getting him converted.
**A:** I structured it as decreasing scaffolding: first weeks we paired on everything and I created the Figma designs he built against; then I moved to reviewing PRs with teaching comments — not 'change this' but 'here's why this breaks at the edge'; by the end he was presenting the tool to leadership himself. [FILL: one specific technical thing I taught him and one thing HE taught ME.]
**R:** The tool shipped and was presented to leadership; he converted to a full-time SDE-1; I got the Q3 2024 spot bonus for mentorship.
**L:** The goal of mentoring is making yourself unnecessary — the presentations being his, not mine, was the point."

## Q3. "Tell me about working under pressure / handling ambiguity." (S3)

**S:** "Within days of joining the Author Tool team — new codebase, new domain — a high-priority production issue landed: authors were seeing incorrect viewership data for their courses. Author-facing trust data.
**T:** Find and fix it with almost zero context, fast.
**A:** I resisted guessing. I traced one concrete wrong number end-to-end backwards — dashboard → API → the table it read → the Kafka consumer that wrote it — and found the consumer mishandling upstream events with null fields [FILL: exact mechanics — nulls became what? which field?]. I fixed the immediate handling, then hardened the boundary: schema validation on ingest, malformed events routed to a dead-letter path with the error attached, so one bad producer can't silently corrupt author data again.
**R:** Resolved within [FILL: days? hours?]; no recurrence; and the hardening outlived the incident.
**L:** In an unfamiliar codebase, one concrete broken example traced end-to-end beats reading architecture docs for a week. And fixes should end at the boundary, not at the symptom."

## Q4. "Tell me about a failure." (S6 — REQUIRED prep; the empty chair every candidate fears)

**S:** "Early as an SDE-1, one of my merge requests caused a production issue — [FILL: honestly reconstruct: what broke, blast radius, how it was caught].
**T:** Own it, fix it, and make it not happen again.
**A:** I flagged it myself to my senior rather than waiting for someone to trace it to me, paired on the rollback/fix, and then — this is the part that mattered — asked WHY my MR could do that: [FILL: the gap — missing integration test? no staging validation? pipeline check?]. I [FILL: the concrete prevention I added or adopted].
**R:** [FILL: outcome + what changed in team process, however small].
**L:** Two things. Breaking production early taught me the difference between 'my code works' and 'my change is safe' — they're different tests. And owning a mistake loudly, early, costs a bad afternoon; hiding one costs trust you don't get back."

**Rules for failure stories:** real failure, MY fault (not "my failure was trusting others"), specific damage, specific prevention, no blaming. Interviewers reject "perfectionism"-shaped non-failures instantly.

## Q5. "Tell me about a disagreement with a senior/colleague."

Build from a real case — candidates: [FILL: pick one: pushback on the pre-aggregation approach? cron migration scope? dual-schema design?]. Skeleton:

"I disagreed with [role, not name] about [technical decision]. I made sure I could state THEIR case as well as they could — then brought data instead of opinion: [benchmark/prototype/incident evidence]. We landed on [outcome — include if I LOST and why that was fine]. What I won't do is relitigate after a decision: once we chose, I executed it fully."

The signal they want: disagree with data, commit after the decision, no ego.

## Q6. "Why should we hire you over someone with the same skills?"

"Skills equal, I bring the full lifecycle of the same system: I built the dashboard's first version, made it fast, then made its pipeline honest when it was quietly lying to users. Most engineers at my level have built things; fewer have been responsible for the same thing long enough to pay for their own design decisions. Plus the practical bits: I've covered as tech lead, I mentor by default, and I can join immediately."

## Q7. Rapid prep list (one line each, expand from stories)

- "A time you went above your role" → S1 or the Cypress workshops (adopted by 3+ teams — a number!)
- "A time you improved a process" → e-2-e testing docs; the per-job kill-switch control panel
- "Handling changing requirements" → dual-schema credential strategy after the org-wide security policy change [FILL: details to 3-probe depth]
- "Proudest technical decision" → binary-split fault isolation: happy path stays batched, failure pays log cost
- "Something you learned recently" → honest answer from the layoff prep period: heaps/streaming top-k — turning a weakness into a growth story is allowed and lands well
