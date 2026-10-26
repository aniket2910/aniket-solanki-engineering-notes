// Where the DSA tab's content comes from: the sheet manifest (sheet.ts) for the order and
// judging, and the DSA/ notes for everything you read. Notes load lazily, one per page,
// so the problem list opens without pulling 200 markdown files into the bundle.

import type { LinkResolver } from "../../components/Markdown.tsx";
import { createProgress } from "../../lib/progress.ts";
import { sheet, sheetItems, type SheetItem } from "./sheet.ts";

const PREFIX = "../../../../../DSA/";
const notes = import.meta.glob("../../../../../DSA/**/*.md", { query: "?raw", import: "default" }) as Record<
  string,
  () => Promise<string>
>;

export { sheet };

/** The sheet lists Intersection of Two Linked Lists twice; pages and progress are per problem. */
export const problems: SheetItem[] = [...new Map(sheetItems.map((i) => [i.slug, i])).values()];
export const itemBySlug = new Map(problems.map((p) => [p.slug, p]));
const slugByNote = new Map(problems.map((p) => [p.note, p.slug]));

export const progress = createProgress("dsa");

export function loadNote(path: string): Promise<string> {
  const loader = notes[PREFIX + path];
  return loader ? loader() : Promise.reject(new Error(`No note at DSA/${path}`));
}

export const topicFolders = [...new Set(Object.keys(notes).map((k) => k.slice(PREFIX.length).split("/")[0]))]
  .filter((f) => notes[`${PREFIX}${f}/README.md`])
  .sort();

/** Resolves a note's relative links: sheet problems open in the hub, topic READMEs as topic pages. */
export function linksFrom(notePath: string): LinkResolver {
  const folder = notePath.split("/").slice(0, -1);
  return (href) => {
    if (/^https?:/.test(href)) return href;
    if (href.startsWith("#")) return null;
    const parts = [...folder];
    for (const seg of href.split("#")[0].split("/")) {
      if (seg === "..") parts.pop();
      else if (seg && seg !== ".") parts.push(seg);
    }
    const target = parts.join("/");
    const slug = slugByNote.get(target);
    if (slug) return `#/dsa/p/${slug}`;
    if (target.endsWith("README.md") && parts.length === 2) return `#/dsa/topic/${parts[0]}`;
    return null;
  };
}
