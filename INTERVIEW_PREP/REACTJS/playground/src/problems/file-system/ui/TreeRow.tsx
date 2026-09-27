import { memo, useState } from "react";
import type { NodeId } from "../core/types";
import { useExplorer, useSelector } from "../store/explorerContext";
import LabelChips from "./LabelChips";

interface TreeRowProps {
  id: NodeId;
  level: number; // 1-based, for aria-level
}

/**
 * One row, recursive. It receives only an id and subscribes to its own node —
 * so renaming one file re-renders that row (and its parent's list), not the tree.
 * `expanded` is local UI state: it's about this viewer's screen, not the data.
 */
const TreeRow = memo(function TreeRow({ id, level }: TreeRowProps) {
  const { fs, selection } = useExplorer();
  const node = useSelector(fs, (s) => s.tree.nodes[id]);
  const isSelected = useSelector(selection, (selectedId) => selectedId === id); // boolean → only 2 rows re-render per click
  const [expanded, setExpanded] = useState(level <= 2);

  if (!node) return null; // deleted between parent render and ours

  const isFolder = node.kind === "folder";
  const hasChildren = isFolder && node.childIds.length > 0;

  return (
    <li
      role="treeitem"
      aria-level={level}
      aria-selected={isSelected}
      aria-expanded={hasChildren ? expanded : undefined}
    >
      <div className={isSelected ? "fs-row fs-row--selected" : "fs-row"}>
        <button
          className="fs-row__toggle"
          aria-label={expanded ? `Collapse ${node.name}` : `Expand ${node.name}`}
          disabled={!hasChildren}
          onClick={() => setExpanded((e) => !e)}
        >
          {hasChildren ? (expanded ? "▾" : "▸") : ""}
        </button>
        <button className="fs-row__name" onClick={() => selection.setState(id)}>
          <span aria-hidden="true">{isFolder ? "📁" : "📄"}</span> {node.name}
        </button>
        <LabelChips nodeId={id} />
      </div>

      {hasChildren && expanded && (
        <ul role="group" className="fs-tree__group">
          {node.childIds.map((childId) => (
            <TreeRow key={childId} id={childId} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
});

export default TreeRow;
