// Writes DSA/NAMASTE_DSA_SHEET.md from the sheet manifest, so the markdown index and the
// hub can never disagree about which note covers which problem.  npm run gen:dsa-sheet

import { readFileSync, writeFileSync } from "node:fs";
import { sheet } from "../src/subjects/dsa/sheet.ts";

const dsaDir = new URL("../../../DSA/", import.meta.url);
const badge = { Easy: "🟢 Easy", Medium: "🟡 Medium", Hard: "🔴 Hard" } as const;
const total = sheet.reduce((n, s) => n + s.items.length, 0);

const lines: string[] = [
  "# 🗒️ Namaste DSA Sheet → Notes Map",
  "",
  `Every problem of the [Namaste DSA Sheet](https://namastedev.com/namaste-dsa-sheet), ${total} in the sheet's own order, mapped to`,
  "the note in this notebook that teaches it. 🔥 marks the notes tagged **Must Solve**.",
  "",
  "**Practise in the browser:** the [Interview Prep Hub](../INTERVIEW_PREP/hub/README.md) (DSA tab) turns each note into a",
  "page with a TypeScript editor that runs your code against the note's test cases.",
  "",
  "This file is generated from `INTERVIEW_PREP/hub/src/subjects/dsa/sheet.ts` by `npm run gen:dsa-sheet` (in the hub).",
  "Edit the manifest, not this file.",
  "",
];

for (const section of sheet) {
  lines.push("---", "", `## ${section.num}. ${section.title} (${section.items.length})`, "");
  lines.push("| # | Problem | Difficulty | Note | Practice |", "| :---: | :--- | :---: | :--- | :---: |");
  section.items.forEach((item, i) => {
    const md = readFileSync(new URL(item.note, dsaDir), "utf8");
    const hot = /MUST SOLVE/i.test(md.slice(0, 800)) ? " 🔥" : "";
    const where = item.link.includes("leetcode") ? "LeetCode" : "NamasteDev";
    lines.push(`| ${i + 1} | ${item.title}${hot} | ${badge[item.difficulty]} | [\`${item.note}\`](./${item.note}) | [${where}](${item.link}) |`);
  });
  lines.push("");
}

writeFileSync(new URL("NAMASTE_DSA_SHEET.md", dsaDir), lines.join("\n"));
console.log(`Wrote DSA/NAMASTE_DSA_SHEET.md (${total} problems).`);
