// Runs your code off the main thread. The page kills this worker if it doesn't answer
// in time, so an infinite loop costs a timeout message instead of a frozen tab.

import { loadEntry, runTests, type JudgeSpec, type Test } from "./judge.ts";
import { transpile } from "./transpile.ts";

export type RunRequest = { code: string; spec: JudgeSpec; tests: Test[] };

function capture(logs: string[]) {
  const original = { log: console.log, info: console.info, warn: console.warn, error: console.error };
  const sink =
    (prefix: string) =>
    (...args: unknown[]) => {
      if (logs.length < 200) logs.push(prefix + args.map(format).join(" "));
    };
  console.log = sink("");
  console.info = sink("");
  console.warn = sink("⚠ ");
  console.error = sink("✗ ");
  return () => Object.assign(console, original);
}

function format(v: unknown): string {
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v) ?? String(v);
  } catch {
    return String(v);
  }
}

self.onmessage = (event: MessageEvent<RunRequest>) => {
  const { code, spec, tests } = event.data;
  let js: string;
  try {
    js = transpile(code);
  } catch (error) {
    self.postMessage({ ok: false, error: `Syntax error: ${(error as Error).message}` });
    return;
  }
  try {
    const entry = loadEntry(js, spec.entry);
    self.postMessage({ ok: true, results: runTests(entry, spec, tests, capture) });
  } catch (error) {
    self.postMessage({ ok: false, error: error instanceof Error ? `${error.name}: ${error.message}` : String(error) });
  }
};
