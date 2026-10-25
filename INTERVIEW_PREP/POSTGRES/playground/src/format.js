// Prints query results as a psql-style text table.

const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

function toCell(value) {
  if (value === null || value === undefined) return "NULL";
  if (value instanceof Date) return value.toISOString().replace("T", " ").replace(".000Z", "Z");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function printResult(result) {
  const columns = result.fields.map((f) => f.name);

  // Statements like CREATE INDEX return no columns — just confirm they ran.
  if (columns.length === 0) {
    const affected = result.affectedRows ? ` (${result.affectedRows} rows affected)` : "";
    console.log(`${DIM}OK${affected}${RESET}\n`);
    return;
  }

  // EXPLAIN returns one text column; print it raw so the plan tree stays readable.
  if (columns.length === 1 && columns[0] === "QUERY PLAN") {
    for (const row of result.rows) console.log(row["QUERY PLAN"]);
    console.log();
    return;
  }

  const cells = result.rows.map((row) => columns.map((c) => toCell(row[c])));
  const widths = columns.map((c, i) => Math.max(c.length, ...cells.map((r) => r[i].length)));
  const line = (values) => " " + values.map((v, i) => v.padEnd(widths[i])).join(" | ");

  console.log(BOLD + line(columns) + RESET);
  console.log("-" + widths.map((w) => "-".repeat(w)).join("-+-") + "-");
  for (const row of cells) console.log(line(row));
  console.log(`${DIM}(${result.rows.length} row${result.rows.length === 1 ? "" : "s"})${RESET}\n`);
}

export function printStatement(statement) {
  console.log(`${DIM}${statement}${RESET}`);
}

export function printError(error) {
  console.log(`${RED}ERROR: ${error.message}${RESET}\n`);
}
