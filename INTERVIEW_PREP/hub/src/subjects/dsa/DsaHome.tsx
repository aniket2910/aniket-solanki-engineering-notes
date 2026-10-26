import { useMemo, useState } from "react";
import { Segmented } from "../../components/Segmented.tsx";
import { href } from "../../router.ts";
import { problems, progress, sheet, topicFolders } from "./data.ts";
import type { Difficulty } from "./sheet.ts";

type Status = "all" | "todo" | "solved";

export default function DsaHome() {
  const done = progress.useProgress();
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [status, setStatus] = useState<Status>("all");

  const solvedCount = problems.filter((p) => done[p.slug]?.solved).length;
  const next = problems.find((p) => !done[p.slug]?.solved) ?? problems[0];

  const keep = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (slug: string, title: string, diff: Difficulty) => {
      if (q && !title.toLowerCase().includes(q)) return false;
      if (difficulty !== "all" && diff !== difficulty) return false;
      if (status === "solved" && !done[slug]?.solved) return false;
      if (status === "todo" && done[slug]?.solved) return false;
      return true;
    };
  }, [query, difficulty, status, done]);

  const shown = sheet.map((s) => ({ ...s, rows: s.items.filter((i) => keep(i.slug, i.title, i.difficulty)) }));

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">DSA · Problem set</p>
          <h1>Namaste DSA Sheet</h1>
          <p className="lede">
            All 165 sheet problems in its own order, each one read from your <code>DSA/</code> notes. Write TypeScript in the
            editor and run it against the note's test cases, right here.
          </p>
          <div className="hero__links">
            <a className="btn btn--primary" href={href("dsa", "p", next.slug)}>
              Continue where you left off →
            </a>
          </div>
        </div>
        <div className="meter" aria-label={`${solvedCount} of ${problems.length} solved`}>
          <div className="meter__num">
            {solvedCount}
            <span>/{problems.length}</span>
          </div>
          <div className="meter__bar">
            <div style={{ width: `${(solvedCount / problems.length) * 100}%` }} />
          </div>
          <div className="meter__label">solved (Intersection appears twice in the sheet)</div>
        </div>
      </header>

      <div className="filters">
        <input className="input" placeholder="Search problems…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Segmented value={difficulty} onChange={setDifficulty} options={["all", "Easy", "Medium", "Hard"]} />
        <Segmented value={status} onChange={setStatus} options={["all", "todo", "solved"]} />
      </div>

      {shown.map((s) =>
        s.rows.length ? (
          <section key={s.num} className="group">
            <div className="group__head">
              <h2>
                <span className="group__num">{s.num}.</span> {s.title}
              </h2>
              <span className="muted">
                {s.items.filter((i) => done[i.slug]?.solved).length}/{s.items.length}
              </span>
            </div>
            <ul className="plist">
              {s.rows.map((p) => {
                const pr = done[p.slug];
                return (
                  <li key={p.slug}>
                    <a className="plist__row" href={href("dsa", "p", p.slug)}>
                      <span className={`tick ${pr?.solved ? "tick--on" : ""}`} aria-label={pr?.solved ? "Solved" : "Not solved"}>
                        {pr?.solved ? "✓" : ""}
                      </span>
                      <span className="plist__title">{p.title}</span>
                      <span className="plist__meta">
                        {pr?.hintsUsed ? <span className="chip chip--soft">{pr.hintsUsed} hint{pr.hintsUsed > 1 ? "s" : ""}</span> : null}
                        {pr?.peeked ? <span className="chip chip--soft">peeked</span> : null}
                        <span className={`diff diff--${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null,
      )}
      {shown.every((s) => !s.rows.length) && <p className="muted">No problems match those filters.</p>}

      <section className="group">
        <div className="group__head">
          <h2>Topic notes</h2>
          <span className="muted">The theory pages from DSA/</span>
        </div>
        <div className="toc">
          {topicFolders.map((f) => (
            <a key={f} href={href("dsa", "topic", f)}>
              {topicName(f)}
            </a>
          ))}
        </div>
      </section>

      <footer className="foot">
        <button
          className="btn btn--ghost"
          onClick={() => confirm("Clear solved/hint progress for the DSA sheet in this browser? Drafts are kept.") && progress.resetProgress()}
        >
          Reset progress
        </button>
      </footer>
    </div>
  );
}

export const topicName = (folder: string) =>
  folder
    .replace(/^\d+_/, "")
    .toLowerCase()
    .split("_")
    .map((w) => (w === "and" ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
