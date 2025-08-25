"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useNotificationContext } from "../../../../contexts/NotificationContext";
import { notificationsAPI } from "../../../../api/notifications";
import { toast } from "react-toastify";
import {
  NotificationHeader,
  NotificationStatsSection,
  NotificationFilters,
  NotificationListView,
} from "@/components/dashboard/admin/notifications";

const AdminNotificationsPage: React.FC = () => {
  const {
    notifications,
    loading,
    markAsRead,
    deleteNotification,
    refreshNotifications,
    isConnected,
    unreadCount,
  } = useNotificationContext();

  const [filters, setFilters] = useState<Record<string, string>>({
    type: "all",
    priority: "all",
    status: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    urgent: 0,
    high: 0,
  });

  // Fetch notification stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await notificationsAPI.getNotificationStats();
      setStats(response);
    } catch (error) {
      console.error("Failed to fetch notification stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((key: string, value: string) => {
    if (key === "search") {
      setSearchQuery(value);
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  }, []);

  const handleClearAll = useCallback(() => {
    setFilters({
      type: "all",
      priority: "all",
      status: "all",
    });
    setSearchQuery("");
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await notificationsAPI.markAllAsRead();
      await refreshNotifications();
      await fetchStats();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  }, [refreshNotifications, fetchStats]);

  const handleClearAllNotifications = useCallback(async () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      try {
        await notificationsAPI.clearAllNotifications();
        await refreshNotifications();
        await fetchStats();
        toast.success("All notifications cleared");
      } catch (error) {
        console.error("Failed to clear notifications:", error);
        toast.error("Failed to clear notifications");
      }
    }
  }, [refreshNotifications, fetchStats]);

  // Filter notifications based on current filters and search
  const filteredNotifications = notifications.filter((notification) => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filters.type !== "all" && notification.type !== filters.type) {
      return false;
    }

    // Priority filter
    if (
      filters.priority !== "all" &&
      notification.priority !== filters.priority
    ) {
      return false;
    }

    // Status filter
    if (filters.status === "unread" && notification.isRead) {
      return false;
    }
    if (filters.status === "read" && !notification.isRead) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <NotificationStatsSection stats={stats} loading={loading} />
      {/* Header */}
      <NotificationHeader onMarkAllAsRead={handleMarkAllAsRead} />

      {/* Filters and Search */}
      <NotificationFilters
        filters={filters}
        searchQuery={searchQuery}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onClearAll={handleClearAll}
        onRefresh={refreshNotifications}
        loading={loading}
      />

      {/* Notifications List */}
      <NotificationListView
        notifications={filteredNotifications}
        loading={loading}
        onMarkAsRead={markAsRead}
        onDelete={deleteNotification}
        onClearAll={handleClearAllNotifications}
        searchQuery={searchQuery}
        filters={filters}
      />
    </div>
  );
};

export default AdminNotificationsPage;
