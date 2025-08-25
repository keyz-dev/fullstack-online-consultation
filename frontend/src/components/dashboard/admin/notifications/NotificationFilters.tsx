import React from "react";
import AdvancedFilters from "@/components/ui/AdvancedFilters";

interface NotificationFiltersProps {
  filters: Record<string, string>;
  searchQuery: string;
  onFilterChange: (key: string, value: string) => void;
  onSearch: (query: string) => void;
  onClearAll: () => void;
  onRefresh: () => void;
  loading: boolean;
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filters,
  searchQuery,
  onFilterChange,
  onSearch,
  onClearAll,
  onRefresh,
  loading,
}) => {
  return (
    <AdvancedFilters
      filters={{
        type: filters.type,
        priority: filters.priority,
        status: filters.status,
        search: searchQuery,
      }}
      onFilterChange={onFilterChange}
      onSearch={onSearch}
      onClearAll={onClearAll}
      refreshFunction={onRefresh}
      searchPlaceholder="Search notifications..."
      loading={loading}
      filterConfigs={[
        {
          key: "type",
          label: "Type",
          defaultValue: "all",
          options: [
            { value: "all", label: "All Types" },
            { value: "application_approved", label: "Application Approved" },
            { value: "application_rejected", label: "Application Rejected" },
            {
              value: "application_under_review",
              label: "Application Under Review",
            },
            { value: "system_announcement", label: "System Announcement" },
            {
              value: "consultation_reminder",
              label: "Consultation Reminder",
            },
            {
              value: "consultation_confirmation",
              label: "Consultation Confirmation",
            },
            {
              value: "consultation_cancelled",
              label: "Consultation Cancelled",
            },
            { value: "prescription_ready", label: "Prescription Ready" },
            { value: "payment_successful", label: "Payment Successful" },
            { value: "payment_failed", label: "Payment Failed" },
            { value: "general", label: "General" },
          ],
        },
        {
          key: "priority",
          label: "Priority",
          defaultValue: "all",
          options: [
            { value: "all", label: "All Priorities" },
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
            { value: "urgent", label: "Urgent" },
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
      ]}
    />
  );
};

export default NotificationFilters;
