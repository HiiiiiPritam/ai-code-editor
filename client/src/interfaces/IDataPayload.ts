import { IFile } from "./IFile";
import { IFileExplorerNode } from "./IFileExplorerNode";

interface IDataPayload {
  fileExplorerData: IFileExplorerNode;
  activeFile: IFile;
  openFiles: IFile[];
  notifications?: Notification[];
  codeOutputData?: {
    status: string;
    output: string;
  }
}

export type { IDataPayload };
