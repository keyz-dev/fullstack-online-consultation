"use client";

import { Upcoming } from "@/components/ui";

export default function DoctorConsultationsPage() {
  return (
    <Upcoming
      title="My Consultations"
      description="Personal consultation management system for doctors to conduct and manage patient consultations."
      expectedDate="March 2024"
      colorTheme="purple"
      progressPercentage={65}
      features={[
        "Active consultations",
        "Consultation history",
        "Patient notes management",
        "Prescription creation",
        "Consultation templates",
        "Follow-up scheduling",
      ]}
    />
  );
}
