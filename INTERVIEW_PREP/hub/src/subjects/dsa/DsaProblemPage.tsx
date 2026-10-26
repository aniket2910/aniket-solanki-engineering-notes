import { useCallback, useEffect, useMemo, useState } from "react";
import { Markdown } from "../../components/Markdown.tsx";
import { Timer } from "../../components/Timer.tsx";
import { usePersistentFlag } from "../../lib/progress.ts";
import { go, href } from "../../router.ts";
import { linksFrom, loadNote, problems, progress, sheet } from "./data.ts";
import { parseNote, solutionSource, type DsaNote } from "./parseNote.ts";
import type { SheetItem } from "./sheet.ts";
import { DsaWorkbench } from "./DsaWorkbench.tsx";
import { topicName } from "./DsaHome.tsx";

/**
 * One sheet problem = the note's reading pane (left) + a TypeScript workbench (right).
 *
 * Practice mode shows only the problem and its test cases. The rest of the note is a
 * help ladder you climb one rung at a time: what it's really asking, the real-life
 * analogy, the approach, then the dry run. The solution stays locked until you open it.
 */
export default function DsaProblemPage({ item }: { item: SheetItem }) {
  const [md, setMd] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  useEffect(() => {
    loadNote(item.note).then(setMd, (e) => setLoadError(String(e)));
  }, [item.note]);

  const note = useMemo(() => (md ? parseNote(md) : null), [md]);
  const resolve = useMemo(() => linksFrom(item.note), [item.note]);

  const index = problems.findIndex((p) => p.slug === item.slug);
  const prev = problems[index - 1];
  const next = problems[index + 1];
  const section = sheet.find((s) => s.items.some((i) => i.slug === item.slug))!;

  // Alt + ← / → moves between problems (plain arrows belong to the editor).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.key === "ArrowLeft" && prev) go("dsa", "p", prev.slug);
      if (e.key === "ArrowRight" && next) go("dsa", "p", next.slug);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <div className="problem">
      <div className="problem__top">
        <nav className="crumbs">
          <a href={href("dsa")}>Namaste DSA</a>
          <span>/</span>
          <span>
            {section.num}. {section.title}
          </span>
          <span>/</span>
          <a href={href("dsa", "topic", item.note.split("/")[0])}>{topicName(item.note.split("/")[0])} notes</a>
        </nav>
        <ProblemHeader item={item} note={note} />
        <div className="problem__tools">
          <ModeToggle />
          <Timer key={item.slug} />
          <a className="btn btn--ghost" href={item.link} target="_blank" rel="noreferrer">
            {item.link.includes("leetcode") ? "LeetCode" : "NamasteDev"} ↗
          </a>
          <div className="spacer" />
          <a className={`btn btn--ghost ${prev ? "" : "is-disabled"}`} href={prev ? href("dsa", "p", prev.slug) : undefined} title="Alt + ←">
            ← Prev
          </a>
          <a className={`btn btn--ghost ${next ? "" : "is-disabled"}`} href={next ? href("dsa", "p", next.slug) : undefined} title="Alt + →">
            Next →
          </a>
        </div>
      </div>

      {loadError && <div className="banner banner--bad">{loadError}</div>}
      {!note && !loadError && <p className="muted">Loading the note…</p>}
      {note && <ProblemBody item={item} note={note} resolve={resolve} />}
    </div>
  );
}

function ProblemHeader({ item, note }: { item: SheetItem; note: DsaNote | null }) {
  const [state, update] = progress.useProblemProgress(item.slug);
  return (
    <div className="problem__title">
      <h1>{item.title}</h1>
      <span className={`diff diff--${item.difficulty.toLowerCase()}`}>{item.difficulty}</span>
      {note?.mustSolve && <span className="chip chip--hot">🔥 Must solve</span>}
      <label className="check">
        <input type="checkbox" checked={!!state.solved} onChange={(e) => update({ solved: e.target.checked })} />
        Solved
      </label>
    </div>
  );
}

function ModeToggle() {
  const [practice, setPractice] = usePersistentFlag("dsa.practice", true);
  return (
    <div className="seg" role="radiogroup" aria-label="Mode">
      <button role="radio" aria-checked={practice} className={practice ? "seg__on" : ""} onClick={() => setPractice(true)}>
        Practice
      </button>
      <button role="radio" aria-checked={!practice} className={!practice ? "seg__on" : ""} onClick={() => setPractice(false)}>
        Read
      </button>
    </div>
  );
}

function ProblemBody({ item, note, resolve }: { item: SheetItem; note: DsaNote; resolve: ReturnType<typeof linksFrom> }) {
  const [practice] = usePersistentFlag("dsa.practice", true);
  const [state, update] = progress.useProblemProgress(item.slug);

  const ladder = [
    { label: "What is this problem actually asking?", md: note.asking },
    { label: "Real-life analogy", md: note.analogy },
    { label: "Approach: data structures & algorithms", md: note.approach },
    { label: "Step-by-step dry run", md: note.dryRun },
  ].filter((step) => step.md);

  const [shown, setShown] = useState(practice ? 0 : ladder.length);
  const [solutionOpen, setSolutionOpen] = useState(!practice);
  const [injected, setInjected] = useState<{ code: string; n: number } | null>(null);

  useEffect(() => {
    setShown(practice ? 0 : ladder.length);
    setSolutionOpen(!practice);
  }, [practice, ladder.length]);

  const tests = item.judge.tests ?? note.tests;
  const source = useMemo(() => solutionSource(note, item.judge.entry), [note, item.judge.entry]);

  const climb = () => {
    const n = Math.min(shown + 1, ladder.length);
    setShown(n);
    if (practice && n > (state.hintsUsed ?? 0)) update({ hintsUsed: n });
  };

  const openSolution = () => {
    setSolutionOpen(true);
    if (practice && !state.solved) update({ peeked: true });
  };

  const onSolved = useCallback(() => {
    if (!state.solved) update({ solved: true, solvedAt: new Date().toISOString() });
  }, [state.solved, update]);

  return (
    <div className="problem__body">
      <article className="reader">
        {note.meta && (
          <div className="note-meta">
            <Markdown source={note.meta} resolveLink={resolve} />
          </div>
        )}

        <section className="card">
          <h2 className="label">Problem</h2>
          <Markdown source={note.statement} resolveLink={resolve} />
        </section>

        <section className="card">
          <h2 className="label">Examples</h2>
          <Markdown source={note.testsMd} resolveLink={resolve} />
        </section>

        <section className="card">
          <div className="card__head">
            <h2 className="label">Help ladder</h2>
            <span className="muted">
              {shown}/{ladder.length}
            </span>
          </div>
          {ladder.slice(0, shown).map((step, i) => (
            <div key={step.label} className="rung">
              <h3 className="rung__title">
                <span className="rung__num">{i + 1}</span> {step.label}
              </h3>
              <Markdown source={step.md} resolveLink={resolve} />
            </div>
          ))}
          {shown < ladder.length && (
            <button className="btn" onClick={climb}>
              {shown === 0 ? `Show rung 1: ${ladder[0].label}` : `Next rung: ${ladder[shown].label}`}
            </button>
          )}
        </section>

        <section className="card card--solution">
          <div className="card__head">
            <h2 className="label">Solution</h2>
            {solutionOpen && (
              <button className="btn btn--ghost" onClick={() => setInjected({ code: source, n: Date.now() })}>
                Load into editor
              </button>
            )}
          </div>
          {solutionOpen ? (
            <>
              <Markdown source={note.codeMd} resolveLink={resolve} />
              <h3 className="rung__title">Complexity & edge cases</h3>
              <Markdown source={note.complexity} resolveLink={resolve} />
            </>
          ) : (
            <div className="locked">
              <p className="muted">Try it first. Stuck? Climb the help ladder before you open this.</p>
              <button className="btn" onClick={openSolution}>
                Reveal solution
              </button>
            </div>
          )}
        </section>
      </article>

      <aside className="workbench">
        <DsaWorkbench item={item} source={source} tests={tests} injected={injected} onSolved={onSolved} />
      </aside>
    </div>
  );
}
