import React, { useState } from 'react';
import { 
  FileIcon, 
  FolderIcon, 
  UserIcon, 
  PlayIcon, 
  XIcon,
  FilterIcon,
  RefreshCwIcon
} from 'lucide-react';

export interface NotificationMetadata {
  path?: string;
  language?: string;
  executionStatus?: string;
}

export interface Notification {
  _id?: string;
  type: 'FILE_CREATE' | 'FILE_UPDATE' | 'FILE_DELETE' |'FILE_MOVE' | 'FOLDER_CREATE' |'FOLDER_MOVE' |
        'FOLDER_DELETE' | 'USER_JOIN' | 'USER_LEAVE' | 'CODE_EXECUTE';
  message: string;
  username: string;
  timestamp: Date;
  metadata?: NotificationMetadata;
}

interface ActivityLogProps {
  notifications: Notification[];
  onRefresh: () => void;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ notifications, onRefresh }) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'FILE_CREATE':
      case 'FILE_UPDATE':
      case 'FILE_DELETE':
        return <FileIcon className="w-4 h-4" />;
      case 'FOLDER_CREATE':
      case 'FOLDER_DELETE':
        return <FolderIcon className="w-4 h-4" />;
      case 'USER_JOIN':
      case 'USER_LEAVE':
        return <UserIcon className="w-4 h-4" />;
      case 'CODE_EXECUTE':
        return <PlayIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'FILE_CREATE':
      case 'FOLDER_CREATE':
        return 'text-green-500';
      case 'FILE_DELETE':
      case 'FOLDER_DELETE':
        return 'text-red-500';
      case 'FILE_UPDATE':
        return 'text-blue-500';
      case 'USER_JOIN':
        return 'text-purple-500';
      case 'USER_LEAVE':
        return 'text-orange-500';
      case 'CODE_EXECUTE':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const filteredNotifications = notifications.filter(notification => 
    filter === 'ALL' ? true : notification.type.startsWith(filter)
  );

  return (
    <div className="h-screen bg-[#2d2a2a] text-white flex flex-col">
      <div className="p-4 border-b border-[#4e4b4b] flex justify-between items-center">
        <h2 className="text-lg font-semibold">Activity Log</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="p-2 hover:bg-[#3d3a3a] rounded"
          >
            <FilterIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={onRefresh}
            className="p-2 hover:bg-[#3d3a3a] rounded"
          >
            <RefreshCwIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="p-4 border-b border-[#4e4b4b] flex flex-wrap gap-2">
          {['ALL', 'FILE', 'FOLDER', 'USER', 'CODE'].map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded ${
                filter === filterType 
                  ? 'bg-[#ffe200] text-black' 
                  : 'bg-[#3d3a3a] text-white'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-[#4e4b4b]">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification._id} 
                className="p-4 hover:bg-[#3d3a3a] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${getColor(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <div className="flex gap-2 mt-1 text-xs text-gray-400">
                      <span>by {notification.username}</span>
                      <span>•</span>
                      <span>{new Date(notification.timestamp).toLocaleString()}</span>
                    </div>
                    {notification.metadata?.path && (
                      <p className="mt-1 text-xs text-gray-400">
                        Path: {notification.metadata.path}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No activities to show
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;