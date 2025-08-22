"use client";

import { Upcoming } from "@/components/ui";

export default function DoctorSettingsPage() {
  return (
    <Upcoming
      title="Settings"
      description="Professional settings and configuration panel for doctors to customize their workspace and preferences."
      expectedDate="February 2024"
      colorTheme="pink"
      progressPercentage={90}
      features={[
        "Professional preferences",
        "Consultation settings",
        "Notification management",
        "Security settings",
        "Theme customization",
        "Integration preferences",
      ]}
    />
  );
}
