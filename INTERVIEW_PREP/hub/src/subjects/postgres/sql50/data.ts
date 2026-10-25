// Loads the SQL 50 notes straight from POSTGRES/LEETCODE_SQL_50 at build time.
// Edit a markdown file and the hub hot-reloads it: there is no second copy to keep in sync.

import { parseSection, type Sql50Problem, type Sql50Section } from "./parse.ts";
import readme from "../../../../../POSTGRES/LEETCODE_SQL_50/README.md?raw";

const files = import.meta.glob("../../../../../POSTGRES/LEETCODE_SQL_50/[0-9][0-9]-*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const sections: Sql50Section[] = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, md]) => parseSection(path.split("/").pop()!, md));

export const problems: Sql50Problem[] = sections.flatMap((s) => s.problems);

export const problemById = new Map(problems.map((p) => [p.id, p]));
export const sectionByNum = new Map(sections.map((s) => [s.num, s]));

// ───────────────────── the README: guide blocks + study plan ─────────────────────

const readmeBlocks = readme.split(/^## /m).slice(1).map((chunk) => {
  const newline = chunk.indexOf("\n");
  return { heading: chunk.slice(0, newline).trim(), body: chunk.slice(newline + 1).replace(/^\s*---\s*$/gm, "").trim() };
});

// "Run it" is CLI-only, and "Sections" / "Progress tracker" are live in the hub itself.
const SKIP = ["Run it", "Sections", "Progress tracker"];
export const guideBlocks = readmeBlocks.filter((b) => !SKIP.some((s) => b.heading.includes(s)));

export type StudyDay = { day: number; what: string; concept: string; ids: number[] };

/** Parses the 14-day table so the problem list can filter to one day's set. */
export const studyPlan: StudyDay[] = (readmeBlocks.find((b) => b.heading.includes("Study plan"))?.body ?? "")
  .split("\n")
  .filter((line) => /^\|\s*\d+\s*\|/.test(line))
  .map((line) => {
    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    const ids = cells
      .slice(2)
      .flatMap((c) => c.match(/\b\d{3,4}\b/g) ?? [])
      .map(Number)
      .filter((id) => problemById.has(id));
    return { day: Number(cells[0]), what: cells[1], concept: cells[2], ids: [...new Set(ids)] };
  });
