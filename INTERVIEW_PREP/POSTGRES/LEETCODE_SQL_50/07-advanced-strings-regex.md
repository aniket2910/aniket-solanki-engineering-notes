# 07 · Advanced String Functions / Regex / Clause

[← 06 Subqueries](06-subqueries.md) · [SQL 50 home](README.md)

The last section mixes string handling, pattern matching, a `DELETE`, and two classics (**Second
Highest Salary** and **date-range filtering**). The string problems mostly come down to knowing the
Postgres function names. The real lessons are **anchoring patterns properly** and **returning NULL
instead of no rows**.

**Run the solutions:** `npm run q -- leetcode/07` (from `../playground`).

---

## Concepts for this section

### Concept: the string functions you'll actually use

| Need | Postgres | Example → result |
|---|---|---|
| Upper / lower case | `UPPER(s)`, `LOWER(s)` | `UPPER('bOB')` → `BOB` |
| First n chars | `LEFT(s, n)` | `LEFT('alice', 1)` → `a` |
| From position k on | `SUBSTRING(s FROM k)` / `SUBSTRING(s, k)` | `SUBSTRING('alice', 2)` → `lice` |
| Concatenate | `a \|\| b` or `CONCAT(a, b)` | `\|\|` returns NULL if either side is NULL; `CONCAT` treats NULL as '' |
| Length (characters) | `char_length(s)` / `length(s)` | `length('héllo')` → 5 |
| Capitalise each word | `initcap(s)` | `initcap('mary ann')` → `Mary Ann` |
| Trim | `TRIM(s)`, `LTRIM`, `RTRIM` | |
| Find position | `POSITION('x' IN s)` / `strpos(s, 'x')` | 0 if not found |
| Split | `split_part(s, ',', 2)` | second comma-separated field |

### Concept: LIKE vs regex

| | `LIKE` | Regex `~` |
|---|---|---|
| Wildcards | `%` = any run of characters, `_` = exactly one | full regular expressions |
| Anchored? | **Always**: the pattern must match the whole string | **Never** by default. Add `^` and `$` yourself |
| Case-insensitive | `ILIKE` | `~*` |
| Negate | `NOT LIKE` | `!~` |

**The anchoring trap goes both ways.** `LIKE 'DIAB1%'` only matches at the start, because LIKE is
anchored. The regex `'[a-z]+@leetcode.com'` matches *anywhere* inside the string, so it accepts
`"#bad@leetcode.com"` unless you write `^…$`.

**Escape the dot.** In a regex, `.` means "any character", so `leetcode.com` also matches
`leetcodeXcom`. Write `leetcode\.com`.

**Word boundaries in Postgres regex:** `\m` = start of a word, `\M` = end of a word, `\y` = either.
(Postgres doesn't use `\b` for this. In Postgres `\b` means backspace.)

### Concept: string_agg

`string_agg(expr, separator ORDER BY …)` is Postgres's `GROUP_CONCAT`: it joins a group's values
into one string. `DISTINCT` and `ORDER BY` go **inside** the parentheses:

```sql
string_agg(DISTINCT product, ',' ORDER BY product)
```

Its relative `array_agg(…)` returns a real array instead of a string, which is useful when the
result goes to application code.

### Concept: half-open date ranges

"Orders in February 2020" → `order_date >= '2020-02-01' AND order_date < '2020-03-01'`.

Why not `BETWEEN '2020-02-01' AND '2020-02-29'`? It works for a `date` column, but on a
`timestamp` column it misses everything after midnight on the 29th. And why not
`to_char(order_date, 'YYYY-MM') = '2020-02'`? Wrapping the column in a function stops a normal
index from being used (see [001 Indexes](../001-indexes.md)). The half-open form is correct for
both types and can use an index, so make it your default.

---

## 1667 · Fix Names in a Table

**Difficulty:** Easy · **Schema:** `lc1667`

**Problem.** `Users(user_id, name)`, where names have messy case. Fix them so only the first
character is uppercase and the rest are lowercase. Order by user_id.

**Example.**

Users: (1, aLice), (2, bOB)

Output: (1, Alice), (2, Bob)

**What it's really testing:** basic string functions and concatenation.

**How to relate:** "first letter upper, the rest lower" → split the string into two parts, fix each part, and join them back.

**Hint ladder.**
1. Split the name into the first character and everything after it.
2. `LEFT(name, 1)` and `SUBSTRING(name FROM 2)`.
3. `UPPER(…) || LOWER(…)`.

<details>
<summary>Solution</summary>

```sql
SELECT user_id,
       UPPER(LEFT(name, 1)) || LOWER(SUBSTRING(name FROM 2)) AS name
FROM Users
ORDER BY user_id;
```

**`initcap(name)` works on this data**, but it capitalises *every word* (`'mary ann'` → `'Mary
Ann'`). The spec says only the first character, so the explicit version is the safe one. Pointing
out that difference shows you read the spec carefully.

</details>

---

## 1527 · Patients With a Condition

**Difficulty:** Easy · **Schema:** `lc1527`

**Problem.** `Patients(patient_id, patient_name, conditions)`, where `conditions` is a
space-separated list of codes. Find patients with **Type I Diabetes**: any condition code that
**starts with** `DIAB1`.

**Example.**

Patients: (1, Daniel, 'YFEV COUGH'), (2, Alice, ''), (3, Bob, 'DIAB100 MYOP'),
(4, George, 'ACNE DIAB100'), (5, Alain, 'DIAB201')

Output: (3, Bob, DIAB100 MYOP), (4, George, ACNE DIAB100)

(The playground adds `(6, Trap, 'SADIAB100')`. The code there is `SADIAB100`, which doesn't
*start* with DIAB1, so it must not match.)

**What it's really testing:** matching at a **word boundary**, not just "somewhere in the string".

**How to relate:** "a code that starts with DIAB1", inside a space-separated list → DIAB1 is either
at the **start of the string** or **right after a space**.

**Hint ladder.**
1. `LIKE '%DIAB1%'` passes the example and fails the hidden test. Run it in the playground and see which row sneaks in.
2. The prefix can be in two places: the very beginning, or after a space.
3. `conditions LIKE 'DIAB1%' OR conditions LIKE '% DIAB1%'`. Or one regex with a word-start anchor: `~ '\mDIAB1'`.

<details>
<summary>Solution</summary>

```sql
SELECT patient_id, patient_name, conditions
FROM Patients
WHERE conditions LIKE 'DIAB1%' OR conditions LIKE '% DIAB1%';

-- Regex: \m = start of a word in Postgres
SELECT patient_id, patient_name, conditions
FROM Patients
WHERE conditions ~ '\mDIAB1';
```

**Production note:** a space-separated list in one column breaks first normal form. The proper
design is a `patient_conditions(patient_id, code)` table (or a `text[]` column with a GIN index).
Saying that in an interview shows you think about schema design, not just the query.

</details>

---

## 196 · Delete Duplicate Emails

**Difficulty:** Easy · **Schema:** `lc196`

**Problem.** `Person(id, email)`. **Delete** every duplicate email, keeping only the row with the
**smallest id** for each email. (It must be a `DELETE`, not a `SELECT`.)

**Example.**

Person: (1, john@example.com), (2, bob@example.com), (3, john@example.com)

After: (1, john@example.com), (2, bob@example.com)

**What it's really testing:** writing a `DELETE` that uses a **self-join**, and the Postgres syntax for it.

**How to relate:** "delete a row if another row has the same email and a smaller id" → each row has
to look at the other rows of the same table → self-join, inside a DELETE.

**Hint ladder.**
1. Write the `SELECT` first: which rows should go? Rows `p1` where some `p2` has the same email and `p2.id < p1.id`.
2. Postgres's "delete with a join" is `DELETE FROM t1 USING t2 WHERE …`.
3. `DELETE FROM Person p1 USING Person p2 WHERE p1.email = p2.email AND p1.id > p2.id`.

<details>
<summary>Solution</summary>

```sql
DELETE FROM Person p1
USING Person p2
WHERE p1.email = p2.email AND p1.id > p2.id;

-- Subquery version: delete everything that isn't the smallest id for its email
DELETE FROM Person
WHERE id NOT IN (SELECT MIN(id) FROM Person GROUP BY email);
```

**Postgres vs MySQL:** MySQL writes `DELETE p1 FROM Person p1, Person p2 WHERE …`, which is a syntax
error in Postgres. MySQL also refuses the `NOT IN` subquery version on the same table (error 1093),
while Postgres allows it.

**Write the SELECT first** (`SELECT p1.* FROM Person p1 JOIN Person p2 …`), check it returns exactly
the rows you expect, and only then turn it into a DELETE. That's a good habit to describe in
interviews, and it's how you avoid production accidents.

</details>

---

## 176 · Second Highest Salary

**Difficulty:** Medium · **Schema:** `lc176`

**Problem.** `Employee(id, salary)`. Return the **second highest distinct** salary as
`SecondHighestSalary`. If there isn't one, return **null** (one row containing NULL, not zero rows).

**Example.**

Employee: (1, 100), (2, 200), (3, 300) → Output: `200`

Employee: (1, 100) → Output: `null`

**What it's really testing:** (a) DISTINCT, because tied top salaries don't count as "second", and
(b) the **empty-set → NULL** trick from 619.

**How to relate:** "second highest" → sort the distinct salaries in descending order and skip one.
"Return null if none" → wrap the query in something that always returns one row.

**Hint ladder.**
1. `SELECT DISTINCT salary … ORDER BY salary DESC OFFSET 1 LIMIT 1` finds it, but with one employee it returns **no rows**.
2. A **scalar subquery** that finds nothing evaluates to NULL. So put the query inside `SELECT ( … )`.
3. `SELECT (SELECT DISTINCT salary FROM Employee ORDER BY salary DESC OFFSET 1 LIMIT 1) AS SecondHighestSalary`.

<details>
<summary>Solution</summary>

```sql
-- Scalar-subquery wrapper: zero rows inside → NULL outside
SELECT (
  SELECT DISTINCT salary FROM Employee ORDER BY salary DESC OFFSET 1 LIMIT 1
) AS SecondHighestSalary;

-- MAX of everything below the max: MAX of nothing is NULL, so this handles the edge on its own
SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);
```

**Generalise to the Nth highest (LeetCode 177):** `OFFSET N-1`, or
`DENSE_RANK() OVER (ORDER BY salary DESC) = N` (same reasoning as 185). Without `DISTINCT`, salaries
300, 300, 200 would give 300 as "second highest", which is wrong.

</details>

---

## 1484 · Group Sold Products By The Date

**Difficulty:** Easy · **Schema:** `lc1484`

**Problem.** `Activities(sell_date, product)`, which may contain duplicates. For each date,
return the number of **different** products sold and their names, **sorted alphabetically** and
joined with commas. Order by sell_date.

**Example.**

Activities: 2020-05-30 → Headphone, Basketball, T-Shirt; 2020-06-01 → Pencil, Bible;
2020-06-02 → Mask, Mask

Output:

| sell_date | num_sold | products |
|---|---|---|
| 2020-05-30 | 3 | Basketball,Headphone,T-Shirt |
| 2020-06-01 | 2 | Bible,Pencil |
| 2020-06-02 | 1 | Mask |

**What it's really testing:** knowing `string_agg` with `DISTINCT` and `ORDER BY`, plus `COUNT(DISTINCT)`.

**How to relate:** "list of names joined with commas, per group" → a string aggregate.
"Different products" with duplicates in the data → DISTINCT in both the count and the list.

**Hint ladder.**
1. One row per date → `GROUP BY sell_date`.
2. The comma list is an *aggregate*: it joins the values of the group into one string.
3. `COUNT(DISTINCT product)` and `string_agg(DISTINCT product, ',' ORDER BY product)`.

<details>
<summary>Solution</summary>

```sql
SELECT sell_date,
       COUNT(DISTINCT product)                            AS num_sold,
       string_agg(DISTINCT product, ',' ORDER BY product) AS products
FROM Activities
GROUP BY sell_date
ORDER BY sell_date;
```

**Postgres rule:** with `DISTINCT` inside `string_agg`, the `ORDER BY` expression must be the
aggregated expression itself (`product`). Ordering by some other column is an error.

</details>

---

## 1327 · List the Products Ordered in a Period

**Difficulty:** Easy · **Schema:** `lc1327`

**Problem.** `Products(product_id, product_name, product_category)` and `Orders(product_id,
order_date, unit)`. Return the names and total units of products with **at least 100 units ordered
in February 2020**.

**Example.**

Orders in Feb 2020: Leetcode Solutions 60 + 70 = 130, Jewels of Stringology 80, HP 2 + 3 = 5,
Leetcode Kit 50 + 50 = 100 (Lenovo's orders are all in March)

Output:

| product_name | unit |
|---|---|
| Leetcode Solutions | 130 |
| Leetcode Kit | 100 |

**What it's really testing:** the WHERE → GROUP BY → HAVING pipeline, plus a **clean date range**.

**How to relate:** "in February 2020" → filter rows (WHERE, before grouping). "At least 100 in
total" → filter groups (HAVING, after grouping).

**Hint ladder.**
1. Join Orders to Products for the name.
2. Keep only February rows: `order_date >= '2020-02-01' AND order_date < '2020-03-01'`.
3. `GROUP BY product`, then `HAVING SUM(unit) >= 100`.

<details>
<summary>Solution</summary>

```sql
SELECT p.product_name, SUM(o.unit) AS unit
FROM Orders o
JOIN Products p ON p.product_id = o.product_id
WHERE o.order_date >= DATE '2020-02-01' AND o.order_date < DATE '2020-03-01'
GROUP BY p.product_id, p.product_name
HAVING SUM(o.unit) >= 100;
```

**Say this:** "I'm using a half-open range instead of `to_char(order_date, 'YYYY-MM') = '2020-02'`
because the function would stop an index on `order_date` from being used, and the range is also
correct if the column becomes a timestamp."

</details>

---

## 1517 · Find Users With Valid E-Mails

**Difficulty:** Easy · **Schema:** `lc1517`

**Problem.** `Users(user_id, name, mail)`. A mail is valid if:
- the prefix (before `@`) **starts with a letter**, and contains only letters (any case), digits,
  underscore `_`, period `.` and/or dash `-`;
- the domain is exactly **`@leetcode.com`**.

**Example.**

Users: winston@leetcode.com ✅, jonathanisgreat ❌ (no domain), bella-@leetcode.com ✅,
sally.come@leetcode.com ✅, quarz#2020@leetcode.com ❌ (`#`), david69@gmail.com ❌ (domain),
.shapo@leetcode.com ❌ (starts with `.`)

Output: users 1 (Winston), 3 (Annabelle), 4 (Sally)

(The playground adds `dot@leetcodeXcom`. It's caught only if you escape the dot.)

**What it's really testing:** writing an **anchored** regex correctly: `^`, `$`, character classes, and escaping.

**How to relate:** "starts with", "only these characters", "exactly this domain" → a regex anchored
at both ends.

**Hint ladder.**
1. Build it piece by piece: start-of-string, one letter, then zero or more allowed characters, then the literal domain, then end-of-string.
2. `^[A-Za-z]` for the first character, then `[A-Za-z0-9_.-]*`. Inside `[ ]`, the dot is literal, and put `-` last so it isn't read as a range.
3. `@leetcode\.com$`: escape the dot, and anchor the end. Use `~` (case-sensitive).

<details>
<summary>Solution</summary>

```sql
SELECT *
FROM Users
WHERE mail ~ '^[A-Za-z][A-Za-z0-9_.-]*@leetcode\.com$';
```

**Common mistakes, each one a hidden test:** no `^` (accepts `.shapo@…`), no `$` (accepts
`x@leetcode.com.evil`), `.com` without the backslash (accepts `leetcodeXcom`), and `~*` (accepts
`@LEETCODE.COM`, which LeetCode treats as invalid).

</details>

---

## 🧠 Section recap

- LIKE is anchored to the whole string, and regex is not: add `^…$`. Escape `.` in regexes.
- Word-start matching: `LIKE 'X%' OR LIKE '% X%'`, or Postgres's `\m` anchor.
- `DELETE … USING` is Postgres's delete-with-join. Always run the SELECT version first.
- "Return null if none" → a scalar subquery or an outer aggregate.
- `string_agg(DISTINCT x, ',' ORDER BY x)` = GROUP_CONCAT.
- Date filters: half-open ranges, never a function wrapped around the column.

**You've finished SQL 50.** Go back to the [study plan](README.md)
for the review days.
