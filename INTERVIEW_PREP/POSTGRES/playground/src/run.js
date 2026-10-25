// Runs one .sql file from queries/ against a fresh seeded database and prints
// every statement next to its result.
//
// Usage:
//   npm run list                 -> list every query file
//   npm run q -- indexes         -> run the file whose name contains "indexes"
//   npm run q -- scratch         -> run queries/scratch.sql (your free-play file)
//   npm run q -- path/to/any.sql -> run any .sql file

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { createDatabase } from "./db.js";
import { splitStatements } from "./split.js";
import { printError, printResult, printStatement } from "./format.js";

const QUERIES_DIR = new URL("../queries/", import.meta.url).pathname;

function listQueryFiles(dir = QUERIES_DIR) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return listQueryFiles(full);
    return name.endsWith(".sql") ? [full] : [];
  });
}

function findQueryFile(arg) {
  if (existsSync(arg)) return arg;
  const matches = listQueryFiles().filter((f) => relative(QUERIES_DIR, f).includes(arg));
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    console.error(`"${arg}" matches several files — be more specific:`);
    for (const m of matches) console.error("  " + relative(QUERIES_DIR, m));
  } else {
    console.error(`No query file matches "${arg}". Try: npm run list`);
  }
  process.exit(1);
}

const arg = process.argv[2];

if (!arg || arg === "--list") {
  console.log("Query files (run with: npm run q -- <part of the name>)\n");
  for (const f of listQueryFiles().sort()) console.log("  " + relative(QUERIES_DIR, f));
  process.exit(0);
}

const file = findQueryFile(arg);
const db = await createDatabase();

// Keep going after an error: playground files often show a failing statement on purpose
// (a violated constraint, a bad join) and the lesson continues after it.
for (const statement of splitStatements(readFileSync(file, "utf8"))) {
  printStatement(statement);
  try {
    const results = await db.exec(statement);
    printResult(results[results.length - 1]);
  } catch (error) {
    printError(error);
  }
}

await db.close();
