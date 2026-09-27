import { defineLabel, emptyLabels, toggleLabel } from "./labels";
import type { Result } from "./result";
import { createNode, createTree, type NewNodeInput, type OpContext } from "./tree-ops";
import type { FsState, NodeId, TreeState } from "./types";

/**
 * Demo data. Built THROUGH the public ops (not a hand-written JSON blob), so the
 * seed can never violate an invariant like sorted childIds or unique names.
 */

function unwrap<T>(result: Result<T>): T {
  if (!result.ok) throw new Error(`Seed data is invalid: ${result.error.message}`);
  return result.value;
}

type Spec = { name: string; children?: Spec[]; mimeType?: string; sizeBytes?: number };

const ORG_TREE: Spec[] = [
  {
    name: "Engineering",
    children: [
      { name: "Design Docs", children: [{ name: "Search v2.md", mimeType: "text/markdown", sizeBytes: 18_200 }] },
      { name: "Runbooks", children: [{ name: "On-call.md", mimeType: "text/markdown", sizeBytes: 9_400 }] },
      { name: "Architecture.pdf", mimeType: "application/pdf", sizeBytes: 2_400_000 },
    ],
  },
  {
    name: "Marketing",
    children: [
      { name: "Campaigns", children: [{ name: "Q3 launch plan.docx", mimeType: "application/msword", sizeBytes: 88_000 }] },
      { name: "Brand guidelines.pdf", mimeType: "application/pdf", sizeBytes: 5_100_000 },
    ],
  },
  { name: "HR", children: [{ name: "Handbook 2026.pdf", mimeType: "application/pdf", sizeBytes: 1_200_000 }] },
];

function addSpecs(tree: TreeState, parentId: NodeId, specs: Spec[], ctx: OpContext, byName: Map<string, NodeId>) {
  let next = tree;
  for (const spec of specs) {
    const input: NewNodeInput = spec.children
      ? { kind: "folder", parentId, name: spec.name }
      : { kind: "file", parentId, name: spec.name, mimeType: spec.mimeType ?? "", sizeBytes: spec.sizeBytes ?? 0 };
    const created = unwrap(createNode(next, input, ctx));
    byName.set(spec.name, created.node.id);
    next = spec.children ? addSpecs(created.tree, created.node.id, spec.children, ctx, byName) : created.tree;
  }
  return next;
}

export function createSeedState(ctx: OpContext): FsState {
  const byName = new Map<string, NodeId>();
  const root = createTree("org_acme", "Acme Corp", ctx);
  const tree = addSpecs(root, root.rootId, ORG_TREE, ctx, byName);

  let labels = defineLabel(emptyLabels, { id: "lbl_confidential", name: "Confidential", tone: "red" });
  labels = defineLabel(labels, { id: "lbl_draft", name: "Draft", tone: "amber" });
  labels = defineLabel(labels, { id: "lbl_approved", name: "Approved", tone: "green" });
  labels = toggleLabel(labels, byName.get("HR")!, "lbl_confidential");
  labels = toggleLabel(labels, byName.get("Search v2.md")!, "lbl_draft");
  labels = toggleLabel(labels, byName.get("Brand guidelines.pdf")!, "lbl_approved");

  return { tree, labels };
}
