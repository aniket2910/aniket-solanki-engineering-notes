/**
 * Domain types for the org-level file system.
 *
 * The shape is a NORMALIZED graph, not a nested tree: every node lives exactly
 * once in a flat `nodes` table keyed by id, and relationships are stored as ids
 * (`parentId`, `childIds`) — never as nested objects. It's the same idea as
 * normalizing tables in a database, and it's what makes lookups O(1) and
 * updates cheap for React.
 */

export type NodeId = string;
export type UserId = string;

interface BaseNode {
  readonly id: NodeId;
  readonly name: string;
  /** null only for the org root. The parent pointer makes "path to root" O(depth). */
  readonly parentId: NodeId | null;
  /** Audit trail only — the ORGANIZATION owns the node, not this user. */
  readonly createdBy: UserId;
  readonly createdAt: number;
  readonly updatedAt: number;
  /** Open-ended custom fields ("department", "retentionDays"…) — no schema change needed. */
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface FolderNode extends BaseNode {
  readonly kind: "folder";
  /** Kept in display order (folders first, then A→Z) on every write, so reads are free. */
  readonly childIds: readonly NodeId[];
}

export interface FileNode extends BaseNode {
  readonly kind: "file";
  readonly mimeType: string;
  readonly sizeBytes: number;
}

/** Discriminated union: switch on `kind` and TypeScript narrows to the right shape. */
export type FsNode = FolderNode | FileNode;
export type NodeKind = FsNode["kind"];

export interface TreeState {
  readonly orgId: string;
  readonly rootId: NodeId;
  readonly nodes: Readonly<Record<NodeId, FsNode>>;
}

// ── Extension slice: labels ──────────────────────────────────────────────────
// A feature added "later" lives in its OWN table keyed by NodeId, instead of
// adding fields to FsNode. Tagging a file never touches the node object, so the
// tree row doesn't re-render and the core tree code never changes (open/closed).

export type LabelId = string;
export type LabelTone = "red" | "amber" | "green" | "blue";

export interface Label {
  readonly id: LabelId;
  readonly name: string;
  readonly tone: LabelTone; // a design token, mapped to a CSS class — not a raw colour
}

export interface LabelState {
  readonly labels: Readonly<Record<LabelId, Label>>;
  readonly byNode: Readonly<Record<NodeId, readonly LabelId[]>>;
}

/** The whole client-side data layer: the core tree + one slice per feature. */
export interface FsState {
  readonly tree: TreeState;
  readonly labels: LabelState;
}
