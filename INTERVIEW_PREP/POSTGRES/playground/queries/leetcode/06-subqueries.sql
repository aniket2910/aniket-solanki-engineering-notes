-- LeetCode SQL 50 · Section 6: Subqueries. SPOILERS: these are the solutions.
-- Notes: ../../../LEETCODE_SQL_50/06-subqueries.md

-- 1978. Employees Whose Manager Left the Company  (expect: 11)
SET search_path TO lc1978;
SELECT employee_id
FROM Employees e
WHERE salary < 30000
  AND manager_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM Employees m WHERE m.employee_id = e.manager_id)
ORDER BY employee_id;

-- 626. Exchange Seats
SET search_path TO lc626;
-- Change the id, not the name: odd ids move up, even ids move down, a lone last odd stays.
SELECT CASE
         WHEN id % 2 = 1 AND id = (SELECT MAX(id) FROM Seat) THEN id
         WHEN id % 2 = 1 THEN id + 1
         ELSE id - 1
       END AS id,
       student
FROM Seat
ORDER BY id;

-- 1341. Movie Rating  (expect: Daniel, Frozen 2)
SET search_path TO lc1341;
-- Two independent questions glued with UNION ALL. Each half needs parentheses for its ORDER BY/LIMIT.
(SELECT u.name AS results
 FROM MovieRating r JOIN Users u ON u.user_id = r.user_id
 GROUP BY u.user_id, u.name
 ORDER BY COUNT(*) DESC, u.name
 LIMIT 1)
UNION ALL
(SELECT m.title
 FROM MovieRating r JOIN Movies m ON m.movie_id = r.movie_id
 WHERE r.created_at >= DATE '2020-02-01' AND r.created_at < DATE '2020-03-01'
 GROUP BY m.movie_id, m.title
 ORDER BY AVG(r.rating) DESC, m.title
 LIMIT 1);

-- 1321. Restaurant Growth  (expect from 2019-01-07: 860/122.86, 840/120, 840/120, 1000/142.86)
SET search_path TO lc1321;
-- Collapse to one row per day FIRST, then a 7-row moving window, then drop the first 6 days.
WITH daily AS (
  SELECT visited_on, SUM(amount) AS amount
  FROM Customer
  GROUP BY visited_on
),
windowed AS (
  SELECT visited_on,
         SUM(amount) OVER w AS amount,
         ROUND(AVG(amount) OVER w, 2) AS average_amount,
         ROW_NUMBER() OVER (ORDER BY visited_on) AS day_number
  FROM daily
  WINDOW w AS (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)
)
SELECT visited_on, amount, average_amount
FROM windowed
WHERE day_number >= 7
ORDER BY visited_on;

-- 602. Friend Requests II: Who Has the Most Friends  (expect: 3, 3)
SET search_path TO lc602;
-- A friendship has two ends. UNION ALL both columns into one list, then count.
SELECT id, COUNT(*) AS num
FROM (
  SELECT requester_id AS id FROM RequestAccepted
  UNION ALL
  SELECT accepter_id FROM RequestAccepted
) ends
GROUP BY id
ORDER BY num DESC
LIMIT 1;

-- 585. Investments in 2016  (expect: 45.00)
SET search_path TO lc585;
-- Window COUNTs answer "how many OTHER rows share this value?" without self-joins.
SELECT ROUND(SUM(tiv_2016)::numeric, 2) AS tiv_2016
FROM (
  SELECT tiv_2016,
         COUNT(*) OVER (PARTITION BY tiv_2015)  AS same_2015,
         COUNT(*) OVER (PARTITION BY lat, lon)  AS same_place
  FROM Insurance
) i
WHERE same_2015 > 1 AND same_place = 1;

-- 185. Department Top Three Salaries
SET search_path TO lc185;
-- "Top three unique salaries" = DENSE_RANK (ties share a rank and leave no gaps).
SELECT d.name AS Department, r.name AS Employee, r.salary AS Salary
FROM (
  SELECT name, salary, departmentId,
         DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) AS rnk
  FROM Employee
) r
JOIN Department d ON d.id = r.departmentId
WHERE r.rnk <= 3;
