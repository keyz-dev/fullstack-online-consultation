"use client";

import { Upcoming } from "@/components/ui";

export default function DoctorPatientsPage() {
  return (
    <Upcoming
      title="My Patients"
      description="Patient management system for doctors to view and manage their patient information and medical records."
      expectedDate="March 2024"
      colorTheme="blue"
      progressPercentage={75}
      features={[
        "Patient directory",
        "Medical history access",
        "Patient notes management",
        "Treatment plans",
        "Patient communication",
        "Health records tracking",
      ]}
    />
  );
}
