// Practice mode hides the answer, complexity and interview script until you reveal them.
// Revise mode opens everything, for reading fast the night before.

import { useSyncExternalStore } from "react";

export type Mode = "practice" | "revise";
const KEY = "revise:mode";
const listeners = new Set<() => void>();

function read(): Mode {
  try {
    return localStorage.getItem(KEY) === "revise" ? "revise" : "practice";
  } catch {
    return "practice";
  }
}

let current: Mode = read();

export function setMode(m: Mode) {
  current = m;
  try {
    localStorage.setItem(KEY, m);
  } catch {
    // storage blocked: the choice lasts for this tab
  }
  listeners.forEach((l) => l());
}

export function useMode(): Mode {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
  );
}
