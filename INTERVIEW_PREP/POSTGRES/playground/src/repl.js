// An interactive SQL prompt on a fresh seeded database — a tiny psql.
//
// Type SQL ending with ";" (multi-line is fine). Meta-commands:
//   \dt        list tables          \d <table>  describe a table
//   \q         quit
// Nothing persists: quit and restart for a clean database.

import { createInterface } from "node:readline";
import { createDatabase } from "./db.js";
import { printError, printResult } from "./format.js";

const META = {
  "\\dt": () => `
    SELECT table_name AS "table"
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;`,
  "\\d": (table) => `
    SELECT column_name AS "column", data_type AS "type", is_nullable AS "nullable", column_default AS "default"
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = '${table.replace(/'/g, "''")}'
    ORDER BY ordinal_position;`,
};

console.log("Seeding database...");
const db = await createDatabase();
console.log("Ready. Tables: customers, products, orders, order_items, events.  \\dt to list, \\q to quit.\n");

const rl = createInterface({ input: process.stdin, output: process.stdout, prompt: "pg=> " });
let buffer = "";

async function run(sql) {
  try {
    const results = await db.exec(sql);
    for (const result of results) printResult(result);
  } catch (error) {
    printError(error);
  }
}

// Async iteration reads lines one at a time and waits for each query to finish,
// so it works both when you type and when SQL is piped in (npm run repl < file.sql).
rl.prompt();
for await (const line of rl) {
  const trimmed = line.trim();

  if (!buffer && trimmed.startsWith("\\")) {
    const [command, arg = ""] = trimmed.split(/\s+/);
    if (command === "\\q") break;
    if (META[command]) await run(META[command](arg));
    else console.log(`Unknown command ${command}. Try \\dt, \\d <table>, \\q`);
  } else {
    buffer += line + "\n";
    if (trimmed.endsWith(";")) {
      await run(buffer);
      buffer = "";
    }
  }

  rl.setPrompt(buffer ? "pg-# " : "pg=> ");
  rl.prompt();
}

rl.close();
await db.close();
