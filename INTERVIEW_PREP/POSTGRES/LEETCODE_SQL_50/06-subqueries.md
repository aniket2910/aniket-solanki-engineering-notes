# 06 · Subqueries

[← 05 Advanced Select and Joins](05-advanced-select-joins.md) · [SQL 50 home](README.md) · Next: [07 Strings / Regex / Clause →](07-advanced-strings-regex.md)

The section is called "Subqueries", but most of these are really about **breaking a problem into
steps**: compute something, then query the result. CTEs (`WITH`) make that readable. This section
also has the two most-asked SQL interview problems: **Department Top Three Salaries** (ranking
functions) and **Restaurant Growth** (moving windows).

**Run the solutions:** `npm run q -- leetcode/06` (from `../playground`).

---

## Concepts for this section

### Concept: the kinds of subquery

| Kind | Returns | Where it goes | Example |
|---|---|---|---|
| **Scalar** | one value | anywhere a value goes | `WHERE salary > (SELECT AVG(salary) FROM E)` |
| **Row/table** | a set of rows | `FROM (…) alias`, `IN (…)` | `FROM (SELECT … GROUP BY …) t` |
| **Correlated** | depends on the outer row | `WHERE EXISTS (… WHERE inner.x = outer.x)` | "a manager row exists for *this* employee" |

A **correlated** subquery conceptually runs once per outer row. Postgres usually rewrites
`EXISTS` / `NOT EXISTS` into a semi-join or anti-join, so it's fast. A correlated **scalar**
subquery in `SELECT` really can run once per row, so prefer a join or a window there.

### Concept: CTEs are named steps

```sql
WITH daily AS (…),            -- step 1
     windowed AS (… FROM daily …)  -- step 2 uses step 1
SELECT … FROM windowed;       -- answer
```

Since Postgres 12, a CTE used once is **inlined** (optimised like a subquery), so readability costs
nothing. In an interview, writing CTEs step by step and saying what each one produces is the
easiest way to look organised.

### Concept: the three ranking functions

For salaries **100, 90, 90, 80** in descending order:

| Function | Gives | Use when |
|---|---|---|
| `ROW_NUMBER()` | 1, 2, 3, 4 | exactly N rows, ties broken arbitrarily ("pick one") |
| `RANK()` | 1, 2, 2, **4** | ties share a rank, then a **gap** (sports ranking) |
| `DENSE_RANK()` | 1, 2, 2, **3** | ties share a rank, **no gap**: "top N **distinct** values" |

**How to relate:** "top three **unique** salaries" or "Nth highest **distinct**" → `DENSE_RANK`.
"First sale (keep ties)" → `RANK`. "One row per group" → `ROW_NUMBER`. Pick out loud and say
*why*. Interviewers ask exactly this.

### Concept: window frames

The frame is the set of rows, relative to the current row, that an aggregate window looks at:

```sql
SUM(amount) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)   -- last 7 rows
AVG(x)      OVER (ORDER BY day RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW) -- last 7 calendar days
```

`ROWS` counts **rows**, and `RANGE` with an interval counts **values** (actual dates). If one day
can be missing from the data, `ROWS 6 PRECEDING` quietly spans more than 7 days, while `RANGE '6
days'` stays correct. Mentioning this difference is a strong signal.

Use the `WINDOW w AS (…)` clause to name a frame once and reuse it in several columns.

### Concept: UNION vs UNION ALL

`UNION` removes duplicates, which costs a sort or hash. `UNION ALL` just stacks the rows. Default
to `UNION ALL` unless you **need** de-duplication, and say so. If you want `ORDER BY … LIMIT`
inside one half of a union, wrap that half in parentheses.

---

## 1978 · Employees Whose Manager Left the Company

**Difficulty:** Easy · **Schema:** `lc1978`

**Problem.** `Employees(employee_id, name, manager_id, salary)`. When a manager leaves, their row
is deleted but their reports still point to them. Find employees with salary **< 30000** whose
manager has **left** (manager_id set, but no such employee exists). Order by employee_id.

**Example.**

Employees: (3, Mila, 9, 60301), (12, Antonella, null, 31000), (13, Emery, null, 67084),
(1, Kalel, 11, 21241), (9, Mikaela, null, 50937), (11, Joziah, 6, 28485)

Output: `11`

(Joziah earns 28485, and manager 6 doesn't exist. Kalel earns 21241, but manager 11, Joziah, still
exists.)

**What it's really testing:** an **anti-join** (`NOT EXISTS`), and the `NOT IN` + NULL trap.

**How to relate:** "manager **is not** in the table" → no matching row → NOT EXISTS.

**Hint ladder.**
1. Two conditions: low salary, and the manager is missing.
2. "Missing" = no row in Employees with `employee_id = this.manager_id`.
3. `NOT EXISTS (SELECT 1 FROM Employees m WHERE m.employee_id = e.manager_id)`, plus `manager_id IS NOT NULL` (having no manager is not the same as a manager who left).

<details>
<summary>Solution</summary>

```sql
SELECT employee_id
FROM Employees e
WHERE salary < 30000
  AND manager_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM Employees m WHERE m.employee_id = e.manager_id)
ORDER BY employee_id;
```

**`NOT IN` version:** `manager_id NOT IN (SELECT employee_id FROM Employees)` works **here**
because `employee_id` is a primary key and can't be NULL. If the subquery column could be NULL,
NOT IN would return nothing. Say this out loud.

</details>

---

## 626 · Exchange Seats

**Difficulty:** Medium · **Schema:** `lc626`

**Problem.** `Seat(id, student)`, with ids running 1, 2, 3, … Swap the seats of every two
neighbours (1↔2, 3↔4, …). If the count is odd, the last student stays put. Return the result
ordered by id.

**Example.**

Seat: (1, Abbot), (2, Doris), (3, Emerson), (4, Green), (5, Jeames)

Output: (1, Doris), (2, Abbot), (3, Green), (4, Emerson), (5, Jeames)

**What it's really testing:** realising you can **rewrite the id** instead of moving names, using
`CASE` + a scalar subquery for the last-row edge case.

**How to relate:** "swap adjacent pairs" → odd ids become id + 1, even ids become id − 1. "Unless
it's the last one and odd" → you need to know the max id.

**Hint ladder.**
1. Don't move students between rows. Change which id each student gets.
2. Odd id → id + 1, even id → id − 1.
3. Except: odd **and** equal to `(SELECT MAX(id) FROM Seat)` → keep the id. Then `ORDER BY id`.

<details>
<summary>Solution</summary>

```sql
SELECT CASE
         WHEN id % 2 = 1 AND id = (SELECT MAX(id) FROM Seat) THEN id
         WHEN id % 2 = 1 THEN id + 1
         ELSE id - 1
       END AS id,
       student
FROM Seat
ORDER BY id;

-- Window version: take the neighbour's NAME instead of changing the id
SELECT id,
       CASE
         WHEN id % 2 = 1 THEN COALESCE(LEAD(student) OVER (ORDER BY id), student)
         ELSE LAG(student) OVER (ORDER BY id)
       END AS student
FROM Seat;
```

</details>

---

## 1341 · Movie Rating

**Difficulty:** Medium · **Schema:** `lc1341`

**Problem.** `Movies(movie_id, title)`, `Users(user_id, name)`, `MovieRating(movie_id, user_id,
rating, created_at)`. Return **two rows** in a single column `results`:
1. the name of the user who rated the **most** movies (ties → alphabetically smallest name), and
2. the title of the movie with the **highest average rating in February 2020** (ties → alphabetically smallest title).

**Example.**

MovieRating: Daniel and Monica each rated 3 movies (Maria 2, James 1). In February 2020, Frozen 2
and Avengers both average 3.5.

Output:

| results |
|---|
| Daniel |
| Frozen 2 |

(Daniel beats Monica alphabetically. Frozen 2 beats Avengers alphabetically.)

**What it's really testing:** two **independent** top-1 queries stuck together with `UNION ALL`,
each with its own tie-break.

**How to relate:** "return two different answers in one result" → two queries + `UNION ALL`. "Ties
→ alphabetical" → a second `ORDER BY` key.

**Hint ladder.**
1. Solve each half on its own. Half 1: group ratings by user, `ORDER BY COUNT(*) DESC, name LIMIT 1`.
2. Half 2: filter to February 2020, group by movie, `ORDER BY AVG(rating) DESC, title LIMIT 1`.
3. Glue them with `UNION ALL`. Each half needs **parentheses** because it has its own `ORDER BY` / `LIMIT`. Name the column `results` in the first half.

<details>
<summary>Solution</summary>

```sql
(SELECT u.name AS results
 FROM MovieRating r JOIN Users u ON u.user_id = r.user_id
 GROUP BY u.user_id, u.name
 ORDER BY COUNT(*) DESC, u.name
 LIMIT 1)
UNION ALL
(SELECT m.title
 FROM MovieRating r JOIN Movies m ON m.movie_id = r.movie_id
 WHERE r.created_at >= DATE '2020-02-01' AND r.created_at < DATE '2020-03-01'
 GROUP BY m.movie_id, m.title
 ORDER BY AVG(r.rating) DESC, m.title
 LIMIT 1);
```

**Why UNION ALL and not UNION:** if a user and a movie share a name (a user called "Joker"),
`UNION` would merge them into one row and you'd return 1 row instead of 2. That's a real hidden-test failure.

</details>

---

## 1321 · Restaurant Growth

**Difficulty:** Medium · **Schema:** `lc1321`

**Problem.** `Customer(customer_id, name, visited_on, amount)`, with one row per customer visit and
possibly several visits per day. For each day, compute the **total spent over the 7 days ending
that day** and its **average per day** (rounded to 2 decimals). Only show days that have a full
7-day window behind them. Order by date. (There's at least one visit every day.)

**Example.**

Customer: one visit per day from 01-01 to 01-09 (100, 110, 120, 130, 110, 140, 150, 80, 110), then
two visits on 01-10 (130 + 150)

Output:

| visited_on | amount | average_amount |
|---|---|---|
| 2019-01-07 | 860 | 122.86 |
| 2019-01-08 | 840 | 120.00 |
| 2019-01-09 | 840 | 120.00 |
| 2019-01-10 | 1000 | 142.86 |

**What it's really testing:** **aggregate first, then window**, plus **window frames**.

**How to relate:** "the last 7 days ending today" → a moving window frame. But the moving window
is over **days**, and the table has rows per **visit**, so you need one row per day first.

**Hint ladder.**
1. Several visits per day → collapse to one row per day first (`GROUP BY visited_on`, `SUM(amount)`). If you skip this, the window counts 7 **visits**, not 7 days.
2. On that daily table: `SUM(amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)`. Divide by 7 for the average (or use `AVG` over the same frame).
3. Drop the first 6 days: number the days with `ROW_NUMBER()` and keep `>= 7`, or keep `visited_on >= MIN(visited_on) + 6`.

<details>
<summary>Solution</summary>

```sql
WITH daily AS (
  SELECT visited_on, SUM(amount) AS amount
  FROM Customer
  GROUP BY visited_on
),
windowed AS (
  SELECT visited_on,
         SUM(amount) OVER w                      AS amount,
         ROUND(AVG(amount) OVER w, 2)            AS average_amount,
         ROW_NUMBER() OVER (ORDER BY visited_on) AS day_number
  FROM daily
  WINDOW w AS (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)
)
SELECT visited_on, amount, average_amount
FROM windowed
WHERE day_number >= 7
ORDER BY visited_on;
```

**Follow-up:** "what if a day had no visits?" Then `ROWS 6 PRECEDING` would reach back 8 calendar
days. Fix it with `RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW`, or fill the missing
days first with `generate_series` + LEFT JOIN.

</details>

---

## 602 · Friend Requests II: Who Has the Most Friends

**Difficulty:** Medium · **Schema:** `lc602`

**Problem.** `RequestAccepted(requester_id, accepter_id, accept_date)`. Each row is a friendship.
Find the person with the **most friends** and their count. (The test data has exactly one winner.)

**Example.**

RequestAccepted: (1, 2), (1, 3), (2, 3), (3, 4)

Output: id `3`, num `3`

(Person 3 is friends with 1, 2 and 4.)

**What it's really testing:** **unpivoting** two columns into one with `UNION ALL`, because a friendship counts for **both** people.

**How to relate:** a person can appear in **either** column and both count → stack the two columns into one list of ids, then count.

**Hint ladder.**
1. Counting only `requester_id` misses friendships where the person was the accepter.
2. `SELECT requester_id AS id … UNION ALL SELECT accepter_id …` gives one row per (person, friendship).
3. Group that by id, count, `ORDER BY num DESC LIMIT 1`. It must be **UNION ALL**, because UNION would merge repeated ids and break the count.

<details>
<summary>Solution</summary>

```sql
SELECT id, COUNT(*) AS num
FROM (
  SELECT requester_id AS id FROM RequestAccepted
  UNION ALL
  SELECT accepter_id FROM RequestAccepted
) ends
GROUP BY id
ORDER BY num DESC
LIMIT 1;
```

**Follow-up:** "what if several people tie for most friends?" Replace `LIMIT 1` with
`RANK() OVER (ORDER BY COUNT(*) DESC)` in a subquery and keep `rank = 1`.

</details>

---

## 585 · Investments in 2016

**Difficulty:** Medium · **Schema:** `lc585`

**Problem.** `Insurance(pid, tiv_2015, tiv_2016, lat, lon)`. Sum `tiv_2016` (rounded to 2
decimals) over policyholders who:
1. share their `tiv_2015` value with **at least one other** policyholder, **and**
2. have a **unique** location (no one else has the same (lat, lon)).

**Example.**

Insurance: (1, 10, 5, 10, 10), (2, 20, 20, 20, 20), (3, 10, 30, 20, 20), (4, 10, 40, 40, 40)

Output: `45.00`

(Policyholders 1 and 4 qualify: tiv_2015 = 10 is shared, and their locations are unique. 5 + 40 =
45. Holder 3 shares its location with 2. Holder 2's tiv_2015 is unique.)

**What it's really testing:** "how many **other** rows share my value?", which is a **window COUNT
with PARTITION BY**.

**How to relate:** "same value as another row" → count the rows in the partition of that value.
More than 1 means shared, exactly 1 means unique.

**Hint ladder.**
1. You need two per-row facts: how many rows share my tiv_2015, and how many share my (lat, lon).
2. `COUNT(*) OVER (PARTITION BY tiv_2015)` and `COUNT(*) OVER (PARTITION BY lat, lon)`.
3. Filter in an outer query: `> 1` and `= 1`. Then `ROUND(SUM(tiv_2016)::numeric, 2)` (the columns are float).

<details>
<summary>Solution</summary>

```sql
SELECT ROUND(SUM(tiv_2016)::numeric, 2) AS tiv_2016
FROM (
  SELECT tiv_2016,
         COUNT(*) OVER (PARTITION BY tiv_2015) AS same_2015,
         COUNT(*) OVER (PARTITION BY lat, lon) AS same_place
  FROM Insurance
) i
WHERE same_2015 > 1 AND same_place = 1;

-- Subquery version
SELECT ROUND(SUM(tiv_2016)::numeric, 2) AS tiv_2016
FROM Insurance
WHERE tiv_2015 IN (SELECT tiv_2015 FROM Insurance GROUP BY tiv_2015 HAVING COUNT(*) > 1)
  AND (lat, lon) IN (SELECT lat, lon FROM Insurance GROUP BY lat, lon HAVING COUNT(*) = 1);
```

</details>

---

## 185 · Department Top Three Salaries

**Difficulty:** Hard · **Schema:** `lc185`

**Problem.** `Employee(id, name, salary, departmentId)` and `Department(id, name)`. A
**high earner** is someone whose salary is among the **top three unique** salaries in their
department. Return each high earner's department name, name and salary.

**Example.**

Employee (IT): Max 90000, Joe 85000, Randy 85000, Will 70000, Janet 69000
Employee (Sales): Henry 80000, Sam 60000

Output:

| Department | Employee | Salary |
|---|---|---|
| IT | Max | 90000 |
| IT | Joe | 85000 |
| IT | Randy | 85000 |
| IT | Will | 70000 |
| Sales | Henry | 80000 |
| Sales | Sam | 60000 |

(IT's top three **unique** salaries are 90k, 85k and 70k, so four people. Sales has only two employees.)

**What it's really testing:** **choosing the right ranking function** and **per-group ranking**
with `PARTITION BY`. This is one of the most frequently asked SQL interview questions.

**How to relate:** "top three **unique** salaries" → ties share a rank, and the next distinct salary
gets the next number with no gap → `DENSE_RANK`. "In each department" → `PARTITION BY departmentId`.

**Hint ladder.**
1. Rank salaries within each department, highest first. Which of the three ranking functions gives Will rank 3 (not 4) after the 85k tie?
2. `DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC)`, in a subquery.
3. Keep `rank <= 3` and join Department for the name.

<details>
<summary>Solution</summary>

```sql
SELECT d.name AS Department, r.name AS Employee, r.salary AS Salary
FROM (
  SELECT name, salary, departmentId,
         DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) AS rnk
  FROM Employee
) r
JOIN Department d ON d.id = r.departmentId
WHERE r.rnk <= 3;

-- Pre-window version: a correlated subquery counting distinct higher salaries
SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary
FROM Employee e
JOIN Department d ON d.id = e.departmentId
WHERE (SELECT COUNT(DISTINCT e2.salary)
       FROM Employee e2
       WHERE e2.departmentId = e.departmentId AND e2.salary > e.salary) < 3;
```

**Say this:** "With `RANK`, Will would get 4 because of the tie and be dropped wrongly. With
`ROW_NUMBER`, either Joe or Randy would get 3 and push Will out. 'Top three unique salaries' is the
definition of `DENSE_RANK`."

</details>

---

## 🧠 Section recap

- Break the problem into **named CTE steps**: aggregate first, then window, then filter.
- `ROW_NUMBER` / `RANK` / `DENSE_RANK`: memorise the 100, 90, 90, 80 table and pick out loud.
- Moving windows: `ROWS BETWEEN 6 PRECEDING AND CURRENT ROW`, and know when `RANGE` is the safer choice.
- "Shares a value with others" → `COUNT(*) OVER (PARTITION BY value)`.
- Two answers in one column → parenthesised halves + `UNION ALL`.
- `NOT EXISTS` over `NOT IN` whenever NULLs are possible.
