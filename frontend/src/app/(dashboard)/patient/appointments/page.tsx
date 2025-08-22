"use client";

import { Upcoming } from "@/components/ui";

export default function PatientAppointmentsPage() {
  return (
    <Upcoming
      title="My Appointments"
      description="Personal appointment management system for patients to view, schedule, and manage their medical appointments."
      expectedDate="March 2024"
      colorTheme="teal"
      progressPercentage={75}
      features={[
        "Appointment scheduling",
        "Doctor selection",
        "Appointment calendar",
        "Reminder notifications",
        "Appointment history",
        "Rescheduling options",
      ]}
    />
  );
}
