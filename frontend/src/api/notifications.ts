import api from "./index";

// Types
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

export interface NotificationFilters {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: string;
  priority?: string;
  search?: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  urgent: number;
  high: number;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

// API Functions
export const notificationsAPI = {
  // Get notifications with pagination and filtering
  getNotifications: async (
    filters?: NotificationFilters
  ): Promise<NotificationResponse> => {
    const response = await api.get("/notifications", { params: filters });
    return response.data.data;
  },

  // Get unread notification count
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await api.get("/notifications/unread-count");
    return response.data.data;
  },

  // Mark notification as read
  markAsRead: async (
    notificationId: number
  ): Promise<{ notification: Notification }> => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await api.put("/notifications/mark-all-read");
    return response.data;
  },

  // Delete a notification
  deleteNotification: async (
    notificationId: number
  ): Promise<{ message: string }> => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Clear all notifications
  clearAllNotifications: async (): Promise<{ message: string }> => {
    const response = await api.delete("/notifications/clear-all");
    return response.data;
  },

  // Get notification statistics
  getNotificationStats: async (): Promise<NotificationStats> => {
    const response = await api.get("/notifications/stats");
    return response.data.data;
  },
};

export default notificationsAPI;
