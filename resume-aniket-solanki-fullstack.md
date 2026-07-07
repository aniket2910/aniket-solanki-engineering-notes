# Aniket Solanki

Software Engineer II · Full Stack
Bengaluru, India | +91 95124 03690 | solankianiket0411@gmail.com | linkedin.com/in/aniketsolanki | github.com/<your-handle>

<!--
  ATS NOTES (delete before sending):
  - No tables/columns/text-boxes: ATS parsers mangle them. This file is intentionally linear.
  - Match the title line above to the JD each time ("Software Engineer II" / "Full Stack" / "Backend Engineer").
  - Fill in your real GitHub handle above (or delete that link if you don't want it public).
  - EXPORT CHECK: after generating the PDF, copy-paste its text into a plain editor. If words are
    glued ("NestJSservice", "itscurriculum"), the builder ate the spaces — re-export from Google
    Docs (Docs -> PDF is very ATS-safe) rather than the resume builder that produced that artifact.
  - Keep only skills you can defend for 10 minutes. Delete the rest per application.
  - Every number here is defensible. Do not add one you did not measure.
  - This runs slightly long; if it spills past one page, cut the Snyk and Cypress lines first.
-->

---

## Professional Summary

Full-stack software engineer with 3.5 years at Pluralsight, building internal curriculum and author tooling for the content and product organizations. Comfortable across the stack — React on the front end, Node.js, TypeScript, and PostgreSQL on the back end — with a particular strength in data-heavy backend pipelines. Over three years on the same product area I grew from shipping the first working versions of features to owning their reliability: I cut a core dashboard's load time from 15s to 2s as SDE 1, and later re-architected the pipeline behind it with recursive fault isolation as SDE 2. Also stepped in as acting tech lead for a small team when it was needed.

---

## Skills

- **Backend:** Node.js, Express.js, NestJS, REST APIs, event-driven systems, caching, concurrency
- **Frontend:** React, TypeScript, component-driven UI
- **Languages:** TypeScript, JavaScript (ES6+), SQL
- **Data & Messaging:** PostgreSQL, Kafka, Redis, Snowflake, TypeORM
- **Cloud & DevOps:** AWS (S3, EC2, CloudWatch, Lambda), Docker, GitLab CI/CD, Grafana, New Relic, Snyk
- **Testing:** Jest, Supertest, Cypress, integration testing
- **Design:** System design (HLD/LLD), API design, observability, performance optimization

---

## Experience

### Pluralsight India Pvt. Ltd. — Bengaluru
**Software Engineer II** | Dec 2024 – Apr 2026
*Curriculum Tool & Author Tool*

- Re-architected the pre-aggregation cron job behind the curriculum dashboard while migrating the team's cron services into a dedicated NestJS service. The previous version had been surfacing incorrect content-plan statuses to curriculum managers, so I rebuilt it with a recursive fault-isolation design: it binary-splits a failing batch until it pinpoints the bad record, alerts a Slack channel, and automatically re-runs on the isolated records, with a defined escalation path if a record still fails.
- Diagnosed and resolved a high-priority production issue in the Author Tool's Kafka consumer that was showing authors incorrect viewership data, within days of joining the team, and hardened it against the upstream null fields that caused it.
- Acted as tech lead for a 3-engineer team across 4 sprints — owned sprint planning and standups, cleared P1/P2 blockers, and kept delivery on schedule while continuing to ship my own work.
- Automated content-review scheduling: publishing a piece now emits an event that schedules its next review automatically, replacing manual date-tracking for 100+ curriculum managers.
- Built a feature-flagged self-service module that lets authorized senior curriculum managers onboard new managers directly, replacing manual database inserts and one-off Slack requests to engineering.
- Designed a dual-schema connection and credential strategy that kept cross-team data updates working after an org-wide security policy restricted schema access.
- Cleared 30+ Snyk-flagged dependency vulnerabilities within weeks of joining the Author Tool team, resolving the breaking changes each upgrade introduced.

### Pluralsight India Pvt. Ltd. — Bengaluru
**Software Engineer I** | Oct 2022 – Dec 2024
*Curriculum Tool*

- Cut a key dashboard's load time from 15s to 2s (~87%) by designing a pre-aggregation approach that replaced expensive materialized-view queries with pre-aggregated tables refreshed on a schedule, moving the aggregation cost off the request path.
- Built the Kafka pipeline behind the platform's "Top 10 Courses" analytics, processing 160M+ records and mapping each course to its curriculum manager and owning domain. Tuned throughput from 100 to 10,000 records per minute and right-sized memory and database capacity to eliminate the recurring OpsGenie memory alerts.
- Built a React/Node control panel that toggles a per-job processing flag in the database; each cron job reads its flag at the start of its run and skips its work when disabled, letting the team pause or resume specific job logic without a code deploy.
- Mentored an intern from a Figma prototype through to a shipped internal tool, later presented to leadership; the project contributed to the intern's full-time conversion.
- Ran Cypress testing sessions across teams and authored the end-to-end testing documentation later adopted by 3+ teams.

---

## Achievements

- **Spot Bonus (Q3 2025)** — for stepping in as acting tech lead across four sprints, keeping sprint goals on track and the team unblocked during delivery.
- **Spot Bonus (Q3 2024)** — for mentoring an intern through a full project lifecycle to a production-ready delivery.

---

## Additional Contributions

Cross-team engineering efforts I contributed to beyond my assigned work:

- **Service Visualization Tool** — contributed to a Node-RED–based tool that mapped producer–consumer relationships across microservices into dynamic system diagrams.
- **Lighthouse CI** — helped integrate Google Lighthouse into the CI/CD pipeline to automate frontend performance checks.

---

## Education

- **Full-Stack Web Development** — Masai School, Bengaluru (2021 – 2022)
- **B.E., Computer Engineering** — LDRP-ITR, Gandhinagar, Gujarat (2016 – 2020)
