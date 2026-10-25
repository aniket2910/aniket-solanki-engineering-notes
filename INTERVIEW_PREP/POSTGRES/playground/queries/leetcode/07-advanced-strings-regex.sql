-- LeetCode SQL 50 · Section 7: Advanced String Functions / Regex / Clause. SPOILERS.
-- Notes: ../../../LEETCODE_SQL_50/07-advanced-strings-regex.md

-- 1667. Fix Names in a Table  (expect: Alice, Bob)
SET search_path TO lc1667;
SELECT user_id,
       UPPER(LEFT(name, 1)) || LOWER(SUBSTRING(name FROM 2)) AS name
FROM Users
ORDER BY user_id;
-- Postgres-only shortcut. Careful: initcap capitalises EVERY word ('mary ann' → 'Mary Ann').
SELECT user_id, initcap(name) AS name FROM Users ORDER BY user_id;

-- 1527. Patients With a Condition  (expect: 3, 4 — NOT 6)
SET search_path TO lc1527;
-- The trap: plain LIKE also matches 'SADIAB100'.
SELECT patient_id FROM Patients WHERE conditions LIKE '%DIAB1%';
-- Correct: DIAB1 at the very start, or right after a space.
SELECT patient_id, patient_name, conditions
FROM Patients
WHERE conditions LIKE 'DIAB1%' OR conditions LIKE '% DIAB1%';
-- Same rule as a regex: \m is Postgres's "start of a word" anchor.
SELECT patient_id, patient_name, conditions
FROM Patients
WHERE conditions ~ '\mDIAB1';

-- 196. Delete Duplicate Emails  (expect: ids 1 and 2 remain)
SET search_path TO lc196;
-- DELETE ... USING is Postgres's "delete with a join": remove p1 when a smaller-id twin exists.
DELETE FROM Person p1
USING Person p2
WHERE p1.email = p2.email AND p1.id > p2.id;
SELECT * FROM Person ORDER BY id;

-- 176. Second Highest Salary  (expect: 200; and NULL when there is no second)
SET search_path TO lc176;
-- Wrapping in a scalar subquery turns "no rows" into one row holding NULL.
SELECT (
  SELECT DISTINCT salary FROM Employee ORDER BY salary DESC OFFSET 1 LIMIT 1
) AS SecondHighestSalary;
-- Alternative: the max of everything below the max.
SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);
-- Prove the edge: only one employee left → NULL, not an empty result.
DELETE FROM Employee WHERE id > 1;
SELECT (SELECT DISTINCT salary FROM Employee ORDER BY salary DESC OFFSET 1 LIMIT 1) AS SecondHighestSalary;

-- 1484. Group Sold Products By The Date
SET search_path TO lc1484;
-- string_agg is Postgres's GROUP_CONCAT; DISTINCT + ORDER BY live INSIDE the call.
SELECT sell_date,
       COUNT(DISTINCT product)                          AS num_sold,
       string_agg(DISTINCT product, ',' ORDER BY product) AS products
FROM Activities
GROUP BY sell_date
ORDER BY sell_date;

-- 1327. List the Products Ordered in a Period  (expect: Leetcode Solutions 130, Leetcode Kit 100)
SET search_path TO lc1327;
-- Half-open date range: >= first day AND < first day of next month. Index-friendly, no edge bugs.
SELECT p.product_name, SUM(o.unit) AS unit
FROM Orders o
JOIN Products p ON p.product_id = o.product_id
WHERE o.order_date >= DATE '2020-02-01' AND o.order_date < DATE '2020-03-01'
GROUP BY p.product_id, p.product_name
HAVING SUM(o.unit) >= 100;

-- 1517. Find Users With Valid E-Mails  (expect: 1, 3, 4 — NOT 8)
SET search_path TO lc1517;
-- ^ letter, then letters/digits/_ . -, then the literal domain. \. escapes the dot. ~ is case-sensitive.
SELECT *
FROM Users
WHERE mail ~ '^[A-Za-z][A-Za-z0-9_.-]*@leetcode\.com$';
