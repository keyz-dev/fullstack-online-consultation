"use client";

import { Upcoming } from "@/components/ui";

export default function AdminSymptomsPage() {
  return (
    <Upcoming
      title="Symptoms Management"
      description="Comprehensive symptom management system for organizing and categorizing medical symptoms used in consultations."
      expectedDate="February 2024"
      colorTheme="red"
      progressPercentage={70}
      features={[
        "Symptom database management",
        "Symptom categorization",
        "Symptom-severity mapping",
        "Symptom search and filtering",
        "Symptom statistics",
        "Integration with consultations",
      ]}
    />
  );
}
