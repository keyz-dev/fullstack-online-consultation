"use client";

import { Upcoming } from "@/components/ui";

export default function PatientSettingsPage() {
  return (
    <Upcoming
      title="Settings"
      description="Personal settings and configuration panel for patients to customize their experience and preferences."
      expectedDate="February 2024"
      colorTheme="pink"
      progressPercentage={90}
      features={[
        "Account preferences",
        "Notification settings",
        "Privacy settings",
        "Security preferences",
        "Theme customization",
        "Language preferences",
      ]}
    />
  );
}
