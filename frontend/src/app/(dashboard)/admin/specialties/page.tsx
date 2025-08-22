"use client";

import { Upcoming } from "@/components/ui";

export default function AdminSpecialtiesPage() {
  return (
    <Upcoming
      title="Specialties Management"
      description="Manage medical specialties and categories for the platform, including adding, editing, and organizing specialty information."
      expectedDate="February 2024"
      colorTheme="green"
      progressPercentage={80}
      features={[
        "Add and edit medical specialties",
        "Specialty categorization",
        "Icon and description management",
        "Specialty statistics",
        "Doctor-specialty assignments",
        "Specialty search and filtering",
      ]}
    />
  );
}
