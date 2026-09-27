import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import type { NodeId } from "../core/types";
import type { ReadableStore, Store } from "./createStore";
import type { FileSystemStore } from "./fileSystemStore";

/**
 * Context carries the STORES, not the state. The store objects never change
 * identity, so the Provider never re-renders its consumers; each component
 * subscribes to exactly the slice it reads via useSelector below.
 */
export interface Explorer {
  fs: FileSystemStore; // domain data (shared org content)
  selection: Store<NodeId>; // UI state (this viewer's selection) — kept separate on purpose
}

const ExplorerContext = createContext<Explorer | null>(null);

export function ExplorerProvider({ value, children }: { value: Explorer; children: ReactNode }) {
  return <ExplorerContext.Provider value={value}>{children}</ExplorerContext.Provider>;
}

export function useExplorer(): Explorer {
  const explorer = useContext(ExplorerContext);
  if (!explorer) throw new Error("useExplorer must be used inside <ExplorerProvider>");
  return explorer;
}

/**
 * Subscribe to a slice. React re-renders the caller only when the selected value
 * changes by Object.is — cheap because unchanged nodes keep their references.
 * The selector must return an existing reference (a node, a stored array),
 * never a freshly built array/object, or it would "change" on every read.
 */
export function useSelector<S, T>(store: ReadableStore<S>, selector: (state: S) => T): T {
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()));
}
