"use client";

import { Upcoming } from "@/components/ui";

export default function AdminUsersPage() {
  return (
    <Upcoming
      title="User Management"
      description="Comprehensive user management system for administrators to view, manage, and control user accounts across the platform."
      expectedDate="February 2024"
      colorTheme="blue"
      progressPercentage={75}
      features={[
        "User account management",
        "Role assignment and permissions",
        "User activity monitoring",
        "Bulk user operations",
        "User search and filtering",
        "Account status management",
      ]}
    />
  );
}
