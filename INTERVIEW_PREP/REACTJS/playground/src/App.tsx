import { useState } from "react";
import { problems } from "./problems/registry";

/**
 * Thin shell: a sidebar of problems + a stage that renders the selected one.
 * Kept intentionally small — it's a host, not a problem. New problems appear
 * automatically from the registry, so this never needs editing.
 */
export default function App() {
  const [slug, setSlug] = useState(problems[0].slug);
  const active = problems.find((p) => p.slug === slug) ?? problems[0];
  const Active = active.Component;

  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="brand">React Playground</h1>
        <nav className="nav">
          {problems.map((p) => (
            <button
              key={p.slug}
              className={p.slug === slug ? "nav__item nav__item--active" : "nav__item"}
              onClick={() => setSlug(p.slug)}
            >
              {p.title}
            </button>
          ))}
        </nav>
      </aside>

      <main className="stage">
        <h2 className="stage__title">{active.title}</h2>
        <Active />
      </main>
    </div>
  );
}
