# LeetCode SQL 50 in Postgres

LeetCode's **SQL 50** study plan, rewritten for practice in **PostgreSQL**. For each problem you get:

- the problem in plain words, plus its example input and expected output
- **what it's really testing**: the one concept the problem is built around
- **how to relate**: the words in the statement that point to that concept
- a **hint ladder**: three hints, each one closer to the answer, so you can stop as soon as it clicks
- the Postgres solution, hidden behind a click, which you open only after you've tried

Every problem's tables are loaded into the shared playground with LeetCode's example rows, plus a
few extra edge rows where hidden test cases usually fail people. So you can write your query, run
it, and see the real output.

---

## ⚡ The one idea that makes SQL problems easy

**Every SQL problem is a pipeline of shapes.** You start with rows of one shape, and each clause
changes the shape: `JOIN` makes rows wider, `WHERE` makes the set smaller, `GROUP BY` collapses
rows, a window function adds a column without collapsing anything, and `SELECT` picks the output
columns. So don't ask "what's the query?". Ask:

1. **What does ONE row of the output represent?** (one customer? one customer per month? one pair?)
2. **What does one row of each input table represent?**
3. **Which steps turn (2) into (1)?** Each step is one concept from the map below.

That is the whole method. If the output grain is "one row per customer" and the input grain is "one
row per visit", you need a `GROUP BY customer`. If the output must include customers who have *no*
rows, you need a `LEFT JOIN` (or `CROSS JOIN`) to create them. Once you name the grain, the
problem stops being about clever syntax.

---

## 🧭 How to approach any problem (say this out loud in an interview)

1. **Restate the output grain.** "The result is one row per contest, with a percentage."
2. **Find the source of every output column.** Is it in a table, or does it have to be computed?
3. **Ask the NULL and missing-row question.** "Can something have zero matches? Should it still
   appear?" If yes: `LEFT JOIN` / `COALESCE`. This one question catches about a third of all wrong answers.
4. **Ask the duplicates question.** "Can the same thing appear twice?" If yes: `COUNT(DISTINCT …)`,
   `DISTINCT`, and a choice between `RANK` and `ROW_NUMBER`.
5. **Ask the ties question.** "If two rows tie for first, do I return both?" `RANK`/`DENSE_RANK`
   return both. `ROW_NUMBER`, `LIMIT 1` and `DISTINCT ON` return one.
6. **Build it in steps with CTEs** (`WITH step AS (…)`): one idea per step, each step can be run on its own.
7. **Check the edge rows**: an empty result, NULLs, a gap in dates, a tie, integer division.

---

## 🗺️ Signal words → the concept to reach for

This is the "how to relate" table. Read the problem, spot the phrase, and pick the tool.

| When the problem says… | It's really asking for… | Read in the section notes |
|---|---|---|
| "is not X", "not referred by 2" on a nullable column | **NULL three-valued logic**: `IS DISTINCT FROM`, `IS NULL` | [01 Select](01-select.md#concept-null-is-not-a-value) |
| "for each X, show Y" when some X have no Y | **LEFT JOIN** (keep every left row) | [02 Joins](02-basic-joins.md#concept-join-types-as-keep-rules) |
| "did NOT", "never", "without any" | **Anti-join**: `LEFT JOIN … IS NULL` or `NOT EXISTS` | [02 Joins](02-basic-joins.md#concept-anti-join) |
| "every combination", "each student for each subject" | **CROSS JOIN**, then LEFT JOIN the facts | [02 Joins](02-basic-joins.md#concept-cross-join-builds-the-grid) |
| "compared with the previous day", "manager of", "pairs" | **Self-join** (a table joined to itself under two aliases) | [02 Joins](02-basic-joins.md#concept-self-join) |
| "rate", "percentage", "fraction", "ratio" | **AVG of a 1/0 flag**, or `COUNT(*) FILTER (…)` divided by a total | [03 Aggregates](03-basic-aggregates.md#concept-a-rate-is-an-average-of-0s-and-1s) |
| "approved count AND total count in one row" | **Conditional aggregation**: `FILTER (WHERE …)` / `CASE` in an aggregate | [03 Aggregates](03-basic-aggregates.md#concept-conditional-aggregation) |
| "first order", "first login", "latest price" | **First row per group**: `DISTINCT ON`, `MIN()` + join back, `ROW_NUMBER` | [03 Aggregates](03-basic-aggregates.md#concept-first-row-per-group) |
| "at least N", "more than N" of a group | **HAVING** (filter after grouping) | [04 Grouping](04-sorting-grouping.md#concept-where-vs-having) |
| "unique", "distinct" inside a count | **COUNT(DISTINCT col)** | [04 Grouping](04-sorting-grouping.md#concept-count-star-vs-count-col-vs-count-distinct) |
| "bought ALL products", "attended every" | **Relational division**: `HAVING COUNT(DISTINCT) = (SELECT COUNT(*) …)` | [04 Grouping](04-sorting-grouping.md#concept-relational-division) |
| "if none, return null" | **Aggregate over an empty set is NULL** / scalar subquery | [04 Grouping](04-sorting-grouping.md#concept-empty-set-returns-null) |
| "three times in a row", "consecutive" | **LAG / LEAD** (look at neighbouring rows) | [05 Advanced](05-advanced-select-joins.md#concept-lag-and-lead) |
| "running total", "cumulative", "up to this turn" | **SUM() OVER (ORDER BY …)** | [05 Advanced](05-advanced-select-joins.md#concept-running-totals) |
| "categories with zero rows must still show" | **Generate the categories** (`VALUES`) and LEFT JOIN | [05 Advanced](05-advanced-select-joins.md#concept-make-rows-that-dont-exist) |
| "value at a given date", "as of" | **Latest row on or before a date**, with a default | [05 Advanced](05-advanced-select-joins.md) (1164) |
| "top 3 per department", "Nth highest" | **DENSE_RANK / RANK / ROW_NUMBER OVER (PARTITION BY …)** | [06 Subqueries](06-subqueries.md#concept-the-three-ranking-functions) |
| "moving average", "last 7 days" | **Window frame**: `ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` | [06 Subqueries](06-subqueries.md#concept-window-frames) |
| "two separate answers in one result" | **UNION ALL** of two parenthesised queries | [06 Subqueries](06-subqueries.md#concept-union-vs-union-all) |
| "starts with", "contains a word", "valid format" | **LIKE** vs **regex** (`~`), anchors, escaping | [07 Strings](07-advanced-strings-regex.md#concept-like-vs-regex) |
| "comma-separated list of…" | **string_agg** (Postgres's GROUP_CONCAT) | [07 Strings](07-advanced-strings-regex.md#concept-string_agg) |
| "delete duplicates, keep smallest id" | **DELETE … USING** (delete with a self-join) | [07 Strings](07-advanced-strings-regex.md) (196) |

---

## 🐘 Postgres vs MySQL: the gotchas that cost points

LeetCode's discussion answers are mostly MySQL. When you copy an idea, check these:

| MySQL habit | What happens in Postgres | Do this instead |
|---|---|---|
| `IFNULL(x, 0)` | Doesn't exist | `COALESCE(x, 0)` (standard SQL, works everywhere) |
| `5 / 2` = 2.5 | **Integer division**: `5 / 2` = **2** | Make one side decimal: `5 * 1.0 / 2`, `x::numeric / y`, or `100.0 * …` |
| `ROUND(float_col, 2)` | **Error**: `round(double precision, integer)` doesn't exist | Cast first: `ROUND(col::numeric, 2)` |
| `DATEDIFF(a, b)` | Doesn't exist | `a - b` on two `date`s gives an integer number of days |
| `DATE_ADD(d, INTERVAL 1 DAY)` | Doesn't exist | `d + 1` (date + int) or `d + INTERVAL '1 day'` |
| `DATE_FORMAT(d, '%Y-%m')` | Doesn't exist | `to_char(d, 'YYYY-MM')` |
| `GROUP_CONCAT(x ORDER BY x SEPARATOR ',')` | Doesn't exist | `string_agg(x, ',' ORDER BY x)` |
| `REGEXP` / `RLIKE` | Doesn't exist | `~` (case-sensitive), `~*` (case-insensitive) |
| `SELECT name, MAX(x) … GROUP BY id` with ungrouped columns | **Error** unless `id` is the primary key | Group by every non-aggregated column, or use `DISTINCT ON` |
| `DELETE p1 FROM Person p1, Person p2 WHERE …` | Syntax error | `DELETE FROM Person p1 USING Person p2 WHERE …` |
| `LIMIT 1, 1` (offset, count) | Syntax error | `LIMIT 1 OFFSET 1` |
| Booleans as `1 / 0` | `true` is not a number | `CASE WHEN … THEN 1 ELSE 0 END`, or `(cond)::int` |
| Column `recordDate` keeps its case | Unquoted names fold to lowercase (`recorddate`) | Fine to write either. Quote only if the table was created with quotes. |

**Postgres-only tools worth using** (and naming in an interview): `DISTINCT ON`, `FILTER (WHERE …)`,
`IS DISTINCT FROM`, `string_agg`, `~` regex with `\m` word anchors, `generate_series`, `date - int`.

---

## 🏃 Run it

**In the browser (recommended for practice):** the [Interview Prep Hub](../../hub/README.md)
renders every problem here as a page with an SQL editor next to it. It runs real Postgres in the
tab and grades your answer against the reference output.

```bash
cd ../../hub && npm install && npm run dev
```

**From the terminal:**

```bash
cd ../playground && npm install
```

```bash
npm run q -- leetcode/02
```

That prints every solution in section 02 with its output. To solve a problem yourself first, open
`playground/queries/scratch.sql`, write the problem's schema line, then your query:

```sql
SET search_path TO lc1581;   -- every problem has its own schema: lc + the LeetCode number
SELECT * FROM Visits;        -- look at the data first, always
```

```bash
npm run q -- scratch
```

The seed lives in [`playground/seed/04-leetcode-sql50.sql`](../playground/seed/04-leetcode-sql50.sql).
Solutions are in [`playground/queries/leetcode/`](../playground/queries/leetcode/) (spoilers).

---

## 📚 Sections

| # | Section | Problems | Core concepts |
|---|---------|----------|---------------|
| 01 | [Select](01-select.md) | 5 | WHERE, AND/OR, NULL logic, DISTINCT, string length |
| 02 | [Basic Joins](02-basic-joins.md) | 9 | INNER/LEFT/CROSS join, anti-join, self-join, conditional aggregation |
| 03 | [Basic Aggregate Functions](03-basic-aggregates.md) | 8 | AVG/SUM/COUNT, rates as averages, FILTER, first row per group, integer division |
| 04 | [Sorting and Grouping](04-sorting-grouping.md) | 7 | GROUP BY, HAVING, COUNT(DISTINCT), relational division, empty-set NULL |
| 05 | [Advanced Select and Joins](05-advanced-select-joins.md) | 7 | CASE, LAG/LEAD, running totals, generating missing rows, "as of" lookups |
| 06 | [Subqueries](06-subqueries.md) | 7 | correlated vs uncorrelated, NOT EXISTS, ranking functions, window frames, UNION ALL |
| 07 | [Advanced String Functions / Regex / Clause](07-advanced-strings-regex.md) | 7 | string functions, LIKE vs regex, DELETE USING, Nth highest, string_agg, date ranges |

**About the sections.** In your list, "Advanced Select and Joins" appeared as a problem inside
Sorting and Grouping. On LeetCode it's a separate section header, and the seven problems after it
(1731 → 1907) belong to it. These notes follow LeetCode's layout, so there are seven sections and
50 problems.

---

## 🗓️ Study plan (14 days, about 1 hour a day)

The order is chosen so that each day's concept is used by the next day's problems. Each day: read
the "Concepts" block at the top of the section first, then solve the problems **without opening
the solution**. Use one hint at a time.

| Day | Do | Concept you're locking in | Problems |
|----|----|---------------------------|----------|
| 1 | Section 01 (all) + this README's method | Filtering, **NULL logic** | 1757, 584, 595, 1148, 1683 |
| 2 | Section 02, first half | LEFT JOIN, **anti-join**, self-join | 1378, 1068, 1581, 197 |
| 3 | Section 02, second half | **CROSS JOIN grid**, self-join + HAVING, rates | 1661, 577, 1280, 570, 1934 |
| 4 | Section 03, first half | AVG, weighted average, **integer division** | 620, 1251, 1075, 1633 |
| 5 | Section 03, second half | **FILTER**, first row per group | 1211, 1193, 1174, 550 |
| 6 | Section 04 | **HAVING**, COUNT(DISTINCT), **relational division** | 2356, 1141, 1070, 596, 1729, 619, 1045 |
| 7 | **Review day**: redo every problem you needed hint 3 for, from memory | Spaced repetition | Your misses |
| 8 | Section 05, first half | CASE, self-join on reports, "one or the other" rows | 1731, 1789, 610 |
| 9 | Section 05, second half | **LAG/LEAD**, **running totals**, "as of" lookups | 180, 1164, 1204, 1907 |
| 10 | Section 06, first half | **NOT EXISTS**, CASE on ids, **UNION ALL** | 1978, 626, 1341 |
| 11 | Section 06, second half | **Window frames**, window COUNT, **DENSE_RANK** | 1321, 602, 585, 185 |
| 12 | Section 07 | String functions, **regex**, DELETE USING, Nth highest | 1667, 1527, 196, 176, 1484, 1327, 1517 |
| 13 | **Mixed timed drill**: 8 random problems, 10 min each, no hints | Recognising the pattern cold | Random |
| 14 | **The hard ones again**, explained out loud as in an interview | 185, 1321, 1164, 1070, 550, 626 | |

**How to tell you've mastered a problem:** you can name its concept from the title alone ("1280:
that's a cross-join grid"), and you can say why the obvious wrong answer is wrong.

---

## ✅ Progress tracker

Tick these off as you go. "Concept" is the one word to remember the problem by.

| # | Problem | Diff | Concept | Done |
|---|---------|------|---------|------|
| 1757 | [Recyclable and Low Fat Products](01-select.md#1757--recyclable-and-low-fat-products) | E | WHERE + AND | ☐ |
| 584 | [Find Customer Referee](01-select.md#584--find-customer-referee) | E | NULL logic | ☐ |
| 595 | [Big Countries](01-select.md#595--big-countries) | E | OR | ☐ |
| 1148 | [Article Views I](01-select.md#1148--article-views-i) | E | DISTINCT | ☐ |
| 1683 | [Invalid Tweets](01-select.md#1683--invalid-tweets) | E | char_length | ☐ |
| 1378 | [Replace Employee ID With The Unique Identifier](02-basic-joins.md#1378--replace-employee-id-with-the-unique-identifier) | E | LEFT JOIN | ☐ |
| 1068 | [Product Sales Analysis I](02-basic-joins.md#1068--product-sales-analysis-i) | E | INNER JOIN | ☐ |
| 1581 | [Customer Who Visited but Did Not Make Any Transactions](02-basic-joins.md#1581--customer-who-visited-but-did-not-make-any-transactions) | E | Anti-join | ☐ |
| 197 | [Rising Temperature](02-basic-joins.md#197--rising-temperature) | E | Self-join on date | ☐ |
| 1661 | [Average Time of Process per Machine](02-basic-joins.md#1661--average-time-of-process-per-machine) | E | Pivot with FILTER | ☐ |
| 577 | [Employee Bonus](02-basic-joins.md#577--employee-bonus) | E | LEFT JOIN + NULL | ☐ |
| 1280 | [Students and Examinations](02-basic-joins.md#1280--students-and-examinations) | E | CROSS JOIN grid | ☐ |
| 570 | [Managers with at Least 5 Direct Reports](02-basic-joins.md#570--managers-with-at-least-5-direct-reports) | M | Self-join + HAVING | ☐ |
| 1934 | [Confirmation Rate](02-basic-joins.md#1934--confirmation-rate) | M | AVG of a flag | ☐ |
| 620 | [Not Boring Movies](03-basic-aggregates.md#620--not-boring-movies) | E | Modulo + ORDER BY | ☐ |
| 1251 | [Average Selling Price](03-basic-aggregates.md#1251--average-selling-price) | E | Range join + weighted avg | ☐ |
| 1075 | [Project Employees I](03-basic-aggregates.md#1075--project-employees-i) | E | AVG + ROUND | ☐ |
| 1633 | [Percentage of Users Attended a Contest](03-basic-aggregates.md#1633--percentage-of-users-attended-a-contest) | E | Scalar-subquery denominator | ☐ |
| 1211 | [Queries Quality and Percentage](03-basic-aggregates.md#1211--queries-quality-and-percentage) | E | AVG of ratio + flag | ☐ |
| 1193 | [Monthly Transactions I](03-basic-aggregates.md#1193--monthly-transactions-i) | M | FILTER + to_char | ☐ |
| 1174 | [Immediate Food Delivery II](03-basic-aggregates.md#1174--immediate-food-delivery-ii) | M | First row per group | ☐ |
| 550 | [Game Play Analysis IV](03-basic-aggregates.md#550--game-play-analysis-iv) | M | First day + 1 | ☐ |
| 2356 | [Number of Unique Subjects Taught by Each Teacher](04-sorting-grouping.md#2356--number-of-unique-subjects-taught-by-each-teacher) | E | COUNT(DISTINCT) | ☐ |
| 1141 | [User Activity for the Past 30 Days I](04-sorting-grouping.md#1141--user-activity-for-the-past-30-days-i) | E | Date window | ☐ |
| 1070 | [Product Sales Analysis III](04-sorting-grouping.md#1070--product-sales-analysis-iii) | M | RANK keeps ties | ☐ |
| 596 | [Classes With at Least 5 Students](04-sorting-grouping.md#596--classes-with-at-least-5-students) | E | HAVING | ☐ |
| 1729 | [Find Followers Count](04-sorting-grouping.md#1729--find-followers-count) | E | GROUP BY + ORDER BY | ☐ |
| 619 | [Biggest Single Number](04-sorting-grouping.md#619--biggest-single-number) | E | Empty set → NULL | ☐ |
| 1045 | [Customers Who Bought All Products](04-sorting-grouping.md#1045--customers-who-bought-all-products) | M | Relational division | ☐ |
| 1731 | [The Number of Employees Which Report to Each Employee](05-advanced-select-joins.md#1731--the-number-of-employees-which-report-to-each-employee) | E | Self-join + AVG | ☐ |
| 1789 | [Primary Department for Each Employee](05-advanced-select-joins.md#1789--primary-department-for-each-employee) | E | OR across two rules | ☐ |
| 610 | [Triangle Judgement](05-advanced-select-joins.md#610--triangle-judgement) | E | CASE | ☐ |
| 180 | [Consecutive Numbers](05-advanced-select-joins.md#180--consecutive-numbers) | M | LEAD | ☐ |
| 1164 | [Product Price at a Given Date](05-advanced-select-joins.md#1164--product-price-at-a-given-date) | M | Latest-as-of + default | ☐ |
| 1204 | [Last Person to Fit in the Bus](05-advanced-select-joins.md#1204--last-person-to-fit-in-the-bus) | M | Running total | ☐ |
| 1907 | [Count Salary Categories](05-advanced-select-joins.md#1907--count-salary-categories) | M | Generate missing rows | ☐ |
| 1978 | [Employees Whose Manager Left the Company](06-subqueries.md#1978--employees-whose-manager-left-the-company) | E | NOT EXISTS | ☐ |
| 626 | [Exchange Seats](06-subqueries.md#626--exchange-seats) | M | CASE on id | ☐ |
| 1341 | [Movie Rating](06-subqueries.md#1341--movie-rating) | M | UNION ALL of two tops | ☐ |
| 1321 | [Restaurant Growth](06-subqueries.md#1321--restaurant-growth) | M | Moving window frame | ☐ |
| 602 | [Friend Requests II: Who Has the Most Friends](06-subqueries.md#602--friend-requests-ii-who-has-the-most-friends) | M | Unpivot with UNION ALL | ☐ |
| 585 | [Investments in 2016](06-subqueries.md#585--investments-in-2016) | M | Window COUNT | ☐ |
| 185 | [Department Top Three Salaries](06-subqueries.md#185--department-top-three-salaries) | H | DENSE_RANK | ☐ |
| 1667 | [Fix Names in a Table](07-advanced-strings-regex.md#1667--fix-names-in-a-table) | E | UPPER/LOWER/SUBSTRING | ☐ |
| 1527 | [Patients With a Condition](07-advanced-strings-regex.md#1527--patients-with-a-condition) | E | Word-boundary match | ☐ |
| 196 | [Delete Duplicate Emails](07-advanced-strings-regex.md#196--delete-duplicate-emails) | E | DELETE USING | ☐ |
| 176 | [Second Highest Salary](07-advanced-strings-regex.md#176--second-highest-salary) | M | OFFSET + NULL wrapper | ☐ |
| 1484 | [Group Sold Products By The Date](07-advanced-strings-regex.md#1484--group-sold-products-by-the-date) | E | string_agg | ☐ |
| 1327 | [List the Products Ordered in a Period](07-advanced-strings-regex.md#1327--list-the-products-ordered-in-a-period) | E | Half-open date range | ☐ |
| 1517 | [Find Users With Valid E-Mails](07-advanced-strings-regex.md#1517--find-users-with-valid-e-mails) | E | Anchored regex | ☐ |

**Problem statements here are paraphrased.** Read the original on LeetCode for exact column
names and the output format before you submit.
