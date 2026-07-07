# Round 1 — HR Screener: Questions & Answers

Scripts here are written to be SPOKEN. Practice out loud, record, listen, repeat. Full feedback history: [../round-1-hr-screener.md](../round-1-hr-screener.md).

---

## Q1. "Tell me about yourself." / "Walk me through your journey."

**The 90-second version (memorize the skeleton, not every word):**

"Hi, I'm Aniket. I'm a full-stack engineer — three and a half years at Pluralsight, building the internal tools their curriculum and content teams run on every day. I work across the stack, but my real strength is data-heavy backend work — Node, TypeScript, Postgres, Kafka.

The story I'm most proud of is one dashboard that curriculum managers depend on. As an SDE-1, I took its load time from 15 seconds to 2 by moving heavy aggregation off the request path into scheduled pre-aggregations. Later, as an SDE-2, when that same pipeline started surfacing wrong data, I re-architected it with a fault-isolation design — it binary-splits a failing batch to pinpoint the exact bad record, alerts the team on Slack, and recovers on its own. So I've lived the full life of a system: built it, scaled it, made it reliable.

Along the way I built a Kafka pipeline processing over 160 million records — we tuned throughput from 100 records a minute to 10,000 — and I stepped in as acting tech lead for a 3-engineer team for 4 sprints, which is where I discovered I genuinely enjoy unblocking people.

My path into tech wasn't standard — after my degree in 2020 I wasn't job-ready, so I put myself through an intensive program at Masai School and earned my way in. I mention it because it shaped how I work: I assume I can learn anything if I give it honest time.

As for why I'm looking — Pluralsight restructured in April and my role was impacted. Not performance-related: I'd been promoted eighteen months earlier and got a spot bonus in my final quarter. I've used the time to sharpen fundamentals, and I'm being deliberate about what's next."

**The 30-second version (for "briefly introduce yourself"):**

"I'm a full-stack engineer, 3.5 years at Pluralsight, strongest in data-heavy backend — Node, TypeScript, Postgres, Kafka. Headlines: cut a core dashboard from 15 seconds to 2, built a Kafka pipeline processing 160M+ records at 10,000 records a minute, and covered as tech lead for four sprints. I'm in the market because of Pluralsight's April restructuring — promoted 18 months before, spot bonus in my last quarter — and I'm looking for a product company where backend scale is the day job."

**Rules:** metrics unprompted; 2020–2022 compressed to one determination line; never "poor English"; never "I am talented."

---

## Q2. "Why did you leave Pluralsight?" / "Why are you in the market?"

"Pluralsight ran an org-wide restructuring in April and my role was impacted, along with others. It wasn't performance-related — I was promoted to SDE-2 eighteen months before, and earned a spot bonus in my last quarter there. I took a short, planned break and have spent the time since sharpening fundamentals and interviewing deliberately rather than taking the first thing available."

- Deliver like a weather report. Layoffs in this market are unremarkable.
- **Never let "laid off" stand alone** — promotion + spot bonus in the same breath, every time.
- Never volunteer family issues.

## Q3. "There's a gap since April. What have you been doing?"

"Two things. A short planned break — part of it was a family matter that needed my attention; it's fully resolved. The rest has been deliberate preparation: I've been going deep on fundamentals — data structures, system design, the internals of the tools I've used for years — and being selective about the roles I interview for. I'd rather join the right team slightly later than the wrong team immediately."

One line on the family matter ONLY if pressed on the gap; then pivot forward. Never apologize for a 3-month gap in 2026.

## Q4. "What are your salary expectations?"

"I'll be transparent. My last total comp at Pluralsight was 19.3 LPA — and honest context on that: I entered through a non-traditional route and my comp trailed my scope. By the end I was re-architecting our core pipeline, running a Kafka system at 160M+ records, and covering as tech lead. So I'd ask that we benchmark the role, not my last payslip — a percentage hike just carries an underpayment forward.

I'm targeting total compensation around 40–42, flexible on structure across fixed, variable, and equity. Two things back it: it's in line with what product companies pay for this scope at my level, and I can join immediately — no notice period — and I know what a 90-day wait costs a team with an open req."

**Mechanics:** specific anchor (not "40+"), engage any band objection directly, play the immediate-joiner card, signal structure flexibility while holding the total. Full pushback scripts: [round-7-negotiation.md](round-7-negotiation.md).

## Q5. "Why our company?"

Template — fill per company the night before (non-negotiable homework):

"Three reasons. First, [SPECIFIC: a product/scale fact — 'your payments volume', 'Jira's scale of concurrent editing']. Second, the problems match what I do best — [tie to data pipelines / reliability / performance]. Third, [SPECIFIC: engineering culture evidence — their tech blog post, open-source project, a talk]. I want to be somewhere my backend-scale experience compounds instead of starting over."

Research checklist per company: 1 product fact with a number, 1 engineering blog post or talk (name the author), 1 thing about the team/role, their tech stack overlap with mine.

## Q6. "What's your biggest strength?"

"Taking systems from 'works' to 'works reliably at scale.' The evidence: I built our dashboard's first version, then cut its load time 87%, then re-architected its pipeline for fault isolation when it started producing wrong data. Most engineers do one of those phases; I've owned all three on the same system."

## Q7. "What's your biggest weakness?"

Pick a REAL one with a mitigation story. Recommended:

"I default to doing things myself instead of delegating. During my tech-lead stint that stopped scaling in the first sprint — I was clearing every blocker personally and falling behind on my own work. I made myself switch to pairing: when our junior hit a CI pipeline issue, I spent twenty minutes teaching him to read runner logs instead of five minutes fixing it. Slower that day, faster every day after. I still catch myself defaulting to 'I'll just do it' — but now I catch it."

**Never** use "poor communication/English" as the weakness — it plants a flag. If communication comes up: *"Communication is something I've deliberately worked on — presenting at team sessions, running cross-team Cypress workshops, and writing docs that three teams adopted."* Past tense, evidence attached.

## Q8. "Where do you see yourself in 5 years?"

"Leading the design of systems, not just features — a senior or staff engineer that teams trust with their hardest reliability and scale problems. My tech-lead stint told me I enjoy multiplying a team's output, so a path that mixes deep technical work with mentorship is what I'm building toward."

## Q9. "What's your notice period?" / "When can you join?"

"I can join immediately — I'm between roles after Pluralsight's restructuring, so there's no notice period to buy out. That's worth real calendar time to a team with an open req."

Say it as leverage, never as availability-desperation.

## Q10. "Do you have other offers / interviews in progress?"

If yes: > "I'm in active processes with [N] other companies, at [stage]. I'm being deliberate rather than racing to the first offer — but timelines are converging, so if we move forward, it's worth aligning on yours."

If no (never lie): > "I've been selective — I started interviewing recently after a deliberate prep period, and this role is among the first I've prioritized. I'd rather do a few processes well than many badly."

## Q11. Questions I should ask THEM (pick 2–3)

- "What does the first 90 days look like for this role — and what would make you say the hire was a success at the one-year mark?"
- "What's the oldest piece of the system this team is actively paying interest on?" (tech-debt signal, shows systems maturity)
- "How does the team handle production incidents — who's on call, and what does the postmortem culture look like?"
- "What took the person who was best in this role from good to great?"

Never ask about leave policy / work hours in round 1. Save comp for the comp conversation.
