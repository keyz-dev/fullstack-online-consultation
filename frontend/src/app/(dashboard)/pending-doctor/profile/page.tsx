"use client";

import { Upcoming } from "@/components/ui";

export default function PendingDoctorProfilePage() {
  return (
    <Upcoming
      title="My Profile"
      description="Profile management system for pending doctors to update their application information and documents."
      expectedDate="February 2024"
      colorTheme="indigo"
      progressPercentage={90}
      features={[
        "Application information",
        "Document uploads",
        "Professional details",
        "Contact information",
        "Application status",
        "Document verification",
      ]}
    />
  );
}
