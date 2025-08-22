"use client";

import { Upcoming } from "@/components/ui";

export default function PharmacySettingsPage() {
  return (
    <Upcoming
      title="Pharmacy Settings"
      description="Business settings and configuration panel for pharmacies to customize their operations and preferences."
      expectedDate="February 2024"
      colorTheme="pink"
      progressPercentage={90}
      features={[
        "Business preferences",
        "Order settings",
        "Notification management",
        "Security settings",
        "Integration preferences",
        "System configuration",
      ]}
    />
  );
}
