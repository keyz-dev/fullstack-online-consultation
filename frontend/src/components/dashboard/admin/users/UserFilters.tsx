import React from "react";
import { AdvancedFilters } from "@/components/ui";

interface UserFiltersProps {
  filters: {
    role: string;
    status: string;
    verified: string;
    search: string;
    sortBy: string;
    sortOrder: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onSearch: (searchTerm: string) => void;
  onRefresh: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onRefresh,
}) => {
  const filterConfigs = [
    {
      key: "role",
      label: "Role",
      defaultValue: "all",
      colorClass:
        "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      options: [
        { value: "all", label: "All Roles" },
        { value: "patient", label: "Patients" },
        { value: "doctor", label: "Doctors" },
        { value: "pharmacy", label: "Pharmacies" },
        { value: "pending_doctor", label: "Pending Doctors" },
        { value: "pending_pharmacy", label: "Pending Pharmacies" },
      ],
    },
    {
      key: "status",
      label: "Status",
      defaultValue: "all",
      colorClass:
        "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      options: [
        { value: "all", label: "All Statuses" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      key: "sortBy",
      label: "Sort By",
      defaultValue: "createdAt",
      colorClass:
        "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
      options: [
        { value: "createdAt", label: "Date Created (Newest)" },
        { value: "createdAt", label: "Date Created (Oldest)" },
        { value: "name", label: "Name (A-Z)" },
        { value: "name", label: "Name (Z-A)" },
        { value: "email", label: "Email (A-Z)" },
        { value: "email", label: "Email (Z-A)" },
        { value: "role", label: "Role (A-Z)" },
        { value: "role", label: "Role (Z-A)" },
      ],
    },
  ];

  return (
    <AdvancedFilters
      filters={filters}
      onFilterChange={onFilterChange}
      onSearch={onSearch}
      onClearAll={() => {
        onFilterChange("role", "all");
        onFilterChange("status", "all");
        onFilterChange("sortBy", "createdAt");
        onSearch("");
      }}
      refreshFunction={onRefresh}
      filterConfigs={filterConfigs}
      searchPlaceholder="Search users by name, email, or role..."
      loading={false}
    />
  );
};

export default UserFilters;
