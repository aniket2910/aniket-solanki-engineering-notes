-- LeetCode SQL 50 · Section 4: Sorting and Grouping. SPOILERS: these are the solutions.
-- Notes: ../../../LEETCODE_SQL_50/04-sorting-grouping.md

-- 2356. Number of Unique Subjects Taught by Each Teacher  (expect: 1→2, 2→4)
SET search_path TO lc2356;
SELECT teacher_id, COUNT(DISTINCT subject_id) AS cnt
FROM Teacher
GROUP BY teacher_id;

-- 1141. User Activity for the Past 30 Days I  (expect: 07-20→2, 07-21→2)
SET search_path TO lc1141;
-- 30 days ENDING 2019-07-27 inclusive = 2019-06-28 .. 2019-07-27.
SELECT activity_date AS day, COUNT(DISTINCT user_id) AS active_users
FROM Activity
WHERE activity_date BETWEEN DATE '2019-07-27' - 29 AND DATE '2019-07-27'
GROUP BY activity_date;

-- 1070. Product Sales Analysis III  (expect: 100/2008, and BOTH 200/2011 rows)
SET search_path TO lc1070;
-- RANK, not ROW_NUMBER and not DISTINCT ON: every sale in the first year must survive.
SELECT product_id, year AS first_year, quantity, price
FROM (
  SELECT *, RANK() OVER (PARTITION BY product_id ORDER BY year) AS rnk
  FROM Sales
) ranked
WHERE rnk = 1;
-- Equivalent with a tuple IN: (product_id, year) must be one of the (product, first year) pairs.
SELECT product_id, year AS first_year, quantity, price
FROM Sales
WHERE (product_id, year) IN (SELECT product_id, MIN(year) FROM Sales GROUP BY product_id);

-- 596. Classes With at Least 5 Students  (expect: Math)
SET search_path TO lc596;
SELECT class
FROM Courses
GROUP BY class
HAVING COUNT(student) >= 5;

-- 1729. Find Followers Count
SET search_path TO lc1729;
SELECT user_id, COUNT(follower_id) AS followers_count
FROM Followers
GROUP BY user_id
ORDER BY user_id;

-- 619. Biggest Single Number  (expect: 6)
SET search_path TO lc619;
-- MAX over an empty set is NULL, which is exactly the "no single number" answer.
SELECT MAX(num) AS num
FROM (
  SELECT num FROM MyNumbers GROUP BY num HAVING COUNT(*) = 1
) singles;
-- Prove the empty case: delete the singles and run it again.
DELETE FROM MyNumbers WHERE num IN (1, 4, 5, 6);
SELECT MAX(num) AS num
FROM (SELECT num FROM MyNumbers GROUP BY num HAVING COUNT(*) = 1) singles;

-- 1045. Customers Who Bought All Products  (expect: 1, 3 — NOT 2, despite its two rows)
SET search_path TO lc1045;
-- Relational division by counting: distinct products bought = total products.
SELECT customer_id
FROM Customer
GROUP BY customer_id
HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);
