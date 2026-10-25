import { Markdown } from "../../components/Markdown.tsx";
import { href } from "../../router.ts";
import { guideBlocks } from "./sql50/data.ts";

/** The README's method, signal-word map, MySQL gotchas and the 14-day plan. */
export default function GuidePage() {
  return (
    <div className="page page--reading">
      <a className="crumb" href={href("postgres")}>
        ← SQL 50
      </a>
      <h1>How to solve any SQL problem</h1>
      <nav className="toc">
        {guideBlocks.map((b) => (
          <a key={b.heading} href={`#g-${b.heading}`} onClick={(e) => jump(e, b.heading)}>
            {b.heading}
          </a>
        ))}
      </nav>
      {guideBlocks.map((b) => (
        <section key={b.heading} id={`g-${b.heading}`} className="card card--reading">
          <h2>{b.heading}</h2>
          <Markdown source={b.body} />
        </section>
      ))}
    </div>
  );
}

// Hash links would clash with the hash router, so scroll by hand.
function jump(e: React.MouseEvent, heading: string) {
  e.preventDefault();
  document.getElementById(`g-${heading}`)?.scrollIntoView({ behavior: "smooth" });
}
