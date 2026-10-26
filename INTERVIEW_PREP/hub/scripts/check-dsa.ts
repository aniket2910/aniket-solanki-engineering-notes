// Sanity check for the DSA tab: every Namaste sheet entry must point at a note that
// parses, has runnable tests, and whose own solution passes them.  npm run check:dsa
//   npm run check:dsa -- 13_GREEDY     only notes whose path contains this text

import { existsSync, readFileSync } from "node:fs";
import { sheetItems } from "../src/subjects/dsa/sheet.ts";
import { parseNote, solutionSource, starterFrom } from "../src/subjects/dsa/parseNote.ts";
import { loadEntry, runTests } from "../src/subjects/dsa/judge.ts";
import { transpile } from "../src/subjects/dsa/transpile.ts";

const dsaDir = new URL("../../../DSA/", import.meta.url);
const filter = process.argv[2] ?? "";
const seen = new Set<string>();
let checked = 0;
let problems = 0;

const quiet = () => () => {};

for (const item of sheetItems) {
  if (seen.has(item.slug) || !item.note.includes(filter)) continue;
  seen.add(item.slug);
  checked++;
  const fail = (msg: string) => {
    problems++;
    console.log(`✗ ${item.title} (${item.note}): ${msg}`);
  };

  const path = new URL(item.note, dsaDir);
  if (!existsSync(path)) {
    fail("note file is missing");
    continue;
  }
  const note = parseNote(readFileSync(path, "utf8"));
  for (const key of ["statement", "testsMd", "asking", "approach", "codeMd", "complexity"] as const) {
    if (!note[key]) fail(`empty section: ${key}`);
  }
  const tests = item.judge.tests ?? note.tests;
  if (!tests.length) {
    fail(`no runnable tests (${note.unparsedTests} unparsed in the note)`);
    continue;
  }
  if (!item.judge.tests && note.unparsedTests) fail(`${note.unparsedTests} test case(s) in the note couldn't be parsed`);

  const source = solutionSource(note, item.judge.entry);
  try {
    const entry = loadEntry(transpile(source), item.judge.entry);
    const results = runTests(entry, item.judge, tests, quiet);
    for (const r of results.filter((r) => !r.pass)) {
      fail(`${r.label}: input ${r.input} → expected ${r.expected}, got ${r.error ?? r.got}`);
    }
  } catch (error) {
    fail(`solution doesn't load: ${(error as Error).message}`);
  }

  const starter = starterFrom(source, item.judge.entry);
  if (!starter.includes(item.judge.entry)) fail("starter code lost the entry signature");
  try {
    transpile(starter);
  } catch (error) {
    fail(`starter code doesn't parse: ${(error as Error).message.split("\n")[0]}`);
  }
}

console.log(`\n${checked} problems checked, ${problems} issue(s).`);
process.exit(problems ? 1 : 0);
