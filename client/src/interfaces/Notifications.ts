export type NotificationType = 
  | 'FILE_CREATE' 
  | 'FILE_UPDATE' 
  | 'FILE_DELETE' 
  | 'FOLDER_MOVE'
  | 'FILE_MOVE'
  | 'FOLDER_CREATE' 
  | 'FOLDER_DELETE' 
  | 'USER_JOIN' 
  | 'USER_LEAVE' 
  | 'CODE_EXECUTE';

export interface NotificationMetadata {
  path?: string;
  language?: string;
  executionStatus?: string;
}

export interface Notification {
  type: NotificationType;
  message: string;
  username: string;
  timestamp: Date;
  metadata?: NotificationMetadata;
}