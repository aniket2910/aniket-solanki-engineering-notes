# 01 · Select

[← SQL 50 home](README.md) · Next: [02 Basic Joins →](02-basic-joins.md)

Five warm-ups. They look trivial, and four of them are. The fifth (584) is the most important
problem in the whole plan, because the NULL lesson it teaches comes back in about ten later
problems.

**Run the solutions:** `npm run q -- leetcode/01` (from `../playground`).

---

## Concepts for this section

### Concept: the order a query actually runs

You write `SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT`, but Postgres evaluates it
in this order:

`FROM / JOIN` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` (incl. window functions) → `DISTINCT` → `ORDER BY` → `LIMIT`

**Why it matters:** it explains most "why doesn't this work?" moments. You can't use a `SELECT`
alias in `WHERE`, because `WHERE` runs before `SELECT` has created the alias. You *can* use it in
`ORDER BY`, because that runs after. And you can't filter on a window function in `WHERE`, so you
wrap it in a subquery (you'll do that a lot from section 04 on).

### Concept: NULL is not a value

NULL means **unknown**. Any comparison with an unknown gives *unknown*, not true or false:

| Expression | Result |
|---|---|
| `NULL = 2` | NULL (unknown) |
| `NULL <> 2` | NULL (unknown) |
| `NULL = NULL` | NULL (unknown) |
| `NULL IS NULL` | true |
| `NULL IS DISTINCT FROM 2` | **true** |

`WHERE` keeps a row only when the condition is **true**, so unknown rows are silently dropped.
That's SQL's **three-valued logic** (true / false / unknown).

**The tools:** `IS NULL`, `IS NOT NULL`, `COALESCE(x, default)`, and Postgres's NULL-safe
comparison `IS DISTINCT FROM` / `IS NOT DISTINCT FROM`.

**How to relate:** whenever a problem says "not equal to X" on a column that **can be NULL**, stop
and ask whether NULL rows belong in the answer. They almost always do.

### Concept: DISTINCT removes duplicate output rows

`SELECT DISTINCT a, b` keeps one copy of each distinct *(a, b)* combination. It applies to the
whole output row, not to one column.

---

## 1757 · Recyclable and Low Fat Products

**Difficulty:** Easy · **Schema:** `lc1757`

**Problem.** A `Products` table has `product_id`, `low_fats` ('Y'/'N') and `recyclable` ('Y'/'N').
Return the ids of products that are **both** low fat **and** recyclable, in any order.

**Example.**

Products:

| product_id | low_fats | recyclable |
|---|---|---|
| 0 | Y | N |
| 1 | Y | Y |
| 2 | N | Y |
| 3 | Y | Y |
| 4 | N | N |

Output:

| product_id |
|---|
| 1 |
| 3 |

**What it's really testing:** that you can write a `WHERE` with two conditions joined by `AND`.

**How to relate:** "both A and B" → `AND`.

**Hint ladder.**
1. Each output row is one product, and the input is one row per product. So no grouping, just a filter.
2. Two flags, both must be 'Y'.
3. `WHERE low_fats = 'Y' AND recyclable = 'Y'`.

<details>
<summary>Solution</summary>

```sql
SELECT product_id
FROM Products
WHERE low_fats = 'Y' AND recyclable = 'Y';
```

</details>

---

## 584 · Find Customer Referee

**Difficulty:** Easy · **Schema:** `lc584`

**Problem.** `Customer(id, name, referee_id)`, where `referee_id` is the id of the customer who
referred them, or NULL if nobody did. Return the names of customers who were **not referred by the
customer with id 2**.

**Example.**

Customer:

| id | name | referee_id |
|---|---|---|
| 1 | Will | null |
| 2 | Jane | null |
| 3 | Alex | 2 |
| 4 | Bill | null |
| 5 | Zack | 1 |
| 6 | Mark | 2 |

Output: `Will`, `Jane`, `Bill`, `Zack`

**What it's really testing:** **NULL three-valued logic.** This is the whole problem.

**How to relate:** "not referred by 2" on a **nullable** column. Will was referred by nobody, and
"nobody" is certainly not customer 2, so Will belongs in the answer. Does your query agree?

**Hint ladder.**
1. Run `WHERE referee_id <> 2` and count the rows. You'll get only Zack. Where did Will, Jane and Bill go?
2. For Will, `referee_id` is NULL, so `NULL <> 2` is *unknown*, and `WHERE` drops unknown rows.
3. Include the NULLs on purpose: `referee_id <> 2 OR referee_id IS NULL`. In Postgres there's a
   single operator that does exactly this.

<details>
<summary>Solution</summary>

```sql
-- Postgres's NULL-safe "not equal": treats NULL as a comparable value.
SELECT name FROM Customer WHERE referee_id IS DISTINCT FROM 2;

-- Portable version, works in every database:
SELECT name FROM Customer WHERE referee_id <> 2 OR referee_id IS NULL;
```

**Say this in an interview:** "SQL uses three-valued logic. `NULL <> 2` evaluates to unknown, and
`WHERE` only keeps rows that are true, so the NULL referees vanish. I either add
`OR referee_id IS NULL` or use `IS DISTINCT FROM`, which is NULL-safe."

</details>

---

## 595 · Big Countries

**Difficulty:** Easy · **Schema:** `lc595`

**Problem.** `World(name, continent, area, population, gdp)`. A country is **big** if its area is
at least 3,000,000 km² **or** its population is at least 25,000,000. Return the name, population
and area of every big country.

**Example.**

World:

| name | continent | area | population | gdp |
|---|---|---|---|---|
| Afghanistan | Asia | 652230 | 25500100 | 20343000000 |
| Albania | Europe | 28748 | 2831741 | 12960000000 |
| Algeria | Africa | 2381741 | 37100000 | 188681000000 |
| Andorra | Europe | 468 | 78115 | 3712000000 |
| Angola | Africa | 1246700 | 20609294 | 100990000000 |

Output:

| name | population | area |
|---|---|---|
| Afghanistan | 25500100 | 652230 |
| Algeria | 37100000 | 2381741 |

**What it's really testing:** `OR`, and "at least" meaning `>=`.

**How to relate:** "either condition makes it big" → `OR`. "At least" → `>=`, not `>`.

**Hint ladder.**
1. One output row per country, so it's a plain filter.
2. Two independent conditions, and either one is enough.
3. `WHERE area >= 3000000 OR population >= 25000000`.

**Bonus talking point:** LeetCode's discussion often suggests rewriting `OR` as a `UNION` of two
queries "for speed". In Postgres, if both columns have indexes the planner can combine them with a
**BitmapOr** on its own, so the `OR` version is simpler and just as fast. (See
[001 Indexes](../001-indexes.md).)

<details>
<summary>Solution</summary>

```sql
SELECT name, population, area
FROM World
WHERE area >= 3000000 OR population >= 25000000;
```

</details>

---

## 1148 · Article Views I

**Difficulty:** Easy · **Schema:** `lc1148`

**Problem.** `Views(article_id, author_id, viewer_id, view_date)`, where each row is one view and
the table may contain duplicate rows. Find every author who viewed **at least one of their own
articles**. Return their ids as `id`, sorted ascending.

**Example.**

Views:

| article_id | author_id | viewer_id | view_date |
|---|---|---|---|
| 1 | 3 | 5 | 2019-08-01 |
| 1 | 3 | 6 | 2019-08-02 |
| 2 | 7 | 7 | 2019-08-01 |
| 2 | 7 | 6 | 2019-08-02 |
| 4 | 7 | 1 | 2019-07-22 |
| 3 | 4 | 4 | 2019-07-21 |
| 3 | 4 | 4 | 2019-07-21 |

Output:

| id |
|---|
| 4 |
| 7 |

**What it's really testing:** comparing two columns **of the same row**, and `DISTINCT`.

**How to relate:** "viewed their own article" → `author_id = viewer_id`. "Find authors", where the
same author could match many rows → `DISTINCT`. Renamed and sorted output → alias + `ORDER BY`.

**Hint ladder.**
1. A `WHERE` condition can compare two columns, not just a column and a constant.
2. Author 4 matches twice (the duplicate row). The output wants each author once.
3. `SELECT DISTINCT author_id AS id … WHERE author_id = viewer_id ORDER BY id`.

<details>
<summary>Solution</summary>

```sql
SELECT DISTINCT author_id AS id
FROM Views
WHERE author_id = viewer_id
ORDER BY id;   -- ORDER BY can use the alias: it runs after SELECT
```

</details>

---

## 1683 · Invalid Tweets

**Difficulty:** Easy · **Schema:** `lc1683`

**Problem.** `Tweets(tweet_id, content)`. A tweet is invalid if its content has **more than 15
characters**. Return the ids of invalid tweets.

**Example.**

Tweets:

| tweet_id | content |
|---|---|
| 1 | Let us Code |
| 2 | More than fifteen chars are here! |

Output: `2`

**What it's really testing:** knowing the string-length function, and that *characters* and
*bytes* are different things.

**How to relate:** "number of characters" → `char_length()` (or `length()`, which means the same
thing for text in Postgres).

**Hint ladder.**
1. You need a function that measures a string.
2. Characters, not bytes: an emoji is 1 character but 4 bytes.
3. `WHERE char_length(content) > 15`.

**Postgres note:** in MySQL, `LENGTH()` counts **bytes** and `CHAR_LENGTH()` counts characters. In
Postgres, `length()` and `char_length()` both count characters, and `octet_length()` counts bytes.
Saying this difference out loud is a nice senior signal.

<details>
<summary>Solution</summary>

```sql
SELECT tweet_id
FROM Tweets
WHERE char_length(content) > 15;
```

</details>

---

## 🧠 Section recap

- **584 is the one to remember.** Nullable column + "not equal" → think about NULL, every time.
- `WHERE` runs before `SELECT`, so aliases aren't visible there. `ORDER BY` runs after, so they are.
- `DISTINCT` deduplicates the whole output row.
