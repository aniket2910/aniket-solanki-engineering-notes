// DSA track: the sheet (roadmap) joined with the revision pages written so far.

import type { ConceptNote, ProblemNote } from "../types.ts";
import { sheet, type SheetItem, type SheetSection } from "./sheet.ts";
import whyDsa from "./concepts/why-dsa.ts";
import timeComplexity from "./concepts/time-complexity.ts";
import spaceComplexity from "./concepts/space-complexity.ts";
import complexityInInterviews from "./concepts/complexity-in-interviews.ts";
import arrays from "./concepts/arrays.ts";

export { sheet };
export type { SheetItem, SheetSection };

// Adding a file to notes/ is all it takes for a problem to go live.
const modules = import.meta.glob<{ default: ProblemNote }>("./notes/*.ts", { eager: true });
export const notes: Record<string, ProblemNote> = Object.fromEntries(
  Object.values(modules).map((m) => [m.default.slug, m.default]),
);

/** Concept pages, read before a section's problems, keyed by section number. */
export const sectionConcepts: Record<number, ConceptNote[]> = {
  1: [whyDsa, timeComplexity, spaceComplexity, complexityInInterviews],
  2: [arrays],
};

export const concepts: Record<string, ConceptNote> = Object.fromEntries(
  Object.values(sectionConcepts)
    .flat()
    .map((c) => [c.slug, c]),
);

export const allItems: (SheetItem & { section: SheetSection })[] = sheet.flatMap((s) =>
  s.items.map((i) => ({ ...i, section: s })),
);

export function findItem(slug: string) {
  return allItems.find((i) => i.slug === slug);
}

export const pageId = {
  problem: (slug: string) => `dsa:${slug}`,
  concept: (slug: string) => `dsa:concept:${slug}`,
};
