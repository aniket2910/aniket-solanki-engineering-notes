# 03 · Basic Aggregate Functions

[← 02 Basic Joins](02-basic-joins.md) · [SQL 50 home](README.md) · Next: [04 Sorting and Grouping →](04-sorting-grouping.md)

Aggregates collapse many rows into one number. The problems here are rarely hard because of the
aggregate itself. What trips people up is the **denominator** (what are we dividing by?), **integer
division**, and "**first** X per customer".

**Run the solutions:** `npm run q -- leetcode/03` (from `../playground`).

---

## Concepts for this section

### Concept: aggregates ignore NULLs (except COUNT star)

| Function | On values 2, NULL, 4 | Note |
|---|---|---|
| `COUNT(*)` | 3 | counts **rows** |
| `COUNT(col)` | 2 | counts non-NULL values |
| `SUM(col)` | 6 | NULLs skipped. SUM of **no rows** is NULL, not 0 |
| `AVG(col)` | 3 | (2 + 4) / **2**. NULLs are not counted as zero |
| `MAX` / `MIN` | 4 / 2 | NULL if there are no rows |

So `AVG(bonus)` averages only the people who *have* a bonus. If you want missing values to count
as 0, say so: `AVG(COALESCE(bonus, 0))`.

### Concept: a rate is an average of 0s and 1s

"Percentage of X that are Y" = the average of a column that is 1 when the row is Y and 0
otherwise:

```sql
AVG(CASE WHEN rating < 3 THEN 1 ELSE 0 END)          -- fraction, 0..1
ROUND(100 * AVG(CASE WHEN … THEN 1 ELSE 0 END), 2)   -- percentage
AVG((rating < 3)::int)                                -- Postgres shortcut: boolean → 0/1
```

This one idea solves 1211, 1174, 1934 and part of 1193. The denominator is "the rows in this
group", so make sure the group really is the population you mean.

### Concept: conditional aggregation

Several different counts **in one row**: total, approved-only, and so on. Postgres has a clean
syntax for it:

```sql
COUNT(*)                                       -- all rows in the group
COUNT(*) FILTER (WHERE state = 'approved')     -- only approved rows
SUM(amount) FILTER (WHERE state = 'approved')  -- sum of approved amounts (NULL if none!)
```

The portable version is `SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END)`. Naming
`FILTER` in an interview signals that you know Postgres specifically.

### Concept: integer division

In Postgres, `int / int` = **int**: `1 / 3 = 0`, `7 / 2 = 3`. Any "percentage" built from two
COUNTs will silently become 0 unless one side is decimal:

```sql
COUNT(x) * 100.0 / total      -- 100.0 is numeric, so the result is numeric
COUNT(x)::numeric / total
```

`AVG(int)` is safe, because Postgres returns `numeric` for it.

### Concept: first row per group

"Each customer's **first** order", "each player's **first** login". Three ways, worth knowing all
three:

```sql
-- 1. DISTINCT ON (Postgres only): keep the first row per customer, in ORDER BY order
SELECT DISTINCT ON (customer_id) * FROM Delivery ORDER BY customer_id, order_date;

-- 2. MIN + join back (portable)
SELECT d.* FROM Delivery d
JOIN (SELECT customer_id, MIN(order_date) AS first_date FROM Delivery GROUP BY customer_id) f
  ON f.customer_id = d.customer_id AND f.first_date = d.order_date;

-- 3. ROW_NUMBER window (portable, and it generalises to "first N")
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS rn FROM Delivery
) t WHERE rn = 1;
```

**Tie behaviour differs:** `DISTINCT ON` and `ROW_NUMBER` return exactly one row per group, while
MIN + join-back returns **every** row that ties for first. You'll see this again in 1070.

---

## 620 · Not Boring Movies

**Difficulty:** Easy · **Schema:** `lc620`

**Problem.** `Cinema(id, movie, description, rating)`. Return movies with an **odd id** whose
description is **not 'boring'**, ordered by rating, highest first.

**Example.**

Cinema: (1, War, great 3D, 8.9), (2, Science, fiction, 8.5), (3, irish, boring, 6.2),
(4, Ice song, Fantacy, 8.6), (5, House card, Interesting, 9.1)

Output:

| id | movie | description | rating |
|---|---|---|---|
| 5 | House card | Interesting | 9.1 |
| 1 | War | great 3D | 8.9 |

**What it's really testing:** the modulo operator, and `ORDER BY … DESC`.

**How to relate:** "odd" → `id % 2 = 1`.

**Hint ladder.**
1. Two filters plus a sort.
2. Odd numbers leave remainder 1 when divided by 2.
3. `WHERE id % 2 = 1 AND description <> 'boring' ORDER BY rating DESC`.

<details>
<summary>Solution</summary>

```sql
SELECT *
FROM Cinema
WHERE id % 2 = 1 AND description <> 'boring'
ORDER BY rating DESC;
```

</details>

---

## 1251 · Average Selling Price

**Difficulty:** Easy · **Schema:** `lc1251`

**Problem.** `Prices(product_id, start_date, end_date, price)` gives each product's price for a
date range (ranges don't overlap). `UnitsSold(product_id, purchase_date, units)` records sales.
Find each product's **average selling price**, weighted by units sold, rounded to 2 decimals. A
product with no sales has average price **0**.

**Example.**

Prices: product 1 → 5 (Feb 17–28), 20 (Mar 1–22); product 2 → 15 (Feb 1–20), 30 (Feb 21–Mar 31)
UnitsSold: (1, Feb 25, 100), (1, Mar 1, 15), (2, Feb 10, 200), (2, Mar 22, 30)

Output:

| product_id | average_price |
|---|---|
| 1 | 6.96 |
| 2 | 16.96 |

(Product 1: (100 × 5 + 15 × 20) / 115 = 6.96. The playground adds a product 3 with no sales,
which must show `0`.)

**What it's really testing:** a **range join** (the join condition is `BETWEEN`, not `=`), a
**weighted** average, and the no-sales edge case.

**How to relate:** "the price at the time of purchase" → match each sale to the price row whose
date range contains the purchase date. "Average selling price" weighted by units → `SUM(price ×
units) / SUM(units)`, not `AVG(price)`.

**Hint ladder.**
1. A join condition can be any boolean expression: `ON same product AND purchase_date BETWEEN start_date AND end_date`.
2. Weighted average = total revenue / total units. `AVG(price)` treats a 1-unit sale the same as a 100-unit sale.
3. Products with no sales: Prices on the LEFT, so the product survives. Its `SUM`s are NULL, so wrap in `COALESCE(…, 0)`.

<details>
<summary>Solution</summary>

```sql
SELECT p.product_id,
       COALESCE(ROUND(SUM(p.price * u.units)::numeric / SUM(u.units), 2), 0) AS average_price
FROM Prices p
LEFT JOIN UnitsSold u
       ON u.product_id = p.product_id
      AND u.purchase_date BETWEEN p.start_date AND p.end_date
GROUP BY p.product_id;
```

**Two traps in one line:** without `::numeric`, `int / int` truncates (6.96 becomes 6). Without
`COALESCE`, the unsold product shows NULL instead of 0.

</details>

---

## 1075 · Project Employees I

**Difficulty:** Easy · **Schema:** `lc1075`

**Problem.** `Project(project_id, employee_id)` and `Employee(employee_id, name,
experience_years)`. For each project, report the average experience of its employees, rounded to
2 decimals.

**Example.**

Project: (1, 1), (1, 2), (1, 3), (2, 1), (2, 4)
Employee: (1, Khaled, 3), (2, Ali, 2), (3, John, 1), (4, Doe, 2)

Output: project 1 → `2.00` ((3 + 2 + 1) / 3), project 2 → `2.50` ((3 + 2) / 2)

**What it's really testing:** JOIN, then GROUP BY, then AVG. The basic aggregation pipeline.

**How to relate:** "for each project" → `GROUP BY project_id`. The experience lives in another
table → join first.

**Hint ladder.**
1. Bring `experience_years` next to each `project_id` row.
2. Group the joined rows by project.
3. `ROUND(AVG(e.experience_years), 2)`.

<details>
<summary>Solution</summary>

```sql
SELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years
FROM Project p
JOIN Employee e ON e.employee_id = p.employee_id
GROUP BY p.project_id;
```

</details>

---

## 1633 · Percentage of Users Attended a Contest

**Difficulty:** Easy · **Schema:** `lc1633`

**Problem.** `Users(user_id, user_name)` and `Register(contest_id, user_id)`. For each contest,
find the percentage of **all users** who registered for it, rounded to 2 decimals. Order by
percentage descending, then contest_id ascending.

**Example.**

Users: 6 (Alice), 2 (Bob), 7 (Alex), so 3 users in total
Register: contests 208, 209, 210 have all 3 users; 215 has 2; 207 has 1

Output:

| contest_id | percentage |
|---|---|
| 208 | 100.00 |
| 209 | 100.00 |
| 210 | 100.00 |
| 215 | 66.67 |
| 207 | 33.33 |

**What it's really testing:** where the **denominator** comes from. The numerator is per contest,
but the denominator is a **constant** (all users), and it isn't in the grouped table.

**How to relate:** "percentage of **all** users" → divide by `(SELECT COUNT(*) FROM Users)`, a
scalar subquery that returns one number.

**Hint ladder.**
1. The numerator: registrations per contest → `GROUP BY contest_id`, `COUNT(user_id)`.
2. The denominator is the size of the Users table, the same for every contest.
3. `ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2)`. Note the `100.0`.

<details>
<summary>Solution</summary>

```sql
SELECT contest_id,
       ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage
FROM Register
GROUP BY contest_id
ORDER BY percentage DESC, contest_id;
```

**With `* 100` instead of `* 100.0`**, Postgres does integer division, so 2 × 100 / 3 = 66 and
you'd get 66.00 instead of 66.67.

</details>

---

## 1211 · Queries Quality and Percentage

**Difficulty:** Easy · **Schema:** `lc1211`

**Problem.** `Queries(query_name, result, position, rating)`. For each query_name:
**quality** = the average of `rating / position`, and **poor_query_percentage** = the percentage
of its rows with `rating < 3`. Round both to 2 decimals.

**Example.**

Queries:

| query_name | result | position | rating |
|---|---|---|---|
| Dog | Golden Retriever | 1 | 5 |
| Dog | German Shepherd | 2 | 5 |
| Dog | Mule | 200 | 1 |
| Cat | Shirazi | 5 | 2 |
| Cat | Siamese | 3 | 3 |
| Cat | Sphynx | 7 | 4 |

Output:

| query_name | quality | poor_query_percentage |
|---|---|---|
| Dog | 2.50 | 33.33 |
| Cat | 0.66 | 33.33 |

(Dog quality: (5/1 + 5/2 + 1/200) / 3 = 2.50. One poor row out of three = 33.33.)

**What it's really testing:** AVG of a per-row ratio + the "rate = AVG of a flag" trick, with
integer division waiting to bite.

**How to relate:** "average of rating/position" → compute the ratio per row, then `AVG`.
"Percentage of rows where…" → `AVG(flag) * 100`.

**Hint ladder.**
1. Both columns are per query_name → `GROUP BY query_name`.
2. `rating / position` on two ints truncates: 5/2 = 2. Cast one side.
3. `ROUND(AVG(rating::numeric / position), 2)` and `ROUND(AVG(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100, 2)`.

<details>
<summary>Solution</summary>

```sql
SELECT query_name,
       ROUND(AVG(rating::numeric / position), 2)                   AS quality,
       ROUND(AVG(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100, 2) AS poor_query_percentage
FROM Queries
GROUP BY query_name;
```

**LeetCode note:** older versions of this problem had rows with NULL `query_name`, and people added
`WHERE query_name IS NOT NULL`. That's harmless to keep.

</details>

---

## 1193 · Monthly Transactions I

**Difficulty:** Medium · **Schema:** `lc1193`

**Problem.** `Transactions(id, country, state, amount, trans_date)`, where state is 'approved' or
'declined'. For each **month and country**, report: number of transactions, number approved,
total amount, and approved amount.

**Example.**

Transactions: (121, US, approved, 1000, 2018-12-18), (122, US, declined, 2000, 2018-12-19),
(123, US, approved, 2000, 2019-01-01), (124, DE, approved, 2000, 2019-01-07)

Output:

| month | country | trans_count | approved_count | trans_total_amount | approved_total_amount |
|---|---|---|---|---|---|
| 2018-12 | US | 2 | 1 | 3000 | 1000 |
| 2019-01 | US | 1 | 1 | 2000 | 2000 |
| 2019-01 | DE | 1 | 1 | 2000 | 2000 |

**What it's really testing:** **conditional aggregation** (several filtered totals in one row)
and **grouping by a computed value** (the month).

**How to relate:** "for each month and country" → `GROUP BY` two things, one of which is derived
from a date. "Count AND approved count side by side" → `FILTER`.

**Hint ladder.**
1. Format the date as 'YYYY-MM' and group by that and country.
2. Total count is `COUNT(*)`. The approved count is the same aggregate restricted to some rows.
3. `COUNT(*) FILTER (WHERE state = 'approved')` and `SUM(amount) FILTER (…)`. And if a group has
   no approved rows, that SUM is NULL, so `COALESCE(…, 0)`.

**Postgres note:** `to_char(trans_date, 'YYYY-MM')` replaces MySQL's `DATE_FORMAT(…, '%Y-%m')`.
Postgres also lets you `GROUP BY month` using the `SELECT` alias. That's a Postgres extension
(standard SQL doesn't allow it), but it's handy.

<details>
<summary>Solution</summary>

```sql
SELECT to_char(trans_date, 'YYYY-MM')                             AS month,
       country,
       COUNT(*)                                                   AS trans_count,
       COUNT(*) FILTER (WHERE state = 'approved')                 AS approved_count,
       SUM(amount)                                                AS trans_total_amount,
       COALESCE(SUM(amount) FILTER (WHERE state = 'approved'), 0) AS approved_total_amount
FROM Transactions
GROUP BY month, country;
```

**Hidden test:** LeetCode's real data has NULL countries. `GROUP BY` puts all the NULLs into one
group, which is the behaviour LeetCode expects.

</details>

---

## 1174 · Immediate Food Delivery II

**Difficulty:** Medium · **Schema:** `lc1174`

**Problem.** `Delivery(delivery_id, customer_id, order_date, customer_pref_delivery_date)`. An
order is **immediate** if the preferred delivery date equals the order date. Each customer's
**first order** is their earliest one. Find the percentage of immediate orders **among first
orders**, rounded to 2 decimals.

**Example.**

Delivery:

| delivery_id | customer_id | order_date | customer_pref_delivery_date |
|---|---|---|---|
| 1 | 1 | 2019-08-01 | 2019-08-02 |
| 2 | 2 | 2019-08-02 | 2019-08-02 |
| 3 | 1 | 2019-08-11 | 2019-08-12 |
| 4 | 3 | 2019-08-24 | 2019-08-24 |
| 5 | 3 | 2019-08-21 | 2019-08-22 |
| 6 | 2 | 2019-08-11 | 2019-08-13 |
| 7 | 4 | 2019-08-09 | 2019-08-09 |

Output: `50.00`

(First orders: delivery 1 (scheduled), 2 (immediate), 5 (scheduled), 7 (immediate), so 2 of 4.)

**What it's really testing:** **first row per group**, then a rate over those rows. Two steps,
which is a good reason to use a CTE.

**How to relate:** "first order of each customer" → reduce to one row per customer. "Percentage
that are immediate" → AVG of a flag over the reduced set.

**Hint ladder.**
1. Don't compute the percentage over all orders. The population is first orders only. Build that set first.
2. `DISTINCT ON (customer_id) … ORDER BY customer_id, order_date` gives each customer's first order.
3. Over that set: `ROUND(AVG(CASE WHEN order_date = customer_pref_delivery_date THEN 1 ELSE 0 END) * 100, 2)`.

<details>
<summary>Solution</summary>

```sql
WITH first_orders AS (
  SELECT DISTINCT ON (customer_id) customer_id, order_date, customer_pref_delivery_date
  FROM Delivery
  ORDER BY customer_id, order_date
)
SELECT ROUND(AVG(CASE WHEN order_date = customer_pref_delivery_date THEN 1 ELSE 0 END) * 100, 2)
       AS immediate_percentage
FROM first_orders;

-- Portable version with a tuple IN
SELECT ROUND(AVG(CASE WHEN order_date = customer_pref_delivery_date THEN 1 ELSE 0 END) * 100, 2)
       AS immediate_percentage
FROM Delivery
WHERE (customer_id, order_date) IN (SELECT customer_id, MIN(order_date) FROM Delivery GROUP BY customer_id);
```

</details>

---

## 550 · Game Play Analysis IV

**Difficulty:** Medium · **Schema:** `lc550`

**Problem.** `Activity(player_id, device_id, event_date, games_played)`. Report the **fraction of
players** who logged in again on the **day right after their first login**, rounded to 2 decimals.

**Example.**

Activity: (1, 2, 2016-03-01, 5), (1, 2, 2016-03-02, 6), (2, 3, 2017-06-25, 1),
(3, 1, 2016-03-02, 0), (3, 4, 2018-07-03, 5)

Output: `0.33`

(Only player 1 came back the day after their first login: 1 of 3 players.)

**What it's really testing:** first-row-per-group (first login date) + a join on a **computed
date** (first_day + 1) + a ratio with the right denominator.

**How to relate:** "first login" → `MIN(event_date)` per player. "The next day" → join back on
`event_date = first_day + 1`, same idea as 197. "Fraction of players" → the denominator is all
players.

**Hint ladder.**
1. CTE: each player's first day, with `MIN(event_date) … GROUP BY player_id`.
2. Join Activity back on `same player AND event_date = first_day + 1`. Each match is a player who returned.
3. Divide that count by the number of players in the CTE, and cast to numeric before dividing.

<details>
<summary>Solution</summary>

```sql
WITH first_login AS (
  SELECT player_id, MIN(event_date) AS first_day
  FROM Activity
  GROUP BY player_id
)
SELECT ROUND(COUNT(a.player_id)::numeric / (SELECT COUNT(*) FROM first_login), 2) AS fraction
FROM first_login f
JOIN Activity a ON a.player_id = f.player_id AND a.event_date = f.first_day + 1;

-- Same thing as AVG of a flag: LEFT JOIN so non-returners count as 0
WITH first_login AS (
  SELECT player_id, MIN(event_date) AS first_day
  FROM Activity
  GROUP BY player_id
)
SELECT ROUND(AVG(CASE WHEN a.player_id IS NOT NULL THEN 1 ELSE 0 END), 2) AS fraction
FROM first_login f
LEFT JOIN Activity a ON a.player_id = f.player_id AND a.event_date = f.first_day + 1;
```

</details>

---

## 🧠 Section recap

- **Name the denominator out loud** before writing any ratio: "out of all users", "out of first orders".
- `int / int` truncates in Postgres. Use `100.0`, `::numeric`, or AVG.
- `ROUND(float, n)` errors in Postgres. Cast to `numeric` first.
- `SUM` / `AVG` of no rows is NULL → `COALESCE(…, 0)`.
- "First X per group" → `DISTINCT ON`, `MIN` + join back, or `ROW_NUMBER`. Know how each one handles ties.
