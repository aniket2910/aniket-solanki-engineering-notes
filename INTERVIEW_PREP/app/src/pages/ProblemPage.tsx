import { useCallback, useEffect, useMemo, useState } from "react";
import { allItems, findItem, notes, pageId } from "../content/dsa/index.ts";
import type { ProblemNote } from "../content/types.ts";
import type { TestResult } from "../runner/judge.ts";
import { runInWorker, type RunReply } from "../runner/runCode.ts";
import { CodeEditor } from "../components/CodeEditor.tsx";
import { Markdown } from "../components/Markdown.tsx";
import { RateBar } from "../components/RateBar.tsx";
import { Bullets, Difficulty, Keywords, Locked, RevealQA, Section } from "../components/bits.tsx";
import { clearDraft, logActivity, logRead, markPeeked, markSolved, saveDraft, useProgress } from "../lib/progress.ts";
import { useMode } from "../lib/mode.ts";
import { href } from "../lib/router.ts";

export function ProblemPage({ slug }: { slug: string }) {
  const item = findItem(slug);
  const note = notes[slug];
  if (!item) return <p className="page">No problem called “{slug}”.</p>;
  if (!note)
    return (
      <div className="page narrow">
        <a className="back" href={href("dsa")}>← DSA</a>
        <h1>{item.title}</h1>
        <p className="muted">
          Revision notes for this problem are coming. Practise it on{" "}
          <a href={item.link} target="_blank" rel="noreferrer">
            {item.link.includes("leetcode") ? "LeetCode" : "NamasteDev"}
          </a>{" "}
          for now.
        </p>
      </div>
    );
  // Remount per problem so hints, reveals and the editor reset when you move on.
  return <Problem key={slug} note={note} />;
}

function Problem({ note }: { note: ProblemNote }) {
  const item = findItem(note.slug)!;
  const id = pageId.problem(note.slug);
  const mode = useMode();
  const progress = useProgress();
  const [revealed, setRevealed] = useState(false);
  const [hints, setHints] = useState(0);
  const [predicted, setPredicted] = useState<Set<number>>(new Set());
  const open = mode === "revise" || revealed;

  const reveal = () => {
    setRevealed(true);
    markPeeked(id);
  };

  const index = allItems.findIndex((i) => i.slug === note.slug);
  const prev = allItems[index - 1];
  const next = allItems[index + 1];
  const final = note.approaches[note.approaches.length - 1];

  useEffect(() => {
    logRead(id);
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="problem">
      <article className="problem-notes">
        <a className="back" href={href("dsa")}>← {item.section.title}</a>
        <header className="problem-head">
          <div className="problem-meta">
            <span className="muted">
              {item.section.title} · #{item.section.items.findIndex((i) => i.slug === note.slug) + 1}
            </span>
            <Difficulty level={item.difficulty} />
            {progress.items[id]?.solved && <span className="pill pill-good">Solved</span>}
          </div>
          <h1>{item.title}</h1>
          <p className="gist">
            <Markdown text={note.gist} inline />
          </p>
          <div className="tags">
            <span className="tag tag-pattern">{note.pattern}</span>
            {note.topics.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          <div className="problem-links">
            <a className="btn" href={item.link} target="_blank" rel="noreferrer">
              Open on {item.link.includes("leetcode") ? "LeetCode" : "NamasteDev"} ↗
            </a>
            <span className="companies">
              {note.companies.length ? (
                <>
                  <span className="muted">Reported at</span> {note.companies.join(" · ")}
                </>
              ) : (
                <span className="muted">Common as a warm-up / screening question</span>
              )}
            </span>
          </div>
        </header>

        <Section title="The problem" kicker="1 · Understand">
          <Markdown text={note.statement} />
          {note.constraints.length > 0 && (
            <>
              <h4>Constraints</h4>
              <Bullets items={note.constraints} className="constraints" />
            </>
          )}
          <h4>Examples</h4>
          <div className="examples">
            {note.examples.map((e, i) => (
              <div key={i} className="example">
                <div><span className="label">Input</span> <code>{e.input}</code></div>
                <div><span className="label">Output</span> <code>{e.output}</code></div>
                {e.explain && <div className="muted"><Markdown text={e.explain} inline /></div>}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Predict the output" kicker="2 · Test yourself">
          <p className="muted">Work out each answer in your head, then check. These are the cases interviewers use to catch bugs.</p>
          <div className="predict">
            {note.predict.map((p, i) => {
              const shown = predicted.has(i) || mode === "revise";
              return (
                <button
                  key={i}
                  className={`predict-card ${shown ? "is-open" : ""}`}
                  onClick={() => setPredicted((s) => new Set(s).add(i))}
                >
                  <code>{p.input}</code>
                  {shown ? (
                    <>
                      <span className="predict-out">→ <code>{p.output}</code></span>
                      <span className="muted"><Markdown text={p.why} inline /></span>
                    </>
                  ) : (
                    <span className="predict-out muted">Tap to check →</span>
                  )}
                </button>
              );
            })}
          </div>
          <h4>Edge cases to clarify before coding</h4>
          <Bullets items={note.edgeCases} />
        </Section>

        <Section title="Hints" kicker="3 · Stuck?">
          <ol className="hints">
            {note.hints.map((h, i) =>
              i < hints || mode === "revise" ? (
                <li key={i} className="hint">
                  <span className="hint-n">Hint {i + 1}</span>
                  <Markdown text={h} inline />
                </li>
              ) : i === hints ? (
                <li key={i}>
                  <button className="btn" onClick={() => setHints(i + 1)}>Show hint {i + 1}</button>
                </li>
              ) : null,
            )}
          </ol>
        </Section>

        {!open ? (
          <Locked title="Solution, complexity and the interview answer are hidden" onReveal={reveal}>
            Try it in the editor first. Revealing marks this problem as “peeked”.
          </Locked>
        ) : (
          <>
            <Section title="Approaches" kicker="4 · Solution">
              {note.approaches.map((a, i) => (
                <div key={a.name} className={`approach ${i === note.approaches.length - 1 ? "is-best" : ""}`}>
                  <div className="approach-head">
                    <h3>
                      <span className="muted">{i + 1}.</span> <Markdown text={a.name} inline />
                    </h3>
                    {i === note.approaches.length - 1 && <span className="pill pill-good">Optimal</span>}
                  </div>
                  <Markdown text={a.idea} />
                  <div className="cx">
                    <div><span className="label">Time</span> <strong>{a.complexity.time}</strong></div>
                    <div><span className="label">Space</span> <strong>{a.complexity.space}</strong></div>
                    <div className="cx-why"><Markdown text={a.complexity.why} inline /></div>
                  </div>
                  <CodeEditor value={a.code} readOnly minHeight="0" />
                </div>
              ))}
            </Section>

            <Section title="Why the complexity matters here" kicker="5 · Complexity">
              <Markdown text={note.complexityTalk} />
            </Section>

            <Section title="Say it in the interview" kicker="6 · Interview">
              <h4>The 60-second answer</h4>
              <div className="script">
                <Markdown text={note.interview.script} />
              </div>
              <h4>Keywords the interviewer listens for</h4>
              <Keywords items={note.interview.keywords} />
              <h4>Bonus points</h4>
              <Bullets items={note.interview.bonus} className="bonus" />
              <h4>Common mistakes</h4>
              <Bullets items={note.interview.mistakes} className="mistakes" />
              <h4>Follow-up questions</h4>
              {note.interview.followUps.map((f) => (
                <RevealQA key={f.q} item={f} />
              ))}
            </Section>
          </>
        )}

        <RateBar id={id} />

        <nav className="pager">
          {prev ? <a href={href("dsa", prev.slug)}>← {prev.title}</a> : <span />}
          {next ? <a href={href("dsa", next.slug)}>{next.title} →</a> : <span />}
        </nav>
      </article>

      <Workbench note={note} id={id} answer={final.code} revealed={open} onReveal={reveal} />
    </div>
  );
}

function Workbench({ note, id, answer, revealed, onReveal }: { note: ProblemNote; id: string; answer: string; revealed: boolean; onReveal: () => void }) {
  const item = findItem(note.slug)!;
  const draft = useProgress().drafts[id];
  const [code, setCode] = useState(draft ?? note.starter);
  const [tab, setTab] = useState<"mine" | "answer">("mine");
  const [running, setRunning] = useState(false);
  const [reply, setReply] = useState<RunReply | null>(null);
  const tests = useMemo(() => note.tests ?? item.judge.tests ?? [], [note, item]);

  const onChange = (v: string) => {
    setCode(v);
    saveDraft(id, v);
  };

  const run = useCallback(async () => {
    setRunning(true);
    setTab("mine");
    const r = await runInWorker(code, item.judge, tests);
    setReply(r);
    setRunning(false);
    logActivity("run");
    if (r.ok && r.results.every((t) => t.pass)) markSolved(id);
  }, [code, item, tests, id]);

  const passed = reply?.ok ? reply.results.filter((r) => r.pass).length : 0;

  return (
    <aside className="workbench">
      <div className="wb-tabs">
        <button className={tab === "mine" ? "is-active" : ""} onClick={() => setTab("mine")}>Your code</button>
        <button
          className={tab === "answer" ? "is-active" : ""}
          onClick={() => {
            if (!revealed) onReveal();
            setTab("answer");
          }}
        >
          {revealed ? "Answer" : "Reveal answer"}
        </button>
        <span className="wb-spacer" />
        <span className="muted wb-hint">TypeScript · ⌘/Ctrl + Enter to run</span>
      </div>

      {tab === "mine" ? (
        <CodeEditor value={code} onChange={onChange} onRun={run} />
      ) : (
        <CodeEditor value={answer} readOnly />
      )}

      <div className="wb-actions">
        <button className="btn btn-primary" onClick={run} disabled={running}>
          {running ? "Running…" : `Run ${tests.length} tests`}
        </button>
        {tab === "answer" ? (
          <button
            className="btn"
            onClick={() => {
              onChange(answer);
              setTab("mine");
            }}
          >
            Load answer into editor
          </button>
        ) : (
          <button
            className="btn btn-ghost"
            onClick={() => {
              setCode(note.starter);
              clearDraft(id);
              setReply(null);
            }}
          >
            Reset
          </button>
        )}
        {reply?.ok && (
          <span className={`wb-score ${passed === reply.results.length ? "is-pass" : "is-fail"}`}>
            {passed}/{reply.results.length} passed
          </span>
        )}
      </div>

      {reply && !reply.ok && <pre className="wb-error">{reply.error}</pre>}
      {reply?.ok && (
        <div className="results">
          {reply.results.map((r) => (
            <Result key={r.label} r={r} />
          ))}
        </div>
      )}
    </aside>
  );
}

function Result({ r }: { r: TestResult }) {
  return (
    <details className={`result ${r.pass ? "is-pass" : "is-fail"}`} open={!r.pass}>
      <summary>
        <span>{r.pass ? "✓" : "✗"}</span> {r.label}
        <span className="muted"> · {r.ms} ms</span>
      </summary>
      <div className="result-body">
        <div><span className="label">Input</span> <code>{r.input}</code></div>
        <div><span className="label">Expected</span> <code>{r.expected}</code></div>
        <div><span className="label">Got</span> <code>{r.error ?? r.got}</code></div>
        {r.logs.length > 0 && <pre className="logs">{r.logs.join("\n")}</pre>}
      </div>
    </details>
  );
}
