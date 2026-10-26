import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { useColorScheme } from "../../components/useColorScheme.ts";
import { progress } from "./data.ts";
import type { JudgeSpec, Test, TestResult } from "./judge.ts";
import { starterFrom } from "./parseNote.ts";
import { runInWorker, type RunReply } from "./runCode.ts";
import type { SheetItem } from "./sheet.ts";

/**
 * The right-hand pane: TypeScript editor + test runner. Code runs in a Web Worker
 * against the note's test cases, with LeetCode's ListNode/TreeNode built for you.
 */
export function DsaWorkbench({
  item,
  source,
  tests,
  injected,
  onSolved,
}: {
  item: SheetItem;
  /** The note's solution: used to derive the starter signature, never shown here. */
  source: string;
  tests: Test[];
  injected: { code: string; n: number } | null;
  onSolved: () => void;
}) {
  const scheme = useColorScheme();
  const starter = useMemo(() => helpersComment(item.judge) + starterFrom(source, item.judge.entry), [item.judge, source]);
  const [code, setCode] = useState(() => progress.loadDraft(item.slug) ?? starter);
  const [reply, setReply] = useState<RunReply | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (injected) setCode(injected.code);
  }, [injected]);

  useEffect(() => {
    const id = setTimeout(() => progress.saveDraft(item.slug, code), 300);
    return () => clearTimeout(id);
  }, [item.slug, code]);

  const run = useCallback(async () => {
    if (running) return;
    setRunning(true);
    try {
      const r = await runInWorker(code, item.judge, tests);
      setReply(r);
      if (r.ok && r.results.length && r.results.every((t) => t.pass)) onSolved();
    } finally {
      setRunning(false);
    }
  }, [code, item.judge, tests, running, onSolved]);

  // CodeMirror keeps the first keymap it gets, so route ⌘↵ through a ref to the latest run().
  const runRef = useRef(run);
  runRef.current = run;
  const extensions = useMemo(
    () => [
      javascript({ typescript: true }),
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
    ],
    [],
  );

  return (
    <div className="bench">
      <div className="bench__bar">
        <span className="chip mono">TypeScript</span>
        <span className="muted bench__hint">⌘/Ctrl + Enter to run</span>
        <div className="spacer" />
        <button
          className="btn btn--ghost"
          onClick={() => confirm("Replace the editor with the empty starter?") && setCode(starter)}
          title="Replace the editor with the starter signature"
        >
          Reset
        </button>
        <button className="btn btn--primary" onClick={run} disabled={running}>
          {running ? "Running…" : `Run ${tests.length} test${tests.length === 1 ? "" : "s"} ▸`}
        </button>
      </div>

      <div className="editor">
        <CodeMirror
          value={code}
          onChange={setCode}
          theme={scheme}
          extensions={extensions}
          basicSetup={{ foldGutter: false, highlightActiveLineGutter: true, tabSize: 4 }}
          minHeight="260px"
          maxHeight="50vh"
        />
      </div>

      <div className="tabpanel">
        <Results reply={reply} tests={tests} />
      </div>
    </div>
  );
}

function Results({ reply, tests }: { reply: RunReply | null; tests: Test[] }) {
  if (!reply) {
    return (
      <p className="muted pad">
        {tests.length} test case{tests.length === 1 ? "" : "s"} from the note will run against your code. Order matters
        only where the problem says so.
      </p>
    );
  }
  if (!reply.ok) return <div className="banner banner--bad pre">{reply.error}</div>;

  const passed = reply.results.filter((r) => r.pass).length;
  const all = passed === reply.results.length;
  return (
    <div className="stack">
      <div className={`banner ${all ? "banner--good" : "banner--bad"}`}>
        {all ? `✓ Accepted: all ${passed} tests pass.` : `✗ ${passed}/${reply.results.length} tests pass.`}
      </div>
      {reply.results.map((r) => (
        <CaseCard key={r.label} result={r} />
      ))}
    </div>
  );
}

function CaseCard({ result }: { result: TestResult }) {
  return (
    <div className={`stmt ${result.pass ? "" : "stmt--err"}`}>
      <div className="stmt__head">
        <span>
          <span className={`dot ${result.pass ? "dot--good" : "dot--bad"}`} /> {result.label}
        </span>
        <span className="muted">{result.ms} ms</span>
      </div>
      <dl className="case">
        <dt>Input</dt>
        <dd className="mono">{result.input}</dd>
        <dt>Expected</dt>
        <dd className="mono">{result.expected}</dd>
        <dt>Got</dt>
        <dd className={`mono ${result.pass ? "" : "bad"}`}>{result.error ?? result.got}</dd>
        {result.logs.length > 0 && (
          <>
            <dt>Console</dt>
            <dd>
              <pre className="logs">{result.logs.join("\n")}</pre>
            </dd>
          </>
        )}
      </dl>
    </div>
  );
}

/** A comment at the top of the starter naming the LeetCode helpers this problem uses. */
function helpersComment(spec: JudgeSpec): string {
  const uses = (kind: string) => spec.args?.includes(kind as never) || spec.returns === kind;
  const lines: string[] = [];
  if (uses("list") || spec.prepare === "cycleList" || spec.prepare === "intersection") {
    lines.push("// ListNode { val, next } is provided, as on LeetCode.");
  }
  if (uses("tree") || spec.prepare === "treeNodes" || spec.returns === "nextPointers") {
    lines.push("// TreeNode { val, left, right } is provided (plus `next` for the next-pointer problem).");
  }
  if (uses("graph")) lines.push("// _Node { val, neighbors } is provided.");
  if (spec.prepare === "guessGame") lines.push("// guess(num) is provided: -1 if num is too high, 1 if too low, 0 if correct.");
  if (spec.prepare === "badVersion") lines.push("// isBadVersion(version) is provided.");
  return lines.length ? lines.join("\n") + "\n\n" : "";
}
