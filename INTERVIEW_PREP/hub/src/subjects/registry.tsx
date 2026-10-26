import type { ComponentType } from "react";
import type { Route } from "../router.ts";
import PostgresSubject from "./postgres/PostgresSubject.tsx";
import ReactSubject from "./react/ReactSubject.tsx";
import DsaSubject from "./dsa/DsaSubject.tsx";

/**
 * Every subject of the notebook is one tab. Adding a subject = one entry here plus a
 * folder under subjects/. The shell (App.tsx) never needs editing.
 */
export type Subject = {
  id: string;
  title: string;
  blurb: string;
  ready: boolean;
  Component: ComponentType<{ route: Route }>;
};

export const subjects: Subject[] = [
  {
    id: "postgres",
    title: "Postgres",
    blurb: "LeetCode SQL 50: read the problem, write the query, run it on real Postgres in this tab.",
    ready: true,
    Component: PostgresSubject,
  },
  {
    id: "react",
    title: "React",
    blurb: "Machine-coding problems. The runnable builds live in REACTJS/playground for now.",
    ready: false,
    Component: ReactSubject,
  },
  {
    id: "dsa",
    title: "DSA",
    blurb: "The Namaste DSA Sheet: 165 problems read from your DSA/ notes, with a TypeScript runner.",
    ready: true,
    Component: DsaSubject,
  },
];
