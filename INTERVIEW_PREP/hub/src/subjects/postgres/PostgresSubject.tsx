import type { Route } from "../../router.ts";
import { problemById, sectionByNum } from "./sql50/data.ts";
import Sql50Home from "./Sql50Home.tsx";
import GuidePage from "./GuidePage.tsx";
import SectionPage from "./SectionPage.tsx";
import ProblemPage from "./ProblemPage.tsx";

/** #/postgres → list · /guide → method · /section/01 → concepts · /p/1757 → problem */
export default function PostgresSubject({ route }: { route: Route }) {
  const [, view, arg] = route.parts;

  if (view === "guide") return <GuidePage />;
  if (view === "section" && sectionByNum.has(arg)) return <SectionPage section={sectionByNum.get(arg)!} anchor={route.anchor} />;
  if (view === "p" && problemById.has(Number(arg))) return <ProblemPage key={arg} problem={problemById.get(Number(arg))!} />;
  return <Sql50Home />;
}
