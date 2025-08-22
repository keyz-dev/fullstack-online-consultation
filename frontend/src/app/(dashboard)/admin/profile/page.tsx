"use client";

import { Upcoming } from "@/components/ui";

export default function AdminProfilePage() {
  return (
    <Upcoming
      title="My Profile"
      description="Personal profile management system for administrators to update their account information and preferences."
      expectedDate="February 2024"
      colorTheme="indigo"
      progressPercentage={85}
      features={[
        "Profile information editing",
        "Account settings management",
        "Security preferences",
        "Notification preferences",
        "Profile picture management",
        "Account activity history",
      ]}
    />
  );
}
