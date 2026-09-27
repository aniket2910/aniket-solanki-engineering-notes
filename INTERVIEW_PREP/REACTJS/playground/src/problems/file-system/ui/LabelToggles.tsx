import { getLabelIds } from "../core/labels";
import type { NodeId } from "../core/types";
import { useExplorer, useSelector } from "../store/explorerContext";

/** Toggle labels on the selected item. Writes only the labels slice — the tree is untouched. */
export default function LabelToggles({ nodeId }: { nodeId: NodeId }) {
  const { fs } = useExplorer();
  const labels = useSelector(fs, (s) => s.labels.labels);
  const applied = useSelector(fs, (s) => getLabelIds(s.labels, nodeId));

  return (
    <div className="fs-form">
      <span className="fs-form__label">Labels</span>
      <div className="fs-form__row">
        {Object.values(labels).map((label) => {
          const isOn = applied.includes(label.id);
          return (
            <button
              key={label.id}
              aria-pressed={isOn}
              className={`fs-chip fs-chip--${label.tone} ${isOn ? "" : "fs-chip--off"}`}
              onClick={() => fs.toggleLabel(nodeId, label.id)}
            >
              {label.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
