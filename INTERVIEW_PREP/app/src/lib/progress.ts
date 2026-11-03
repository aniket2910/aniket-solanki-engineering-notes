// Your revision history, kept in this browser's localStorage.
//
// Two things are stored: a per-day activity count (the heatmap) and, per page, how well you
// knew it the last time you revised it. That rating schedules the next revision, a small
// spaced-repetition loop: "Shaky" comes back tomorrow, "Got it" in a few days, "Easy" much
// later, and each repeat success stretches the gap.

import { useSyncExternalStore } from "react";

export type Rating = "again" | "shaky" | "good" | "easy";

export type ItemProgress = {
  /** Times you rated it. */
  reviews: number;
  last: Rating | null;
  /** ISO day of the last rating. */
  lastDay: string | null;
  /** ISO day it is due again. */
  dueDay: string | null;
  /** Current gap in days. */
  interval: number;
  /** Passed every test in the editor at least once. */
  solved: boolean;
  /** Opened the answer before solving. */
  peeked: boolean;
};

export type ActivityKind = "review" | "solve" | "run" | "read";

export type DayLog = Partial<Record<ActivityKind, number>>;

type State = {
  version: 1;
  items: Record<string, ItemProgress>;
  days: Record<string, DayLog>;
  drafts: Record<string, string>;
};

const KEY = "revise:v1";
const empty = (): State => ({ version: 1, items: {}, days: {}, drafts: {} });

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as State;
    return parsed.version === 1 ? { ...empty(), ...parsed } : empty();
  } catch {
    return empty();
  }
}

let state = load();
const listeners = new Set<() => void>();

function commit(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private window or storage full: progress lives for this tab only.
  }
  listeners.forEach((l) => l());
}

export function useProgress(): State {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
  );
}

// ───────────────────────────── days ─────────────────────────────

export function today(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return today(new Date(y, m - 1, d + n));
}

export const dayTotal = (log: DayLog | undefined) =>
  log ? Object.values(log).reduce((a, b) => a + (b ?? 0), 0) : 0;

// ───────────────────────────── writes ─────────────────────────────

const blank = (): ItemProgress => ({
  reviews: 0,
  last: null,
  lastDay: null,
  dueDay: null,
  interval: 0,
  solved: false,
  peeked: false,
});

function bump(s: State, kind: ActivityKind): State["days"] {
  const d = today();
  const log = s.days[d] ?? {};
  return { ...s.days, [d]: { ...log, [kind]: (log[kind] ?? 0) + 1 } };
}

export function logActivity(kind: ActivityKind) {
  commit({ ...state, days: bump(state, kind) });
}

// Opening a page counts once per page per day, so re-renders and back-and-forth don't inflate the heatmap.
const readToday = new Set<string>();

export function logRead(id: string) {
  const key = `${today()}:${id}`;
  if (readToday.has(key)) return;
  readToday.add(key);
  logActivity("read");
}

/** Next gap in days after a rating. */
function nextInterval(prev: number, rating: Rating): number {
  switch (rating) {
    case "again":
      return 1;
    case "shaky":
      return Math.max(1, Math.round(prev * 0.5)) || 1;
    case "good":
      return prev < 3 ? 3 : Math.round(prev * 2);
    case "easy":
      return prev < 7 ? 7 : Math.round(prev * 3);
  }
}

export function rate(id: string, rating: Rating) {
  const cur = state.items[id] ?? blank();
  const interval = nextInterval(cur.interval, rating);
  const d = today();
  commit({
    ...state,
    items: {
      ...state.items,
      [id]: { ...cur, reviews: cur.reviews + 1, last: rating, lastDay: d, interval, dueDay: addDays(d, interval) },
    },
    days: bump(state, "review"),
  });
}

export function markSolved(id: string) {
  const cur = state.items[id] ?? blank();
  const first = !cur.solved;
  commit({
    ...state,
    items: { ...state.items, [id]: { ...cur, solved: true } },
    days: first ? bump(state, "solve") : state.days,
  });
}

export function markPeeked(id: string) {
  const cur = state.items[id] ?? blank();
  if (cur.peeked || cur.solved) return;
  commit({ ...state, items: { ...state.items, [id]: { ...cur, peeked: true } } });
}

export function saveDraft(id: string, code: string) {
  commit({ ...state, drafts: { ...state.drafts, [id]: code } });
}

export function clearDraft(id: string) {
  const { [id]: _, ...rest } = state.drafts;
  commit({ ...state, drafts: rest });
}

// ───────────────────────────── reads ─────────────────────────────

export function isDue(p: ItemProgress | undefined, on = today()): boolean {
  return !!p?.dueDay && p.dueDay <= on;
}

/** Consecutive active days ending today (or yesterday, so the streak survives until you study today). */
export function streaks(days: State["days"]): { current: number; longest: number; activeDays: number } {
  const active = Object.keys(days).filter((d) => dayTotal(days[d]) > 0).sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of active) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  const set = new Set(active);
  let cursor = set.has(today()) ? today() : addDays(today(), -1);
  let current = 0;
  while (set.has(cursor)) {
    current++;
    cursor = addDays(cursor, -1);
  }
  return { current, longest, activeDays: active.length };
}

// ───────────────────────────── backup ─────────────────────────────

export function exportProgress(): string {
  return JSON.stringify(state, null, 2);
}

export function importProgress(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as State;
    if (parsed.version !== 1 || typeof parsed.items !== "object") return false;
    commit({ ...empty(), ...parsed });
    return true;
  } catch {
    return false;
  }
}
