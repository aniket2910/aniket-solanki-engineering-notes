import type { Label, LabelId, LabelState, NodeId } from "./types";

/**
 * The labels FEATURE, as its own slice. It knows nothing about folders or
 * files — only NodeIds — so it was added without editing a line of tree code.
 * Permissions or comments would follow the exact same template.
 */

/** One shared empty array: selectors must return a STABLE reference, or React re-renders forever. */
const NO_LABELS: readonly LabelId[] = [];

export const emptyLabels: LabelState = { labels: {}, byNode: {} };

export function defineLabel(state: LabelState, label: Label): LabelState {
  return { ...state, labels: { ...state.labels, [label.id]: label } };
}

export const getLabelIds = (state: LabelState, nodeId: NodeId): readonly LabelId[] =>
  state.byNode[nodeId] ?? NO_LABELS;

export function toggleLabel(state: LabelState, nodeId: NodeId, labelId: LabelId): LabelState {
  const current = getLabelIds(state, nodeId);
  const next = current.includes(labelId) ? current.filter((id) => id !== labelId) : [...current, labelId];
  return { ...state, byNode: { ...state.byNode, [nodeId]: next } };
}

/** Called after a delete — like ON DELETE CASCADE for this feature's table. */
export function pruneLabels(state: LabelState, removedIds: readonly NodeId[]): LabelState {
  if (!removedIds.some((id) => id in state.byNode)) return state; // nothing to do → same reference
  const byNode = { ...state.byNode };
  for (const id of removedIds) delete byNode[id];
  return { ...state, byNode };
}
