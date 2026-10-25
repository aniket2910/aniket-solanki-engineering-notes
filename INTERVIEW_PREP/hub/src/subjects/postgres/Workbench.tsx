import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { PostgreSQL, sql as sqlLang } from "@codemirror/lang-sql";
import { keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { useColorScheme } from "../../components/useColorScheme.ts";
import { useDb } from "./db.ts";
import { loadDraft, saveDraft } from "./progress.ts";
import { ResultGrid } from "./ResultGrid.tsx";
import { compareResults, describeSchema, runScript, type RunOutcome, type TableInfo, type Verdict } from "./runner.ts";
import type { Sql50Problem } from "./sql50/parse.ts";

type Tab = "result" | "tables" | "expected";

/**
 * The right-hand pane: write SQL, run it on the problem's schema, and get it graded
 * against the reference solution's output (the same check LeetCode does).
 */
export function Workbench({
  problem,
  injected,
  onSolved,
}: {
  problem: Sql50Problem;
  /** Bumped by "Load into editor" on the solution; `n` makes repeat loads re-apply. */
  injected: { sql: string; n: number } | null;
  onSolved: () => void;
}) {
  const { db, error: dbError } = useDb();
  const scheme = useColorScheme();
  const savedDraft = useMemo(() => loadDraft(problem.id), [problem.id]);
  const [sql, setSql] = useState(savedDraft ?? header(problem));
  const [tab, setTab] = useState<Tab>("tables");
  const [tables, setTables] = useState<TableInfo[] | null>(null);
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);
  const [expected, setExpected] = useState<RunOutcome | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [running, setRunning] = useState(false);

  // Once the database is up: list this schema's tables, and seed a starter query.
  useEffect(() => {
    if (!db) return;
    describeSchema(db, problem.schema).then((t) => {
      setTables(t);
      if (!savedDraft && t[0]) setSql(starter(problem, t));
    });
  }, [db, problem, savedDraft]);

  useEffect(() => {
    if (injected) setSql(injected.sql);
  }, [injected]);

  useEffect(() => {
    const id = setTimeout(() => saveDraft(problem.id, sql), 300);
    return () => clearTimeout(id);
  }, [problem.id, sql]);

  const getExpected = useCallback(async () => {
    if (expected || !db) return expected;
    const ref = await runScript(db, problem.schema, problem.solutionSql[0] ?? "", "first");
    setExpected(ref);
    return ref;
  }, [db, expected, problem]);

  const run = useCallback(async () => {
    if (!db || running) return;
    setRunning(true);
    try {
      const mine = await runScript(db, problem.schema, sql, "last");
      setOutcome(mine);
      setTab("result");
      const ref = await getExpected();
      if (mine.graded && !mine.error && ref?.graded) {
        const v = compareResults(mine.graded, ref.graded);
        setVerdict(v);
        if (v.kind !== "wrong") onSolved();
      } else {
        setVerdict(null);
      }
    } finally {
      setRunning(false);
    }
  }, [db, running, problem.schema, sql, getExpected, onSolved]);

  // CodeMirror keeps the first keymap it gets, so route ⌘↵ through a ref to the latest run().
  const runRef = useRef(run);
  runRef.current = run;
  const extensions = useMemo(() => {
    const schema = Object.fromEntries((tables ?? []).map((t) => [t.name, t.columns.map((c) => c.name)]));
    return [
      sqlLang({ dialect: PostgreSQL, schema, upperCaseKeywords: true }),
      Prec.highest(
        keymap.of([
          {
            key: "Mod-Enter",
            run: () => {
              runRef.current();
              return true;
            },
          },
        ]),
      ),
    ];
  }, [tables]);

  const showExpected = async () => {
    setTab("expected");
    await getExpected();
  };

  return (
    <div className="bench">
      <div className="bench__bar">
        <span className="chip mono" title="search_path is set to this schema for every run">
          {problem.schema}
        </span>
        <span className="muted bench__hint">⌘/Ctrl + Enter to run</span>
        <div className="spacer" />
        <button className="btn btn--ghost" onClick={() => tables && setSql(starter(problem, tables))} title="Replace the editor with the starter query">
          Reset
        </button>
        <button className="btn btn--primary" onClick={run} disabled={!db || running}>
          {!db ? "Starting Postgres…" : running ? "Running…" : "Run ▸"}
        </button>
      </div>

      <div className="editor">
        <CodeMirror
          value={sql}
          onChange={setSql}
          theme={scheme}
          extensions={extensions}
          basicSetup={{ foldGutter: false, highlightActiveLineGutter: true }}
          minHeight="220px"
          maxHeight="46vh"
        />
      </div>

      {dbError && <div className="banner banner--bad">Postgres failed to start: {dbError}</div>}

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === "result"} onClick={() => setTab("result")}>
          Result {verdict && <VerdictDot verdict={verdict} />}
        </button>
        <button role="tab" aria-selected={tab === "tables"} onClick={() => setTab("tables")}>
          Tables
        </button>
        <button role="tab" aria-selected={tab === "expected"} onClick={showExpected}>
          Expected output
        </button>
      </div>

      <div className="tabpanel">
        {tab === "result" && <ResultPanel outcome={outcome} verdict={verdict} />}
        {tab === "tables" && <TablesPanel tables={tables} />}
        {tab === "expected" && <ExpectedPanel expected={expected} />}
      </div>
    </div>
  );
}

function ResultPanel({ outcome, verdict }: { outcome: RunOutcome | null; verdict: Verdict | null }) {
  if (!outcome) return <p className="muted pad">Run your query to see its output here.</p>;
  return (
    <div className="stack">
      {verdict && <VerdictBanner verdict={verdict} />}
      {!verdict && !outcome.error && outcome.gradedFrom === "none" && (
        <div className="banner">Nothing to grade yet: the script didn't return any rows.</div>
      )}
      {outcome.statements.map((s, i) => (
        <div key={i} className={`stmt ${s.error ? "stmt--err" : ""}`}>
          <div className="stmt__head">
            <code className="stmt__sql">{firstLine(s.sql)}</code>
            <span className="muted">{s.ms.toFixed(1)} ms</span>
          </div>
          {s.error ? (
            <pre className="stmt__error">{s.error}</pre>
          ) : s.result ? (
            <ResultGrid result={s.result} />
          ) : (
            <p className="muted pad">{s.affectedRows !== undefined ? `OK, ${s.affectedRows} row(s) affected.` : "OK"}</p>
          )}
        </div>
      ))}
      {outcome.gradedFrom === "snapshot" && outcome.graded && (
        <div className="stmt">
          <div className="stmt__head">
            <span>Table contents after your script (this is what gets graded, then rolled back)</span>
          </div>
          <ResultGrid result={outcome.graded} />
        </div>
      )}
    </div>
  );
}

function VerdictBanner({ verdict }: { verdict: Verdict }) {
  if (verdict.kind === "exact") return <div className="banner banner--good">✓ Accepted: matches the expected output.</div>;
  if (verdict.kind === "unordered")
    return (
      <div className="banner banner--good">
        ✓ Accepted: same rows, in a different order. That's fine unless the problem asks for a sort order.
      </div>
    );
  return <div className="banner banner--bad">✗ Wrong answer. {verdict.reason}</div>;
}

function VerdictDot({ verdict }: { verdict: Verdict }) {
  return <span className={`dot ${verdict.kind === "wrong" ? "dot--bad" : "dot--good"}`} aria-label={verdict.kind} />;
}

function TablesPanel({ tables }: { tables: TableInfo[] | null }) {
  if (!tables) return <p className="muted pad">Loading the seed…</p>;
  return (
    <div className="stack">
      {tables.map((t) => (
        <div key={t.name} className="stmt">
          <div className="stmt__head">
            <strong className="mono">{t.name}</strong>
            <span className="muted mono">{t.columns.map((c) => `${c.name} ${shortType(c.type)}`).join(", ")}</span>
          </div>
          <ResultGrid result={t.data} />
        </div>
      ))}
      <p className="muted pad">
        These are LeetCode's example rows, plus a few extra edge rows where hidden tests usually catch people out.
      </p>
    </div>
  );
}

function ExpectedPanel({ expected }: { expected: RunOutcome | null }) {
  if (!expected) return <p className="muted pad">Computing…</p>;
  if (!expected.graded) return <p className="muted pad">The reference solution didn't produce a result.</p>;
  return (
    <div className="stack">
      <p className="muted pad">
        {expected.gradedFrom === "snapshot"
          ? "The table contents after the reference DELETE/UPDATE."
          : "The reference solution's output on this seed. Your script is graded on the LAST result it returns."}
      </p>
      <ResultGrid result={expected.graded} />
    </div>
  );
}

const header = (p: Sql50Problem) => `-- ${p.id} · ${p.title}\n`;

function starter(p: Sql50Problem, tables: TableInfo[]) {
  return `${header(p)}-- search_path is already ${p.schema}. Look at the data first, then replace this.\n\nSELECT * FROM ${tables[0].name};\n`;
}

const firstLine = (sql: string) => {
  const line = sql.split("\n").find((l) => l.trim() && !l.trim().startsWith("--")) ?? sql;
  return line.length > 90 ? line.slice(0, 90) + "…" : line;
};

const shortType = (t: string) =>
  ({ integer: "int", "character varying": "varchar", character: "char", "timestamp without time zone": "timestamp" })[t] ?? t;
