import { useEffect, useState } from "react";
import { Markdown } from "../../components/Markdown.tsx";
import { href } from "../../router.ts";
import { linksFrom, loadNote } from "./data.ts";
import { topicName } from "./DsaHome.tsx";

/** A DSA/<topic>/README.md: the theory and pattern notes for that topic. */
export default function TopicPage({ folder }: { folder: string }) {
  const path = `${folder}/README.md`;
  const [md, setMd] = useState<string | null>(null);
  useEffect(() => {
    loadNote(path).then(setMd, (e) => setMd(`Couldn't load ${path}: ${e}`));
  }, [path]);

  return (
    <div className="page page--reading">
      <a className="crumb" href={href("dsa")}>
        ← Namaste DSA Sheet
      </a>
      <p className="eyebrow">Topic notes</p>
      <h1>{topicName(folder)}</h1>
      <section className="card card--reading">{md === null ? <p className="muted">Loading…</p> : <Markdown source={md.replace(/^# .*\n/, "")} resolveLink={linksFrom(path)} />}</section>
    </div>
  );
}
