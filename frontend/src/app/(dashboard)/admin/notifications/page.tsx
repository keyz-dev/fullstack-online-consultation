"use client";

import React, { useState, useCallback } from "react";
import { Bell, Filter, Search, RefreshCw } from "lucide-react";
import { useNotificationContext } from "../../../../contexts/NotificationContext";
import {
  NotificationFilters,
  NotificationList,
} from "../../../../components/notifications";

const AdminNotificationsPage: React.FC = () => {
  const {
    notifications,
    loading,
    markAsRead,
    deleteNotification,
    refreshNotifications,
    isConnected,
  } = useNotificationContext();

  const [filters, setFilters] = useState<Record<string, string>>({
    type: "all",
    category: "all",
    priority: "all",
    status: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleClearAll = useCallback(() => {
    setFilters({
      type: "all",
      category: "all",
      priority: "all",
      status: "all",
    });
    setSearchQuery("");
  }, []);

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

    // Category filter
    if (
      filters.category !== "all" &&
      notification.category !== filters.category
    ) {
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

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const urgentCount = notifications.filter(
    (n) => n.priority === "urgent"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Notifications
            </h1>
            <p className="text-gray-600">
              Manage and monitor all system notifications
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Urgent</p>
              <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <span className="text-sm text-gray-600">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <NotificationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onClearAll={handleClearAll}
        loading={loading}
        refreshNotifications={refreshNotifications}
      />

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              All Notifications ({filteredNotifications.length})
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={refreshNotifications}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <NotificationList
          notifications={filteredNotifications}
          loading={loading}
          onMarkAsRead={markAsRead}
          onDelete={deleteNotification}
          onRefresh={refreshNotifications}
          isConnected={isConnected}
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Notifications
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Bell className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Read</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter((n) => n.isRead).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <Bell className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
