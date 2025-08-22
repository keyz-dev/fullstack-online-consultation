"use client";

import { Upcoming } from "@/components/ui";

export default function PharmacyMedicationsPage() {
  return (
    <Upcoming
      title="Medications Management"
      description="Comprehensive medication management system for pharmacies to manage their medication inventory and catalog."
      expectedDate="March 2024"
      colorTheme="orange"
      progressPercentage={75}
      features={[
        "Medication catalog",
        "Inventory tracking",
        "Pricing management",
        "Medication information",
        "Stock alerts",
        "Supplier management",
      ]}
    />
  );
}
