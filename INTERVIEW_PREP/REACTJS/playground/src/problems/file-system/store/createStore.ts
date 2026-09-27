/**
 * A minimal external store — the same contract Redux and Zustand expose, and the
 * exact contract React's useSyncExternalStore consumes: read a snapshot,
 * subscribe to changes. Framework-agnostic; React is just one subscriber.
 */

export interface ReadableStore<T> {
  getState: () => T;
  subscribe: (listener: () => void) => () => void;
}

export interface Store<T> extends ReadableStore<T> {
  setState: (next: T) => void;
}

export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<() => void>();

  return {
    getState: () => state,
    setState(next) {
      if (Object.is(next, state)) return; // no-op writes notify nobody
      state = next;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
