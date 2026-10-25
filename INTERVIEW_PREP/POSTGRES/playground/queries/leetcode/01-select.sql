-- LeetCode SQL 50 · Section 1: Select. SPOILERS: these are the solutions.
-- Notes: ../../../LEETCODE_SQL_50/01-select.md
-- Try it yourself first in queries/scratch.sql:  SET search_path TO lc1757;  then your query.

-- 1757. Recyclable and Low Fat Products  (expect: 1, 3)
SET search_path TO lc1757;
SELECT product_id
FROM Products
WHERE low_fats = 'Y' AND recyclable = 'Y';

-- 584. Find Customer Referee  (expect: Will, Jane, Bill, Zack)
SET search_path TO lc584;
-- The trap first: this "obvious" query drops every NULL referee (NULL <> 2 is unknown, not true).
SELECT name FROM Customer WHERE referee_id <> 2;
-- Correct: NULL-safe comparison.
SELECT name FROM Customer WHERE referee_id IS DISTINCT FROM 2;

-- 595. Big Countries  (expect: Afghanistan, Algeria)
SET search_path TO lc595;
SELECT name, population, area
FROM World
WHERE area >= 3000000 OR population >= 25000000;

-- 1148. Article Views I  (expect: 4, 7)
SET search_path TO lc1148;
SELECT DISTINCT author_id AS id
FROM Views
WHERE author_id = viewer_id
ORDER BY id;

-- 1683. Invalid Tweets  (expect: 2)
SET search_path TO lc1683;
SELECT tweet_id
FROM Tweets
WHERE char_length(content) > 15;
