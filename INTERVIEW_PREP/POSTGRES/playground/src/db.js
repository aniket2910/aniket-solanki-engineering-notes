// Creates a fresh, seeded Postgres database in memory.
//
// Every run starts from the same seed, so you can break things freely (DROP, DELETE,
// UPDATE without WHERE...) and the next run is clean again. That reproducibility is
// the point of a playground.

import { PGlite } from "@electric-sql/pglite";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SEED_DIR = new URL("../seed/", import.meta.url).pathname;

export async function createDatabase() {
  const db = new PGlite();

  // Seed files run in name order: 01-schema, 02-shop-data, 03-events ...
  const seedFiles = readdirSync(SEED_DIR).filter((f) => f.endsWith(".sql")).sort();
  for (const file of seedFiles) {
    await db.exec(readFileSync(join(SEED_DIR, file), "utf8"));
  }
  return db;
}
