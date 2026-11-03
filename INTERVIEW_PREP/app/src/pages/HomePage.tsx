import { useRef, useState } from "react";
import { allItems, concepts, notes, pageId } from "../content/dsa/index.ts";
import { tracks } from "../content/tracks.ts";
import { Heatmap } from "../components/Heatmap.tsx";
import { exportProgress, importProgress, isDue, streaks, useProgress } from "../lib/progress.ts";
import { href } from "../lib/router.ts";

/** Every page with revision notes, in reading order. */
function pages() {
  const out: { id: string; title: string; to: string; kind: string }[] = [];
  for (const c of Object.values(concepts)) out.push({ id: pageId.concept(c.slug), title: c.title, to: href("dsa", "concept", c.slug), kind: "Concept" });
  for (const i of allItems)
    if (notes[i.slug]) out.push({ id: pageId.problem(i.slug), title: i.title, to: href("dsa", i.slug), kind: i.section.title });
  return out;
}

export function HomePage() {
  const progress = useProgress();
  const { current, longest, activeDays } = streaks(progress.days);
  const all = pages();
  const due = all.filter((p) => isDue(progress.items[p.id]));
  const next = all.find((p) => !progress.items[p.id]?.reviews);
  const revised = all.filter((p) => progress.items[p.id]?.reviews).length;
  const solved = Object.values(progress.items).filter((p) => p.solved).length;

  return (
    <div className="page">
      <section className="hero">
        <div>
          <div className="kicker">Interview revision</div>
          <h1>Read what the interview needs. Nothing more, nothing less.</h1>
          <p className="muted">
            One page per problem or concept: what it's really asking, the cases to predict, three hints, the answer behind a
            reveal, the complexity explained, and the exact words to say. Rate each page when you finish it and it comes back
            when you're about to forget it.
          </p>
          <div className="hero-actions">
            {next && (
              <a className="btn btn-primary" href={next.to}>
                Continue: {next.title} →
              </a>
            )}
            <a className="btn" href={href("dsa")}>Browse DSA</a>
          </div>
        </div>
      </section>

      <section className="stats">
        <Stat value={current} label="day streak" accent />
        <Stat value={longest} label="longest streak" />
        <Stat value={activeDays} label="active days" />
        <Stat value={`${revised}/${all.length}`} label="pages revised" />
        <Stat value={solved} label="problems solved" />
      </section>

      <section className="card">
        <h2>Your revision history</h2>
        <Heatmap days={progress.days} />
      </section>

      <section className="card">
        <h2>Due for revision today {due.length > 0 && <span className="count">{due.length}</span>}</h2>
        {due.length ? (
          <ul className="due">
            {due.map((p) => (
              <li key={p.id}>
                <a href={p.to}>
                  <span className="muted small">{p.kind}</span> {p.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">
            Nothing due. Pages you rate come back here on schedule: “Forgot” tomorrow, “Got it” in a few days, “Easy” in a week or
            more, and each good review stretches the gap.
          </p>
        )}
      </section>

      <section>
        <h2 className="section-title">Tracks</h2>
        <div className="tracks">
          {tracks.map((t) =>
            t.live ? (
              <a key={t.id} className="track is-live" href={href(t.id)}>
                <strong>{t.title}</strong>
                <span className="muted">{t.blurb}</span>
              </a>
            ) : (
              <div key={t.id} className="track">
                <strong>
                  {t.title} <span className="pill">Planned</span>
                </strong>
                <span className="muted">{t.blurb}</span>
              </div>
            ),
          )}
        </div>
      </section>

      <Backup />
    </div>
  );
}

function Stat({ value, label, accent }: { value: number | string; label: string; accent?: boolean }) {
  return (
    <div className={`stat ${accent ? "is-accent" : ""}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

/** Progress lives in this browser; a JSON file moves it to another one. */
function Backup() {
  const input = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");
  const download = () => {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "revise-progress.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <section className="backup muted small">
      Progress is saved in this browser only.
      <button className="link" onClick={download}>Export backup</button>
      <button className="link" onClick={() => input.current?.click()}>Import backup</button>
      <input
        ref={input}
        type="file"
        accept="application/json"
        hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) setMsg(importProgress(await f.text()) ? "Imported." : "That file isn't a progress backup.");
        }}
      />
      {msg && <span>{msg}</span>}
    </section>
  );
}
