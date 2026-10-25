# 05 · Advanced Select and Joins

[← 04 Sorting and Grouping](04-sorting-grouping.md) · [SQL 50 home](README.md) · Next: [06 Subqueries →](06-subqueries.md)

This is where **window functions** become the main tool. Window functions are the most valuable
SQL topic for interviews: they solve "consecutive", "running total", "previous value", "top N per
group" and "as-of" questions cleanly, and many candidates can't write them from memory. Learn the
concepts block properly. Section 06 builds on it.

**Run the solutions:** `npm run q -- leetcode/05` (from `../playground`).

---

## Concepts for this section

### Concept: what a window function is

`GROUP BY` collapses rows. A **window function computes over a group of rows but keeps every
row**: it adds a column instead of collapsing.

```sql
function(...) OVER (
  PARTITION BY a    -- separate windows per a (like GROUP BY, but nothing collapses); optional
  ORDER BY b        -- order inside each window (needed for LAG, ranks, running totals)
  ROWS BETWEEN ...  -- the frame: which rows around the current one count (section 06)
)
```

| Family | Functions | Typical question |
|---|---|---|
| Neighbours | `LAG(x, n)`, `LEAD(x, n)` | previous/next value, consecutive runs |
| Ranking | `ROW_NUMBER`, `RANK`, `DENSE_RANK` | top N per group, Nth highest |
| Aggregates as windows | `SUM / AVG / COUNT / MAX (…) OVER` | running totals, moving averages, "count of others like me" |

**Two rules that catch everyone:**
1. You **can't** use a window function in `WHERE` (WHERE runs before SELECT). Compute it in a subquery or CTE, then filter outside.
2. `ORDER BY` inside `OVER` changes the meaning of aggregates: `SUM(x) OVER ()` is the grand total on every row, while `SUM(x) OVER (ORDER BY t)` is a **running** total.

### Concept: LAG and LEAD

`LAG(num) OVER (ORDER BY id)` = `num` from the **previous row** in id order. `LEAD(num, 2)` =
`num` from **two rows ahead**. At the edges they return NULL (or a default you pass as the third
argument).

**How to relate:** "consecutive", "in a row", "compared with the previous one", "changed from".
But remember 197: "previous **row**" is not "previous **day**" when there are gaps.

### Concept: running totals

`SUM(weight) OVER (ORDER BY turn)` = the sum of everything up to and including this row. **How to
relate:** "cumulative", "so far", "until the limit is reached", "balance after each transaction".

**Subtle default:** with an `ORDER BY` and no explicit frame, the frame is `RANGE … CURRENT ROW`,
which includes **ties** with the current row. If the order column can tie, write
`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` to get a strict row-by-row running total.

### Concept: make rows that don't exist

You can't GROUP rows into a category that has no rows, so "Average Salary: 0" can never come out
of `GROUP BY category`. Create the categories yourself and LEFT JOIN the data onto them:

```sql
FROM (VALUES ('Low'), ('Average'), ('High')) AS c(category)   -- an inline table
LEFT JOIN …
```

Related Postgres tool: `generate_series('2024-01-01'::date, '2024-01-31', '1 day')` creates every
day, which is what you need for "show zero for days with no sales". Same idea as the CROSS JOIN
grid in 1280.

### Concept: CASE

`CASE WHEN cond THEN a WHEN cond2 THEN b ELSE c END` is SQL's if/else, usable anywhere an
expression is allowed: `SELECT`, `WHERE`, `ORDER BY`, inside aggregates, and even in `ON`. Conditions
are checked **top to bottom**, and the first true one wins, so put narrower ranges first.

---

## 1731 · The Number of Employees Which Report to Each Employee

**Difficulty:** Easy · **Schema:** `lc1731`

**Problem.** `Employees(employee_id, name, reports_to, age)`. A **manager** is anyone with at least
one direct report. For each manager, return their id, name, number of direct reports, and the
average age of those reports **rounded to the nearest integer**. Order by employee_id.

**Example.**

Employees: (9, Hercy, null, 43), (6, Alice, 9, 41), (4, Bob, 9, 36), (2, Winston, null, 37)

Output:

| employee_id | name | reports_count | average_age |
|---|---|---|---|
| 9 | Hercy | 2 | 39 |

((41 + 36) / 2 = 38.5, which rounds to 39.)

**What it's really testing:** self-join + aggregation (570's pattern), plus rounding.

**How to relate:** manager info and report info are both in Employees → self-join. "Only managers" → an INNER JOIN drops everyone with no reports.

**Hint ladder.**
1. `Employees m` (manager) joined to `Employees e` (report) on `e.reports_to = m.employee_id`.
2. Group by the manager, count the reports, average their ages.
3. `ROUND(AVG(e.age))`. Postgres rounds numeric .5 **away from zero**, so 38.5 → 39.

<details>
<summary>Solution</summary>

```sql
SELECT m.employee_id, m.name,
       COUNT(*)          AS reports_count,
       ROUND(AVG(e.age)) AS average_age
FROM Employees m
JOIN Employees e ON e.reports_to = m.employee_id
GROUP BY m.employee_id, m.name
ORDER BY m.employee_id;
```

**Rounding gotcha:** `round()` on a `numeric` rounds half away from zero (38.5 → 39). On a
`double precision` it rounds half to even (38.5 → 38). `AVG(int)` returns numeric, so you're safe here.

</details>

---

## 1789 · Primary Department for Each Employee

**Difficulty:** Easy · **Schema:** `lc1789`

**Problem.** `Employee(employee_id, department_id, primary_flag)`. An employee in several
departments marks one as primary with 'Y'. An employee in **only one** department has it marked
'N'. Return each employee's primary department.

**Example.**

Employee: (1, 1, N), (2, 1, Y), (2, 2, N), (3, 3, N), (4, 2, N), (4, 3, Y), (4, 4, N)

Output: 1 → 1, 2 → 1, 3 → 3, 4 → 3

**What it's really testing:** expressing **two rules joined by OR**, where one rule is about a
row ('Y') and the other is about the group (only one row).

**How to relate:** "the flagged row, **or** the only row" → two conditions. The second needs a
per-employee count, from a subquery or a window.

**Hint ladder.**
1. Rule A is easy: `primary_flag = 'Y'`.
2. Rule B: employees with exactly one row. That's `GROUP BY employee_id HAVING COUNT(*) = 1`.
3. `WHERE primary_flag = 'Y' OR employee_id IN (rule B)`. Or add `COUNT(*) OVER (PARTITION BY employee_id)` as a column and filter on it.

<details>
<summary>Solution</summary>

```sql
SELECT employee_id, department_id
FROM Employee
WHERE primary_flag = 'Y'
   OR employee_id IN (SELECT employee_id FROM Employee GROUP BY employee_id HAVING COUNT(*) = 1);

-- Window version: one pass, no subquery against the table
SELECT employee_id, department_id
FROM (
  SELECT *, COUNT(*) OVER (PARTITION BY employee_id) AS dept_count
  FROM Employee
) e
WHERE primary_flag = 'Y' OR dept_count = 1;
```

</details>

---

## 610 · Triangle Judgement

**Difficulty:** Easy · **Schema:** `lc610`

**Problem.** `Triangle(x, y, z)`, three segment lengths per row. Add a column `triangle` saying
'Yes' if the three can form a triangle, otherwise 'No'.

**Example.**

Triangle: (13, 15, 30), (10, 20, 15)

Output: (13, 15, 30, **No**), (10, 20, 15, **Yes**)

**What it's really testing:** `CASE` in `SELECT`, and the triangle inequality (any two sides must add up to more than the third).

**How to relate:** "a column that says Yes or No depending on a condition" → `CASE`.

**Hint ladder.**
1. The rule: x + y > z, x + z > y and y + z > x, all three.
2. Put those three conditions into a `CASE WHEN … THEN 'Yes' ELSE 'No' END`.
3. Select `x, y, z` plus that CASE expression, aliased `triangle`.

<details>
<summary>Solution</summary>

```sql
SELECT x, y, z,
       CASE WHEN x + y > z AND x + z > y AND y + z > x THEN 'Yes' ELSE 'No' END AS triangle
FROM Triangle;
```

</details>

---

## 180 · Consecutive Numbers

**Difficulty:** Medium · **Schema:** `lc180`

**Problem.** `Logs(id, num)`, where id increases 1, 2, 3, … Find every number that appears **at
least three times in a row**. Return the column as `ConsecutiveNums`.

**Example.**

Logs: (1, 1), (2, 1), (3, 1), (4, 2), (5, 1), (6, 2), (7, 2)

Output: `1`

(Rows 1–3 are 1, 1, 1. The number 2 never appears three times in a row.)

**What it's really testing:** **LAG / LEAD**, or the older triple self-join.

**How to relate:** "in a row", "consecutive" → each row needs to see its neighbours.

**Hint ladder.**
1. For each row, put the next row's num and the num after that into extra columns.
2. `LEAD(num, 1) OVER (ORDER BY id)` and `LEAD(num, 2) OVER (ORDER BY id)`. Do it in a subquery, because window functions can't go in WHERE.
3. Outside: `WHERE num = next1 AND num = next2`. Add `DISTINCT`, because a run of 4 matches twice.

<details>
<summary>Solution</summary>

```sql
SELECT DISTINCT num AS ConsecutiveNums
FROM (
  SELECT num,
         LEAD(num, 1) OVER (ORDER BY id) AS next1,
         LEAD(num, 2) OVER (ORDER BY id) AS next2
  FROM Logs
) w
WHERE num = next1 AND num = next2;

-- Classic triple self-join (relies on ids having no gaps)
SELECT DISTINCT l1.num AS ConsecutiveNums
FROM Logs l1
JOIN Logs l2 ON l2.id = l1.id + 1 AND l2.num = l1.num
JOIN Logs l3 ON l3.id = l1.id + 2 AND l3.num = l1.num;
```

**Interview follow-up:** "what if ids have gaps?" The self-join breaks, because it needs `id + 1`
to exist. LEAD over `ORDER BY id` keeps working, since it uses row order rather than id
arithmetic. For "N in a row" with a large N, use the **gaps-and-islands** trick:
`id - ROW_NUMBER() OVER (PARTITION BY num ORDER BY id)` is constant within a run, so group by it
and keep the groups with `COUNT(*) >= N`.

</details>

---

## 1164 · Product Price at a Given Date

**Difficulty:** Medium · **Schema:** `lc1164`

**Problem.** `Products(product_id, new_price, change_date)`. Every product starts at price **10**.
Each row is a price change. Find every product's price **on 2019-08-16**.

**Example.**

Products: (1, 20, 08-14), (2, 50, 08-14), (1, 30, 08-15), (1, 35, 08-16), (2, 65, 08-17), (3, 20, 08-18)

Output: 1 → `35`, 2 → `50`, 3 → `10`

(Product 2's change to 65 is after the date. Product 3 has no change on or before the date, so it's
still 10.)

**What it's really testing:** an **"as-of" lookup** (the latest row on or before a date) plus a
**default** for items that have no such row. This is a very common real-world query, the same
shape as "exchange rate on date X" or "user's plan on date X".

**How to relate:** "price **at** a date", given a history of changes → the latest change with
`change_date <= date`. "Products with no change yet" must still appear → you need the full product
list on the left of a LEFT JOIN.

**Hint ladder.**
1. Split it in two: (a) every product id, (b) for products with a change by 08-16, the latest such change.
2. (b) is first-row-per-group on filtered rows: `WHERE change_date <= '2019-08-16'`, then `DISTINCT ON (product_id) … ORDER BY product_id, change_date DESC`.
3. `(a) LEFT JOIN (b)`, with `COALESCE(new_price, 10)`.

<details>
<summary>Solution</summary>

```sql
SELECT p.product_id,
       COALESCE(latest.new_price, 10) AS price
FROM (SELECT DISTINCT product_id FROM Products) p
LEFT JOIN (
  SELECT DISTINCT ON (product_id) product_id, new_price
  FROM Products
  WHERE change_date <= DATE '2019-08-16'
  ORDER BY product_id, change_date DESC
) latest ON latest.product_id = p.product_id;

-- UNION version: products that changed by the date, plus products that didn't
SELECT product_id, new_price AS price
FROM Products
WHERE (product_id, change_date) IN (
  SELECT product_id, MAX(change_date) FROM Products WHERE change_date <= '2019-08-16' GROUP BY product_id
)
UNION ALL
SELECT product_id, 10
FROM Products
GROUP BY product_id
HAVING MIN(change_date) > '2019-08-16';
```

**Trap:** putting `WHERE change_date <= …` on the **outer** query removes product 3 completely.
The filter belongs inside the "latest price" part only.

</details>

---

## 1204 · Last Person to Fit in the Bus

**Difficulty:** Medium · **Schema:** `lc1204`

**Problem.** `Queue(person_id, person_name, weight, turn)`. People board in `turn` order, and the
bus holds at most **1000 kg**. Return the name of the **last person who can board** without going
over the limit.

**Example.**

Queue (in turn order): Alice 250 (1), Alex 350 (2), John Cena 400 (3), Marie 200 (4), Bob 175 (5), Winston 500 (6)

Running totals: 250, 600, **1000**, 1200, 1375, 1875

Output: `John Cena`

**What it's really testing:** the **running total** with `SUM() OVER (ORDER BY …)`.

**How to relate:** "people board one by one until a limit" → a cumulative sum in boarding order.
"The last one who fits" → the largest turn whose running total is ≤ 1000.

**Hint ladder.**
1. Add a column: the total weight on the bus after each person boards.
2. `SUM(weight) OVER (ORDER BY turn)`, in a subquery.
3. Outside: `WHERE total <= 1000 ORDER BY turn DESC LIMIT 1`.

<details>
<summary>Solution</summary>

```sql
SELECT person_name
FROM (
  SELECT person_name, turn, SUM(weight) OVER (ORDER BY turn) AS total_weight
  FROM Queue
) boarding
WHERE total_weight <= 1000
ORDER BY turn DESC
LIMIT 1;

-- Self-join version (O(n²), the pre-window way): sum the weights of everyone at or before my turn
SELECT q1.person_name
FROM Queue q1
JOIN Queue q2 ON q2.turn <= q1.turn
GROUP BY q1.turn, q1.person_name
HAVING SUM(q2.weight) <= 1000
ORDER BY q1.turn DESC
LIMIT 1;
```

**Talking point:** the self-join compares every pair of people, so it's O(n²). The window version
does a single sorted pass. When someone shows the self-join, mentioning that cost is a good senior
signal.

</details>

---

## 1907 · Count Salary Categories

**Difficulty:** Medium · **Schema:** `lc1907`

**Problem.** `Accounts(account_id, income)`. Count the accounts in each category: **Low Salary**
(< 20000), **Average Salary** (20000 to 50000 inclusive), **High Salary** (> 50000). **All three
categories must appear**, even with a count of 0.

**Example.**

Accounts: (3, 108939), (2, 12747), (8, 87709), (6, 91796)

Output:

| category | accounts_count |
|---|---|
| Low Salary | 1 |
| Average Salary | 0 |
| High Salary | 3 |

**What it's really testing:** **producing rows that the data doesn't contain** (the zero-count
category).

**How to relate:** "all categories must appear, even with 0" → `GROUP BY CASE …` can only produce
categories that have rows, so the categories have to come from somewhere else.

**Hint ladder.**
1. Try `GROUP BY CASE …` first. Which category goes missing, and why?
2. Either generate the three categories (`VALUES`) and LEFT JOIN the accounts onto them, or…
3. …compute all three counts with `COUNT(*) FILTER (WHERE …)` and stack them with `UNION ALL`. Each SELECT always returns exactly one row.

<details>
<summary>Solution</summary>

```sql
-- UNION ALL of three one-row aggregates (simplest to read)
SELECT 'Low Salary' AS category, COUNT(*) FILTER (WHERE income < 20000) AS accounts_count FROM Accounts
UNION ALL
SELECT 'Average Salary', COUNT(*) FILTER (WHERE income BETWEEN 20000 AND 50000) FROM Accounts
UNION ALL
SELECT 'High Salary', COUNT(*) FILTER (WHERE income > 50000) FROM Accounts;

-- Generated categories + LEFT JOIN
SELECT c.category, COUNT(a.account_id) AS accounts_count
FROM (VALUES ('Low Salary'), ('Average Salary'), ('High Salary')) AS c(category)
LEFT JOIN Accounts a
       ON c.category = CASE
                         WHEN a.income < 20000  THEN 'Low Salary'
                         WHEN a.income <= 50000 THEN 'Average Salary'
                         ELSE 'High Salary'
                       END
GROUP BY c.category;
```

</details>

---

## 🧠 Section recap

| If you see… | Reach for |
|---|---|
| "in a row", "consecutive" | `LEAD` / `LAG` (or gaps-and-islands for N in a row) |
| "cumulative", "until the limit" | `SUM() OVER (ORDER BY …)` |
| "price/plan/rate **as of** a date" | latest row with `date <= X` per key + LEFT JOIN + `COALESCE` default |
| "every category, even with 0" | `VALUES` / `generate_series` + LEFT JOIN, or `UNION ALL` of one-row aggregates |
| "the flagged row or the only row" | `OR` + per-group count (subquery or `COUNT(*) OVER`) |
| Filtering on a window result | Wrap it in a subquery. WHERE can't see windows. |
