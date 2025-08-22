"use client";

import { Upcoming } from "@/components/ui";

export default function AdminMedicationsPage() {
  return (
    <Upcoming
      title="Medications Management"
      description="Comprehensive medication management system for administrators to oversee all medications and prescriptions across the platform."
      expectedDate="March 2024"
      colorTheme="orange"
      progressPercentage={65}
      features={[
        "Medication database management",
        "Prescription monitoring",
        "Drug interaction checking",
        "Medication analytics",
        "Compliance tracking",
        "Medication safety monitoring",
      ]}
    />
  );
}
