import React, { useState, useRef, useEffect } from "react";
import { Bell, X, RefreshCw, Trash2 } from "lucide-react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
}

interface NotificationBellProps {
  notifications?: Notification[];
  unreadCount?: number;
  loading?: boolean;
  isConnected?: boolean;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDeleteNotification?: (id: string) => void;
  onRefreshNotifications?: () => void;
}

export default function NotificationBell({
  notifications = [],
  unreadCount = 0,
  loading = false,
  isConnected = true,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onRefreshNotifications,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "vendor_application_submitted":
        return "📝";
      case "vendor_application_reviewed":
        return "👀";
      case "vendor_application_approved":
        return "✅";
      case "vendor_application_rejected":
        return "❌";
      case "order":
        return "📦";
      case "booking":
        return "📅";
      case "system":
        return "⚙️";
      case "promotion":
        return "🎉";
      default:
        return "🔔";
    }
  };

  // Format time ago
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

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead && onMarkAsRead) {
      await onMarkAsRead(notification._id);
    }
    setIsOpen(false);
  };

  const handleMarkAllRead = async () => {
    if (onMarkAllAsRead) {
      await onMarkAllAsRead();
    }
  };

  const handleDeleteNotification = async (
    e: React.MouseEvent,
    notificationId: string
  ) => {
    e.stopPropagation();
    if (onDeleteNotification) {
      await onDeleteNotification(notificationId);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-medium text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-sm shadow-lg border border-gray-200 z-50 max-h-[500px] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-sm font-medium text-red-600">
                  ({unreadCount} unread)
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={onRefreshNotifications}
                disabled={loading}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title="Refresh"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <RefreshCw size={20} className="animate-spin mx-auto mb-2" />
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  {isConnected ? "Connected" : "Disconnected"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Notification Icon */}
                      <div className="flex-shrink-0 text-lg">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Notification Content */}
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

                          {/* Delete Button */}
                          <button
                            onClick={(e) =>
                              handleDeleteNotification(e, notification._id)
                            }
                            className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(notification.createdAt)}
                          </span>

                          {/* Priority Badge */}
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

                      {/* Read Status Indicator */}
                      {!notification.isRead && (
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{isConnected ? "🟢 Connected" : "🔴 Disconnected"}</span>
                <span>
                  {notifications.length} notification
                  {notifications.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
