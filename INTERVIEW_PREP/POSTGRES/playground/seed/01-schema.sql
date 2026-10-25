-- The playground database: a tiny online shop.
-- Times print in UTC so every machine sees identical output.
SET TimeZone TO 'UTC';

-- Small, hand-written tables (customers, products, orders, order_items) so you can
-- eyeball every row, plus one big generated table (events) for indexes and EXPLAIN.

CREATE TABLE customers (
  id         serial PRIMARY KEY,
  name       text        NOT NULL,
  email      text        NOT NULL UNIQUE,
  city       text,                         -- nullable on purpose: NULL practice
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id       serial PRIMARY KEY,
  name     text           NOT NULL,
  category text           NOT NULL,
  price    numeric(10, 2) NOT NULL CHECK (price >= 0)
);

CREATE TABLE orders (
  id          serial PRIMARY KEY,
  customer_id int         NOT NULL REFERENCES customers (id),
  status      text        NOT NULL CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
  created_at  timestamptz NOT NULL
);

-- One row per product inside an order. The pair (order_id, product_id) is the key:
-- the same product appears at most once per order (quantity covers "two of them").
CREATE TABLE order_items (
  order_id   int            NOT NULL REFERENCES orders (id),
  product_id int            NOT NULL REFERENCES products (id),
  quantity   int            NOT NULL CHECK (quantity > 0),
  unit_price numeric(10, 2) NOT NULL,      -- price at purchase time, not today's price
  PRIMARY KEY (order_id, product_id)
);

-- Big table: an activity log. No indexes except the primary key, on purpose —
-- the index lessons add them and watch the query plan change.
CREATE TABLE events (
  id         bigserial PRIMARY KEY,
  user_id    int         NOT NULL,
  kind       text        NOT NULL,
  created_at timestamptz NOT NULL,
  payload    jsonb
);
