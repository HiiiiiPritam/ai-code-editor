import axios, { AxiosError } from 'axios';

type NotificationType = 
  | 'FILE_CREATE' 
  | 'FILE_UPDATE' 
  | 'FILE_DELETE' 
  | 'FILE_MOVE'
  | 'FOLDER_MOVE'
  | 'FOLDER_CREATE' 
  | 'FOLDER_DELETE' 
  | 'USER_JOIN' 
  | 'USER_LEAVE' 
  | 'CODE_EXECUTE';

interface NotificationMetadata {
  path?: string;
  language?: string;
  executionStatus?: string;
}

interface Notification {
  _id?: string;
  type: NotificationType;
  message: string;
  username: string;
  timestamp: Date;
  metadata?: NotificationMetadata;
}

interface NotificationFilters {
  type?: NotificationType;
  startDate?: Date;
  endDate?: Date;
  username?: string;
}
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

const handleError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.data?.message) {
      return new Error(axiosError.response.data.message);
    }
    return new Error(axiosError.message);
  }
  return new Error('An unexpected error occurred');
};

export const getNotifications = async (roomId: string): Promise<Notification[]> => {
  try {
    const response = await axios.get<{ notifications: Notification[] }>(
      `${baseUrl}/api/notifications/${roomId}`
    );
    return response.data.notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw handleError(error);
  }
};

export const addNotification = async (
  roomId: string,
  notification: Omit<Notification, '_id' | 'timestamp'>
): Promise<Notification> => {
  try {
    console.log("calling add notification");
    const response = await axios.post<{ notification: Notification }>(
      `${baseUrl}/api/notifications/${roomId}`,
      notification
    );
    return response.data.notification;
  } catch (error) {
    console.error('Error adding notification:', error);
    throw handleError(error);
  }
};

export const cleanupOldNotifications = async (
  roomId: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.delete<{ message: string }>(
      `${baseUrl}/api/notifications/${roomId}/cleanup`
    );
    return response.data;
  } catch (error) {
    console.error('Error cleaning up notifications:', error);
    throw handleError(error);
  }
};

export const getFilteredNotifications = async (
  roomId: string,
  filters: NotificationFilters
): Promise<Notification[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.username) queryParams.append('username', filters.username);
    if (filters.startDate) queryParams.append('startDate', filters.startDate.toISOString());
    if (filters.endDate) queryParams.append('endDate', filters.endDate.toISOString());

    const response = await axios.get<{ notifications: Notification[] }>(
      `${baseUrl}/api/notifications/${roomId}/filter?${queryParams.toString()}`
    );
    return response.data.notifications;
  } catch (error) {
    console.error('Error fetching filtered notifications:', error);
    throw handleError(error);
  }
};

export const createNotificationMessage = (
  type: NotificationType,
  details: {
    username: string;
    fileName?: string;
    folderName?: string;
    path?: string;
  }
): string => {
  switch (type) {
    case 'FILE_CREATE':
      return `${details.username} created file: ${details.fileName}`;
    case 'FILE_UPDATE':
      return `${details.username} updated file: ${details.fileName}`;
    case 'FILE_DELETE':
      return `${details.username} deleted file: ${details.fileName}`;
    case 'FOLDER_CREATE':
      return `${details.username} created folder: ${details.folderName}`;
    case 'FOLDER_DELETE':
      return `${details.username} deleted folder: ${details.folderName}`;
    case 'USER_JOIN':
      return `${details.username} joined the workspace`;
    case 'USER_LEAVE':
      return `${details.username} left the workspace`;
    case 'CODE_EXECUTE':
      return `${details.username} executed code in ${details.fileName}`;
    default:
      return `${details.username} performed an action`;
  }
};