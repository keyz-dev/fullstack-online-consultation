"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  notificationsAPI,
  Notification as APINotification,
} from "../api/notifications";
import { useAuth } from "./AuthContext";
import { useSocketContext } from "./SocketProvider";
import { toast } from "react-toastify";

// Frontend notification interface (compatible with API)
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  priority: "low" | "medium" | "high" | "urgent";
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  data?: {
    relatedId?: string;
    relatedModel?: string;
    category?: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  isConnected: boolean;
  socketConnected: boolean;
  allowedTypes: string[];
  categories: string[];
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  addNotification: (notification: APINotification) => void;
  getUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();

  // Get socket context safely
  let socket = null;
  try {
    const socketContext = useSocketContext();
    socket = socketContext?.socket;
  } catch (error) {
    console.log(
      "SocketContext not available yet, notifications will work without real-time updates"
    );
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);

  // Get token from localStorage safely
  const getToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }, []);

  // Notification types for medical consultation system
  const allowedTypes = [
    "application_approved",
    "application_rejected",
    "application_under_review",
    "system_announcement",
    "consultation_reminder",
    "consultation_confirmation",
    "consultation_cancelled",
    "prescription_ready",
    "payment_successful",
    "payment_failed",
    "payment_initiated",
    "appointment_created",
    "appointment_confirmed",
    "payment_update",
    "general",
  ];

  const categories = [
    "applications",
    "consultations",
    "payments",
    "system",
    "prescriptions",
  ];

  // Get unread count
  const getUnreadCount = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await notificationsAPI.getUnreadCount();
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error("Failed to get unread count:", error);
    }
  }, [getToken]);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId: number) => {
      const token = getToken();
      if (!token) return;

      try {
        await notificationsAPI.markAsRead(notificationId);

        // Update local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  isRead: true,
                  readAt: new Date().toISOString(),
                }
              : notification
          )
        );

        // Update unread count
        await getUnreadCount();

        toast.success("Notification marked as read");
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
        toast.error("Failed to mark notification as read");
      }
    },
    [getToken, getUnreadCount]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      await notificationsAPI.markAllAsRead();

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );

      // Update unread count
      setUnreadCount(0);

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  }, [getToken]);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId: number) => {
      const token = getToken();
      if (!token) return;

      try {
        await notificationsAPI.deleteNotification(notificationId);

        // Update local state
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId)
        );

        // Update unread count if notification was unread
        const deletedNotification = notifications.find(
          (n) => n.id === notificationId
        );
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        toast.success("Notification deleted");
      } catch (error) {
        console.error("Failed to delete notification:", error);
        toast.error("Failed to delete notification");
      }
    },
    [getToken, notifications]
  );

  // Refresh notifications from API
  const refreshNotifications = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await notificationsAPI.getNotifications({
        page: 1,
        limit: 50, // Get recent notifications
      });

      setNotifications(response.notifications);
      setUnreadCount(response.notifications.filter((n) => !n.isRead).length);
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to refresh notifications:", error);
      setIsConnected(false);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Add notification (for real-time updates)
  const addNotification = useCallback((notification: APINotification) => {
    setNotifications((prev) => [notification, ...prev]);

    // Update unread count if notification is unread
    if (!notification.isRead) {
      setUnreadCount((prev) => prev + 1);
    }

    // Show toast for new notifications
    toast.info(notification.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  // Socket event listeners for real-time notifications
  useEffect(() => {
    if (!socket || !user) return;

    console.log(`🔔 Setting up notification listeners for user ${user.id}`);

    // Update socket connection status
    setSocketConnected(socket.connected || false);

    const handleNewNotification = (data: { notification: APINotification }) => {
      console.log(`🔔 NotificationContext: Received new notification:`, {
        id: data.notification.id,
        type: data.notification.type,
        title: data.notification.title,
        message: data.notification.message,
      });

      // Add notification to state immediately
      addNotification(data.notification);
      console.log(
        `✅ NotificationContext: Notification added to state and toast shown`
      );
    };

    const handleSocketConnect = () => {
      console.log(
        `🔌 NotificationContext: Socket connected for user ${user.id}`
      );
      setSocketConnected(true);
    };

    const handleSocketDisconnect = () => {
      console.log(
        `🔌 NotificationContext: Socket disconnected for user ${user.id}`
      );
      setSocketConnected(false);
    };

    // Add event listeners
    socket.on("notification:new", handleNewNotification);
    socket.on("connect", handleSocketConnect);
    socket.on("disconnect", handleSocketDisconnect);

    // Cleanup
    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("connect", handleSocketConnect);
      socket.off("disconnect", handleSocketDisconnect);
    };
  }, [socket, user, addNotification]);

  // Load initial notifications when user is authenticated
  useEffect(() => {
    if (user) {
      refreshNotifications();
      getUnreadCount();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, refreshNotifications, getUnreadCount]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    isConnected,
    socketConnected,
    allowedTypes,
    categories,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    addNotification,
    getUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
