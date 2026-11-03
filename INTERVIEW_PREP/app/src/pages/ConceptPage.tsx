import { useEffect } from "react";
import { concepts, pageId, sectionConcepts, sheet } from "../content/dsa/index.ts";
import { Markdown } from "../components/Markdown.tsx";
import { RateBar } from "../components/RateBar.tsx";
import { Bullets, Keywords, RevealQA, Section } from "../components/bits.tsx";
import { logRead } from "../lib/progress.ts";
import { useMode } from "../lib/mode.ts";
import { href } from "../lib/router.ts";

export function ConceptPage({ slug }: { slug: string }) {
  const c = concepts[slug];
  const mode = useMode();
  useEffect(() => {
    if (!c) return;
    logRead(pageId.concept(c.slug));
    window.scrollTo(0, 0);
  }, [c]);
  if (!c) return <p className="page">No concept page called “{slug}”.</p>;

  // Prev/next stay inside the concept's own section; after its last concept come its problems.
  const [num, list] = Object.entries(sectionConcepts).find(([, cs]) => cs.includes(c))!;
  const firstProblem = sheet.find((s) => s.num === Number(num))!.items[0];
  const i = list.indexOf(c);
  const prev = list[i - 1];
  const next = list[i + 1];

  return (
    <article className="page narrow concept">
      <a className="back" href={href("dsa")}>← DSA</a>
      <div className="kicker">Concept · {c.minutes} min read</div>
      <h1>{c.title}</h1>
      <p className="gist">{c.why}</p>

      <nav className="toc">
        {c.sections.map((s, k) => (
          <button key={s.heading} onClick={() => document.getElementById(`s${k}`)?.scrollIntoView({ behavior: "smooth" })}>
            {s.heading}
          </button>
        ))}
      </nav>

      {c.sections.map((s, k) => (
        <Section key={s.heading} id={`s${k}`} title={s.heading}>
          <Markdown text={s.body} />
        </Section>
      ))}

      <Section title="Keywords to use" kicker="Interview">
        <Keywords items={c.keywords} />
      </Section>
      <Section title="Bonus points">
        <Bullets items={c.bonus} className="bonus" />
      </Section>
      <Section title="Questions you'll be asked" kicker="Say it out loud, then check">
        {c.questions.map((q) => (
          <RevealQA key={q.q} item={q} open={mode === "revise"} />
        ))}
      </Section>
      <section className="recap">
        <h3>Last look before the interview</h3>
        <ol>
          {c.recap.map((r) => (
            <li key={r}>
              <Markdown text={r} inline />
            </li>
          ))}
        </ol>
      </section>

      <RateBar id={pageId.concept(c.slug)} />

      <nav className="pager">
        {prev ? <a href={href("dsa", "concept", prev.slug)}>← {prev.title}</a> : <span />}
        {next ? <a href={href("dsa", "concept", next.slug)}>{next.title} →</a> : <a href={href("dsa", firstProblem.slug)}>Start the problems →</a>}
      </nav>
    </article>
  );
}
