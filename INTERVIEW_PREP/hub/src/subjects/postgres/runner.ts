// Runs a script against one problem's schema and compares it with the reference answer.
//
// Every run happens inside a transaction that is ROLLED BACK at the end, so a DELETE
// (196) or a DROP never leaks into the next run: the seed stays pristine forever.

import type { PGlite } from "@electric-sql/pglite";
import { splitStatements } from "./split.ts";

export type ResultSet = { columns: string[]; rows: unknown[][] };

export type StatementResult = {
  sql: string;
  result?: ResultSet;
  affectedRows?: number;
  error?: string;
  ms: number;
};

export type RunOutcome = {
  statements: StatementResult[];
  /** The result that gets graded: the last SELECT, or a table snapshot after pure DML. */
  graded?: ResultSet;
  gradedFrom: "select" | "snapshot" | "none";
  error?: string;
};

type Which = "first" | "last";

/**
 * pick = "last" for your own script (explore first, answer last);
 * pick = "first" for the reference, whose later SQL blocks are alternative solutions.
 */
export async function runScript(db: PGlite, schema: string, sql: string, pick: Which): Promise<RunOutcome> {
  const statements: StatementResult[] = [];
  let snapshot: ResultSet | undefined;

  await db.transaction(async (tx) => {
    await tx.exec(`SET LOCAL search_path TO ${schema}`);
    for (const statement of splitStatements(sql)) {
      const started = performance.now();
      try {
        const results = await tx.exec(statement, { rowMode: "array" });
        const last = results[results.length - 1];
        statements.push({
          sql: statement,
          result: last?.fields.length
            ? { columns: last.fields.map((f) => f.name), rows: last.rows as unknown[][] }
            : undefined,
          affectedRows: last?.affectedRows,
          ms: performance.now() - started,
        });
      } catch (error) {
        statements.push({ sql: statement, error: messageOf(error), ms: performance.now() - started });
        break; // the transaction is aborted now; nothing after this can run
      }
      if (pick === "first" && statements[statements.length - 1].result) break;
    }
    if (!statements.some((s) => s.error) && !statements.some((s) => s.result)) {
      snapshot = await snapshotSchema(tx, schema);
    }
    await tx.rollback();
  });

  const withRows = statements.filter((s) => s.result);
  const chosen = pick === "first" ? withRows[0] : withRows[withRows.length - 1];
  const error = statements.find((s) => s.error)?.error;
  if (chosen) return { statements, graded: chosen.result, gradedFrom: "select", error };
  if (snapshot) return { statements, graded: snapshot, gradedFrom: "snapshot", error };
  return { statements, gradedFrom: "none", error };
}

/** After a DELETE/UPDATE-only script, grade the table contents instead of a SELECT. */
async function snapshotSchema(tx: Pick<PGlite, "query">, schema: string): Promise<ResultSet> {
  const tables = await tx.query<{ table_name: string }>(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY table_name`,
    [schema],
  );
  const columns: string[] = [];
  const rows: unknown[][] = [];
  for (const { table_name } of tables.rows) {
    const res = await tx.query(`SELECT * FROM ${schema}."${table_name}" ORDER BY 1`, [], { rowMode: "array" });
    if (!columns.length) columns.push(...res.fields.map((f) => f.name));
    rows.push(...(res.rows as unknown[][]));
  }
  return { columns, rows };
}

export type TableInfo = { name: string; columns: { name: string; type: string }[]; data: ResultSet };

export async function describeSchema(db: PGlite, schema: string): Promise<TableInfo[]> {
  const cols = await db.query<{ table_name: string; column_name: string; data_type: string }>(
    `SELECT table_name, column_name, data_type
       FROM information_schema.columns
      WHERE table_schema = $1
      ORDER BY table_name, ordinal_position`,
    [schema],
  );
  const byTable = new Map<string, { name: string; type: string }[]>();
  for (const c of cols.rows) {
    if (!byTable.has(c.table_name)) byTable.set(c.table_name, []);
    byTable.get(c.table_name)!.push({ name: c.column_name, type: c.data_type });
  }
  const tables: TableInfo[] = [];
  for (const [name, columns] of byTable) {
    const res = await db.query(`SELECT * FROM ${schema}."${name}"`, [], { rowMode: "array" });
    tables.push({ name, columns, data: { columns: res.fields.map((f) => f.name), rows: res.rows as unknown[][] } });
  }
  return tables;
}

// ───────────────────────────── grading ─────────────────────────────

export type Verdict =
  | { kind: "exact" }
  | { kind: "unordered" } // same rows, different order
  | { kind: "wrong"; reason: string };

export function compareResults(mine: ResultSet, expected: ResultSet): Verdict {
  if (mine.columns.length !== expected.columns.length) {
    return {
      kind: "wrong",
      reason: `Expected ${expected.columns.length} column(s) (${expected.columns.join(", ")}), got ${mine.columns.length}.`,
    };
  }
  if (mine.rows.length !== expected.rows.length) {
    return { kind: "wrong", reason: `Expected ${expected.rows.length} row(s), got ${mine.rows.length}.` };
  }
  const a = mine.rows.map(rowKey);
  const b = expected.rows.map(rowKey);
  if (a.every((k, i) => k === b[i])) return { kind: "exact" };
  if ([...a].sort().join("\n") === [...b].sort().join("\n")) return { kind: "unordered" };

  const missing = b.filter((k) => !a.includes(k));
  return {
    kind: "wrong",
    reason: `${missing.length} expected row(s) are missing from your result, e.g. (${missing[0]?.split("\u0001").join(", ")}).`,
  };
}

function rowKey(row: unknown[]): string {
  return row.map(normalise).join("\u0001");
}

/** Numbers compare by value (2 = 2.00), dates by their calendar text. */
function normalise(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number" || typeof value === "bigint") return String(Number(Number(value).toFixed(6)));
  if (typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value)) return String(Number(Number(value).toFixed(6)));
  return formatValue(value);
}

export function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (value instanceof Date) {
    const iso = value.toISOString();
    return iso.endsWith("T00:00:00.000Z") ? iso.slice(0, 10) : iso.replace("T", " ").replace(/\.000Z$/, "");
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
