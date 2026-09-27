import { useMemo } from "react";
import { getPath } from "../core/tree";
import { useExplorer, useSelector } from "../store/explorerContext";
import LabelToggles from "./LabelToggles";
import MoveControl from "./MoveControl";
import { CreateForm, RenameForm } from "./NodeForms";

/** Right-hand panel: breadcrumbs + every command for the selected item. Composes small forms. */
export default function DetailsPanel() {
  const { fs, selection } = useExplorer();
  const selectedId = useSelector(selection, (id) => id);
  const tree = useSelector(fs, (s) => s.tree);
  const node = tree.nodes[selectedId];
  const path = useMemo(() => getPath(tree, selectedId), [tree, selectedId]);

  if (!node) return <p className="fs-hint">Select an item.</p>;

  const isRoot = node.parentId === null;
  const remove = () => {
    if (!window.confirm(`Delete "${node.name}" and everything inside it?`)) return;
    if (fs.remove(node.id).ok && node.parentId) selection.setState(node.parentId);
  };

  return (
    <section className="fs-details" aria-label="Item details">
      <nav className="fs-crumbs" aria-label="Breadcrumb">
        {path.map((crumb, i) => (
          <span key={crumb.id}>
            {i > 0 && <span className="fs-crumbs__sep" aria-hidden="true">/</span>}
            <button className="fs-crumbs__link" onClick={() => selection.setState(crumb.id)}>{crumb.name}</button>
          </span>
        ))}
      </nav>

      <p className="fs-hint">
        {node.kind === "folder" ? `Folder · ${node.childIds.length} items` : `${node.mimeType} · ${node.sizeBytes} bytes`}
        {" · "}updated {new Date(node.updatedAt).toLocaleTimeString()}
      </p>

      {node.kind === "folder" && <CreateForm parentId={node.id} />}
      {!isRoot && <RenameForm key={node.id} node={node} />}
      {!isRoot && <MoveControl key={`move-${node.id}`} node={node} />}
      <LabelToggles nodeId={node.id} />
      {!isRoot && (
        <button className="fs-btn fs-btn--danger" onClick={remove}>Delete</button>
      )}
    </section>
  );
}
