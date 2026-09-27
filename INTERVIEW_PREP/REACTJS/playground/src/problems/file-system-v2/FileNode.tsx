import { useState } from "react";
import { FileNodeType } from "./FilesReducer";

interface FileNodeProps {
  file: FileNodeType;
}

export const FileNode = ({ file }: FileNodeProps) => {
  const [expand, setExpand] = useState<boolean>(false);
  return (
    <div className="fs-wrapper">
      <div className="fs-node">
        <div className="node-name">
          <button
            onClick={() => {
              setExpand(!expand);
            }}
          >
            {expand ? <span>&gt;</span> : <span>&darr;</span>}
          </button>
          <p>{file.name}</p>
        </div>
      </div>
      <div className="node-child">
        {file.childNode.length > 0 ? (
          expand ? (
            <ul>
              {file.childNode.map((item) => {
                return (
                  <>
                    <li>
                      <FileNode file={item} />
                    </li>
                  </>
                );
              })}
            </ul>
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
