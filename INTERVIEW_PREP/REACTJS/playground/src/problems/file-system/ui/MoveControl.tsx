import { useMemo, useState } from "react";
import { formatPath, isInSubtree } from "../core/tree";
import type { FsNode } from "../core/types";
import { useExplorer, useSelector } from "../store/explorerContext";
import { useResultMessage } from "./useResultMessage";

/**
 * "Move to…". Offers only valid destinations (folders outside the node's own
 * subtree) — but the store still enforces the rule, because the UI is never the
 * only line of defense.
 */
export default function MoveControl({ node }: { node: FsNode }) {
  const { fs } = useExplorer();
  const tree = useSelector(fs, (s) => s.tree);
  const [targetId, setTargetId] = useState("");
  const { error, report } = useResultMessage();

  const destinations = useMemo(
    () =>
      Object.values(tree.nodes)
        .filter((n) => n.kind === "folder" && n.id !== node.parentId && !isInSubtree(tree, n.id, node.id))
        .map((n) => ({ id: n.id, label: formatPath(tree, n.id) }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [tree, node.id, node.parentId],
  );

  const move = () => {
    if (targetId && report(fs.move(node.id, targetId))) setTargetId("");
  };

  return (
    <div className="fs-form">
      <label className="fs-form__label" htmlFor="fs-move">Move to</label>
      <div className="fs-form__row">
        <select id="fs-move" className="fs-input" value={targetId} onChange={(e) => setTargetId(e.target.value)}>
          <option value="">Choose a folder…</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>{d.label}</option>
          ))}
        </select>
        <button className="fs-btn" onClick={move} disabled={!targetId}>Move</button>
      </div>
      {error && <p className="fs-error" role="alert">{error}</p>}
    </div>
  );
}
