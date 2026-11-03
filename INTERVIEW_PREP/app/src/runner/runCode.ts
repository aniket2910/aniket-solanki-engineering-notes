import type { JudgeSpec, Test, TestResult } from "./judge.ts";

export type RunReply = { ok: true; results: TestResult[] } | { ok: false; error: string; timeout?: boolean };

/** One fresh worker per run: nothing leaks between runs, and a stuck run is simply killed. */
export function runInWorker(code: string, spec: JudgeSpec, tests: Test[], timeoutMs = 5000): Promise<RunReply> {
  const worker = new Worker(new URL("./runner.worker.ts", import.meta.url), { type: "module" });
  return new Promise((resolve) => {
    const finish = (reply: RunReply) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(reply);
    };
    const timer = setTimeout(
      () => finish({ ok: false, timeout: true, error: `Time limit exceeded (${timeoutMs / 1000}s). An infinite loop, or too slow for these inputs?` }),
      timeoutMs,
    );
    worker.onmessage = (e: MessageEvent<RunReply>) => finish(e.data);
    worker.onerror = (e) => finish({ ok: false, error: e.message || "The runner crashed." });
    worker.postMessage({ code, spec, tests });
  });
}
