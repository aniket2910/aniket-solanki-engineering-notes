import { useCallback, useEffect, useState } from "react";
import { Markdown } from "../../components/Markdown.tsx";
import { go, href } from "../../router.ts";
import { problems, sectionByNum } from "./sql50/data.ts";
import type { Sql50Problem } from "./sql50/parse.ts";
import { usePersistentFlag, useProblemProgress } from "./progress.ts";
import { Timer } from "./Timer.tsx";
import { Workbench } from "./Workbench.tsx";

/**
 * One problem = reading pane (left) + workbench (right).
 *
 * Practice mode hides every aid at first, the way an interview would. You open them one
 * at a time: the concept, the signal words, then the hints, one rung of the ladder at a
 * time, and the solution last. Read mode opens everything for revision.
 */
export default function ProblemPage({ problem }: { problem: Sql50Problem }) {
  const [practice, setPractice] = usePersistentFlag("sql50.practice", true);
  const [progress, update] = useProblemProgress(problem.id);
  const [hintsShown, setHintsShown] = useState(practice ? 0 : problem.hints.length);
  const [solutionOpen, setSolutionOpen] = useState(!practice);
  const [injected, setInjected] = useState<{ sql: string; n: number } | null>(null);

  useEffect(() => {
    setHintsShown(practice ? 0 : problem.hints.length);
    setSolutionOpen(!practice);
  }, [practice, problem.hints.length]);

  const index = problems.findIndex((p) => p.id === problem.id);
  const prev = problems[index - 1];
  const next = problems[index + 1];
  const section = sectionByNum.get(problem.sectionNum)!;

  // Alt + ← / → moves between problems (plain arrows belong to the editor).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.key === "ArrowLeft" && prev) go("postgres", "p", prev.id);
      if (e.key === "ArrowRight" && next) go("postgres", "p", next.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const showHint = () => {
    const n = Math.min(hintsShown + 1, problem.hints.length);
    setHintsShown(n);
    if (practice && n > (progress.hintsUsed ?? 0)) update({ hintsUsed: n });
  };

  const openSolution = () => {
    setSolutionOpen(true);
    if (practice && !progress.solved) update({ peeked: true });
  };

  const onSolved = useCallback(() => {
    if (!progress.solved) update({ solved: true, solvedAt: new Date().toISOString() });
  }, [progress.solved, update]);

  return (
    <div className="problem">
      <div className="problem__top">
        <nav className="crumbs">
          <a href={href("postgres")}>SQL 50</a>
          <span>/</span>
          <a href={href("postgres", "section", section.num)}>
            {section.num} {section.title}
          </a>
        </nav>
        <div className="problem__title">
          <h1>
            <span className="muted">{problem.id}.</span> {problem.title}
          </h1>
          <span className={`diff diff--${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
          <label className="check">
            <input type="checkbox" checked={!!progress.solved} onChange={(e) => update({ solved: e.target.checked })} />
            Solved
          </label>
        </div>
        <div className="problem__tools">
          <div className="seg" role="radiogroup" aria-label="Mode">
            <button role="radio" aria-checked={practice} className={practice ? "seg__on" : ""} onClick={() => setPractice(true)}>
              Practice
            </button>
            <button role="radio" aria-checked={!practice} className={!practice ? "seg__on" : ""} onClick={() => setPractice(false)}>
              Read
            </button>
          </div>
          <Timer key={problem.id} />
          <div className="spacer" />
          <a className={`btn btn--ghost ${prev ? "" : "is-disabled"}`} href={prev ? href("postgres", "p", prev.id) : undefined} title="Alt + ←">
            ← {prev?.id ?? ""}
          </a>
          <a className={`btn btn--ghost ${next ? "" : "is-disabled"}`} href={next ? href("postgres", "p", next.id) : undefined} title="Alt + →">
            {next?.id ?? ""} →
          </a>
        </div>
      </div>

      <div className="problem__body">
        <article className="reader">
          <section className="card">
            <h2 className="label">Problem</h2>
            <Markdown source={problem.statement} />
          </section>

          <section className="card">
            <h2 className="label">Example</h2>
            <Markdown source={problem.example} />
          </section>

          <Reveal key={`t-${practice}`} title="What it's really testing" open={!practice}>
            <Markdown source={problem.testing} />
          </Reveal>
          <Reveal key={`r-${practice}`} title="How to relate (signal words)" open={!practice}>
            <Markdown source={problem.relate} />
          </Reveal>

          <section className="card">
            <div className="card__head">
              <h2 className="label">Hint ladder</h2>
              <span className="muted">
                {hintsShown}/{problem.hints.length}
              </span>
            </div>
            <ol className="ladder">
              {problem.hints.slice(0, hintsShown).map((h, i) => (
                <li key={i}>
                  <Markdown source={h} />
                </li>
              ))}
            </ol>
            {hintsShown < problem.hints.length && (
              <button className="btn" onClick={showHint}>
                {hintsShown === 0 ? "Show the first hint" : `Show hint ${hintsShown + 1}`}
              </button>
            )}
          </section>

          {problem.notes && (
            <Reveal key={`n-${practice}`} title="Extra notes and talking points" open={!practice}>
              <Markdown source={problem.notes} />
            </Reveal>
          )}

          <section className="card card--solution">
            <div className="card__head">
              <h2 className="label">Solution</h2>
              {solutionOpen && problem.solutionSql[0] && (
                <button className="btn btn--ghost" onClick={() => setInjected({ sql: problem.solutionSql.join("\n\n"), n: Date.now() })}>
                  Load into editor
                </button>
              )}
            </div>
            {solutionOpen ? (
              <Markdown source={problem.solutionMd} />
            ) : (
              <div className="locked">
                <p className="muted">Try it first. Stuck? Climb the hint ladder before you open this.</p>
                <button className="btn" onClick={openSolution}>
                  Reveal solution
                </button>
              </div>
            )}
          </section>
        </article>

        <aside className="workbench">
          <Workbench problem={problem} injected={injected} onSolved={onSolved} />
        </aside>
      </div>
    </div>
  );
}

function Reveal({ title, open, children }: { title: string; open: boolean; children: React.ReactNode }) {
  return (
    <details className="card reveal" open={open}>
      <summary>
        <span className="label">{title}</span>
      </summary>
      <div className="reveal__body">{children}</div>
    </details>
  );
}
