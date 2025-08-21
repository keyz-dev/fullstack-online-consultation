import React from "react";
import { Bell, RefreshCw } from "lucide-react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
}

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
  isConnected?: boolean;
}

export default function NotificationList({
  notifications,
  loading,
  onMarkAsRead,
  onDelete,
  onRefresh,
  isConnected = true,
}: NotificationListProps) {
  // Group notifications by date
  const groupedNotifications = React.useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    notifications.forEach((notification) => {
      const date = new Date(notification.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let groupKey: string;
      if (date.toDateString() === today.toDateString()) {
        groupKey = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = "Yesterday";
      } else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
        groupKey = "This Week";
      } else {
        groupKey = "Older";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });

    return groups;
  }, [notifications]);

  if (loading && notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <RefreshCw
          size={32}
          className="animate-spin mx-auto mb-4 text-gray-400"
        />
        <p className="text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <Bell size={48} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No notifications
        </h3>
        <p className="text-gray-500">
          {isConnected ? "You're all caught up!" : "Disconnected"}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {Object.entries(groupedNotifications).map(
        ([group, groupNotifications]) => (
          <div key={group}>
            <div className="px-6 py-3 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700">{group}</h3>
            </div>
            {groupNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.isRead ? "bg-blue-50" : ""
                }`}
                onClick={() => onMarkAsRead?.(notification._id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-lg">
                    {notification.type === "order" && "📦"}
                    {notification.type === "system" && "⚙️"}
                    {notification.type === "promotion" && "🎉"}
                    {!["order", "system", "promotion"].includes(
                      notification.type
                    ) && "🔔"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-sm font-medium ${
                          !notification.isRead
                            ? "text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(notification._id);
                        }}
                        className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete notification"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                      {notification.priority !== "medium" && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            notification.priority === "urgent"
                              ? "bg-red-100 text-red-800"
                              : notification.priority === "high"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {notification.priority}
                        </span>
                      )}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
