-- Your free-play file. Write anything here and run:  npm run q -- scratch
-- The database is re-seeded on every run, so nothing you do here can break the next run.

SELECT name, city FROM customers ORDER BY name;

SELECT count(*) AS events FROM events;
