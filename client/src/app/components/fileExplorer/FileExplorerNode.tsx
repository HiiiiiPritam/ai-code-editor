import { IFileExplorerNode } from "@/interfaces/IFileExplorerNode";
import React, { Dispatch, SetStateAction, useState } from "react";
import FileIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ArrowIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import CreaterNewFileOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import { IFile } from "@/interfaces/IFile";
import { getLanguageByFileExtension } from "@/utils/getLanguageByExt";

interface FileExplorereNodeProps {
  fileExplorerNode: IFileExplorerNode;
  handleInsertNode: (id: string, name: string, isFolder: boolean) => void;
  handleDeleteNode: (nodeId: string, nodePath: string,isFolder: boolean) => void;
  handleRename: (nodeId: string, newName: string,isFolder: boolean) => void;
  handleMove: (sourceId: string, targetId: string,isFolder: boolean) => void;
  activeFile: IFile;
  setActiveFile: Dispatch<SetStateAction<IFile>>;
  files: IFile[];
  setFiles: Dispatch<SetStateAction<IFile[]>>;
  isFileExplorerUpdated: boolean;
  setIsFileExplorerUpdated: Dispatch<SetStateAction<boolean>>;
}

const FileExplorerNode = ({
  fileExplorerNode,
  handleInsertNode,
  handleDeleteNode,
  handleRename,
  handleMove,
  activeFile,
  setActiveFile,
  files,
  setFiles,
  isFileExplorerUpdated,
  setIsFileExplorerUpdated,
}: FileExplorereNodeProps) => {
  const [displayNodeControls, setDisplayNodeControls] = useState(false);
  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: false,
  });
  const [expand, setExpand] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(fileExplorerNode.name);

  const handleOpenFile = () => {
    const file = {
      name: fileExplorerNode.name,
      content: "",
      language: getLanguageByFileExtension(fileExplorerNode.name.split(".")[1]),
      path: fileExplorerNode.path,
    };
    setActiveFile(file);
    const existingFile = files.filter(
      (file) => file.path === fileExplorerNode.path
    );
    if (existingFile.length === 0) {
      setFiles((prev) => [...prev, file]);
    }
  };

  const handleNewFolder = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    isFolder: boolean
  ) => {
    e.stopPropagation();
    setExpand(true);
    setShowInput({
      visible: true,
      isFolder,
    });
  };

  const onDeleteNode = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    handleDeleteNode(fileExplorerNode.id, fileExplorerNode.path, fileExplorerNode.isFolder);
  };

  const startRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
    setNewName(fileExplorerNode.name);
  };

  const submitRename = () => {
    if (newName && newName !== fileExplorerNode.name) {
      handleRename(fileExplorerNode.id, newName, fileExplorerNode.isFolder);
      setIsFileExplorerUpdated(true);
    }
    setIsRenaming(false);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.dataTransfer.setData("nodeId", fileExplorerNode.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileExplorerNode.isFolder) {
      e.currentTarget.classList.add("bg-[#f9f5f526]");
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("bg-[#f9f5f526]");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("bg-[#f9f5f526]");
    if (fileExplorerNode.isFolder) {
      const sourceId = e.dataTransfer.getData("nodeId");
      if (sourceId !== fileExplorerNode.id) {
        handleMove(sourceId, fileExplorerNode.id, fileExplorerNode.isFolder);
        setIsFileExplorerUpdated(true);
      }
    }
  };

  const onAddFolderOrFile = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    if (e.code === "Enter" && value) {
      handleInsertNode(fileExplorerNode.id, value, showInput.isFolder);
      setShowInput({ ...showInput, visible: false });
      if (!isFileExplorerUpdated) {
        setIsFileExplorerUpdated(true);
      }
    }
  };

  if (fileExplorerNode.isFolder) {
    return (
      <div
        draggable={fileExplorerNode.path !== "/root"}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className="flex justify-between items-center cursor-pointer hover:border-l-2 hover:border-l-[#fec76f] hover:text-[#fec76f] py-1 px-2"
          onClick={() => setExpand(!expand)}
          onMouseOver={() => setDisplayNodeControls(true)}
          onMouseLeave={() => setDisplayNodeControls(false)}
        >
          <span className="truncate flex items-center gap-1">
            <ArrowIcon
              sx={{ fontSize: "14px" }}
              className={expand ? "rotate-90" : ""}
            />
            {isRenaming ? (
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={submitRename}
                onKeyDown={(e) => e.key === "Enter" && submitRename()}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#f9f5f526] text-[#fec76f] outline-none px-2"
              />
            ) : (
              fileExplorerNode.name
            )}
          </span>
          {displayNodeControls && (
            <div className="flex items-center gap-1">
              <CreateNewFolderOutlinedIcon
                onClick={(e) => handleNewFolder(e, true)}
              />
              <CreaterNewFileOutlinedIcon
                onClick={(e) => handleNewFolder(e, false)}
              />
              {fileExplorerNode.path !== "/root" && (
                <>
                  <EditIcon onClick={startRename} />
                  <DeleteOutlineOutlinedIcon onClick={(e) => onDeleteNode(e)} />
                </>
              )}
            </div>
          )}
        </div>
        <div style={{ display: expand ? "block" : "none", paddingLeft: 25 }}>
          {showInput.visible && (
            <div className="flex gap-2 items-center">
              <span>
                {showInput.isFolder ? (
                  <ArrowIcon sx={{ fontSize: '14px' }} />
                ) : (
                  <FileIcon sx={{ fontSize: '14px' }} />
                )}
              </span>
              <input
                autoFocus
                onKeyDown={onAddFolderOrFile}
                onBlur={() => setShowInput({ ...showInput, visible: false })}
                type="text"
                className="w-full text-[#fec76f] outline-none px-2 bg-[#f9f5f526]"
              />
            </div>
          )}
          {fileExplorerNode.nodes.map((node) => {
            return (
              <FileExplorerNode
                key={node.id}
                handleInsertNode={handleInsertNode}
                handleDeleteNode={handleDeleteNode}
                handleRename={handleRename}
                handleMove={handleMove}
                fileExplorerNode={node}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
                files={files}
                setFiles={setFiles}
                isFileExplorerUpdated={isFileExplorerUpdated}
                setIsFileExplorerUpdated={setIsFileExplorerUpdated}
              />
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div
        draggable
        onDragStart={handleDragStart}
        onClick={handleOpenFile}
        onMouseOver={() => setDisplayNodeControls(true)}
        onMouseLeave={() => setDisplayNodeControls(false)}
        className={
          "flex items-center justify-between gap-1 cursor-pointer hover:border-l-2 hover:border-l-[#fec76f] hover:text-[#fec76f] p-[5px] " +
          (activeFile.path === fileExplorerNode.path
            ? "border-l-2 border-l-[#fec76f] text-[#fec76f]"
            : "")
        }
      >
        <span className="flex gap-1 items-center">
          <FileIcon className="text-xl" />
          {isRenaming ? (
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={submitRename}
              onKeyDown={(e) => e.key === "Enter" && submitRename()}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#f9f5f526] text-[#fec76f] outline-none px-2"
            />
          ) : (
            <span className="truncate">{fileExplorerNode.name}</span>
          )}
        </span>
        {displayNodeControls && (
          <div className="flex items-center gap-1">
            <EditIcon onClick={startRename} />
            <DeleteOutlineOutlinedIcon onClick={(e) => onDeleteNode(e)} />
          </div>
        )}
      </div>
    );
  }
};

export default FileExplorerNode;