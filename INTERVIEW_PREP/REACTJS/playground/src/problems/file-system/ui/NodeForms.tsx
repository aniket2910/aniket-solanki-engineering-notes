import { useState, type FormEvent } from "react";
import type { FsNode } from "../core/types";
import { useExplorer } from "../store/explorerContext";
import { useResultMessage } from "./useResultMessage";

/**
 * Rename. Mounted with key={node.id} by the parent, so switching selection
 * remounts it with a fresh draft — the idiomatic way to "reset state on prop change".
 */
export function RenameForm({ node }: { node: FsNode }) {
  const { fs } = useExplorer();
  const [draft, setDraft] = useState(node.name);
  const { error, report } = useResultMessage();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    report(fs.rename(node.id, draft));
  };

  return (
    <form className="fs-form" onSubmit={submit}>
      <label className="fs-form__label" htmlFor="fs-rename">Rename</label>
      <div className="fs-form__row">
        <input id="fs-rename" className="fs-input" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <button className="fs-btn" type="submit">Save</button>
      </div>
      {error && <p className="fs-error" role="alert">{error}</p>}
    </form>
  );
}

/** Create a folder or a (placeholder) file inside the selected folder. */
export function CreateForm({ parentId }: { parentId: string }) {
  const { fs, selection } = useExplorer();
  const [name, setName] = useState("");
  const { error, report } = useResultMessage();

  const create = (kind: "folder" | "file") => {
    const result = fs.create(
      kind === "folder"
        ? { kind, parentId, name }
        : { kind, parentId, name, mimeType: "text/plain", sizeBytes: 0 },
    );
    if (report(result)) {
      setName("");
      selection.setState(result.value.id);
    }
  };

  const submitAsFolder = (e: FormEvent) => {
    e.preventDefault(); // Enter key creates a folder
    create("folder");
  };

  return (
    <form className="fs-form" onSubmit={submitAsFolder}>
      <label className="fs-form__label" htmlFor="fs-create">New item here</label>
      <div className="fs-form__row">
        <input
          id="fs-create"
          className="fs-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="fs-btn" type="submit">+ Folder</button>
        <button className="fs-btn" type="button" onClick={() => create("file")}>+ File</button>
      </div>
      {error && <p className="fs-error" role="alert">{error}</p>}
    </form>
  );
}
