// Turns the LEETCODE_SQL_50/*.md section files into structured problems.
//
// The markdown is the single source of truth: the hub never keeps its own copy of a
// problem. Every problem block in those files follows the same shape, so the parser
// just cuts it at the bold labels:
//
//   ## 1757 · Title
//   **Difficulty:** Easy · **Schema:** `lc1757`
//   **Problem.** …  **Example.** …  **What it's really testing:** …
//   **How to relate:** …  **Hint ladder.** 1. 2. 3.  (extra notes)  <details>Solution</details>

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Sql50Problem = {
  id: number;
  title: string;
  difficulty: Difficulty;
  schema: string;
  sectionNum: string;
  statement: string;
  example: string;
  testing: string;
  relate: string;
  hints: string[];
  /** Talking points / Postgres notes that sit between the hints and the solution. */
  notes: string;
  /** Everything inside <details>: SQL plus the prose around it. */
  solutionMd: string;
  /** The SQL code blocks of the solution, in order. */
  solutionSql: string[];
};

export type Sql50Section = {
  num: string;
  title: string;
  intro: string;
  concepts: string;
  recap: string;
  problems: Sql50Problem[];
};

const PROBLEM_HEADING = /^(\d+) · (.+)$/;

export function parseSection(fileName: string, md: string): Sql50Section {
  const num = fileName.match(/(\d\d)-/)?.[1] ?? "00";
  const title = md.match(/^# \d+ · (.+)$/m)?.[1]?.trim() ?? fileName;

  // Cut at every level-2 heading. Chunk 0 is the intro under the "# NN · Title" line.
  const chunks = md.split(/^## /m);
  const section: Sql50Section = {
    num,
    title,
    intro: cleanIntro(chunks[0]),
    concepts: "",
    recap: "",
    problems: [],
  };

  for (const chunk of chunks.slice(1)) {
    const newline = chunk.indexOf("\n");
    const heading = chunk.slice(0, newline).trim();
    const body = stripRules(chunk.slice(newline + 1));

    const problem = heading.match(PROBLEM_HEADING);
    if (problem) {
      section.problems.push(parseProblem(Number(problem[1]), problem[2].trim(), num, body));
    } else if (heading.startsWith("Concepts")) {
      section.concepts = body;
    } else if (heading.includes("recap")) {
      section.recap = body;
    }
  }
  return section;
}

function parseProblem(id: number, title: string, sectionNum: string, body: string): Sql50Problem {
  const meta = body.match(/\*\*Difficulty:\*\*\s*(\w+)\s*·\s*\*\*Schema:\*\*\s*`(\w+)`/);

  const at = {
    problem: body.indexOf("**Problem.**"),
    example: body.indexOf("**Example.**"),
    testing: body.indexOf("**What it's really testing"),
    relate: body.indexOf("**How to relate"),
    hints: body.indexOf("**Hint ladder.**"),
    details: body.indexOf("<details>"),
  };
  const between = (from: number, to: number) => body.slice(from, to === -1 ? undefined : to).trim();

  const { hints, rest } = splitHintList(between(at.hints + "**Hint ladder.**".length, at.details));
  const details = at.details === -1 ? "" : body.slice(at.details);
  const solutionMd = details
    .replace(/^<details>\s*<summary>.*?<\/summary>/s, "")
    .replace(/<\/details>[\s\S]*$/, "")
    .trim();

  return {
    id,
    title,
    difficulty: (meta?.[1] as Difficulty) ?? "Easy",
    schema: meta?.[2] ?? `lc${id}`,
    sectionNum,
    statement: dropLabel(between(at.problem, at.example), "**Problem.**"),
    example: dropLabel(between(at.example, at.testing), "**Example.**"),
    testing: dropLabel(between(at.testing, at.relate), /^\*\*What it's really testing:?\*\*:?/),
    relate: dropLabel(between(at.relate, at.hints), /^\*\*How to relate:?\*\*:?/),
    hints,
    notes: rest,
    solutionMd,
    solutionSql: [...solutionMd.matchAll(/```sql\n([\s\S]*?)```/g)].map((m) => m[1].trim()),
  };
}

/** Pulls the "1. … 2. … 3. …" list off the top; whatever follows is extra notes. */
function splitHintList(text: string): { hints: string[]; rest: string } {
  const hints: string[] = [];
  const lines = text.split("\n");
  let i = 0;
  for (; i < lines.length; i++) {
    const line = lines[i];
    const item = line.match(/^\d+\.\s+(.*)$/);
    if (item) hints.push(item[1]);
    else if (hints.length && /^\s+\S/.test(line)) hints[hints.length - 1] += " " + line.trim();
    else if (line.trim() === "" && hints.length === 0) continue;
    else break;
  }
  return { hints, rest: lines.slice(i).join("\n").trim() };
}

function dropLabel(text: string, label: string | RegExp): string {
  return (typeof label === "string" ? text.replace(label, "") : text.replace(label, "")).trim();
}

/** Removes the "# title", the breadcrumb line and the "Run the solutions" CLI hint. */
function cleanIntro(text: string): string {
  return stripRules(
    text
      .replace(/^# .*$/m, "")
      .replace(/^\[← SQL 50 home\].*$/m, "")
      .replace(/^\*\*Run the solutions:\*\*.*$/m, ""),
  );
}

function stripRules(text: string): string {
  return text.replace(/^\s*---\s*$/gm, "").trim();
}
