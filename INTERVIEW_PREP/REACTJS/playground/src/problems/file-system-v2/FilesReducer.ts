import { v4 as uuidv4 } from "uuid";
import { ACTION_TYPES } from "./ActionTypes";

export enum FileTypes {
  root = "root",
  file = "file",
  folder = "folder",
}

export interface FileNodeType {
  type: FileTypes;
  name: string;
  childNode: FileNodeType[] | [];
  root: boolean;
  id: string;
  parentId: string | null;
}
export interface ActionInterface {
  type: string;
}
export const initialNode: FileNodeType = {
  type: FileTypes.root,
  name: "root",
  childNode: [],
  root: true,
  id: uuidv4(),
  parentId: null,
};

let childNodes: FileNodeType[] = createChildren(4, initialNode.id);
initialNode.childNode = childNodes;

export const FileReducer = (
  state: FileNodeType = initialNode,
  action: ActionInterface,
) => {
  switch (action.type) {
    case ACTION_TYPES.CREATE_NODE: {
      return state;
    }
    case ACTION_TYPES.DELETE_NODE: {
      return state;
    }
  }
};

function createChildren(level: number, parentId: string): FileNodeType[] {
  // stop when no levels are left
  if (level === 0) {
    return [];
  }

  const folderId = uuidv4();

  const folder: FileNodeType = {
    type: FileTypes.folder,
    name: "folder-" + level,
    root: false,
    id: folderId,
    parentId: parentId,
    childNode: createChildren(level - 1, folderId), // go one level deeper
  };

  const file: FileNodeType = {
    type: FileTypes.file,
    name: "file-" + level + ".txt",
    root: false,
    id: uuidv4(),
    parentId: parentId,
    childNode: [],
  };

  return [folder, file];
}
