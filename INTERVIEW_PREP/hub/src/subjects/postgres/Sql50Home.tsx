import { useMemo, useState } from "react";
import { href } from "../../router.ts";
import { problems, sections, studyPlan } from "./sql50/data.ts";
import type { Difficulty } from "./sql50/parse.ts";
import { resetProgress, useProgress } from "./progress.ts";

type Status = "all" | "todo" | "solved";

export default function Sql50Home() {
  const progress = useProgress();
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [status, setStatus] = useState<Status>("all");
  const [day, setDay] = useState(0);

  const solvedCount = problems.filter((p) => progress[p.id]?.solved).length;
  const dayIds = day ? new Set(studyPlan.find((d) => d.day === day)?.ids) : null;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return problems.filter((p) => {
      if (q && !`${p.id} ${p.title}`.toLowerCase().includes(q)) return false;
      if (difficulty !== "all" && p.difficulty !== difficulty) return false;
      if (status === "solved" && !progress[p.id]?.solved) return false;
      if (status === "todo" && progress[p.id]?.solved) return false;
      if (dayIds && !dayIds.has(p.id)) return false;
      return true;
    });
  }, [query, difficulty, status, dayIds, progress]);

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Postgres · Problem set</p>
          <h1>LeetCode SQL 50</h1>
          <p className="lede">
            Read the problem, write your query, and run it here on real Postgres (PGlite, in this tab) against
            the same seed as the CLI playground. Every run is rolled back, so you can't break the data.
          </p>
          <div className="hero__links">
            <a className="btn btn--primary" href={href("postgres", "guide")}>
              The method + study plan
            </a>
            <a className="btn" href={href("postgres", "p", firstUnsolved(progress))}>
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
          <div className="meter__label">solved</div>
        </div>
      </header>

      <div className="filters">
        <input
          className="input"
          placeholder="Search by number or title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Segmented value={difficulty} onChange={setDifficulty} options={["all", "Easy", "Medium", "Hard"]} />
        <Segmented value={status} onChange={setStatus} options={["all", "todo", "solved"]} />
        <select className="input input--select" value={day} onChange={(e) => setDay(Number(e.target.value))}>
          <option value={0}>Any study day</option>
          {studyPlan
            .filter((d) => d.ids.length)
            .map((d) => (
              <option key={d.day} value={d.day}>
                Day {d.day}: {stripMd(d.concept)}
              </option>
            ))}
        </select>
      </div>

      {sections.map((s) => {
        const rows = visible.filter((p) => p.sectionNum === s.num);
        if (!rows.length) return null;
        const done = s.problems.filter((p) => progress[p.id]?.solved).length;
        return (
          <section key={s.num} className="group">
            <div className="group__head">
              <h2>
                <span className="group__num">{s.num}</span> {s.title}
              </h2>
              <span className="muted">
                {done}/{s.problems.length} ·{" "}
                <a href={href("postgres", "section", s.num)}>Concepts first</a>
              </span>
            </div>
            <ul className="plist">
              {rows.map((p) => {
                const pr = progress[p.id];
                return (
                  <li key={p.id}>
                    <a className="plist__row" href={href("postgres", "p", p.id)}>
                      <span className={`tick ${pr?.solved ? "tick--on" : ""}`} aria-label={pr?.solved ? "Solved" : "Not solved"}>
                        {pr?.solved ? "✓" : ""}
                      </span>
                      <span className="plist__id">{p.id}</span>
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
        );
      })}
      {!visible.length && <p className="muted">No problems match those filters.</p>}

      <footer className="foot">
        <button
          className="btn btn--ghost"
          onClick={() => confirm("Clear solved/hint progress in this browser? Drafts are kept.") && resetProgress()}
        >
          Reset progress
        </button>
      </footer>
    </div>
  );
}

function firstUnsolved(progress: ReturnType<typeof useProgress>) {
  return (problems.find((p) => !progress[p.id]?.solved) ?? problems[0]).id;
}

const stripMd = (s: string) => s.replace(/\*\*/g, "").replace(/`/g, "");

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: T[];
}) {
  return (
    <div className="seg" role="radiogroup">
      {options.map((o) => (
        <button key={o} role="radio" aria-checked={o === value} className={o === value ? "seg__on" : ""} onClick={() => onChange(o)}>
          {o === "all" ? "All" : o[0].toUpperCase() + o.slice(1)}
        </button>
      ))}
    </div>
  );
}
