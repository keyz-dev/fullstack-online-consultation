"use client";

import { Upcoming } from "@/components/ui";

export default function DoctorSymptomsPage() {
  return (
    <Upcoming
      title="Symptoms Database"
      description="Comprehensive symptoms database for doctors to reference and use during patient consultations and diagnosis."
      expectedDate="March 2024"
      colorTheme="red"
      progressPercentage={80}
      features={[
        "Symptoms search and filtering",
        "Symptom categorization",
        "Symptom-severity mapping",
        "Diagnosis assistance",
        "Symptom history tracking",
        "Medical reference tools",
      ]}
    />
  );
}
