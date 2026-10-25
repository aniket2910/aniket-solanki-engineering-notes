-- LeetCode SQL 50 · Section 3: Basic Aggregate Functions. SPOILERS: these are the solutions.
-- Notes: ../../../LEETCODE_SQL_50/03-basic-aggregates.md

-- 620. Not Boring Movies  (expect: 5, 1)
SET search_path TO lc620;
SELECT *
FROM Cinema
WHERE id % 2 = 1 AND description <> 'boring'
ORDER BY rating DESC;

-- 1251. Average Selling Price  (expect: 1→6.96, 2→16.96, 3→0)
SET search_path TO lc1251;
-- Range join (purchase_date BETWEEN start AND end), weighted average, COALESCE for unsold products.
SELECT p.product_id,
       COALESCE(ROUND(SUM(p.price * u.units)::numeric / SUM(u.units), 2), 0) AS average_price
FROM Prices p
LEFT JOIN UnitsSold u
       ON u.product_id = p.product_id
      AND u.purchase_date BETWEEN p.start_date AND p.end_date
GROUP BY p.product_id
ORDER BY p.product_id;

-- 1075. Project Employees I  (expect: 1→2.00, 2→2.50)
SET search_path TO lc1075;
SELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years
FROM Project p
JOIN Employee e ON e.employee_id = p.employee_id
GROUP BY p.project_id;

-- 1633. Percentage of Users Attended a Contest
SET search_path TO lc1633;
-- The denominator is ALL users, so it comes from a scalar subquery, not from the group.
SELECT contest_id,
       ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage
FROM Register
GROUP BY contest_id
ORDER BY percentage DESC, contest_id;

-- 1211. Queries Quality and Percentage  (expect: Dog 2.50 33.33, Cat 0.66 33.33)
SET search_path TO lc1211;
SELECT query_name,
       ROUND(AVG(rating::numeric / position), 2)                       AS quality,
       ROUND(AVG(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100, 2)     AS poor_query_percentage
FROM Queries
GROUP BY query_name;

-- 1193. Monthly Transactions I
SET search_path TO lc1193;
SELECT to_char(trans_date, 'YYYY-MM')                              AS month,
       country,
       COUNT(*)                                                    AS trans_count,
       COUNT(*) FILTER (WHERE state = 'approved')                  AS approved_count,
       SUM(amount)                                                 AS trans_total_amount,
       COALESCE(SUM(amount) FILTER (WHERE state = 'approved'), 0)  AS approved_total_amount
FROM Transactions
GROUP BY month, country;

-- 1174. Immediate Food Delivery II  (expect: 50.00)
SET search_path TO lc1174;
-- Step 1: each customer's first order (DISTINCT ON). Step 2: % of those that were immediate.
WITH first_orders AS (
  SELECT DISTINCT ON (customer_id) customer_id, order_date, customer_pref_delivery_date
  FROM Delivery
  ORDER BY customer_id, order_date
)
SELECT ROUND(AVG(CASE WHEN order_date = customer_pref_delivery_date THEN 1 ELSE 0 END) * 100, 2)
       AS immediate_percentage
FROM first_orders;

-- 550. Game Play Analysis IV  (expect: 0.33)
SET search_path TO lc550;
WITH first_login AS (
  SELECT player_id, MIN(event_date) AS first_day
  FROM Activity
  GROUP BY player_id
)
SELECT ROUND(
         COUNT(a.player_id)::numeric / (SELECT COUNT(*) FROM first_login), 2
       ) AS fraction
FROM first_login f
JOIN Activity a ON a.player_id = f.player_id AND a.event_date = f.first_day + 1;
