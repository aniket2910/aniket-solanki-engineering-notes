// One in-memory Postgres for the whole SQL 50 set: every problem lives in its own
// schema (lc1757, lc584 …) inside the same seed, so one database serves all 50.

import { PGlite, types } from "@electric-sql/pglite";

// Keep dates and timestamps as the text Postgres prints. Turned into JS Dates they get
// shifted by the browser's timezone (a 10:20 timestamp would show as 04:50 in IST).
const asText = (value: string) => value;

export async function createSeededDb(seedSql: string): Promise<PGlite> {
  const db = new PGlite({
    parsers: {
      [types.DATE]: asText,
      [types.TIMESTAMP]: asText,
      [types.TIMESTAMPTZ]: asText,
      [types.TIME]: asText,
    },
  });
  await db.exec(seedSql);
  return db;
}
