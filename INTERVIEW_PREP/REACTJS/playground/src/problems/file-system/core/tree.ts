import type { FolderNode, FsNode, NodeId, TreeState } from "./types";

/**
 * READ helpers. Pure functions over TreeState — no React, no mutation — so they
 * are trivially unit-testable and reusable by the store, the UI, and search.
 */

export const getNode = (tree: TreeState, id: NodeId): FsNode | undefined => tree.nodes[id];

export function getFolder(tree: TreeState, id: NodeId): FolderNode | undefined {
  const node = tree.nodes[id];
  return node?.kind === "folder" ? node : undefined;
}

// numeric: "file2" sorts before "file10"; sensitivity "base": "a" and "A" compare equal.
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

/** Explorer ordering: folders first, then natural A→Z by name. */
export function compareForDisplay(a: FsNode, b: FsNode): number {
  if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
  return collator.compare(a.name, b.name);
}

/** Root → node, by following parent pointers. O(depth), never scans the whole tree. */
export function getPath(tree: TreeState, id: NodeId): FsNode[] {
  const path: FsNode[] = [];
  let current: FsNode | undefined = tree.nodes[id];
  while (current) {
    path.push(current);
    current = current.parentId ? tree.nodes[current.parentId] : undefined;
  }
  return path.reverse();
}

export const formatPath = (tree: TreeState, id: NodeId): string =>
  getPath(tree, id)
    .map((node) => node.name)
    .join(" / ");

/** Is `nodeId` equal to, or somewhere below, `ancestorId`? Walks UP, so O(depth). */
export function isInSubtree(tree: TreeState, nodeId: NodeId, ancestorId: NodeId): boolean {
  let current: NodeId | null = nodeId;
  while (current) {
    if (current === ancestorId) return true;
    current = tree.nodes[current]?.parentId ?? null;
  }
  return false;
}

/**
 * Every id in the subtree rooted at `rootId` (inclusive). Iterative DFS with an
 * explicit stack, so a pathologically deep tree can't overflow the call stack.
 */
export function collectSubtree(tree: TreeState, rootId: NodeId): NodeId[] {
  const ids: NodeId[] = [];
  const stack: NodeId[] = [rootId];
  while (stack.length > 0) {
    const id = stack.pop()!;
    const node = tree.nodes[id];
    if (!node) continue;
    ids.push(id);
    if (node.kind === "folder") stack.push(...node.childIds);
  }
  return ids;
}
