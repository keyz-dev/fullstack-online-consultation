"use client";

import { Upcoming } from "@/components/ui";

export default function PharmacyInventoryPage() {
  return (
    <Upcoming
      title="Inventory Management"
      description="Advanced inventory management system for pharmacies to track stock levels and manage their medication inventory."
      expectedDate="March 2024"
      colorTheme="green"
      progressPercentage={80}
      features={[
        "Stock level tracking",
        "Low stock alerts",
        "Inventory reports",
        "Stock movement history",
        "Expiry date tracking",
        "Inventory optimization",
      ]}
    />
  );
}
