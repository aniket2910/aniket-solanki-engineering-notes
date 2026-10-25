# 04 · Sorting and Grouping

[← 03 Basic Aggregates](03-basic-aggregates.md) · [SQL 50 home](README.md) · Next: [05 Advanced Select and Joins →](05-advanced-select-joins.md)

`GROUP BY` and `HAVING`, plus three ideas that show up in interviews far beyond LeetCode:
**`COUNT(DISTINCT)`**, **relational division** ("bought **all** products"), and the fact that **an
aggregate over nothing is NULL**. 1070 also introduces your first window function.

**Run the solutions:** `npm run q -- leetcode/04` (from `../playground`).

---

## Concepts for this section

### Concept: what GROUP BY actually does

`GROUP BY a` sorts the rows into buckets, one per distinct `a`, and then **each bucket becomes one
output row**. That's why every `SELECT` column must be either a grouping column or inside an
aggregate: once a bucket holds 5 rows, a bare `name` column has 5 possible values, and Postgres
won't guess which one you mean. (MySQL sometimes picks one silently, which is how wrong answers
slip through.)

**The exception:** if you `GROUP BY` a table's primary key, Postgres knows every other column of
that table is fixed per group, so `GROUP BY e.id` lets you select `e.name`.

### Concept: WHERE vs HAVING

| | `WHERE` | `HAVING` |
|---|---|---|
| Runs | **before** grouping | **after** grouping |
| Filters | individual rows | whole groups |
| Can use aggregates? | No | Yes |

**How to relate:** if the condition talks about a **count, sum or average of a group** ("at least 5
students", "appears only once") → `HAVING`. If it talks about a single row ("bonus < 1000") →
`WHERE`. When a condition could go either way, put it in `WHERE`: fewer rows to group means less work.

### Concept: COUNT star vs COUNT col vs COUNT DISTINCT

| | Counts |
|---|---|
| `COUNT(*)` | rows |
| `COUNT(col)` | rows where col is not NULL |
| `COUNT(DISTINCT col)` | **different** non-NULL values |

**How to relate:** the word "unique", or any table where the same thing can repeat (the same
subject taught in two departments, the same user active twice in a day) → `COUNT(DISTINCT …)`.

### Concept: relational division

"Customers who bought **every** product", "students who took **all** required courses". In plain
words: *A divided by B* gives the A-things related to **all** the B-things. The easy way is to count:

```sql
GROUP BY customer_id
HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product)
```

"This customer bought as many *different* products as exist" means "bought all of them". The
`DISTINCT` matters: buying the same product twice must not count as two products.

The textbook alternative is a **double NOT EXISTS**: "there is no product this customer has not
bought". It's worth mentioning in an interview, but the counting version is easier to read.

### Concept: empty set returns NULL

An aggregate with no `GROUP BY` **always returns exactly one row**, even over zero input rows:
`COUNT` gives 0, and `MAX` / `MIN` / `SUM` / `AVG` give **NULL**. So when a problem says "return
null if there is no answer", wrap the work in an aggregate (or a scalar subquery, see 176) and the
NULL appears on its own.

Compare with `SELECT num … LIMIT 1`, which over zero rows returns **zero rows**, not a NULL row.
LeetCode counts that as a wrong answer.

---

## 2356 · Number of Unique Subjects Taught by Each Teacher

**Difficulty:** Easy · **Schema:** `lc2356`

**Problem.** `Teacher(teacher_id, subject_id, dept_id)`. A teacher may teach the same subject in
several departments. Count the **number of unique subjects** each teacher teaches.

**Example.**

Teacher: (1, 2, 3), (1, 2, 4), (1, 3, 3), (2, 1, 1), (2, 2, 1), (2, 3, 1), (2, 4, 1)

Output: teacher 1 → `2` (subjects 2 and 3), teacher 2 → `4`

**What it's really testing:** `COUNT(DISTINCT)` vs `COUNT(*)`.

**How to relate:** "unique subjects", and the same subject repeats across departments → DISTINCT
inside the count.

**Hint ladder.**
1. `COUNT(*)` would say teacher 1 teaches 3. Which row is double-counted?
2. Subject 2 appears twice, once per department.
3. `COUNT(DISTINCT subject_id)`, grouped by teacher.

<details>
<summary>Solution</summary>

```sql
SELECT teacher_id, COUNT(DISTINCT subject_id) AS cnt
FROM Teacher
GROUP BY teacher_id;
```

</details>

---

## 1141 · User Activity for the Past 30 Days I

**Difficulty:** Easy · **Schema:** `lc1141`

**Problem.** `Activity(user_id, session_id, activity_date, activity_type)`. For the **30 days
ending 2019-07-27 (inclusive)**, report the number of distinct active users per day. Only include
days with at least one active user.

**Example.**

Activity: users 1 and 2 active on 2019-07-20; users 2 and 3 active on 2019-07-21; user 4 active
on 2019-06-25 (outside the window)

Output:

| day | active_users |
|---|---|
| 2019-07-20 | 2 |
| 2019-07-21 | 2 |

**What it's really testing:** **date window arithmetic** (off-by-one!) + `COUNT(DISTINCT)`.

**How to relate:** "30 days ending X, inclusive" → X−29 through X. "Active users" when a user
logs many activities a day → `COUNT(DISTINCT user_id)`.

**Hint ladder.**
1. Filter rows to the window first (`WHERE`), then group by date.
2. 30 days *including* 07-27 starts on 07-27 − 29 = **06-28**, not 06-27.
3. `WHERE activity_date BETWEEN DATE '2019-07-27' - 29 AND DATE '2019-07-27'`, `COUNT(DISTINCT user_id)`.

**Postgres note:** `DATE '2019-07-27' - 29` is a date. You could also write
`activity_date > DATE '2019-07-27' - 30`. Both work. Say the off-by-one reasoning out loud.

<details>
<summary>Solution</summary>

```sql
SELECT activity_date AS day, COUNT(DISTINCT user_id) AS active_users
FROM Activity
WHERE activity_date BETWEEN DATE '2019-07-27' - 29 AND DATE '2019-07-27'
GROUP BY activity_date;
```

</details>

---

## 1070 · Product Sales Analysis III

**Difficulty:** Medium · **Schema:** `lc1070`

**Problem.** `Sales(sale_id, product_id, year, quantity, price)`. For every product, find the
**first year** it was sold and return **every sale** of that product in that year:
`product_id, first_year, quantity, price`.

**Example.**

Sales: (1, 100, 2008, 10, 5000), (2, 100, 2009, 12, 5000), (7, 200, 2011, 15, 9000)

Output:

| product_id | first_year | quantity | price |
|---|---|---|---|
| 100 | 2008 | 10 | 5000 |
| 200 | 2011 | 15 | 9000 |

(The playground adds a second 2011 sale of product 200, `(8, 200, 2011, 3, 8500)`. **Both** 2011
rows must come back. This is the hidden test most first attempts fail.)

**What it's really testing:** **ties in "first per group"**. You want every row that ties for
first, not just one of them.

**How to relate:** "all sales in the first year" → several rows can share the minimum year. Choose
a method that **keeps ties**.

**Hint ladder.**
1. `DISTINCT ON` and `ROW_NUMBER` keep one row per product. Is that what's asked?
2. Find each product's minimum year, then keep **every** sale whose (product, year) matches it.
3. `WHERE (product_id, year) IN (SELECT product_id, MIN(year) FROM Sales GROUP BY product_id)`,
   or `RANK() OVER (PARTITION BY product_id ORDER BY year) = 1`.

<details>
<summary>Solution</summary>

```sql
-- Tuple IN: both columns must match one of the (product, first year) pairs
SELECT product_id, year AS first_year, quantity, price
FROM Sales
WHERE (product_id, year) IN (SELECT product_id, MIN(year) FROM Sales GROUP BY product_id);

-- Window: RANK gives tied rows the same rank, so both 2011 rows get rank 1
SELECT product_id, year AS first_year, quantity, price
FROM (
  SELECT *, RANK() OVER (PARTITION BY product_id ORDER BY year) AS rnk
  FROM Sales
) ranked
WHERE rnk = 1;
```

**Why the subquery around the window?** Window functions run in the `SELECT` step, which comes
*after* `WHERE`, so `WHERE RANK() … = 1` is illegal. Compute the rank in an inner query and filter
it in the outer one. You'll use this wrapper constantly from now on.

</details>

---

## 596 · Classes With at Least 5 Students

**Difficulty:** Easy · **Schema:** `lc596`

**Problem.** `Courses(student, class)`. Return every class with **at least five** students.

**Example.**

Courses: Math has A, C, E, G, H, I; English has B; Biology has D; Computer has F

Output: `Math`

**What it's really testing:** `HAVING`.

**How to relate:** "at least five students" is a condition on a **group's count** → `HAVING COUNT(…) >= 5`.

**Hint ladder.**
1. One output row per class → `GROUP BY class`.
2. You can't write `WHERE COUNT(*) >= 5`. Why? (When does WHERE run?)
3. `HAVING COUNT(student) >= 5`.

<details>
<summary>Solution</summary>

```sql
SELECT class
FROM Courses
GROUP BY class
HAVING COUNT(student) >= 5;
```

**Talking point:** here `(student, class)` is the primary key, so a student can't be listed twice
in a class. If it weren't, you'd use `COUNT(DISTINCT student)`. Mentioning that you checked the key
is the senior move.

</details>

---

## 1729 · Find Followers Count

**Difficulty:** Easy · **Schema:** `lc1729`

**Problem.** `Followers(user_id, follower_id)`. For each user, return the number of followers,
ordered by user_id.

**Example.**

Followers: (0, 1), (1, 0), (2, 0), (2, 1)

Output: user 0 → 1, user 1 → 1, user 2 → 2

**What it's really testing:** basic `GROUP BY` + `COUNT` + `ORDER BY`.

**How to relate:** "for each user, how many" → group + count.

**Hint ladder.**
1. One output row per `user_id`.
2. Count the follower rows in each group.
3. `GROUP BY user_id ORDER BY user_id`.

<details>
<summary>Solution</summary>

```sql
SELECT user_id, COUNT(follower_id) AS followers_count
FROM Followers
GROUP BY user_id
ORDER BY user_id;
```

</details>

---

## 619 · Biggest Single Number

**Difficulty:** Easy · **Schema:** `lc619`

**Problem.** `MyNumbers(num)`, which may contain duplicates. A **single number** appears exactly
once. Return the **largest** single number, or **null** if there isn't one.

**Example.**

MyNumbers: 8, 8, 3, 3, 1, 4, 5, 6 → Output: `6`

MyNumbers: 8, 8, 7, 7, 3, 3, 3 → Output: `null`

**What it's really testing:** HAVING `COUNT(*) = 1`, and the **empty-set-returns-NULL** behaviour.

**How to relate:** "appears only once" → a group condition (`HAVING`). "Return null if none" →
an aggregate on the outside (`MAX` over an empty set is NULL).

**Hint ladder.**
1. Step one: find the numbers that appear exactly once.
2. Step two: the biggest of those. `ORDER BY num DESC LIMIT 1` returns **no row** when step one is empty. LeetCode wants a NULL row.
3. `SELECT MAX(num) FROM (… GROUP BY num HAVING COUNT(*) = 1) singles`. MAX of nothing is NULL.

<details>
<summary>Solution</summary>

```sql
SELECT MAX(num) AS num
FROM (
  SELECT num FROM MyNumbers GROUP BY num HAVING COUNT(*) = 1
) singles;
```

The playground file deletes the single numbers and runs the query again, so you can watch it
return `NULL`.

</details>

---

## 1045 · Customers Who Bought All Products

**Difficulty:** Medium · **Schema:** `lc1045`

**Problem.** `Customer(customer_id, product_key)` (may contain duplicates) and
`Product(product_key)`. Return the ids of customers who bought **every** product in Product.

**Example.**

Customer: (1, 5), (2, 6), (3, 5), (3, 6), (1, 6)
Product: 5, 6

Output: `1`, `3`

(The playground adds a duplicate `(2, 6)`, so customer 2 has two rows but still only one distinct
product, and must **not** appear.)

**What it's really testing:** **relational division**, with a DISTINCT trap.

**How to relate:** "bought **all** products" → "the number of different products they bought
equals the number of products that exist".

**Hint ladder.**
1. How many products exist? That number is a scalar subquery.
2. For each customer, how many **different** products did they buy?
3. `GROUP BY customer_id HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product)`.

<details>
<summary>Solution</summary>

```sql
SELECT customer_id
FROM Customer
GROUP BY customer_id
HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);
```

**Without `DISTINCT`**, customer 2's two rows for product 6 count as 2 = 2 products, a false
positive. **Double NOT EXISTS version** ("there's no product they didn't buy"):

```sql
SELECT DISTINCT c.customer_id FROM Customer c
WHERE NOT EXISTS (
  SELECT 1 FROM Product p
  WHERE NOT EXISTS (SELECT 1 FROM Customer c2 WHERE c2.customer_id = c.customer_id AND c2.product_key = p.product_key)
);
```

</details>

---

## 🧠 Section recap

- `HAVING` is the WHERE for groups. "At least N", "exactly once" → HAVING.
- "Unique" / data with repeats → `COUNT(DISTINCT …)`.
- "Bought ALL" → compare a distinct count with the total count (relational division).
- "Return null if none" → an outer aggregate or a scalar subquery, never a bare `LIMIT`.
- To filter on a window function, wrap it in a subquery, because windows run after WHERE.
- "First per group, keep ties" → `RANK` or MIN + tuple IN, not `ROW_NUMBER` / `DISTINCT ON`.
