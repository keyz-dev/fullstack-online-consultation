"use client";

import { Upcoming } from "@/components/ui";

export default function DoctorSchedulePage() {
  return (
    <Upcoming
      title="My Schedule"
      description="Personal schedule management system for doctors to set their availability and manage their working hours."
      expectedDate="March 2024"
      colorTheme="green"
      progressPercentage={75}
      features={[
        "Availability calendar",
        "Working hours management",
        "Break time scheduling",
        "Schedule optimization",
        "Conflict detection",
        "Schedule sharing",
      ]}
    />
  );
}
