# Round 1 — HR Screener & Core Pitch

**Date:** 2026-07-02
**Interviewer persona:** Senior Talent Partner (HR screen, ~30 min)
**Question asked:** "Walk me through your journey so far — who you are as an engineer, what you've been doing at Pluralsight, and why you're looking to move now."

---

## My Answer (as given)

Hi, good evening, I am Aniket Solanki from Palanpur, Gujarat, currently staying in Bengaluru. Before engineering I was curious about how things are and why they are. During engineering I was curious but not taking action. After engineering I had no job and honestly I hadn't put much effort to get one because of poor English, communication, and programming skills. I studied on my own during Covid, got comfortable with JavaScript but wasn't confident. A friend suggested Masai School — I did the 7-month web development course and got placed at Pluralsight.

At Pluralsight I started as SDE-1. I struggled a bit because of poor English communication, but was very good at programming because of Masai. My mantra: keep learning, give time, stay curious. The first year was challenging — not the coding, but standups, broken MR pipelines, production issues from my MRs. I was stressed at first, but seeing seniors around me I learned to stay calm and keep learning. But I am talented at my technical skills.

I worked on: analytics dashboard for curriculum managers, content freshness workflow, cron job dashboard, pairing, stakeholder meetings, Cypress testing sessions, dual-schema credentials for a new DB security protocol, guiding an intern to SDE-1 conversion, Figma designs for the intern, internal side projects. Then I got promoted to SDE-2.

Apart from tech: cricket fan, going out with friends, travel, music.

Why leaving: I was laid off on 2nd April 2026. I took a 2-month break because of some family issues, then started preparation, and now I'm giving interviews and would love to join your workspace.

---

## What Was Good

- **Authenticity.** The growth-mindset arc ("if I'm struggling, I'm learning") is real and likable. Interviewers do respond to genuine stories.
- **Honesty about the layoff.** Never hide it — background verification will surface it anyway. Disclosing it upfront was the right instinct.
- **Owning the Masai path.** No embarrassment about the non-traditional route. Good.
- **Self-awareness** about the first-year struggles (standups, broken pipelines, production incidents) — this maturity is worth keeping, in smaller doses.

## What Was Missing

1. **Zero numbers.** The resume's strongest ammunition — 15s→2s dashboard, 160M+ records, 100→10,000 records/minute, 4 sprints as tech lead, 2 spot bonuses — none of it appeared. The feature list was a laundry list with no impact attached.
2. **The pitch was upside-down.** Roughly half the airtime went to the weakest years (2020–2022: no job, low effort, poor skills). A 40+ LPA pitch spends ~70% on Pluralsight impact, ~20% on trajectory, ~10% on the future.
3. **"Poor English" was said three times.** Never hand the interviewer a reason to reject you. Self-deprecation is not humility — it plants a flag the panel will now watch for. If communication comes up, the line is: *"Communication is something I've deliberately worked on"* — past tense, solved problem.
4. **"But I am talented at my technical skills"** — a claim with no evidence lands as insecurity. Metrics make the claim for you; you never have to say the word "talented."
5. **The layoff answer blurred three things together** — layoff + family issues + break — into one apologetic sentence. Each needs its own crisp, neutral framing (see model answer). "Some family issues" specifically invites doubt and is nobody's business.
6. **No "why this company."** "I love to join your workspace" is generic filler. One specific, researched sentence is mandatory.
7. **No structure.** It was chronological stream-of-consciousness. Use Present → Past → Future.

## What I Need to Improve

- [ ] **Rebuild the pitch in Present → Past → Future shape** and cap it at 90 seconds spoken.
- [ ] **Memorize 4 numbers cold:** 15s→2s (~87%), 160M+ records, 100→10,000 rec/min, 4 sprints / 3 engineers. They must appear in every pitch, unprompted.
- [ ] **Ban list:** "poor English", "haven't put much effort", "I am talented", "workspace", "kind of", "to be honest" (as a filler).
- [ ] **Script the layoff answer word-for-word** (3 sentences, below) and rehearse until it sounds boring — boring is the goal; a layoff should sound like a weather report, not a confession.
- [ ] **Compress 2016–2022 into ONE line** that shows determination, not struggle.
- [ ] **Record yourself** giving the pitch 3 times; listen for fillers and pace. Prepare a 30-second and a 90-second version.
- [ ] **Prepare one specific "why this company" line per company** before each interview.

---

## Model Answer (human, speakable, ~90 seconds)

"Hi, I'm Aniket. I'm a full-stack engineer — three and a half years at Pluralsight, building the internal tools their curriculum and content teams run on every day. I work across the stack, but my real strength is data-heavy backend work — Node, TypeScript, Postgres, Kafka.

The story I'm most proud of is one dashboard that curriculum managers depend on. As an SDE-1, I took its load time from 15 seconds to 2 by moving the heavy aggregation off the request path into scheduled pre-aggregations. Later, as an SDE-2, when that same pipeline started surfacing wrong data, I re-architected it with a fault-isolation design — it binary-splits a failing batch to pinpoint the exact bad record, alerts the team on Slack, and recovers on its own. So I've lived the full life of a system: built it, scaled it, then made it reliable.

Along the way I built a Kafka pipeline processing over 160 million records — we tuned throughput from 100 records a minute to 10,000 — and I stepped in as acting tech lead for a 3-engineer team for 4 sprints, which is where I discovered I genuinely enjoy unblocking people.

My path into tech wasn't standard — after my degree in 2020 I wasn't job-ready, so I put myself through an intensive program at Masai School and earned my way in. I mention it because it shaped how I work: I assume I can learn anything if I give it honest time.

As for why I'm looking — Pluralsight went through a restructuring in April and my role was impacted. It wasn't performance-related: I'd been promoted eighteen months earlier and received a spot bonus in my final quarter. I've used the time since to sharpen my fundamentals, and I'm being deliberate about what's next — I want a product company where backend scale problems are the day job, which is exactly why this role caught my eye."

### The layoff answer, scripted (use verbatim when asked "why did you leave?")

"Pluralsight ran an org-wide restructuring in April and my role was impacted, along with others. It wasn't performance-related — I was promoted to SDE-2 eighteen months before, and earned a spot bonus in my last quarter there. I took a short, planned break and have spent the time since sharpening fundamentals and interviewing deliberately rather than taking the first thing available."

**Rules for this answer:**
- Never volunteer "family issues." If asked directly about the gap: *"Part of it was a family matter that needed my attention — it's fully resolved. The rest was deliberate preparation."* One line, move on.
- Never sound apologetic. Layoffs in 2025–26 are market-wide; the interviewer knows this.
- Always attach the two proof points (promotion + spot bonus) in the same breath as the word "layoff." Never let "laid off" stand alone.

---
---

# Question 2 — Salary Expectations & Anchoring

**Question asked:** "What was your last CTC, and what are your expectations? This band typically closes low-to-mid 30s for 3.5 years. Given you're between roles, help me understand your number."

## My Answer (as given)

My CTC was 19.29 LPA in my previous organisation. My current expectations are 40+ LPA. Because I have involved myself into improving myself — wherever I have worked, whether frontend or backend, I have consistently worked on creating the dashboard for the curriculum tool, processed more than 160M records, and built a fault-tolerant record processing system. So I have polished my work, and after the layoff I have invested my time in upskilling myself, and I keep myself as a quality software engineer — that's why my expectations are 40+ LPA.

## What Was Good

- **Stated the number without flinching.** No hedging, no "as per company norms." Confidence in the ask itself is half the battle.
- **Reached for evidence** (160M records, fault-tolerant system) instead of pure "I deserve it." Right instinct, wrong execution.
- **Disclosed exact CTC honestly.** In India, recruiters verify payslips — honesty here is correct strategy, not naivety.

## What Was Missing

1. **The elephant went unaddressed: 19.29 → 40+ is a 107% hike.** The interviewer explicitly said "this band closes low-to-mid 30s" and the answer ignored the pushback completely. Not engaging with a stated objection reads as either not listening or having no counter — both fatal in negotiation.
2. **No decoupling of last CTC from market value.** This is THE move for anyone underpaid relative to scope. Percentage-hike framing benefits the company; role-value framing benefits you. The answer let "107% hike" stand as the frame instead of replacing it with "market rate for this scope."
3. **The justification was self-improvement language, not market language.** "Improving myself," "polished my work," "upskilling," "quality software engineer" — a recruiter cannot take any of that to a compensation committee. What they CAN take: scope of work delivered, market benchmarks, competing processes, immediate availability.
4. **Missed the strongest leverage card available: immediate joining.** No notice period (vs. the standard 60–90 days in India) is worth real money to a company with an urgent req. It converts "between roles" from a weakness into leverage — and it was never mentioned.
5. **"40+" is a weak anchor shape.** An open-ended "plus" sounds like hope, not a position. A specific number or tight range ("targeting around 42 total, flexible on structure") sounds like a decision.
6. **No mention of comp structure.** At this level, total comp = fixed + variable + equity + joining bonus. Signaling flexibility on *structure* while staying firm on *total* gives the recruiter a path to yes.

## What I Need to Improve

- [ ] **Learn the decoupling line cold:** "My last CTC reflects where I entered the industry, not what I deliver — I'd ask that we benchmark the role, not my last payslip."
- [ ] **Always engage a stated objection directly.** If they say "band closes at mid-30s," the answer must contain a response to mid-30s — never skip past it.
- [ ] **Play the immediate-joiner card every time** salary comes up while between roles.
- [ ] **Replace "40+" with a specific anchor:** e.g., "targeting ~42 total comp, flexible on structure." Anchor slightly above target so the negotiated landing is your target.
- [ ] **Ban list additions:** "improving myself", "upskilling myself", "quality software engineer", "polished my work" — none of these are transferable to a comp discussion.
- [ ] **Prepare the walk-away framing:** deliberate, not desperate. "I'd rather be upfront now than surprise you at offer stage."

## Model Answer (human, speakable)

"Sure — I'll be transparent. My last total comp at Pluralsight was 19.3 LPA. I want to give you honest context on that number: I entered the industry through a non-traditional route, and my comp trailed my scope — by the end I was re-architecting the pipeline behind our core dashboard, running a Kafka system that processed 160-million-plus records, and covering as tech lead for a 3-engineer team. So my ask is that we benchmark this on the role and the scope, not on a percentage over my last salary — a percentage hike would just carry an underpayment forward.

On expectations: I'm targeting total compensation around 40–42, and I'm flexible on how that's structured across fixed, variable, and equity. Two things back that number. First, it's in line with what product companies pay for this scope at my experience level — I've done my homework. Second, I can join immediately — no notice period — and I know what a 90-day wait usually costs a team with an open req.

And on the 'between roles' point — I'll address it directly: I'm being deliberate, not urgent. I'd rather tell you now that low-30s wouldn't work for me than surprise you at the offer stage. If the loop goes well and we're close on total, structure is absolutely a conversation I'm open to."

**Key mechanics in this answer:**
1. **Names the objection and answers it** (the low-30s band, the between-roles jab) instead of talking past it.
2. **Reframes from % hike → market value of scope** in one sentence.
3. **Specific anchor (40–42), flexible structure** — gives the recruiter a path to yes without lowering the total.
4. **Immediate joining as leverage**, stated as a cost the company understands (90-day req).
5. **Controlled walk-away signal** — "deliberate, not urgent" — without arrogance.
