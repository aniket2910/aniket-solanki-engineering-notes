# 02 · Basic Joins

[← 01 Select](01-select.md) · [SQL 50 home](README.md) · Next: [03 Basic Aggregate Functions →](03-basic-aggregates.md)

Nine problems that are really four ideas: **LEFT JOIN keeps rows**, **anti-join finds what's
missing**, **CROSS JOIN builds rows that don't exist yet**, and **self-join compares a table with
itself**. Learn to spot which of the four a problem needs and every join problem gets easier.

**Run the solutions:** `npm run q -- leetcode/02` (from `../playground`).

---

## Concepts for this section

### Concept: join types as keep rules

Don't think "Venn diagrams". Think **which rows survive**:

| Join | Keeps | Unmatched side becomes |
|---|---|---|
| `INNER JOIN` | Only rows that found a partner | (dropped) |
| `LEFT JOIN` | **Every row of the left table** | NULLs on the right |
| `RIGHT JOIN` | Every row of the right table | NULLs on the left (just write it as a LEFT JOIN with the tables swapped) |
| `FULL JOIN` | Every row of both tables | NULLs on whichever side is missing |
| `CROSS JOIN` | Every left row × every right row | (no matching at all) |

**How to relate:** if the output must list *every* X, including X's with nothing attached, then X
is the **left** table of a `LEFT JOIN`.

**The classic trap:** a `WHERE` condition on the right table runs *after* the join and throws away
the NULL rows the LEFT JOIN kept, so it quietly turns your LEFT JOIN back into an INNER JOIN. Put
conditions about the right table **in the `ON` clause** if unmatched rows must survive.

```sql
-- Keeps customers with no paid order (paid filter is part of matching)
SELECT c.name, o.id FROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'paid';
-- Drops them (filter runs after the join, and NULL = 'paid' is unknown)
SELECT c.name, o.id FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.status = 'paid';
```

### Concept: anti-join

"Rows in A with **no** matching row in B." Two standard ways to write it:

```sql
-- 1. LEFT JOIN, then keep only the rows where the join found nothing
SELECT a.* FROM A a LEFT JOIN B b ON b.a_id = a.id WHERE b.id IS NULL;

-- 2. NOT EXISTS: says what you mean, and Postgres plans it as an "Anti Join"
SELECT a.* FROM A a WHERE NOT EXISTS (SELECT 1 FROM B b WHERE b.a_id = a.id);
```

**Avoid `NOT IN (subquery)`** if the subquery's column can contain NULL. `x NOT IN (1, NULL)` is
never true (it's unknown), so the query returns **no rows at all**. `NOT EXISTS` doesn't have
this problem. This is a favourite interview follow-up.

**How to relate:** "did not", "never", "without", "who has no…".

### Concept: CROSS JOIN builds the grid

A join can only return rows built from rows that exist. If the output needs a row for "Alex ×
Physics: 0 exams" and no such row exists anywhere, no LEFT JOIN can produce it. **CROSS JOIN
creates every combination first**, and then you LEFT JOIN the facts onto that grid.

**How to relate:** "for each student **and each** subject", "every combination", or output rows
whose count can be **zero**.

### Concept: self-join

The same table under two aliases, so that one row can look at **another row of the same table**:
"yesterday's row" (197), "my manager's row" (570), "the end row for my start row" (1661). The aliases
are just names, so pick ones that read like English (`today` / `yesterday`, `m` for manager /
`e` for employee).

---

## 1378 · Replace Employee ID With The Unique Identifier

**Difficulty:** Easy · **Schema:** `lc1378`

**Problem.** `Employees(id, name)` and `EmployeeUNI(id, unique_id)`. Show each employee's
`unique_id` and `name`. If an employee has no unique id, show NULL.

**Example.**

Employees: (1, Alice), (7, Bob), (11, Meir), (90, Winston), (3, Jonathan)
EmployeeUNI: (3, 1), (11, 2), (90, 3)

Output:

| unique_id | name |
|---|---|
| null | Alice |
| null | Bob |
| 2 | Meir |
| 3 | Winston |
| 1 | Jonathan |

**What it's really testing:** LEFT JOIN vs INNER JOIN.

**How to relate:** "if an employee has no unique id, show null" means every employee must appear,
so Employees goes on the **left** of a LEFT JOIN.

**Hint ladder.**
1. With an INNER JOIN, Alice and Bob disappear. Why?
2. You need a join that keeps every employee even when it finds no partner.
3. `FROM Employees e LEFT JOIN EmployeeUNI u ON u.id = e.id`.

<details>
<summary>Solution</summary>

```sql
SELECT u.unique_id, e.name
FROM Employees e
LEFT JOIN EmployeeUNI u ON u.id = e.id;
```

</details>

---

## 1068 · Product Sales Analysis I

**Difficulty:** Easy · **Schema:** `lc1068`

**Problem.** `Sales(sale_id, product_id, year, quantity, price)` and
`Product(product_id, product_name)`. For every sale, report the product name, year and price.

**Example.**

Sales: (1, 100, 2008, 10, 5000), (2, 100, 2009, 12, 5000), (7, 200, 2011, 15, 9000)
Product: (100, Nokia), (200, Apple), (300, Samsung)

Output:

| product_name | year | price |
|---|---|---|
| Nokia | 2008 | 5000 |
| Nokia | 2009 | 5000 |
| Apple | 2011 | 9000 |

**What it's really testing:** a basic INNER JOIN, and understanding the grain. The output is one
row per **sale**, so Samsung (no sales) doesn't appear.

**How to relate:** "for each sale, the product's name" means sales lead and you look up the name.

**Hint ladder.**
1. The name lives in a different table from the sale.
2. Every sale has a product, and unsold products aren't wanted.
3. `FROM Sales s JOIN Product p ON p.product_id = s.product_id`.

<details>
<summary>Solution</summary>

```sql
SELECT p.product_name, s.year, s.price
FROM Sales s
JOIN Product p ON p.product_id = s.product_id;
```

</details>

---

## 1581 · Customer Who Visited but Did Not Make Any Transactions

**Difficulty:** Easy · **Schema:** `lc1581`

**Problem.** `Visits(visit_id, customer_id)` and `Transactions(transaction_id, visit_id, amount)`.
Find customers who made visits **without** a transaction, and how many such visits each made.
Return `customer_id, count_no_trans`.

**Example.**

Visits: (1, 23), (2, 9), (4, 30), (5, 54), (6, 96), (7, 54), (8, 54)
Transactions: (2, 5, 310), (3, 5, 300), (9, 5, 200), (12, 1, 910), (13, 2, 970)

Output:

| customer_id | count_no_trans |
|---|---|
| 54 | 2 |
| 30 | 1 |
| 96 | 1 |

(Visits 4, 6, 7 and 8 had no transaction. Customer 54 owns visits 7 and 8.)

**What it's really testing:** the **anti-join**, then a `GROUP BY` on top of it.

**How to relate:** "visited but did **not** make a transaction" → rows in Visits with **no** match
in Transactions. Then "how many times" → `COUNT` per customer.

**Hint ladder.**
1. Work in two steps. First find the visits with no transaction, then count them per customer.
2. After `Visits LEFT JOIN Transactions`, a visit that had no transaction shows NULL in every
   Transactions column.
3. `WHERE t.transaction_id IS NULL` (or `NOT EXISTS`), then `GROUP BY v.customer_id`.

<details>
<summary>Solution</summary>

```sql
-- LEFT JOIN + IS NULL
SELECT v.customer_id, COUNT(*) AS count_no_trans
FROM Visits v
LEFT JOIN Transactions t ON t.visit_id = v.visit_id
WHERE t.transaction_id IS NULL
GROUP BY v.customer_id;

-- NOT EXISTS (reads like the English statement)
SELECT v.customer_id, COUNT(*) AS count_no_trans
FROM Visits v
WHERE NOT EXISTS (SELECT 1 FROM Transactions t WHERE t.visit_id = v.visit_id)
GROUP BY v.customer_id;
```

**Why not `INNER JOIN` + `amount IS NULL`?** An inner join has already dropped the visits that
had no transaction, so there's nothing left to find.

</details>

---

## 197 · Rising Temperature

**Difficulty:** Easy · **Schema:** `lc197`

**Problem.** `Weather(id, recordDate, temperature)`. Find the ids of days whose temperature was
higher than the **previous day's** (the calendar day before, not the previous row).

**Example.**

Weather: (1, 2015-01-01, 10), (2, 2015-01-02, 25), (3, 2015-01-03, 20), (4, 2015-01-04, 30)

Output: `2`, `4`

(The playground also has a row `5, 2015-01-06, 35`. There's no reading for 01-05, so day 5 has
no "yesterday" and must **not** appear.)

**What it's really testing:** **self-join on a computed key** (`date - 1`), and spotting the
"previous row ≠ previous day" trap.

**How to relate:** "compared with the previous day" means each row needs to see **another row of
the same table** → self-join, where the join condition *is* "the day before".

**Hint ladder.**
1. Join Weather to itself: one alias is `today`, the other is `yesterday`.
2. What makes a row "yesterday" for `today`? Its date is exactly one day earlier.
3. `ON yesterday.recordDate = today.recordDate - 1`, then compare the temperatures in `WHERE`.

**The trap:** `LAG(temperature) OVER (ORDER BY recordDate)` gives the **previous row**, which is
only the previous day when there are no gaps. Run the playground file and you'll see LAG wrongly
return id 5.

**Postgres note:** `date - integer` returns a date, and `date - date` returns an integer number of
days. MySQL needs `DATEDIFF` / `DATE_SUB` for the same thing.

<details>
<summary>Solution</summary>

```sql
SELECT today.id
FROM Weather today
JOIN Weather yesterday ON yesterday.recordDate = today.recordDate - 1
WHERE today.temperature > yesterday.temperature;
```

</details>

---

## 1661 · Average Time of Process per Machine

**Difficulty:** Easy · **Schema:** `lc1661`

**Problem.** `Activity(machine_id, process_id, activity_type, timestamp)`, where each process on
each machine has exactly one 'start' row and one 'end' row. A process's time is `end - start`.
For each machine, return the **average** process time, rounded to 3 decimals, as `processing_time`.

**Example.**

Activity:

| machine_id | process_id | activity_type | timestamp |
|---|---|---|---|
| 0 | 0 | start | 0.712 |
| 0 | 0 | end | 1.520 |
| 0 | 1 | start | 3.140 |
| 0 | 1 | end | 4.120 |
| 1 | 0 | start | 0.550 |
| 1 | 0 | end | 1.550 |
| 1 | 1 | start | 0.430 |
| 1 | 1 | end | 1.420 |
| 2 | 0 | start | 4.100 |
| 2 | 0 | end | 4.512 |
| 2 | 1 | start | 2.500 |
| 2 | 1 | end | 5.000 |

Output: machine 0 → `0.894`, machine 1 → `0.995`, machine 2 → `1.456`

(Machine 0: ((1.520 − 0.712) + (4.120 − 3.140)) / 2 = 0.894)

**What it's really testing:** turning **two rows into one** (start and end side by side). Either a
self-join, or **conditional aggregation** (pivoting).

**How to relate:** "end minus start", where start and end are in different rows → get them onto one
row first. Then "average per machine" is a GROUP BY.

**Hint ladder.**
1. Option A: self-join Activity to itself on (machine, process), with one side filtered to
   'start' and the other to 'end'.
2. Option B, without a join: group by (machine, process) and pick out the start timestamp and the
   end timestamp with `MAX(timestamp) FILTER (WHERE activity_type = 'start')`.
3. Then average `end - start` per machine, and `ROUND(…::numeric, 3)`.

**Postgres gotcha:** `timestamp` here is a `float`, and `ROUND(double precision, 3)` **doesn't
exist in Postgres**. Cast to numeric first: `ROUND(x::numeric, 3)`.

<details>
<summary>Solution</summary>

```sql
-- Conditional aggregation: one row per process, start and end as columns
SELECT machine_id,
       ROUND(AVG(end_time - start_time)::numeric, 3) AS processing_time
FROM (
  SELECT machine_id, process_id,
         MAX(timestamp) FILTER (WHERE activity_type = 'start') AS start_time,
         MAX(timestamp) FILTER (WHERE activity_type = 'end')   AS end_time
  FROM Activity
  GROUP BY machine_id, process_id
) per_process
GROUP BY machine_id;

-- Self-join version
SELECT s.machine_id, ROUND(AVG(e.timestamp - s.timestamp)::numeric, 3) AS processing_time
FROM Activity s
JOIN Activity e
  ON e.machine_id = s.machine_id AND e.process_id = s.process_id
 AND s.activity_type = 'start' AND e.activity_type = 'end'
GROUP BY s.machine_id;
```

</details>

---

## 577 · Employee Bonus

**Difficulty:** Easy · **Schema:** `lc577`

**Problem.** `Employee(empId, name, supervisor, salary)` and `Bonus(empId, bonus)`. Report the
name and bonus of every employee whose bonus is **less than 1000**. Employees with **no bonus
row** count too, with bonus shown as NULL.

**Example.**

Employee: (3, Brad, null, 4000), (1, John, 3, 1000), (2, Dan, 3, 2000), (4, Thomas, 3, 4000)
Bonus: (2, 500), (4, 2000)

Output:

| name | bonus |
|---|---|
| Brad | null |
| John | null |
| Dan | 500 |

**What it's really testing:** LEFT JOIN **plus** NULL logic. It's 584 again, wearing a join.

**How to relate:** "no bonus counts as less than 1000" → keep employees with no bonus (LEFT JOIN),
and remember `NULL < 1000` is *unknown*.

**Hint ladder.**
1. Which join keeps Brad and John, who have no Bonus row?
2. After that join, try `WHERE b.bonus < 1000`. Brad and John vanish. Why?
3. `WHERE b.bonus < 1000 OR b.bonus IS NULL`.

<details>
<summary>Solution</summary>

```sql
SELECT e.name, b.bonus
FROM Employee e
LEFT JOIN Bonus b ON b.empId = e.empId
WHERE b.bonus < 1000 OR b.bonus IS NULL;
```

**Why not `COALESCE(b.bonus, 0) < 1000`?** It works, but it reads as "pretend no bonus is 0" and
it stops an index on `bonus` from being used. Saying the NULL case explicitly is clearer.

</details>

---

## 1280 · Students and Examinations

**Difficulty:** Easy · **Schema:** `lc1280`

**Problem.** `Students(student_id, student_name)`, `Subjects(subject_name)`, and
`Examinations(student_id, subject_name)` (one row per exam attended, duplicates allowed). For
**every student and every subject**, report how many times that student attended that subject's
exam, **including zeros**. Order by student_id, then subject_name.

**Example.**

Students: (1, Alice), (2, Bob), (13, John), (6, Alex)
Subjects: Math, Physics, Programming
Examinations: (1, Math), (1, Physics), (1, Programming), (2, Programming), (1, Physics), (1, Math),
(13, Math), (13, Programming), (13, Physics), (2, Math), (1, Math)

Output (12 rows, first and last few shown):

| student_id | student_name | subject_name | attended_exams |
|---|---|---|---|
| 1 | Alice | Math | 3 |
| 1 | Alice | Physics | 2 |
| 1 | Alice | Programming | 1 |
| 2 | Bob | Math | 1 |
| 2 | Bob | Physics | 0 |
| … | | | |
| 6 | Alex | Math | 0 |
| … | | | |
| 13 | John | Programming | 1 |

**What it's really testing:** **CROSS JOIN to build the grid**, then LEFT JOIN + `COUNT(column)`.

**How to relate:** "every student **and** every subject, including 0" → the output has 4 × 3 = 12
rows, but no table holds 12 such rows. Something has to create them, and that's what a CROSS JOIN does.

**Hint ladder.**
1. How many output rows? 12, one per (student, subject) pair. Build exactly those rows first.
2. `Students CROSS JOIN Subjects`, then LEFT JOIN Examinations on **both** student_id and subject_name.
3. `COUNT(e.student_id)`, **not** `COUNT(*)`. COUNT(column) skips NULLs, so an unmatched pair counts 0.

<details>
<summary>Solution</summary>

```sql
SELECT s.student_id, s.student_name, sub.subject_name,
       COUNT(e.student_id) AS attended_exams     -- counts only real matches, so empty pairs → 0
FROM Students s
CROSS JOIN Subjects sub
LEFT JOIN Examinations e
       ON e.student_id = s.student_id AND e.subject_name = sub.subject_name
GROUP BY s.student_id, s.student_name, sub.subject_name
ORDER BY s.student_id, sub.subject_name;
```

**`COUNT(*)` would give 1 for Alex × Math**, because the LEFT JOIN still produces one row for the
pair (with NULLs on the Examinations side), and `COUNT(*)` counts rows.

</details>

---

## 570 · Managers with at Least 5 Direct Reports

**Difficulty:** Medium · **Schema:** `lc570`

**Problem.** `Employee(id, name, department, managerId)`. Return the names of managers who have
**at least five** direct reports.

**Example.**

Employee: (101, John, A, null), (102, Dan, A, 101), (103, James, A, 101), (104, Amy, A, 101),
(105, Anne, A, 101), (106, Ron, B, 101)

Output: `John`

**What it's really testing:** self-join (employee → manager) + `GROUP BY` + `HAVING`.

**How to relate:** "managers" are rows of the same table that other rows point to → self-join.
"At least five" is a condition on a **group count** → `HAVING`, not `WHERE`.

**Hint ladder.**
1. Without the names, it's easy: `SELECT managerId FROM Employee GROUP BY managerId HAVING COUNT(*) >= 5`.
2. But you need the manager's **name**, which lives on the manager's own row.
3. Join `Employee m` (manager) to `Employee e` (report) on `e.managerId = m.id`, group by `m.id, m.name`.

<details>
<summary>Solution</summary>

```sql
SELECT m.name
FROM Employee m
JOIN Employee e ON e.managerId = m.id
GROUP BY m.id, m.name           -- group by id: two managers can share a name
HAVING COUNT(*) >= 5;

-- Alternative: find the qualifying ids first, then look up names
SELECT name FROM Employee
WHERE id IN (SELECT managerId FROM Employee GROUP BY managerId HAVING COUNT(*) >= 5);
```

</details>

---

## 1934 · Confirmation Rate

**Difficulty:** Medium · **Schema:** `lc1934`

**Problem.** `Signups(user_id, time_stamp)` and `Confirmations(user_id, time_stamp, action)`, where
action is 'confirmed' or 'timeout'. A user's **confirmation rate** = confirmed messages / total
confirmation requests. A user with no requests has rate 0. Return each user's rate, rounded to 2
decimals.

**Example.**

Signups: users 3, 7, 2, 6
Confirmations: user 3 → timeout, timeout; user 7 → confirmed ×3; user 2 → confirmed, timeout

Output:

| user_id | confirmation_rate |
|---|---|
| 6 | 0.00 |
| 3 | 0.00 |
| 7 | 1.00 |
| 2 | 0.50 |

**What it's really testing:** "a rate is an average of 1s and 0s" + LEFT JOIN for users with no
requests.

**How to relate:** "rate" → `AVG(CASE WHEN confirmed THEN 1 ELSE 0 END)`. "Users with no requests
get 0" → every signup must appear → Signups on the left of a LEFT JOIN.

**Hint ladder.**
1. Every Signups user appears in the output, so start `FROM Signups LEFT JOIN Confirmations`.
2. Turn each confirmation row into 1 (confirmed) or 0 (anything else). The rate is their average.
3. User 6's single LEFT JOIN row has `action` = NULL. `CASE WHEN NULL = 'confirmed'` falls to
   `ELSE 0`, so the average is 0. Done. Then `ROUND(…, 2)`.

<details>
<summary>Solution</summary>

```sql
SELECT s.user_id,
       ROUND(AVG(CASE WHEN c.action = 'confirmed' THEN 1 ELSE 0 END), 2) AS confirmation_rate
FROM Signups s
LEFT JOIN Confirmations c ON c.user_id = s.user_id
GROUP BY s.user_id;
```

**Postgres note:** `AVG` of an integer returns `numeric` in Postgres, so `ROUND(…, 2)` works with
no cast here. (Compare 1661, where the input was a float.)

</details>

---

## 🧠 Section recap

| If you see… | Reach for |
|---|---|
| "show null if missing" / "every X" | LEFT JOIN, X on the left |
| "did not", "never" | Anti-join: LEFT JOIN … IS NULL, or NOT EXISTS (never NOT IN with NULLs) |
| "every A for every B, including 0" | CROSS JOIN, then LEFT JOIN, then COUNT(column) |
| "previous day", "manager", "start/end pair" | Self-join |
| "rate" | AVG of a 0/1 CASE |
