-- LeetCode SQL 50 · Section 2: Basic Joins. SPOILERS: these are the solutions.
-- Notes: ../../../LEETCODE_SQL_50/02-basic-joins.md

-- 1378. Replace Employee ID With The Unique Identifier  (Alice, Bob get NULL)
SET search_path TO lc1378;
SELECT u.unique_id, e.name
FROM Employees e
LEFT JOIN EmployeeUNI u ON u.id = e.id;

-- 1068. Product Sales Analysis I
SET search_path TO lc1068;
SELECT p.product_name, s.year, s.price
FROM Sales s
JOIN Product p ON p.product_id = s.product_id;

-- 1581. Customer Who Visited but Did Not Make Any Transactions  (expect: 54→2, 30→1, 96→1)
SET search_path TO lc1581;
-- Anti-join: keep visits whose LEFT JOIN found no partner row.
SELECT v.customer_id, COUNT(*) AS count_no_trans
FROM Visits v
LEFT JOIN Transactions t ON t.visit_id = v.visit_id
WHERE t.transaction_id IS NULL
GROUP BY v.customer_id;
-- Same idea, said more directly with NOT EXISTS.
SELECT v.customer_id, COUNT(*) AS count_no_trans
FROM Visits v
WHERE NOT EXISTS (SELECT 1 FROM Transactions t WHERE t.visit_id = v.visit_id)
GROUP BY v.customer_id;

-- 197. Rising Temperature  (expect: 2, 4 — NOT 5, because 01-05 is missing)
SET search_path TO lc197;
-- Self-join on "yesterday". date - integer = date in Postgres.
SELECT today.id
FROM Weather today
JOIN Weather yesterday ON yesterday.recordDate = today.recordDate - 1
WHERE today.temperature > yesterday.temperature;
-- The LAG trap: "previous row" is not "previous day" when dates have gaps. This returns 5 too.
SELECT id FROM (
  SELECT id, recordDate, temperature,
         LAG(temperature) OVER (ORDER BY recordDate) AS prev_temp
  FROM Weather
) w
WHERE temperature > prev_temp;

-- 1661. Average Time of Process per Machine  (expect: 0.894, 0.995, 1.456)
SET search_path TO lc1661;
-- Conditional aggregation: turn each start/end pair into end - start without a self-join.
SELECT machine_id,
       ROUND(AVG(end_time - start_time)::numeric, 3) AS processing_time
FROM (
  SELECT machine_id, process_id,
         MAX(timestamp) FILTER (WHERE activity_type = 'start') AS start_time,
         MAX(timestamp) FILTER (WHERE activity_type = 'end')   AS end_time
  FROM Activity
  GROUP BY machine_id, process_id
) per_process
GROUP BY machine_id
ORDER BY machine_id;

-- 577. Employee Bonus  (expect: Brad NULL, John NULL, Dan 500)
SET search_path TO lc577;
SELECT e.name, b.bonus
FROM Employee e
LEFT JOIN Bonus b ON b.empId = e.empId
WHERE b.bonus < 1000 OR b.bonus IS NULL;

-- 1280. Students and Examinations
SET search_path TO lc1280;
-- CROSS JOIN builds every (student, subject) pair, so zero counts can exist at all.
SELECT s.student_id, s.student_name, sub.subject_name,
       COUNT(e.student_id) AS attended_exams
FROM Students s
CROSS JOIN Subjects sub
LEFT JOIN Examinations e
       ON e.student_id = s.student_id AND e.subject_name = sub.subject_name
GROUP BY s.student_id, s.student_name, sub.subject_name
ORDER BY s.student_id, sub.subject_name;

-- 570. Managers with at Least 5 Direct Reports  (expect: John)
SET search_path TO lc570;
SELECT m.name
FROM Employee m
JOIN Employee e ON e.managerId = m.id
GROUP BY m.id, m.name
HAVING COUNT(*) >= 5;

-- 1934. Confirmation Rate  (expect: 6→0.00, 3→0.00, 7→1.00, 2→0.50)
SET search_path TO lc1934;
-- AVG over a 1/0 flag is a rate. LEFT JOIN keeps user 6, who never asked for a confirmation.
SELECT s.user_id,
       ROUND(AVG(CASE WHEN c.action = 'confirmed' THEN 1 ELSE 0 END), 2) AS confirmation_rate
FROM Signups s
LEFT JOIN Confirmations c ON c.user_id = s.user_id
GROUP BY s.user_id;
