import { useState } from "react";
import { createSeedState } from "./core/seed";
import type { OpContext } from "./core/tree-ops";
import { createStore } from "./store/createStore";
import { ExplorerProvider, type Explorer } from "./store/explorerContext";
import { createFileSystemStore } from "./store/fileSystemStore";
import DetailsPanel from "./ui/DetailsPanel";
import FileTree from "./ui/FileTree";
import SearchPanel from "./ui/SearchPanel";
import "./file-system.css";

// Real side effects live at the edge; the core only sees this injected context.
const liveContext: OpContext = {
  userId: "user_demo",
  now: () => Date.now(),
  newId: () => crypto.randomUUID(),
};

function createExplorer(): Explorer {
  const fs = createFileSystemStore(createSeedState(liveContext), liveContext);
  return { fs, selection: createStore(fs.getState().tree.rootId) };
}

/**
 * Demo: search on top, tree on the left, details/commands on the right.
 * Stores are created ONCE (lazy useState initializer) so their identity is stable.
 */
export default function FileSystemDemo() {
  const [explorer] = useState(createExplorer);

  return (
    <ExplorerProvider value={explorer}>
      <div className="fs-demo">
        <SearchPanel />
        <div className="fs-layout">
          <FileTree />
          <DetailsPanel />
        </div>
      </div>
    </ExplorerProvider>
  );
}
