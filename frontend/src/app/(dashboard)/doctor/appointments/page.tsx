"use client";

import { Upcoming } from "@/components/ui";

export default function DoctorAppointmentsPage() {
  return (
    <Upcoming
      title="My Appointments"
      description="Personal appointment management system for doctors to view, schedule, and manage their patient appointments."
      expectedDate="March 2024"
      colorTheme="teal"
      progressPercentage={70}
      features={[
        "Appointment calendar view",
        "Patient appointment scheduling",
        "Appointment status management",
        "Patient information access",
        "Appointment reminders",
        "Schedule optimization",
      ]}
    />
  );
}
