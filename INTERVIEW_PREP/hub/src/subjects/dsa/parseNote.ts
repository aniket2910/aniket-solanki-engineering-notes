// Parses one DSA/ note into the blocks the reader shows, plus runnable tests and code.
//
// Every note in DSA/ has the same `###` sections (the numbers and emoji vary):
//   📝 Problem Statement · 🧪 Test Cases · 💬 What is This Problem Actually Asking?
//   🌍 Real-Life Example · 🛠️ Data Structure & Algorithms Used · 🔄 Dry Run
//   💻 Optimal Code (TypeScript) · 📊 Complexity & Edge Cases

import type { Test } from "./judge.ts";

export type DsaNote = {
  title: string;
  /** The "> [!IMPORTANT]" header: company targets and the MUST SOLVE tag. */
  meta: string;
  mustSolve: boolean;
  statement: string;
  testsMd: string;
  asking: string;
  analogy: string;
  approach: string;
  dryRun: string;
  codeMd: string;
  complexity: string;
  /** Every ```typescript block in the code section, in order. */
  codeBlocks: string[];
  tests: Test[];
  /** Test cases whose input/output could not be read as literals. */
  unparsedTests: number;
};

const SECTION_KEYS: [keyof DsaNote, RegExp][] = [
  ["statement", /Problem (Statement|Definition)/i],
  ["testsMd", /Test Cases/i],
  ["asking", /Actually Asking/i],
  ["analogy", /Real-Life/i],
  ["approach", /Data Structure|Algorithms? Used/i],
  ["dryRun", /Dry Run/i],
  ["complexity", /Complexity/i],
  ["codeMd", /Code|Implementation|Approach/i],
];

export function parseNote(md: string): DsaNote {
  const note: DsaNote = {
    title: md.match(/^# (?:\d+\w?\.\s*)?(.+?)(?:\s*\((Easy|Medium|Hard)\))?\s*$/m)?.[1]?.trim() ?? "",
    meta: "",
    mustSolve: /MUST SOLVE/i.test(md.slice(0, 800)),
    statement: "",
    testsMd: "",
    asking: "",
    analogy: "",
    approach: "",
    dryRun: "",
    codeMd: "",
    complexity: "",
    codeBlocks: [],
    tests: [],
    unparsedTests: 0,
  };

  const chunks = md.split(/^### /m);
  // The header block: older notes wrap it in a "> [!IMPORTANT]" callout, newer ones
  // write plain bold-label lines. Both read the same here.
  note.meta = chunks[0]
    .replace(/^# .*$/m, "")
    .split("\n")
    .filter((l) => !/\[!\w+\]/.test(l) && !/^\s*---\s*$/.test(l))
    .map((l) => l.replace(/^>\s?/, ""))
    .join("\n")
    .trim();

  for (const chunk of chunks.slice(1)) {
    const newline = chunk.indexOf("\n");
    const heading = chunk.slice(0, newline);
    const body = chunk.slice(newline + 1).replace(/^\s*---\s*$/gm, "").trim();
    const key = SECTION_KEYS.find(([, re]) => re.test(heading))?.[0];
    if (!key) continue;
    // A note can split its code over several "💻" sections; keep them all.
    (note[key] as string) = note[key] ? `${note[key]}\n\n${body}` : body;
  }

  note.codeBlocks = [...note.codeMd.matchAll(/```(?:typescript|ts)\n([\s\S]*?)```/g)].map((m) => m[1]);
  const { tests, unparsed } = parseTests(note.testsMd);
  note.tests = tests;
  note.unparsedTests = unparsed;
  return note;
}

/**
 * Reads "* **Input**: `nums = [1,2]`, `k = 2`" / "* **Output**: `[2]`" pairs.
 * A case written as prose or as a code block is counted as unparsed instead.
 */
function parseTests(md: string): { tests: Test[]; unparsed: number } {
  const tests: Test[] = [];
  let unparsed = 0;
  for (const block of md.split(/^#### /m).slice(1)) {
    const label = block.slice(0, block.indexOf("\n")).replace(/\*/g, "").trim();
    const input = block.match(/\*\*Input\*\*:?([\s\S]*?)\*\*Output\*\*/)?.[1] ?? "";
    const output = block.match(/\*\*Output\*\*:?([\s\S]*?)(?:\*\*Why|\*\*Explanation|$)/)?.[1] ?? "";
    // A code walkthrough (design problems) can't be read as data; a ```text block of
    // "name = value" lines can.
    if (/```(typescript|ts|js)/.test(input + output)) {
      unparsed++;
      continue;
    }
    const inSegments = input.includes("```") ? assignments(input) : ticks(input);
    try {
      const args = inSegments.map((s) => parseLiteral(s.replace(/^\s*[A-Za-z_]\w*\s*=\s*/, "")));
      // "`nums1` becomes `[1, 2]`": the answer is the first segment that is a literal.
      const expected = firstLiteral(ticks(output));
      tests.push({ args, expected, label: label || undefined });
    } catch {
      unparsed++;
    }
  }
  return { tests, unparsed };
}

const ticks = (s: string) => [...s.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim());

/** "matrix = [\n [1, 5],\n [10, 11]\n]\nk = 8" inside a ```text block → ["[[1,5],[10,11]]", "8"]. */
function assignments(s: string): string[] {
  const body = s.match(/```\w*\n([\s\S]*?)```/)?.[1] ?? "";
  return body
    .split(/^\s*(?=[A-Za-z_]\w*\s*=)/m)
    .map((part) => part.replace(/^\s*[A-Za-z_]\w*\s*=\s*/, "").replace(/\s+/g, " ").trim().replace(/,$/, ""))
    .filter(Boolean);
}

function firstLiteral(segments: string[]): unknown {
  for (const s of segments) {
    try {
      return parseLiteral(s);
    } catch {
      /* try the next one */
    }
  }
  throw new Error("no literal output");
}

export function parseLiteral(s: string): unknown {
  // Next-pointer outputs write the level breaks as a bare # : [1,#,2,3,#]
  if (/^\[.*#.*\]$/.test(s) && !/["']/.test(s)) s = s.replace(/#/g, '"#"');
  try {
    return JSON.parse(s);
  } catch {
    // Single quotes, trailing commas, 2.00000, null inside arrays… let JS read it, but
    // only things that look like literals: no identifiers except true/false/null.
    if (/[A-Za-z_$]/.test(s.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(true|false|null|undefined|NaN|Infinity)\b/g, ""))) {
      throw new Error(`not a literal: ${s}`);
    }
    return new Function(`return (${s});`)();
  }
}

/** Picks the code to run: the last block that defines the entry, plus helper-only blocks. */
export function solutionSource(note: DsaNote, entry: string): string {
  const defines = new RegExp(`^\\s*(export\\s+)?(function|class)\\s+${entry}\\b`, "m");
  const main = note.codeBlocks.filter((b) => defines.test(b)).at(-1);
  if (!main) return note.codeBlocks.join("\n\n");
  // Earlier blocks may hold helpers (a heap class, ListNode). Keep the ones whose
  // declarations the main block doesn't already have, so nothing is declared twice.
  const declared = (b: string) => [...b.matchAll(/^\s*(?:export\s+)?(?:function|class)\s+(\w+)/gm)].map((m) => m[1]);
  const mainNames = new Set(declared(main));
  const helpers = note.codeBlocks
    .slice(0, note.codeBlocks.indexOf(main))
    .filter((b) => !defines.test(b) && declared(b).length && declared(b).every((n) => !mainNames.has(n)));
  return [...helpers, main].join("\n\n");
}

/**
 * The editor's starting point: the solution's signatures with the bodies emptied.
 * Functions keep their header line; classes keep fields, constructor and method headers.
 */
export function starterFrom(source: string, entry: string): string {
  const lines = source.split("\n");
  const out: string[] = [];
  let depth = 0;
  let keepDepth = -1; // depth at which we're copying a class's members
  for (const line of lines) {
    const trimmed = line.trim();
    const opens = (line.match(/{/g) ?? []).length;
    const closes = (line.match(/}/g) ?? []).length;
    if (depth === 0) {
      const isEntryFn = new RegExp(`^(export\\s+)?function\\s+${entry}\\b`).test(trimmed);
      const isEntryClass = new RegExp(`^(export\\s+)?class\\s+${entry}\\b`).test(trimmed);
      if (isEntryFn) out.push(line.replace(/{\s*$/, "{"), "    // Your code here", "}");
      if (isEntryClass) {
        out.push(line);
        keepDepth = 1;
      }
    } else if (depth === keepDepth && /[{]\s*$/.test(trimmed) && !/^(}|private\b|protected\b|#)/.test(trimmed)) {
      // Public constructor and method headers only. Fields and private helpers are left
      // out on purpose: names like `minStack` would give the approach away.
      const indent = line.match(/^\s*/)![0];
      out.push("", line.replace(/{\s*$/, "{"), indent + "    // Your code here", indent + "}");
    }
    depth += opens - closes;
    if (depth === 0 && keepDepth !== -1) {
      out.push("}");
      keepDepth = -1;
    }
  }
  return out.join("\n").replace(/{\n\n/g, "{\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
