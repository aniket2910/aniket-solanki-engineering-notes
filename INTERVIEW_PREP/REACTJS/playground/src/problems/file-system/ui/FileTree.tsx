import { useExplorer, useSelector } from "../store/explorerContext";
import TreeRow from "./TreeRow";

/** The tree is just the root row; recursion does the rest. */
export default function FileTree() {
  const { fs } = useExplorer();
  const rootId = useSelector(fs, (s) => s.tree.rootId);

  return (
    <ul role="tree" aria-label="Organization files" className="fs-tree">
      <TreeRow id={rootId} level={1} />
    </ul>
  );
}
