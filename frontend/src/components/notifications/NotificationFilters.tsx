"use client";

import React from "react";
import { useNotificationContext } from "../../contexts/NotificationContext";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  key: string;
  label: string;
  defaultValue: string;
  options: FilterOption[];
}

interface NotificationFiltersProps {
  filters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onSearch: (query: string) => void;
  onClearAll: () => void;
  loading?: boolean;
  refreshNotifications?: () => Promise<void>;
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onClearAll,
  loading = false,
  refreshNotifications = null,
}) => {
  const { allowedTypes, categories } = useNotificationContext();

  // Admin-specific notification type options
  const getAdminTypeOptions = (): FilterOption[] => {
    const typeLabels: Record<string, string> = {
      vendor_application_submitted: "Vendor Application Submitted",
      vendor_application_reviewed: "Vendor Application Reviewed",
      vendor_application_approved: "Vendor Application Approved",
      vendor_application_rejected: "Vendor Application Rejected",
      new_user_registered: "New User Registered",
      order_dispute_reported: "Order Dispute Reported",
      booking_dispute_reported: "Booking Dispute Reported",
      system_alert: "System Alert",
      platform_maintenance: "Platform Maintenance",
      security_alert: "Security Alert",
      user_reported: "User Reported",
      vendor_reported: "Vendor Reported",
      system: "System Messages",
      promotion: "Promotions",
      announcement: "Announcements",
    };

    return [
      { value: "all", label: "All Types" },
      ...allowedTypes
        .filter((type) => typeLabels[type])
        .map((type) => ({
          value: type,
          label: typeLabels[type],
        })),
    ];
  };

  // Admin-specific category options
  const getAdminCategoryOptions = (): FilterOption[] => {
    const categoryLabels: Record<string, string> = {
      vendor_applications: "Vendor Applications",
      orders: "Orders",
      bookings: "Bookings",
      system: "System",
      promotions: "Promotions",
    };

    return [
      { value: "all", label: "All Categories" },
      ...categories
        .filter((category) => categoryLabels[category])
        .map((category) => ({
          value: category,
          label: categoryLabels[category],
        })),
    ];
  };

  const filterConfigs: FilterConfig[] = [
    {
      key: "type",
      label: "Type",
      defaultValue: "all",
      options: getAdminTypeOptions(),
    },
    {
      key: "category",
      label: "Category",
      defaultValue: "all",
      options: getAdminCategoryOptions(),
    },
    {
      key: "priority",
      label: "Priority",
      defaultValue: "all",
      options: [
        { value: "all", label: "All Priorities" },
        { value: "urgent", label: "Urgent" },
        { value: "high", label: "High" },
        { value: "medium", label: "Medium" },
        { value: "low", label: "Low" },
      ],
    },
    {
      key: "status",
      label: "Status",
      defaultValue: "all",
      options: [
        { value: "all", label: "All Status" },
        { value: "unread", label: "Unread" },
        { value: "read", label: "Read" },
      ],
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search notifications..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Filter Dropdowns */}
        {filterConfigs.map((config) => (
          <div key={config.key} className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {config.label}
            </label>
            <select
              value={filters[config.key] || config.defaultValue}
              onChange={(e) => onFilterChange(config.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {config.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClearAll}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Clear All
          </button>
          {refreshNotifications && (
            <button
              onClick={refreshNotifications}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationFilters;
