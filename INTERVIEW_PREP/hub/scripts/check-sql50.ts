// Sanity check for the SQL 50 reader: parses every section file the way the browser does,
// runs each reference solution against the real seed, and checks that every alternative
// solution block agrees with the first one.  npm run check:sql50

import { readFileSync, readdirSync } from "node:fs";
import { parseSection } from "../src/subjects/postgres/sql50/parse.ts";
import { compareResults, runScript } from "../src/subjects/postgres/runner.ts";
import { createSeededDb } from "../src/subjects/postgres/pglite.ts";

const notesDir = new URL("../../POSTGRES/LEETCODE_SQL_50/", import.meta.url);
const seed = new URL("../../POSTGRES/playground/seed/04-leetcode-sql50.sql", import.meta.url);

const db = await createSeededDb(readFileSync(seed, "utf8"));

let problems = 0;
let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.log("  ✗ " + msg);
};

for (const file of readdirSync(notesDir).filter((f) => /^\d\d-.*\.md$/.test(f)).sort()) {
  const section = parseSection(file, readFileSync(new URL(file, notesDir), "utf8"));
  console.log(`${section.num} ${section.title}: ${section.problems.length} problems`);
  if (!section.concepts) fail(`${file}: no concepts block`);

  for (const p of section.problems) {
    problems++;
    const tag = `${p.id} ${p.title}`;
    if (!p.statement || !p.example || !p.testing || !p.relate) fail(`${tag}: a reading block is empty`);
    if (p.hints.length !== 3) fail(`${tag}: ${p.hints.length} hints`);
    if (!p.solutionSql.length) fail(`${tag}: no solution SQL`);

    const ref = await runScript(db, p.schema, p.solutionSql[0], "first");
    if (ref.error || !ref.graded) {
      fail(`${tag}: reference failed: ${ref.error ?? "no result"}`);
      continue;
    }
    // Each further SQL block is an alternative answer: grade it like a user script.
    for (const [i, alt] of p.solutionSql.slice(1).entries()) {
      const out = await runScript(db, p.schema, alt, "last");
      if (!out.graded || out.gradedFrom === "none") continue;
      const v = compareResults(out.graded, ref.graded);
      if (v.kind === "wrong") fail(`${tag}: alternative #${i + 2} disagrees: ${v.reason}`);
    }
  }
}

console.log(`\n${problems} problems parsed, ${failures} problem(s) found.`);
process.exit(failures ? 1 : 0);
