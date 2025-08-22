"use client";

import { Upcoming } from "@/components/ui";

export default function AdminAppointmentsPage() {
  return (
    <Upcoming
      title="Appointments Management"
      description="Centralized appointment management system for administrators to monitor and manage all appointments across the platform."
      expectedDate="March 2024"
      colorTheme="teal"
      progressPercentage={60}
      features={[
        "All appointments overview",
        "Appointment scheduling tools",
        "Conflict resolution",
        "Appointment analytics",
        "Bulk appointment operations",
        "Appointment status tracking",
      ]}
    />
  );
}
