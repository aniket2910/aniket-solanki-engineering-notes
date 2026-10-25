// The browser's single Postgres instance. Booting PGlite + loading the seed takes about
// a second, so it starts once, on first use, and every page shares the same promise.

import type { PGlite } from "@electric-sql/pglite";
import { useEffect, useState } from "react";
import seedSql from "../../../../POSTGRES/playground/seed/04-leetcode-sql50.sql?raw";
import { createSeededDb } from "./pglite.ts";

let dbPromise: Promise<PGlite> | null = null;

export function getDb(): Promise<PGlite> {
  dbPromise ??= createSeededDb(seedSql);
  return dbPromise;
}

export function useDb(): { db: PGlite | null; error: string | null } {
  const [db, setDb] = useState<PGlite | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    getDb().then(
      (d) => alive && setDb(d),
      (e) => alive && setError(String(e)),
    );
    return () => {
      alive = false;
    };
  }, []);
  return { db, error };
}
