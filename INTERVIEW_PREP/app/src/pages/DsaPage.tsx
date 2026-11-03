import { useState } from "react";
import { notes, pageId, sectionConcepts, sheet } from "../content/dsa/index.ts";
import { Difficulty } from "../components/bits.tsx";
import { isDue, useProgress, type ItemProgress } from "../lib/progress.ts";
import { href } from "../lib/router.ts";

type Filter = "all" | "ready" | "due" | "todo";

function status(p: ItemProgress | undefined): { key: string; label: string } {
  if (isDue(p)) return { key: "due", label: "Due" };
  if (p?.reviews) return { key: "revised", label: "Revised" };
  if (p?.solved) return { key: "solved", label: "Solved" };
  return { key: "new", label: "" };
}

export function DsaPage() {
  const progress = useProgress();
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const ready = Object.keys(notes).length;
  const total = sheet.reduce((a, s) => a + s.items.length, 0);

  return (
    <div className="page">
      <header className="track-head">
        <div>
          <div className="kicker">Track</div>
          <h1>DSA · Namaste DSA Sheet</h1>
          <p className="muted">
            {total} problems in the sheet's order. {ready} have revision notes so far; the rest link out until their notes land.
            Start with the Foundation concepts — every later answer ends with a complexity question.
          </p>
        </div>
        <a className="btn" href={href("dsa", "cheatsheet")}>Night-before cheat sheet →</a>
      </header>

      <div className="filters">
        <input className="search" placeholder="Search problems or patterns…" value={q} onChange={(e) => setQ(e.target.value)} />
        {(["all", "ready", "due", "todo"] as Filter[]).map((f) => (
          <button key={f} className={`chip ${filter === f ? "is-active" : ""}`} onClick={() => setFilter(f)}>
            {{ all: "All", ready: "Has notes", due: "Due today", todo: "Not revised" }[f]}
          </button>
        ))}
      </div>

      {sheet.map((section) => {
        const items = section.items.filter((i) => {
          const p = progress.items[pageId.problem(i.slug)];
          const text = `${i.title} ${notes[i.slug]?.pattern ?? ""}`.toLowerCase();
          if (q && !text.includes(q.toLowerCase())) return false;
          if (filter === "ready") return !!notes[i.slug];
          if (filter === "due") return isDue(p);
          if (filter === "todo") return !p?.reviews;
          return true;
        });
        const concepts = sectionConcepts[section.num] ?? [];
        const showConcepts = concepts.length > 0 && !q && filter !== "due";
        if (!items.length && !showConcepts) return null;
        const revised = section.items.filter((i) => progress.items[pageId.problem(i.slug)]?.reviews).length;
        return (
          <section key={section.num} className="sheet-section">
            <div className="sheet-section-head">
              <h2>
                <span className="muted">{section.num}.</span> {section.title}
              </h2>
              <span className="muted">
                {revised}/{section.items.length} revised
              </span>
              <div className="bar">
                <span style={{ width: `${(revised / section.items.length) * 100}%` }} />
              </div>
            </div>
            {showConcepts && (
              <div className="concept-row">
                {concepts.map((c, k) => {
                  const p = progress.items[pageId.concept(c.slug)];
                  return (
                    <a key={c.slug} className="concept-card" href={href("dsa", "concept", c.slug)}>
                      <span className="muted">Concept {k + 1} · {c.minutes} min</span>
                      <strong>{c.title}</strong>
                      {p?.reviews ? <span className={`dot dot-${status(p).key}`}>{status(p).label}</span> : null}
                    </a>
                  );
                })}
              </div>
            )}
            <ol className="rows">
              {items.map((i) => {
                const p = progress.items[pageId.problem(i.slug)];
                const s = status(p);
                const n = notes[i.slug];
                return (
                  <li key={i.slug}>
                    <a className={`row ${n ? "" : "is-pending"}`} href={href("dsa", i.slug)}>
                      <span className="row-n muted">{section.items.indexOf(i) + 1}</span>
                      <span className="row-title">
                        {i.title}
                        {n && <span className="row-pattern muted">{n.pattern}</span>}
                      </span>
                      <Difficulty level={i.difficulty} />
                      <span className="row-status">
                        {s.label ? <span className={`dot dot-${s.key}`}>{s.label}</span> : !n && <span className="muted small">notes coming</span>}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
