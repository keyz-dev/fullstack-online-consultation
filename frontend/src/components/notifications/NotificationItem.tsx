"use client";

import React from "react";
import {
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Star,
  Bell,
} from "lucide-react";
import { Notification } from "../../contexts/NotificationContext";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (notificationId: string) => Promise<void>;
  onDelete: (notificationId: string) => Promise<void>;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const getNotificationIcon = (type: string) => {
    const iconProps = { size: 20 };

    switch (type) {
      case "vendor_application_submitted":
        return <AlertCircle {...iconProps} className="text-blue-500" />;
      case "vendor_application_reviewed":
        return <Clock {...iconProps} className="text-yellow-500" />;
      case "vendor_application_approved":
        return <CheckCircle {...iconProps} className="text-green-500" />;
      case "vendor_application_rejected":
        return <AlertCircle {...iconProps} className="text-red-500" />;
      case "order":
        return <Calendar {...iconProps} className="text-purple-500" />;
      case "booking":
        return <Calendar {...iconProps} className="text-indigo-500" />;
      case "system":
        return <Star {...iconProps} className="text-orange-500" />;
      case "promotion":
        return <Bell {...iconProps} className="text-pink-500" />;
      default:
        return <Bell {...iconProps} className="text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "Recently";

    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification._id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification._id);
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
        !notification.isRead ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4
                className={`text-sm font-medium ${
                  !notification.isRead ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {notification.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {formatTimeAgo(notification.createdAt)}
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

              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete notification"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Related Info */}
          {notification.relatedId && (
            <div className="mt-2 text-xs text-gray-500">
              Related: {notification.relatedModel} #
              {typeof notification.relatedId === "string"
                ? notification.relatedId.slice(-8)
                : "N/A"}
            </div>
          )}
        </div>

        {/* Read Status */}
        {!notification.isRead && (
          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
