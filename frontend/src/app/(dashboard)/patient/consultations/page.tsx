"use client";

import { Upcoming } from "@/components/ui";

export default function PatientConsultationsPage() {
  return (
    <Upcoming
      title="My Consultations"
      description="Personal consultation management system for patients to view and manage their medical consultations."
      expectedDate="March 2024"
      colorTheme="purple"
      progressPercentage={70}
      features={[
        "Consultation history",
        "Active consultations",
        "Consultation notes",
        "Follow-up scheduling",
        "Consultation summaries",
        "Doctor communication",
      ]}
    />
  );
}
