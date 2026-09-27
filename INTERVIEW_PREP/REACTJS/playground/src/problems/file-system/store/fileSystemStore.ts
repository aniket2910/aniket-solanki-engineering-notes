import { pruneLabels, toggleLabel } from "../core/labels";
import { ok, type Result } from "../core/result";
import {
  createNode,
  deleteNode,
  moveNode,
  patchMetadata,
  renameNode,
  type NewNodeInput,
  type OpContext,
} from "../core/tree-ops";
import type { FsNode, FsState, LabelId, NodeId, TreeState } from "../core/types";
import { createStore, type ReadableStore } from "./createStore";

/**
 * The facade the UI talks to. It owns the ONE mutable variable (the current
 * snapshot) and exposes intent-named commands. Each command runs a pure op and
 * commits only on success — so a rejected op can never leave half-applied state.
 * Readers get getState/subscribe only; nobody outside can setState arbitrarily.
 */
export function createFileSystemStore(initial: FsState, ctx: OpContext) {
  const store = createStore(initial);
  const state = () => store.getState();

  function commitTree(result: Result<TreeState>): Result<void> {
    if (!result.ok) return result;
    store.setState({ ...state(), tree: result.value });
    return ok(undefined);
  }

  const readable: ReadableStore<FsState> = { getState: store.getState, subscribe: store.subscribe };

  return {
    ...readable,

    create(input: NewNodeInput): Result<FsNode> {
      const result = createNode(state().tree, input, ctx);
      if (!result.ok) return result;
      store.setState({ ...state(), tree: result.value.tree });
      return ok(result.value.node);
    },

    rename: (id: NodeId, name: string) => commitTree(renameNode(state().tree, id, name, ctx)),

    move: (id: NodeId, targetId: NodeId) => commitTree(moveNode(state().tree, id, targetId, ctx)),

    patchMetadata: (id: NodeId, patch: Record<string, unknown>) =>
      commitTree(patchMetadata(state().tree, id, patch, ctx)),

    remove(id: NodeId): Result<void> {
      const result = deleteNode(state().tree, id, ctx);
      if (!result.ok) return result;
      const { tree, removedIds } = result.value;
      // One atomic commit: the tree AND every feature slice change together.
      store.setState({ tree, labels: pruneLabels(state().labels, removedIds) });
      return ok(undefined);
    },

    toggleLabel(nodeId: NodeId, labelId: LabelId): void {
      store.setState({ ...state(), labels: toggleLabel(state().labels, nodeId, labelId) });
    },
  };
}

export type FileSystemStore = ReturnType<typeof createFileSystemStore>;
