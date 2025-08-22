"use client";

import { Upcoming } from "@/components/ui";

export default function PatientProfilePage() {
  return (
    <Upcoming
      title="My Profile"
      description="Personal profile management system for patients to update their information and preferences."
      expectedDate="February 2024"
      colorTheme="indigo"
      progressPercentage={85}
      features={[
        "Personal information editing",
        "Medical history",
        "Emergency contacts",
        "Profile picture management",
        "Account settings",
        "Privacy preferences",
      ]}
    />
  );
}
