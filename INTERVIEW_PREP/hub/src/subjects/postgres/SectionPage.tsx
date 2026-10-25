import { Markdown } from "../../components/Markdown.tsx";
import { href } from "../../router.ts";
import type { Sql50Section } from "./sql50/parse.ts";
import { useProgress } from "./progress.ts";

/** A section's "read this first" concepts, then its problems, then the recap. */
export default function SectionPage({ section, anchor }: { section: Sql50Section; anchor: string | null }) {
  const progress = useProgress();
  return (
    <div className="page page--reading">
      <a className="crumb" href={href("postgres")}>
        ← SQL 50
      </a>
      <p className="eyebrow">Section {section.num}</p>
      <h1>{section.title}</h1>
      <Markdown source={section.intro} className="lede" />

      <section className="card card--reading">
        <h2>Concepts for this section</h2>
        <Markdown source={section.concepts} anchor={anchor} />
      </section>

      <section className="card card--reading">
        <h2>Problems</h2>
        <ul className="plist">
          {section.problems.map((p) => (
            <li key={p.id}>
              <a className="plist__row" href={href("postgres", "p", p.id)}>
                <span className={`tick ${progress[p.id]?.solved ? "tick--on" : ""}`}>{progress[p.id]?.solved ? "✓" : ""}</span>
                <span className="plist__id">{p.id}</span>
                <span className="plist__title">{p.title}</span>
                <span className={`diff diff--${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {section.recap && (
        <section className="card card--reading">
          <h2>Section recap</h2>
          <Markdown source={section.recap} />
        </section>
      )}
    </div>
  );
}
