"use client";

import { Upcoming } from "@/components/ui";

export default function PatientMedicationsPage() {
  return (
    <Upcoming
      title="My Medications"
      description="Personal medication management system for patients to track and manage their prescribed medications."
      expectedDate="March 2024"
      colorTheme="orange"
      progressPercentage={80}
      features={[
        "Medication tracking",
        "Dosage reminders",
        "Medication history",
        "Side effects monitoring",
        "Refill notifications",
        "Medication interactions",
      ]}
    />
  );
}
