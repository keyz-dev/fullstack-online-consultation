"use client";

import { Upcoming } from "@/components/ui";

export default function PatientOverviewPage() {
  return (
    <Upcoming
      title="Patient Dashboard"
      description="Personal health dashboard for patients to manage their appointments, consultations, and medical information."
      expectedDate="March 2024"
      colorTheme="green"
      progressPercentage={65}
      features={[
        "Health overview",
        "Appointment management",
        "Medical history",
        "Medication tracking",
        "Doctor communication",
        "Health analytics",
      ]}
    />
  );
}
