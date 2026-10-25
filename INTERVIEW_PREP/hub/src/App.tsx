import { useEffect } from "react";
import { href, useRoute } from "./router.ts";
import { subjects } from "./subjects/registry.tsx";

/**
 * The shell: a top bar of subjects, and the active subject below it.
 * Subjects own their own sub-routes (#/postgres/p/1757), so this never changes.
 */
export default function App() {
  const route = useRoute();
  const active = subjects.find((s) => s.id === route.parts[0]);
  const path = route.parts.join("/");

  // A new page starts at the top, unless the link asked for a heading (?a=…).
  useEffect(() => {
    if (!route.anchor) window.scrollTo(0, 0);
  }, [path, route.anchor]);

  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="#/">
          Interview Prep Hub
        </a>
        <nav className="subjects">
          {subjects.map((s) => (
            <a key={s.id} href={href(s.id)} className={s.id === active?.id ? "subject subject--on" : "subject"}>
              {s.title}
              {!s.ready && <span className="subject__soon">soon</span>}
            </a>
          ))}
        </nav>
      </header>
      <main>{active ? <active.Component route={route} /> : <Home />}</main>
    </div>
  );
}

function Home() {
  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Your reading book</p>
          <h1>Interview Prep Hub</h1>
          <p className="lede">
            Problem statement, examples, hints and a place to write and run your answer, all in one tab. Every page is
            rendered from the markdown notes in <code>INTERVIEW_PREP/</code>, so editing a note updates this page.
          </p>
        </div>
      </header>
      <div className="cards">
        {subjects.map((s) => (
          <a key={s.id} className={`subject-card ${s.ready ? "" : "subject-card--soon"}`} href={href(s.id)}>
            <h2>{s.title}</h2>
            <p>{s.blurb}</p>
            <span className="subject-card__cta">{s.ready ? "Open →" : "Coming soon"}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
