"use client";

import { Upcoming } from "@/components/ui";

export default function PharmacyProfilePage() {
  return (
    <Upcoming
      title="Pharmacy Profile"
      description="Pharmacy profile management system to update business information and professional details."
      expectedDate="February 2024"
      colorTheme="indigo"
      progressPercentage={85}
      features={[
        "Business information",
        "Pharmacy details",
        "Operating hours",
        "Contact information",
        "License management",
        "Business documents",
      ]}
    />
  );
}
