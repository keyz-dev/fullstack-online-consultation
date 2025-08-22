"use client";

import { Upcoming } from "@/components/ui";

export default function PendingDoctorNotificationsPage() {
  return (
    <Upcoming
      title="Notifications"
      description="Notification center for pending doctors to stay updated on their application status and important updates."
      expectedDate="February 2024"
      colorTheme="blue"
      progressPercentage={95}
      features={[
        "Application status updates",
        "Document verification alerts",
        "Interview notifications",
        "Approval notifications",
        "Email notifications",
        "Notification preferences",
      ]}
    />
  );
}
