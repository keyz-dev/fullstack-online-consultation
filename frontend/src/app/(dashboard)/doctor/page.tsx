"use client";

import { Upcoming } from "@/components/ui";

export default function DoctorOverviewPage() {
  return (
    <Upcoming
      title="Doctor Dashboard"
      description="Comprehensive dashboard for doctors to manage their practice, appointments, and patient care."
      expectedDate="March 2024"
      colorTheme="blue"
      progressPercentage={60}
      features={[
        "Practice overview",
        "Patient management",
        "Appointment scheduling",
        "Consultation tools",
        "Medical records",
        "Analytics dashboard",
      ]}
    />
  );
}
