"use client";

import React from "react";
import { Bell, RefreshCw } from "lucide-react";
import NotificationItem from "./NotificationItem";
import { Notification } from "../../contexts/NotificationContext";

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (notificationId: string) => Promise<void>;
  onDelete: (notificationId: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  isConnected: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  onMarkAsRead,
  onDelete,
  onRefresh,
  isConnected,
}) => {
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
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default NotificationList;
