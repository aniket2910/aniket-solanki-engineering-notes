// Per-browser progress for any problem set: solved state, hints used, and an editor
// draft per problem. It lives in localStorage, so it's a convenience, not a record: a
// private window starts empty, and every read/write is wrapped so a blocked storage
// never breaks a page.

import { useCallback, useSyncExternalStore } from "react";

export type ProblemProgress = { solved?: boolean; hintsUsed?: number; peeked?: boolean; solvedAt?: string };
type Store = Record<string, ProblemProgress>;
type Id = string | number;

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const notify = () => listeners.forEach((l) => l());

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked: it just won't persist */
  }
}

/** One store per problem set: "sql50" keeps its original keys (hub.sql50.*). */
export function createProgress(namespace: string) {
  const KEY = `hub.${namespace}.progress.v1`;
  const draftKey = (id: Id) => `hub.${namespace}.draft.${id}`;

  let cache: Store = (() => {
    try {
      return JSON.parse(safeGet(KEY) ?? "{}");
    } catch {
      return {};
    }
  })();

  function write(next: Store) {
    cache = next;
    safeSet(KEY, JSON.stringify(next));
    notify();
  }

  function useProgress(): Store {
    return useSyncExternalStore(subscribe, () => cache);
  }

  function useProblemProgress(id: Id) {
    const all = useProgress();
    const current = all[id] ?? {};
    const update = useCallback((patch: ProblemProgress) => write({ ...cache, [id]: { ...(cache[id] ?? {}), ...patch } }), [id]);
    return [current, update] as const;
  }

  return {
    useProgress,
    useProblemProgress,
    resetProgress: () => write({}),
    loadDraft: (id: Id) => safeGet(draftKey(id)),
    saveDraft: (id: Id, text: string) => safeSet(draftKey(id), text),
  };
}

export function usePersistentFlag(key: string, initial: boolean) {
  const storageKey = `hub.flag.${key}`;
  const get = () => {
    const v = safeGet(storageKey);
    return v === null ? initial : v === "1";
  };
  const value = useSyncExternalStore(subscribe, get);
  const set = (next: boolean) => {
    safeSet(storageKey, next ? "1" : "0");
    notify();
  };
  return [value, set] as const;
}
