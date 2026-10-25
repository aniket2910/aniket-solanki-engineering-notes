-- LeetCode SQL 50 · Section 5: Advanced Select and Joins. SPOILERS: these are the solutions.
-- Notes: ../../../LEETCODE_SQL_50/05-advanced-select-joins.md

-- 1731. The Number of Employees Which Report to Each Employee  (expect: 9 Hercy 2 39)
SET search_path TO lc1731;
SELECT m.employee_id, m.name,
       COUNT(*)                 AS reports_count,
       ROUND(AVG(e.age))        AS average_age
FROM Employees m
JOIN Employees e ON e.reports_to = m.employee_id
GROUP BY m.employee_id, m.name
ORDER BY m.employee_id;

-- 1789. Primary Department for Each Employee  (expect: 1→1, 2→1, 3→3, 4→3)
SET search_path TO lc1789;
-- Rule: the 'Y' row if one exists, otherwise the employee's only row.
SELECT employee_id, department_id
FROM Employee
WHERE primary_flag = 'Y'
   OR employee_id IN (SELECT employee_id FROM Employee GROUP BY employee_id HAVING COUNT(*) = 1);

-- 610. Triangle Judgement  (expect: No, Yes)
SET search_path TO lc610;
SELECT x, y, z,
       CASE WHEN x + y > z AND x + z > y AND y + z > x THEN 'Yes' ELSE 'No' END AS triangle
FROM Triangle;

-- 180. Consecutive Numbers  (expect: 1)
SET search_path TO lc180;
-- Look one and two rows ahead with LEAD. DISTINCT because a run of 4 would report twice.
SELECT DISTINCT num AS ConsecutiveNums
FROM (
  SELECT num,
         LEAD(num, 1) OVER (ORDER BY id) AS next1,
         LEAD(num, 2) OVER (ORDER BY id) AS next2
  FROM Logs
) w
WHERE num = next1 AND num = next2;

-- 1164. Product Price at a Given Date  (expect: 1→35, 2→50, 3→10)
SET search_path TO lc1164;
-- Every product, with its latest price on/before the date, defaulting to 10.
SELECT p.product_id,
       COALESCE(latest.new_price, 10) AS price
FROM (SELECT DISTINCT product_id FROM Products) p
LEFT JOIN (
  SELECT DISTINCT ON (product_id) product_id, new_price
  FROM Products
  WHERE change_date <= DATE '2019-08-16'
  ORDER BY product_id, change_date DESC
) latest ON latest.product_id = p.product_id
ORDER BY p.product_id;

-- 1204. Last Person to Fit in the Bus  (expect: John Cena)
SET search_path TO lc1204;
-- Running total with SUM() OVER (ORDER BY turn); the last turn still under 1000 wins.
SELECT person_name
FROM (
  SELECT person_name, turn, SUM(weight) OVER (ORDER BY turn) AS total_weight
  FROM Queue
) boarding
WHERE total_weight <= 1000
ORDER BY turn DESC
LIMIT 1;

-- 1907. Count Salary Categories  (expect: Low 1, Average 0, High 3)
SET search_path TO lc1907;
-- Categories with zero rows must still appear, so the categories come from a VALUES list.
SELECT c.category, COUNT(a.account_id) AS accounts_count
FROM (VALUES ('Low Salary'), ('Average Salary'), ('High Salary')) AS c(category)
LEFT JOIN Accounts a
       ON c.category = CASE
                         WHEN a.income < 20000 THEN 'Low Salary'
                         WHEN a.income <= 50000 THEN 'Average Salary'
                         ELSE 'High Salary'
                       END
GROUP BY c.category;
-- Shorter: one row, three FILTERed counts, unpivoted by UNION ALL.
SELECT 'Low Salary' AS category, COUNT(*) FILTER (WHERE income < 20000) AS accounts_count FROM Accounts
UNION ALL
SELECT 'Average Salary', COUNT(*) FILTER (WHERE income BETWEEN 20000 AND 50000) FROM Accounts
UNION ALL
SELECT 'High Salary', COUNT(*) FILTER (WHERE income > 50000) FROM Accounts;
