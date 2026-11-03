// Every written page condensed to what you'd glance at in the 10 minutes before a call.

import { allItems, concepts, notes } from "../content/dsa/index.ts";
import { Markdown } from "../components/Markdown.tsx";
import { Difficulty } from "../components/bits.tsx";
import { href } from "../lib/router.ts";

export function CheatSheetPage() {
  const items = allItems.filter((i) => notes[i.slug]);
  return (
    <div className="page">
      <a className="back" href={href("dsa")}>← DSA</a>
      <div className="kicker">Night before</div>
      <h1>DSA cheat sheet</h1>
      <p className="muted">The recap of every concept, then each problem as pattern → optimal complexity → the keywords. Tap a title for the full page.</p>

      <h2 className="section-title">Concepts</h2>
      <div className="cheat-grid">
        {Object.values(concepts).map((c) => (
          <a key={c.slug} className="cheat" href={href("dsa", "concept", c.slug)}>
            <strong>{c.title}</strong>
            <ul>
              {c.recap.map((r) => (
                <li key={r}>
                  <Markdown text={r} inline />
                </li>
              ))}
            </ul>
          </a>
        ))}
      </div>

      <h2 className="section-title">Problems</h2>
      <div className="cheat-table">
        <div className="cheat-row cheat-header">
          <span>Problem</span>
          <span>Pattern</span>
          <span>Time</span>
          <span>Space</span>
          <span>Say</span>
        </div>
        {items.map((i) => {
          const n = notes[i.slug];
          const best = n.approaches[n.approaches.length - 1];
          return (
            <a key={i.slug} className="cheat-row" href={href("dsa", i.slug)}>
              <span>
                <strong>{i.title}</strong> <Difficulty level={i.difficulty} />
              </span>
              <span>{n.pattern}</span>
              <span><code>{best.complexity.time}</code></span>
              <span><code>{best.complexity.space}</code></span>
              <span className="muted">{n.interview.keywords.map((k) => k.term).join(" · ")}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
