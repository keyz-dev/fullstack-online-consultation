"use client";

import { Upcoming } from "@/components/ui";

export default function AdminSettingsPage() {
  return (
    <Upcoming
      title="Settings"
      description="Advanced settings and configuration panel for administrators to customize platform behavior and preferences."
      expectedDate="February 2024"
      colorTheme="pink"
      progressPercentage={90}
      features={[
        "Platform configuration",
        "System preferences",
        "Security settings",
        "Notification management",
        "Theme customization",
        "Advanced options",
      ]}
    />
  );
}
