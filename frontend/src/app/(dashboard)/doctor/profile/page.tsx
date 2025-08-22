"use client";

import { Upcoming } from "@/components/ui";

export default function DoctorProfilePage() {
  return (
    <Upcoming
      title="My Profile"
      description="Personal profile management system for doctors to update their professional information and preferences."
      expectedDate="February 2024"
      colorTheme="indigo"
      progressPercentage={85}
      features={[
        "Professional profile editing",
        "Medical credentials management",
        "Specialty information",
        "Profile picture management",
        "Account settings",
        "Professional bio",
      ]}
    />
  );
}
