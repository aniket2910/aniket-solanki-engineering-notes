import { useState, type ReactNode } from "react";
import { Markdown } from "./Markdown.tsx";
import type { Keyword, QA } from "../content/types.ts";

export function Difficulty({ level }: { level: "Easy" | "Medium" | "Hard" }) {
  return <span className={`diff diff-${level.toLowerCase()}`}>{level}</span>;
}

export function Section({ id, title, children, kicker }: { id?: string; title: string; kicker?: string; children: ReactNode }) {
  return (
    <section className="block" id={id}>
      {kicker && <div className="kicker">{kicker}</div>}
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function Keywords({ items }: { items: Keyword[] }) {
  return (
    <dl className="keywords">
      {items.map((k) => (
        <div key={k.term}>
          <dt>{k.term}</dt>
          <dd>
            <Markdown text={k.meaning} inline />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Bullets({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={className}>
      {items.map((b) => (
        <li key={b}>
          <Markdown text={b} inline />
        </li>
      ))}
    </ul>
  );
}

/** A question with its answer hidden until clicked: say it out loud first. */
export function RevealQA({ item, open: forced }: { item: QA; open?: boolean }) {
  const [open, setOpen] = useState(false);
  const shown = open || forced;
  return (
    <div className={`qa ${shown ? "is-open" : ""}`}>
      <button className="qa-q" onClick={() => setOpen((o) => !o)} aria-expanded={shown}>
        <span>
          <Markdown text={item.q} inline />
        </span>
        <span className="qa-toggle">{shown ? "Hide" : "Answer"}</span>
      </button>
      {shown && (
        <div className="qa-a">
          <Markdown text={item.a} inline />
        </div>
      )}
    </div>
  );
}

export function Locked({ title, onReveal, children }: { title: string; onReveal: () => void; children?: ReactNode }) {
  return (
    <div className="locked">
      <div>
        <strong>{title}</strong>
        {children && <p className="muted">{children}</p>}
      </div>
      <button className="btn btn-primary" onClick={onReveal}>
        Reveal answer
      </button>
    </div>
  );
}
