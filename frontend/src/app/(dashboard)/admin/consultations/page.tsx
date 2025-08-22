"use client";

import { Upcoming } from "@/components/ui";

export default function AdminConsultationsPage() {
  return (
    <Upcoming
      title="Consultations Management"
      description="Platform-wide consultation monitoring and management system for administrators to oversee all medical consultations."
      expectedDate="March 2024"
      colorTheme="purple"
      progressPercentage={55}
      features={[
        "All consultations overview",
        "Consultation monitoring",
        "Quality assurance tools",
        "Consultation analytics",
        "Dispute resolution",
        "Consultation history tracking",
      ]}
    />
  );
}
