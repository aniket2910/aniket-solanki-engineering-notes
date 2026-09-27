import { fail, ok, type Result } from "./result";
import { collectSubtree, compareForDisplay, getFolder, isInSubtree } from "./tree";
import type { FolderNode, FsNode, NodeId, TreeState, UserId } from "./types";

/**
 * WRITE operations. Each one is a pure function: (old state, input) → new state.
 * Nothing is mutated; only the touched nodes get new objects and every other
 * node keeps its old reference (structural sharing) — which is exactly what
 * React.memo / useSyncExternalStore compare to decide what to re-render.
 */

/** Side effects (clock, id generator, current user) are injected — Dependency Inversion keeps tests deterministic. */
export interface OpContext {
  userId: UserId;
  now: () => number;
  newId: () => NodeId;
}

type Metadata = Readonly<Record<string, unknown>>;

export type NewNodeInput =
  | { kind: "folder"; parentId: NodeId; name: string; metadata?: Metadata }
  | { kind: "file"; parentId: NodeId; name: string; mimeType: string; sizeBytes: number; metadata?: Metadata };

const MAX_NAME_LENGTH = 255; // the common filesystem limit (ext4, NTFS)
const FORBIDDEN_NAME_CHARS = /[/\\]/; // path separators would make paths ambiguous

// ── private helpers (DRY: every op shares the same validation + write path) ──

function validateName(raw: string): Result<string> {
  const name = raw.trim();
  if (!name) return fail("INVALID_NAME", "Name can't be empty.");
  if (name.length > MAX_NAME_LENGTH) return fail("INVALID_NAME", `Name must be ≤ ${MAX_NAME_LENGTH} characters.`);
  if (FORBIDDEN_NAME_CHARS.test(name)) return fail("INVALID_NAME", "Name can't contain / or \\.");
  return ok(name);
}

/** Explorer rule: sibling names are unique, case-insensitively. O(k) in the folder's size. */
function isNameTaken(tree: TreeState, parent: FolderNode, name: string, ignoreId?: NodeId): boolean {
  const wanted = name.toLocaleLowerCase();
  return parent.childIds.some((id) => id !== ignoreId && tree.nodes[id]?.name.toLocaleLowerCase() === wanted);
}

/** Put `node` into `childIds` at its display position. Sort-on-write so every render reads a ready list. */
function insertSorted(tree: TreeState, childIds: readonly NodeId[], node: FsNode): NodeId[] {
  const next = childIds.filter((id) => id !== node.id);
  const index = next.findIndex((id) => compareForDisplay(node, tree.nodes[id]) < 0);
  if (index === -1) next.push(node.id);
  else next.splice(index, 0, node.id);
  return next;
}

/** The ONE place that writes nodes: shallow-copy the index, swap in only what changed. */
function writeNodes(tree: TreeState, changed: readonly FsNode[]): TreeState {
  const nodes: Record<NodeId, FsNode> = { ...tree.nodes };
  for (const node of changed) nodes[node.id] = node;
  return { ...tree, nodes };
}

/** Rename / move / delete all need "an existing, non-root node and its parent". */
function requireNonRoot(tree: TreeState, id: NodeId): Result<{ node: FsNode; parent: FolderNode }> {
  const node = tree.nodes[id];
  if (!node) return fail("NOT_FOUND", "Item not found.");
  const parent = node.parentId ? getFolder(tree, node.parentId) : undefined;
  if (!parent) return fail("ROOT_IS_PROTECTED", "The organization root can't be changed.");
  return ok({ node, parent });
}

// ── public API ───────────────────────────────────────────────────────────────

export function createTree(orgId: string, rootName: string, ctx: OpContext): TreeState {
  const now = ctx.now();
  const root: FolderNode = {
    kind: "folder",
    id: ctx.newId(),
    name: rootName,
    parentId: null,
    childIds: [],
    createdBy: ctx.userId,
    createdAt: now,
    updatedAt: now,
    metadata: {},
  };
  return { orgId, rootId: root.id, nodes: { [root.id]: root } };
}

/** CREATE — O(k) for the sibling check + sorted insert; independent of total tree size. */
export function createNode(
  tree: TreeState,
  input: NewNodeInput,
  ctx: OpContext,
): Result<{ tree: TreeState; node: FsNode }> {
  const parent = getFolder(tree, input.parentId);
  if (!parent) return fail("NOT_A_FOLDER", "Items can only be created inside a folder.");
  const named = validateName(input.name);
  if (!named.ok) return named;
  if (isNameTaken(tree, parent, named.value)) return fail("NAME_TAKEN", `"${named.value}" already exists here.`);

  const now = ctx.now();
  const base = {
    id: ctx.newId(),
    name: named.value,
    parentId: parent.id,
    createdBy: ctx.userId,
    createdAt: now,
    updatedAt: now,
    metadata: input.metadata ?? {},
  };
  const node: FsNode =
    input.kind === "folder"
      ? { ...base, kind: "folder", childIds: [] }
      : { ...base, kind: "file", mimeType: input.mimeType, sizeBytes: input.sizeBytes };
  const nextParent: FolderNode = { ...parent, childIds: insertSorted(tree, parent.childIds, node), updatedAt: now };

  return ok({ tree: writeNodes(tree, [node, nextParent]), node });
}

/** UPDATE (rename) — only the node and its parent's ordering change; children are untouched. */
export function renameNode(tree: TreeState, id: NodeId, rawName: string, ctx: OpContext): Result<TreeState> {
  const found = requireNonRoot(tree, id);
  if (!found.ok) return found;
  const { node, parent } = found.value;
  const named = validateName(rawName);
  if (!named.ok) return named;
  if (named.value === node.name) return ok(tree); // no-op returns the SAME reference → zero re-renders
  if (isNameTaken(tree, parent, named.value, id)) return fail("NAME_TAKEN", `"${named.value}" already exists here.`);

  const renamed: FsNode = { ...node, name: named.value, updatedAt: ctx.now() };
  const nextParent: FolderNode = { ...parent, childIds: insertSorted(tree, parent.childIds, renamed) };
  return ok(writeNodes(tree, [renamed, nextParent]));
}

/**
 * UPDATE (move) — re-point one parentId and fix two childIds lists. Descendants
 * are NOT touched: they reference their parent by id, not by path, so moving a
 * folder with 10,000 files inside costs the same as moving an empty one.
 */
export function moveNode(tree: TreeState, id: NodeId, targetId: NodeId, ctx: OpContext): Result<TreeState> {
  const found = requireNonRoot(tree, id);
  if (!found.ok) return found;
  const { node, parent } = found.value;
  const target = getFolder(tree, targetId);
  if (!target) return fail("NOT_A_FOLDER", "Items can only be moved into a folder.");
  if (target.id === parent.id) return ok(tree);
  // Moving a folder into itself/its own descendant would detach a cycle from the root.
  if (isInSubtree(tree, target.id, node.id)) return fail("CYCLE", "Can't move a folder into itself or its subfolder.");
  if (isNameTaken(tree, target, node.name)) return fail("NAME_TAKEN", `"${node.name}" already exists there.`);

  const now = ctx.now();
  const moved: FsNode = { ...node, parentId: target.id, updatedAt: now };
  const oldParent: FolderNode = { ...parent, childIds: parent.childIds.filter((c) => c !== id), updatedAt: now };
  const newParent: FolderNode = { ...target, childIds: insertSorted(tree, target.childIds, moved), updatedAt: now };
  return ok(writeNodes(tree, [moved, oldParent, newParent]));
}

/** UPDATE (metadata) — shallow-merge custom fields; the extensibility escape hatch. */
export function patchMetadata(tree: TreeState, id: NodeId, patch: Metadata, ctx: OpContext): Result<TreeState> {
  const node = tree.nodes[id];
  if (!node) return fail("NOT_FOUND", "Item not found.");
  const next: FsNode = { ...node, metadata: { ...node.metadata, ...patch }, updatedAt: ctx.now() };
  return ok(writeNodes(tree, [next]));
}

/**
 * DELETE — O(size of subtree). Every descendant must leave the index too, or the
 * map would leak orphans that search would still find. `removedIds` is returned
 * so feature slices (labels, permissions…) can clean up their own tables.
 */
export function deleteNode(
  tree: TreeState,
  id: NodeId,
  ctx: OpContext,
): Result<{ tree: TreeState; removedIds: NodeId[] }> {
  const found = requireNonRoot(tree, id);
  if (!found.ok) return found;
  const { parent } = found.value;

  const removedIds = collectSubtree(tree, id);
  const nodes: Record<NodeId, FsNode> = { ...tree.nodes };
  for (const removedId of removedIds) delete nodes[removedId];
  nodes[parent.id] = { ...parent, childIds: parent.childIds.filter((c) => c !== id), updatedAt: ctx.now() };

  return ok({ tree: { ...tree, nodes }, removedIds });
}
