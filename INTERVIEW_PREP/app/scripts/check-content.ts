// Runs every revision page's final approach against its tests, and checks the page is complete.
// npm run check

import { readdirSync } from "node:fs";
import { loadEntry, runTests } from "../src/runner/judge.ts";
import { transpile } from "../src/runner/transpile.ts";
import { sheet } from "../src/content/dsa/sheet.ts";
import type { ProblemNote } from "../src/content/types.ts";

const dir = new URL("../src/content/dsa/notes/", import.meta.url);
const items = new Map(sheet.flatMap((s) => s.items).map((i) => [i.slug, i]));
const quiet = () => () => {};
let failed = 0;

for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts")).sort()) {
  const note: ProblemNote = (await import(new URL(file, dir).href)).default;
  const problems: string[] = [];
  const item = items.get(note.slug);
  if (!item) problems.push(`slug "${note.slug}" is not in the sheet`);
  if (!note.tests?.length && !item?.judge.tests?.length) problems.push("no tests");
  if (note.hints.length !== 3) problems.push("needs exactly 3 hints");
  if (!note.approaches.length) problems.push("no approaches");
  if (item) {
    const tests = note.tests ?? item.judge.tests ?? [];
    for (const [k, a] of note.approaches.entries()) {
      try {
        const results = runTests(loadEntry(transpile(a.code), item.judge.entry), item.judge, tests, quiet);
        for (const r of results.filter((r) => !r.pass)) {
          const msg = `approach ${k + 1} (${a.name}) fails ${r.label}: ${r.input} → ${r.error ?? r.got}, expected ${r.expected}`;
          // Only the final approach has to be right; earlier ones may be deliberately weaker.
          if (k === note.approaches.length - 1) problems.push(msg);
          else console.log(`  note  ${note.slug}: ${msg}`);
        }
      } catch (e) {
        problems.push(`approach ${k + 1} doesn't load: ${(e as Error).message}`);
      }
    }
  }
  if (problems.length) {
    failed++;
    console.log(`✗ ${note.slug}\n${problems.map((p) => `    ${p}`).join("\n")}`);
  } else {
    console.log(`✓ ${note.slug}`);
  }
}
process.exit(failed ? 1 : 0);
