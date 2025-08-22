"use client";

import { Upcoming } from "@/components/ui";

export default function PendingPharmacyProfilePage() {
  return (
    <Upcoming
      title="Pharmacy Profile"
      description="Profile management system for pending pharmacies to update their application information and business documents."
      expectedDate="February 2024"
      colorTheme="indigo"
      progressPercentage={90}
      features={[
        "Business information",
        "Document uploads",
        "License information",
        "Contact details",
        "Application status",
        "Document verification",
      ]}
    />
  );
}
