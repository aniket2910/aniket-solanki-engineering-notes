import { getLabelIds } from "./labels";
import { compareForDisplay, formatPath } from "./tree";
import type { FsNode, FsState, LabelId, NodeKind } from "./types";

/**
 * SEARCH — a linear scan over the flat index. O(n) sounds bad, but n is "items
 * this client has loaded" (thousands), which scans in well under a frame.
 * The flat map is what makes this a simple loop instead of a recursive walk.
 */

export interface SearchQuery {
  text: string;
  kind?: NodeKind;
  labelId?: LabelId;
  limit?: number;
}

export interface SearchHit {
  node: FsNode;
  path: string;
}

/** A filter is just a predicate. A new filter (owner, modified-after…) = one more predicate. */
type Filter = (node: FsNode, state: FsState) => boolean;

function buildFilters({ kind, labelId }: SearchQuery): Filter[] {
  const filters: Filter[] = [];
  if (kind) filters.push((node) => node.kind === kind);
  if (labelId) filters.push((node, state) => getLabelIds(state.labels, node.id).includes(labelId));
  return filters;
}

/** Relevance: exact name > starts with > contains. 0 = no match. */
function scoreName(name: string, needle: string): number {
  const haystack = name.toLocaleLowerCase();
  if (haystack === needle) return 3;
  if (haystack.startsWith(needle)) return 2;
  return haystack.includes(needle) ? 1 : 0;
}

const DEFAULT_LIMIT = 50;

export function searchNodes(state: FsState, query: SearchQuery): SearchHit[] {
  const needle = query.text.trim().toLocaleLowerCase();
  const filters = buildFilters(query);
  if (!needle && filters.length === 0) return []; // empty query ≠ "everything"

  const scored: { node: FsNode; score: number }[] = [];
  for (const node of Object.values(state.tree.nodes)) {
    if (node.id === state.tree.rootId) continue;
    const score = needle ? scoreName(node.name, needle) : 1;
    if (score > 0 && filters.every((matches) => matches(node, state))) scored.push({ node, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || compareForDisplay(a.node, b.node))
    .slice(0, query.limit ?? DEFAULT_LIMIT)
    // Paths are built only for the hits we'll show — not for every match.
    .map(({ node }) => ({ node, path: formatPath(state.tree, node.id) }));
}
