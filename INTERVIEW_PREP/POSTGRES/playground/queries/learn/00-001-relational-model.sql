-- Lesson: POSTGRES/00_FOUNDATIONS/001-the-relational-model.md
-- Run:  npm run q -- relational-model
--
-- Codd's relational algebra, operator by operator, written as SQL.
-- Every operator takes relations (tables) in and gives a relation out — that is
-- why they compose.

-- SELECTION (σ): keep the rows that satisfy a condition. In SQL that is WHERE.
SELECT * FROM products WHERE category = 'electronics';

-- PROJECTION (π): keep only some columns. In SQL that is the SELECT list.
-- Pure relational projection also removes duplicate rows; SQL keeps them unless
-- you say DISTINCT. Compare the two:
SELECT category FROM products;
SELECT DISTINCT category FROM products;

-- Composition: selection THEN projection. Output of one is the input of the next.
SELECT name, price FROM products WHERE category = 'electronics' AND price < 5000;

-- CARTESIAN PRODUCT (×): every row of A paired with every row of B.
-- 8 customers × 12 orders = 96 rows, most of them meaningless pairs.
SELECT count(*) AS pairs FROM customers CROSS JOIN orders;

-- JOIN (⋈) = product followed by selection on matching keys. These two return
-- the same rows; the second is just the shorthand.
SELECT c.name, o.id AS order_id, o.status
FROM customers c CROSS JOIN orders o
WHERE o.customer_id = c.id
ORDER BY o.id;

SELECT c.name, o.id AS order_id, o.status
FROM customers c JOIN orders o ON o.customer_id = c.id
ORDER BY o.id;

-- UNION (∪) and DIFFERENCE (−): relations are sets, so set operations apply.
-- Customers in Mumbai ∪ customers in Pune:
SELECT name FROM customers WHERE city = 'Mumbai'
UNION
SELECT name FROM customers WHERE city = 'Pune';

-- Customers who have never ordered = all customers − customers with an order.
SELECT id, name FROM customers
EXCEPT
SELECT c.id, c.name FROM customers c JOIN orders o ON o.customer_id = c.id;

-- KEYS: a relation is a SET of tuples, so no two rows may be identical. A primary
-- key makes Postgres enforce that. This insert reuses order 1 + product 1 -> rejected.
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (1, 1, 1, 6499.00);

-- Referential integrity: an order must point at a real customer. Rejected.
INSERT INTO orders (customer_id, status, created_at) VALUES (999, 'paid', now());

-- NULL means "unknown", which gives SQL three-valued logic (true / false / unknown).
-- Kabir's city is NULL, so he is in NEITHER of these results:
SELECT name FROM customers WHERE city = 'Mumbai';
SELECT name FROM customers WHERE city <> 'Mumbai';
-- ...you have to ask about unknowns explicitly:
SELECT name FROM customers WHERE city IS NULL;

-- DATA INDEPENDENCE: how data is stored can change without touching the query.
-- Add an index (a new access path); the query text below is identical to before.
CREATE INDEX idx_customers_city ON customers (city);
SELECT name FROM customers WHERE city = 'Bengaluru';
