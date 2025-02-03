import React, { Dispatch, SetStateAction, useEffect, useCallback } from "react";
import { useTraverseTree } from "@/hooks/useTraverseTree";
import FileExplorerNode from "./FileExplorerNode";
import { Typography } from "@mui/material";
import { IFileExplorerNode } from "@/interfaces/IFileExplorerNode";
import { IFile } from "@/interfaces/IFile";
import { workspaceApi } from "@/services/workspaceApi";
import { getFileLanguage } from "@/app/helpers/getFileLanguage";
import { getNotifications, addNotification, createNotificationMessage } from '@/services/notificationApi';
import { Notification, NotificationType } from "@/interfaces/Notifications";
import {ACTIONS} from "@/app/helpers/Actions";

interface FileExplorerProps {
  fileExplorerData: IFileExplorerNode;
  setFileExplorerData: Dispatch<SetStateAction<IFileExplorerNode>>;
  activeFile: IFile;
  setActiveFile: Dispatch<SetStateAction<IFile>>;
  files: IFile[];
  setFiles: Dispatch<SetStateAction<IFile[]>>;
  isFileExplorerUpdated: boolean;
  setIsFileExplorerUpdated: Dispatch<SetStateAction<boolean>>;
  roomId: string;
  filesContentMap: Map<string, IFile>;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>,
  socket: any,
  username?: string | null
}

function FileExplorer({
  fileExplorerData,
  setFileExplorerData,
  activeFile,
  setActiveFile,
  files,
  setFiles,
  isFileExplorerUpdated,
  setIsFileExplorerUpdated,
  roomId,
  filesContentMap,
  notifications,
  setNotifications,
  socket,
  username
}: FileExplorerProps) {
  const { insertNode, deleteNode, renameNode, moveNode } = useTraverseTree();

 const handleAddNotification = async (
    type: NotificationType,
    details: { username: string; fileName?: string; folderName?: string; path?: string }
  ) => {
    try {
      const message = createNotificationMessage(type, details);
      const metadata = {
        path: details.path,
        language: details.fileName ? getFileLanguage(details.fileName) : undefined,
      };

      const newNotification = await addNotification(roomId as string, {
        type,
        message,
        username: details.username,
        metadata
      });

      const typedNotification: Notification = {
        type: newNotification.type as NotificationType,
        message: newNotification.message,
        username: newNotification.username,
        timestamp: new Date(newNotification.timestamp),
        metadata: newNotification.metadata
      };

      setNotifications(prev => [typedNotification, ...prev]);
      
      socket.current?.emit(ACTIONS.NOTIFICATION_ADDED, {
        roomId,
        notification: typedNotification
      });
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const saveWorkspaceChanges = useCallback(async () => {
    const payload = {
      fileExplorerData,
      openFiles: files,
      activeFile,
    };
    try {
      await workspaceApi.saveWorkspace(roomId, payload, filesContentMap);
      setIsFileExplorerUpdated(false);
    } catch (error) {
      console.error('Error saving workspace:', error);
    }
  }, [fileExplorerData, files, activeFile, roomId, filesContentMap, setIsFileExplorerUpdated]);

  const handleInsertNode = (
    folderId: string,
    item: string,
    isFolder: boolean
  ) => {
    const updatedFileExplorerData = insertNode(
      fileExplorerData,
      folderId,
      item,
      isFolder
    );
    (isFolder)
    ?handleAddNotification('FOLDER_CREATE', { username: username || 'anonymous', folderName: item })
    :handleAddNotification('FILE_CREATE', { username: username || 'anonymous', fileName: item });

    setFileExplorerData(updatedFileExplorerData);
    setIsFileExplorerUpdated(true);
  };

  const handleDeleteNode = (nodeId: string, nodePath: string , isFolder: boolean) => {
    const updatedFileExplorerData = deleteNode(nodeId, fileExplorerData);
    if (updatedFileExplorerData !== null) {
      setFileExplorerData(updatedFileExplorerData);

      (isFolder)
    ?handleAddNotification('FOLDER_DELETE', { username: username || 'anonymous', folderName: nodePath })
    :handleAddNotification('FILE_DELETE', { username: username || 'anonymous', fileName: nodePath });
      const updatedOpenFiles = files.filter((file) => file.path !== nodePath);
      const updatedActiveFile =
        updatedOpenFiles.length > 0
          ? updatedOpenFiles[0]
          : {
              name: "",
              content: "",
              language: "",
              path: "",
            };
      setActiveFile(updatedActiveFile);
      setFiles(updatedOpenFiles);
      setIsFileExplorerUpdated(true);
    }
  };

  const handleRename = (nodeId: string, newName: string, isFolder: boolean) => {
    const updatedFileExplorerData = renameNode(nodeId, newName, fileExplorerData);
    setFileExplorerData(updatedFileExplorerData);
    (isFolder)
    ?handleAddNotification('FOLDER_CREATE', { username: username || 'anonymous', folderName: newName })
    :handleAddNotification('FILE_CREATE', { username: username || 'anonymous', fileName: newName });
    const updatedFiles = files.map(file => {
      if (file.path.includes(nodeId)) {
        const newPath = file.path.replace(file.name, newName);
        return { ...file, name: newName, path: newPath };
      }
      return file;
    });
    setFiles(updatedFiles);

    if (activeFile.path.includes(nodeId)) {
      const newPath = activeFile.path.replace(activeFile.name, newName);
      setActiveFile({ ...activeFile, name: newName, path: newPath });
    }
    setIsFileExplorerUpdated(true);
  };

  const handleMove = (sourceId: string, targetId: string, isFolder: boolean) => {
    const updatedFileExplorerData = moveNode(sourceId, targetId, fileExplorerData);
    if (updatedFileExplorerData !== null) {
      setFileExplorerData(updatedFileExplorerData);
      (isFolder)?handleAddNotification('FOLDER_MOVE', { username: username || 'anonymous', folderName: sourceId })
      :
      handleAddNotification('FILE_MOVE', { username: username || 'anonymous', fileName: sourceId });
      const findNewPath = (node: IFileExplorerNode): string | null => {
        if (node.id === sourceId) return node.path;
        for (const child of node.nodes) {
          const path = findNewPath(child);
          if (path) return path;
        }
        return null;
      };

      const newPath = findNewPath(updatedFileExplorerData);
      if (newPath) {
        const updatedFiles = files.map(file => {
          if (file.path.includes(sourceId)) {
            return { ...file, path: newPath };
          }
          return file;
        });
        setFiles(updatedFiles);

        if (activeFile.path.includes(sourceId)) {
          setActiveFile({ ...activeFile, path: newPath });
        }
      }
      setIsFileExplorerUpdated(true);
    }
  };

  useEffect(() => {
    if (isFileExplorerUpdated) {
      saveWorkspaceChanges();
    }
  }, [isFileExplorerUpdated, saveWorkspaceChanges]);

  return (
    <div className="text-[#aaaaaa] p-4">
      <Typography
        variant="h6"
        component="h6"
        className="border-b border-[#aaaaa] pb-1 mb-2"
      >
        EDITOR
      </Typography>
      <FileExplorerNode
        handleInsertNode={handleInsertNode}
        handleDeleteNode={handleDeleteNode}
        handleRename={handleRename}
        handleMove={handleMove}
        fileExplorerNode={fileExplorerData}
        activeFile={activeFile}
        setActiveFile={setActiveFile}
        files={files}
        setFiles={setFiles}
        isFileExplorerUpdated={isFileExplorerUpdated}
        setIsFileExplorerUpdated={setIsFileExplorerUpdated}
      />
    </div>
  );
}

export default FileExplorer;