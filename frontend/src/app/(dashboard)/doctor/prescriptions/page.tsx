"use client";

import { Upcoming } from "@/components/ui";

export default function DoctorPrescriptionsPage() {
  return (
    <Upcoming
      title="Prescriptions"
      description="Digital prescription management system for doctors to create, manage, and send prescriptions to patients and pharmacies."
      expectedDate="March 2024"
      colorTheme="orange"
      progressPercentage={70}
      features={[
        "Digital prescription creation",
        "Medication database",
        "Dosage calculation",
        "Prescription history",
        "Pharmacy integration",
        "Patient medication tracking",
      ]}
    />
  );
}
