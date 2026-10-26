import type { Route } from "../../router.ts";
import { itemBySlug, topicFolders } from "./data.ts";
import DsaHome from "./DsaHome.tsx";
import DsaProblemPage from "./DsaProblemPage.tsx";
import TopicPage from "./TopicPage.tsx";

/** #/dsa → the sheet · /p/two-sum → problem · /topic/05_ARRAYS → that topic's README */
export default function DsaSubject({ route }: { route: Route }) {
  const [, view, arg] = route.parts;
  if (view === "p" && itemBySlug.has(arg)) return <DsaProblemPage key={arg} item={itemBySlug.get(arg)!} />;
  if (view === "topic" && topicFolders.includes(arg)) return <TopicPage key={arg} folder={arg} />;
  return <DsaHome />;
}
