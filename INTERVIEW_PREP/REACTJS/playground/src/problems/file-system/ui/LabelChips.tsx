import { getLabelIds } from "../core/labels";
import type { NodeId } from "../core/types";
import { useExplorer, useSelector } from "../store/explorerContext";

/** Read-only chips next to a row. Subscribes to ITS node's label list only. */
export default function LabelChips({ nodeId }: { nodeId: NodeId }) {
  const { fs } = useExplorer();
  const labelIds = useSelector(fs, (s) => getLabelIds(s.labels, nodeId));
  const labels = useSelector(fs, (s) => s.labels.labels);

  if (labelIds.length === 0) return null;
  return (
    <span className="fs-chips">
      {labelIds.map((id) => (
        <span key={id} className={`fs-chip fs-chip--${labels[id]?.tone ?? "blue"}`}>
          {labels[id]?.name ?? id}
        </span>
      ))}
    </span>
  );
}
