INSERT INTO customers (name, email, city, created_at) VALUES
  ('Asha Rao',      'asha@example.com',   'Bengaluru', '2026-01-04 10:00+05:30'),
  ('Rahul Mehta',   'rahul@example.com',  'Mumbai',    '2026-01-10 12:30+05:30'),
  ('Priya Nair',    'priya@example.com',  'Kochi',     '2026-02-02 09:15+05:30'),
  ('Vikram Singh',  'vikram@example.com', 'Delhi',     '2026-02-20 18:45+05:30'),
  ('Meera Iyer',    'meera@example.com',  'Bengaluru', '2026-03-05 08:00+05:30'),
  ('Kabir Khan',    'kabir@example.com',  NULL,        '2026-03-18 21:10+05:30'),
  ('Sara Thomas',   'sara@example.com',   'Pune',      '2026-04-01 11:11+05:30'),
  ('Dev Patel',     'dev@example.com',    'Mumbai',    '2026-04-22 16:40+05:30');
-- Dev Patel (id 8) never places an order: useful for LEFT JOIN / NOT EXISTS practice.

INSERT INTO products (name, category, price) VALUES
  ('Mechanical Keyboard', 'electronics', 6499.00),
  ('Wireless Mouse',      'electronics', 1299.00),
  ('USB-C Hub',           'electronics', 2499.00),
  ('27" Monitor',         'electronics', 18999.00),
  ('Desk Lamp',           'home',        1599.00),
  ('Standing Desk',       'home',        24999.00),
  ('Notebook (A5)',       'stationery',  199.00),
  ('Gel Pens (pack)',     'stationery',  149.00),
  ('Coffee Beans 1kg',    'grocery',     1150.00),
  ('Green Tea (100)',     'grocery',     450.00);
-- Green Tea (id 10) is never ordered.

INSERT INTO orders (customer_id, status, created_at) VALUES
  (1, 'shipped',   '2026-02-01 10:00+05:30'),
  (1, 'paid',      '2026-05-12 14:20+05:30'),
  (2, 'shipped',   '2026-02-14 19:05+05:30'),
  (2, 'cancelled', '2026-03-01 09:30+05:30'),
  (3, 'shipped',   '2026-03-10 13:00+05:30'),
  (3, 'pending',   '2026-06-02 22:15+05:30'),
  (4, 'paid',      '2026-03-22 11:45+05:30'),
  (5, 'shipped',   '2026-04-05 17:00+05:30'),
  (5, 'shipped',   '2026-05-20 08:30+05:30'),
  (5, 'paid',      '2026-06-15 12:00+05:30'),
  (6, 'pending',   '2026-04-30 20:20+05:30'),
  (7, 'shipped',   '2026-05-02 15:35+05:30');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 1, 6499.00), (1, 2, 1, 1299.00),
  (2, 9, 2, 1150.00),
  (3, 4, 1, 18999.00), (3, 3, 1, 2499.00),
  (4, 6, 1, 24999.00),
  (5, 7, 5, 199.00), (5, 8, 3, 149.00),
  (6, 5, 1, 1599.00),
  (7, 1, 1, 6299.00),                        -- bought on a discount: unit_price < today's price
  (8, 6, 1, 24999.00), (8, 5, 1, 1599.00),
  (9, 9, 3, 1150.00),
  (10, 2, 2, 1299.00), (10, 7, 2, 199.00),
  (11, 3, 1, 2499.00),
  (12, 4, 1, 18999.00), (12, 9, 1, 1150.00);
