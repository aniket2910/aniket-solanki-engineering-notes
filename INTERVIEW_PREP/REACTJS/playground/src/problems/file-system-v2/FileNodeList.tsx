import { useReducer } from "react";
import { FileNode } from "./FileNode";
import { FileReducer, initialNode } from "./FilesReducer";

export const FileNodeList = () => {
  const [fileNode] = useReducer(FileReducer, initialNode);
  return (
    <div className="file-node-list-wrapper">
      {fileNode && <FileNode file={fileNode} />}
    </div>
  );
};
