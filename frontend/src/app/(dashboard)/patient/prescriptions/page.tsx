"use client";

import { Upcoming } from "@/components/ui";

export default function PatientPrescriptionsPage() {
  return (
    <Upcoming
      title="My Prescriptions"
      description="Digital prescription management system for patients to view and manage their medical prescriptions."
      expectedDate="March 2024"
      colorTheme="green"
      progressPercentage={75}
      features={[
        "Prescription history",
        "Digital prescriptions",
        "Refill requests",
        "Pharmacy integration",
        "Prescription sharing",
        "Medication instructions",
      ]}
    />
  );
}
