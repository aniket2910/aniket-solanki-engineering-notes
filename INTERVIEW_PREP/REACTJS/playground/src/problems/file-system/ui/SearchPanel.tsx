import { useDeferredValue, useMemo, useState } from "react";
import { searchNodes, type SearchQuery } from "../core/search";
import type { NodeKind } from "../core/types";
import { useExplorer, useSelector } from "../store/explorerContext";

/**
 * Search box + filters. The input updates instantly; the scan runs on a
 * DEFERRED copy of the query, so typing never waits for results (React 18).
 */
export default function SearchPanel() {
  const { fs, selection } = useExplorer();
  const state = useSelector(fs, (s) => s);
  const [query, setQuery] = useState<SearchQuery>({ text: "" });
  const deferredQuery = useDeferredValue(query);
  const hits = useMemo(() => searchNodes(state, deferredQuery), [state, deferredQuery]);

  const hasQuery = Boolean(query.text.trim() || query.kind || query.labelId);

  return (
    <section className="fs-search" aria-label="Search">
      <div className="fs-form__row">
        <input
          className="fs-input"
          type="search"
          placeholder="Search by name…"
          aria-label="Search by name"
          value={query.text}
          onChange={(e) => setQuery((q) => ({ ...q, text: e.target.value }))}
        />
        <select
          className="fs-input fs-input--narrow"
          aria-label="Type"
          value={query.kind ?? ""}
          onChange={(e) => setQuery((q) => ({ ...q, kind: (e.target.value || undefined) as NodeKind | undefined }))}
        >
          <option value="">Any type</option>
          <option value="folder">Folders</option>
          <option value="file">Files</option>
        </select>
        <select
          className="fs-input fs-input--narrow"
          aria-label="Label"
          value={query.labelId ?? ""}
          onChange={(e) => setQuery((q) => ({ ...q, labelId: e.target.value || undefined }))}
        >
          <option value="">Any label</option>
          {Object.values(state.labels.labels).map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      {hasQuery && (
        <ul className="fs-results">
          {hits.length === 0 && <li className="fs-hint">No matches.</li>}
          {hits.map(({ node, path }) => (
            <li key={node.id}>
              <button className="fs-result" onClick={() => selection.setState(node.id)}>
                <span aria-hidden="true">{node.kind === "folder" ? "📁" : "📄"}</span> {node.name}
                <span className="fs-result__path">{path}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
