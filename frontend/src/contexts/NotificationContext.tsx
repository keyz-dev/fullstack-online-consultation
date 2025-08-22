"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  relatedId?: string;
  relatedModel?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  isConnected: boolean;
  allowedTypes: string[];
  categories: string[];
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  addNotification: (
    notification: Omit<Notification, "_id" | "createdAt" | "updatedAt">
  ) => void;
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // Mock data for now - will be replaced with actual API calls
  const allowedTypes = [
    "vendor_application_submitted",
    "vendor_application_reviewed",
    "vendor_application_approved",
    "vendor_application_rejected",
    "new_user_registered",
    "order_dispute_reported",
    "booking_dispute_reported",
    "system_alert",
    "platform_maintenance",
    "security_alert",
    "user_reported",
    "vendor_reported",
    "system",
    "promotion",
    "announcement",
  ];

  const categories = [
    "vendor_applications",
    "orders",
    "bookings",
    "system",
    "promotions",
  ];

  // Mock notifications for development
  const mockNotifications: Notification[] = [
    {
      _id: "1",
      title: "New Vendor Application",
      message: "A new pharmacy has submitted their application for review.",
      type: "vendor_application_submitted",
      category: "vendor_applications",
      priority: "high",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      relatedId: "pharmacy_123",
      relatedModel: "Pharmacy",
    },
    {
      _id: "2",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur tonight at 2 AM.",
      type: "platform_maintenance",
      category: "system",
      priority: "medium",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      _id: "3",
      title: "Security Alert",
      message: "Multiple failed login attempts detected from IP 192.168.1.100",
      type: "security_alert",
      category: "system",
      priority: "urgent",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = useCallback(async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification._id !== notificationId)
    );
  }, []);

  const refreshNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setNotifications(mockNotifications);
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to refresh notifications:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, "_id" | "createdAt" | "updatedAt">) => {
      const newNotification: Notification = {
        ...notification,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
    []
  );

  // Load initial notifications
  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    isConnected,
    allowedTypes,
    categories,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
