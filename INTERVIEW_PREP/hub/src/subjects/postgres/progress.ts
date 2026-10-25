// Per-browser progress: solved state, hints used, and your editor draft per problem.
// It lives in localStorage, so it's a convenience, not a record: a private window
// starts empty, and every read/write is wrapped so a blocked storage never breaks a page.

import { useCallback, useSyncExternalStore } from "react";

export type ProblemProgress = { solved?: boolean; hintsUsed?: number; peeked?: boolean; solvedAt?: string };
type Store = Record<string, ProblemProgress>;

const KEY = "hub.sql50.progress.v1";
const DRAFT = (id: number) => `hub.sql50.draft.${id}`;
const listeners = new Set<() => void>();

let cache: Store = read();

function read(): Store {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

function write(next: Store) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage blocked: progress just won't persist */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useProgress(): Store {
  return useSyncExternalStore(subscribe, () => cache);
}

export function useProblemProgress(id: number) {
  const all = useProgress();
  const current = all[id] ?? {};
  const update = useCallback(
    (patch: ProblemProgress) => write({ ...cache, [id]: { ...(cache[id] ?? {}), ...patch } }),
    [id],
  );
  return [current, update] as const;
}

export function resetProgress() {
  write({});
}

export function loadDraft(id: number): string | null {
  try {
    return localStorage.getItem(DRAFT(id));
  } catch {
    return null;
  }
}

export function saveDraft(id: number, sql: string) {
  try {
    localStorage.setItem(DRAFT(id), sql);
  } catch {
    /* ignore */
  }
}

export function usePersistentFlag(key: string, initial: boolean) {
  const storageKey = `hub.flag.${key}`;
  const get = () => {
    try {
      const v = localStorage.getItem(storageKey);
      return v === null ? initial : v === "1";
    } catch {
      return initial;
    }
  };
  const value = useSyncExternalStore(subscribe, get);
  const set = (next: boolean) => {
    try {
      localStorage.setItem(storageKey, next ? "1" : "0");
    } catch {
      /* ignore */
    }
    listeners.forEach((l) => l());
  };
  return [value, set] as const;
}
