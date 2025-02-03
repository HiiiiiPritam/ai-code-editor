import mongoose from "mongoose";

const fileExplorerNodeSchema = new mongoose.Schema({
  id: String,
  name: String,
  isFolder: Boolean,
  path: String,
  nodes: []
});

fileExplorerNodeSchema.add({ nodes: [fileExplorerNodeSchema] });

const fileSchema = new mongoose.Schema({
  name: String,
  content: String,
  language: String,
  path: String
});

const filesContentSchema = new mongoose.Schema({
  path: String,
  file: fileSchema
});

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['FILE_CREATE', 'FILE_UPDATE', 'FILE_DELETE','FILE_MOVE', 'FOLDER_CREATE', 'FOLDER_DELETE', 'USER_JOIN', 'USER_LEAVE', 'CODE_EXECUTE'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    path: String,           // For file/folder operations
    language: String,       // For file operations
    executionStatus: String // For code execution
  }
});

const workspaceSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  fileExplorerData: fileExplorerNodeSchema,
  openFiles: [fileSchema],
  activeFile: fileSchema,
  filesContent: [filesContentSchema],
  notifications: [notificationSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

export const Workspace = mongoose.model("Workspace", workspaceSchema);